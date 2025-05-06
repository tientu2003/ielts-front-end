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
            {practiceData.map((data, index) => <GridItem key={data.id + data.type + index.toString()} >
                <PracticeExamCard {...data}/>
            </GridItem>)}
        </Grid>
    }
}

interface ExamCardConfig {
    color: string;
    bgColor: string;
    duration: string;
}


function PracticeExamCard({id, testName, type, topics, levels, task}: BasicExamData) {

    const EXAM_CONFIGS: Record<string, ExamCardConfig> = {
        listening: {
            color: useColorMode().colorMode === 'dark' ? 'blue.200' : 'blue.600',
            bgColor: useColorMode().colorMode === 'dark' ? 'blue.800' : 'blue.100',
            duration: '30 minutes'
        },
        reading: {
            color: useColorMode().colorMode === 'dark' ? 'green.200' : 'green.600',
            bgColor: useColorMode().colorMode === 'dark' ? 'green.800' : 'green.100',
            duration: '60 minutes'
        },
        writing: {
            color: useColorMode().colorMode === 'dark' ? 'purple.200' : 'purple.600',
            bgColor: useColorMode().colorMode === 'dark' ? 'purple.800' : 'purple.100',
            duration: task === 1 ? '20 minutes' : '40 minutes'
        },
        speaking: {
            color: useColorMode().colorMode === 'dark' ? 'orange.200' : 'orange.600',
            bgColor: useColorMode().colorMode === 'dark' ? 'orange.800' : 'orange.100',
            duration: '15 minutes'
        }
    };

    const config = EXAM_CONFIGS[type];

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
        <Card.Root shadow={'md'} minH={'100%'}>
            <Card.Header>
                <Flex justify={'space-between'} direction={'row'}>
                    <Box
                        pl={2}
                        pr={2}
                        pt={0.5}
                        pb={0.5}
                        borderRadius={'10px'}
                        color={config.color}
                        bg={config.bgColor}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Box>
                    <Text>{config.duration}</Text>
                </Flex>
            </Card.Header>
            <Card.Title pl ={'6%'} mt={2} mb={-3} fontSize={'xl'} maxW={'90%'}>{testName}</Card.Title>
            <Card.Body mb={'-5%'} mt={'-2.5%'}>
                <TopicsDisplay topics={topics}/>
            </Card.Body>
            <Card.Footer display={'flex'} justifyContent={'space-between'}>
                <HStack gap={2}>
                    {Array.from(new Set(levels)).sort((a, b) => ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(a) - ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(b)).map((level, index) =>
                        <CEFRLevelDisplay key={index.toString()} currentLevel={level}/>)}
                    {task != null && <Box
                            pl={2.5}
                            pr={2.5}
                            pt={0.5}
                            pb={0.5}
                            borderRadius="full"
                            bg={useColorMode().colorMode === 'dark' ? (task === 1 ? 'blue.800' : 'green.800') : (task === 1 ? 'blue.100' : 'green.100')}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Text
                                fontSize="sm"
                                fontWeight="bold"
                                color={useColorMode().colorMode === 'dark' ? 'white' : 'black'}
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