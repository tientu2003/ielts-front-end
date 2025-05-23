'use client'
import React, {useState, useEffect} from 'react';
import {
    Box,
    Card,
    Progress,
    Pagination,
    ButtonGroup,
    IconButton,
    Center,
    Text,
    VStack,
    Button,
    Heading,
    Alert,
    ProgressCircle, AbsoluteCenter
} from '@chakra-ui/react';
import {useRouter} from 'next/navigation';
import {
    SpeakingAudioFileResponse,
    SpeakingExam,
    SpeakingExamSubmission,
    SpeakingQuestion
} from '@/components/util/speaking-types';
import CountDownClock from '@/components/my-ui/count-down-clock';
import AudioRecorder from './audio-recorder';
import {toaster} from '@/components/ui/toaster';
import {InfoTip} from "@/components/ui/toggle-tip";
import {HiChevronLeft, HiChevronRight} from "react-icons/hi2";
import {useExamContext} from "@/components/my-ui/exam-context-provider";
import {uploadAudioFile} from "@/components/util/upload-file"

interface SpeakingExamComponentProps {
    data: SpeakingExam;
    userId: string;
    accessToken: string;
    speakingServiceUrl: string;
}

const SpeakingExamComponent: React.FC<SpeakingExamComponentProps> = ({
                                                                         data,
                                                                         accessToken,
                                                                         speakingServiceUrl,
                                                                     }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState<Map<number, Blob>>(new Map());
    const [durations, setDurations] = useState<Map<number, number>>(new Map());
    const [examState, setExamState] = useState<'intro' | 'speaking' | 'submitting' | 'completed'>('intro');
    const [isRecording, setIsRecording] = useState(false);

    const router = useRouter();

    let questions: SpeakingQuestion[] = []
    let total_question: number = 0;
    let speakingTime = 30;

    if (data.type === 1) {
        questions = data.partOne;
        total_question = data.partOne.length;
    } else if (data.type === 2) {
        questions = [data.partTwo].concat(data.partThree);
        total_question = data.partThree.length + 1;
        if (currentQuestionIndex === 0) {
            speakingTime = 120;
        }
    }

    const progress = Number((((currentQuestionIndex + 1) / total_question) * 100).toFixed(2));
    const {setSubmitFunction} = useExamContext();
    useEffect(() => {
        setSubmitFunction(submitExam)
    }, [responses]);


    const handleRecordingComplete = (audioBlob: Blob) => {
        setResponses(prev => {
            const newResponses = new Map(prev);
            if(currentQuestionIndex === 0 && data.type === 2){
                newResponses.set(0, audioBlob);
            }else{
                newResponses.set(questions[currentQuestionIndex].number, audioBlob);
            }
            return newResponses;
        });
        setDurations(prev => {
            const newDurations = new Map(prev);
            if(currentQuestionIndex === 0 && data.type === 2){
                newDurations.set(0, speakingTime);
            }else{
                newDurations.set(questions[currentQuestionIndex].number, speakingTime);
            }
            return newDurations;
        });
        setIsRecording(false);
    };

    const startRecording = () => {
        if (examState === 'intro') {
            setExamState('speaking');
        }
        setIsRecording(true);
    };

    const submitExam = async (timeTaken: number) => {
        if (responses.size === 0) {
            toaster.create({
                description: 'Please record at least one answer before submitting',
                type: 'error'
            });
            return;
        }
        try {
            setExamState('submitting');
            const uploadPromises: Promise<SpeakingAudioFileResponse>[] = Array.from(responses.entries()).map(async ([questionId, audioBlob]) => {
                const blobName:string = await uploadAudioFile(audioBlob);
                return {
                    questionId: questionId,
                    blobName: blobName,
                    duration: durations.get(questionId) || 0
                };
            });
            const audioInfo =  await Promise.all(uploadPromises);

            setExamState('completed');
            
            let payload:SpeakingExamSubmission = {
                id: data.id,
                testName: data.testName,
                answersOne: [],
                answersTwo: {number: 0, url: '', topic: '', question:'' },
                answersThree: []
            }

            if (data.type === 1) {
                payload.answersOne = audioInfo.map((e) => {
                    return {
                        number: e.questionId,
                        url: e.blobName,
                        topic: data.partOne[e.questionId].topic,
                        question: data.partOne[e.questionId].question
                    }
                });
            } else {
                payload.answersTwo = {
                    number: audioInfo[0].questionId,
                    url: audioInfo[0].blobName,
                    topic: data.partTwo.topic,
                    question: data.partTwo.question
                }
                payload.answersThree = audioInfo.filter(e => e.questionId !== 0).map((e) => {
                    return {
                        number: e.questionId,
                        url: e.blobName,
                        topic: data.partThree[e.questionId].topic,
                        question: data.partThree[e.questionId].question
                    }
                });

            }
            
            const res = await fetch("/api/v1/speaking", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            const body = await res.json();

            toaster.create({
                description: 'Exam submitted successfully!',
                type: 'success'
            });
            setTimeout(() => {
                router.push(`/result/speaking/${body.id}`);
            }, 5000);
        } catch (error) {
            setExamState('intro');
            toaster.create({
                title: 'Submitting failed',
                description: 'There was an error submitting your exam. Please try again.',
                type: 'error'
            });
        }
    };


    const clock = (time: number) => {
        setExamState('intro');
    }

    if (examState === 'submitting') {
        return (
            <Center h="100vh">
                <VStack>
                    <ProgressCircle.Root value={null} size="sm">
                        <ProgressCircle.Circle>
                            <ProgressCircle.Track/>
                            <ProgressCircle.Range/>
                        </ProgressCircle.Circle>
                    </ProgressCircle.Root>
                    <Text>Submitting your exam responses...</Text>
                </VStack>
            </Center>
        );
    }

    if (examState === 'completed') {
        return (
            <Center h="100vh">
                <Alert.Root status="info" title="This is the alert title">
                    <Alert.Indicator/>
                    <Alert.Content>
                        <Alert.Title>Your exam has been submitted successfully!</Alert.Title>
                        <Alert.Description>
                            Redirecting to exams page...
                        </Alert.Description>
                    </Alert.Content>
                </Alert.Root>
            </Center>
        );
    }

    return (
        <AbsoluteCenter p={5} >
            <Card.Root p={5} shadow="md" >
                <Progress.Root size={'lg'} colorPalette={'green'} value={progress}>
                    <Progress.Label>
                        Exam Progress
                        <InfoTip>The Percentage of Completed Exam</InfoTip>
                    </Progress.Label>
                    <Progress.Track flex="1">
                        <Progress.Range/>
                    </Progress.Track>
                    <Progress.ValueText>{progress}%</Progress.ValueText>
                </Progress.Root>
                <Box mt={4}>
                    <Heading >
                        {data.type === 1 ? 'Part One' : currentQuestionIndex === 0 ? 'Part Two' : 'Part Three'}
                        {data.type === 1 && (
                            <Text fontSize={'md'} color="gray.500" mb={4}>
                                In Part 1, provide short and direct answers about familiar topics. Speak naturally for 30
                                seconds.
                            </Text>
                        )}
                        {data.type === 2 && currentQuestionIndex === 0 && (
                            <Text fontSize={'md'}  color="gray.500" mb={4}>
                                For Part 2, speak in detail about the given topic for 2 minutes. Include all points
                                mentioned in the question.
                            </Text>
                        )}
                        {data.type === 2 && currentQuestionIndex > 0 && (
                            <Text fontSize={'md'}  color="gray.500" mb={4}>
                                In Part 3, give in-depth responses showing your ability to discuss abstract ideas and
                                opinions for 30 seconds.
                            </Text>
                        )}
                        Question {currentQuestionIndex + 1}
                    </Heading>

                    <Text mb={4} fontSize={'lg'}>{questions[currentQuestionIndex]?.question}</Text>

                    {((examState === 'speaking') || (examState === 'intro')) && (
                        <VStack>
                            {isRecording && <CountDownClock minutes={speakingTime / 60} onTimeTaken={clock}/>}
                            <Button
                                colorPalette="red"
                                onClick={startRecording}
                                variant={'outline'}
                                disabled={isRecording}
                            >
                                {isRecording ? 'Recording...' : 'Start Recording'}
                            </Button>
                        </VStack>
                    )}
                    <AudioRecorder
                        onRecordingComplete={handleRecordingComplete}
                        isRecording={isRecording}
                        recordingTime={speakingTime}
                    />

                    <Pagination.Root
                        count={total_question}
                        pageSize={1}
                        page={currentQuestionIndex + 1}
                        onPageChange={(e) => {
                            setCurrentQuestionIndex(e.page - 1);
                            setExamState('intro');
                        }}
                    >
                        <Center>
                            <ButtonGroup variant="ghost" size="sm">
                                <Pagination.PrevTrigger asChild>
                                    <IconButton aria-label="previous">
                                        <HiChevronLeft/>
                                    </IconButton>
                                </Pagination.PrevTrigger>
                                <Pagination.Items
                                    render={(page) => (
                                        <IconButton
                                            aria-label={`page ${page.value}`}
                                            variant={"ghost"}
                                        >
                                            {page.value}
                                        </IconButton>
                                    )}
                                />
                                <Pagination.NextTrigger asChild>
                                    <IconButton aria-label="next">
                                        <HiChevronRight/>
                                    </IconButton>
                                </Pagination.NextTrigger>
                            </ButtonGroup>
                        </Center>
                    </Pagination.Root>
                </Box>
            </Card.Root>
        </AbsoluteCenter>
    );
};

export default SpeakingExamComponent;