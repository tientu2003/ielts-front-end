'use client'
import {ReadingListType} from "@/components/my-ui/progress/reading-statistic";
import {Table} from "@chakra-ui/react";
import {useRouter} from "next/navigation";

interface ReadingTableRowProps {
    data: ReadingListType
}

const ReadingTableRow = ({data}:  ReadingTableRowProps) => {
    const router = useRouter()
    return ( <Table.Row key={data.recordId} onDoubleClick={() => { router.push(`/result/reading/${data.recordId}`) ; }}>
        <Table.Cell>{data.testName}</Table.Cell>
        <Table.Cell>{data.score}</Table.Cell>
        <Table.Cell textAlign="end">{new Date(data.createdAt).toLocaleString("en-GB", {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })}</Table.Cell>
    </Table.Row>)
}


export default ReadingTableRow;