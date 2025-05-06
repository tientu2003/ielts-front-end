'use client'
import {useRouter} from "next/navigation";
import {useState} from "react";

export function reading_listening_inti_state() {
    const router = useRouter();

    const [value, setValue] = useState<string | null>("first")

    const [answers, setAnswers] = useState<string[]>(Array(40).fill(""));


    const handleInputChange = (index: number, value: string) => {
        setAnswers((prev) => {
            const updatedAnswers = [...prev];
            updatedAnswers[index] = value; // Cập nhật giá trị tại vị trí `index`
            return updatedAnswers;
        });

    };
    return {router, value, setValue, answers, handleInputChange};
}
