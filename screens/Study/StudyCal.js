import React, { useEffect, useState, useRef } from "react"
import { View, Dimensions, StyleSheet, SafeAreaView, Platform, StatusBar } from "react-native"
import styled from "styled-components"
import constants from "../../constants"
import Loader from "../../components/Loader"

import StudyPoseLand from "../../Object/StudyPoseLand"
import * as Notifications from "expo-notifications"

import { gql } from "apollo-boost"
import Studyinfo from "./Studyinfo"
import moment, { Moment } from "moment"
import SplitArray from "../../components/SplitArray"
import SumArray from "../../components/SumArray"
import WeekRange from "../../components/WeekRange"
import twoArraySum from "../../components/twoArraySum"
import ObjectCopy from "../../components/ObjectCopy"
import { useQuery, useMutation } from "@apollo/react-hooks"
import {
  START_SCHEDULE,
  STOP_SCHEDULE,
  PULL_SCHEDULE,
  CUT_SCHEDULE,
  EXTENSION_SCHEDULE,
  EDIT_STUDYSET,
  GO_WITH,
} from "./StudyQueries"
export const SUBJECT_NAME = gql`
  {
    mySubject {
      id
      name
      bgColor
      bookMark
    }
  }
`
export const MY_TODOLIST = gql`
  {
    myTodolist {
      id
      name
      finish
      finishAt
      subject {
        id
        name
        bgColor
        bookMark
      }
    }
  }
`

const SideView = styled.View`
  width: ${constants.width / 1};
  height: ${constants.height / 1};
  /* flex: 1; */
  /* align-items: flex-end;
  justify-content: flex-end; */
`

const SideView1 = styled.View`
  /* flex: ${(props) => props.bool}; */
  position: absolute;
  width: ${constants.width / 1};
  justify-content: center;
  height: ${(constants.height * 1) / 2.9};
  align-items: flex-end;
  background-color: rgba(233, 237, 244, 0);
  margin-top: ${constants.height / 1.65};
`
const SideViewLand = styled.View`
  width: ${constants.height / 1};
  height: ${constants.width / 1};
  align-items: flex-start;
  justify-content: flex-end;
`
const SideViewLand2 = styled.View`
  position: absolute;
  width: ${constants.height / 2};
  height: ${constants.width / 2};
  justify-content: center;
  align-items: flex-start;
  padding-left: 20;

  background-color: rgba(233, 237, 244, 0);
`
const SideView2 = styled.View`
  width: ${constants.width / 1};
  margin-top: 30;
`
const BodyView = styled.View`
  flex-direction: row;
  /* justify-content: center;
  align-items: cent
  er; */
  width: ${constants.height / 1};
  height: ${constants.width / 1};
  background-color: rgba(15, 76, 130, 1);
`
let scheduleList_selectDay = []
let scheduleList_selectDay_length = 0
let taskArray = []
let taskArray_percent = []
let taskArray_percentT = []
let taskArray_schedule = []
let taskArray_scheduleT = []
let donutData = []
let donutData_1 = 0
let donutData_2 = 0
let donutPercent = 0
let rgbBox = []
let self_percent = []
let lecture_percent = []
let self_percentT = []
let lecture_percentT = []
let schedule_label = []
let schedule_color = []
let nowScheduleIndex = -1
let nowScheduleTime = 0
let nowScheduleTimeT = 0
let nowScheduleColor = "rgba(123, 169, 235, 1)"
let nowTitle1 = ""
let nowTitle2 = ""
let nowMid = ""
let nowMid2 = ""
let nowStartSchedule = ""
let nowEnd = ""
let nextScheduleIndex = -1
let nextTitle1 = ""
let nextTitle2 = ""
let next_TimeText = ""
let break_title = ""
let break_time = ""
let break_boolean = false
let break_countdown = 0
let target_min = 0
let target_hour = 0
let total_min = 0
let endPoint = 0
let existTime_donut = 0
let targetTime_donut = 0

const StudyCal = ({
  navigation,
  myInfoData,
  myInfoRefetch,
  deg,
  // setbool={true}
  loading,
  selectDate,
  nextDate,
  Bright,
  land,
  setting,
  setSetting,
  androidCam,
  setandroidCam,
  personOnoff,
  setpersonOnoff,
  myData,
}) => {
  const scheduleList = myData.schedules
  const { real_weekStart, real_weekEnd } = WeekRange(selectDate)
  const lastMonthDate = new Date(selectDate.getFullYear(), selectDate.getMonth() + 1, 0).getDate()
  // daysOfMonth Area차트의 x축 라벨 변수
  const daysOfMonth_tmp = Array.from(Array(lastMonthDate).keys())
  const daysOfMonth_number = daysOfMonth_tmp.map((a) => a + 1)
  const daysOfMonth = daysOfMonth_number.map(String)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalVisible2, setModalVisible2] = useState(false)

  const todaySchedule_calculate = () => {
    scheduleList_selectDay = []
    for (let i = 0; i < scheduleList.length; i++) {
      const startYear = new Date(scheduleList[i].start).getFullYear()
      const startMonth = new Date(scheduleList[i].start).getMonth()
      const startDate = new Date(scheduleList[i].start).getDate()
      if (
        startYear === selectDate.getFullYear() &&
        startMonth === selectDate.getMonth() &&
        startDate === selectDate.getDate()
      ) {
        scheduleList_selectDay.push(scheduleList[i])
      }
    }
    scheduleList_selectDay_length = scheduleList_selectDay.length

    // 현재 TASK 찾기
    const nowDate = new Date()
    const findShedule = (i) => new Date(i.start) <= nowDate && new Date(i.end) > nowDate
    nowScheduleIndex = scheduleList_selectDay.findIndex(findShedule)
    // 다음 TASK 찾기
    const findShedule_next = (i) => nowDate < new Date(i.start)
    nextScheduleIndex = scheduleList_selectDay.findIndex(findShedule_next)
  }

  const todayGraph_calculate = () => {
    // 초기화
    taskArray = new Array(24).fill(0)
    donutData = []
    donutData_1 = 0
    donutData_2 = 0
    donutPercent = 0
    rgbBox = []
    // 오늘 생선된 시간이 있는 인덱스 구하기
    let indexOfToday = myData.times.findIndex(
      (i) =>
        new Date(i.createdAt).getFullYear() == selectDate.getFullYear() &&
        new Date(i.createdAt).getMonth() == selectDate.getMonth() &&
        new Date(i.createdAt).getDate() == selectDate.getDate()
    )
    let indexOfNextday = myData.times.findIndex(
      (i) =>
        new Date(i.createdAt).getFullYear() == nextDate.getFullYear() &&
        new Date(i.createdAt).getMonth() == nextDate.getMonth() &&
        new Date(i.createdAt).getDate() == nextDate.getDate()
    )
    // today Time 없을 경우 값이 0인 Time 추가해주기
    if (indexOfToday === -1) {
      myData.times.push({
        existTime: 0,
        time_24: new Array(288).fill(0),
      })
      indexOfToday = myData.times.length - 1
    }
    if (indexOfNextday === -1) {
      myData.times.push({
        existTime: 0,
        time_24: new Array(288).fill(0),
      })
      indexOfNextday = myData.times.length - 1
    }

    const todayTime = myData.times[indexOfToday]
    const nextdayTime = myData.times[indexOfNextday]
    // nowSchedule 계산
    if (nowScheduleIndex !== -1) {
      const nowSchedule = scheduleList_selectDay[nowScheduleIndex]
      const nowMin_start =
        new Date(nowSchedule.start).getHours() * 60 + new Date(nowSchedule.start).getMinutes()
      const nowMin_end =
        new Date(nowSchedule.end).getHours() * 60 + new Date(nowSchedule.end).getMinutes()
      const indexMin_start = nowMin_start / 5
      const indexMin_end = nowMin_end / 5
      let slicedTime_now = todayTime.time_24.slice(indexMin_start, indexMin_end)
      if (new Date(nowSchedule.start).getDate() !== new Date(nowSchedule.end).getDate()) {
        const Time_today = todayTime.time_24.slice(indexMin_start, 288)
        const Time_nextday = nextdayTime.time_24.slice(0, indexMin_end)
        slicedTime_now = [...Time_today, ...Time_nextday]
      }
      nowScheduleTime = SumArray(slicedTime_now) / 60
      nowScheduleTimeT = nowSchedule.totalTime / 60 - nowScheduleTime
      nowScheduleColor = nowSchedule.subject?.bgColor
      const startPoint = new Date(nowSchedule.start)
      const endPoint = new Date(nowSchedule.end)
      nowTitle1 = nowSchedule.subject?.name + " (" + nowSchedule.title + ")"
      nowTitle2 = moment(startPoint).format("hh:mma") + " ~ " + moment(endPoint).format("hh:mma")
      nowMid = Math.ceil((endPoint - new Date()) / 60000)
      nowMid2 = (endPoint - new Date()) / 60000
      nowStartSchedule = Math.ceil((new Date() - startPoint) / 60000)
      nowEnd = moment(endPoint).format("hh:mma")
    } else {
      nowScheduleTime = 0
      nowScheduleTimeT = 0
      nowScheduleColor = "rgba(123, 169, 235, 1)"
      nowTitle1 = "현재 스케줄 없음"
      nowTitle2 = "스케줄을 만들어 보세요"
    }
    // nextSchedule 계산
    if (nextScheduleIndex !== -1) {
      const nextSchedule = scheduleList_selectDay[nextScheduleIndex]
      nextTitle1 = nextSchedule.subject?.name
      nextTitle2 = "(" + nextSchedule.title + ")"
      const startPoint_next = new Date(nextSchedule.start)
      const endPoint_next = new Date(nextSchedule.end)
      next_TimeText =
        moment(startPoint_next).format("hh:mma") + "~" + moment(endPoint_next).format("hh:mma")
    } else {
      nextTitle1 = "다음 스케줄 없음"
      nextTitle2 = "스케줄을 만들어 보세요"
      next_TimeText = ""
    }
    // breakTime 계산
    if (nextScheduleIndex > 0) {
      const startPoint_break = new Date(scheduleList_selectDay[nextScheduleIndex - 1].end)
      const endPoint_break = new Date(scheduleList_selectDay[nextScheduleIndex].start)
      const nowTime_break = new Date()
      if (nowTime_break >= startPoint_break && nowTime_break < endPoint_break) {
        break_boolean = true
        break_title = "휴식 시간"
        break_countdown = endPoint_break.getTime() - nowTime_break.getTime() + 60000
      } else {
        break_boolean = false
        break_title = "다음 휴식 시간"
      }
      break_time =
        moment(startPoint_break).format("hh:mma") + "~" + moment(endPoint_break).format("hh:mma")
    } else {
      break_title = "다음 휴식 없음"
      break_time = "X"
      break_boolean = false
    }
    // AreaChart 계산
    const arrayBox = SplitArray(todayTime.time_24, 12)
    let resultArray = arrayBox.map((a) => SumArray(a))
    taskArray = twoArraySum(taskArray, resultArray)
    // 스케줄 별 그래프 계산
    let resultArray_schedule = [] // exist 타임 용
    let resultArray_scheduleT = [] // 타겟타임용
    schedule_label = []
    schedule_color = []
    self_percent = []
    lecture_percent = []
    self_percentT = []
    lecture_percentT = []
    let selfStudy_box = []
    let lectureStudy_box = []
    let selfStudy_boxT = []
    let lectureStudy_boxT = []

    for (let j = 0; j < scheduleList_selectDay_length; j++) {
      // console.log(scheduleList_selectDay);
      const totalMin =
        (new Date(scheduleList_selectDay[j].end).getTime() -
          new Date(scheduleList_selectDay[j].start).getTime()) /
        60000
      const totalMin_start =
        new Date(scheduleList_selectDay[j].start).getHours() * 60 +
        new Date(scheduleList_selectDay[j].start).getMinutes()
      const totalMin_end =
        new Date(scheduleList_selectDay[j].end).getHours() * 60 +
        new Date(scheduleList_selectDay[j].end).getMinutes()
      const indexMin_start = totalMin_start / 5
      const indexMin_end = totalMin_end / 5
      let slicedTime = todayTime.time_24.slice(indexMin_start, indexMin_end)
      //만약 2틀에 걸친 스케줄이라면
      if (
        new Date(scheduleList_selectDay[j].start).getDate() !==
        new Date(scheduleList_selectDay[j].end).getDate()
      ) {
        const scheduleTime_today = todayTime.time_24.slice(indexMin_start, 288)
        const scheduleTime_nextday = nextdayTime.time_24.slice(0, indexMin_end)
        slicedTime = [...scheduleTime_today, ...scheduleTime_nextday]
      }
      const duplIndex = schedule_label.indexOf(
        scheduleList_selectDay[j].subject ? scheduleList_selectDay[j].subject.name : "과목 없음"
      )
      // 중복되는 TASK 인덱스 체크
      if (duplIndex === -1) {
        schedule_label.push(
          scheduleList_selectDay[j].subject ? scheduleList_selectDay[j].subject.name : "과목 없음"
        )
        schedule_color.push(
          scheduleList_selectDay[j].subject ? scheduleList_selectDay[j].subject.bgColor : "#A1B56C"
        )
        // schedule_label.push(scheduleList_selectDay[j].subject.name)
        resultArray_schedule.push(SumArray(slicedTime))
        resultArray_scheduleT.push(totalMin)
      } else {
        resultArray_schedule[duplIndex] = resultArray_schedule[duplIndex] + SumArray(slicedTime)
        resultArray_scheduleT[duplIndex] = resultArray_scheduleT[duplIndex] + totalMin
      }
      // 자습 강의 구분하여 시간 넣기
      if (scheduleList_selectDay[j].state === "자습") {
        selfStudy_box.push(SumArray(slicedTime))
        selfStudy_boxT.push(totalMin)
      } else {
        lectureStudy_box.push(SumArray(slicedTime))
        lectureStudy_boxT.push(totalMin)
      }
    }
    taskArray_schedule = new Array(resultArray_schedule.length).fill(0)
    taskArray_scheduleT = new Array(resultArray_scheduleT.length).fill(0)
    taskArray_schedule = twoArraySum(taskArray_schedule, resultArray_schedule)
    taskArray_scheduleT = twoArraySum(taskArray_scheduleT, resultArray_scheduleT)
    // AreaChart 계산
    taskArray.forEach(function (item, index) {
      taskArray[index] = item / 60
    })
    // 스케줄 그래프 계산
    if (taskArray_schedule !== []) {
      taskArray_schedule.forEach(function (item, index) {
        taskArray_schedule[index] = item / 60
      })
    }
    const totalExsitTime = SumArray(taskArray_schedule)
    const totalTargetTime = SumArray(taskArray_scheduleT)
    if (schedule_label.length === 0) {
      taskArray_percent = [1]
      schedule_color.push("rgba(233, 236, 244, 1)")
    } else if (totalExsitTime === 0) {
      taskArray_percent = taskArray_schedule.map(() => 0)
      taskArray_percent.push(1)
      schedule_color.push("rgba(233, 236, 244, 1)")
    } else {
      taskArray_percent = taskArray_schedule.map((time) =>
        Math.floor((time / totalExsitTime) * 100)
      )
    }
    if (schedule_label.length === 0) {
      taskArray_percentT = [1]
      schedule_color.push("rgba(233, 236, 244, 1)")
    } else if (totalTargetTime === 0) {
      taskArray_percentT = taskArray_scheduleT.map(() => 0)
      taskArray_percentT.push(1)
      schedule_color.push("rgba(233, 236, 244, 1)")
    } else {
      taskArray_percentT = taskArray_scheduleT.map((time) =>
        Math.floor((time / totalTargetTime) * 100)
      )
    }
    //도넛차트 계산
    let slicedTimeBox = []
    // console.log(todayTime.time_24);
    let slicedTimes = ObjectCopy(todayTime.time_24)
    while (true) {
      const index_tmp = slicedTimes.findIndex((i) => i > 0)
      if (index_tmp === -1) {
        slicedTimeBox.push(slicedTimes)
        const nowDateMin_count =
          Math.floor((new Date().getHours() * 60 + new Date().getMinutes()) / 5) + 1
        if (nowDateMin_count === 288) {
          // 지금이 23시 55분 이상이라는 뜻
          rgbBox.push("rgba(233, 236, 244, 1)") // 회색
          break // 빈시간으로 끝남
        } else {
          const lastIndex = 288 - nowDateMin_count // 아직 지나지 않은 시간이 몇칸인지 알려주는 변수
          const lastZeroTime = slicedTimeBox[slicedTimeBox.length - 1]
          if (lastZeroTime.length - lastIndex === 0) {
            // 현재 학습중이므로 지금 뒤에 시간은 다 이전시간으로 처리
            rgbBox.push("rgba(123, 169, 235, 1)") // 파란색 지금 이전 시간
            break // 현재 이전시간으로 끝남
          } else {
            const grayTime = lastZeroTime.slice(0, lastZeroTime.length - lastIndex)
            const blueTime = lastZeroTime.slice(lastZeroTime.length - lastIndex)
            slicedTimeBox[slicedTimeBox.length - 1] = grayTime
            slicedTimeBox.push(blueTime)
            rgbBox.push("rgba(233, 236, 244, 1)") // 회색
            rgbBox.push("rgba(123, 169, 235, 1)") // 파란색 지금 이전 시간
            break // 현재 이전시간으로 끝남
          }
        }
      } else {
        if (index_tmp !== 0) {
          // 0인 시간이 하나라도 있어야 빈시간을 넣지
          slicedTimeBox.push(slicedTimes.slice(0, index_tmp))
          rgbBox.push("rgba(233, 236, 244, 1)") // 회색
          slicedTimes = slicedTimes.slice(index_tmp)
        }
        const index_tmp2 = slicedTimes.findIndex((i) => i == 0)
        if (index_tmp2 === -1) {
          slicedTimeBox.push(slicedTimes)
          rgbBox.push("rgba(15,76,130, 1)") // 클래식 블루 학습시간
          break // 학습시간으로 끝남
        } else {
          const studyTime = slicedTimes.slice(0, index_tmp2)
          slicedTimeBox.push(studyTime)
          rgbBox.push("rgba(15,76,130, 1)") // 클래식 블루 학습시간
          slicedTimes = slicedTimes.slice(index_tmp2)
        }
      }
    }
    donutData = slicedTimeBox.map((a) => a.length * 5)
    const targetTime = SumArray(taskArray_scheduleT) * 60
    existTime_donut = todayTime.existTime
    targetTime_donut = targetTime
    if (targetTime === 0) {
      donutPercent = 0
    } else {
      donutPercent = todayTime.existTime / targetTime
    }
  }

  if (!loading) {
    todaySchedule_calculate()
    todayGraph_calculate()
  }
  const [startScheduleMutation] = useMutation(START_SCHEDULE)
  const [cutScheduleMutation] = useMutation(CUT_SCHEDULE)
  const [extensionScheduleMutation] = useMutation(EXTENSION_SCHEDULE)
  const [stopScheduleMutation] = useMutation(STOP_SCHEDULE)
  const [pullScheduleMutation] = useMutation(PULL_SCHEDULE)

  const [onLoading, setOnLoading] = useState(false)
  const [onstopLoading, setstopOnLoading] = useState(false)
  const [onexLoading, setexOnLoading] = useState(false)
  const [oncutLoading, setcutOnLoading] = useState(false)

  const { loading: subLoading, data: subjectsName, refetch } = useQuery(SUBJECT_NAME, {})
  const { data: todolistData, loading: todolistLoading, refetch: todolistRefetch } = useQuery(
    MY_TODOLIST
  )
  const schedule10Min = () => {
    if (nowMid == 10) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: nowTitle1,
          body: "현재 스케줄이 10분 이내로 남았습니다.",
        },
        trigger: {
          seconds: 1,
        },
      })
    }
    if (nowStartSchedule !== "" && nowStartSchedule == 1) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: nowTitle1,
          body: "스케줄 시작",
        },
        trigger: {
          seconds: 1,
        },
      })
    }
  }

  useEffect(() => {
    // console.log(nowStartSchedule)
  }, [])
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {Platform.OS == "ios" ? (
            <StatusBar barStyle="dark-content" />
          ) : (
            <StatusBar barStyle="light-content" />
          )}
          {!land ? (
            <SafeAreaView>
              <SideView>
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
                  androidCam={androidCam}
                  setandroidCam={setandroidCam}
                  personOnoff={personOnoff}
                  setpersonOnoff={setpersonOnoff}
                  nowMid={nowMid}
                  todayGraph_calculate={todayGraph_calculate}
                  todaySchedule_calculate={todaySchedule_calculate}
                  schedule10Min={schedule10Min}
                />
                <SideView1>
                  <>
                    {todolistLoading || subLoading ? (
                      <Loader />
                    ) : (
                      <Studyinfo
                        nexistTime={existTime_donut}
                        nowtarget={targetTime_donut}
                        donutPercent={donutPercent}
                        taskArray={taskArray}
                        nowScheduleTime={nowScheduleTime}
                        nowScheduleTimeT={nowScheduleTimeT}
                        nowScheduleColor={nowScheduleColor}
                        nowTitle1={nowTitle1}
                        nowTitle2={nowTitle2}
                        break_title={break_title}
                        break_time={break_time}
                        break_countdown={break_countdown}
                        nextTitle1={nextTitle1}
                        nextTitle2={nextTitle2}
                        next_TimeText={next_TimeText}
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}
                        modalVisible2={modalVisible2}
                        setModalVisible2={setModalVisible2}
                        // refreshing={refreshing}
                        // setRefreshing={setRefreshing}
                        // goWithMutation={goWithMutation}
                        myData={myData}
                        myInfoRefetch={myInfoRefetch}
                        loading={loading}
                        nowEnd={nowEnd}
                        startScheduleMutation={startScheduleMutation}
                        cutScheduleMutation={cutScheduleMutation}
                        extensionScheduleMutation={extensionScheduleMutation}
                        stopScheduleMutation={stopScheduleMutation}
                        pullScheduleMutation={pullScheduleMutation}
                        onLoading={onLoading}
                        setOnLoading={setOnLoading}
                        todayGraph_calculate={todayGraph_calculate}
                        nowScheduleIndex={nowScheduleIndex}
                        subjectsName={subjectsName}
                        todolistData={todolistData.myTodolist}
                        scheduleList_selectDay={scheduleList_selectDay}
                        scheduleList_selectDay_length={scheduleList_selectDay_length}
                        nextScheduleIndex={nextScheduleIndex}
                        onstopLoading={onstopLoading}
                        setstopOnLoading={setstopOnLoading}
                        onexLoading={onexLoading}
                        setexOnLoading={setexOnLoading}
                        oncutLoading={oncutLoading}
                        setcutOnLoading={setcutOnLoading}
                        land={land}
                        setting={setting}
                        setSetting={setSetting}
                        androidCam={androidCam}
                        setandroidCam={setandroidCam}
                        personOnoff={personOnoff}
                        setpersonOnoff={setpersonOnoff}
                        nowMid={nowMid}
                      />
                    )}
                  </>
                </SideView1>
              </SideView>
            </SafeAreaView>
          ) : (
            <>
              {/* {Platform.OS == "ios" ? <SideView2 /> : null} */}
              <SideViewLand>
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
                  androidCam={androidCam}
                  setandroidCam={setandroidCam}
                  personOnoff={personOnoff}
                  setpersonOnoff={setpersonOnoff}
                  nowMid={nowMid}
                  todayGraph_calculate={todayGraph_calculate}
                  todaySchedule_calculate={todaySchedule_calculate}
                  schedule10Min={schedule10Min}
                />
                <SideViewLand2>
                  <>
                    {todolistLoading || subLoading ? (
                      <Loader />
                    ) : (
                      <Studyinfo
                        nexistTime={existTime_donut}
                        nowtarget={targetTime_donut}
                        donutPercent={donutPercent}
                        taskArray={taskArray}
                        nowScheduleTime={nowScheduleTime}
                        nowScheduleTimeT={nowScheduleTimeT}
                        nowScheduleColor={nowScheduleColor}
                        nowTitle1={nowTitle1}
                        nowTitle2={nowTitle2}
                        break_title={break_title}
                        break_time={break_time}
                        break_countdown={break_countdown}
                        nextTitle1={nextTitle1}
                        nextTitle2={nextTitle2}
                        next_TimeText={next_TimeText}
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}
                        modalVisible2={modalVisible2}
                        setModalVisible2={setModalVisible2}
                        // refreshing={refreshing}
                        // setRefreshing={setRefreshing}
                        // goWithMutation={goWithMutation}
                        myData={myData}
                        myInfoRefetch={myInfoRefetch}
                        loading={loading}
                        nowEnd={nowEnd}
                        startScheduleMutation={startScheduleMutation}
                        cutScheduleMutation={cutScheduleMutation}
                        extensionScheduleMutation={extensionScheduleMutation}
                        stopScheduleMutation={stopScheduleMutation}
                        pullScheduleMutation={pullScheduleMutation}
                        onLoading={onLoading}
                        setOnLoading={setOnLoading}
                        todayGraph_calculate={todayGraph_calculate}
                        nowScheduleIndex={nowScheduleIndex}
                        subjectsName={subjectsName}
                        todolistData={todolistData.myTodolist}
                        scheduleList_selectDay={scheduleList_selectDay}
                        scheduleList_selectDay_length={scheduleList_selectDay_length}
                        nextScheduleIndex={nextScheduleIndex}
                        onstopLoading={onstopLoading}
                        setstopOnLoading={setstopOnLoading}
                        onexLoading={onexLoading}
                        setexOnLoading={setexOnLoading}
                        oncutLoading={oncutLoading}
                        setcutOnLoading={setcutOnLoading}
                        land={land}
                        setting={setting}
                        setSetting={setSetting}
                        androidCam={androidCam}
                        setandroidCam={setandroidCam}
                        personOnoff={personOnoff}
                        setpersonOnoff={setpersonOnoff}
                        nowMid={nowMid}
                      />
                    )}
                  </>
                </SideViewLand2>
              </SideViewLand>
            </>
          )}
        </>
      )}
    </>
  )
}

export default StudyCal
