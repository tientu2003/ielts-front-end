'use client'
import {Box} from "@chakra-ui/react";
import React from "react";
import TopExamNav from "@/components/my-ui/top-exam-nav";
import { usePathname } from "next/navigation";
import {useRef} from "react";

export interface SubmitAnswerRef {
    executeFunction: (param: string) => void;
}

export default function ExamLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(Boolean); // Split path and remove empty parts
    const type = pathSegments[1] || "default"; // Get second segment (e.g., "reading"), fallback to "default"

    const componentRef = useRef<SubmitAnswerRef>(null);

    const callSubmitFunction = (timeTaken:string) => {
        if (componentRef.current) {
            componentRef.current.executeFunction(timeTaken);
        }
    };

    return (
        <Box>
            <TopExamNav type={type} triggerSubmitFunction={callSubmitFunction}/>
            {children}
        </Box>
);
}
