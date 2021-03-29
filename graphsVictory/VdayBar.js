import React, { useState, useEffect } from "react"

import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory-native"

const VdayBar = ({ taskArray }) => {
  const hour0 = 0
  const hour1 = taskArray[0] / 1
  const hour2 = taskArray[1] / 1
  const hour3 = taskArray[2] / 1
  const hour4 = taskArray[3] / 1
  const hour5 = taskArray[4] / 1
  const hour6 = taskArray[5] / 1
  const hour7 = taskArray[6] / 1
  const hour8 = taskArray[7] / 1
  const hour9 = taskArray[8] / 1
  const hour10 = taskArray[9] / 1
  const hour11 = taskArray[10] / 1
  const hour12 = taskArray[11] / 1
  const hour13 = taskArray[12] / 1
  const hour14 = taskArray[13] / 1
  const hour15 = taskArray[14] / 1
  const hour16 = taskArray[15] / 1
  const hour17 = taskArray[16] / 1
  const hour18 = taskArray[17] / 1
  const hour19 = taskArray[18] / 1
  const hour20 = taskArray[19] / 1
  const hour21 = taskArray[20] / 1
  const hour22 = taskArray[21] / 1
  const hour23 = taskArray[22] / 1
  const hour24 = taskArray[23] / 1

  useEffect(() => {}, [])
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
    <>
      <VictoryChart
        domain={{ x: [0, 24], y: [0, 60] }}
        height={170}
        theme={themeWithSystemFont}

        // width={400}
        // padding={{ top: 25, bottom: 30, left: 10, right: 30 }}
      >
        <VictoryAxis dependentAxis tickFormat={(tick) => `${tick}`} />

        <VictoryAxis tickValues={[0, 2, 4, 6, 8, , 10, 12, 14, 16, 18, 20, 22]} />
        <VictoryBar
          barWidth={6}
          style={{
            data: { fill: "#0F4C82" },
          }}
          // labels={({ datum }) => ` ${datum.y}`}
          barRatio={1}
          data={[
            { x: 0, y: hour1 },
            { x: 1, y: hour2 },
            { x: 2, y: hour3 },
            { x: 3, y: hour4 },
            { x: 4, y: hour5 },
            { x: 5, y: hour6 },
            { x: 6, y: hour7 },
            { x: 7, y: hour8 },
            { x: 8, y: hour9 },
            { x: 9, y: hour10 },
            { x: 10, y: hour11 },
            { x: 11, y: hour12 },
            { x: 12, y: hour13 },
            { x: 13, y: hour14 },
            { x: 14, y: hour15 },
            { x: 15, y: hour16 },
            { x: 16, y: hour17 },
            { x: 17, y: hour18 },
            { x: 18, y: hour19 },
            { x: 19, y: hour20 },
            { x: 20, y: hour21 },
            { x: 21, y: hour22 },
            { x: 22, y: hour23 },
            { x: 23, y: hour24 },
          ]}
          labels={({ datum }) => (` ${datum.y}` < 1 ? null : ` ${datum.y}`)}
        />
      </VictoryChart>
    </>
  )
}
export default VdayBar
