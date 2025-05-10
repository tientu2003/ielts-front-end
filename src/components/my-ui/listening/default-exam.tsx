import {Box, Center, GridItem, Input, SimpleGrid, Text, Card} from "@chakra-ui/react";
import {InputGroup} from "@/components/ui/input-group";
import {QuestionGroup} from "./listening-exam";
import {formatText} from "@/components/util/format-data";

interface DefaultExamProps {
    questionGroup: QuestionGroup;
    answers: string[];
    onInputChange: (index: number, value: string) => void;
}

const DefaultExam = ({questionGroup, answers, onInputChange}: DefaultExamProps) => {

    return <Card.Root shadow={'md'} minH={'100%'} p={'2%'} mb={'2%'}>
        <SimpleGrid columns={6} m={5}>
            <GridItem colSpan={4}>
                {questionGroup.context.map((row, i) => {
                    return <Text key={i} dangerouslySetInnerHTML={{__html: formatText(row)}}/>
                })}
                {questionGroup.questions.map(q => {
                    return <Box key={q.questionNumber}>
                        {q.questionText === "null" || q.questionText === "" ? null :
                            <Box>
                                <Text fontWeight={'semibold'} pl={5}>{q.questionNumber + ". " + q.questionText}</Text>
                                <InputGroup w={'75%'} p={2} startElement={<Text>{q.questionNumber}</Text>}>
                                    <Input
                                        borderRadius={"10px"}
                                        borderWidth={'2px'}
                                        borderColor={answers[Number(q.questionNumber) - 1]?.trim().length > 0 ? "blue.500" : "gray.200"}
                                        value={answers[Number(q.questionNumber) - 1]}
                                        onChange={(e) => onInputChange(Number(q.questionNumber) - 1, e.target.value)}
                                    />
                                </InputGroup>
                            </Box>}
                    </Box>
                })}
            </GridItem>
            <GridItem colSpan={2}>
                {questionGroup.questions.map(q => {
                    return (<Box key={q.questionNumber}>
                        {q.questionText === "null" || q.questionText === "" ?
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
                            </Center> : null
                        }
                    </Box>)
                })}
            </GridItem>
        </SimpleGrid>
    </Card.Root>
}

export default DefaultExam;