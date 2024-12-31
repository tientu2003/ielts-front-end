import {
    Box,
    SimpleGrid,
    Card,
    Heading,
    Center,
    Text,
    Stack,
    Button,
    HStack, AbsoluteCenter
} from "@chakra-ui/react";
import {
    ProgressCircleRing,
    ProgressCircleRoot,
    ProgressCircleValueText
} from "@/components/ui/progress-circle"
import {getScoreColor,getScoreDescription} from "@/components/util/ielts-score";
import { LuInfo } from "react-icons/lu";
import {
    HoverCardArrow,
    HoverCardContent,
    HoverCardRoot,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import {ProgressBar, ProgressRoot, ProgressValueText} from "@/components/ui/progress";
import Link from "next/link";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
const ReadingPracticeResult = async ({params,}:
                                     { params: Promise<{ id: string }>})  =>{
    const id = (await params).id
    // Fetch Data here
    const session = await getServerSession(authOptions)

    if(!session){
        return (<Box>
            <AbsoluteCenter>
                <Heading>
                    Please login to access the practice exam!!
                </Heading>
            </AbsoluteCenter>
        </Box>)

    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_READING_SERVICE_URL}/api/reading/user/${session.decodedToken?.sub}/answer/${id}`, {
            method: 'GET',  // Change to 'POST', 'PUT', or other methods as needed
            headers: {
                'Content-Type': 'application/json',  // Ensure the server knows you're sending JSON
                'Authorization': `Bearer ${session.access_token}`,  // Add Bearer token to the request headers
            }
        });
        const data = await response.json()

        const responseQuestion = await fetch(`${process.env.NEXT_PUBLIC_READING_SERVICE_URL}/api/reading/data/${data?.answerData?.testId}`,{
            method: 'GET',  // Change to 'POST', 'PUT', or other methods as needed
                headers: {
                'Content-Type': 'application/json',  // Ensure the server knows you're sending JSON
                    'Authorization': `Bearer ${session.access_token}`,  // Add Bearer token to the request headers
            }
        });

        const passageData = await responseQuestion.json()


        const passageQuestionNumber:number[] = [] // 13 for passage 1, 14 for passage 2 , 13 for passsage 3
        passageData?.passages.forEach((passage:any) => {
            passageQuestionNumber.push(passage?.numberOfQuestions as number)
        })

        const correctAnswersPerPassage: number[] = [];
        let index = 0;

        const reviewResponse =  await fetch(`${process.env.NEXT_PUBLIC_READING_SERVICE_URL}/api/reading/user/${session.decodedToken?.sub}/review`, {
            method: 'GET',  // Change to 'POST', 'PUT', or other methods as needed
            headers: {
                'Content-Type': 'application/json',  // Ensure the server knows you're sending JSON
                'Authorization': `Bearer ${session.access_token}`,  // Add Bearer token to the request headers
            }
        });

        const averageData = await reviewResponse.json()

        function convertToIELTSBand(score:number) {
            // Round to the nearest 0.5
            return Math.round(score * 2) / 2;
        }
        const averageScore = convertToIELTSBand(averageData?.averageScore)

        // Processing Data
        passageQuestionNumber.forEach((questions, passageIndex) => {
            const correctAnswers = data.userAnswers.slice(index, index + questions).filter((answer:any) => answer.check).length;
            correctAnswersPerPassage.push(correctAnswers);
            index += questions;
        });
        const correctAnswers = data.userAnswers.filter((answer:any) => answer.check).length;
        const totalQuestions = data.userAnswers.length;
        const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
        const bandScoreDescription = getScoreDescription(data.score);
        const averageScoreDescription = getScoreDescription(averageScore);
        const bandScoreColor = getScoreColor(data.score);
        const accuracyScoreColor = getScoreColor(accuracy * 9 / 100);
        const averageScoreColor = getScoreColor(averageScore);

        const renderPassageAnswers = (startIdx: number, endIdx: number) => {
            return data.userAnswers.slice(startIdx, endIdx).map((answer:any, index:any) => {
                const correctAnswer = data.answerData.answers[startIdx + index];
                const isCorrect = answer.check;

                return (
                    <Text key={index} color={isCorrect ? "green.500" : "red.500"}>
                        Q{startIdx + index + 1}: {answer.userAnswer || "No Answer"}{" "}
                        {!isCorrect && `→ Correct: ${correctAnswer}`}
                    </Text>
                );
            });
        };

        return (
            <Box pt={5} pl={20} pr={20}>
                <SimpleGrid columns={{sm: 1, md: 3}} gap={20}>
                    <Card.Root>
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
                                    <Text fontSize={'sm'}>{bandScoreDescription?.readingRecommendation}</Text>
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
                    <Card.Root>
                        <Card.Header>
                            <HStack justifyContent="space-between" pr={5}>
                                <Heading size={'2xl'}>Accuracy</Heading>
                                <HoverCardRoot>
                                    <HoverCardTrigger><LuInfo/> </HoverCardTrigger>
                                    <HoverCardContent>
                                        <HoverCardArrow/>
                                        <Text>Accuracy in the IELTS Reading test is the percentage of correct answers
                                            out
                                            of the total questions in each passage or the section as a whole. It
                                            reflects
                                            a candidate's reading comprehension,attention to detail, and ability to
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
                                <ProgressCircleRoot size={"xl"} value={accuracy} colorPalette={accuracyScoreColor}>
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
                    <Card.Root>
                        <Card.Header>
                            <HStack justifyContent="space-between" pr={5}>
                                <Heading size={'2xl'}>Average Score</Heading>
                                <HStack>
                                    <HoverCardRoot>
                                        <HoverCardTrigger><LuInfo/> </HoverCardTrigger>
                                        <HoverCardContent>
                                            <HoverCardArrow/>
                                            <Text>{averageScoreDescription?.details}</Text>
                                        </HoverCardContent>
                                    </HoverCardRoot>
                                    <Link href={'/progress'}>
                                        <Button variant={'ghost'} color={'blue.500'}>See Detail</Button>
                                    </Link>
                                </HStack>
                            </HStack>
                        </Card.Header>
                        <Card.Body>
                            <Center justifyContent={'space-between'} pr={10} gap={5}>
                                <Stack>
                                    <Text fontWeight="semibold" color={averageScoreColor}
                                          fontSize={'xl'}>{averageScoreDescription?.title}</Text>
                                    <Text fontSize={'sm'}>{averageScoreDescription?.readingRecommendation}</Text>
                                </Stack>
                                <ProgressCircleRoot size={"xl"} value={(averageScore / 9) * 100}
                                                    colorPalette={averageScoreColor}>
                                    <ProgressCircleValueText>
                                        <Heading color={averageScoreColor} fontSize={30}>
                                            {averageScore}
                                        </Heading>
                                    </ProgressCircleValueText>
                                    <ProgressCircleRing/>
                                </ProgressCircleRoot>
                            </Center>
                        </Card.Body>
                    </Card.Root>
                    <Stack p={5} borderRadius={'md'} borderWidth={1}>
                        <Heading>Passage 1</Heading>
                        {renderPassageAnswers(0, passageQuestionNumber[0])}
                    </Stack>

                    <Stack p={5} borderRadius={'md'} borderWidth={1}>
                        <Heading>Passage 2</Heading>
                        {renderPassageAnswers(
                            passageQuestionNumber[0],
                            passageQuestionNumber[0] + passageQuestionNumber[1]
                        )}
                    </Stack>
                    <Stack p={5} borderRadius={'md'} borderWidth={1}>
                        <Heading>Passage 3</Heading>
                        {renderPassageAnswers(
                            passageQuestionNumber[0] + passageQuestionNumber[1],
                            totalQuestions
                        )}
                    </Stack>
                </SimpleGrid>


            </Box>
        );
    }catch (e){
        return <AbsoluteCenter>
            Internal Error
        </AbsoluteCenter>
    }
}




export default ReadingPracticeResult;