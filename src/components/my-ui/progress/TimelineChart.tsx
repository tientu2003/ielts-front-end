"use client"
import {Card, Center, Heading, ButtonGroup, Button} from "@chakra-ui/react"
import {Chart, useChart} from "@chakra-ui/charts"
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    Tooltip,
    XAxis,
    YAxis
} from "recharts"
import {HistoryData} from "@/app/dashboard/history/page";
import {MdOutlineTimeline} from "react-icons/md";
import {BsCalendar2Month} from "react-icons/bs";
import {useState} from "react";
import { FaCalendarAlt } from "react-icons/fa";

interface TimelineChartProps {
    data: HistoryData[],
    skill: string,
}

const TimelineChart = ({data, skill}: TimelineChartProps) => {
    const MAX_SCORE = 9;
    const skillColors = {
        Listening: "blue.solid",
        Reading: "green.solid",
        Writing: "purple.solid"
    };

    const [groupBy, setGroupBy] = useState<'raw' | 'month' | 'day'>('raw');

    const processData = () => {
        if (groupBy === 'raw') {
            return data.map(e => ({
                score: e.score,
                date: e.date
            }));
        }

        const groupedData = data.reduce((acc, curr) => {
            const [datePart] = curr.date.split(' ');
            const [day, month, year] = datePart.split('/');
            const key = groupBy === 'month'
                ? `${month}/${year}`
                : `${day}/${month}/${year}`;

            if (!acc[key]) {
                acc[key] = {
                    sum: curr.score,
                    count: 1
                };
            } else {
                acc[key].sum += curr.score;
                acc[key].count += 1;
            }
            return acc;
        }, {} as Record<string, { sum: number, count: number }>);

        return Object.entries(groupedData).map(([date, values]) => ({
            date,
            score: Number((values.sum / values.count).toFixed(2))
        })).sort((a, b) => {
            if (groupBy === 'month') {
                const [aMonth, aYear] = a.date.split('/');
                const [bMonth, bYear] = b.date.split('/');
                return (Number(aYear) - Number(bYear)) || (Number(aMonth) - Number(bMonth));
            } else {
                const [aDay, aMonth, aYear] = a.date.split('/');
                const [bDay, bMonth, bYear] = b.date.split('/');
                return (Number(aYear) - Number(bYear)) ||
                    (Number(aMonth) - Number(bMonth)) ||
                    (Number(aDay) - Number(bDay));
            }
        });
    };

    const chart = useChart({
        data: processData(),
        series: [
            {name: "score", color: skillColors[skill as keyof typeof skillColors]},
        ],
    })

    return (
        <Card.Root pt={10} pr={10} pb={10} shadow="md" borderRadius="md">
            <ButtonGroup spacing={4} mb={4} ml={4}>
                <Button
                    variant={'ghost'}
                    onClick={() => setGroupBy('raw')}
                >
                    <MdOutlineTimeline/>
                    Timeline
                </Button>
                <Button
                    variant={'ghost'}
                    onClick={() => setGroupBy('day')}
                >
                    <FaCalendarAlt />
                    Daily
                </Button>
                <Button
                    variant={'ghost'}
                    onClick={() => setGroupBy('month')}
                >
                    <BsCalendar2Month/>
                    Monthly
                </Button>
            </ButtonGroup>
            <Chart.Root maxH="sm" chart={chart}>
                <AreaChart data={chart.data}>
                    <CartesianGrid
                        stroke={chart.color("border")}
                        vertical={false}
                        strokeDasharray="3 3"
                    />
                    <XAxis
                        dataKey={chart.key("date")}
                        tickLine={false}
                        axisLine={true}
                        tickMargin={8}
                        tickFormatter={(value) => {
                            if (groupBy === 'raw') {
                                const parts = value.split(" ")[0].split("/");
                                return `${parts[0]}/${parts[1]}`;
                            }
                            return value;
                        }}
                        hide={true}
                    />
                    <YAxis tickLine={false} axisLine={false} domain={[0, MAX_SCORE]}/>
                    <Tooltip
                        cursor={false}
                        animationDuration={100}
                        content={<Chart.Tooltip/>}
                    />
                    <Legend content={<Chart.Legend/>}/>

                    {chart.series.map((item) => (
                        <defs key={item.name}>
                            <Chart.Gradient
                                id={`${item.name}-gradient`}
                                stops={[
                                    {offset: "0%", color: item.color, opacity: 0.3},
                                    {offset: "100%", color: item.color, opacity: 0.05},
                                ]}
                            />
                        </defs>
                    ))}

                    {chart.series.map((item) => (
                        <Area
                            key={item.name}
                            type="natural"
                            isAnimationActive={false}
                            dataKey={chart.key(item.name)}
                            fill={`url(#${item.name}-gradient)`}
                            stroke={chart.color(item.color)}
                            strokeWidth={2}
                            stackId="a"
                        />
                    ))}
                </AreaChart>
            </Chart.Root>
            <Center>
                <Heading size="2xl">
                    {skill === "Listening" ? "Listening Exam Timeline" : skill === "Reading" ? "Reading Exam Timeline" : "Writing Exam Timeline"}
                </Heading>
            </Center>
        </Card.Root>
    )
}

export default TimelineChart