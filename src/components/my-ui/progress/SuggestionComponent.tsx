'use client'
import {Summary} from "@/components/util/type-def";
import TpiComponent from "@/components/my-ui/progress/TpiComponent";
import {Box, Card, Flex, Button, Text, HStack} from "@chakra-ui/react";
import React, {useState} from "react";
import {useColorMode} from "@/components/ui/color-mode";
import TopicsDisplay from "@/components/my-ui/common/TopicsDisplay";
import Link from "next/link";
import {FaRobot} from "react-icons/fa";


interface SuggestionComponentProps {
    data: Summary,
    skill: string,
}

interface SuggestionCardConfig {
    color: string;
    bgColor: string;
    effectColor: string;
    duration: string;
}

const SuggestionComponent = ({data, skill}: SuggestionComponentProps) => {
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
    const [isHovered, setIsHovered] = useState(false);
    const {colorMode} = useColorMode();

    const EXAM_CONFIGS: Record<string, SuggestionCardConfig> = {
        Listening: {
            color: colorMode === 'dark' ? 'blue.200' : 'blue.600',
            bgColor: colorMode === 'dark' ? 'blue.800' : 'blue.100',
            effectColor: colorMode === 'dark' ? 'rgba(33,150,243,0.3)' : 'rgba(33,150,243,0.15)',
            duration: '60 minutes'
        },
        Reading: {
            color: colorMode === 'dark' ? 'green.200' : 'green.600',
            bgColor: colorMode === 'dark' ? 'green.800' : 'green.100',
            effectColor: colorMode === 'dark' ? 'rgba(76,175,80,0.3)' : 'rgba(76,175,80,0.15)',
            duration: '30 minutes'
        },
        Writing: {
            color: colorMode === 'dark' ? 'purple.200' : 'purple.600',
            bgColor: colorMode === 'dark' ? 'purple.800' : 'purple.100',
            effectColor: colorMode === 'dark' ? 'rgba(156,39,176,0.3)' : 'rgba(156,39,176,0.15)',
            duration: '60 minutes'
        },
        Speaking: {
            color: colorMode === 'dark' ? 'orange.200' : 'orange.600',
            bgColor: colorMode === 'dark' ? 'orange.800' : 'orange.100',
            effectColor: colorMode === 'dark' ? 'rgba(255,152,0,0.3)' : 'rgba(255,152,0,0.15)',
            duration: '15 minutes'
        }
    };

    const config = EXAM_CONFIGS[skill];

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!isHovered) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        });
    };

    return <Box>
        <Flex justify={'space-between'} mt={'2.5%'} direction={'row'} w={'100%'} gap={5}>
            <Card.Root
                shadow={'md'}
                p={'2%'}
                w={'60%'}
                mt={'1'}
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
                <Card.Header>
                    <Box fontWeight={'semibold'} fontSize={'lg'}>Based on your {skill} performance analysis, we
                        recommend the following assessment for optimal
                        skill development</Box>
                    <Box
                        pl={2}
                        pr={2}
                        pt={0.5}
                        pb={0.5}
                        borderRadius={'10px'}
                        color={config.color}
                        bg={config.bgColor}
                        w={'fit'}
                    >
                        {skill}
                    </Box>
                </Card.Header>
                <Card.Title pl={'4%'} mt={2} mb={-3} fontSize={'xl'} maxW={'90%'}>{data.testName}</Card.Title>
                <Card.Body mt={'-2.5%'}>

                    <TopicsDisplay topics={data.topics}/>
                    <Link href={`/exam/${skill.toLowerCase()}/${data.nextTestId}`} passHref>
                        <Button
                            variant={'ghost'}
                            color={'blue.600'}
                            fontSize={'xl'}
                            fontWeight={'bold'}
                        >
                            Start
                        </Button>
                    </Link>
                </Card.Body>
            </Card.Root>
            <TpiComponent data={data.skillLanguageProficiency} skill={skill} size={'40%'}/>
        </Flex>
        {data.personalRecommendation &&
        <Card.Root mt={'2.5%'} shadow={'md'} w={'100%'}>
            <Card.Header>
                <HStack direction={'row'}>
                    <FaRobot size={50}/>
                    <Text fontSize={'2xl'} fontWeight={'bold'}>
                        AI-Based Recommendation
                    </Text>
                </HStack>
                <Card.Body >
                    <Text fontSize={'xl'}>
                        {data.personalRecommendation}
                    </Text>
                </Card.Body>
            </Card.Header>
        </Card.Root>}
    </Box>


}

export default SuggestionComponent;