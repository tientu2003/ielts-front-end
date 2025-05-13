import {
    AbsoluteCenter,
    Box, Button, Card,
    Center,
    Container,
    Heading,
    HStack,
    SimpleGrid,
    Stack,
    Table,
    Text
} from "@chakra-ui/react";
import {ListeningSummaryType} from "@/app/progress/page";
import {Session} from "next-auth";
import React from "react";
import ListeningTableRow from "@/components/my-ui/progress/listening/listening-table-row";
import Link from "next/link";

interface ListeningStatisticProps {
    data: ListeningSummaryType,
    session: Session
}
function convertToIELTSBand(score: number) {
    // Round to the nearest 0.5
    return Math.round(score * 2) / 2;
}

export interface ListeningListType   {
    id: string,
    name: string,
    score: number,
    date:  string
}
// '2025-01-02T10:29:05.803Z'

const ListeningStatistic = async ({data, session}: ListeningStatisticProps) => {

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_LISTENING_SERVICE_URL}/api/listening/user/answer`, {
            method: 'GET',  // Change to 'POST', 'PUT', or other methods as needed
            headers: {
                'Content-Type': 'application/json',  // Ensure the server knows you're sending JSON
                'Authorization': `Bearer ${session.access_token}`,  // Add Bearer token to the request headers
            }
        });

        const listeningList:ListeningListType[] = await response.json();

        return (
            <SimpleGrid columns={{sm: 1, md: 2}} gap={5} pr={5}>
                <Stack width="full" gap="5">
                    <Heading size="xl">Listening Practice History</Heading>
                    <Table.ScrollArea borderWidth="1px" rounded="md" height="xl">
                        <Table.Root size="sm" variant="outline" interactive stickyHeader>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                                    <Table.ColumnHeader>Score</Table.ColumnHeader>
                                    <Table.ColumnHeader textAlign="end">Time</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {listeningList.map((item) =>
                                    <ListeningTableRow data={item}  />
                                )}
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
                                            {listeningList.length}
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
                    </Box>

                </Stack>
                <Stack>
                    <Card.Root >
                        <Card.Header>
                            <Heading>Next Practice</Heading>
                        </Card.Header>
                        <Card.Body>
                            <HStack>
                                <Heading>{data.testName}</Heading>
                                <Link href={`/exam/listening/${data.nextTestId}`}>
                                    <Button variant={'ghost'} color={'blue.500'} fontWeight={'bold'} fontSize={'xl'}>
                                        Start
                                    </Button>
                                </Link>
                            </HStack>
                        </Card.Body>
                    </Card.Root>
                </Stack>
            </SimpleGrid>
        )

    }catch (e) {
        return <AbsoluteCenter>
            Internal Error
        </AbsoluteCenter>
    }
}

export default ListeningStatistic;