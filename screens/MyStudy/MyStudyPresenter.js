import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Image, Platform, View, ScrollView } from "react-native"
import MyStudyBookOne from "./MyStudyBookOne"
import Icon from "../../components/Icon"
import WeekRange from "../../components/WeekRange"
import SumArray from "../../components/SumArray"
import { useMutation } from "@apollo/react-hooks"
import useInput from "../../hooks/useInput"
const MainView = styled.View`
  /* justify-content: center;
  align-items: center; */
  flex: 1;
`
const GroupBox = styled.View`
  width: 90%;
  justify-content: space-between;
  /* border-radius: 10; */
  /* margin-left: 10px;
margin-right: 10px; */
  flex-direction: row;
  /* height: 90; */
  /* border-width: 1; */
`
const SubBox = styled.View`
  /* margin-top: 20; */
  /* width: 100%; */

  border-width: 1;
  border-radius: 8;
  margin-left: 5;
  margin-right: 5;
  margin-top: 5;
`
const BookText = styled.Text`
  margin-top: 10;
  margin-bottom: 10;
  margin-left: 20;
  font-family: "GmarketMedium";
`
export default ({ userbooks, uesrbookRefetch }) => {
  const [More, setMore] = useState(false)

  const moreHandler = () => {
    setMore(!More)
  }

  const nowDate = new Date()
  const calRemainDay = (userbook) => {
    const { real_weekEnd: target_weekEnd } = WeekRange(new Date(userbook.startDate_target)) // 목표 시작일 주의 끝지점
    const { real_weekStart } = WeekRange(nowDate)
    // 지금이 계획 시작 주에 포함되거나 그 이전이면 계획일정에 대한 평가가 불가능함으로 0 반환
    if (nowDate < target_weekEnd) {
      return 0
    }
    const records = userbook.clearRecords
    const preRecords = records.filter((record) => new Date(record.clearDate) < real_weekStart)
    //저번주 까지 완료한 학습량
    const clearPage = SumArray(preRecords.map((record) => record.totalPage))
    // 원래 저번주 까지 했어야 하는 학습량
    const startDate = new Date(userbook.startDate_target)
    startDate.setHours(0, 0, 0, 0)
    const targetDay = (real_weekStart.getTime() - startDate.getTime()) / 86400000
    const tartgetPage = targetDay * userbook.pageOfDay //했어야 하는 학습량
    const delayDay = Math.ceil((tartgetPage - clearPage) / userbook.pageOfDay)
    return delayDay
  }

  return (
    <ScrollView>
      <MainView>
        {userbooks.map((onebook, index) => {
          const { real_weekEnd } = WeekRange(new Date(onebook.endDate_target)) // 계획 끝주의 마지막 날짜 추출
          const delayDay = calRemainDay(onebook)
          return (
            <SubBox key={index}>
              <GroupBox>
                <BookText>{onebook.title}</BookText>
              </GroupBox>
              <MyStudyBookOne
                onebook={onebook}
                delayDay={delayDay}
                nowDate={nowDate}
                real_weekEnd={real_weekEnd}
                uesrbookRefetch={uesrbookRefetch}
              />
            </SubBox>
          )
        })}
      </MainView>
    </ScrollView>
  )
}
