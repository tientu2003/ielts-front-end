import {Flex, Heading, Highlight, SimpleGrid} from "@chakra-ui/react";
import {ColorModeButton} from "@/components/ui/color-mode";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import React from "react";
import AccountLogin from "@/components/my-ui/top-nav/account-login";

const TopNav = () => (
    <SimpleGrid columns={2} padding={5} shadow="sm">
        <Heading fontFamily="'Dancing Script', cursive" fontSize="4xl">
            <Link href={'/'}>
                <Highlight query={'English Master'} styles={{color: "teal.500"}}>
                    English Master
                </Highlight>
            </Link>
        </Heading>
        <Flex gap="10" justify="flex-end">
            <Link href={'/'}>
                <Button fontWeight={"medium"} fontSize={'xl'} variant={'ghost'} width={100}>
                        Home
                </Button>
            </Link>
            <Link href={'/practice'}>
                <Button fontWeight={"medium"} fontSize={'xl'} variant={'ghost'}  width={100}>Practice</Button>
            </Link>
            <Link href={'/dashboard/history'}>
                <Button fontWeight={"medium"} fontSize={'xl'} variant={'ghost'}  width={150}>Progress</Button>
            </Link>
            <ColorModeButton/>
            <AccountLogin />
        </Flex>
    </SimpleGrid>
)
export default TopNav;