import {Box, Container, GridItem, SimpleGrid, Text} from "@chakra-ui/react";
const ReadingExamPage = async ({params,}:
                               { params: Promise<{ id: string }>})  =>{
    const id = (await params).id
    return (
        <SimpleGrid columns={2} h={'3xl'} p={5} divideX={'2px'} >
            <GridItem>
                asds
            </GridItem>
            <GridItem>
                asdsadsa
            </GridItem>
            <Text>asdfdfd</Text>
        </SimpleGrid>
    )
}

export default ReadingExamPage;