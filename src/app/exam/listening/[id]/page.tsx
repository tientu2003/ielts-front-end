import {Box, Container, GridItem, SimpleGrid, Text} from "@chakra-ui/react";
import AudioPlayer from "@/components/my-ui/listening/audio-player";
const ReadingExamPage = async ({params,}:
                               { params: Promise<{ id: string }>})  =>{
    const id = (await params).id
    return (
        <SimpleGrid columns={2} h={'3xl'} p={5} divideX={'2px'} >
            <GridItem>
                <AudioPlayer src={'https://s4-media1.study4.com/media/ielts_media/sound/03_IELTS-Recent-Actual-Test-With-Answers-Practice-Test-29-Section3.mp3'}/>
            </GridItem>
            <GridItem>
                asdsadsa
            </GridItem>
            <Text>asdfdfd</Text>
        </SimpleGrid>
    )
}

export default ReadingExamPage;