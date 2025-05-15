import {Box, Heading, Stack, Card, Text} from "@chakra-ui/react";
import {Radio, RadioGroup} from "@/components/ui/radio";
import {QuestionGroup} from "@/components/my-ui/listening/listening-exam";
import {Result} from "@/components/util/type-def";

interface ChoiceExamProps {
    questionGroup: QuestionGroup;
    answers?: string[];
    results?: Result[];
    onInputChange?: (index: number, value: string) => void;
}

const ChoiceExam = ({questionGroup, answers, onInputChange, results}: ChoiceExamProps) => {

    return <Card.Root shadow={'md'} p={'2%'} mb={'2%'}>
        <Box m={5}>
            {questionGroup.context.map((row, i) => <Heading key={i}>{row}</Heading>)}
            {questionGroup.questions.map((q) => {
                return (<Box key={q.questionNumber} mt={5}>
                    {q.questionText === "null" || q.questionText === "" ? null :
                        <Heading pl={5}>{q.questionNumber + ". " + q.questionText}</Heading>}
                    {answers && onInputChange ?
                        <RadioGroup key={q.questionNumber} value={answers[Number(q.questionNumber) - 1]}
                                    onValueChange={(e) => onInputChange(Number(q.questionNumber) - 1, e.value)}>
                            <Stack gap={2} pl={10} mt={4}>
                                {q.answerOptions.map((op, i) => {
                                    return (
                                        <Radio key={q.questionNumber + i} value={op.charAt(0)} colorPalette={'blue'}>
                                            {op}
                                        </Radio>
                                    )
                                })}
                            </Stack>
                        </RadioGroup> : null}
                    {results && answers ? <Box>
                        <RadioGroup key={q.questionNumber} value={results[Number(q.questionNumber) - 1].userAnswer}>
                            <Stack gap={2} pl={10} mt={4}>
                                {q.answerOptions.map((op, i) => {
                                    return (
                                        <Radio
                                            key={q.questionNumber + i}
                                            value={op.charAt(0)}
                                            colorPalette={results[Number(q.questionNumber) - 1].check ? "green" : "red" }
                                            color={op.charAt(0) === results[Number(q.questionNumber) - 1].userAnswer?
                                                (results[Number(q.questionNumber) - 1].check ?  "green.500" : "red.500") : 'black' }
                                        >
                                            {op}
                                        </Radio>
                                    )
                                })}
                            </Stack>
                        </RadioGroup>
                        {!results[Number(q.questionNumber) - 1].check &&
                            <Text color={'green.500'} w={'50%'} fontWeight={'bold'}> → Correct: {answers ? answers[Number(q.questionNumber) - 1] : null}</Text>}
                    </Box> : null}
                </Box>)
            })}
        </Box>
    </Card.Root>

}

export default ChoiceExam;