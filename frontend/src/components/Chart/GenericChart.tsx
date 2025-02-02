import React, { useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";

function GenericChart({ title, chartType, data, options }) {
  const chartRef = useRef(null);

  useEffect(() => {
    console.log("Chart rendered with:", data);
    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, [data, chartType, title, options]);

  // Default chart options
  const defaultOptions = {
    title: {
      text: title || "Chart",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: chartType === "pie" ? {  // Only enable legend for Pie chart
      orient: "horizontal",
      bottom: 0,
      left: "center",
    } : undefined, // Disable leg
    grid: {
      top: 30, // Adjust top padding
      left: 100, // Adjust left padding
      right: 40, // Adjust right padding
      bottom: 100, // Adjust bottom padding to accommodate the legend
      containLabel: true, // Ensure labels are contained within the grid
    },
    series: [],
  };

  // Configure options based on the chart type
  if (chartType === "pie") {
    defaultOptions.series = [
      {
        name: title || "Data",
        type: "pie",
        data: data || [],
        radius: ["40%", "70%"], // Donut-style pie chart for better layout
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ];
  } else if (chartType === "bar") {
    // Horizontal bar chart configuration
    defaultOptions.xAxis = {
      type: "value",
    };
    defaultOptions.yAxis = {
      type: "category",
      data: data.map((item) => item.name), // Use names for y-axis categories
    };
    defaultOptions.series = [
      {
        name: title || "Data",
        type: "bar",
        data: data.map((item) => item.value), // Use values for the data
        barWidth: "50%", // Adjust bar width for better visualization
        label: {
          show: true,
          position: "right", // Display the value at the end of each bar
        },
      },
    ];
  } else if (chartType === "treemap") {
    defaultOptions.series = [
      {
        name: title || "Data",
        type: "treemap",
        data: data.map((item) => ({
          name: item.name,
          value: item.value,
        })),
      },
    ];
  }

  return (
    <ReactECharts
      option={{ ...defaultOptions, ...options }}
      style={{ height: 700, width: 800 }}
    />
  );
}

export default GenericChart;
