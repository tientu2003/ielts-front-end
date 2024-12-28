'use client'
import {useSession} from "next-auth/react"
import {AbsoluteCenter, Heading, Text} from '@chakra-ui/react'
import LoadingComponent from "@/components/my-ui/Loading";

const AccountPage = () => {
    const {data:session, status} = useSession()

    if (status === "loading") {
        return <LoadingComponent/>
    }

    if (status === "unauthenticated") {
        return <AbsoluteCenter>
            <Heading fontSize={'4xl'}>
                Access Denied
            </Heading>
        </AbsoluteCenter>
    }
    return (
        <Text>Protected Page</Text>
    )

}

export default AccountPage;
