'use client'

import {Box, Center, Text, GridItem, Heading, SimpleGrid, Tabs, Input} from "@chakra-ui/react";
import {useState} from "react";
import { InputGroup } from "@/components/ui/input-group"


interface ReadingExamComponentProps {
    data: Array<Passage>
}

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

const PassageComponent = ({data,startIndex}:{data:Passage, startIndex:number}) => {

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
                                count++;
                                return <Box key={j}>
                                    {q === "null" ? null: <Text>{count + ". " +q}</Text>}
                                    <InputGroup p={2} flex="1" startElement={<Text>{count + startIndex}</Text>}>
                                        <Input borderRadius={'10px'}/>
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

const ReadingExamComponent = ({data}: ReadingExamComponentProps) => {
    const [value, setValue] = useState<string | null>("first")

    return (
        <Tabs.Root variant="enclosed" divideY={'2px'} value={value} onValueChange={(e) => setValue(e.value)}>
            <Tabs.Content value="first">
                <PassageComponent data={data[0]} startIndex={0}  />
            </Tabs.Content>
            <Tabs.Content value="second">
                <PassageComponent data={data[1]} startIndex={data[0].numberOfQuestions }  />
            </Tabs.Content>
            <Tabs.Content value="third">
                <PassageComponent data={data[2]} startIndex={data[1].numberOfQuestions + data[0].numberOfQuestions} />
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