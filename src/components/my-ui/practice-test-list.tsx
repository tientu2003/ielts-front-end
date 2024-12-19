import {GridItem, Text, Container, Card, Grid, Heading, Button, Center, HStack, Flex, Box} from "@chakra-ui/react";
import {PiEmptyLight} from "react-icons/pi";
import {EmptyState} from "@/components/ui/empty-state";
import Link from "next/link";
import { MdOutlineStar } from "react-icons/md";export interface PracticeTestData {
    id: string,
    name: string,
    type: string
}

interface PracticeTestListProps {
    practiceData: PracticeTestData[]
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
        return (<Grid templateColumns="repeat(3, 1fr)" gap="6">
            {practiceData.map(data => <GridItem key={data.id}>
                <PracticeExamCard {...data}/>
            </GridItem>)}
        </Grid>)
    }
}

function PracticeExamCard({id, name, type}: PracticeTestData) {
    if(type === "listening"){
        return (<Card.Root>
            <Card.Header>
                <Flex justify={'space-between'}  direction={'row'}>
                    <Box pl={2} pr={2} pt={0.5} pb={0.5} borderRadius={'10px'} color={'blue.600'}
                         bg="blue.100">Listening</Box>
                    <Text>30 minutes</Text>
                </Flex>
            </Card.Header>
            <Card.Body>
                <Card.Title mt="2" fontSize={'2xl'}>{name}</Card.Title>
                <Card.Description>
                    Complete practice test with 4 sections and 40 questions.
                </Card.Description>
            </Card.Body>
            <Card.Footer display={'flex'} justifyContent={'space-between'}>
                <HStack gap={2}>
                    <MdOutlineStar color={'orange'} size={20}/>
                    <Text>4.7</Text>
                </HStack>
                <Link href={`/exam/listening/${id}`} passHref>
                    <Button variant={'ghost'} color={'blue.600'} fontSize={'xl'} fontWeight={'bold'}>Start</Button>
                </Link>
            </Card.Footer>
        </Card.Root>);
    }else if(type === "reading"){
        return (<Card.Root>
            <Card.Header>
                <Flex justify={'space-between'}  direction={'row'}>
                    <Box pl={2} pr={2} pt={0.5} pb={0.5} borderRadius={'10px'} color={'green.600'}
                         bg="green.100">Reading</Box>
                    <Text>60 minutes</Text>
                </Flex>
            </Card.Header>
            <Card.Body>
                <Card.Title mt="2" fontSize={'2xl'}>{name}</Card.Title>
                <Card.Description>
                    Practice test with 3 sections and passage-based questions.
                </Card.Description>
            </Card.Body>
            <Card.Footer display={'flex'} justifyContent={'space-between'}>
                <HStack gap={2}>
                    <MdOutlineStar color={'orange'} size={20}/>
                    <Text>4.8</Text>
                </HStack>
                <Link href={`/exam/reading/${id}`} passHref>
                    <Button variant={'ghost'} color={'blue.600'} fontSize={'xl'} fontWeight={'bold'}>Start</Button>
                </Link>
            </Card.Footer>
        </Card.Root>);
    }
    else if(type === "writing"){
        return (<Card.Root>
            <Card.Header>
                <Flex justify={'space-between'}  direction={'row'}>
                    <Box pl={2} pr={2} pt={0.5} pb={0.5} borderRadius={'10px'} color={'purple.600'}
                         bg="purple.100">Writing</Box>
                    <Text>60 minutes</Text>
                </Flex>
            </Card.Header>
            <Card.Body>
                <Card.Title mt="2" fontSize={'2xl'}>{name}</Card.Title>
                <Card.Description>
                    Complete writing test with graph analysis and essay.
                </Card.Description>
            </Card.Body>
            <Card.Footer display={'flex'} justifyContent={'space-between'}>
                <HStack gap={2}>
                    <MdOutlineStar color={'orange'} size={20}/>
                    <Text>4.5</Text>
                </HStack>
                <Link href={`/exam/writing/${id}`} passHref>
                    <Button variant={'ghost'} color={'blue.600'} fontSize={'xl'} fontWeight={'bold'}>Start</Button>
                </Link>
            </Card.Footer>
        </Card.Root>);
    }
    else if(type === "speaking"){
        return (<Card.Root>
            <Card.Header>
                <Flex justify={'space-between'}  direction={'row'}>
                    <Box pl={2} pr={2} pt={0.5} pb={0.5} borderRadius={'10px'} color={'orange.600'}
                         bg="orange.100">Speaking</Box>
                    <Text>15 minutes</Text>
                </Flex>
            </Card.Header>
            <Card.Body>
                <Card.Title mt="2" fontSize={'2xl'}>{name}</Card.Title>
                <Card.Description>
                    Practice all three parts of the speaking test.
                </Card.Description>
            </Card.Body>
            <Card.Footer display={'flex'} justifyContent={'space-between'}>
                <HStack gap={2}>
                    <MdOutlineStar color={'orange'} size={20}/>
                    <Text>4.7</Text>
                </HStack>
                <Link href={`/exam/speaking/${id}`} passHref>
                    <Button variant={'ghost'} color={'blue.600'} fontSize={'xl'} fontWeight={'bold'}>Start</Button>
                </Link>
            </Card.Footer>
        </Card.Root>);
    }
    else{
        return (<Card.Root>
            <Card.Header>
                <Center>
                    <Heading>Error!!</Heading>
                </Center>
            </Card.Header>
        </Card.Root>);
    }

}

export default PracticeTestList