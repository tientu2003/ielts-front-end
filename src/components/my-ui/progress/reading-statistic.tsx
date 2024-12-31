import {
    SimpleGrid,
    Table,
    Stack,
    Heading,
    Text,
    Box,
    Container,
    Center,
    HStack,
    AbsoluteCenter
} from "@chakra-ui/react";
import {ReadingOverallType} from "@/app/progress/page";
import ReadingTableRow from "@/components/my-ui/progress/reading-table-row";
import ApexChart from "@/components/my-ui/progress/reading-chart";
import React from "react";
import {Session} from "next-auth";

export interface ReadingListType {
    id: string,
    recordId: string,
    createdAt: string,
    testName: string,
    score: number,
    data?: ReadingListType
}

interface ReadingStatisticProps {
    data: ReadingOverallType,
    session: Session,
}

const ReadingStatistic = async ({data,session}: ReadingStatisticProps) => {

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_READING_SERVICE_URL}/api/reading/user/${session.decodedToken?.sub}/answer`, {
            method: 'GET',  // Change to 'POST', 'PUT', or other methods as needed
            headers: {
                'Content-Type': 'application/json',  // Ensure the server knows you're sending JSON
                'Authorization': `Bearer ${session.access_token}`,  // Add Bearer token to the request headers
            }
        });

        const readingList: ReadingListType[] = await response.json();


        return (
            <SimpleGrid columns={{sm: 1, md: 2}} gap={5} pr={5}>
                <Stack width="full" gap="5">
                    <Heading size="xl">Reading Practice History</Heading>
                    <Table.ScrollArea borderWidth="1px" rounded="md" height="lg">
                        <Table.Root size="sm" variant="outline" interactive stickyHeader>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                                    <Table.ColumnHeader>Score</Table.ColumnHeader>
                                    <Table.ColumnHeader textAlign="end">Time</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {readingList.map((item) => (
                                    <ReadingTableRow data={item}/>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Table.ScrollArea>
                </Stack>
                <Stack>
                    <Heading>
                        Summary
                    </Heading>
                    <Box borderRadius={'md'} borderWidth={1} p={5} mt={2}>
                        <HStack mb={10}>
                            <Container centerContent={true}>
                                <Box borderRadius={100} w={100} h={100} borderWidth={10} borderColor={'green.400'}>
                                    <Center h={20}>
                                        <Text color={'green.400'} fontWeight={'bold'} fontSize={'4xl'}>
                                            {readingList.length}
                                        </Text>
                                    </Center>
                                </Box>
                                <Heading>Total Exam</Heading>
                            </Container>
                            <Container centerContent={true}>
                                <Box borderRadius={100} w={100} h={100} borderWidth={10} borderColor={'blue.400'}>
                                    <Center h={20}>
                                        <Text color={'blue.400'} fontWeight={'bold'} fontSize={'4xl'}>
                                            {convertToIELTSBand(data.averageScore)}
                                        </Text>
                                    </Center>
                                </Box>
                                <Heading>Average Score</Heading>
                            </Container>
                            <Container centerContent={true}>
                                <Box borderRadius={100} w={100} h={100} borderWidth={10} borderColor={'orange.500'}>
                                    <Center h={20}>
                                        <Text color={'orange.500'} fontWeight={'bold'} fontSize={'4xl'}>
                                            20h
                                        </Text>
                                    </Center>
                                </Box>
                                <Heading>Total Time</Heading>
                            </Container>
                        </HStack>
                        <ApexChart data={readingList}/>
                    </Box>

                </Stack>
            </SimpleGrid>
        )

    }catch (e) {
        return <AbsoluteCenter>
            Internal Error
        </AbsoluteCenter>
    }

}

function convertToIELTSBand(score: number) {
    // Round to the nearest 0.5
    return Math.round(score * 2) / 2;
}

export default ReadingStatistic;