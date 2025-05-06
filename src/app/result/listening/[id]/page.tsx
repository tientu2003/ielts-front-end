import {getServerSession} from "next-auth";
import {authOptions} from "@/components/util/auth-options"; // Import jsonwebtoken to decode the JWT
import {
    AbsoluteCenter,
    Box,
    Button,
    Card,
    Center, GridItem,
    Heading,
    HStack,
    SimpleGrid,
    Stack,
    Text,
    Collapsible
} from "@chakra-ui/react";
import {getListeningScoreDescription, getScoreColor} from "@/components/util/ielts-score";
import {HoverCardArrow, HoverCardContent, HoverCardRoot, HoverCardTrigger} from "@/components/ui/hover-card";
import {LuInfo} from "react-icons/lu";
import {ProgressCircleRing, ProgressCircleRoot, ProgressCircleValueText} from "@/components/ui/progress-circle";
import {ProgressBar, ProgressRoot} from "@/components/ui/progress";
import Link from "next/link";
import React from "react";
import AudioPlayer from "@/components/my-ui/listening/audio-player";


const ListeningPracticeResult =  async ({params,}:
                                        { params: Promise<{ id: string }>})  =>{
    const id = (await params).id
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_LISTENING_SERVICE_URL}/api/listening/user/answer/${id}`, {
            method: 'GET',  // Change to 'POST', 'PUT', or other methods as needed
            headers: {
                'Content-Type': 'application/json',  // Ensure the server knows you're sending JSON
                'Authorization': `Bearer ${session.access_token}`,  // Add Bearer token to the request headers
            }
        });
        const data = await response.json()

        const bandScoreDescription = getListeningScoreDescription(data.score);
        const bandScoreColor = getScoreColor(data.score);

        const {accuracies, averageAccuracy} = calculateAverageAccuracy(data);

        const accuracyScoreColor = getScoreColor(averageAccuracy)
        const recordingQuestionNumber = data?.answer?.numberQuestions
        const reviewResponse =  await fetch(`${process.env.NEXT_PUBLIC_LISTENING_SERVICE_URL}/api/listening/user/summary`, {
            method: 'GET',  // Change to 'POST', 'PUT', or other methods as needed
            headers: {
                'Content-Type': 'application/json',  // Ensure the server knows you're sending JSON
                'Authorization': `Bearer ${session.access_token}`,  // Add Bearer token to the request headers
            }
        });

        const summaryData = await reviewResponse.json()

        function convertToIELTSBand(score:number) {
            // Round to the nearest 0.5
            return Math.round(score * 2) / 2;
        }
        const averageScore = convertToIELTSBand(summaryData.averageScore)

        const averageScoreColor = getScoreColor(averageScore)
        const averageScoreDescription = getListeningScoreDescription(averageScore)

        const listData =  await fetch(`${process.env.NEXT_PUBLIC_LISTENING_SERVICE_URL}/api/listening/data/${data.answer.id}`, {
            method: 'GET',  // Change to 'POST', 'PUT', or other methods as needed
            headers: {
                'Content-Type': 'application/json',  // Ensure the server knows you're sending JSON
                'Authorization': `Bearer ${session.access_token}`,  // Add Bearer token to the request headers
            }
        });
        const listeningExam = await listData.json()

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
                                    <Text fontSize={'sm'}>{bandScoreDescription?.listeningRecommendation}</Text>
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
                                        <Text>
                                            Accuracy in the IELTS Listening test is the percentage of correct answers
                                            out of the total questions in each section or the test as a whole. It reflects
                                            a candidate's ability to comprehend spoken English, attention to detail, and capacity
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
                                <ProgressCircleRoot size={"xl"} value={averageAccuracy} colorPalette={accuracyScoreColor}>
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
                                    <Text fontSize={'sm'}>{averageScoreDescription?.listeningRecommendation}</Text>
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
                </SimpleGrid>
                {data?.answer?.numberQuestions.map(
                    (d:any, index:number) =>
                        <RecordingDetailResult sessionNumber={index + 1}
                                               audioUrl={listeningExam.recording[index].audioUrl}
                                               transcripts={listeningExam.recording[index].transcript}
                                               data={data} />
                )}
            </Box>
        );
    }catch (e){
        return <AbsoluteCenter>
            Internal Error
        </AbsoluteCenter>
    }

}

interface RecordingDetailResultProps {
    sessionNumber: number,
    transcripts: string[],
    audioUrl: string,
    data: any
}
const RecordingDetailResult= (props:RecordingDetailResultProps)=> {
    const numberQuestions = props.data.answer.numberQuestions
    let startIdx = 0
    if(props.sessionNumber == 1){
        startIdx = 0
    }else if(props.sessionNumber == 2){
        startIdx = numberQuestions[0];
    }else if(props.sessionNumber == 3){
        startIdx = numberQuestions[0] + numberQuestions[1];
    }else {
        startIdx = numberQuestions[0] + numberQuestions[1] + numberQuestions[2];
    }
    return (
        <Stack p={5} borderRadius={'md'} mt={5} borderWidth={1} key={props.sessionNumber}>
            <Heading>Recording {props.sessionNumber}</Heading>
            <SimpleGrid columns={3} gap={10}>
                <GridItem colSpan={2}>
                    <AudioPlayer src={props.audioUrl} />
                    <Collapsible.Root>
                        <Collapsible.Trigger m={5}>
                            <Heading  color={'blue.500'} fontWeight={'semibold'} fontSize={'xl'} >
                                Transcript
                            </Heading>
                        </Collapsible.Trigger>
                        <Collapsible.Content >
                            {props.transcripts.map((transcript, index) =>
                                <Text key={index}>{transcript}</Text>
                            )}
                        </Collapsible.Content>
                    </Collapsible.Root>

                </GridItem>
                <GridItem colSpan={1}>
                    {props.data.results.slice(startIdx, startIdx + numberQuestions[props.sessionNumber - 1])
                        .map((result:any, index:any) => {
                        const correctAnswer = props.data.answer.answers[startIdx + index];
                        const isCorrect = result.check;
                        return (<Text key={index} color={isCorrect ? "green.500" : "red.500"}>
                            Q{startIdx + index + 1}: {result.userAnswer || "No Answer"}{" "}
                            {!isCorrect && `→ Correct: ${correctAnswer}`}
                        </Text>)})}
                </GridItem>
            </SimpleGrid>
        </Stack>)
}

function calculateAverageAccuracy(data:any) {
    const answer = data.answer;
    const results = data.results;
    const numberQuestions  = answer.numberQuestions;

    let totalCorrect = 0;
    let questionIndex = 0;
    const accuracies = [];

    // Calculate accuracy for each section
    for (let i = 0; i < numberQuestions.length; i++) {
        const sectionQuestions = numberQuestions[i];
        const sectionResults = results.slice(questionIndex, questionIndex + sectionQuestions);

        // Count correct answers in the section
        const correctInSection = sectionResults.filter((result:any) => result.check).length;
        totalCorrect += correctInSection;

        accuracies.push(correctInSection);

        questionIndex += sectionQuestions;

    }
    const averageAccuracy =  totalCorrect/40*100

    return {
        accuracies,
        averageAccuracy,
    };
}

export default ListeningPracticeResult