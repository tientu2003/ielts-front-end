'use client'
import Link from "next/link";
import {Button} from "@/components/ui/button";
import React from "react";
import {Avatar} from "@/components/ui/avatar";
import {signOut, useSession} from "next-auth/react";
import LoadingComponent from "@/components/my-ui/Loading";
import {MenuRoot} from "@/components/ui/menu";
import {MenuContent, MenuItem, MenuTrigger, Flex, Stack} from "@chakra-ui/react";

const AccountLogin = () =>{

    const {data: session, status} = useSession();

    if (status === "loading") {
        return <LoadingComponent/>
    }
    if (status === "unauthenticated") {
        return  <Link href="/auth/login">
            <Button variant={'surface'} width={100} colorPalette="teal">
                Login
            </Button>
        </Link>
    }

    const idToken = session?.id_token;

    const handleLogout = () => {
        // Ensure this is the actual ID token
        if (idToken) {
            signOut({
                redirect: false // Prevent default NextAuth redirect
            }).then(() => {
                const logoutUrl = process.env.NEXT_PUBLIC_KEYCLOAK_LOGOUT_URL;
                window.location.href = `${logoutUrl}?id_token_hint=${idToken}&post_logout_redirect_uri=${window.location.origin}`;
            });
        } else {
            console.error("ID Token not found");
        }
    }

    return <Stack alignItems="flex-end">
        <MenuRoot >
            <MenuTrigger width="150px">
                <Flex justify={"flex-end"}>
                    <Avatar name={session?.user?.name as string}/>
                </Flex>
            </MenuTrigger>
            <MenuContent width="150px">
                <MenuItem onClick={() =>{}} value="history">
                    Account
                </MenuItem>
                <MenuItem onClick={() => handleLogout()} value="sign-out">
                    Sign Out
                </MenuItem>
            </MenuContent>
        </MenuRoot>
    </Stack>

}

export default AccountLogin;