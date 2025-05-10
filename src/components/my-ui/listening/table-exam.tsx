import {Box, GridItem, Heading, Input, SimpleGrid, Table, Text, VStack, Card} from "@chakra-ui/react";
import {InputGroup} from "@/components/ui/input-group";
import {QuestionGroup} from "@/components/my-ui/listening/listening-exam";

interface TableExamProps {
    questionGroup: QuestionGroup;
    answers: string[];
    onInputChange: (index: number, value: string) => void;
}

const TableExam = ({questionGroup, answers, onInputChange}: TableExamProps) => {
    return <Card.Root shadow={'md'} minH={'100%'} p={'2%'} mb={'2%'}>
        <SimpleGrid columns={6} m={5}>
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
        </SimpleGrid>
    </Card.Root>
}

export default TableExam;