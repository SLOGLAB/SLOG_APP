import React, { useState, useEffect } from "react"
import { Platform } from "react-native"

import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory-native"

const VTodayBar = ({ taskArray, ylength }) => {
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
        domain={{ x: [0, 24], y: [0, ylength] }}
        height={150}
        padding={{ top: 25, bottom: 30, left: 30, right: 30 }}
        theme={themeWithSystemFont}
      >
        <VictoryAxis dependentAxis tickFormat={(tick) => `${tick}`} />
        <VictoryAxis tickValues={[0, 6, 12, 18, 24]} />
        <VictoryBar
          barWidth={5}
          style={{
            data: { fill: "#c43a31" },
          }}
          // labels={({ datum }) => ` ${datum.y}`}
          barRatio={1}
          data={[
            { x: 0, y: 0 },
            { x: 1, y: taskArray[0] },
            { x: 2, y: taskArray[1] },
            { x: 3, y: taskArray[2] },
            { x: 4, y: taskArray[3] },
            { x: 5, y: taskArray[4] },
            { x: 6, y: taskArray[5] },
            { x: 7, y: taskArray[6] },
            { x: 8, y: taskArray[7] },
            { x: 9, y: taskArray[8] },
            { x: 10, y: taskArray[9] },
            { x: 11, y: taskArray[10] },
            { x: 12, y: taskArray[11] },
            { x: 13, y: taskArray[12] },
            { x: 14, y: taskArray[13] },
            { x: 15, y: taskArray[14] },
            { x: 16, y: taskArray[15] },
            { x: 17, y: taskArray[16] },
            { x: 18, y: taskArray[17] },
            { x: 19, y: taskArray[18] },
            { x: 20, y: taskArray[19] },
            { x: 21, y: taskArray[20] },
            { x: 22, y: taskArray[21] },
            { x: 23, y: taskArray[22] },
            { x: 24, y: taskArray[23] },
          ]}
        />
      </VictoryChart>
    </>
  )
}
export default VTodayBar
{
  /* <VictoryChart
   domain={{ x: [0, 24], y: [0, ylength] }}
   height={150}
   padding={{ top: 25, bottom: 30, left: 30, right: 30 }}
 >
   <VictoryAxis dependentAxis tickFormat={(tick) => `${tick}`} />
   <VictoryAxis tickValues={[0, 6, 12, 18, 24]} />
   <VictoryBar
     barWidth={5}
     style={{
       data: { fill: "#c43a31" },
     }}
     // labels={({ datum }) => ` ${datum.y}`}
     barRatio={1}
     data={[
       { x: 0, y: 0 },
       { x: 1, y: taskArray[0] },
       { x: 2, y: taskArray[1] },
       { x: 3, y: taskArray[2] },
       { x: 4, y: taskArray[3] },
       { x: 5, y: taskArray[4] },
       { x: 6, y: taskArray[5] },
       { x: 7, y: taskArray[6] },
       { x: 8, y: taskArray[7] },
       { x: 9, y: taskArray[8] },
       { x: 10, y: taskArray[9] },
       { x: 11, y: taskArray[10] },
       { x: 12, y: taskArray[11] },
       { x: 13, y: taskArray[12] },
       { x: 14, y: taskArray[13] },
       { x: 15, y: taskArray[14] },
       { x: 16, y: taskArray[15] },
       { x: 17, y: taskArray[16] },
       { x: 18, y: taskArray[17] },
       { x: 19, y: taskArray[18] },
       { x: 20, y: taskArray[19] },
       { x: 21, y: taskArray[20] },
       { x: 22, y: taskArray[21] },
       { x: 23, y: taskArray[22] },
       { x: 24, y: taskArray[23] },
     ]}
   />
 </VictoryChart> */
}
