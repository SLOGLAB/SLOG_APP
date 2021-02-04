import React, { useEffect, useState } from "react"
import styled from "styled-components"
// import AsyncStorage from "@react-native-community/async-storage"
import { ScrollView, TouchableOpacity, Alert, AsyncStorage } from "react-native"

const DdayText = styled.Text`
  font-family: "GmarketMedium";

  margin-left: 10;
  margin-top: 10;
  font-size: 15;
`
const DdayText1 = styled.Text`
  font-weight: normal;
  margin-left: 10;
  margin-top: 10;
  font-size: 13;
`
const Dday = ({ nowTime, myData, dDate }) => {
  const [Ddays, setDdays] = useState(0)
  // const [Ddaysname, setDdaysname] = useState()

  const getData = async () => {
    try {
      let amount = dDate.getTime() - nowTime.getTime()
      if (amount < 0) {
        setDdays("00")
      } else {
        amount = Math.floor(amount / 1000)
        var days = Math.floor(amount / 86400) + 1
        setDdays(days < 10 ? "0" + days : days)
        // if (jsonNameValue !== null) {
        //   setDdaysname(jsonNameValue.replace(/\"/gi, ""))
        // }
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getData()
  }, [myData])

  return (
    <>
      {myData.dDayOn ? (
        <DdayText>
          {myData.dDateName} D-{Ddays}
        </DdayText>
      ) : (
        <DdayText1>D-day</DdayText1>
      )}
    </>
  )
}
export default Dday
