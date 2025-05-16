import {
    AbsoluteCenter,
    Box, Card,
    Heading
} from "@chakra-ui/react";
import {getServerSession} from "next-auth";
import {authOptions} from "@/components/util/auth-options";
import React from "react";
import HandleUnauthorized from "@/components/util/HandleUnauthorized";
import {SkillLanguageProficiency, Summary} from "@/components/util/type-def";
import {HistoryData} from "@/app/dashboard/history/page";
import StatisticComponent from "@/components/my-ui/progress/StatisticComponent";

const WritingStatisticPage = async () => {
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
    try {
        const topic_response = await fetch(`${process.env.NEXT_PUBLIC_WRITING_SERVICE_URL}/api/writing/user/topic-list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
            }
        })
        if(topic_response.status === 401){
            return <AbsoluteCenter>
                Login is expired, please login again.
                <HandleUnauthorized />
            </AbsoluteCenter>
        }

        const topic_data:string[] = await topic_response.json();

        const summary_response = await fetch(`${process.env.NEXT_PUBLIC_WRITING_SERVICE_URL}/api/writing/user/summary`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
            }
        })

        const summary_data:Summary = await summary_response.json();

        const tpi_response = await fetch(`${process.env.NEXT_PUBLIC_WRITING_SERVICE_URL}/api/writing/user/tpi`, {
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify([])
        })

        const tpi_data: SkillLanguageProficiency[] = await tpi_response.json();

        const history_response = await  fetch(`${process.env.NEXT_PUBLIC_WRITING_SERVICE_URL}/api/writing/user/answer`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
            }
        })

        const history_data: HistoryData[] = await history_response.json();

        return <Card.Root shadow={'md'} w={'100%'} p={'2.5%'}>
            <StatisticComponent topics={topic_data} summary={summary_data} tpi={tpi_data} history={history_data} skill={'Listening'} />
        </Card.Root>
    } catch (e) {
        return (<AbsoluteCenter>
            Internal Error
            {e instanceof Error ? e.message : 'Unknown error occurred'}
        </AbsoluteCenter>)
    }
}

export default WritingStatisticPage;