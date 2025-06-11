'use client'
import {Summary} from "@/components/util/type-def";
import TpiComponent from "@/components/my-ui/progress/TpiComponent";
import {Box, Card, Flex, Button, Text, HStack, VStack, Heading, List} from "@chakra-ui/react";
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

    // Enhanced function to parse and render the recommendation text
    const renderRecommendationContent = (content: string) => {
        const lines = content.split('\n').filter(line => line.trim() !== '');
        const elements: React.ReactNode[] = [];
        let listItems: React.ReactNode[] = [];
        let inList = false;

        const isHeader = (line: string) => {
            const trimmed = line.trim();
            return (trimmed.startsWith('**') && trimmed.endsWith('**'));
        };

        const renderTextWithFormatting = (text: string) => {
            const parts = text.split(/(\*\*[^*]+\*\*)/g);
            return parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                        <Text key={index} as="span" fontWeight="bold">
                            {part.replace(/\*\*/g, '')}
                        </Text>
                    );
                }
                return part;
            });
        };

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();

            if (isHeader(trimmedLine)) {
                // Close any open list
                if (inList && listItems.length > 0) {
                    elements.push(
                        <List.Root key={`list-${index}`} mb={4}>
                            {listItems}
                        </List.Root>
                    );
                    listItems = [];
                    inList = false;
                }

                const headerText = trimmedLine.replace(/\*\*/g, '');
                elements.push(
                    <Heading
                        key={`header-${index}`}
                        size="2xl"
                        mb={3}
                        mt={index > 0 ? 6 : 0}
                        color={config.color}
                    >
                        {headerText}
                    </Heading>
                );
            }
            // Handle numbered list items
            else if (/^\d+\.\s/.test(trimmedLine)) {
                if (!inList) {
                    inList = true;
                }

                const listContent = trimmedLine.replace(/^\d+\.\s/, '');
                listItems.push(
                    <List.Item key={`list-item-${index}`} mb={2} ml={5}>
                        <Text>{renderTextWithFormatting(listContent)}</Text>
                    </List.Item>
                );
            }
            // Handle regular paragraphs
            else if (trimmedLine.length > 0) {
                // Close any open list
                if (inList && listItems.length > 0) {
                    elements.push(
                        <List.Root key={`list-${index}`} mb={4}>
                            {listItems}
                        </List.Root>
                    );
                    listItems = [];
                    inList = false;
                }

                elements.push(
                    <Text key={`text-${index}`} mb={3} lineHeight="1.6">
                        {renderTextWithFormatting(trimmedLine)}
                    </Text>
                );
            }
        });

        // Close any remaining open list
        if (inList && listItems.length > 0) {
            elements.push(
                <List.Root key="final-list" mb={4}>
                    {listItems}
                </List.Root>
            );
        }

        return elements;
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
        {/* Use the sample listening recommendation instead of data.personalRecommendation */}
        <Card.Root mt={'2.5%'} shadow={'md'} w={'100%'}>
            <Card.Header>
                <HStack direction={'row'} mb={4}>
                    <FaRobot size={50}/>
                    <Text fontSize={'2xl'} fontWeight={'bold'}>
                        AI-Based Recommendation
                    </Text>
                </HStack>
            </Card.Header>
            <Card.Body pt={0}>
                <VStack align="start">
                    {renderRecommendationContent(data.personalRecommendation)}
                </VStack>
            </Card.Body>
        </Card.Root>
    </Box>
}

export default SuggestionComponent;