import React, { useEffect, useState } from "react"
import { PieChart } from "react-native-svg-charts"
// import constants from "../constants"
import { Text, Circle, G, Line } from "react-native-svg"
import { Alert } from "react-native"

import styled from "styled-components"
import SumArray from "../components/SumArray"
const View = styled.View`
  height: 200;
`
const View1 = styled.View``
const SubPieChart = ({ data, dataColor, labels}) => {
  let pieData = []

  pieData = dataColor.map((dataColor, index) => {
    const a = {}
    a.key = index + 1
    a.name = labels[index]
    a.amount = data[index]
    a.svg = {
      fill: dataColor,
      onPress: () => Alert.alert(labels[index], data[index] + "%"),
    }

    return a
  })

  const data1 = pieData.filter((i) => i.amount > 0)

  const Labels = ({ slices, height, width }) => {
    return slices.map((slice, index) => {
      const { labelCentroid, pieCentroid, data } = slice
      return (
        <Text
          key={index}
          x={pieCentroid[0]}
          y={pieCentroid[1]}
          fill={"black"}
          textAnchor={"middle"}
          alignmentBaseline={"middle"}
          fontSize={12}
          stroke={"black"}
          strokeWidth={0.2}
        >
          {/* {data.name} */}
          {data.amount<4?"":data.amount+"%"}
        </Text>
      )
    })
  }

  // useEffect(() => {
  //   // colorSetting()
  //   // sum()
  //   // console.log(slices)
  //   // console.log(data, "data")
  //   // console.log(dataColor, "dataColor")
  //   // console.log(labels, "labels")
  //   // console.log(updateBoolean, "updateBoolean")
  //   // console.log("------------")
  // }, [])
  return (
    <View>
      <PieChart
        style={{ height: 180 }}
        valueAccessor={({ item }) => item.amount}
        data={data1}
        spacing={0}
        outerRadius={"95%"}
      >
        {data.length === labels.length ? <Labels /> : <View1 />}
      </PieChart>
    </View>
  )
}

export default SubPieChart
