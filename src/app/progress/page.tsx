import {
    AbsoluteCenter,
    Box,
    Heading,
    HStack,
    Center,
    Text,
    SimpleGrid,
    Container,
    Tabs
} from "@chakra-ui/react";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {Avatar} from "@/components/ui/avatar";
import React from "react";
import TargetScore from "@/components/my-ui/progress/target-score";
import ReadingStatistic from "@/components/my-ui/progress/reading-statistic";
import ListeningStatistic from "@/components/my-ui/progress/listening-statistic";


export interface ReadingOverallType {
    userId: string;
    averageScore: number;
    allScores: AllScoresType[];
    personalRecommendation: string | null;
    nextTestId: string | null;
}

interface AllScoresType {
    timestamp: string;
    score: number;
}

export interface ListeningSummaryType{
    userId: string,
    averageScore: number,
    personalRecommendation: string|null,
    nextTestId: string,
    testName: string
}

const ProgressPage = async () => {
    const session = await getServerSession(authOptions)

    if (!session) {
        return (<Box>
            <AbsoluteCenter>
                <Heading>
                    Please login to access the practice exam!!
                </Heading>
            </AbsoluteCenter>
        </Box>)
    }

    try{
        // {{base_url}}/api/reading/user/{{user_id}}/review

        const readingResponse = await fetch(`${process.env.NEXT_PUBLIC_READING_SERVICE_URL}/api/reading/user/${session.decodedToken?.sub}/review`, {
            method: 'GET',  // Change to 'POST', 'PUT', or other methods as needed
            headers: {
                'Content-Type': 'application/json',  // Ensure the server knows you're sending JSON
                'Authorization': `Bearer ${session.access_token}`,  // Add Bearer token to the request headers
            }
        });

        const readingOverall: ReadingOverallType = await readingResponse.json();

        const listeningResponse = await fetch(`${process.env.NEXT_PUBLIC_LISTENING_SERVICE_URL}/api/listening/user/${session.decodedToken?.sub}/summary`, {
            method: 'GET',  // Change to 'POST', 'PUT', or other methods as needed
            headers: {
                'Content-Type': 'application/json',  // Ensure the server knows you're sending JSON
                'Authorization': `Bearer ${session.access_token}`,  // Add Bearer token to the request headers
            }
        });


        const listeningSummary:ListeningSummaryType = await listeningResponse.json();

        const targetScore = 9.0

        const averageReadingScore = convertToIELTSBand(readingOverall["averageScore"])
        const averageListeningScore  = convertToIELTSBand(listeningSummary.averageScore)

        const currentScore = convertToIELTSBand((averageReadingScore + averageListeningScore)/2)

        return (<Box pl={20} pr={20}>
            <Box borderRadius={'md'} borderWidth={1}>
                <SimpleGrid columns={{sm: 1, md: 4}} m={5} gap={10}>
                    <Box ml={20} w={120} h={120}>
                        <Avatar name={session?.user?.name as string} size={'full'} fontSize={'4xl'}/>
                        <Center>
                            <Heading>{session?.user?.name}</Heading>
                        </Center>
                    </Box>
                    <Box>
                        <HStack p={2}>
                            <Text fontWeight={'bold'}>Name:</Text>
                            <Text>
                                Nguyen Tien Tu
                            </Text>
                        </HStack>
                        <HStack p={2}>
                            <Text fontWeight={'bold'}>Date of Birth:</Text>
                            <Text>
                                25/01/2003
                            </Text>
                        </HStack>
                        <HStack p={2}>
                            <Text fontWeight={'bold'}>Address:</Text>
                            <Text>
                                Ha Noi, Viet Nam
                            </Text>
                        </HStack>
                        <HStack p={2}>
                            <Text fontWeight={'bold'}>Account Tier:</Text>
                            <Text>
                                Free
                            </Text>
                        </HStack>
                    </Box>

                    <Container centerContent={true}>
                        <Box borderRadius={100} w={100} h={100} borderWidth={10} borderColor={'blue.500'}>
                            <Center h={20}>
                                <Text color={'blue.500'} fontWeight={'bold'} fontSize={'4xl'}>
                                    {currentScore}
                                </Text>
                            </Center>
                        </Box>
                        <Heading>Current Band</Heading>
                    </Container>
                    <TargetScore targetScore={targetScore}/>
                </SimpleGrid>
            </Box>
            <Box mt={5} p={10} borderWidth={1} borderRadius={'md'}>
                <Tabs.Root variant={'outline'} defaultValue="reading">
                    <Tabs.List>
                        <Tabs.Trigger value="reading" asChild>
                            <Heading color={'green.500'} fontWeight={'bold'} fontSize={'xl'}>Reading</Heading>
                        </Tabs.Trigger>
                        <Tabs.Trigger value="listening" asChild>
                            <Heading color={'blue.500'} fontWeight={'bold'} fontSize={'xl'}>Listening</Heading>
                        </Tabs.Trigger>
                        <Tabs.Trigger value="writing" asChild>
                            <Heading color={'purple.500'} fontWeight={'bold'} fontSize={'xl'}>Writing</Heading>
                        </Tabs.Trigger>
                        <Tabs.Trigger value="speaking" asChild>
                            <Heading color={'orange'} fontWeight={'bold'} fontSize={'xl'}>Speaking</Heading>
                        </Tabs.Trigger>

                    </Tabs.List>
                    <Tabs.Content value="reading"> <ReadingStatistic data={readingOverall} session={session}/></Tabs.Content>
                    <Tabs.Content value="listening"><ListeningStatistic data={listeningSummary} session={session} /></Tabs.Content>
                    <Tabs.Content value="writing">Writing</Tabs.Content>
                    <Tabs.Content value="speaking">Speaking</Tabs.Content>
                </Tabs.Root>
            </Box>


        </Box>)
    }catch (e) {
        return (<AbsoluteCenter>
            Internal Error
        </AbsoluteCenter>)
    }



}
function convertToIELTSBand(score: number) {
    // Round to the nearest 0.5
    return Math.round(score * 2) / 2;
}

export default ProgressPage;