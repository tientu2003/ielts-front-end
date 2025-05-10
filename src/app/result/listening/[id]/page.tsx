import {getServerSession} from "next-auth";
import {authOptions} from "@/components/util/auth-options"; // Import jsonwebtoken to decode the JWT
import {
    AbsoluteCenter,
    Box,
    Card,
    Center, GridItem,
    Heading,
    HStack,
    SimpleGrid,
    Stack,
    Accordion,
    Text, Flex, Tabs
} from "@chakra-ui/react";
import {getListeningScoreDescription, getScoreColor} from "@/components/util/ielts-score";
import {HoverCardArrow, HoverCardContent, HoverCardRoot, HoverCardTrigger} from "@/components/ui/hover-card";
import {LuInfo} from "react-icons/lu";
import {ProgressCircleRing, ProgressCircleRoot, ProgressCircleValueText} from "@/components/ui/progress-circle";
import {ProgressBar, ProgressRoot} from "@/components/ui/progress";
import React from "react";
import HandleUnauthorized from "@/components/util/HandleUnauthorized";
import TopicsDisplay from "@/components/my-ui/common/TopicsDisplay";
import {IoIosArrowDown} from "react-icons/io";
import {RecordingComponent} from "@/components/my-ui/listening/recording-component";


const ListeningPracticeResult = async ({params,}:
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

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_LISTENING_SERVICE_URL}/api/listening/user/answer/${id}`, {
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
        } else if (response.status === 404) {
            return <AbsoluteCenter>
                Reading-Service is not available, please try again later. Contact administrator if the problem persists.
            </AbsoluteCenter>
        }

        const data = await response.json()

        const bandScoreDescription = getListeningScoreDescription(data.score);
        const bandScoreColor = getScoreColor(data.score);

        const {accuracies, averageAccuracy} = calculateAverageAccuracy(data);

        const accuracyScoreColor = getScoreColor(averageAccuracy)
        const recordingQuestionNumber = data?.answer?.numberQuestions


        const listData = await fetch(`${process.env.NEXT_PUBLIC_LISTENING_SERVICE_URL}/api/listening/data/${data.answer.id}`, {
            method: 'GET',  // Change to 'POST', 'PUT', or other methods as needed
            headers: {
                'Content-Type': 'application/json',  // Ensure the server knows you're sending JSON
                'Authorization': `Bearer ${session.access_token}`,  // Add Bearer token to the request headers
            }
        });
        const listeningExam = await listData.json()

        return (
            <Box pt={'1%'} pl={'5%'} pr={'5%'}>

                <Accordion.Root collapsible defaultValue={[""]} variant={'enclosed'}>
                    <Accordion.Item value="is_open">
                        <SimpleGrid columns={{sm: 1, md: 7}} gap={'2.5%'}>
                            <GridItem colSpan={4} minH={'100%'} p={5}>
                                <Card.Root shadow={'md'} minH={'100%'} p={5}>
                                    <Card.Header>
                                        <HStack justifyContent="space-between" pr={5}>
                                            <Heading size={'4xl'}>Listening Exam Result</Heading>
                                        </HStack>
                                    </Card.Header>
                                    <Card.Body>
                                        <Stack>
                                            <Text fontWeight="semibold" color={bandScoreColor} fontSize={'xl'}>
                                                Exam Name: {listeningExam.examName}
                                            </Text>
                                            <Text fontWeight="semibold" fontSize={'xl'}>
                                                Date Taken: {new Date(data.date).toLocaleString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                            </Text>
                                            <Flex fontWeight="semibold" fontSize={'xl'}>
                                                <Text mr={2}>Topics: </Text>
                                                <TopicsDisplay topics={data.answer.topics} fontSize={'xl'}/>
                                            </Flex>
                                            <Text fontWeight="semibold" color={'gray'} fontSize={'xl'}>
                                                User Name: {session.decodedToken?.preferred_username}
                                            </Text>

                                            <Text fontWeight="semibold" color={'gray'} fontSize={'md'}>
                                                User Id: {session.decodedToken?.sub}
                                            </Text>

                                        </Stack>
                                    </Card.Body>
                                    <Card.Footer>
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
                                    </Card.Footer>
                                </Card.Root>
                            </GridItem>
                            <GridItem colSpan={3} p={5}>
                                <Card.Root shadow={'md'}>
                                    <Card.Header>
                                        <HStack justifyContent="space-between" pr={5}>
                                            <Heading size={'2xl'}>Band Score</Heading>
                                            <HoverCardRoot>
                                                <HoverCardTrigger><LuInfo/> </HoverCardTrigger>
                                                <HoverCardContent>
                                                    <HoverCardArrow/>
                                                    <Text>{bandScoreDescription?.details}</Text>
                                                </HoverCardContent>
                                            </HoverCardRoot>
                                        </HStack>
                                    </Card.Header>
                                    <Card.Body>
                                        <Center justifyContent={'space-between'} pr={10} gap={5}>
                                            <Stack>
                                                <Text fontWeight="semibold" color={bandScoreColor}
                                                      fontSize={'xl'}>{bandScoreDescription?.title}</Text>
                                                <Text
                                                    fontSize={'sm'}>{bandScoreDescription?.listeningRecommendation}</Text>
                                            </Stack>
                                            <ProgressCircleRoot size={"xl"} value={(data.score / 9) * 100}
                                                                colorPalette={bandScoreColor}>
                                                <ProgressCircleValueText>
                                                    <Heading color={bandScoreColor} fontSize={30}>
                                                        {data.score}
                                                    </Heading>
                                                </ProgressCircleValueText>
                                                <ProgressCircleRing/>
                                            </ProgressCircleRoot>
                                        </Center>
                                    </Card.Body>
                                </Card.Root>
                                <Card.Root shadow={'md'} mt={5}>
                                    <Card.Header>
                                        <HStack justifyContent="space-between" pr={5}>
                                            <Heading size={'2xl'}>Accuracy</Heading>
                                            <HoverCardRoot>
                                                <HoverCardTrigger><LuInfo/> </HoverCardTrigger>
                                                <HoverCardContent>
                                                    <HoverCardArrow/>
                                                    <Text>
                                                        Accuracy in the IELTS Listening test is the percentage of
                                                        correct answers
                                                        out of the total questions in each section or the test as a
                                                        whole. It reflects
                                                        a candidate's ability to comprehend spoken English, attention to
                                                        detail, and capacity
                                                        to interpret information effectively from audio recordings.
                                                    </Text>
                                                </HoverCardContent>
                                            </HoverCardRoot>
                                        </HStack>
                                    </Card.Header>
                                    <Card.Body>
                                        <Center justifyContent={'space-between'} pr={10}>
                                            <Box>
                                                <Text mb={2}>
                                                    The percentage of correct answer:
                                                </Text>
                                                {accuracies.map((data, index) => {
                                                    const value = data / recordingQuestionNumber[index] * 100
                                                    return <HStack key={index}>
                                                        <Heading size={'md'}>Recording {index + 1}</Heading>
                                                        <ProgressRoot
                                                            width="120px"
                                                            value={value}
                                                            colorPalette={value < 35 ? 'red' : value < 70 ? 'blue' : 'green'}
                                                            variant="outline"
                                                        >
                                                            <ProgressBar/>
                                                        </ProgressRoot>
                                                        <Text>{data}/{recordingQuestionNumber[index]}</Text>
                                                    </HStack>
                                                })}
                                            </Box>
                                            <ProgressCircleRoot size={"xl"} value={averageAccuracy}
                                                                colorPalette={accuracyScoreColor}>
                                                <ProgressCircleValueText>
                                                    <Heading color={accuracyScoreColor} fontSize={20}>
                                                        {averageAccuracy}%
                                                    </Heading>
                                                </ProgressCircleValueText>
                                                <ProgressCircleRing/>
                                            </ProgressCircleRoot>
                                        </Center>
                                    </Card.Body>
                                </Card.Root>
                            </GridItem>
                        </SimpleGrid>
                        <Accordion.ItemContent>
                            <Accordion.ItemBody>
                                <Card.Root shadow={'md'} mt={'2%'}>
                                    <Card.Body>
                                        <Tabs.Root variant="enclosed" defaultValue={'0'}>
                                            <Tabs.List mt={2}>
                                                <Tabs.Trigger value="0" color={'blue.600'} fontWeight={'bold'}>Recording 1</Tabs.Trigger>
                                                <Tabs.Trigger value="1" color={'blue.600'} fontWeight={'bold'}>Recording 2</Tabs.Trigger>
                                                <Tabs.Trigger value="2" color={'blue.600'} fontWeight={'bold'}>Recording 3</Tabs.Trigger>
                                                <Tabs.Trigger value="3" color={'blue.600'} fontWeight={'bold'}>Recording 4</Tabs.Trigger>
                                            </Tabs.List>

                                            {[0, 1, 2, 3].map((index: number) => <Tabs.Content key={index}
                                                                                               value={index.toString()}>
                                               <RecordingComponent data={listeningExam.recording[index]} answers={data.answer.answers} results={data.results} session={index + 1} />
                                            </Tabs.Content>)}
                                        </Tabs.Root>
                                    </Card.Body>
                                </Card.Root>
                            </Accordion.ItemBody>
                        </Accordion.ItemContent>
                    </Accordion.Item>
                </Accordion.Root>
            </Box>
        );
    } catch (e) {
        return <AbsoluteCenter>
            Internal Error
        </AbsoluteCenter>
    }

}

function calculateAverageAccuracy(data: any) {
    const answer = data.answer;
    const results = data.results;
    const numberQuestions = answer.numberQuestions;

    let totalCorrect = 0;
    let questionIndex = 0;
    const accuracies = [];

    // Calculate accuracy for each section
    for (let i = 0; i < numberQuestions.length; i++) {
        const sectionQuestions = numberQuestions[i];
        const sectionResults = results.slice(questionIndex, questionIndex + sectionQuestions);

        // Count correct answers in the section
        const correctInSection = sectionResults.filter((result: any) => result.check).length;
        totalCorrect += correctInSection;

        accuracies.push(correctInSection);

        questionIndex += sectionQuestions;

    }
    const averageAccuracy = totalCorrect / 40 * 100

    return {
        accuracies,
        averageAccuracy,
    };
}

export default ListeningPracticeResult