import React from "react"
import { PieChart } from "react-native-svg-charts"
import styled from "styled-components"
const Text = styled.Text``
const View = styled.View``

export default ({ data, color }) => {
  // const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]

  // const randomColor = () =>
  //   ("#" + ((Math.random() * 0xffffff) << 0).toString(16) + "000000").slice(0, 7)
  console.log(data, color, "1")
  const pieData = data
    .filter((value) => value > 0)
    .map((value, index) => {
      // console.log(value, color[index])
      return {
        value,
        svg: {
          fill: color[index],
          onPress: () => console.log("press", index, value),
        },
        key: `pie-${index}`,
      }
    })
  return <PieChart style={{ height: 200 }} data={pieData} />
}
