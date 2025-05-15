import {InputGroup} from "@/components/ui/input-group";
import {Box, Input, Text} from "@chakra-ui/react";
import {Question} from "@/components/my-ui/listening/listening-exam";
import {Result} from "@/components/util/type-def";

interface ListeningInputDisplayProps {
    q: Question,
    answers?: string[],
    results?: Result[],
    onInputChange?: (index: number, value: string) => void
}

export default function ListeningInputDisplay( {q, answers, results, onInputChange}: ListeningInputDisplayProps) {

    if(answers && onInputChange) {
        return <InputGroup p={2} startElement={<Text>{q.questionNumber}</Text>}>
            <Input
                borderRadius={"10px"}
                borderWidth={'2px'}
                borderColor={answers[Number(q.questionNumber) - 1]?.trim().length > 0 ? "blue.500" : "gray.200"}
                value={answers[Number(q.questionNumber) - 1]}
                onChange={(e) => onInputChange(Number(q.questionNumber) - 1, e.target.value)}/>
        </InputGroup>
    }

    if(results && answers ) {
        return <Box>
        <InputGroup p={2} startElement={<Text>{q.questionNumber}</Text>}>
            <Input
                fontWeight={'bold'}
                borderRadius={"10px"}
                borderWidth={'2px'}
                contentEditable={false}
                readOnly={true}
                color={results[Number(q.questionNumber) - 1].check ?  "green.500" : "red.500"}
                borderColor={results[Number(q.questionNumber) - 1].check ?  "green.500" : "red.500"}
                value={results[Number(q.questionNumber) - 1].userAnswer} />
        </InputGroup>
        {!results[Number(q.questionNumber) - 1].check &&
            <Text color={'green.500'} w={'50%'} fontWeight={'bold'}> → Correct: {answers ? answers[Number(q.questionNumber) - 1] : null}</Text>}
    </Box>
    }
}