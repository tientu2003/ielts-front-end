import {AbsoluteCenter, Container, Heading, Spinner} from "@chakra-ui/react";

const LoadingComponent = () => {
    return  <AbsoluteCenter>
        <Container centerContent={true} gap={10}>
            <Spinner size="xl" color="teal.500"/>
            <Heading fontSize={'4xl'}>
                Loading...
            </Heading>
        </Container>
    </AbsoluteCenter>
}


export default LoadingComponent