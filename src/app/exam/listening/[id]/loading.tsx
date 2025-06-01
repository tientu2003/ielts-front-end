import {Center, Box, Stack} from "@chakra-ui/react";
import {SkeletonText, Skeleton} from "@chakra-ui/react"

const ListeningLoading = () => {
    return <Stack>
        <Center mt={'2.5%'}>
            <Box w={'80%'}>
                <SkeletonText noOfLines={1} h={'50px'}/>
            </Box>
        </Center>
        <Center>
            <Box w={'80%'}>
                <Skeleton h={'70vh'}/>
            </Box>
        </Center>

    </Stack>
}

export default ListeningLoading;