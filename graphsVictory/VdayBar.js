import React, { useState, useEffect } from "react"

import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory-native"

const VdayBar = ({ taskArray }) => {
  const hour0 = 0
  const hour1 = (taskArray[0] / 60) * 100
  const hour2 = (taskArray[1] / 60) * 100
  const hour3 = (taskArray[2] / 60) * 100
  const hour4 = (taskArray[3] / 60) * 100
  const hour5 = (taskArray[4] / 60) * 100
  const hour6 = (taskArray[5] / 60) * 100
  const hour7 = (taskArray[6] / 60) * 100
  const hour8 = (taskArray[7] / 60) * 100
  const hour9 = (taskArray[8] / 60) * 100
  const hour10 = (taskArray[9] / 60) * 100
  const hour11 = (taskArray[10] / 60) * 100
  const hour12 = (taskArray[11] / 60) * 100
  const hour13 = (taskArray[12] / 60) * 100
  const hour14 = (taskArray[13] / 60) * 100
  const hour15 = (taskArray[14] / 60) * 100
  const hour16 = (taskArray[15] / 60) * 100
  const hour17 = (taskArray[16] / 60) * 100
  const hour18 = (taskArray[17] / 60) * 100
  const hour19 = (taskArray[18] / 60) * 100
  const hour20 = (taskArray[19] / 60) * 100
  const hour21 = (taskArray[20] / 60) * 100
  const hour22 = (taskArray[21] / 60) * 100
  const hour23 = (taskArray[22] / 60) * 100
  const hour24 = (taskArray[23] / 60) * 100

  useEffect(() => {
    // console.log(taskArray, "taskArray")
  }, [])

  return (
    <>
      {Platform.OS === "ios" ? (
        <VictoryChart
          domain={{ x: [0, 24], y: [0, 100] }}
          height={170}
          // width={400}
          // padding={{ top: 25, bottom: 30, left: 10, right: 30 }}
        >
          <VictoryAxis tickValues={[0, 3, 6, 9, 12, 15, 18, 21, 24]} />
          <VictoryBar
            barWidth={3}
            style={{
              data: { fill: "#c43a31" },
            }}
            // labels={({ datum }) => ` ${datum.y}`}
            barRatio={1}
            data={[
              { x: 0, y: hour0 },
              { x: 1, y: hour1 },
              { x: 2, y: hour2 },
              { x: 3, y: hour3 },
              { x: 4, y: hour4 },
              { x: 5, y: hour5 },
              { x: 6, y: hour6 },
              { x: 7, y: hour7 },
              { x: 8, y: hour8 },
              { x: 9, y: hour9 },
              { x: 10, y: hour10 },
              { x: 11, y: hour11 },
              { x: 12, y: hour12 },
              { x: 13, y: hour13 },
              { x: 14, y: hour14 },
              { x: 15, y: hour15 },
              { x: 16, y: hour16 },
              { x: 17, y: hour17 },
              { x: 18, y: hour18 },
              { x: 19, y: hour19 },
              { x: 20, y: hour20 },
              { x: 21, y: hour21 },
              { x: 22, y: hour22 },
              { x: 23, y: hour23 },
              { x: 24, y: hour24 },
            ]}
          />
        </VictoryChart>
      ) : (
        <VictoryChart
          domain={{ x: [0, 24], y: [0, 100] }}
          theme={VictoryTheme.material}
          height={170}
          //   padding={{ top: 25, bottom: 30, left: 10, right: 30 }}
        >
          <VictoryAxis tickValues={[0, 3, 6, 9, 12, 15, 18, 21, 24]} />
          <VictoryBar
            barWidth={5}
            style={{
              data: { fill: "#c43a31" },
            }}
            // labels={({ datum }) => ` ${datum.y}`}
            barRatio={1}
            data={[
              { x: 0, y: hour0 },
              { x: 1, y: hour1 },
              { x: 2, y: hour2 },
              { x: 3, y: hour3 },
              { x: 4, y: hour4 },
              { x: 5, y: hour5 },
              { x: 6, y: hour6 },
              { x: 7, y: hour7 },
              { x: 8, y: hour8 },
              { x: 9, y: hour9 },
              { x: 10, y: hour10 },
              { x: 11, y: hour11 },
              { x: 12, y: hour12 },
              { x: 13, y: hour13 },
              { x: 14, y: hour14 },
              { x: 15, y: hour15 },
              { x: 16, y: hour16 },
              { x: 17, y: hour17 },
              { x: 18, y: hour18 },
              { x: 19, y: hour19 },
              { x: 20, y: hour20 },
              { x: 21, y: hour21 },
              { x: 22, y: hour22 },
              { x: 23, y: hour23 },
              { x: 24, y: hour24 },
            ]}
          />
        </VictoryChart>
      )}
    </>
  )
}
export default VdayBar
