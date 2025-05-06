'use client'
import {Box} from "@chakra-ui/react";
import React from "react";
import TopExamNav from "@/components/my-ui/top-exam-nav";
import { usePathname } from "next/navigation";
import {ExamProvider} from "@/components/my-ui/exam-context-provider";

export default function ExamLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(Boolean); // Split path and remove empty parts
    const type = pathSegments[1] || "default"; // Get second segment (e.g., "reading"), fallback to "default"

    return (
        <Box >
            <ExamProvider>
                <TopExamNav type={type}/>
                {children}
            </ExamProvider>
        </Box>
);
}
