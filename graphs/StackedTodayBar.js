import React, { useState, useEffect } from "react"
import SumArray from "../components/SumArray"
import moment, { Moment } from "moment"
import { View } from "react-native"

import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryStack,
  VictoryLabel,
  VictoryTheme,
} from "victory-native"

const StackedTodayBar = ({ data_1, data_2, labels }) => {
  let existArray = []
  let targetArray = []
  if (labels.length !== 0) {
    existArray = labels.map((label, index) => {
      const a = {}
      a.x = label
      // a.y = Math.floor(data_1[index])
      a.y = Math.round(data_1[index] * 10) / 10
      return a
    })
    targetArray = labels.map((label, index) => {
      const a = {}
      a.x = label
      a.y = Math.round((data_2[index] - data_1[index]) * 10) / 10
      a.z = Math.round(data_1[index] * 10) / 10
      return a
    })
  } else {
    existArray = [
      {
        x: "",
        y: 0,
        z: 0,
      },
    ]
    targetArray = [
      {
        x: "",
        y: 0,
        z: 0,
      },
    ]
  }
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
    <VictoryChart
      theme={themeWithSystemFont}
      domain={{
        x: [0, labels.length + 1],
        y: [0, data_2.length === 0 ? 1 : Math.max.apply(null, data_2)],
      }}
      height={200}
      padding={{ top: 10, bottom: 10, left: 75, right: 56 }}
      domainPadding={{ x: 5, y: 10 }}
    >
      <VictoryAxis style={{ labels: { fontSize: 10 } }} />
      <VictoryAxis />
      <VictoryStack
        colorScale={["rgba(123, 169, 234, 1)", "rgba(233, 237, 244, 1)"]}
        style={{ data: { width: 90 / targetArray.length } }}
      >
        <VictoryBar
          horizontal
          data={existArray}
          labels={({ datum }) =>
            datum.y < 60
              ? Math.floor(datum.y) + "m"
              : Math.floor(datum.y / 60) + "h" + Math.floor(datum.y % 60) + "m"
          }
          style={{
            labels: {
              fill:
                //  "rgba(123, 169, 234, 1)"
                ({ datum }) =>
                  datum.y === 0 ? "rgba(233, 237, 244, 0)" : "rgba(123, 169, 234, 1)",
            },
          }}
          labelComponent={<VictoryLabel dy={0} />}
        />
        <VictoryBar
          horizontal
          data={targetArray}
          labels={({ datum }) =>
            datum.y + datum.z < 60
              ? Math.floor(datum.y + datum.z) + "m"
              : Math.floor((datum.y + datum.z) / 60) +
                "h" +
                Math.floor((datum.y + datum.z) % 60) +
                "m"
          }
          style={{ labels: { fill: "rgba(233, 237, 244, 1)" } }}
          labelComponent={<VictoryLabel dy={0} />}
        />
      </VictoryStack>
    </VictoryChart>
  )
}

export default StackedTodayBar
