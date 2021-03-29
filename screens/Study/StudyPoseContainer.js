import React, { useEffect, useState, useRef } from "react"
import StudyPoseLand from "../../Object/StudyPoseLand"
import StudySSd from "../../Object/StudySSd"
import styled from "styled-components"

let existTime_donut = 0
const MainView = styled.View`
  /* justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  width: 100%; */
`

const StudyPoseContainer = ({
  loading,
  selectDate,
  nextDate,
  navigation,
  myInfoData,
  myInfoRefetch,
  Bright,
  land,
  setting,
  setSetting,
}) => {
  const todayGraph_calculate = () => {
    // 오늘 생선된 시간이 있는 인덱스 구하기
    let indexOfToday = myInfoData.me.times.findIndex(
      (i) =>
        new Date(i.createdAt).getFullYear() == selectDate.getFullYear() &&
        new Date(i.createdAt).getMonth() == selectDate.getMonth() &&
        new Date(i.createdAt).getDate() == selectDate.getDate()
    )
    // today Time 없을 경우 값이 0인 Time 추가해주기
    if (indexOfToday === -1) {
      myInfoData.me.times.push({
        existTime: 0,
        time_24: new Array(288).fill(0),
      })
      indexOfToday = myInfoData.me.times.length - 1
    }
    const todayTime = myInfoData.me.times[indexOfToday]
    existTime_donut = todayTime.existTime
  }
  if (!loading) {
    todayGraph_calculate()
  }
  return (
    <StudyPoseLand
      loading={loading}
      navigation={navigation}
      myInfoData={myInfoData}
      myInfoRefetch={myInfoRefetch}
      selectDate={selectDate}
      nextDate={nextDate}
      nexistTime={existTime_donut}
      Bright={Bright}
      land={land}
      setting={setting}
      setSetting={setSetting}
    />
  )
}

export default StudyPoseContainer
{
  /* <StudySSd
                navigation={navigation}
               myInfoData={myInfoData}
               myInfoRefetch={myInfoRefetch}
               deg={"270deg"}
               // setbool={true}
               loading={loading}
               selectDate={selectDate}
               nextDate={nextDate}
               Bright={Bright}
                     land={land}

             /> */
}
