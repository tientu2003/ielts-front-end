
'use client'
import {SpeakingDetailResult} from "@/components/util/speaking-types";
import {Box, VStack, Heading, Text, Accordion, Flex} from "@chakra-ui/react";
import {useState, useEffect} from "react";
import {IoIosArrowDown} from "react-icons/io";

interface SpeakingResultProps {
    data: SpeakingDetailResult;
}

const SpeakingResult = ({data}: SpeakingResultProps) => {
    const [audioUrls, setAudioUrls] = useState<{[key: string]: string}>({});

    const loadAudioUrl = async (blobUrl: string): Promise<string> => {
        // Check if we already have this audio URL cached
        if (audioUrls[blobUrl]) {
            return audioUrls[blobUrl];
        }

        try {
            const response = await fetch(`/api/blob/download?blobUrl=${encodeURIComponent(blobUrl)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch audio');
            }
            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);

            // Cache the URL
            setAudioUrls(prev => ({...prev, [blobUrl]: audioUrl}));

            return audioUrl;
        } catch (error) {
            console.error("Error loading audio:", error);
            return "";
        }
    };

    // Cleanup URLs when component unmounts
    useEffect(() => {
        return () => {
            Object.values(audioUrls).forEach(url => {
                URL.revokeObjectURL(url);
            });
        };
    }, [audioUrls]);

    const AudioPlayer = ({blobUrl}: {blobUrl: string}) => {
        const [audioSrc, setAudioSrc] = useState<string>("");
        const [isLoading, setIsLoading] = useState<boolean>(false);

        const handleLoadAudio = async () => {
            if (audioSrc) return; // Already loaded

            setIsLoading(true);
            const url = await loadAudioUrl(blobUrl);
            setAudioSrc(url);
            setIsLoading(false);
        };

        // Auto-load audio when accordion is opened
        useEffect(() => {
            handleLoadAudio();
        }, []);

        return (
            <Box mt={2}>
                {!audioSrc ? (
                    <Text color="gray.500" fontSize="sm">
                        {isLoading ? 'Loading audio...' : 'Audio will load when expanded'}
                    </Text>
                ) : (
                    <audio
                        controls
                        style={{width: '100%', marginTop: '8px'}}
                        preload="metadata"
                    >
                        <source src={audioSrc} type="audio/mpeg" />
                        <source src={audioSrc} type="audio/wav" />
                        <source src={audioSrc} type="audio/ogg" />
                        Your browser does not support the audio element.
                    </audio>
                )}
            </Box>
        );
    };

    const createAccordionItems = () => {
        const items = [];

        // Part One items
        if (data.partOne && data.partOne.length > 0) {
            data.partOne.forEach((answer) => {
                items.push({
                    value: `part1-${answer.number}`,
                    title: `Part 1 - Question ${answer.number}`,
                    question: answer.question,
                    topic: answer.topic,
                    url: answer.url
                });
            });
        }

        // Part Two item
        if (data.partTwo) {
            items.push({
                value: 'part2',
                title: 'Part 2 - Long Turn',
                question: data.partTwo.question,
                topic: data.partTwo.topic,
                url: data.partTwo.url
            });
        }

        // Part Three items
        if (data.partThree && data.partThree.length > 0) {
            data.partThree.forEach((answer) => {
                items.push({
                    value: `part3-${answer.number}`,
                    title: `Part 3 - Question ${answer.number}`,
                    question: answer.question,
                    topic: answer.topic,
                    url: answer.url
                });
            });
        }

        return items;
    };

    const accordionItems = createAccordionItems();

    return (
        <VStack p={8} m={6}>
            <VStack m={6}>
                <Heading size="lg" color="blue.600">{data.testName}</Heading>
                <Text fontSize="xl" fontWeight="semibold">Overall Score: {data.score}</Text>
            </VStack>

            <Box w="full">
                <Accordion.Root collapsible defaultValue={[]} variant="enclosed">
                    {accordionItems.map((item) => (
                        <Accordion.Item key={item.value} value={item.value}>
                            <Accordion.ItemTrigger>
                                <Flex
                                    justify="space-between"
                                    alignItems="center"
                                    width="full"
                                    borderColor="blue.500"
                                    borderWidth={1}
                                    borderRadius="md"
                                    p={3}
                                    bg="blue.50"
                                    _dark={{
                                        bg: 'blue.900',
                                        _hover: {bg: 'blue.800'}
                                    }}
                                    _light={{
                                        bg: 'blue.50',
                                        _hover: {bg: 'blue.100'}
                                    }}
                                    cursor="pointer"
                                    transition="all 0.2s"
                                >
                                    <VStack align="start" m={1}>
                                        <Text fontWeight="bold" color="blue.700">
                                            {item.title}
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">
                                            Topic: {item.topic}
                                        </Text>
                                    </VStack>
                                    <Accordion.ItemIndicator>
                                        <IoIosArrowDown/>
                                    </Accordion.ItemIndicator>
                                </Flex>
                            </Accordion.ItemTrigger>
                            <Accordion.ItemContent>
                                <Accordion.ItemBody>
                                    <Box p={4} bg="gray.50" borderRadius="md" mt={2}>
                                        <Text fontWeight="bold" mb={2}>
                                            Question: {item.question}
                                        </Text>
                                        <Text mb={3} color="gray.600">
                                            Topic: {item.topic}
                                        </Text>
                                        <AudioPlayer blobUrl={item.url} />
                                    </Box>
                                </Accordion.ItemBody>
                            </Accordion.ItemContent>
                        </Accordion.Item>
                    ))}
                </Accordion.Root>
            </Box>
        </VStack>
    );
};

export default SpeakingResult;