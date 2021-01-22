import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { TouchableOpacity } from "react-native"

import Day from "../Day"
import VweekBar from "../../graphsVictory/VweekBar"
import SubPieChart from "../../graphs/SubPieChart"

import SumArray from "../../components/SumArray"
import { Calendar } from "react-native-calendars"
import Modal from "react-native-modal"
import StackedWMBar from "../../graphs/StackedWMBar"
import WeekRange from "../../components/Date/WeekRange"
import ObjectCopy from "../../components/ObjectCopy"
import twoArraySum from "../../components/twoArraySum"
import StackedBar from "../../graphs/StackedBar"

const LodingView = styled.View`
  background-color: rgba(255, 255, 255, 1);
`
const View = styled.View`
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10;
  margin-left: 5;
  margin-right: 5;
`
const DayView = styled.View`
  background-color: rgba(233, 237, 244, 1);
  margin-top: 10;
`
// border-radius: 20;
// margin-left: 10;
// margin-right: 10;

const Text = styled.Text`
  font-size: 15;
`
const WeekView = styled.View`
  justify-content: center;
  align-items: center;
  background-color: rgba(233, 237, 244, 1);
`
const ChartView = styled.View`
  flex: 1;
  background-color: rgba(233, 237, 244, 1);

  margin-top: 5;
`
// const ChartView1 = styled.View`
//   flex: 1;
//   background-color: rgba(233, 237, 244, 1);
//   margin-left: 10;
//   margin-right: 10;
//   margin-top: 5;
//   margin-bottom: 5;
//   border-radius: 20;
//   padding-top: 10;
//   padding-bottom: 20;
//   flex-direction: row;
// `
const ChartView1 = styled.View`
  flex-direction: row;
  margin-top: 10;
`

const ChartText = styled.Text`
  justify-content: center;
  align-items: center;
`
const MainText = styled.Text`
  color: black;
  font-size: 25;
  font-weight: bold;
  padding-left: 10;
`
const SubText = styled.Text`
  color: black;
  font-size: 15;
  padding-left: 10;
  margin-top: 10;
`
const Line = styled.View`
  background-color: rgba(233, 237, 244, 1);
  height: 10;
  flex: 1;
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
`
const CenterView = styled.View`
  justify-content: center;
  align-items: center;
`
let taskArray = []
let taskArray_week = []
let taskArray_month = []
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
let scheduleList_selectDay_week = [[], [], [], [], [], [], []]
let scheduleList_selectDay_month = []
let donutData = []
let donutData_1 = 0
let donutData_2 = 0
let donutPercent = 0
let rgbBox = []
let scheduleList_selectDay_length = 0
// let scheduleList_selectDay_week_length = 0;
let scheduleList_selectDay_month_length = 0
let self_percent = []
let lecture_percent = []
let self_percentT = []
let lecture_percentT = []
let existTime_donut = 0
let targetTime_donut = 0
const Weeks = ({
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
}) => {
  /////월요일부터 이번주 공부시간///////
  const [selectDay, setselectDay] = useState(targetToday)
  var currentDay = new Date(selectDay)
  var theYear = currentDay.getFullYear()
  var theMonth = currentDay.getMonth()
  var theDate = currentDay.getDate()
  var theDayOfWeek = currentDay.getDay() //요일

  var thisWeek = []
  var thism = []
  var thisd = []
  var thisy = []

  for (var i = 0; i < 7; i++) {
    var resultDay = new Date(theYear, theMonth, theDate + (i - theDayOfWeek))
    var yyyy = resultDay.getFullYear()
    var mm = Number(resultDay.getMonth()) + 1
    var dd = resultDay.getDate()

    mm = String(mm).length === 1 ? "0" + mm : mm
    dd = String(dd).length === 1 ? "0" + dd : dd

    thisWeek[i] = yyyy + "-" + mm + "-" + dd
    thisy[i] = yyyy
    thism[i] = mm
    thisd[i] = dd
  }

  //
  const scheduleList = myData.schedules
  const { real_weekStart, real_weekEnd } = WeekRange(selectDate)
  const lastMonthDate = new Date(selectDate.getFullYear(), selectDate.getMonth() + 1, 0).getDate()
  // daysOfMonth Area차트의 x축 라벨 변수
  const daysOfMonth_tmp = Array.from(Array(lastMonthDate).keys())
  const daysOfMonth_number = daysOfMonth_tmp.map((a) => a + 1)
  const daysOfMonth = daysOfMonth_number.map(String)

  const weekSchedule_calculate = () => {
    scheduleList_selectDay_week = [[], [], [], [], [], [], []]
    for (let i = 0; i < scheduleList.length; i++) {
      if (
        new Date(scheduleList[i].start) >= real_weekStart &&
        new Date(scheduleList[i].start) < real_weekEnd &&
        scheduleList[i].isPrivate === false
      ) {
        const dayIndex = new Date(scheduleList[i].start).getDay()
        scheduleList_selectDay_week[dayIndex].push(scheduleList[i])
      }
    }
    // let schedule_length = 0;
    // for (let i = 0; i < 7; i++) {
    //   schedule_length = schedule_length + scheduleList_selectDay_week[i].length;
    // }
    // scheduleList_selectDay_week_length = schedule_length;
  }

  const weekGraph_calculate = () => {
    // 초기화
    taskArray_week = new Array(7).fill(0)
    donutData_1 = 0
    donutData_2 = 0
    donutPercent = 0
    // 이번주에 생선된 시간이 있는 인덱스 구하기
    let indexOfWeek = []
    let stackIndex = 0 // 원래 인덱스에서 잘려나간 부분을 추가해주는 변수
    let slicedTimes = ObjectCopy(myData.times)
    while (true) {
      const index_tmp = slicedTimes.findIndex(
        (i) => new Date(i.createdAt) >= real_weekStart && new Date(i.createdAt) < real_weekEnd
      )
      if (index_tmp === -1) {
        break
      } else {
        indexOfWeek.push(index_tmp + stackIndex)
        if (index_tmp === slicedTimes.length - 1) {
          break
        }
      }
      slicedTimes = slicedTimes.slice(index_tmp + 1)
      stackIndex = stackIndex + index_tmp + 1
    }
    let arrayBox = new Array(7).fill(null).map(() => {
      return { existTime: 0, time_24: new Array(288).fill(0) }
    })
    if (indexOfWeek[0] !== undefined) {
      for (let k = 0; k < indexOfWeek.length; k++) {
        const dayIndex = new Date(myData.times[indexOfWeek[k]].createdAt).getDay()
        arrayBox[dayIndex].time_24 = myData.times[indexOfWeek[k]].time_24
        arrayBox[dayIndex].existTime = myData.times[indexOfWeek[k]].existTime
      }
    }

    // AreaChart 계산
    let resultArray = arrayBox.map((a) => SumArray(a.time_24))
    taskArray_week = twoArraySum(taskArray_week, resultArray)
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
    for (let k = 0; k < 7; k++) {
      const todayTime_24 = arrayBox[k].time_24
      for (let j = 0; j < scheduleList_selectDay_week[k].length; j++) {
        // console.log(scheduleList_selectDay);
        const totalMin =
          (new Date(scheduleList_selectDay_week[k][j].end).getTime() -
            new Date(scheduleList_selectDay_week[k][j].start).getTime()) /
          60000
        const totalMin_start =
          new Date(scheduleList_selectDay_week[k][j].start).getHours() * 60 +
          new Date(scheduleList_selectDay_week[k][j].start).getMinutes()
        const totalMin_end =
          new Date(scheduleList_selectDay_week[k][j].end).getHours() * 60 +
          new Date(scheduleList_selectDay_week[k][j].end).getMinutes()
        const indexMin_start = totalMin_start / 5
        const indexMin_end = totalMin_end / 5
        let slicedTime = todayTime_24.slice(indexMin_start, indexMin_end)
        //만약 2틀에 걸친 스케줄이라면
        if (
          new Date(scheduleList_selectDay_week[k][j].start).getDate() !==
          new Date(scheduleList_selectDay_week[k][j].end).getDate()
        ) {
          /// 토요일(일주일 끝나는날) 다음날에 걸치는 스케줄 있을시 다음날 시간 땡겨오기
          let nextdayTime_24 = []
          if (k === 6) {
            const indexOfNextday = myData.times.findIndex(
              (i) =>
                new Date(i.createdAt).getFullYear() == real_weekEnd.getFullYear() &&
                new Date(i.createdAt).getMonth() == real_weekEnd.getMonth() &&
                new Date(i.createdAt).getDate() == real_weekEnd.getDate()
            )
            if (indexOfNextday === -1) {
              nextdayTime_24 = new Array(288).fill(0)
            } else {
              nextdayTime_24 = myData.times[indexOfNextday].time_24
            }
          } else {
            nextdayTime_24 = arrayBox[k + 1].time_24
          }

          const scheduleTime_today = todayTime_24.slice(indexMin_start, 288)
          const scheduleTime_nextday = nextdayTime_24.slice(0, indexMin_end)
          slicedTime = [...scheduleTime_today, ...scheduleTime_nextday]
        }
        const duplIndex = schedule_label.indexOf(
          scheduleList_selectDay_week[k][j].subject
            ? scheduleList_selectDay_week[k][j].subject.name
            : "과목 없음"
        ) // 중복되는 TASK 인덱스 체크
        if (duplIndex === -1) {
          schedule_label.push(
            scheduleList_selectDay_week[k][j].subject
              ? scheduleList_selectDay_week[k][j].subject.name
              : "과목 없음"
          )
          schedule_color.push(
            scheduleList_selectDay_week[k][j].subject
              ? scheduleList_selectDay_week[k][j].subject.bgColor
              : "#A1B56C"
          )
          resultArray_schedule.push(SumArray(slicedTime))
          resultArray_scheduleT.push(totalMin)
        } else {
          resultArray_schedule[duplIndex] = resultArray_schedule[duplIndex] + SumArray(slicedTime)
          resultArray_scheduleT[duplIndex] = resultArray_scheduleT[duplIndex] + totalMin
        }
        // 자습 강의 구분해서 시간 넣기
        if (scheduleList_selectDay_week[k][j].state === myState[0]) {
          selfStudy_box.push(SumArray(slicedTime))
          selfStudy_boxT.push(totalMin)
        } else {
          lectureStudy_box.push(SumArray(slicedTime))
          lectureStudy_boxT.push(totalMin)
        }
      }
    }
    taskArray_schedule_week = new Array(resultArray_schedule.length).fill(0)
    taskArray_scheduleT_week = new Array(resultArray_scheduleT.length).fill(0)
    taskArray_schedule_week = twoArraySum(taskArray_schedule_week, resultArray_schedule)
    taskArray_scheduleT_week = twoArraySum(taskArray_scheduleT_week, resultArray_scheduleT)
    // AreaChart 계산
    taskArray_week.forEach(function (item, index) {
      taskArray_week[index] = item / 60
    })
    // 스케줄 그래프 계산
    if (taskArray_schedule_week !== []) {
      taskArray_schedule_week.forEach(function (item, index) {
        taskArray_schedule_week[index] = item / 3600
      })
    }
    if (taskArray_scheduleT_week !== []) {
      taskArray_scheduleT_week.forEach(function (item, index) {
        taskArray_scheduleT_week[index] = item / 60
      })
    }
    // 스케줄(TASK) 시간 퍼센트 계산
    const totalExsitTime = SumArray(taskArray_schedule_week)
    const totalTargetTime = SumArray(taskArray_scheduleT_week)
    if (schedule_label.length === 0) {
      taskArray_percent = [1]
      schedule_color.push("rgba(233, 236, 244, 1)")
    } else if (totalExsitTime === 0) {
      taskArray_percent = taskArray_schedule_week.map(() => 0)
      taskArray_percent.push(1)
      schedule_color.push("rgba(233, 236, 244, 1)")
    } else {
      taskArray_percent = taskArray_schedule_week.map((time) =>
        Math.floor((time / totalExsitTime) * 100)
      )
    }
    if (schedule_label.length === 0) {
      taskArray_percentT = [1]
      schedule_color.push("rgba(233, 236, 244, 1)")
    } else if (totalTargetTime === 0) {
      taskArray_percentT = taskArray_scheduleT_week.map(() => 0)
      taskArray_percentT.push(1)
      schedule_color.push("rgba(233, 236, 244, 1)")
    } else {
      taskArray_percentT = taskArray_scheduleT_week.map((time) =>
        Math.floor((time / totalTargetTime) * 100)
      )
    }
    // 도넛차트 계산
    let existTime_tmp = 0
    for (let j = 0; j < 7; j++) {
      existTime_tmp = existTime_tmp + arrayBox[j].existTime
    }
    const targetTime = SumArray(taskArray_scheduleT_week) * 3600
    if (targetTime === 0) {
      donutData_1 = 0
      donutData_2 = 0
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
  const myState = myData.studyPurpose === "학습" ? ["자습", "강의"] : ["업무", "개인"]

  if (!loading) {
    weekSchedule_calculate()
    weekGraph_calculate()
  }
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <DayView>
      <WeekView>
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <Text>
            {/* {month}월 {weekOfMonth(nowDate)}주차 */}
            {thisy[0]}.{thism[0]}.{thisd[0]}~{thisy[6]}.{thism[6]}.{thisd[6]}
          </Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          isVisible={modalVisible}
          onBackdropPress={() => setModalVisible(false)}
          backdropColor={"black"}
        >
          <Calendar
            current={selectDay}
            minDate={"2012-05-10"}
            maxDate={"2030-05-30"}
            onDayPress={(day) => {
              // console.log(day.dateString)
              setSelectDate(new Date(day.timestamp))

              setselectDay(day.timestamp)
              setModalVisible(!modalVisible)
            }}
            monthFormat={"yyyy MM"}
            onPressArrowLeft={(subtractMonth) => subtractMonth()}
            onPressArrowRight={(addMonth) => addMonth()}
          />
        </Modal>
      </WeekView>

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
      {SumArray(taskArray_week) === 0 ? (
        <View>
          <CenterView>
            <SubText>요일별 Deep Time(시) </SubText>
          </CenterView>
          <VweekBar taskArray_week={taskArray_week} ylength={1} />
        </View>
      ) : (
        <View>
          <CenterView>
            {Math.max.apply(null, taskArray_week) < 60 ? (
              <SubText>요일별 Deep Time(분) </SubText>
            ) : (
              <SubText>요일별 Deep Time(시) </SubText>
            )}
          </CenterView>
          <VweekBar
            taskArray_week={
              Math.max.apply(null, taskArray_week) < 60
                ? taskArray_week.map((v) => {
                    return 60 * v
                  })
                : taskArray_week
            }
            ylength={
              Math.max.apply(null, taskArray_week) < 60
                ? Math.max.apply(null, taskArray_week)
                : Math.max.apply(null, taskArray_week) / 60
            }
            title={"요일별 Deep Time"}
            title_y={"Deep Time(분)"}
            weekHMsosu={Math.max.apply(null, taskArray_week) < 60 ? 0 : 1}
          />
        </View>
      )}

      <Line />
      <View>
        <CenterView>
          <SubText>과목 Deep Time(시)</SubText>
          <ChartView1>
            <Box selectColor={"rgba(123, 169, 234, 1)"} />
            <BoxText>학습 </BoxText>
            <Box selectColor={"rgba(233, 237, 244, 1)"} />
            <BoxText>목표</BoxText>
          </ChartView1>
        </CenterView>
        <StackedWMBar
          data_1={taskArray_schedule_week}
          data_2={taskArray_scheduleT_week}
          labels={schedule_label}
          label_1={"학습"}
          label_2={"목표"}
          title={"과목별 Deep Time"}
          title_x={"시간(분)"}
          stepSize_x={60}
        />
      </View>
      <Line />
      <View>
        <CenterView>
          <SubText>
            {selectPercent ? "과목별 Plan Deep Time 비율" : "과목별 Real Deep Time 비율"}
          </SubText>
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
              Color={selectPercent ? "rgba(123, 169, 234, 1)" : "rgba(233, 237, 244, 1)"}
              onPress={() => {
                setSelectPercent(true)
              }}
            >
              <TouchText Color={selectPercent ? "white" : "black"}>Plan</TouchText>
            </TouchBox>
          </FlexView2>
          <FlexView>
            <SubPieChart
              data={selectPercent ? taskArray_percentT : taskArray_percent}
              dataColor={schedule_color}
              labels={schedule_label}
              title={selectPercent ? "과목별 Plan Time 비율" : "과목별 Deep Time 비율"}
              updateBoolean={selectPercent}
            />
          </FlexView>
          <FlexView2>
            <TouchBox
              Color={selectPercent ? "rgba(233, 237, 244, 1)" : "rgba(123, 169, 234, 1)"}
              onPress={() => {
                setSelectPercent(false)
              }}
            >
              <TouchText Color={selectPercent ? "black" : "white"}>Real</TouchText>
            </TouchBox>
          </FlexView2>
        </RowView>
      </View>
      <Line />
      <View>
        <CenterView>
          <SubText>
            {selectPercent2
              ? `Plan Deep Time ${myState[0]}&${myState[1]} 비율`
              : `Real Deep Time ${myState[0]}&${myState[1]} 비율`}
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
              Color={selectPercent2 ? "rgba(123, 169, 234, 1)" : "rgba(233, 237, 244, 1)"}
              onPress={() => {
                setSelectPercent2(true)
              }}
            >
              <TouchText Color={selectPercent2 ? "white" : "black"}>Plan</TouchText>
            </TouchBox>
          </FlexView2>
          <FlexView></FlexView>
          <FlexView2>
            <TouchBox
              Color={selectPercent2 ? "rgba(233, 237, 244, 1)" : "rgba(123, 169, 234, 1)"}
              onPress={() => {
                setSelectPercent2(false)
              }}
            >
              <TouchText Color={selectPercent2 ? "black" : "white"}>Real</TouchText>
            </TouchBox>
          </FlexView2>
        </RowView>
        <FlexViewAb>
          <StackedBar
            data_1={selectPercent2 ? self_percentT : self_percent}
            data_2={selectPercent2 ? lecture_percentT : lecture_percent}
          />
        </FlexViewAb>
      </View>
      <Line />
    </DayView>
  )
}
export default Weeks

// // 도넛차트 계산
// let existTime_tmp = 0
// for (let j = 0; j < 7; j++) {
//   existTime_tmp = existTime_tmp + arrayBox[j].existTime
// }
// const targetTime = SumArray(taskArray_scheduleT_week) * 60

// if (targetTime === 0) {
//   donutData_1 = 0
//   donutData_2 = 0
//   donutPercent = 0
// } else {
//   donutData_1 = existTime_tmp
//   donutData_2 = targetTime
//   donutPercent = existTime_tmp / targetTime
// }
