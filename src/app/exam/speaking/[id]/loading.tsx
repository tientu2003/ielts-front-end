import {Box, Center, Skeleton} from "@chakra-ui/react";


const SpeakingLoading = () =>{
    return <Center pl={"2.5%"} pr={"2.5%"} pt={"1%"}>
        <Box w={'60%'}>
            <Skeleton h={'60vh'}/>
        </Box>
    </Center>
}

export default SpeakingLoading;