import {Box} from "@chakra-ui/react";
import React from "react";
import TopNav from "@/components/my-ui/top-nav";

export default function ExamLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Box>
            <TopNav/>
            {children}
        </Box>
);
}
