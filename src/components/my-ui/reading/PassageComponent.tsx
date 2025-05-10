'use client'
import {Box, GridItem, Heading, Input, SimpleGrid, Text} from "@chakra-ui/react";
import {InputGroup} from "@/components/ui/input-group";
import {Passage} from "@/components/my-ui/reading/reading-exam";
import {formatText} from "@/components/util/format-data";
import { Result } from "@/components/util/result";


const PassageComponent = ({
                              data,
                              startIndex,
                              answers,
                              results,
                              onInputChange
                          }: {
    data: Passage;
    startIndex: number;
    answers?: string[];
    results?: Result[];
    onInputChange?: (index: number, value: string) => void;
}) => {

    let count = 0;

    return (
        <SimpleGrid columns={2} h={'80vh'} divideX={'2px'} border={'2px solid'} borderColor={'gray.200'}>
            <Box p={5} overflowY="auto">
                <GridItem>
                    <Heading>
                        {data.articleName === null || data.articleName === "null" ? null : data.articleName}
                    </Heading>
                    {data.paragraphs.map((p, i) => {
                        return (<Box key={i}>
                            {p.title === null || p.title === "null" ? null : <Text fontWeight={'bold'}>{p.title}</Text>}
                            {p.paragraph === null || p.paragraph === "null" ? null : <Text>{p.paragraph}</Text>}
                        </Box>)
                    })}
                </GridItem>
            </Box>
            <Box p={5} overflowY="auto">
                <GridItem>
                    {data.questionGroups.map((qG, i) => {
                        return (<Box key={i}>
                            {qG.context.map((c, j) => {
                                return <Text key={j} dangerouslySetInnerHTML={{__html: formatText(c)}}/>
                            })}
                            {qG.questions.map((q, j) => {
                                const currentIndex = count + startIndex; // Tính chỉ số trong mảng `answers`
                                count++;
                                return <Box key={j} minW={'100%'}>
                                    {q === "null" ? null : <Text>{(count + startIndex) + ". " + q}</Text>}
                                    {answers && !results ? <InputGroup p={2} startElement={<Text>{count + startIndex}</Text>}>
                                        <Input borderRadius={"10px"} borderWidth={'2px'}
                                               borderColor={answers[currentIndex].trim().length > 0 ? "blue.500" : "gray.200"}
                                               value={answers[currentIndex]}
                                               onChange={(e) => {
                                                   if (onInputChange) {
                                                       onInputChange(currentIndex, e.target.value)
                                                   }
                                               }}/>
                                    </InputGroup> : null}
                                    {results ? <Box>
                                        <InputGroup p={2} w={'80%'}
                                                    startElement={<Text>{count + startIndex}</Text>}>
                                            <Input
                                                fontWeight={'bold'}
                                                contentEditable={!!onInputChange}
                                                readOnly={true}
                                                borderRadius={"10px"}
                                                borderWidth={'2px'}
                                                color={results[currentIndex].check ? "green.500" : "red.500"}
                                                borderColor={results[currentIndex].check ? "green.500" : "red.500"}
                                                value={results[currentIndex].userAnswer}
                                            />
                                        </InputGroup>
                                        {!results[currentIndex].check &&
                                            <Text color={'green.500'} w={'50%'} fontWeight={'bold'}> → Correct: {answers ? answers[currentIndex] : null}</Text>}
                                    </Box> : null}

                                </Box>
                            })}
                        </Box>)
                    })}

                </GridItem>
            </Box>
        </SimpleGrid>
    )
}

export default PassageComponent;