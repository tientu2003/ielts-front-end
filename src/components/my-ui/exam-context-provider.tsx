'use client';

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ExamContextProps {
    setSubmitFunction: (fn: (param: number) => void) => void; // Đăng ký function submit
    callSubmitFunction: (param: number) => boolean; // Gọi function submit
}

// Tạo context
const ExamContext = createContext<ExamContextProps | undefined>(undefined);

// Hook để sử dụng context
export const useExamContext = () => {
    const context = useContext(ExamContext);
    if (!context) {
        throw new Error("useExamContext must be used within an ExamProvider");
    }
    return context;
};

// Provider Component
export const ExamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [submitFunction, setSubmitFunctionInternal] = useState<((param: number) => void) | null>(null);

    // Đăng ký function submit
    const setSubmitFunction = (fn: (param: number) => void) => {
        setSubmitFunctionInternal(() => fn);
    };

    // Gọi function submit nếu nó đã được đăng ký
    const callSubmitFunction = (param: number) => {
        if (submitFunction) {
            submitFunction(param);
            return true
        } else {
            return false;
        }
    };

    return (
        <ExamContext.Provider value={{ setSubmitFunction, callSubmitFunction }}>
            {children}
        </ExamContext.Provider>
    );
};
