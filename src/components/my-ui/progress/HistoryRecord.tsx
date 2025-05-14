'use client'
import {Box, Card, Flex, Heading} from "@chakra-ui/react";
import {HistoryData} from "@/app/dashboard/history/page";
import {useColorMode} from "@/components/ui/color-mode";
import React, {useState} from 'react';
import TopicsDisplay from "@/components/my-ui/common/TopicsDisplay";

interface HistoryRecordCard {
    color: string;
    bgColor: string;
    effectColor: string;
}

const HistoryRecord = ({id, name, score, topics, date, type}: HistoryData) => {
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
    const [isHovered, setIsHovered] = useState(false);
    const {colorMode} = useColorMode();

    const EXAM_CONFIGS: Record<string, HistoryRecordCard> = {
        listening: {
            color: colorMode === 'dark' ? 'blue.200' : 'blue.600',
            bgColor: colorMode === 'dark' ? 'blue.800' : 'blue.100',
            effectColor: colorMode === 'dark' ? 'rgba(33,150,243,0.3)' : 'rgba(33,150,243,0.15)'
        },
        reading: {
            color: colorMode === 'dark' ? 'green.200' : 'green.600',
            bgColor: colorMode === 'dark' ? 'green.800' : 'green.100',
            effectColor: colorMode === 'dark' ? 'rgba(76,175,80,0.3)' : 'rgba(76,175,80,0.15)'
        },
        writing: {
            color: colorMode === 'dark' ? 'purple.200' : 'purple.600',
            bgColor: colorMode === 'dark' ? 'purple.800' : 'purple.100',
            effectColor: colorMode === 'dark' ? 'rgba(156,39,176,0.3)' : 'rgba(156,39,176,0.15)'
        },
        speaking: {
            color: colorMode === 'dark' ? 'orange.200' : 'orange.600',
            bgColor: colorMode === 'dark' ? 'orange.800' : 'orange.100',
            effectColor: colorMode === 'dark' ? 'rgba(255,152,0,0.3)' : 'rgba(255,152,0,0.15)'
        }
    };

    const config = EXAM_CONFIGS[type];

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!isHovered) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        });
    };

    return <a href={'/result/' + type + '/' + id} style={{width: '100%'}}>
        <Card.Root
            shadow={'md'}
            p={'2%'}
            mt={'1'}
            w={'full'}
            position={'relative'}
            overflow={'hidden'}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            _before={{
                content: '""',
                position: 'absolute',
                width: '250px',
                height: '250px',
                background: `radial-gradient(circle, ${config.effectColor} 20%, transparent 70%)`,
                borderRadius: '50%',
                transform: `translate(${mousePosition.x - 125}px, ${mousePosition.y - 125}px)`,
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
                zIndex: 0
            }}
        >
            <Box
                pl={2}
                pr={2}
                pt={0.5}
                pb={0.5}
                borderRadius={'10px'}
                color={config.color}
                bg={config.bgColor}
                w={'fit-content'}
                fontWeight={'semibold'}
                fontSize={'lg'}
            >
                {type.charAt(0).toUpperCase() + type.slice(1)}
            </Box>
            <Flex justifyContent={'space-between'} alignItems={'center'}>
                <Box>
                    <Heading mb={1}>
                        {name}
                    </Heading>
                    <TopicsDisplay topics={topics}/>
                </Box>
                <Box textAlign={'right'}>
                    <Box
                        fontSize={'4xl'}
                        fontWeight={'bold'}
                        color={score >= 8 ? 'green.500' : score >= 6.5 ? 'blue.500' : score >= 5? 'orange' : 'red.500'}
                    >
                        {score}
                    </Box>
                    <Box colorPalette={'gray.500'}>
                        {date}
                    </Box>
                </Box>
            </Flex>
        </Card.Root>
    </a>
}

export default HistoryRecord;