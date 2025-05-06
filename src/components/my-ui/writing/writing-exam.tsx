'use client'
import {Session} from "next-auth";
import {Box, Button, Card, GridItem, SimpleGrid, Text, Textarea} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import ContextPart from "@/components/my-ui/writing/context-part";
import {useExamContext} from "@/components/my-ui/exam-context-provider";

interface WritingExamComponentProps {
    session?: Session,
    data: any,
    id: string
}

const WritingExamComponent = ({session, data, id}: WritingExamComponentProps) => {
    data = {
        task:1,
        context:"The graph below shows the consumption of renewable energy in the USA from 2000 to 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        url: "/assets/sample-task1.png"
    }
    const [answer, setAnswer] = useState("");
    const [wordCount, setWordCount] = useState(0);
    const countWords = (value:string) => {
        // Trim the text and split by whitespace
        const words = value.trim().split(/\s+/);
        return value.trim() === "" ? 0 : words.length;
    };
    const handleChange = (e:any) => {
        const value = e.target.value;
        setAnswer(value);
        setWordCount(countWords(value));
    };


    useEffect( () =>{setSubmitFunction(submitAnswers)},[answer])

    const {setSubmitFunction} = useExamContext();


    const submitAnswers = async (timeTaken: number) => {
        const cleanedAnswers = answer.trim().replace('\n', ' ')

        const payload = {
            testId: id, // Replace with dynamic test ID if necessary
            createdAt: new Date().toISOString(),
            timeTaken: timeTaken.toString(),
            answers: cleanedAnswers, // Use state `answers`
        };

        try {
            // const response = await fetch(`${process.env.NEXT_PUBLIC_LISTENING_SERVICE_URL}/api/listening/user/${session.decodedToken?.sub}/answer`, {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //         "Authorization": `Bearer ${session?.access_token}`, // Add access token here
            //     },
            //     body: JSON.stringify(payload),
            // });
            //
            // if(response.status !== 201) {
            //     throw new Error("Something went wrong");
            // }
            //
            // const resId = await response.text();
            console.log(payload);
        } catch (error) {
            console.error("Submission failed:", error);
        }
    }
    return < SimpleGrid columns={2} bgColor="gray.100" height={'90vh'} gap={5}>
        <GridItem colSpan={1}>
            <Box mt={"2.5vh"}
                 ml={10}
                 h="85vh">
                <ContextPart task={data.task} context={data.context} url={data.url} />
            </Box>
        </GridItem>
        <GridItem colSpan={1}>
            <Box mt={"2.5vh"}
                 mr={10}
                 h="85vh">
                <Card.Root h={'100%'}>
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
                    <Card.Footer>
                        <Button variant="subtle">Save Draft</Button>
                    </Card.Footer>
                </Card.Root>
            </Box>
        </GridItem>
    </SimpleGrid>
}

export default WritingExamComponent;
