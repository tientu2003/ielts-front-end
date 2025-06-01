import {Box, HStack, Skeleton} from "@chakra-ui/react";


const WritingLoading = () =>{
    return <HStack pl={"2.5%"} pr={"2.5%"} pt={"1%"}>
        <Box w={'80%'}>
            <Skeleton h={'80vh'}/>
        </Box>
        <Box w={'80%'}>
            <Skeleton h={'80vh'}/>
        </Box>
    </HStack>
}

export default WritingLoading;