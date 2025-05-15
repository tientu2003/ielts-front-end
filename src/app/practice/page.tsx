
import '@fontsource/dancing-script';
import '@fontsource/lexend';

import {CEFRLevel} from "@/components/my-ui/common/CEFRLevelDisplay";
import ClientPracticePageComponent from "@/components/my-ui/practice/ClientPracticePageComponent";

interface BasicExamListResponse {
    id: string,
    testName: string,
    topics: string[],
    levels?: CEFRLevel[],
    task?: number
}

async function fetchExamData(serviceUrl: string, type: string) {
    try {
        const response = await fetch(`${serviceUrl}/public/api/${type}/list`);
        if (!response.ok) return [];

        const data: BasicExamListResponse[] = await response.json();
        return data.map(d => ({
            id: d.id,
            testName: d.testName,
            type: type,
            topics: d.topics,
            levels: d.levels,
            task: d.task
        }));
    } catch (e) {
        console.error(e)
        return []
    }
}

async function getData() {
    const readingData = await fetchExamData(
        process.env.NEXT_PUBLIC_READING_SERVICE_URL!,
        'reading'
    );

    const listeningData = await fetchExamData(
        process.env.NEXT_PUBLIC_LISTENING_SERVICE_URL!,
        'listening'
    );

    const writingData = await fetchExamData(
        process.env.NEXT_PUBLIC_WRITING_SERVICE_URL!,
        'writing'
    );

    return [...readingData, ...listeningData, ...writingData];
}

export default async function PracticePage() {
    const initialData = await getData();

    return (
        <ClientPracticePageComponent initialData={initialData}/>
    );
}

