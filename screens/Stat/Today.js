import React, { useState } from "react"
import styled from "styled-components"
import { TouchableOpacity } from "react-native"
import Day from "../Day"
import VTodayBar from "../../graphsVictory/VTodayBar"
import SubPieChart from "../../graphs/SubPieChart"
import StackedBar from "../../graphs/StackedBar"
import StackedTodayBar from "../../graphs/StackedTodayBar"

import SplitArray from "../../components/SplitArray"
import SumArray from "../../components/SumArray"
import WeekRange from "../../components/WeekRange"
import twoArraySum from "../../components/twoArraySum"
import ObjectCopy from "../../components/ObjectCopy"
import { Calendar } from "react-native-calendars"
import Modal from "react-native-modal"

const View = styled.View`
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10;
  margin-left: 5;
  margin-right: 5;
`
const GraphView = styled.View``

const DayView = styled.View`
  background-color: rgba(233, 237, 244, 1);
  margin-top: 10;
`
const Text = styled.Text`
  font-size: 15;
`
const TodayView = styled.View`
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
const RowView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 2;
  margin-bottom: 3;
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
const FlexView = styled.View`
  flex: 1;
`
const FlexViewAb = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const FlexView2 = styled.View`
  flex: 0.5;
  justify-content: center;
  align-items: center;
`
const BoxView1 = styled.View`
  flex-direction: row;
  margin-top: 10;
  justify-content: center;
  flex-wrap: wrap;
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
let taskArray = []
let taskArray_schedule = []
let taskArray_scheduleT = []
let taskArray_percent = []
let taskArray_percentT = []
let schedule_label = []
let schedule_color = []
let scheduleList_selectDay = []
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

const Today = ({
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
  const [selectDay, setselectDay] = useState(targetToday)
  const myState = myData.studyPurpose === "학습" ? ["자습", "강의"] : ["업무", "개인"]

  //////myData
  const scheduleList = myData.schedules
  const { real_weekStart, real_weekEnd } = WeekRange(selectDate)
  const lastMonthDate = new Date(selectDate.getFullYear(), selectDate.getMonth() + 1, 0).getDate()
  // daysOfMonth Area차트의 x축 라벨 변수
  const daysOfMonth_tmp = Array.from(Array(lastMonthDate).keys())
  const daysOfMonth_number = daysOfMonth_tmp.map((a) => a + 1)
  const daysOfMonth = daysOfMonth_number.map(String)

  const todaySchedule_calculate = () => {
    scheduleList_selectDay = []
    for (let i = 0; i < scheduleList.length; i++) {
      const startYear = new Date(scheduleList[i].start).getFullYear()
      const startMonth = new Date(scheduleList[i].start).getMonth()
      const startDate = new Date(scheduleList[i].start).getDate()
      if (
        startYear === selectDate.getFullYear() &&
        startMonth === selectDate.getMonth() &&
        startDate === selectDate.getDate() &&
        scheduleList[i].isPrivate === false
      ) {
        scheduleList_selectDay.push(scheduleList[i])
      }
    }
    scheduleList_selectDay_length = scheduleList_selectDay.length
  }

  const todayGraph_calculate = () => {
    // console.log(scheduleList_selectDay);
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
        resultArray_schedule.push(SumArray(slicedTime))
        resultArray_scheduleT.push(totalMin)
      } else {
        resultArray_schedule[duplIndex] = resultArray_schedule[duplIndex] + SumArray(slicedTime)
        resultArray_scheduleT[duplIndex] = resultArray_scheduleT[duplIndex] + totalMin
      }
      // 자습 강의 구분하여 시간 넣기
      if (scheduleList_selectDay[j].state === myState[0]) {
        selfStudy_box.push(SumArray(slicedTime))
        selfStudy_boxT.push(totalMin)
      } else if (scheduleList_selectDay[j].state === myState[1]) {
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
    // 스케줄(TASK) 시간 퍼센트 계산
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
    // 도넛차트 계산
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
            // 현재 Real중이므로 지금 뒤에 시간은 다 이전시간으로 처리
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
          rgbBox.push("rgba(15,76,130, 1)") // 클래식 블루 Real시간
          break // Real시간으로 끝남
        } else {
          const studyTime = slicedTimes.slice(0, index_tmp2)
          slicedTimeBox.push(studyTime)
          rgbBox.push("rgba(15,76,130, 1)") // 클래식 블루 Real시간
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
  ///    console.log(myData.studyPurpose, "myData.studyPurpose")

  if (!loading) {
    todaySchedule_calculate()
    todayGraph_calculate()
    // console.log(self_percentT, "1")
    // console.log(lecture_percentT, "2")
  }
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <DayView>
      <TodayView>
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <Text>{selectDay}</Text>
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
            maxDate={"2050-05-30"}
            onDayPress={(day) => {
              setSelectDate(new Date(day.timestamp))
              setselectDay(day.dateString)
              setModalVisible(!modalVisible)
            }}
            monthFormat={"yyyy MM"}
            onPressArrowLeft={(subtractMonth) => subtractMonth()}
            onPressArrowRight={(addMonth) => addMonth()}
          />
        </Modal>
      </TodayView>
      <TouchableOpacity style={{ flex: 1 }} onPress={onRefresh}>
        <ChartView>
          <Day
            donutPercent={donutPercent}
            existTime={Math.floor(existTime_donut)}
            nowtarget={Math.floor(targetTime_donut)}
          />
        </ChartView>
      </TouchableOpacity>
      <Line />

      <View>
        <CenterView>
          {/* <Icon name={Platform.OS === "ios" ? "ios-time" : "md-time"} color={"black"} size={15} /> */}
          <SubText>시간대별 Deep Time </SubText>
        </CenterView>
        <VTodayBar
          taskArray={taskArray}
          // ylength={Math.max.apply(null, taskArray)}
          ylength={60}
          title={"시간별 Real 시간"}
          title_y={"Real 시간(분)"}
        />
      </View>
      <Line />
      <View>
        <CenterView>
          <SubText>과목 Deep Time </SubText>
          <ChartView1>
            <Box selectColor={"rgba(123, 169, 234, 1)"} />
            <BoxText>Real</BoxText>
            <Box selectColor={"rgba(233, 237, 244, 1)"} />
            <BoxText>Plan</BoxText>
          </ChartView1>
        </CenterView>
        <StackedTodayBar
          data_1={taskArray_schedule}
          data_2={taskArray_scheduleT}
          labels={schedule_label}
          label_1={"Real"}
          label_2={"Plan"}
          title={"과목별 Real 시간"}
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
              title={selectPercent ? "과목별 Plan Deep Time 비율" : "과목별 Real Deep Time 비율"}
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
    </DayView>
  )
}
export default Today
