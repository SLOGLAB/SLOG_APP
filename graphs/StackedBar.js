import React, { useState, useEffect } from "react"
import SumArray from "../components/SumArray"
import { View } from "react-native"

import { VictoryBar, VictoryChart, VictoryAxis, VictoryStack, VictoryLabel } from "victory-native"
import { Text } from "react-native-svg"

const StackedBar = ({ data_1, data_2 }) => {
  const dataA = [{ x: "", y: data_1 }]
  const dataB = dataA.map((point) => {
    const y = data_2
    return { ...point, y }
  })

  const width = 300
  const height = 100

  return (
    <VictoryChart horizontal height={height} width={width} padding={40}>
      {/* <VictoryStack style={{ data: { width: 25 }, labels: { fontSize: 15 } }}> */}

      {data_1 === 0 && data_2 === 0 ? (
        <VictoryStack style={{ data: { width: 25 }, labels: { fontSize: 12 } }}>
          <VictoryBar
            style={{ data: { fill: "rgba(123, 169, 234, 1)" } }}
            data={[{ x: "", y: 100 }]}
          />
        </VictoryStack>
      ) : (
        <VictoryStack style={{ data: { width: 25 }, labels: { fontSize: 12 } }}>
          <VictoryBar
            style={{ data: { fill: "rgba(123, 169, 234, 1)" } }}
            data={dataA}
            y={(data) => -Math.abs(data.y)}
            labels={({ datum }) => `${Math.abs(datum.y)}%`}
          />
          <VictoryBar
            style={{ data: { fill: "rgba(255, 104, 109, 1)" } }}
            data={dataB}
            labels={({ datum }) => `${Math.abs(datum.y)}%`}
          />
        </VictoryStack>
      )}
      {/* 233, 237, 244, 1 */}
      {/* </VictoryStack> */}

      <VictoryAxis
        style={{
          axis: { stroke: "transparent" },
          ticks: { stroke: "transparent" },
          tickLabels: { fontSize: 15, fill: "black" },
        }}
        tickLabelComponent={<VictoryLabel x={width / 2} textAnchor="middle" />}
        tickValues={dataA.map((point) => point.x).reverse()}
      />
    </VictoryChart>
  )
}

export default StackedBar
