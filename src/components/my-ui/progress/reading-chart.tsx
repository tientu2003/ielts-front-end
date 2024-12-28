'use client'
import React from "react";
import ReactApexChart from "react-apexcharts";
import {ReadingListType} from "@/components/my-ui/progress/reading-statistic";


interface ApexChartProps {
    data: ReadingListType[];
}

const ApexChart = ({data}:ApexChartProps) => {


    // Transform data into chart format
    const chartData = data.map((item) => ({
        x: new Date(item.createdAt).toLocaleString("en-GB", {
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
                text: "IELTS Reading Scores",
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
            <div id="chart">
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

export default ApexChart;
