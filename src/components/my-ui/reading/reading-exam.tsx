'use client'

import {Box, Center, Text, GridItem, Heading, SimpleGrid, Tabs, Input, AbsoluteCenter} from "@chakra-ui/react";
import {useState} from "react";
import { InputGroup } from "@/components/ui/input-group"
import {useExamContext} from "@/components/my-ui/exam-context-provider";
import {useSession} from "next-auth/react";
import {useParams} from "next/navigation";
import { useRouter } from 'next/navigation'; // Import useRouter at the top



interface Passage{
    articleName: string;
    paragraphs: Array<paragraph>;
    questionGroups: Array<QuestionGroup>;
    numberOfQuestions: number;
}

interface paragraph{
    title: string;
    paragraph:string;
}

interface QuestionGroup{
    context:Array<string>;
    diagramUrl: string;
    readingTestType: string;
    questions: Array<string>;
}

const PassageComponent = ({
      data,
      startIndex,
      answers,
      onInputChange}: {
    data: Passage;
    startIndex: number;
    answers: string[];
    onInputChange: (index: number, value: string) => void;
}) => {

    let count = 0;

    const formatText = (text:string) => {
        // Replace all capitalized words with a styled <span>
        return text.replace(/\b[A-Z]+\b/g, (match) => `<span style="font-weight: bold; color: red;">${match}</span>`);
    };

    return (
        <SimpleGrid columns={2} h={'800px'} divideX={'2px'} border={'2px solid'}  borderColor={'gray.200'}>
            <Box p={5} overflowY="auto">
                <GridItem>
                    <Heading>
                        {data.articleName === null || data.articleName === "null" ? null: data.articleName}
                    </Heading>
                    {data.paragraphs.map((p, i) =>{
                        return (<Box key={i}>
                            {p.title === null || p.title === "null" ? null : <Text fontWeight={'bold'}>{p.title}</Text> }
                            {p.paragraph === null || p.paragraph === "null" ? null :  <Text>{p.paragraph}</Text> }
                            </Box>)
                    })}
                </GridItem>
            </Box>
            <Box p={5} overflowY="auto">
                <GridItem>
                    {data.questionGroups.map((qG, i) =>{
                        return (<Box key={i}>
                            {qG.context.map((c, j) => {
                                return  <Text key={j} dangerouslySetInnerHTML={{ __html: formatText(c) }} />
                            })}
                            {qG.questions.map((q, j) =>{
                                const currentIndex = count + startIndex; // Tính chỉ số trong mảng `answers`
                                count++;
                                return <Box key={j}>
                                    {q === "null" ? null: <Text>{(count + startIndex) + ". " +q}</Text>}
                                    <InputGroup p={2} startElement={<Text>{count + startIndex}</Text>}>
                                        <Input
                                            borderRadius={"10px"}
                                            value={answers[currentIndex]} // Hiển thị giá trị từ `answers`
                                            onChange={(e) => onInputChange(currentIndex, e.target.value)}// Cập nhật giá trị
                                        />
                                    </InputGroup>
                                </Box>
                            })}
                        </Box>)
                    })}

                </GridItem>
            </Box>
        </SimpleGrid>
    )
}

interface ReadingExamComponentProps {
    data: Array<Passage>
}

const ReadingExamComponent = ({data}: ReadingExamComponentProps) => {
    const  {data:session, status} = useSession();
    const {id} = useParams();
    const router = useRouter(); // Initialize the router hook

    const [value, setValue] = useState<string | null>("first")

    const [answers, setAnswers] = useState<string[]>(Array(40).fill(""));

    const handleInputChange = (index: number, value: string) => {
        setAnswers((prev) => {
            const updatedAnswers = [...prev];
            updatedAnswers[index] = value; // Cập nhật giá trị tại vị trí `index`
            return updatedAnswers;
        });
        setSubmitFunction(submitAnswers)
    };

    const { setSubmitFunction } = useExamContext();

    // Function submit được định nghĩa ở đây
    const submitAnswers = async (timeTaken: number) => {
        const cleanedAnswers = answers.map((answer) => answer.trim().toUpperCase());

        const payload = {
            testId: id, // Replace with dynamic test ID if necessary
            createdAt: new Date().toISOString(),
            timeTaken:`PT${Math.floor(timeTaken / 60)}M${timeTaken % 60}S`, // ISO-8601 duration format
            answers: cleanedAnswers, // Use state `answers`
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reading/user/${session?.decodedToken?.sub}/answer`, {
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

            const resId:string = await response.json();
            router.push(`/result/reading/${resId}`);
        } catch (error) {
            console.error("Submission failed:", error);
        }
    };

    return (
        <Tabs.Root variant="enclosed" divideY={'2px'} value={value} onValueChange={(e) => setValue(e.value)}>
            <Tabs.Content value="first">
                <PassageComponent data={data[0]}
                                  startIndex={0}
                                  answers={answers}
                                  onInputChange={handleInputChange}  />
            </Tabs.Content>
            <Tabs.Content value="second">
                <PassageComponent data={data[1]}
                                  startIndex={data[0].numberOfQuestions }
                                  answers={answers}
                                  onInputChange={handleInputChange}
                />
            </Tabs.Content>
            <Tabs.Content value="third">
                <PassageComponent data={data[2]}
                                  startIndex={data[1].numberOfQuestions + data[0].numberOfQuestions}
                                  answers={answers}
                                  onInputChange={handleInputChange}
                />
            </Tabs.Content>
            <Center>
                <Tabs.List mt={2} >
                    <Tabs.Trigger value="first" color={'blue.400'} fontWeight={'bold'}>Passage 1</Tabs.Trigger>
                    <Tabs.Trigger value="second" color={'blue.400'} fontWeight={'bold'}>Passage 2</Tabs.Trigger>
                    <Tabs.Trigger value="third" color={'blue.400'} fontWeight={'bold'}>Passage 3</Tabs.Trigger>
                </Tabs.List>
            </Center>
        </Tabs.Root>
    )
}

export default ReadingExamComponent;