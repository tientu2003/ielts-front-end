'use client'
import {AbsoluteCenter, Box, Button, Heading, Stack, Text} from "@chakra-ui/react"
import TopNav from "@/components/my-ui/top-nav";
import '@fontsource/dancing-script'; // Import the Dancing Script font
import '@fontsource/lexend';
import {signIn, useSession} from "next-auth/react";
import LogoutButton from "@/components/my-ui/logout-button";
import LoadingComponent from "@/components/my-ui/Loading";

const LoginPage = () => {
    const {data:session, status} = useSession()

    if (status === "loading") {
        return <LoadingComponent/>
    }

    if (status === "unauthenticated") {
        return  <Box>
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
                </Stack>
            </AbsoluteCenter>
        </Box>
    }

    return (
        <Box>
            <TopNav />
            <AbsoluteCenter>
                <Stack>
                    <Heading color={"teal.500"} size={"4xl"}>
                        Welcome {session?.user?.name}
                    </Heading>
                    <LogoutButton/>
                </Stack>
            </AbsoluteCenter>
        </Box>
    )


}

export default LoginPage;