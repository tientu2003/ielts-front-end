import {Box, Center, GridItem, SimpleGrid, Text, Card} from "@chakra-ui/react";
import {QuestionGroup} from "./listening-exam";
import {formatText} from "@/components/util/format-data";
import {Result} from "@/components/util/type-def";
import ListeningInputDisplay from "@/components/my-ui/common/ListeningInputDisplay";

interface DefaultExamProps {
    questionGroup: QuestionGroup;
    answers?: string[];
    results?: Result[];
    onInputChange?: (index: number, value: string) => void;
}

const DefaultExam = ({questionGroup, answers, onInputChange, results}: DefaultExamProps) => {

    return <Card.Root shadow={'md'} p={'2%'} mb={'2%'}>
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
                                <ListeningInputDisplay q={q} onInputChange={onInputChange} results={results} answers={answers} />
                            </Box>}
                    </Box>
                })}
            </GridItem>
            <GridItem colSpan={2}>
                {questionGroup.questions.map(q => {
                    return (<Box key={q.questionNumber}>
                        {q.questionText === "null" || q.questionText === "" ?
                            <Center>
                                <ListeningInputDisplay q={q} onInputChange={onInputChange} results={results} answers={answers} />
                            </Center> : null
                        }
                    </Box>)
                })}
            </GridItem>
        </SimpleGrid>
    </Card.Root>
}

export default DefaultExam;