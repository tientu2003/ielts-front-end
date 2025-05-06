'use client'

import {Box, Center, Text, GridItem, Heading, SimpleGrid, Tabs, Input} from "@chakra-ui/react";
import {useEffect} from "react";
import { InputGroup } from "@/components/ui/input-group"
import {useExamContext} from "@/components/my-ui/exam-context-provider";
import {useSession} from "next-auth/react";
import {useParams} from "next/navigation";
import {reading_listening_inti_state} from "@/components/my-ui/common/common-function"; // Import useRouter at the top



interface Passage{
    articleName: string;
    paragraphs: Array<paragraph>;
    questionGroups: Array<QuestionGroup>;
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

    const formatText = (text: string) => {
        const keywords = ['NO', 'MORE', 'THAN', 'TWO', 'WORDS', 'ONE', 'WORD', 'ONLY', 'THREE', 'TRUE', 'FALSE', 'NOT GIVEN'];
        let formattedText = text;
        formattedText = keywords.reduce((acc, keyword) => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            return acc.replace(regex, `<span style="font-weight: bold; color: red;">${keyword}</span>`);
        }, formattedText);
        return formattedText.replace(/\b[A-Z](?![A-Z])\b/g, match => `<span style="font-weight: bold; color: red;">${match}</span>`);
    };

    return (
        <SimpleGrid columns={2} h={'80vh'} divideX={'2px'} border={'2px solid'}  borderColor={'gray.200'}>
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
                                            borderWidth={'2px'}
                                            borderColor={answers[currentIndex]?.trim().length > 0 ? "blue.500" : "gray.200"}
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
    const  {data:session} = useSession();
    const {id} = useParams();
    const {router, value, setValue, answers, handleInputChange} = reading_listening_inti_state();

    const getTotalQuestions = (passage: Passage): number => {
        return passage.questionGroups.reduce((total, group) => total + group.questions.length, 0);
    };

    const startIndexes = data.reduce((acc: number[], passage, index) => {
        if (index === 0) return [0];
        return [...acc, acc[index - 1] + getTotalQuestions(data[index - 1])];
    }, []);


    const { setSubmitFunction } = useExamContext();
    useEffect( () =>{setSubmitFunction(submitAnswers)},[answers])


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
            const response = await fetch(`${process.env.NEXT_PUBLIC_READING_SERVICE_URL}/api/reading/user/answer`, {
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

            const resId:string = await response.text();
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
                                  startIndex={startIndexes[1]}
                                  answers={answers}
                                  onInputChange={handleInputChange}
                />
            </Tabs.Content>
            <Tabs.Content value="third">
                <PassageComponent data={data[2]}
                                  startIndex={startIndexes[2]}
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