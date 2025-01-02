'use client'
import {Table} from "@chakra-ui/react";
import {useRouter} from "next/navigation";
import {ListeningListType} from "@/components/my-ui/progress/listening-statistic";

interface ListeningTableRowProps {
    data: ListeningListType
}

const ListeningTableRow = ({data}:  ListeningTableRowProps) => {
    const router = useRouter()
    return ( <Table.Row key={data.id} onDoubleClick={() => { router.push(`/result/listening/${data.id}`) ; }}>
        <Table.Cell>{data.name}</Table.Cell>
        <Table.Cell>{data.score}</Table.Cell>
        <Table.Cell textAlign="end">{new Date(data.date).toLocaleString("en-GB", {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })}</Table.Cell>
    </Table.Row>)
}


export default ListeningTableRow;