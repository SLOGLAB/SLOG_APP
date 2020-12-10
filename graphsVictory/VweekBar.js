import React, { useState, useEffect } from "react"
import { View, Text } from "react-native"
import * as scale from "d3-scale"
import styled from "styled-components"
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory-native"

const VweekBar = ({ taskArray_week, ylength ,weekHMsosu}) => {
  // var times = taskArray_week
  useEffect(() => {
    // console.log(taskArray_week)
  }, [])
  return (
    <>
    {Platform.OS === "ios" ?
    <VictoryChart
    domain={{ x: [0, 8], y: [0, ylength] }}
    height={150}
    padding={{ top: 25, bottom: 30, left: 45, right: 30 }}

  >
    <VictoryBar
      barWidth={20}
      style={{
        data: { fill: "#c43a31" },
        labels: {
          fontSize: 8,
          fill: ({ datum }) => (datum.y === 0 ? "#ffffff" : "#c43a31"),
        },
      }}
      // labels={({ datum }) => {datum.y ==0? "":` ${datum.y}`}}
      barRatio={1}
      data={[
        { x: "일", y: taskArray_week[0] / 60 },
        { x: "월", y: taskArray_week[1] / 60 },
        { x: "화", y: taskArray_week[2] / 60 },
        { x: "수", y: taskArray_week[3] / 60 },
        { x: "목", y: taskArray_week[4] / 60 },
        { x: "금", y: taskArray_week[5] / 60 },
        { x: "토", y: taskArray_week[6] / 60 },
        // { x: "", y: 0 },
      ]}
      labels={({ datum }) => datum.y.toFixed(weekHMsosu)}
    />
  </VictoryChart>:
  <VictoryChart
  domain={{ x: [0, 8], y: [0, ylength] }}
  height={150}
  padding={{ top: 25, bottom: 30, left: 45, right: 30 }}
  theme={VictoryTheme.material}

>
  <VictoryBar
    barWidth={20}
    style={{
      data: { fill: "#c43a31" },
      labels: {
        fontSize: 8,
        fill: ({ datum }) => (datum.y === 0 ? "#ffffff" : "#c43a31"),
      },
    }}
    // labels={({ datum }) => {datum.y ==0? "":` ${datum.y}`}}
    barRatio={1}
    data={[
      { x: "일", y: taskArray_week[0] / 60 },
      { x: "월", y: taskArray_week[1] / 60 },
      { x: "화", y: taskArray_week[2] / 60 },
      { x: "수", y: taskArray_week[3] / 60 },
      { x: "목", y: taskArray_week[4] / 60 },
      { x: "금", y: taskArray_week[5] / 60 },
      { x: "토", y: taskArray_week[6] / 60 },
      // { x: "", y: 0 },
    ]}
    labels={({ datum }) => datum.y.toFixed(weekHMsosu)}
  />
</VictoryChart>}</>
    
  )
}
export default VweekBar
