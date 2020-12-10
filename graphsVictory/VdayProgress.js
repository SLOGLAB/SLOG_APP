import React, { useState, useEffect } from "react"
import { View, Text } from "react-native"
import * as scale from "d3-scale"
import styled from "styled-components"
import { VictoryPie, VictoryChart, VictoryAxis, VictoryLabel } from "victory-native"
import SplitArray from "../components/SplitArray"
import SumArray from "../components/SumArray"
const VdayProgress = ({ number }) => {
  useEffect(() => {}, [])
  const existTime = Math.floor(number * 100)
  const xTime = 100 - existTime

  return (
    <VictoryChart width={320} height={320}>
      <VictoryPie
        standalone={false}
        // animate={{ duration: 750 }}

        data={[
          { x: 1, y: existTime },
          { x: 2, y: xTime },
        ]}
        innerRadius={80}
        cornerRadius={30}
        labels={() => null}
        // style={{
        //   data: { fill: "#c43a31" },
        // }}
        colorScale={["rgba(65, 129, 247, 1)", "rgba(65, 129, 247, 0.1)"]}
      />
      {/* <VictoryAxis style={{ axis: { stroke: "none" }, axisLabel: { fontSize: 0 } }} /> */}
      <VictoryAxis
        style={{
          axis: { stroke: "transparent" },
          ticks: { stroke: "transparent" },
          tickLabels: { fill: "transparent" },
        }}
      />

      <VictoryLabel
        textAnchor="middle"
        verticalAnchor="middle"
        x={160}
        y={160}
        text={`${existTime}%`}
        style={{ fontSize: 55 }}
      />
    </VictoryChart>
  )
}
export default VdayProgress
