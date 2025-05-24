import {
    AbsoluteCenter,
    Box,
    Heading
} from "@chakra-ui/react";
import {getServerSession} from "next-auth";
import {authOptions} from "@/components/util/auth-options";
import React from "react";
import HistoryComponent from "@/components/my-ui/progress/HistoryComponent";
import HandleUnauthorized from "@/components/util/HandleUnauthorized";

export interface HistoryData {
    id: string,
    name: string,
    score: number,
    date: string,
    topics: string[],
    type: string // listening, reading, writing
}

const HistoryPage = async () => {
    const session = await getServerSession(authOptions)

    if (!session) {
        return (<Box>
            <AbsoluteCenter>
                <Heading>
                    Please login to access the progress tracking!!
                </Heading>
            </AbsoluteCenter>
        </Box>)
    }

    let listResponse, readResponse, writingResponse, speakingResponse;
    try {
        [listResponse, readResponse, writingResponse, speakingResponse] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_LISTENING_SERVICE_URL}/api/listening/user/answer`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                }
            }),
            fetch(`${process.env.NEXT_PUBLIC_READING_SERVICE_URL}/api/reading/user/answer`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                }
            }),
            fetch(`${process.env.NEXT_PUBLIC_WRITING_SERVICE_URL}/api/writing/user/answer`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                }
            }),
            fetch(`${process.env.NEXT_PUBLIC_SPEAKING_SERVICE_URL}/api/speaking/user/answer`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                }
            })
        ]) as [Response, Response, Response, Response];

        const [listData, readData, writingData, speakingData] = await Promise.all([
            listResponse.json(),
            readResponse.json(),
            writingResponse.json(),
            speakingResponse.json(),
        ]);

        const data: HistoryData[] = [
            ...listData.map((item: Omit<HistoryData, 'type'>) => ({...item, type: 'listening'})),
            ...readData.map((item: Omit<HistoryData, 'type'>) => ({...item, type: 'reading'})),
            ...writingData.map((item: Omit<HistoryData, 'type'>) => ({...item, type: 'writing'})),
            ...speakingData.map((item: Omit<HistoryData, 'type'>) => ({...item, type: 'speaking'})),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return <HistoryComponent data={data} />
    } catch (e) {
        return (<AbsoluteCenter>
            {listResponse?.status === 401 || readResponse?.status === 401 || writingResponse?.status === 401 ? (
                <HandleUnauthorized/>
            ) : (
                <>
                    Internal Error
                    {e instanceof Error ? e.message : 'Unknown error occurred'}
                </>
            )}
        </AbsoluteCenter>)
    }
}

export default HistoryPage;