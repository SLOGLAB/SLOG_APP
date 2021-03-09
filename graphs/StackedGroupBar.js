import React, { useState, useEffect } from "react"
import SumArray from "../components/SumArray"
import moment, { Moment } from "moment"

import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryStack,
  VictoryLabel,
  VictoryTheme,
} from "victory-native"

const StackedGroupBar = ({ data_1, labels, data_2 }) => {
  let existArray = []

  if (labels.length !== 0) {
    existArray = labels.map((label, index) => {
      const a = {}
      a.x = label
      a.y = Math.round(data_1[index] * 10) / 10
      a.z = data_2[index]
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
        // y: [0, data_2.length === 0 ? 1 : Math.max.apply(null, data_2)],
      }}
      height={100}
      padding={{ top: 10, bottom: 10, left: 75, right: 56 }}
      domainPadding={{ x: 5, y: 10 }}
    >
      <VictoryAxis style={{ labels: { fontSize: 10 } }} />

      {/* <VictoryAxis dependentAxis tickFormat={(tick) => `${tick}`} /> */}

      {/* ,"#58A0F5" */}
      <VictoryBar
        horizontal
        style={{ data: { fill: ({ datum }) => datum.z } }}
        data={existArray}
        labels={({ datum }) =>
          datum.y < 60
            ? Math.floor(datum.y) + "m"
            : Math.floor(datum.y / 60) + "h" + Math.floor(datum.y % 60) + "m"
        }
        labelComponent={<VictoryLabel dy={0} />}
      />
    </VictoryChart>
  )
}

export default StackedGroupBar
