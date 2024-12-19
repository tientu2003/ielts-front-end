import {Flex, Heading, Highlight, SimpleGrid} from "@chakra-ui/react";
import {ColorModeButton} from "@/components/ui/color-mode";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import React from "react";
import CountdownTimer from "@/components/my-ui/count-down-clock";

interface TopExamNavProps {
    type:string,
    triggerSubmitFunction: (param: string) => void;
}

const TopExamNav = (props:TopExamNavProps) => {
    let time = 0;
    if(props.type == "listening"){
        time = 45
    }else if(props.type == "reading"){
        time = 60
    }else if(props.type == "writing"){
        time = 60
    }else if (props.type == "speaking"){
        time = 15
    }
    return (
    <SimpleGrid columns={2} padding={4}>
        <Heading fontFamily="'Dancing Script', cursive" fontSize="4xl">
            <Link href={'/'}>
                <Highlight query={'English Master'} styles={{color: "teal.500"}}>
                    English Master
                </Highlight>
            </Link>
        </Heading>
        <Flex gap="10" justify="flex-end">
            <CountdownTimer minutes={time}/>
            <Link href={'/practice'}>
                <Button fontWeight={"400"} colorPalette={'blue'} fontSize={'xl'} variant={'surface'}  width={100}>Finished</Button>
            </Link>
            <ColorModeButton/>
        </Flex>
    </SimpleGrid>
)}
export default TopExamNav;