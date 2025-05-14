import {
    GridItem,
    Text,
    Container,
    Card,
    Grid,
    Heading,
    Button,
    Center,
    HStack,
    Flex,
    Box
} from "@chakra-ui/react";
import {PiEmptyLight} from "react-icons/pi";
import {EmptyState} from "@/components/ui/empty-state";
import Link from "next/link";
import CEFRLevelDisplay, {CEFRLevel} from "@/components/my-ui/common/CEFRLevelDisplay";
import TopicsDisplay from "@/components/my-ui/common/TopicsDisplay";
import {useColorMode} from "@/components/ui/color-mode";
import { useState} from "react";
import React from "react";
export interface BasicExamData {
    id: string,
    testName: string,
    topics: string[],
    levels?: CEFRLevel[],
    type: string,
    task?: number
}

interface PracticeTestListProps {
    practiceData: BasicExamData[]
}

const PracticeTestList = ({practiceData}: PracticeTestListProps) => {
    if (practiceData.length === 0) {
        return <Container centerContent={true}>
            <EmptyState
                icon={<PiEmptyLight/>}
                title="No results found"
                description="Try adjusting your search"
            />
        </Container>

    } else {
        return <Grid templateColumns="repeat(3, 1fr)" gap="6" minH={'100%'}>
            {practiceData.map((data, index) => <GridItem key={data.id + data.type + index.toString()}>
                <PracticeExamCard {...data}/>
            </GridItem>)}
        </Grid>
    }
}

interface ExamCardConfig {
    color: string;
    bgColor: string;
    duration: string;
    effectColor: string;
}


function PracticeExamCard({id, testName, type, topics, levels, task}: BasicExamData) {
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
    const [isHovered, setIsHovered] = useState(false);
    const {colorMode} = useColorMode();

    const EXAM_CONFIGS: Record<string, ExamCardConfig> = {
        listening: {
            color: colorMode === 'dark' ? 'blue.200' : 'blue.600',
            bgColor: colorMode === 'dark' ? 'blue.800' : 'blue.100',
            duration: '30 minutes',
            effectColor: colorMode === 'dark' ? 'rgba(33,150,243,0.3)' : 'rgba(33,150,243,0.15)'
        },
        reading: {
            color: colorMode === 'dark' ? 'green.200' : 'green.600',
            bgColor: colorMode === 'dark' ? 'green.800' : 'green.100',
            duration: '60 minutes',
            effectColor: colorMode === 'dark' ? 'rgba(76,175,80,0.3)' : 'rgba(76,175,80,0.15)'
        },
        writing: {
            color: colorMode === 'dark' ? 'purple.200' : 'purple.600',
            bgColor: colorMode === 'dark' ? 'purple.800' : 'purple.100',
            duration: task === 1 ? '20 minutes' : '40 minutes',
            effectColor: colorMode === 'dark' ? 'rgba(156,39,176,0.3)' : 'rgba(156,39,176,0.15)'
        },
        speaking: {
            color: colorMode === 'dark' ? 'orange.200' : 'orange.600',
            bgColor: colorMode === 'dark' ? 'orange.800' : 'orange.100',
            duration: '15 minutes',
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

    if (!config) {
        return (
            <Card.Root>
                <Card.Header>
                    <Center>
                        <Heading>Error!!</Heading>
                    </Center>
                </Card.Header>
            </Card.Root>
        );
    }

    return (
        <Card.Root
            shadow={'md'}
            minH={'100%'}
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
                <Flex justify={'space-between'} direction={'row'}>
                    <Box
                        px={2}
                        py={0.5}
                        borderRadius={'10px'}
                        color={config.color}
                        bg={config.bgColor}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Box>
                    <Text>{config.duration}</Text>
                </Flex>
            </Card.Header>
            <Card.Title pl={'6%'} mt={2} mb={-3} fontSize={'xl'} maxW={'90%'}>{testName}</Card.Title>
            <Card.Body mb={'-5%'} mt={'-2.5%'}>
                <TopicsDisplay topics={topics}/>
            </Card.Body>
            <Card.Footer display={'flex'} justifyContent={'space-between'}>
                <HStack gap={2}>
                    {Array.from(new Set(levels)).sort((a, b) => ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(a) - ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(b)).map((level: CEFRLevel, index) =>
                        <CEFRLevelDisplay key={index.toString()} currentLevel={level}/>)}
                    {task != null && <Box
                        pl={2.5}
                        pr={2.5}
                        pt={0.5}
                        pb={0.5}
                        borderRadius="full"
                        bg={colorMode === 'dark' ? (task === 1 ? 'blue.800' : 'green.800') : (task === 1 ? 'blue.100' : 'green.100')}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color={colorMode === 'dark' ? 'white' : 'black'}
                        >
                            Task {task}
                        </Text>
                    </Box>}
                </HStack>
                <Link href={`/exam/${type}/${id}`} passHref>
                    <Button
                        variant={'ghost'}
                        color={'blue.600'}
                        fontSize={'xl'}
                        fontWeight={'bold'}
                    >
                        Start
                    </Button>
                </Link>
            </Card.Footer>
        </Card.Root>
    );
}

export default PracticeTestList