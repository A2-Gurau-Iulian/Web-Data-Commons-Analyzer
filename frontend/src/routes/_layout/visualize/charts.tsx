import { createFileRoute } from '@tanstack/react-router'
import GenericChart from '@/components/Chart/GenericChart'
import React, { useState, useEffect } from 'react'

export const Route = createFileRoute('/_layout/visualize/charts')({
  component: Charts,
})

function Charts() {
  // State to manage chart type
  const [chartType, setChartType] = useState('pie') // Default to pie chart

  // State to store fetched data
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch data from the backend on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://127.0.0.1:8000/visualize/charts') // Replace with your actual endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const jsonData = await response.json()
        // Transform data to match the expected format for the chart
        const transformedData = jsonData.map((item) => ({
          name: item.predicate, // Use 'object' as the name
          value: parseFloat(item.count), // Parse count as a number
        }))
        setData(transformedData)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, []) // Empty dependency array ensures this runs only once

  // Handle chart type change
  const handleChartTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setChartType(event.target.value)
  }

  // Render loading or error states if necessary
  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <>
      {/* UI for selecting chart type */}
      <div>
        <label>
          <input
            type="radio"
            value="pie"
            checked={chartType === 'pie'}
            onChange={handleChartTypeChange}
          />
          Pie Chart
        </label>
        <label>
          <input
            type="radio"
            value="bar"
            checked={chartType === 'bar'}
            onChange={handleChartTypeChange}
          />
          Bar Chart
        </label>
        <label>
          <input
            type="radio"
            value="line"
            checked={chartType === 'line'}
            onChange={handleChartTypeChange}
          />
          Line Chart
        </label>
      </div>

      {/* Render the chart with the selected type */}
      <GenericChart
        title="Type Distribution"
        chartType={chartType}
        data={data}
      />
    </>
  )
}
