import {Box, Collapsible, Heading, HStack, SimpleGrid, Text} from "@chakra-ui/react";
import AudioPlayer from "@/components/my-ui/listening/audio-player";
import {Recording} from "@/components/my-ui/listening/listening-exam";
import TableExam from "@/components/my-ui/listening/table-exam";
import ChoiceExam from "@/components/my-ui/listening/choice-exam";
import DefaultExam from "@/components/my-ui/listening/default-exam";
import React from "react";
import {Result} from "@/components/util/type-def";
export const RecordingComponent = ({
                                data,
                                session,
                                answers,
                                onInputChange,
                                results
                            }: {
    data: Recording;
    answers?: string[];
    session: number;
    results?: Result[];
    onInputChange?: (index: number, value: string) => void;
}) => {
    return (
        <SimpleGrid h={ results ? 'max':'80vh'} pl={'10%'} pr={'10%'}>
            <Box>
                <HStack mt={2}>
                    <Heading w={'150px'}>
                        Session {session}
                    </Heading>
                    <AudioPlayer src={data.audioUrl}/>
                </HStack>
                { results && <Collapsible.Root>
                  <Collapsible.Trigger m={5}>
                        <Heading color={'blue.500'} fontWeight={'semibold'} fontSize={'xl'}>
                            Transcript
                        </Heading>
                    </Collapsible.Trigger>
                    <Collapsible.Content>
                        {data.transcript.map((transcript, index) => {
                                if (transcript.trim() === '' || transcript.trim() === '’’' || transcript.trim() === '.') {
                                    return null;
                                } else {
                                    return <Text key={index}> - {transcript}</Text>
                                }
                            }
                        )}
                    </Collapsible.Content>
                </Collapsible.Root>}
            </Box>
            <Box p={5} overflowY={ results ? 'no': "auto" }>
                {data.questionGroups.map((questionGroup, index) => {
                    if (questionGroup.questionType === "table") {
                        return <TableExam key={index} questionGroup={questionGroup} answers={answers} results={results} onInputChange={onInputChange} />
                    } else if (questionGroup.questionType === "choice") {
                        return <ChoiceExam key={index} questionGroup={questionGroup} answers={answers}  results={results} onInputChange={onInputChange} />
                    } else {
                        return <DefaultExam key={index} questionGroup={questionGroup} answers={answers}  results={results} onInputChange={onInputChange} />
                    }
                })}
            </Box>
        </SimpleGrid>
    )
}
