import {Box, GridItem, Heading, SimpleGrid, Table, VStack, Card} from "@chakra-ui/react";
import {QuestionGroup} from "@/components/my-ui/listening/listening-exam";
import {Result} from "@/components/util/type-def";
import ListeningInputDisplay from "@/components/my-ui/common/ListeningInputDisplay";

interface TableExamProps {
    questionGroup: QuestionGroup;
    answers?: string[];
    results?: Result[];
    onInputChange?: (index: number, value: string) => void;
}

const TableExam = ({questionGroup, answers, onInputChange, results}: TableExamProps) => {
    return <Card.Root shadow={'md'} p={'2%'} mb={'2%'}>
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
                            <ListeningInputDisplay q={q} onInputChange={onInputChange} results={results} answers={answers}/>
                        </Box>)
                    })}
                </VStack>
            </GridItem>
        </SimpleGrid>
    </Card.Root>
}

export default TableExam;