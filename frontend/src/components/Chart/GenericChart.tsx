import React, { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';

function GenericChart({ title, chartType, data, options }) {
  const chartRef = useRef(null);
  useEffect(() => {
    console.log('Chart rendered with:', data);
    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, [data, chartType, title, options]);
  // Merge the provided options with default options
  const defaultOptions = {
    title: {
      text: title || 'Chart',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: title || 'Data',
        type: chartType || 'pie', // Default to pie if no type is provided
        data: data || [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

    // Customize the options based on the chart type
    if (chartType === 'bar' || chartType === 'line') {
      defaultOptions.xAxis = {
        type: 'category',
        data: data.map(item => item.name), // Use names for x-axis categories
      };
      defaultOptions.yAxis = {
        type: 'value',
      };
      defaultOptions.series[0].data = data.map(item => item.value); // Use values for the data
    }

  return (
    <ReactECharts
      option={{ ...defaultOptions, ...options }}
      style={{ height: 400, width: '100%' }}
    />
  );
}

export default GenericChart;
