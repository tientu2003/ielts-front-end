'use client'
import {Box, Center, Heading, Stack} from "@chakra-ui/react";
import {Chart, useChart} from "@chakra-ui/charts"
import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
} from "recharts"
import {SkillLanguageProficiency} from "@/components/util/type-def";
import TopicsDisplay,{getTopicColor} from "@/components/my-ui/common/TopicsDisplay";

interface TpiComponentProps {
    data: SkillLanguageProficiency
    skill: string,
    size: string,
}

const TpiComponent = ({data, skill, size}: TpiComponentProps) => {
    const chartData = [
        {
            value: Math.round(data.tpi * 9 * 100) / 100,
            metric: data.topic? 'Topic Proficiency Index' : 'Skill Proficiency Index',
        },
        {
            value: Math.round(data.tci * 9 * 100) / 100,
            metric: 'Stability',
        },
        ...(data.averageAccuracy != null ? [{
            value: Math.round(data.averageAccuracy * 9 * 100) / 100,
            metric: 'Accuracy'
        }] : []),
        {
            value: Math.round(data.averageScore * 100) / 100,
            metric: 'Score'
        },
        ...(data.averageDifficulty != null ? [{
            value: Math.round(data.averageDifficulty * 9 * 100) / 100,
            metric: 'Difficulty'
        }] : [])
    ]

    const chart = useChart({
        data: chartData,
        series: [{name: "value", color: "teal.solid"}],
    })

    return <Box border='1px' borderColor='gray.200' borderRadius='md' p={4} shadow={'lg'} w={size}>
    <Chart.Root chart={chart} mx="auto">
            <RadarChart data={chart.data}>
                <PolarGrid
                    stroke={chart.color("border")}
                    style={{fill: chart.color("teal.solid"), fillOpacity: 0.05}}
                    max={9}
                />
                <PolarAngleAxis dataKey={chart.key("metric")}/>
                <PolarRadiusAxis domain={[0, 9]} axisLine={false} tick={false}/>
                {chart.series.map((item) => (
                    <Radar
                        key={item.name}
                        name={item.name}
                        dataKey={chart.key(item.name)}
                        stroke={chart.color(item.color)}
                        fill={chart.color(item.color)}
                        fillOpacity={0.2}
                    />
                ))}
            </RadarChart>
        </Chart.Root>
        <Center>
            <Heading>
                {data.topic? <TopicsDisplay topics={[data.topic]} /> : <Box color={getTopicColor(skill)}>{skill + ' Skill Proficiency'}</Box> }
            </Heading>
        </Center>

    </Box>


}

export default TpiComponent;