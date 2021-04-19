import React, { useState, useEffect } from "react"
import { View, Text } from "react-native"
import * as scale from "d3-scale"
import styled from "styled-components"
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryGroup } from "victory-native"

const VweekBar = ({ taskArray_week, taskArray_week_pre, weekHMsosu_pre, ylength, weekHMsosu }) => {
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
  const themeWithSystemFont = replaceRobotoWithSystemFont({ ...VictoryTheme.material })
  return (
    <View style={{ paddingLeft: 5, paddingRight: 5 }}>
      <VictoryChart
        domain={{ x: [0, 7], y: [0, ylength] }}
        height={150}
        padding={{ top: 30, bottom: 30, left: -30, right: 35 }}
        theme={themeWithSystemFont}
      >
        <VictoryGroup offset={15} style={{ data: { width: 9, strokeWidth: 1, fillOpacity: 1 } }}>
          {/* <VictoryBar
            // barWidth={20}
            style={{
              data: { fill: "#5A8DE1" },
              labels: {
                fontSize: 10,
                fill: ({ datum }) => (datum.y === 0 ? "#ffffff" : "#5A8DE1"),
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
            labels={({ datum }) =>
              datum.y * 60 > 60
                ? Math.floor(Math.floor(datum.y * 60) / 60) +
                  "시간" +
                  Math.floor((datum.y * 60) % 60) +
                  "분"
                : Math.floor(datum.y * 60) + "분"
            }
          /> */}
          <VictoryBar
            // barWidth={20}
            style={{
              data: { fill: "#C7E9F8" },
              labels: {
                fontSize: 9,
                fill: ({ datum }) => (datum.y === 0 ? "#ffffff" : "#C7E9F8"),
              },
            }}
            // labels={({ datum }) => {datum.y ==0? "":` ${datum.y}`}}
            barRatio={1}
            data={[
              { x: "일", y: taskArray_week_pre[0] / 60, y0: 0 },
              { x: "월", y: taskArray_week_pre[1] / 60, y0: 0 },
              { x: "화", y: taskArray_week_pre[2] / 60, y0: 0 },
              { x: "수", y: taskArray_week_pre[3] / 60, y0: 0 },
              { x: "목", y: taskArray_week_pre[4] / 60, y0: 0 },
              { x: "금", y: taskArray_week_pre[5] / 60, y0: 0 },
              { x: "토", y: taskArray_week_pre[6] / 60, y0: 0 },
              // { x: "", y: 0 },
            ]}
            labels={({ datum }) =>
              datum.y * 60 > 60
                ? Math.floor(Math.floor(datum.y * 60) / 60) +
                  "시간" +
                  Math.floor((datum.y * 60) % 60) +
                  "분"
                : Math.floor(datum.y * 60) + "분"
            }
          />
          <VictoryBar
            // barWidth={20}
            style={{
              data: { fill: "#5A8DE1" },
              labels: {
                fontSize: 9,
                fill: ({ datum }) => (datum.y === 0 ? "#ffffff" : "#5A8DE1"),
              },
            }}
            // labels={({ datum }) => {datum.y ==0? "":` ${datum.y}`}}
            barRatio={1}
            data={[
              { x: "일", y: taskArray_week[0] / 60, y0: 0 },
              { x: "월", y: taskArray_week[1] / 60, y0: 0 },
              { x: "화", y: taskArray_week[2] / 60, y0: 0 },
              { x: "수", y: taskArray_week[3] / 60, y0: 0 },
              { x: "목", y: taskArray_week[4] / 60, y0: 0 },
              { x: "금", y: taskArray_week[5] / 60, y0: 0 },
              { x: "토", y: taskArray_week[6] / 60, y0: 0 },
              // { x: "", y: 0 },
            ]}
            labels={({ datum }) =>
              datum.y * 60 > 60
                ? Math.floor(Math.floor(datum.y * 60) / 60) +
                  "시간" +
                  Math.floor((datum.y * 60) % 60) +
                  "분"
                : Math.floor(datum.y * 60) + "분"
            }
          />
        </VictoryGroup>
      </VictoryChart>
    </View>
  )
}
export default VweekBar
