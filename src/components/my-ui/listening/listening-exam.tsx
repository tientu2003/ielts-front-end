'use client'
import {Session} from "next-auth";
import {
    Center,
    Tabs
} from "@chakra-ui/react";
import {useEffect} from "react";
import {useExamContext} from "@/components/my-ui/exam-context-provider";
import {reading_listening_inti_state} from "@/components/my-ui/common/common-function";
import {toaster} from "@/components/ui/toaster";
import {RecordingComponent} from "@/components/my-ui/listening/recording-component";

export interface Recording {
    audioUrl: string;
    transcript: string[];
    questionGroups: QuestionGroup[];
}

export interface QuestionGroup {
    questionType: string;
    context: string[];
    contextTable: [string[]];
    questions: Question[];
}

export interface Question {
    questionNumber: string;
    questionText: string;
    answerOptions: string[];
    answer: string;
}

interface ListeningExamProps {
    session: Session,
    data: Recording[],
    id: string
}

const ListeningExamComponent = ({session, data, id}: ListeningExamProps) => {

    const {router, value, setValue, answers, handleInputChange} = reading_listening_inti_state();

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
            const response = await fetch(`${process.env.NEXT_PUBLIC_LISTENING_SERVICE_URL}/api/listening/user/answer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token}`, // Add access token here
                },
                body: JSON.stringify(payload),
            });

            if(response.status !== 201) {
                toaster.create({
                    description: "Something went wrong",
                    type: "error",
                });
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