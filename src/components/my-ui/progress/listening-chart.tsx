'use client'
import React from "react";
import ReactApexChart from "react-apexcharts";
import {ListeningListType} from "@/components/my-ui/progress/listening-statistic";


interface ApexChartProps {
    data: ListeningListType[];
}

const ListeningApexChart = ({data}:ApexChartProps) => {

    // Transform data into chart format
    const chartData = data.map((item) => ({
        x: new Date(item.date).toLocaleString("en-GB", {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }), // Format as time
        y: item.score,
    }));

    const [state, setState] = React.useState({
        series: [
            {
                name: "IELTS Score",
                data: chartData, // Use the transformed data
            },
        ],
        options: {
            chart: {
                height: 400,
                type: "line",
                zoom: { enabled: false },
            },
            dataLabels: { enabled: false },
            stroke: { curve: "smooth",
                width: 2, // Set the weight of the line (thickness)
            },
            title: {
                text: "IELTS Listening Scores",
                align: "left",
            },
            xaxis: {
                title: { text: "Time Line" },
                labels: { show: false }, // Hide x-axis labels

            },
            yaxis: {
                title: { text: "Score" },
                min: 0,
                max: 9,
            },
            grid: {
                show: false, // Hide the grid
            },
        },
    });

    return (
        <div>
            <div id="listeing-chart">
                <ReactApexChart
                    options={state.options as any}
                    series={state.series}
                    type="line"
                    height={350}
                />
            </div>
        </div>
    );
};

export default ListeningApexChart;
