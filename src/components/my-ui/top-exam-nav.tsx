import React, { useState } from "react";
import { Flex, Heading, Highlight, SimpleGrid } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CountdownTimer from "@/components/my-ui/count-down-clock";
import { useExamContext } from "@/components/my-ui/exam-context-provider";
import { toaster } from "@/components/ui/toaster";

interface TopExamNavProps {
    type: string;
}

const TopExamNav = (props: TopExamNavProps) => {
    let time = 0;
    if (props.type === "listening") {
        time = 45;
    } else if (props.type === "reading") {
        time = 60;
    } else if (props.type === "writing") {
        time = 60;
    } else if (props.type === "speaking") {
        time = 15;
    }

    const { callSubmitFunction } = useExamContext();
    const [elapsedTime, setElapsedTime] = useState(0);

    const handleSubmit = () => {
        if (callSubmitFunction(elapsedTime)) {
            toaster.create({
                description: `Submit answers successfully. Time taken: ${elapsedTime} seconds.`,
                type: "success",
            });
        } else {
            toaster.create({
                description: "You should do the assignment first",
                type: "error",
            });
        }
    };

    const handleTimeTaken = (timeTaken: number) => {
        setElapsedTime(timeTaken);
    };

    return (
        <SimpleGrid columns={2} padding={4}>
            <Heading fontFamily="'Dancing Script', cursive" fontSize="4xl">
                <Link href={"/"}>
                    <Highlight query={"English Master"} styles={{ color: "teal.500" }}>
                        English Master
                    </Highlight>
                </Link>
            </Heading>
            <Flex gap="10" justify="flex-end">
                <CountdownTimer minutes={time} onTimeTaken={handleTimeTaken} />
                <Button
                    fontWeight={"400"}
                    colorPalette={"blue"}
                    fontSize={"xl"}
                    variant={"surface"}
                    onClick={handleSubmit}
                    width={100}
                >
                    Finished
                </Button>
                <ColorModeButton />
            </Flex>
        </SimpleGrid>
    );
};

export default TopExamNav;
