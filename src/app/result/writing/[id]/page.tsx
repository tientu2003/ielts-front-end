import {
    AbsoluteCenter,
    Box,
    Card,
    GridItem,
    Heading,
    SimpleGrid,
    Text,
    Textarea,
    Badge,
    Accordion,
    HStack,
    Grid, Flex,
    Center, VStack,
} from "@chakra-ui/react";
import ContextPart from "@/components/my-ui/writing/context-part";
import {getServerSession} from "next-auth";
import {authOptions} from "@/components/util/auth-options";
import HandleUnauthorized from "@/components/util/HandleUnauthorized";

import React from "react";
import {IoIosArrowDown} from "react-icons/io";
import TopicsDisplay from "@/components/my-ui/common/TopicsDisplay";
import {getScoreColor} from "@/components/util/ielts-score";
import {ProgressCircleRing, ProgressCircleRoot, ProgressCircleValueText} from "@/components/ui/progress-circle";


interface ScoreItem {
    score: number;
    label: string;
}

const ScoreItem = ({score, label}: ScoreItem) => {
    const isHigh = score >= 8;
    const isMedium = score >= 6.5 && score < 8;
    const isLow = score < 6.5 && score >= 5;

    let colorScheme = "red";
    if (isHigh) colorScheme = "green";
    else if (isMedium) colorScheme = "blue";
    else if (isLow) colorScheme = "orange";
    return (
        <HStack justifyContent="space-between" w="100%" p={1}>
            <Badge colorPalette={colorScheme} px={3} py={1} borderRadius="md" fontSize="md">
                {score}
            </Badge>
            <Text flex="1" ml={2}>
                {label}
            </Text>
        </HStack>
    );
};

interface SessionProps {
    title: string,
    overallScore: number,
    items: ScoreItem[]
}

const Section = ({title, overallScore, items}: SessionProps) => {
    const isHigh = overallScore >= 8;
    const isMedium = overallScore >= 6.5 && overallScore < 8;
    const isLow = overallScore < 6.5 && overallScore >= 5;
    let colorScheme = "red";
    if (isHigh) colorScheme = "green";
    else if (isMedium) colorScheme = "blue";
    else if (isLow) colorScheme = "orange";
    return <Card.Root shadow={'md'} minH={'100%'}>
        <Card.Body>
            <Box p={3} w="100%">
                <Heading size="xl" color={colorScheme} fontWeight={'bold'}>
                    {title.toUpperCase()}: {overallScore.toFixed(1)}
                </Heading>
                {items.map((item, idx) => (
                    <ScoreItem key={idx} score={item.score} label={item.label}/>
                ))}
            </Box>
        </Card.Body>
    </Card.Root>
};


const WritingExamResult = async ({params,}:
                                 { params: Promise<{ id: string }> }) => {
    const id = (await params).id
    const session = await getServerSession(authOptions)
    if (!session) {
        return (<Box>
            <AbsoluteCenter>
                <Heading>
                    Please login to access the practice exam!!
                </Heading>
            </AbsoluteCenter>
        </Box>)
    }

    const countWords = (value: string) => {
        // Trim the text and split by whitespace
        const words = value.trim().split(/\s+/);
        return value.trim() === "" ? 0 : words.length;
    };

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_WRITING_SERVICE_URL}/api/writing/user/answer/${id}`, {
            method: 'GET',  // Change to 'POST', 'PUT', or other methods as needed
            headers: {
                'Content-Type': 'application/json',  // Ensure the server knows you're sending JSON
                'Authorization': `Bearer ${session.access_token}`,  // Add Bearer token to the request headers
            }
        });

        if (response.status === 401) {
            return <AbsoluteCenter>
                Login is expired, please login again.
                <HandleUnauthorized/>
            </AbsoluteCenter>
        }

        const data = await response.json()

        const answer: string = data.userAnswer.join("\n");
        const bandScoreColor = getScoreColor(data.finalScore);

        const sections = [
            {
                title: "Coherence and Cohesion",
                overallScore: data.scores.cc,
                items: [
                    {score: data.scores.ls, label: "Logical structure"},
                    {score: data.scores.icp, label: "Introduction & conclusion present"},
                    {score: data.scores.smp, label: "Supported main points"},
                    {score: data.scores.alw, label: "Accurate linking words"},
                    {score: data.scores.vilw, label: "Variety in linking words"},
                ],
            },
            {
                title: "Task Achievement",
                overallScore: data.scores.ta,
                items: [
                    {score: data.scores.cr, label: "Complete response"},
                    {score: data.scores.cci, label: "Clear & comprehensive ideas"},
                    {score: data.scores.rse, label: "Relevant & specific examples"}
                ],
            },
            {
                title: "Lexical Resource",
                overallScore: data.scores.lr,
                items: [
                    {score: data.scores.vv, label: "Varied vocabulary"},
                    {score: data.scores.aswf, label: "Accurate spelling & word formation"},
                ],
            },
            {
                title: "Grammatical Range",
                overallScore: data.scores.gr,
                items: [
                    {score: data.scores.mcss, label: "Mix of complex & simple sentences"},
                    {score: data.scores.ccg, label: "Clear and correct grammar"},
                ],
            },

        ];

        return <Box pt={'1%'} pl={'5%'} pr={'5%'}>
            <Grid columns={2} gap={'2.5%'}>
                <GridItem colSpan={2}>
                    <Center>
                        <Card.Root shadow={'md'} minH={'100%'} w={'50%'}>
                            <Card.Header>
                                <HStack justifyContent="space-between" pr={5}>
                                    <Heading size={'4xl'}>Writing Exam Result</Heading>
                                </HStack>
                            </Card.Header>
                            <Card.Body>
                                <HStack justifyContent="space-between" pr={5}>
                                    <Box>
                                        <Text fontWeight="semibold" fontSize={'xl'} color={bandScoreColor}>
                                            Exam Name: {data.name}
                                        </Text>
                                        <Text fontWeight="semibold" fontSize={'xl'} color={'red'}>
                                            Task: {data.task}
                                        </Text>
                                        <Flex fontWeight="semibold" fontSize={'xl'}>
                                            <Text mr={2}>Topics: </Text>
                                            <TopicsDisplay topics={data.topic} fontSize={'xl'}/>
                                        </Flex>
                                        <Text fontWeight="semibold" color={'gray'} fontSize={'xl'}>
                                            User Name: {session.decodedToken?.preferred_username}
                                        </Text>
                                        <Text fontWeight="semibold" color={'gray'} fontSize={'md'}>
                                            User Id: {session.decodedToken?.sub}
                                        </Text>
                                    </Box>
                                    <VStack>
                                        <ProgressCircleRoot size={"xl"} value={(data.finalScore / 9) * 100}
                                                            colorPalette={bandScoreColor}>
                                            <ProgressCircleValueText>
                                                <Heading color={bandScoreColor} fontSize={30}>
                                                    {data.finalScore}
                                                </Heading>
                                            </ProgressCircleValueText>
                                            <ProgressCircleRing/>
                                        </ProgressCircleRoot>
                                        <Text fontWeight="semibold" fontSize={'xl'}>
                                            Overall Score
                                        </Text>
                                    </VStack>

                                </HStack>

                            </Card.Body>
                        </Card.Root>
                    </Center>

                </GridItem>
                {sections.map((section, idx) => (
                    <Section key={idx} {...section} />
                ))}
            </Grid>
            <Accordion.Root collapsible defaultValue={[""]} variant={'enclosed'} mt={'2.5%'}>
                <Accordion.Item value="is_open">
                    <Accordion.ItemTrigger>
                        <Flex
                            justify="space-between"
                            alignItems="center"
                            width={'full'}
                            borderColor={'blue.500'}
                            borderWidth={1}
                            borderRadius={'md'}
                            p={2}
                            bg={'blue.50'}
                            _dark={{
                                bg: 'blue.900',
                                _hover: {bg: 'blue.800'}
                            }}
                            _light={{
                                bg: 'blue.50',
                                _hover: {bg: 'blue.100'}
                            }}
                            cursor={'pointer'}
                            transition={'all 0.2s'}
                        >
                            <Text colorPalette={'blue'}>
                                Click here to see detail
                            </Text>
                            <Accordion.ItemIndicator>
                                <IoIosArrowDown/>
                            </Accordion.ItemIndicator>
                        </Flex>
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                        <Accordion.ItemBody>
                            <SimpleGrid columns={2} height={'90vh'} gap={5}>
                                <GridItem colSpan={1}>
                                    <Box mt={"2.5vh"}
                                         h="85vh">
                                        <ContextPart task={data.task} context={data.context} url={data.diagram_url}
                                                     name={data.name}/>
                                    </Box>
                                </GridItem>
                                <GridItem colSpan={1}>
                                    <Box mt={"2.5vh"}
                                         h="85vh">
                                        <Card.Root h={'100%'} shadow={'lg'}>
                                            <Card.Header>
                                                <Text textAlign={'right'} mr={6}>
                                                    Words: {countWords(answer)}
                                                </Text>
                                            </Card.Header>
                                            <Card.Body>
                                                <Textarea placeholder="Start writing your essay here..."
                                                          h={'100%'}
                                                          readOnly={true}
                                                          value={answer}
                                                />
                                            </Card.Body>
                                        </Card.Root>
                                    </Box>
                                </GridItem>
                            </SimpleGrid>
                        </Accordion.ItemBody>
                    </Accordion.ItemContent>
                </Accordion.Item>
            </Accordion.Root>
        </Box>

    } catch (e) {
        console.error(e)
        return <AbsoluteCenter>
            Internal Error
        </AbsoluteCenter>
    }
}

export default WritingExamResult;