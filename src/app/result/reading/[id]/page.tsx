import {
    Box,
    SimpleGrid,
    Card,
    Heading,
    Center,
    Text,
    Stack,
    HStack, AbsoluteCenter, Tabs, GridItem, Accordion, Flex
} from "@chakra-ui/react";
import {
    ProgressCircleRing,
    ProgressCircleRoot,
    ProgressCircleValueText
} from "@/components/ui/progress-circle"
import {IoIosArrowDown} from "react-icons/io";
import {getScoreColor, getScoreDescription} from "@/components/util/ielts-score";
import {LuInfo} from "react-icons/lu";
import {
    HoverCardArrow,
    HoverCardContent,
    HoverCardRoot,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import {ProgressBar, ProgressRoot} from "@/components/ui/progress";
import {getServerSession} from "next-auth";
import {authOptions} from "@/components/util/auth-options";
import TopicsDisplay from "@/components/my-ui/common/TopicsDisplay";
import HandleUnauthorized from "@/components/util/HandleUnauthorized";
import PassageComponent from "@/components/my-ui/reading/PassageComponent";

const ReadingPracticeResult = async ({params,}:
                                     { params: Promise<{ id: string }> }) => {
    const id = (await params).id
    // Fetch Data here
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_READING_SERVICE_URL}/api/reading/user/answer/${id}`, {
            method: 'GET',  // Change to 'POST', 'PUT', or other methods as needed
            headers: {
                'Content-Type': 'application/json',  // Ensure the server knows you're sending JSON
                'Authorization': `Bearer ${session.access_token}`,  // Add Bearer token to the request headers
            }
        });

        if (response.status === 401) {
            return <AbsoluteCenter>
                    Login is expired, please login again.
                <HandleUnauthorized />
            </AbsoluteCenter>
        }

        const data = await response.json()

        const responseQuestion = await fetch(`${process.env.NEXT_PUBLIC_READING_SERVICE_URL}/api/reading/data/${data?.answer?.testId}`, {
            method: 'GET',  // Change to 'POST', 'PUT', or other methods as needed
            headers: {
                'Content-Type': 'application/json',  // Ensure the server knows you're sending JSON
                'Authorization': `Bearer ${session.access_token}`,  // Add Bearer token to the request headers
            }
        });

        const passageData = await responseQuestion.json()


        const passageQuestionNumber: number[] = data.answer.numberQuestions;
        const correctAnswersPerPassage: number[] = [];
        let index = 0;

        // Processing Data
        passageQuestionNumber.forEach((questions) => {
            const correctAnswers = data.results.slice(index, index + questions).filter((answer: any) => answer.check).length;
            correctAnswersPerPassage.push(correctAnswers);
            index += questions;
        });
        const correctAnswers = data.results.filter((answer: any) => answer.check).length;
        const totalQuestions = data.results.length;
        const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
        const bandScoreDescription = getScoreDescription(data.score);
        const bandScoreColor = getScoreColor(data.score);
        const accuracyScoreColor = getScoreColor(accuracy * 9 / 100);

        return (
            <Box pt={'1%'} pl={'5%'} pr={'5%'}>

                <Accordion.Root collapsible defaultValue={[""]} variant={'enclosed'}>

                    <Accordion.Item value="is_open">

                        <SimpleGrid columns={{sm: 1, md: 7}} gap={'2.5%'}>
                            <GridItem colSpan={4} minH={'100%'} p={'2%'}>
                                <Card.Root shadow={'md'} minH={'100%'} p={'2%'}>
                                    <Card.Header>
                                        <HStack justifyContent="space-between" pr={5}>
                                            <Heading size={'4xl'}>Reading Exam Result</Heading>
                                        </HStack>
                                    </Card.Header>
                                    <Card.Body>
                                        <Stack>
                                            <Text fontWeight="semibold" color={bandScoreColor} fontSize={'xl'}>
                                                Exam Name: {passageData.name}
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
                            <GridItem colSpan={3} p={'2%'}>
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
                                                    fontSize={'sm'}>{bandScoreDescription?.readingRecommendation}</Text>
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
                                <Card.Root shadow={'md'} mt={'2%'}>
                                    <Card.Header>
                                        <HStack justifyContent="space-between" pr={5}>
                                            <Heading size={'2xl'}>Accuracy</Heading>
                                            <HoverCardRoot>
                                                <HoverCardTrigger><LuInfo/> </HoverCardTrigger>
                                                <HoverCardContent>
                                                    <HoverCardArrow/>
                                                    <Text>Accuracy in the IELTS Reading test is the percentage of
                                                        correct
                                                        answers
                                                        out
                                                        of the total questions in each passage or the section as a
                                                        whole. It
                                                        reflects
                                                        a candidate's reading comprehension,attention to detail, and
                                                        ability to
                                                        interpret
                                                        information effectively.</Text>
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
                                                {correctAnswersPerPassage.map((data, index) => {
                                                    const value = data / passageQuestionNumber[index] * 100
                                                    return <HStack key={index}>
                                                        <Heading size={'md'}>Passage {index + 1}</Heading>
                                                        <ProgressRoot
                                                            width="120px"
                                                            value={value}
                                                            colorPalette={value < 35 ? 'red' : value < 70 ? 'blue' : 'green'}
                                                            variant="outline"
                                                        >
                                                            <ProgressBar/>
                                                        </ProgressRoot>
                                                        <Text>{data}/{passageQuestionNumber[index]}</Text>
                                                    </HStack>
                                                })}
                                            </Box>
                                            <ProgressCircleRoot size={"xl"} value={accuracy}
                                                                colorPalette={accuracyScoreColor}>
                                                <ProgressCircleValueText>
                                                    <Heading color={accuracyScoreColor} fontSize={20}>
                                                        {accuracy}%
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
                                        <Tabs.Root variant="enclosed" defaultValue={'first'}>
                                            <Tabs.List mt={2}>
                                                <Tabs.Trigger value="first" color={'blue.600'} fontWeight={'bold'}>Passage 1</Tabs.Trigger>
                                                <Tabs.Trigger value="second" color={'blue.600'} fontWeight={'bold'}>Passage 2</Tabs.Trigger>
                                                <Tabs.Trigger value="third" color={'blue.600'} fontWeight={'bold'}>Passage 3</Tabs.Trigger>
                                            </Tabs.List>
                                            <Tabs.Content value="first">
                                                <PassageComponent results={data.results} answers={data.answer.answers} data={passageData.passages[0]} startIndex={0} />
                                            </Tabs.Content>
                                            <Tabs.Content value="second">
                                                <PassageComponent results={data.results} answers={data.answer.answers} data={passageData.passages[1]} startIndex={data.answer.numberQuestions[0]} />
                                            </Tabs.Content>
                                            <Tabs.Content value="third">
                                                <PassageComponent results={data.results} answers={data.answer.answers} data={passageData.passages[2]} startIndex={data.answer.numberQuestions[0] + data.answer.numberQuestions[1]} />
                                            </Tabs.Content>
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
        console.error(e)
        return <AbsoluteCenter>
            Internal Error
        </AbsoluteCenter>
    }
}


export default ReadingPracticeResult;