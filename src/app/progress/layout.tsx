import React from "react";
import {Box} from "@chakra-ui/react";
import TopNav from "@/components/my-ui/top-nav";


export default function ProcessLayout({children,}: Readonly<{children: React.ReactNode;}>) {
    return (
        <Box>
            <TopNav />
            {children}
        </Box>
    );
}