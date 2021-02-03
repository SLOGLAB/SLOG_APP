import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Progress from "../graphs/Progress"

const Text = styled.Text`
  align-items: center;
  font-family: "GmarketMedium";
`
const View = styled.View`
  flex: 1;
`
const ChartView = styled.View`
  flex: 1;
  background-color: rgba(255, 255, 255, 1);
  margin-top: 5;
  margin-left: 5;
  margin-right: 5;

  padding-top: 10;
  padding-bottom: 20;
  flex-direction: row;
  border-radius: 10;
`

const ChartOne = styled.View`
  flex: 1;
`
const ChartText = styled.View`
  flex: 1;
  align-items: center;
`
const ChartText1 = styled.View`
  align-items: flex-start;
`

const Day = ({ donutPercent, existTime, nowtarget }) => {
  const [number, setNumber] = useState(0)
  // const [texistTime, setTextsTime] = useState(existTime)

  const minutes = Math.floor(existTime / 60)
  const hour = Math.floor(minutes / 60)

  const targetminutes = Math.floor(nowtarget / 60)
  const targethour = Math.floor(targetminutes / 60)
  return (
    <ChartView>
      <ChartOne>
        <Progress number={donutPercent} />
      </ChartOne>
      <View>
        <ChartText>
          <Text style={{ color: "#2b80ff", fontSize: 30, fontWeight: "bold", marginBottom: 15 }}>
            {Math.floor(donutPercent * 100)}%
          </Text>
        </ChartText>
        <ChartText>
          <ChartText1>
            <Text
              style={{
                color: "#000000",
                fontSize: 15,
                fontWeight: "bold",
                marginBottom: 15,
                fontFamily: "GmarketBold",
              }}
            >
              학습 시간 : {hour < 10 ? `0${hour}` : hour}:
              {minutes - hour * 60 < 10 ? `0${minutes - hour * 60}` : minutes - hour * 60}
              {/* :
              {existTime - minutes * 60 < 10
                ? `0${existTime - minutes * 60}`
                : existTime - minutes * 60} */}
            </Text>
            <Text
              style={{
                color: "#000000",
                fontSize: 15,
                fontWeight: "bold",
                marginBottom: 15,
                fontFamily: "GmarketBold",
              }}
            >
              목표 시간 : {targethour < 10 ? `0${targethour}` : targethour}:
              {targetminutes - targethour * 60 < 10
                ? `0${targetminutes - targethour * 60}`
                : targetminutes - targethour * 60}
              {/* :
              {nowtarget - targetminutes * 60 < 10
                ? `0${nowtarget - targetminutes * 60}`
                : nowtarget - targetminutes * 60} */}
            </Text>
          </ChartText1>
        </ChartText>
      </View>
    </ChartView>
  )
}

export default Day
