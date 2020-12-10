import React, { useEffect } from "react"
import { StackedBarChart, Grid, YAxis } from "react-native-svg-charts"
import { View, Text } from "react-native"

const BarCharts = ({ nowScheduleTime, nowScheduleTimeT, nowScheduleColor }) => {
  const data1 = [
    {
      now: nowScheduleTime,
      nowT: nowScheduleTimeT + nowScheduleTime,
    },
  ]
  const CUT_OFF = 50

  const colors = [`${nowScheduleColor}`, "#E9ECF3"]
  const keys = ["now", "nowT"]
  const data = [nowScheduleTimeT + nowScheduleTime]

  const Labels = ({ x, y, bandwidth, data }) =>
    data.map((value, index) => (
      <Text
        key={index}
        x={value > CUT_OFF ? x(0) + 10 : x(value) + 10}
        y={y(index) + bandwidth / 2}
        fontSize={14}
        fill={value > CUT_OFF ? "white" : "black"}
        alignmentBaseline={"middle"}
      >
        {value}
      </Text>
    ))

  //  useEffect(()=>{
  //  console.log(nowScheduleTime,nowScheduleTimeT,nowScheduleColor)
  //  },[])
  return (
    <View>
      <StackedBarChart
        style={{ height: 20, marginLeft: 30, marginRight: 30 }}
        keys={keys}
        colors={colors}
        data={data1}
        showGrid={true}
        horizontal={true}
        contentInset={{ top: 30, bottom: 30 }}
      >
        {/* <Labels/> */}
      </StackedBarChart>
    </View>
  )
}

export default BarCharts
