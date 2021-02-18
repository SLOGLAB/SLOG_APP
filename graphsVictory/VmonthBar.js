import React, { useState, useEffect } from "react"
import { View, Text } from "react-native"
import * as scale from "d3-scale"
import styled from "styled-components"
import {
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryTheme,
  VictoryArea,
  VictoryAxis,
} from "victory-native"
import moment, { Moment } from "moment"

const VmonthBar = ({ taskArray_month, taskArray_month_pre, ylength }) => {
  const dataArray = taskArray_month.map((value, index) => {
    return {
      x: index + 1,
      y: value / 60,
    }
  })

  let days = []
  for (let i = 0; i < taskArray_month.length; i += 2) {
    // if ((i + 1) % 2 == 0) {
    days.push(i + 1)
    // }
  }
  const dataPreArray = taskArray_month_pre.map((value, index) => {
    return {
      x: index + 1,
      y: value / 60,
    }
  })
  function replaceRobotoWithSystemFont(obj) {
    const keys = Object.keys(obj)
    keys.forEach(function (key) {
      const value = obj[key]
      if (key === "fontFamily") {
        obj[key] = obj[key].replace("'Roboto',", "'System',")
      }
      if (typeof value === "object") {
        replaceRobotoWithSystemFont(obj[key])
      }
    })
    return obj
  }
  useEffect(() => {
    // console.log(taskArray_month, "taskArray_month")
    // console.log(taskArray_month_pre, "taskArray_month_pre")
    // console.log(ylength, "ylength")
    // console.log(days, "days")
    // console.log(taskArray_month.length, "taskArray_month.lenght")
    // console.log(taskArray_month_pre.length, "taskArray_month_pre.lenght")
  }, [])
  const themeWithSystemFont = replaceRobotoWithSystemFont({ ...VictoryTheme.material })
  return (
    <>
      <VictoryChart
        domain={{ x: [1, taskArray_month.length], y: [0, ylength] }}
        height={150}
        padding={{ top: 25, bottom: 30, left: 30, right: 30 }}
        theme={themeWithSystemFont}
      >
        <VictoryAxis dependentAxis tickFormat={(tick) => `${tick}`} />

        <VictoryAxis tickValues={days} />
        <VictoryGroup style={{ data: { width: 0, strokeWidth: 2, fillOpacity: 0.3 } }}>
          <VictoryArea
            // barWidth={3}
            style={{
              data: { fill: "#C7E9F8" },
            }}
            // barRatio={1}
            data={dataPreArray}
            // labels={({ datum }) => datum.y}
          />
          <VictoryArea
            // barWidth={3}
            style={{
              data: { fill: "#3A8DE1", fillOpacity: 0.3 },
            }}
            // barRatio={1}
            data={dataArray}
            // labels={({ datum }) => datum.y}
          />
        </VictoryGroup>
      </VictoryChart>
    </>
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
