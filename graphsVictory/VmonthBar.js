import React, { useState, useEffect } from "react"
import { View, Text } from "react-native"
import * as scale from "d3-scale"
import styled from "styled-components"
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory-native"
import moment, { Moment } from "moment"

const VmonthBar = ({ taskArray_month, ylength }) => {
  var times = taskArray_month
  // console.log(monthTime)
  // console.log(targetArray)
  const dataArray = taskArray_month.map((value, index) => {
    return {
      x: index + 1,
      y: value / 60,
    }
  })
  // useEffect(() => {
  //   console.log(dataArray)
  // }, [])
  return (
    <>
    {Platform.OS === "ios" ?<VictoryChart
      domain={{ x: [0, dataArray.length + 1], y: [0, ylength] }}
      height={150}
      padding={{ top: 25, bottom: 30, left: 45, right: 30 }}

    >
      <VictoryBar
        barWidth={5}
        style={{
          data: { fill: "#c43a31" },
        }}
        barRatio={1}
        data={dataArray}
        // labels={({ datum }) => datum.y}
      />
    </VictoryChart>:<VictoryChart
      domain={{ x: [0, dataArray.length + 1], y: [0, ylength] }}
      height={150}
      padding={{ top: 25, bottom: 30, left: 45, right: 30 }}
      theme={VictoryTheme.material}

    >
      <VictoryBar
        barWidth={5}
        style={{
          data: { fill: "#c43a31" },
        }}
        barRatio={1}
        data={dataArray}
        // labels={({ datum }) => datum.y}
      />
    </VictoryChart>}</>
    
  )
}
export default VmonthBar

// const day0 = 0
// const day1 = times[0]
// const day2 = times[1]
// const day3 = times[2]
// const day4 = times[3]
// const day5 = times[4]
// const day6 = times[5]
// const day7 = times[6]
// const day8 = times[7]
// const day9 = times[8]
// const day10 = times[9]
// const day11 = times[10]
// const day12 = times[11]
// const day13 = times[12]
// const day14 = times[13]
// const day15 = times[14]
// const day16 = times[15]
// const day17 = times[16]
// const day18 = times[17]
// const day19 = times[18]
// const day20 = times[19]
// const day21 = times[20]
// const day22 = times[21]
// const day23 = times[22]
// const day24 = times[23]
// const day25 = times[24]
// const day26 = times[25]
// const day27 = times[26]
// const day28 = times[27]
// const day29 = times[28]
// const day30 = times[29]
// const day31 = times[30]
