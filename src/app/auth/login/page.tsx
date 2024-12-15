'use client'
import {AbsoluteCenter, Box, Button, Heading, Stack} from "@chakra-ui/react"
import TopNav from "@/components/my-ui/top-nav";
import '@fontsource/dancing-script'; // Import the Dancing Script font
import '@fontsource/lexend';

import {signIn} from "next-auth/react";

import LogoutButton from "@/components/my-ui/logout-button";

const LoginPage = () => {

    return (
        <Box>
            <TopNav />
            <AbsoluteCenter>
                <Stack>
                    <Heading color={"teal.500"} size={"4xl"}>
                        Sign in to your account
                    </Heading>
                    <Button
                        marginTop={10}
                        onClick={()=>signIn('keycloak',{ callbackUrl: '/' })}
                        variant={"surface"}
                        minWidth={"sm"}
                        colorPalette={"teal"}>
                        Sign in with Keycloak
                    </Button>
                    <LogoutButton/>
                </Stack>
            </AbsoluteCenter>
        </Box>
    )


}

export default LoginPage;