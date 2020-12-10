import React from "react"
import { ProgressCircle } from "react-native-svg-charts"
import styled from "styled-components"
const Text = styled.Text``
const View = styled.View``

const Progress = ({ number }) => {
  return (
    <View>
      <ProgressCircle
        style={{ height: 100 }}
        progress={number}
        progressColor={"rgba(123, 169, 234, 1)"}
        backgroundColor={"rgba(123, 169, 235, 0.15)"}
        // startAngle={-Math.PI * 0.8}
        // endAngle={Math.PI * 0.8}
        strokeWidth={15}
      ></ProgressCircle>
    </View>
  )
}

export default Progress
