import {Box,  Skeleton, HStack} from "@chakra-ui/react";


const ReadingLoading = () =>{
    return <HStack mt={'2.5%'}>
        <Box w={'80%'}>
            <Skeleton h={'70vh'}/>
        </Box>
        <Box w={'80%'}>
            <Skeleton h={'70vh'}/>
        </Box>
    </HStack>
}

export default ReadingLoading;