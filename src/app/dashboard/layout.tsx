import React from "react";
import {Box, GridItem, SimpleGrid} from "@chakra-ui/react";
import TopNav from "@/components/my-ui/top-nav";
import {getServerSession} from "next-auth";
import {authOptions} from "@/components/util/auth-options";
import SideNav from "@/components/my-ui/common/side-nav";

export default async function ProcessLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    const session = await getServerSession(authOptions)
    return (
        <Box>
            <TopNav/>
            <SimpleGrid columns={4} gap={'5%'} mt={'5%'} ml={'5%'} mr={'5%'}>
                <GridItem colSpan={1}>
                    <SideNav name={session?.user?.name as string} />
                </GridItem>
                <GridItem colSpan={3}>
                    {children}
                </GridItem>
            </SimpleGrid>
        </Box>
    );
}