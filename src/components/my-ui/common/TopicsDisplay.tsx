'use client'
import { Text } from "@chakra-ui/react";
import {useColorMode} from "@/components/ui/color-mode";

interface TopicsDisplayProps {
    topics: string[],
    fontSize?: string,
}



const TopicsDisplay = ({topics, fontSize}: TopicsDisplayProps) => {
    // write a function to get color from topic
    const getTopicColor = (topic: string): string => {
        let hash = 0;
        for (let i = 0; i < topic.length; i++) {
            hash = topic.charCodeAt(i) + ((hash << 5) - hash);
        }

        const hue = Math.abs(hash % 360);
        const saturation = 70;
        const lightness = useColorMode().colorMode === 'dark' ? 60 : 45;

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    topics = Array.from(new Set(topics))
    return <Text
            fontSize={  fontSize ? fontSize :'sm'}
            fontWeight={'bold'}
            textOverflow="ellipsis"
            overflow="hidden"
            display="flex"
            flexWrap="wrap"
        >
            {topics.map((topic, index) => (
                <Text
                    as="span"
                    key={topic}
                    color={getTopicColor(topic)}
                >
                    {topic.charAt(0).toUpperCase() + topic.slice(1)}
                    {index < topics.length - 1 && ' •\u00A0'}
                </Text>
            ))}
        </Text>
}

export default TopicsDisplay