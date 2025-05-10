import {Box, Heading, Stack, Card} from "@chakra-ui/react";
import {Radio, RadioGroup} from "@/components/ui/radio";
import {QuestionGroup} from "@/components/my-ui/listening/listening-exam";

interface ChoiceExamProps {
    questionGroup: QuestionGroup;
    answers: string[];
    onInputChange: (index: number, value: string) => void;
}

const ChoiceExam = ({questionGroup, answers, onInputChange}: ChoiceExamProps) => {

    return <Card.Root shadow={'md'} minH={'100%'} p={'2%'} mb={'2%'}>
        <Box m={5}>
            {questionGroup.context.map((row, i) => <Heading key={i}>{row}</Heading>)}
            {questionGroup.questions.map((q) => {
                return (<Box key={q.questionNumber} mt={5}>
                    {q.questionText === "null" || q.questionText === "" ? null :
                        <Heading pl={5}>{q.questionNumber + ". " + q.questionText}</Heading>}
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
                    </RadioGroup>
                </Box>)
            })}
        </Box>
    </Card.Root>

}

export default ChoiceExam;