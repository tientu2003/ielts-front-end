import {Box, Center, Skeleton} from "@chakra-ui/react";


const ResultLoading = () => {
    return <Center pl={"2.5%"} pr={"2.5%"} pt={"1%"}>
        <Box w={'80%'}>
            <Skeleton h={'80vh'}/>
        </Box>
    </Center>
}

export default ResultLoading;