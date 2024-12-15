import {Flex, Heading, Highlight, SimpleGrid} from "@chakra-ui/react";
import {ColorModeButton} from "@/components/ui/color-mode";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import React from "react";
import {Avatar} from "@/components/ui/avatar";

const TopNav = () => (
    <SimpleGrid columns={2} padding={5}>
        <Heading fontFamily="'Dancing Script', cursive" fontSize="4xl">
            <Highlight query={'English Master'} styles={{color: "teal.500"}}>
                English Master
            </Highlight>
        </Heading>
        <Flex gap="10" justify="flex-end">
            <Link href={'/'}>
                <Button fontWeight={"400"} fontSize={'xl'} variant={'ghost'} width={100}>
                        Home
                </Button>
            </Link>

            <Button fontWeight={"400"} fontSize={'xl'} variant={'ghost'}  width={100}>Practice</Button>
            <Button fontWeight={"400"} fontSize={'xl'} variant={'ghost'}  width={150}>Community</Button>
            <Button fontWeight={"400"} fontSize={'xl'} variant={'ghost'}  width={100}>Help</Button>
            <ColorModeButton/>
            <Link href="/auth/login">
                <Button variant={'surface'} width={100} colorPalette="teal">
                        Login
                </Button>
            </Link>
            {/*<Link href="/auth/register">*/}
            {/*    <Button variant={'surface'} width={100}>*/}
            {/*            Register*/}
            {/*    </Button>*/}
            {/*</Link>*/}

            {/*<Avatar name={'ABC'}/>*/}
        </Flex>
    </SimpleGrid>
)
export default TopNav;