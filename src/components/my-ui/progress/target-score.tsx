'use client'
import {Box, Button, Center, Container, Heading, Input, Text} from "@chakra-ui/react";
import React from "react";

interface TargetScoreProps {
    targetScore: number
}

const TargetScore = ({targetScore}: TargetScoreProps) => {

    const [value, setValue] = React.useState(targetScore);

    const [isEditing, setIsEditing] = React.useState(false);

    if(isEditing){
        return (
        <Container centerContent={true}>
            <Box borderRadius={100} w={100} h={100} borderWidth={10} borderColor={'teal.500'}>
                <Center h={20}>
                    <Input variant={'flushed'} placeholder={value.toString()} maxWidth={10} onChange={(e) => {
                        setValue(Number(e.target.value));
                    }} />
                </Center>
            </Box>
            <Heading>Target Band</Heading>
            <Button variant={'ghost'} colorPalette={'blue'} onClick={() => {setIsEditing(false)}}>
                Confirm
            </Button>
        </Container>)
    }

    return (<Container centerContent={true}>
        <Box borderRadius={100} w={100} h={100} borderWidth={10} borderColor={'teal.500'}>
            <Center h={20}>
                <Text color={'teal.500'} fontWeight={'bold'} fontSize={'4xl'}>
                    {value}
                </Text>
            </Center>
        </Box>
        <Heading>Target Band</Heading>
        <Button variant={'ghost'} colorPalette={'blue'} onClick={() => {setIsEditing(true)}}>
            Edit
        </Button>
    </Container>)
}

export default TargetScore;