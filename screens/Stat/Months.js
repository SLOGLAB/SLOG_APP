import React, { useState } from "react"
import styled from "styled-components"
import { TouchableOpacity, ScrollView, RefreshControl } from "react-native"
import VmonthBar from "../../graphsVictory/VmonthBar"
import SumArray from "../../components/SumArray"
import SubPieChart from "../../graphs/SubPieChart"
import { Calendar } from "react-native-calendars"
import Modal from "react-native-modal"
import StackedWMBar from "../../graphs/StackedWMBar"
import WeekRange from "../../components/WeekRange"
import twoArraySum from "../../components/twoArraySum"
import ObjectCopy from "../../components/ObjectCopy"
import Day from "../Day"
import StackedBar from "../../graphs/StackedBar"

// import { gql } from "apollo-boost"
// import { useQuery } from "@apollo/react-hooks"
// import { array } from "prop-types"

const View = styled.View`
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10;
  margin-left: 5;
  margin-right: 5;
`
const DayView = styled.View`
  background-color: rgba(233, 237, 244, 1);
  margin-top: 10;
  margin-left: 5;
  margin-right: 5;
`
// border-radius: 20;
// margin-left: 10;
// margin-right: 10;

const Text = styled.Text`
  font-size: 15;
  font-family: "GmarketMedium";
`
const MonthView = styled.View`
  justify-content: center;
  align-items: center;
  background-color: rgba(233, 237, 244, 1);
`
const ChartView = styled.View`
  flex: 1;
  background-color: rgba(233, 237, 244, 1);
  margin-top: 5;
`
const ChartView1 = styled.View`
  flex-direction: row;
  margin-top: 10;
`

const ChartText = styled.Text`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-left: 8;
`
const MainText = styled.Text`
  color: black;
  font-size: 25;
  font-family: "GmarketBold";
  padding-left: 10;
`
const SubText = styled.Text`
  color: black;
  font-size: 15;
  padding-left: 10;
  margin-top: 10;
  font-family: "GmarketMedium";
`
const BoxView1 = styled.View`
  flex-direction: row;
  margin-top: 10;
  justify-content: center;
  flex-wrap: wrap;
`
const RowView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 2;
  margin-bottom: 3;
`
const FlexView2 = styled.View`
  flex: 0.5;
  justify-content: center;
  align-items: center;
`
const FlexView = styled.View`
  flex: 1;
`
const FlexViewAb = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const TouchBox = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  margin-left: 0;
  height: 40;
  width: 40;
  border-radius: 20;
  background-color: ${(props) => props.Color};
`
const TouchText = styled.Text`
  color: ${(props) => props.Color};
  font-family: "GmarketMedium";
`
const Line = styled.View`
  background-color: rgba(233, 237, 244, 1);
  height: 10;
  flex: 1;
`
const Box = styled.View`
  background-color: ${(props) => props.selectColor};
  height: 10;
  width: 25;
  margin-left: 10;
`
const BoxText = styled.Text`
  color: black;
  font-size: 10;
  margin-left: 5;
  font-family: "GmarketLight";
`
const CenterView = styled.View`
  justify-content: center;
  align-items: center;
`
let taskArray = []
let taskArray_week = []
let taskArray_month = []
let taskArray_pre = []
let taskArray_week_pre = []
let taskArray_month_pre = []
let taskArray_schedule = []
let taskArray_schedule_week = []
let taskArray_schedule_month = []
let taskArray_scheduleT = []
let taskArray_scheduleT_week = []
let taskArray_scheduleT_month = []
let taskArray_percent = []
let taskArray_percentT = []
let schedule_label = []
let schedule_color = []
let scheduleList_selectDay = []
let scheduleList_pre = [] // 어제
let scheduleList_selectDay_week = [[], [], [], [], [], [], []]
let scheduleList_week_pre = [[], [], [], [], [], [], []] // 저번주
let scheduleList_selectDay_month = []
let scheduleList_month_pre = [] // 저번달
let donutData_1 = 0
let donutData_2 = 0
let donutPercent = 0
let scheduleList_selectDay_length = 0
// let scheduleList_selectDay_week_length = 0;
let scheduleList_selectDay_month_length = 0
let self_percent = []
let lecture_percent = []
let self_percentT = []
let lecture_percentT = []
let target_min = 0
let target_hour = 0
let total_min = 0
let total_hour = 0
const Months = ({
  myData,
  onRefresh,
  selectDate,
  nextDate,
  setSelectDate,
  oneDayHours,
  loading,
  targetToday,
  selectPercent,
  setSelectPercent,
  selectPercent2,
  setSelectPercent2,
  refreshing,
}) => {
  const [selectDay, setselectDay] = useState(targetToday)
  const myState = myData.studyPurpose === "학습" ? ["자습", "강의"] : ["업무", "개인"]

  var now = new Date(selectDay)
  var theYear = now.getFullYear()
  var theMonth = now.getMonth() + 1
  var thisMonthDays
  thisMonthDays = new Date(theYear, theMonth, 0).getDate() //이번달 일 수

  var thisMonth = []
  var thisy = []
  var thism = []
  var thisd = []
  for (var i = 1; i < thisMonthDays + 1; i++) {
    var resultDay = new Date(theYear, theMonth, i)
    var yyyy = resultDay.getFullYear()
    var mm = Number(resultDay.getMonth())
    var dd = resultDay.getDate()

    mm = String(mm).length === 1 ? "0" + mm : mm
    dd = String(dd).length === 1 ? "0" + dd : dd

    thisMonth[i] = yyyy + "-" + mm + "-" + dd
    thisy[i] = yyyy
    thism[i] = mm
    thisd[i] = dd
  }

  //
  const scheduleList = myData.schedules
  // const lastMonthDate = new Date(selectDate.getFullYear(), selectDate.getMonth() + 1, 0).getDate()
  // // // daysOfMonth Area차트의 x축 라벨 변수
  // const daysOfMonth_tmp = Array.from(Array(lastMonthDate).keys())
  // const daysOfMonth_number = daysOfMonth_tmp.map((a) => a + 1)
  // const daysOfMonth = daysOfMonth_number.map(String)
  const lastMonthDate = new Date(selectDate)
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
  const selectMonthDate = new Date(selectDate.getFullYear(), selectDate.getMonth() + 1, 0).getDate()
  // daysOfMonth Area차트의 x축 라벨 변수
  const daysOfMonth_tmp = Array.from(Array(selectMonthDate).keys())
  const daysOfMonth_number = daysOfMonth_tmp.map((a) => a + 1)
  const daysOfMonth = daysOfMonth_number.map(String)

  const monthSchedule_calculate = () => {
    scheduleList_selectDay_month = []
    for (let i = 0; i < scheduleList.length; i++) {
      const startYear = new Date(scheduleList[i].start).getFullYear()
      const startMonth = new Date(scheduleList[i].start).getMonth()
      if (startYear === selectDate.getFullYear() && startMonth === selectDate.getMonth()) {
        scheduleList_selectDay_month.push(scheduleList[i])
      } else if (
        startYear === lastMonthDate.getFullYear() &&
        startMonth === lastMonthDate.getMonth()
      ) {
        scheduleList_month_pre.push(scheduleList[i])
      }
    }
    scheduleList_selectDay_month_length = scheduleList_selectDay_month.length
  }
  const monthGraph_calculate = () => {
    // 초기화
    taskArray_month = new Array(selectMonthDate).fill(0)
    taskArray_month_pre = new Array(selectMonthDate).fill(0)
    donutData_1 = 0
    donutData_2 = 0
    donutPercent = 0
    // 이번달에 생선된 시간이 있는 인덱스 구하기 & time 뽑기
    let indexOfMonth = []
    let stackIndex = 0 // 원래 인덱스에서 잘려나간 부분을 추가해주는 변수
    let slicedTimes = ObjectCopy(myData.times)
    while (true) {
      const index_tmp = slicedTimes.findIndex(
        (i) =>
          new Date(i.createdAt).getFullYear() == selectDate.getFullYear() &&
          new Date(i.createdAt).getMonth() == selectDate.getMonth()
      )
      if (index_tmp === -1) {
        break
      } else {
        indexOfMonth.push(index_tmp + stackIndex)
        if (index_tmp === slicedTimes.length - 1) {
          break
        }
      }
      slicedTimes = slicedTimes.slice(index_tmp + 1)
      stackIndex = stackIndex + index_tmp + 1
    }
    let arrayBox = new Array(selectMonthDate).fill(null).map(() => {
      return { existTime: 0, time_24: new Array(288).fill(0) }
    })
    if (indexOfMonth[0] !== undefined) {
      for (let k = 0; k < indexOfMonth.length; k++) {
        const dateIndex = new Date(myData.times[indexOfMonth[k]].createdAt).getDate() - 1
        arrayBox[dateIndex] = myData.times[indexOfMonth[k]]
      }
    }
    // 저번달에 생선된 시간이 있는 인덱스 구하기 & time 뽑기
    indexOfMonth = []
    stackIndex = 0 // 원래 인덱스에서 잘려나간 부분을 추가해주는 변수
    slicedTimes = ObjectCopy(myData.times)
    while (true) {
      const index_tmp = slicedTimes.findIndex(
        (i) =>
          new Date(i.createdAt).getFullYear() == lastMonthDate.getFullYear() &&
          new Date(i.createdAt).getMonth() == lastMonthDate.getMonth()
      )
      if (index_tmp === -1) {
        break
      } else {
        indexOfMonth.push(index_tmp + stackIndex)
        if (index_tmp === slicedTimes.length - 1) {
          break
        }
      }
      slicedTimes = slicedTimes.slice(index_tmp + 1)
      stackIndex = stackIndex + index_tmp + 1
    }
    let arrayBox_pre = new Array(selectMonthDate).fill(null).map(() => {
      return { existTime: 0, time_24: new Array(288).fill(0) }
    })
    if (indexOfMonth[0] !== undefined) {
      for (let k = 0; k < indexOfMonth.length; k++) {
        const dateIndex = new Date(myData.times[indexOfMonth[k]].createdAt).getDate() - 1
        arrayBox_pre[dateIndex] = myData.times[indexOfMonth[k]]
      }
    }

    // AreaChart 계산
    let resultArray = arrayBox.map((a) => SumArray(a.time_24))
    taskArray_month = twoArraySum(taskArray_month, resultArray)
    let resultArray_pre = arrayBox_pre.map((a) => SumArray(a.time_24))
    taskArray_month_pre = twoArraySum(taskArray_month_pre, resultArray_pre)
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
    for (let j = 0; j < scheduleList_selectDay_month_length; j++) {
      const dateIndex = new Date(scheduleList_selectDay_month[j].start).getDate() - 1
      const todayTime_24 = arrayBox[dateIndex].time_24
      const totalMin = scheduleList_selectDay_month[j].totalTime / 60
      const totalMin_start =
        new Date(scheduleList_selectDay_month[j].start).getHours() * 60 +
        new Date(scheduleList_selectDay_month[j].start).getMinutes()
      const totalMin_end =
        new Date(scheduleList_selectDay_month[j].end).getHours() * 60 +
        new Date(scheduleList_selectDay_month[j].end).getMinutes()
      const indexMin_start = totalMin_start / 5
      const indexMin_end = totalMin_end / 5
      let slicedTime = todayTime_24.slice(indexMin_start, indexMin_end)
      //만약 2틀에 걸친 스케줄이라면
      if (
        new Date(scheduleList_selectDay_month[j].start).getDate() !==
        new Date(scheduleList_selectDay_month[j].end).getDate()
      ) {
        /// 토요일(일주일 끝나는날) 다음날에 걸치는 스케줄 있을시 다음날 시간 땡겨오기
        let nextdayTime_24 = []
        if (dateIndex + 1 === selectMonthDate) {
          const nextMonthFirstDay = new Date(selectDate.getFullYear(), selectDate.getMonth() + 1, 1)
          const indexOfNextday = myData.times.findIndex(
            (i) =>
              new Date(i.createdAt).getFullYear() == nextMonthFirstDay.getFullYear() &&
              new Date(i.createdAt).getMonth() == nextMonthFirstDay.getMonth() &&
              new Date(i.createdAt).getDate() == nextMonthFirstDay.getDate()
          )
          if (indexOfNextday === -1) {
            nextdayTime_24 = new Array(288).fill(0)
          } else {
            nextdayTime_24 = myData.times[indexOfNextday].time_24
          }
        } else {
          nextdayTime_24 = arrayBox[dateIndex + 1].time_24
        }

        const scheduleTime_today = todayTime_24.slice(indexMin_start, 288)
        const scheduleTime_nextday = nextdayTime_24.slice(0, indexMin_end)
        slicedTime = [...scheduleTime_today, ...scheduleTime_nextday]
      }
      const duplIndex = schedule_label.indexOf(
        scheduleList_selectDay_month[j].subject
          ? scheduleList_selectDay_month[j].subject.name
          : "과목 없음"
      ) // 중복되는 과목 인덱스 체크
      if (duplIndex === -1) {
        schedule_label.push(
          scheduleList_selectDay_month[j].subject
            ? scheduleList_selectDay_month[j].subject.name
            : "과목 없음"
        )
        resultArray_schedule.push(SumArray(slicedTime))
        schedule_color.push(
          scheduleList_selectDay_month[j].subject
            ? scheduleList_selectDay_month[j].subject.bgColor
            : "#A1B56C"
        )
        resultArray_scheduleT.push(totalMin)
      } else {
        resultArray_schedule[duplIndex] = resultArray_schedule[duplIndex] + SumArray(slicedTime)
        resultArray_scheduleT[duplIndex] = resultArray_scheduleT[duplIndex] + totalMin
      }
      // 자습 강의 구분하여 시간 넣기
      if (scheduleList_selectDay_month[j].state === myState[0]) {
        selfStudy_box.push(SumArray(slicedTime))
        selfStudy_boxT.push(totalMin)
      } else if (scheduleList_selectDay_month[j].state === myState[1]) {
        lectureStudy_box.push(SumArray(slicedTime))
        lectureStudy_boxT.push(totalMin)
      }
    }
    taskArray_schedule_month = new Array(resultArray_schedule.length).fill(0)
    taskArray_scheduleT_month = new Array(resultArray_scheduleT.length).fill(0)
    taskArray_schedule_month = twoArraySum(taskArray_schedule_month, resultArray_schedule)
    taskArray_scheduleT_month = twoArraySum(taskArray_scheduleT_month, resultArray_scheduleT)
    // AreaChart 계산
    taskArray_month.forEach(function (item, index) {
      taskArray_month[index] = item / 60
    })
    taskArray_month_pre.forEach(function (item, index) {
      taskArray_month_pre[index] = item / 60
    })
    // 스케줄 그래프 계산
    if (taskArray_schedule_month !== []) {
      taskArray_schedule_month.forEach(function (item, index) {
        taskArray_schedule_month[index] = item / 3600
      })
    }
    if (taskArray_scheduleT_month !== []) {
      taskArray_scheduleT_month.forEach(function (item, index) {
        taskArray_scheduleT_month[index] = item / 60
      })
    }
    // 스케줄(과목) 시간 퍼센트 계산
    const totalExsitTime = SumArray(taskArray_schedule_month)
    const totalTargetTime = SumArray(taskArray_scheduleT_month)
    if (schedule_label.length === 0) {
      taskArray_percent = [1]
      schedule_color.push("rgba(233, 236, 244, 1)")
    } else if (totalExsitTime === 0) {
      taskArray_percent = taskArray_schedule_month.map(() => 0)
      taskArray_percent.push(1)
      schedule_color.push("rgba(233, 236, 244, 1)")
    } else {
      taskArray_percent = taskArray_schedule_month.map((time) =>
        Math.floor((time / totalExsitTime) * 100)
      )
    }
    if (schedule_label.length === 0) {
      taskArray_percentT = [1]
      schedule_color.push("rgba(233, 236, 244, 1)")
    } else if (totalTargetTime === 0) {
      taskArray_percentT = taskArray_scheduleT_month.map(() => 0)
      taskArray_percentT.push(1)
      schedule_color.push("rgba(233, 236, 244, 1)")
    } else {
      taskArray_percentT = taskArray_scheduleT_month.map((time) =>
        Math.floor((time / totalTargetTime) * 100)
      )
    }
    // 도넛차트 계산
    let existTime_tmp = 0
    for (let j = 0; j < selectMonthDate; j++) {
      existTime_tmp = existTime_tmp + arrayBox[j].existTime
    }
    // existTime_tmp = existTime_tmp / 60
    const targetTime = SumArray(taskArray_scheduleT_month) * 3600
    if (targetTime === 0) {
      donutData_1 = existTime_tmp
      donutData_2 = targetTime
      donutPercent = 0
    } else {
      donutData_1 = existTime_tmp
      donutData_2 = targetTime
      donutPercent = existTime_tmp / targetTime
    }

    //자습 강의 비율 계산
    const total_self = SumArray(selfStudy_box)
    const total_lecture = SumArray(lectureStudy_box)
    const total_value = total_self + total_lecture
    const total_selfT = SumArray(selfStudy_boxT)
    const total_lectureT = SumArray(lectureStudy_boxT)
    const total_valueT = total_selfT + total_lectureT
    if (total_value === 0) {
      self_percent = 0
      lecture_percent = 0
    } else {
      self_percent = Math.round((total_self / total_value) * 100)
      lecture_percent = 100 - self_percent
    }
    if (total_valueT === 0) {
      self_percentT = 0
      lecture_percentT = 0
    } else {
      self_percentT = Math.round((total_selfT / total_valueT) * 100)
      lecture_percentT = 100 - self_percentT
    }
  }
  if (!loading) {
    monthSchedule_calculate()
    monthGraph_calculate()
  }
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <ScrollView
      style={{ backgroundColor: "#E9EDF4" }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          style={{ backgroundColor: "#E9EDF4" }}
        />
      }
    >
      {loading ? (
        <Loader />
      ) : (
        <DayView>
          <MonthView>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <Text>
                {theYear}년{theMonth}월
              </Text>
            </TouchableOpacity>

            <Modal
              animationType="slide"
              transparent={true}
              isVisible={modalVisible}
              backdropColor={"black"}
              onBackdropPress={() => setModalVisible(false)}
            >
              <Calendar
                current={selectDay}
                minDate={"2012-05-10"}
                maxDate={"2030-05-30"}
                // onDayPress={(day) => {
                //   setSelectDate(new Date(day.timestamp))

                //   setselectDay(day.timestamp)
                //   setModalVisible(!modalVisible)
                // }}
                onMonthChange={(month) => {
                  // console.log(month)
                  setSelectDate(new Date(month.timestamp))
                  setselectDay(month.timestamp)
                  setModalVisible(!modalVisible)
                }}
                monthFormat={"yyyy MM"}
                onPressArrowLeft={(subtractMonth) => subtractMonth()}
                onPressArrowRight={(addMonth) => addMonth()}
              />
            </Modal>
          </MonthView>
          <TouchableOpacity style={{ flex: 1 }} onPress={onRefresh}>
            <ChartView>
              <Day
                existTime={Math.floor(donutData_1)}
                nowtarget={Math.floor(donutData_2)}
                donutPercent={donutPercent}
              />
            </ChartView>
          </TouchableOpacity>
          <Line />
          {SumArray(taskArray_month) === 0 && SumArray(taskArray_month_pre) === 0 ? (
            <View style={{ marginTop: 5 }}>
              <CenterView>
                <SubText>일별 학습 시간(시) </SubText>
                <ChartView1>
                  <Box selectColor={"rgba(123, 169, 234, 1)"} />
                  <BoxText>이번달 </BoxText>
                  <Box selectColor={"rgba(199, 233, 248, 1)"} />
                  <BoxText>저번달</BoxText>
                </ChartView1>
              </CenterView>
              <VmonthBar
                taskArray_month={taskArray_month}
                taskArray_month_pre={taskArray_month_pre}
                ylength={1}
                title={"시간별 학습 시간"}
                title_y={"학습 시간(분)"}
              />
            </View>
          ) : (
            <View style={{ marginTop: 5 }}>
              <CenterView>
                {/* {Math.max.apply(null, taskArray_month) < 60 ? (
              <SubText>일별 학습 시간(분) </SubText>
            ) : ( */}
                <SubText>일별 학습 시간(시) </SubText>
                {/* )} */}
                <ChartView1>
                  <Box selectColor={"rgba(123, 169, 234, 1)"} />
                  <BoxText>이번달 </BoxText>
                  <Box selectColor={"rgba(199, 233, 248, 1)"} />
                  <BoxText>저번달</BoxText>
                </ChartView1>
              </CenterView>
              <VmonthBar
                taskArray_month={
                  // Math.max.apply(null, taskArray_month) < 60
                  //   ? taskArray_month.map((v) => {
                  //       return 60 * v
                  //     })
                  //   :
                  taskArray_month
                }
                taskArray_month_pre={taskArray_month_pre}
                ylength={
                  Math.max.apply(null, taskArray_month) < Math.max.apply(null, taskArray_month_pre)
                    ? Math.max.apply(null, taskArray_month_pre) / 60
                    : Math.max.apply(null, taskArray_month) / 60
                }
                title={"시간별 학습 시간"}
                title_y={"학습 시간(분)"}
              />
            </View>
          )}
          <Line />
          <View style={{ marginTop: 5 }}>
            <CenterView>
              <SubText>과목 학습 시간(시)</SubText>
              <ChartView1>
                <Box selectColor={"rgba(123, 169, 234, 1)"} />
                <BoxText>학습</BoxText>
                <Box selectColor={"rgba(233, 237, 244, 1)"} />
                <BoxText>목표</BoxText>
              </ChartView1>
            </CenterView>
            {taskArray_scheduleT_month.length == 0 ? (
              <StackedWMBar
                data_1={[0]}
                data_2={[0]}
                labels={["스케줄 없음"]}
                label_1={"학습"}
                label_2={"목표"}
                title={"과목별 학습 시간"}
                title_x={"시간(분)"}
                stepSize_x={60}
              />
            ) : (
              <StackedWMBar
                data_1={taskArray_schedule_month}
                data_2={taskArray_scheduleT_month}
                labels={schedule_label}
                label_1={"학습"}
                label_2={"목표"}
                title={"과목별 학습 시간"}
                title_x={"시간(분)"}
                stepSize_x={60}
              />
            )}
          </View>
          <Line />
          {/* <View>
            <CenterView>
              <SubText>{selectPercent ? "과목별 목표 시간 비율" : "과목별 학습 시간 비율"}</SubText>
              <BoxView1>
                {schedule_label.map((name, index) => (
                  <RowView key={name} multiline={true}>
                    <Box selectColor={schedule_color[index]} />
                    <BoxText>{name}</BoxText>
                  </RowView>
                ))}
              </BoxView1>
            </CenterView>
            <RowView>
              <FlexView2>
                <TouchBox
                  Color={selectPercent ? "rgba(233, 237, 244, 1)" : "rgba(123, 169, 234, 1)"}
                  onPress={() => {
                    setSelectPercent(false)
                  }}
                >
                  <TouchText Color={selectPercent ? "black" : "white"}>학습</TouchText>
                </TouchBox>
              </FlexView2>
              <FlexView>
                <SubPieChart
                  data={selectPercent ? taskArray_percentT : taskArray_percent}
                  dataColor={schedule_color}
                  labels={schedule_label}
                  title={selectPercent ? "과목별 목표 시간 비율" : "과목별 학습 시간 비율"}
                  updateBoolean={selectPercent}
                />
              </FlexView>
              <FlexView2>
                <TouchBox
                  Color={selectPercent ? "rgba(123, 169, 234, 1)" : "rgba(233, 237, 244, 1)"}
                  onPress={() => {
                    setSelectPercent(true)
                  }}
                >
                  <TouchText Color={selectPercent ? "white" : "black"}>목표</TouchText>
                </TouchBox>
              </FlexView2>
            </RowView>
          </View> */}
          <Line />
          {/* <View>
            <CenterView>
              <SubText>
                {selectPercent2
                  ? `목표 시간 ${myState[0]}&${myState[1]} 비율`
                  : `학습 시간 ${myState[0]}&${myState[1]} 비율`}
              </SubText>
              <ChartView1>
                <Box selectColor={"rgba(123, 169, 234, 1)"} />
                <BoxText>{myState[0]} </BoxText>
                <Box selectColor={"rgba(255, 104, 109, 1)"} />
                <BoxText>{myState[1]}</BoxText>
              </ChartView1>
            </CenterView>
            <RowView>
              <FlexView2>
                <TouchBox
                  Color={selectPercent2 ? "rgba(233, 237, 244, 1)" : "rgba(123, 169, 234, 1)"}
                  onPress={() => {
                    setSelectPercent2(false)
                  }}
                >
                  <TouchText Color={selectPercent2 ? "black" : "white"}>학습</TouchText>
                </TouchBox>
              </FlexView2>
              <FlexView></FlexView>
              <FlexView2>
                <TouchBox
                  Color={selectPercent2 ? "rgba(123, 169, 234, 1)" : "rgba(233, 237, 244, 1)"}
                  onPress={() => {
                    setSelectPercent2(true)
                  }}
                >
                  <TouchText Color={selectPercent2 ? "white" : "black"}>목표</TouchText>
                </TouchBox>
              </FlexView2>
            </RowView>
            <FlexViewAb>
              <StackedBar
                data_1={selectPercent2 ? self_percentT : self_percent}
                data_2={selectPercent2 ? lecture_percentT : lecture_percent}
              />
            </FlexViewAb>
          </View> */}
        </DayView>
      )}
    </ScrollView>
  )
}
export default Months
