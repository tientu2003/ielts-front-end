import {
    Text,
    Flex,
    Heading,
    Image,
    SimpleGrid,
    Stack,
    Box,
    Center,
    Card , Link
} from "@chakra-ui/react"
import {Container} from "@chakra-ui/react"
import React from "react";
import {Button} from "@/components/ui/button";
import '@fontsource/dancing-script'; // Import the Dancing Script font
import '@fontsource/lexend'; // Import Lexend font
import {Rating} from "@/components/ui/rating"
import Footer from "@/components/my-ui/footer";
import TopNav from "@/components/my-ui/top-nav";

const data = [{
    name: "Liam",
    time: "Sep 2023",
    rating: 5,
    comment: "The best IELTS preparation course I've ever used. It's really helped me improve my reading," +
        " writing, speaking, and listening skills."
},
    {
        name: "Jia",
        time: "Aug 2023",
        rating: 5,
        comment: "This is the best online English course! The practice tests are so realistic, " +
            "and the feedback I got from the teachers was really helpful."
    },
    {
        name: "Adam",
        time: "Jul 2023",
        rating: 5,
        comment: "I'm so happy I found this course. The practice tests are challenging, the teachers are really knowledgeable," +
            " and the study plans are great. I've already seen a big improvement in my scores."
    }
]


export default function Home() {
    return (
        <div>
            <main>
                <Stack fontFamily='Lexend'>
                    <TopNav/>
                    <Container>
                        <Container centerContent={true}>
                            <Image rounded="md" src="/assets/welcome.png" alt="Welcome" width="70%"/>
                        </Container>
                        <Box marginLeft={10} marginTop={10}>
                            <Heading fontSize="5xl" padding={2} >
                                Why choose English Master?
                            </Heading>
                            <Text maxWidth={'7xl'} fontSize="2xl" padding={2}>
                                We are the only online IELTS prep course offering a truly personalized learning
                                experience,
                                featuring expert feedback, full-length practice tests, and more, all designed to help
                                you achieve your target IELTS score.
                            </Text>
                        </Box>
                        <Box marginTop={20}>
                            <Center>
                                <Heading fontSize="5xl" padding={2} color={'teal.500'}>
                                    Key Features
                                </Heading>
                            </Center>
                            <SimpleGrid marginTop={20} columns={4} padding={2} gap={3}>
                                <Card.Root variant={'elevated'}>
                                    <Card.Header>
                                        <Image borderRadius={15} src={'assets/practice-test.png'}/>
                                    </Card.Header>
                                    <Card.Body>
                                        <Heading>
                                            Practice Tests
                                        </Heading>
                                        <Text>
                                            Get 100% realistic IELTS practice tests, learn how to improve your score
                                            with detailed feedback.
                                        </Text>
                                    </Card.Body>
                                </Card.Root>
                                <Card.Root variant={'elevated'}>
                                    <Card.Header>
                                        <Image borderRadius={15} src={'assets/feedback.png'}/>
                                    </Card.Header>
                                    <Card.Body>
                                        <Heading>
                                            Expert Feedback
                                        </Heading>
                                        <Text>
                                            Get detailed feedback on your writing and speaking from an IELTS teacher.
                                        </Text>
                                    </Card.Body>
                                </Card.Root>
                                <Card.Root variant={'elevated'}>
                                    <Card.Header>
                                        <Image src={'assets/progress-tracking.png'}/>
                                    </Card.Header>
                                    <Card.Body>
                                        <Heading>
                                            Progress Tracking
                                        </Heading>
                                        <Text>
                                            Track your progress over time and see how you're improving.
                                        </Text>
                                    </Card.Body>
                                </Card.Root>
                                <Card.Root variant={'elevated'}>
                                    <Card.Header>
                                        <Image borderRadius={15} src={'assets/guided-study.png'}/>
                                    </Card.Header>
                                    <Card.Body>
                                        <Heading>
                                            Guided Study
                                        </Heading>
                                        <Text>
                                            Follow one of our study plans or create your own - the choice is yours.
                                        </Text>
                                    </Card.Body>
                                </Card.Root>

                            </SimpleGrid>
                        </Box>

                        <Box marginTop={20}>
                            <Heading fontSize="5xl" padding={2} color={'teal.500'}>
                                What our students say
                            </Heading>
                            <Flex direction="column" marginTop={10} gap={10}>

                                {data.map((review, index) => (
                                    <StudentReview key={index} props={review}/>
                                ))}
                            </Flex>
                        </Box>
                    </Container>
                    <Container centerContent={true} gap={2} marginTop={20} marginBottom={20}>
                        <Heading fontSize="6xl" padding={2} color={'teal.500'}>
                            Ready to master English?
                        </Heading>
                        <Text>
                            Join thousands of students who are preparing for success with English Master.
                        </Text>
                            <Link href={"/auth/login"} style={{ textDecoration: "none" }}>
                                <Button colorPalette={'teal'} padding={7}>
                                    <Heading size={'4xl'} >
                                        Start now
                                    </Heading>
                                </Button>
                            </Link>
                    </Container>
                </Stack>

            </main>
            <footer>
                <Footer/>
            </footer>
        </div>
    );
}


function StudentReview({props}: { props: { name: string, time: string, rating: number, comment: string } }) {
    return <Card.Root variant="outline">
        <Card.Body>
            <Heading fontSize="2xl" color="teal.500">{props.name}</Heading>
            <Text fontSize="sm" color="gray.500">{props.time}</Text>
            <Rating value={props.rating} colorPalette={'yellow'}/>
            <Text marginTop={4}>{props.comment}</Text>
        </Card.Body>
    </Card.Root>
}
