'use client'
import {Center, Flex, Text} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IoMdTime } from "react-icons/io";

const CountdownTimer = ({ minutes, onTimeTaken }: { minutes: number; onTimeTaken: (timeTaken: number) => void }) => {
    const [time, setTime] = useState(minutes * 60); // Convert minutes to seconds

    useEffect(() => {
        const timer = setInterval(() => {
            setTime((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer); // Clear timer when component unmounts
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    useEffect(() => {
        onTimeTaken(minutes * 60 - time);
    }, [time, onTimeTaken]);

    return (
        <Flex border="1px solid teal" borderRadius="md" pt={1} pb={1} pl={2} pr={2}>
            <Center gap={2}>
                <IoMdTime />
                <Text fontSize="xl" color="teal.500">{formatTime(time)}</Text>
            </Center>
        </Flex>
    );
};

export default CountdownTimer;
