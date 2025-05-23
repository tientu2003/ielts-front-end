'use client'
import {SpeakingDetailResult} from "@/components/util/speaking-types";
import {Box, VStack, Heading, Text, Button} from "@chakra-ui/react";
import {useState} from "react";

interface SpeakingResultProps {
    data: SpeakingDetailResult;
}

const SpeakingResult = ({data}: SpeakingResultProps) => {
    const [isPlaying, setIsPlaying] = useState<string>("");

    const playAudio = async (blobUrl: string) => {
        try {
            const response = await fetch(`/api/blob/download?blobUrl=${encodeURIComponent(blobUrl)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch audio');
            }
            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);

            setIsPlaying(blobUrl);
            audio.onended = () => {
                setIsPlaying("");
                URL.revokeObjectURL(audioUrl);
            };

            await audio.play();
        } catch (error) {
            console.error("Error playing audio:", error);
        }
    };

    return (
        <VStack p={8}>
            <Heading size="lg">{data.testName}</Heading>
            <Text fontSize="xl">Overall Score: {data.score}</Text>

            <Box w="full">
                <Heading size="md" mb={4}>Part 1</Heading>
                {data.partOne.map((answer) => (
                    <Box key={answer.number} mb={4} p={4} borderWidth={1} borderRadius="lg">
                        <Text fontWeight="bold">Question {answer.number}: {answer.question}</Text>
                        <Text mb={2}>Topic: {answer.topic}</Text>
                        <Button
                            onClick={() => playAudio(answer.url)}
                            loading={isPlaying === answer.url}
                        >
                            {isPlaying === answer.url ? "Playing..." : "Play Recording"}
                        </Button>
                    </Box>
                ))}
            </Box>

            <Box w="full">
                <Heading size="md" mb={4}>Part 2</Heading>
                <Box p={4} borderWidth={1} borderRadius="lg">
                    <Text fontWeight="bold">Topic: {data.partTwo.topic}</Text>
                    <Text mb={2}>{data.partTwo.question}</Text>
                    <Button
                        onClick={() => playAudio(data.partTwo.url)}
                        loading={isPlaying === data.partTwo.url}
                    >
                        {isPlaying === data.partTwo.url ? "Playing..." : "Play Recording"}
                    </Button>
                </Box>
            </Box>

            <Box w="full">
                <Heading size="md" mb={4}>Part 3</Heading>
                {data.partThree.map((answer) => (
                    <Box key={answer.number} mb={4} p={4} borderWidth={1} borderRadius="lg">
                        <Text fontWeight="bold">Question {answer.number}: {answer.question}</Text>
                        <Text mb={2}>Topic: {answer.topic}</Text>
                        <Button
                            onClick={() => playAudio(answer.url)}
                            loading={isPlaying === answer.url}
                        >
                            {isPlaying === answer.url ? "Playing..." : "Play Recording"}
                        </Button>
                    </Box>
                ))}
            </Box>
        </VStack>
    );
};

export default SpeakingResult;