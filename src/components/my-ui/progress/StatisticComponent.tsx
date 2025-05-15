import {Box} from "@chakra-ui/react";
import {SkillLanguageProficiency, Summary} from "@/components/util/type-def";
import TpiComponent from "@/components/my-ui/progress/TpiComponent";
import {HistoryData} from "@/app/dashboard/history/page";
import TimelineChart from "@/components/my-ui/progress/TimelineChart";
import SuggestionComponent from "@/components/my-ui/progress/SuggestionComponent";
import TopicsComponent from "@/components/my-ui/progress/TopicsComponent";

interface StatisticComponentProps {
    topics: string[],
    summary: Summary,
    tpi: SkillLanguageProficiency[],
    history: HistoryData[],
    skill: string,
}

const StatisticComponent = ({topics, summary, tpi, history, skill}: StatisticComponentProps) => {
    return <Box>
        <TimelineChart data={history} skill={skill} />
        <SuggestionComponent data={summary} skill={skill}/>
        <TopicsComponent topics={topics} tpi={tpi} />
    </Box>
}

export default StatisticComponent;