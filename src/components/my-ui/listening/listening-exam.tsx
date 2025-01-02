'use client'
import {Session} from "next-auth";
import {
    Box,
    Center,
    Table,
    GridItem,
    Heading,
    HStack,
    Input,
    SimpleGrid,
    Tabs,
    Text,
    VStack,
    Stack
} from "@chakra-ui/react";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useExamContext} from "@/components/my-ui/exam-context-provider";
import AudioPlayer from "@/components/my-ui/listening/audio-player";
import {InputGroup} from "@/components/ui/input-group";
import {Radio, RadioGroup} from "@/components/ui/radio"

export interface Recording {
    audioUrl: string;
    transcript: string[];
    questionGroups: QuestionGroup[];
}

interface QuestionGroup {
    questionType: string;
    context: string[];
    contextTable: [string[]];
    questions: Question[];
}

interface Question {
    questionNumber: string;
    questionText: string;
    answerOptions: string[];
    answer: string;
}

const RecordingComponent = ({
                                data,
                                session,
                                answers,
                                onInputChange
                            }: {
    data: Recording;
    answers: string[];
    session: number;
    onInputChange: (index: number, value: string) => void;
}) => {

    return (
        <SimpleGrid h={'800px'} pl={200} pr={200}>
            <Box>
                <HStack mt={2}>
                    <Heading w={'150px'}>
                        Session {session}
                    </Heading>
                    <AudioPlayer src={data.audioUrl}/>
                </HStack>
            </Box>
            <Box p={5} overflowY="auto" divideY={'2px'}>
                {data.questionGroups.map((questionGroup, index) => {
                    if (questionGroup.questionType === "table") {
                        return (<SimpleGrid columns={6} key={index} m={5}>
                            <GridItem colSpan={4}>
                                <Heading mb={2} fontSize={'2xl'}>Complete the form below</Heading>
                                <Table.Root showColumnBorder={true} border={'2px solid'} borderColor={'gray.200'}>
                                    <Table.Body>
                                        {questionGroup.contextTable.map((row: string[], i) => {
                                            return (<Table.Row key={i}>
                                                {row.map((word, j) => <Table.Cell key={j}
                                                                                  fontSize={'xl'}>{word}</Table.Cell>)}
                                            </Table.Row>)
                                        })}
                                    </Table.Body>
                                </Table.Root>
                            </GridItem>
                            <GridItem colSpan={2} mt={10}>
                                <VStack>
                                    {questionGroup.questions.map(q => {
                                        return (<Box key={q.questionNumber}>
                                            <InputGroup p={2} startElement={<Text>{q.questionNumber}</Text>}>
                                                <Input
                                                    borderRadius={"10px"}
                                                    borderWidth={'2px'}
                                                    borderColor={answers[Number(q.questionNumber) - 1]?.trim().length > 0 ? "blue.500" : "gray.200"}
                                                    value={answers[Number(q.questionNumber) - 1]}
                                                    onChange={(e) => onInputChange(Number(q.questionNumber) - 1, e.target.value)}
                                                />
                                            </InputGroup>
                                        </Box>)
                                    })}
                                </VStack>
                            </GridItem>
                        </SimpleGrid>)
                    } else if (questionGroup.questionType === "choice") {
                        return (
                            <Box key={index} m={5}>
                                {questionGroup.context.map((row, i) => <Heading key={i}>{row}</Heading>)}
                                {questionGroup.questions.map((q) => {
                                    return (<Box key={q.questionNumber} mt={5}>
                                        {q.questionText === "null" || q.questionText === "" ? null :
                                            <Heading pl={5}>{q.questionNumber + ". " + q.questionText}</Heading>}
                                        <RadioGroup  key={q.questionNumber} value={answers[Number(q.questionNumber) - 1]}
                                                    onValueChange={(e) => onInputChange(Number(q.questionNumber) - 1, e.value)}>
                                            <Stack gap={2} pl={10} mt={4}>
                                                {q.answerOptions.map((op,i) => {
                                                    return (
                                                        <Radio key={q.questionNumber + i} value={op.charAt(0)} colorPalette={'blue'} >
                                                            {op}
                                                        </Radio>
                                                    )
                                                })}
                                            </Stack>
                                        </RadioGroup>
                                    </Box>)
                                })}
                            </Box>)
                    } else {
                        return (
                            <SimpleGrid columns={6} key={index} m={5}>
                                <GridItem colSpan={3}>
                                    {questionGroup.context.map((row, i) => <Heading key={i}>{row}</Heading>)}
                                </GridItem>
                                <GridItem colSpan={3}>
                                        {questionGroup.questions.map(q => {
                                            return (<Box key={q.questionNumber}>
                                                {q.questionText === "null" || q.questionText === "" ? null :
                                                    <Text fontWeight={'semibold'} pl={5}>{q.questionNumber + ". " + q.questionText}</Text>}
                                                <Center>
                                                    <InputGroup p={2} startElement={<Text>{q.questionNumber}</Text>}>
                                                        <Input
                                                            borderRadius={"10px"}
                                                            borderWidth={'2px'}
                                                            borderColor={answers[Number(q.questionNumber) - 1]?.trim().length > 0 ? "blue.500" : "gray.200"}
                                                            value={answers[Number(q.questionNumber) - 1]}
                                                            onChange={(e) => onInputChange(Number(q.questionNumber) - 1, e.target.value)}
                                                        />
                                                    </InputGroup>
                                                </Center>

                                            </Box>)
                                        })}
                                </GridItem>
                            </SimpleGrid>)
                    }
                })}
            </Box>
        </SimpleGrid>
    )
}

interface ListeningExamProps {
    session: Session,
    data: Recording[],
    id: string
}

const ListeningExamComponent = ({session, data, id}: ListeningExamProps) => {

    const router = useRouter();

    const [value, setValue] = useState<string | null>("first")

    const [answers, setAnswers] = useState<string[]>(Array(40).fill(""));


    const handleInputChange = (index: number, value: string) => {
        setAnswers((prev) => {
            const updatedAnswers = [...prev];
            updatedAnswers[index] = value; // Cập nhật giá trị tại vị trí `index`
            return updatedAnswers;
        });

    };


    useEffect( () =>{setSubmitFunction(submitAnswers)},[answers])

    const {setSubmitFunction} = useExamContext();


    const submitAnswers = async (timeTaken: number) => {
        const cleanedAnswers = answers.map((answer) => answer.trim().toUpperCase());

        const payload = {
            testId: id, // Replace with dynamic test ID if necessary
            createdAt: new Date().toISOString(),
            timeTaken: timeTaken.toString(),
            answers: cleanedAnswers, // Use state `answers`
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_LISTENING_SERVICE_URL}/api/listening/user/${session.decodedToken?.sub}/answer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token}`, // Add access token here
                },
                body: JSON.stringify(payload),
            });

            if(response.status !== 201) {
                throw new Error("Something went wrong");
            }

            const resId = await response.text();
            router.push(`/result/listening/${resId}`);
        } catch (error) {
            console.error("Submission failed:", error);
        }
    }

    return (
        <Tabs.Root variant="enclosed" divideY={'1px'} value={value} onValueChange={(e) => setValue(e.value)}>
            <Tabs.Content value="first">
                <RecordingComponent data={data[0]} session={1} answers={answers}
                                    onInputChange={handleInputChange}/>
            </Tabs.Content>
            <Tabs.Content value="second">
                <RecordingComponent data={data[1]} session={2} answers={answers}
                                    onInputChange={handleInputChange}/>
            </Tabs.Content>
            <Tabs.Content value="third">
                <RecordingComponent data={data[2]} session={3} answers={answers}
                                    onInputChange={handleInputChange}/>
            </Tabs.Content>
            <Tabs.Content value="forth">
                <RecordingComponent data={data[3]} session={4} answers={answers}
                                    onInputChange={handleInputChange}/>
            </Tabs.Content>
            <Center>
                <Tabs.List mt={2}>
                    <Tabs.Trigger value="first" color={'blue.400'} fontWeight={'bold'}>Recording 1</Tabs.Trigger>
                    <Tabs.Trigger value="second" color={'blue.400'} fontWeight={'bold'}>Recording 2</Tabs.Trigger>
                    <Tabs.Trigger value="third" color={'blue.400'} fontWeight={'bold'}>Recording 3</Tabs.Trigger>
                    <Tabs.Trigger value="forth" color={'blue.400'} fontWeight={'bold'}>Recording 4</Tabs.Trigger>
                </Tabs.List>
            </Center>
        </Tabs.Root>
    )
}

export default ListeningExamComponent