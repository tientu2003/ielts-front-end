import {Box, Card} from "@chakra-ui/react";
import {HistoryData} from "@/app/dashboard/history/page";


const HistoryRecord = ({id,name, score, topics, date}: HistoryData) => {
    return <Card.Root>
        {id} - {name} - {score} - {topics} - {date}
    </Card.Root>
}

export default HistoryRecord;