'use client'
import {Session} from "next-auth";
import {Box, Card, GridItem, SimpleGrid, Text, Textarea} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import ContextPart from "@/components/my-ui/writing/context-part";
import {useExamContext} from "@/components/my-ui/exam-context-provider";
import {useRouter} from "next/navigation";

interface WritingExamComponentProps {
    session: Session,
    data: WritingExam,
    id: string
}

interface WritingExam {
    id: string,
    name: string,
    context: string,
    diagram_url: string,
    task: number,
}

const WritingExamComponent = ({session, data, id}: WritingExamComponentProps) => {
    const router = useRouter();
    const [answer, setAnswer]= useState<string>('');
    const [answers, setAnswers] = useState<string[]>([]);
    const [wordCount, setWordCount] = useState(0);
    const countWords = (value:string) => {
        // Trim the text and split by whitespace
        const words = value.trim().split(/\s+/);
        return value.trim() === "" ? 0 : words.length;
    };
    const handleChange = (e:any) => {
        const value = e.target.value;
        setAnswer(value);
        setAnswers(value.split('\n').filter((e:string) => e !== ''));
        setWordCount(countWords(value));
    };


    useEffect( () =>{setSubmitFunction(submitAnswers)},[answer])

    const {setSubmitFunction} = useExamContext();


    const submitAnswers = async (timeTaken: number) => {

        const payload = {
            examId: id,
            duration: timeTaken.toString(),
            answer: answers,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_WRITING_SERVICE_URL}/api/writing/user/answer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token}`, // Add access token here
                },
                body: JSON.stringify(payload),
            });
            const resId = await response.text()
            router.push(`/result/writing/${resId}`);
        } catch (error) {
            console.error("Submission failed:", error);
        }
    }
    return <SimpleGrid columns={2} height={'90vh'} gap={5} >
        <GridItem colSpan={1}>
            <Box mt={"2.5vh"}
                 ml={10}
                 h="85vh">
                <ContextPart task={data.task} context={data.context} url={data.diagram_url} name={data.name}/>
            </Box>
        </GridItem>
        <GridItem colSpan={1}>
            <Box mt={"2.5vh"}
                 mr={10}
                 h="85vh">
                <Card.Root h={'100%'} shadow={'lg'}>
                    <Card.Header>
                        <Text textAlign={'right'} mr={6}>
                            Words: {wordCount}
                        </Text>
                    </Card.Header>
                    <Card.Body>
                        <Textarea placeholder="Start writing your essay here..."
                                  h={'100%'}
                                  value={answer}
                                  onChange={handleChange}
                        />
                    </Card.Body>
                </Card.Root>
            </Box>
        </GridItem>
    </SimpleGrid>
}

export default WritingExamComponent;