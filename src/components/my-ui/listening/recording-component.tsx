import {Box, Heading, HStack, SimpleGrid} from "@chakra-ui/react";
import AudioPlayer from "@/components/my-ui/listening/audio-player";
import {Recording} from "@/components/my-ui/listening/listening-exam";
import TableExam from "@/components/my-ui/listening/table-exam";
import ChoiceExam from "@/components/my-ui/listening/choice-exam";
import DefaultExam from "@/components/my-ui/listening/default-exam";
export const RecordingComponent = ({
                                data,
                                session,
                                answers,
                                onInputChange
                            }: {
    data: Recording;
    answers: string[];
    session: number;
    onInputChange: (index: number, value: string) => void;
}) => {

    return (
        <SimpleGrid h={'80vh'} pl={'10%'} pr={'10%'}>
            <Box>
                <HStack mt={2}>
                    <Heading w={'150px'}>
                        Session {session}
                    </Heading>
                    <AudioPlayer src={data.audioUrl}/>
                </HStack>
            </Box>
            <Box p={5} overflowY="auto">
                {data.questionGroups.map((questionGroup, index) => {
                    if (questionGroup.questionType === "table") {
                        return <TableExam key={index} questionGroup={questionGroup} answers={answers} onInputChange={onInputChange} />
                    } else if (questionGroup.questionType === "choice") {
                        return <ChoiceExam key={index} questionGroup={questionGroup} answers={answers} onInputChange={onInputChange} />
                    } else {
                        return <DefaultExam key={index} questionGroup={questionGroup} answers={answers} onInputChange={onInputChange} />
                    }
                })}
            </Box>
        </SimpleGrid>
    )
}
