import React, { useEffect, useState } from "react"
import styled from "styled-components"
import {
  TouchableWithoutFeedback,
  Alert,
  Keyboard,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native"
import { useMutation } from "@apollo/react-hooks"
import RNPickerSelect from "react-native-picker-select"
import AuthInput from "../../../components/AuthInput"
import useInput from "../../../hooks/useInput"
import { Button, Text } from "native-base"
import constants from "../../../constants"
import Modal from "react-native-modal"
import DateTimePicker from "@react-native-community/datetimepicker"
import moment from "moment"
import { gql } from "apollo-boost"
import { SCHEDULE_USER } from "../../../screens/AWeekTime/TimetableWeek"
import { selectDate, events_data } from "../../AWeekTime/TimeWeek"
import { Calendar } from "react-native-calendars"
import { CheckBox } from "native-base"
import AuthButton from "../../../components/AuthButton"
import { Ionicons } from "@expo/vector-icons"
const MarginR = styled.View``

const MarginView = styled.View`
  flex: 1;
  height: 10;
`
const View1 = styled.View`
  justify-content: center;
  align-items: center;
  flex: 0.15;
`
const WeekView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`
const View2 = styled.View`
  flex: 1;
  /* background-color: "#000000"; */
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-width: 0;
  border-radius: 5;
  border-color: rgba(126, 127, 125, 0.7);
`
const View21 = styled.View`
  flex: 1;
  /* background-color: "#000000"; */
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const View3 = styled.View`
  flex: 0.5;
  /* background-color: "#000000"; */
  flex-direction: row;
  justify-content: center;
`

const TotalView = styled.View`
  align-items: center;
  flex: 1;
`
const EmptyView = styled.View``
const ModalView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const ModalView_State = styled.View`
  flex: 0.7;
  justify-content: center;
  align-items: center;
`
const ModalView_Private = styled.View`
  flex: 0.5;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const RowAndView = styled.View`
  /* flex-direction: row; */
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: 1;
  margin-top: 10;
  /* background-color: rgba(15, 76, 130, 1); */
`
const RowView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${constants.width / 1.1};
  height: 60;
  /* background-color: rgba(15, 76, 130, 1); */
`
const View12 = styled.View`
  flex: 1;
  /* width: 200; */
  height: 60;
  justify-content: center;
`
const View121 = styled.View`
  flex: 0.5;
  /* width: 200; */
  height: 70;
  justify-content: center;
  align-items: flex-end;
`
const View13 = styled.View`
  flex: 0.1;
  /* width: 200; */
  height: 50;
  justify-content: center;
`
const ModalCalView = styled.View`
  justify-content: center;
  align-items: center;
  background-color: rgba(233, 237, 244, 1);
  margin-top: 20;
  border-width: 2;
  border-color: rgba(15, 76, 130, 1);
  border-radius: 5;
`
const RowText = styled.Text`
  font-size: 15;
`
export const SAVE_SCHEDULE = gql`
  mutation saveSchedule_my($scheduleArray: [ScheduleArray_my!]!) {
    saveSchedule_my(scheduleArray: $scheduleArray)
  }
`

let newScheduleArray = []
export default AddTimeSchedule = ({ goback, subjectsName, targetToday, myData }) => {
  const myState = myData.me.studyPurpose === "학습" ? ["자습", "강의"] : ["업무", "개인"]

  const lists = [
    {
      label: `${myState[0]}`,
      value: `${myState[0]}`,
    },
    {
      label: `${myState[1]}`,
      value: `${myState[1]}`,
    },
  ]
  const [selectDay, setselectDay] = useState(targetToday)

  var scheduleArray = []
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

  //////일주일 날짜
  const [day1, setday1] = useState(false)
  const [day2, setday2] = useState(false)
  const [day3, setday3] = useState(false)
  const [day4, setday4] = useState(false)
  const [day5, setday5] = useState(false)
  const [day6, setday6] = useState(false)
  const [day7, setday7] = useState(false)
  var dayLists = [day7, day1, day2, day3, day4, day5, day6]

  const dayList = ["일", "월", "화", "수", "목", "금", "토"]
  const SubjectList_tmp = subjectsName.mySubject.map((file) => {
    if (file.bookMark) {
      return {
        label: file.name,
        value: file.id,
      }
    }
  })
  const SubjectList = SubjectList_tmp.filter(function (el) {
    return el != undefined
  })
  const initDate = new Date(selectDate[0])
  const nowDate = new Date()
  // 시간만 계속 지금 시간으로 변경
  initDate.setHours(nowDate.getHours())
  // 초기화용 시간, 현재 시간에서 분초 다 뺀거
  initDate.setMilliseconds(-(initDate.getMinutes() * 60000 + initDate.getSeconds() * 1000))
  const initDate2 = new Date(initDate)
  initDate2.setHours(initDate2.getHours() + 1)
  const [subjectId, setSubjectId] = useState("")
  const [substate, setsubstate] = useState(`${myState[0]}`)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalVisibleEnd, setModalVisibleEnd] = useState(false)
  const [calVisibleStart, setCalVisibleStart] = useState(false)
  const [calVisibleEnd, setCalVisibleEnd] = useState(false)
  const [modifyLoading, setModifyLoading] = useState(false)
  const [startTime, setstartTime] = useState(initDate)
  const [endTime, setendTime] = useState(initDate2)
  const [startTimeText, setstartTimeText] = useState(moment(initDate).format("hh:mm a"))
  const [endTimeText, setendTimeText] = useState(moment(initDate2).format("hh:mm a"))
  const [isPrivate, setPrivate] = useState(false)

  const locationInput = useInput("")
  const titleInput = useInput("")

  const [saveSubjectMutation] = useMutation(SAVE_SCHEDULE)

  const allClear = () => {
    setSubjectId("")
    titleInput.setValue("")
    locationInput.setValue("")
    setsubstate(`${myState[0]}`)
    setstartTime(initDate)
    setendTime(initDate2)
    setstartTimeText(moment(initDate).format("hh:mm a"))
    setendTimeText(moment(initDate2).format("hh:mm a"))
    setPrivate(false)
  }

  const startPicker = (event, selectedDate) => {
    const currentTime = new Date(selectedDate)
    setstartTime(currentTime)
    setstartTimeText(moment(currentTime).format("hh:mm a"))
  }
  const endPicker = (event, selectedendTime) => {
    const currentTime = new Date(selectedendTime)
    setendTime(currentTime)
    setendTimeText(moment(currentTime).format("hh:mm a"))
  }
  //시간touch
  const showMode = () => {
    setModalVisible(!modalVisible)
  }
  const showModeEnd = () => {
    setModalVisibleEnd(!modalVisibleEnd)
  }
  //ios선택
  const offMode = (event, selectedDate) => {
    const currentTime = new Date(selectedDate)
    setstartTime(selectedDate)
    var timestartText = moment(startTime).format("hh:mm a")
    setstartTimeText(timestartText)
    // setModalVisible(!modalVisible)
    // var timeEndText = moment(endTime).format("hh:mm a")
    // setendTimeText(timeEndText)
    // console.log(selectedDate)
  }
  const offModeEnd = (event, selectedendTime) => {
    const currentTime = new Date(selectedendTime)
    setendTime(selectedendTime)
    var timeEndText = moment(endTime).format("hh:mm a")
    // setModalVisibleEnd(!modalVisibleEnd)
    // var timestartText = moment(startTime).format("hh:mm a")
    // setstartTimeText(timestartText)
    setendTimeText(timeEndText)
    // console.log(selectedendTime)
  }

  const androidstartPicker = (event, selectedDate) => {
    setModalVisible(!modalVisible)
    const currentTime = new Date(selectedDate)
    if (currentTime.getMinutes() % 5 !== 0) {
      Alert.alert("시간 범위를 5분 단위로 설정해주세요.\n(예: 5분, 10분, 15분, ...)")
    } else {
      setstartTime(currentTime)
      setstartTimeText(moment(currentTime).format("hh:mm a"))
    }
  }
  const androidendPicker = (event, selectedendTime) => {
    setModalVisibleEnd(!modalVisibleEnd)
    const currentTime = new Date(selectedendTime)
    if (currentTime.getMinutes() % 5 !== 0) {
      Alert.alert("시간 범위를 5분 단위로 설정해주세요.\n(예: 5분, 10분, 15분, ...)")
    } else {
      setendTime(currentTime)
      setendTimeText(moment(currentTime).format("hh:mm a"))
    }
  }

  const finSchedule = async () => {
    if (subjectId === "") {
      Alert.alert("과목을 선택하세요.")
      return
    } else if (titleInput.value === "") {
      Alert.alert("제목을 입력하세요.")
      return
    } else if (startTime >= endTime) {
      Alert.alert("시작 시간이 끝나는 시간보다 늦거나 같을 수 없습니다.")
      return
    }
    for (i = 0; i < 7; i++) {
      if (dayLists[i] == true) {
        let overlap = false

        // 끝나는 시간이 0시 0분이면 1초 빼주기
        const endTime_tmp = new Date(endTime)
        if (endTime_tmp.getMinutes() === 0 && endTime_tmp.getHours() === 0) {
          endTime_tmp.setTime(endTime.getTime() - 1000)
        }
        const generateId =
          Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        var momentObstart = moment(thisWeek[i] + moment(startTime).format("LT"), "YYYY-MM-DDLT")
        var momentObEnd = moment(thisWeek[i] + moment(endTime_tmp).format("LT"), "YYYY-MM-DDLT")
        var dateTimeStart = momentObstart.format("YYYY-MM-DDTHH:mm:ss.sssZ")
        var dateTimeEnd = momentObEnd.format("YYYY-MM-DDTHH:mm:ss.sssZ")

        var Start = momentObstart.format("HH")
        var End = momentObEnd.format("HH")
        var StartMin = momentObstart.format("mm")
        var EndMin = momentObEnd.format("mm")
        // events_data.map((sch) => {
        //   if (new Date(sch.endDate) > dateTimeStart && new Date(sch.startDate) < dateTimeEnd) {
        //     overlap = true
        //   }
        // })
        // if (overlap) {
        //   Alert.alert("스케줄 시간은 중복될 수 없습니다.")
        //   return
        // }
        const schedules = {
          id: generateId,
          isAllDay: false,
          isPrivate,
          title: titleInput.value,
          location: locationInput.value,
          state: substate,
          start: dateTimeStart,
          end: dateTimeEnd,
          // start: startTime,
          // end: endTime_tmp,
          // totalTime: (dateTimeEnd.getTime() - dateTimeStart.getTime()) / 1000,
          totalTime: (End - Start) * 3600 + (EndMin - StartMin) * 60,

          calendarId: subjectId,

          option: "create",
        }
        newScheduleArray.push(schedules)
      }
    }
    try {
      if (!day7 && !day1 && !day2 && !day3 && !day4 && !day5 && !day6) {
        Alert.alert("요일을 선택하세요")
        return
      }
      setModifyLoading(true)
      const {
        data: { saveSchedule_my },
      } = await saveSubjectMutation({
        variables: {
          scheduleArray: newScheduleArray,
        },
        refetchQueries: () => [{ query: SCHEDULE_USER }],
      })
      if (!saveSchedule_my) {
        Alert.alert("스케줄을 만들 수 없습니다.")
      } else {
        allClear()
        goback()
      }
    } catch (e) {
      console.log(e)
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
    } finally {
      setModifyLoading(false)
    }
  }
  useEffect(() => {
    allClear()
    newScheduleArray = []
  }, [])
  const [CalmodalVisible, setCalModalVisible] = useState(false)

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <TotalView style={{ minHeight: Math.round(Dimensions.get("window").height) }}>
        <ModalCalView>
          <TouchableOpacity onPress={() => setCalModalVisible(!CalmodalVisible)}>
            <Text>
              {/* {month}월 {weekOfMonth(nowDate)}주차 */}
              {thisy[0]}.{thism[0]}.{thisd[0]}~{thisy[6]}.{thism[6]}.{thisd[6]}
            </Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            isVisible={CalmodalVisible}
            onBackdropPress={() => setCalModalVisible(false)}
            backdropColor={"black"}
          >
            <Calendar
              current={selectDay}
              minDate={"2012-05-10"}
              maxDate={"2030-05-30"}
              onDayPress={(day) => {
                setselectDay(day.timestamp)
                setCalModalVisible(!CalmodalVisible)
              }}
              monthFormat={"yyyy MM"}
              onPressArrowLeft={(subtractMonth) => subtractMonth()}
              onPressArrowRight={(addMonth) => addMonth()}
            />
          </Modal>
        </ModalCalView>
        <ModalView>
          <WeekView>
            <Button
              style={{
                alignSelf: "center",
                marginLeft: 5,
                backgroundColor: day7 ? "#7BA9EA" : "#E9EDF4",
              }}
              onPress={() => {
                setday7(!day7)
              }}
            >
              <Text style={{ color: "black" }}>일</Text>
            </Button>
            <Button
              style={{
                alignSelf: "center",
                marginLeft: 5,
                backgroundColor: day1 ? "#7BA9EA" : "#E9EDF4",
              }}
              onPress={() => {
                setday1(!day1)
              }}
            >
              <Text style={{ color: "black" }}>월 </Text>
            </Button>
            <Button
              style={{
                alignSelf: "center",
                marginLeft: 5,
                backgroundColor: day2 ? "#7BA9EA" : "#E9EDF4",
              }}
              onPress={() => {
                setday2(!day2)
              }}
            >
              <Text style={{ color: "black" }}>화</Text>
            </Button>

            <Button
              style={{
                alignSelf: "center",
                marginLeft: 5,
                backgroundColor: day3 ? "#7BA9EA" : "#E9EDF4",
              }}
              onPress={() => {
                setday3(!day3)
              }}
            >
              <Text style={{ color: "black" }}>수</Text>
            </Button>

            <Button
              style={{
                alignSelf: "center",
                marginLeft: 5,
                backgroundColor: day4 ? "#7BA9EA" : "#E9EDF4",
              }}
              onPress={() => {
                setday4(!day4)
              }}
            >
              <Text style={{ color: "black" }}>목</Text>
            </Button>

            <Button
              style={{
                alignSelf: "center",
                marginLeft: 5,
                backgroundColor: day5 ? "#7BA9EA" : "#E9EDF4",
              }}
              onPress={() => {
                setday5(!day5)
              }}
            >
              <Text style={{ color: "black" }}>금</Text>
            </Button>

            <Button
              style={{
                alignSelf: "center",
                marginLeft: 5,
                backgroundColor: day6 ? "#7BA9EA" : "#E9EDF4",
              }}
              onPress={() => {
                setday6(!day6)
              }}
            >
              <Text style={{ color: "black" }}>토</Text>
            </Button>
          </WeekView>
          <ModalView style={{ width: constants.width / 1.7 }}>
            <RNPickerSelect
              onValueChange={(value) => {
                if (value !== null) {
                  setSubjectId(value)
                }
              }}
              items={SubjectList}
              placeholder={{
                label: "과목 선택...",
                value: null,
                color: "red",
              }}
              value={subjectId}
              style={{
                ...pickerSelectStyles,
                iconContainer: {
                  top: 9,
                  right: 10,
                },
                placeholder: {
                  color: "black",
                  fontSize: 15,
                  fontWeight: "bold",
                },
              }}
              Icon={() => {
                return (
                  <Ionicons
                    name={Platform.OS === "ios" ? "ios-arrow-down" : "md-arrow-down"}
                    size={24}
                    color="gray"
                  />
                )
              }}
            />
          </ModalView>
        </ModalView>
        <ModalView>
          <AuthInput
            {...titleInput}
            // value={name}
            placeholder={"(필수) 제목"}
            keyboardType="default"
            returnKeyType="done"
            // onSubmitEditing={handleLogin}
            autoCorrect={false}
          />
          <MarginR style={{ height: constants.height / 50 }} />
          <AuthInput
            {...locationInput}
            // value={name}
            placeholder={"(선택) 위치"}
            keyboardType="default"
            returnKeyType="done"
            // onSubmitEditing={handleLogin}
            autoCorrect={false}
          />
        </ModalView>

        {/* <View1> */}
        {/* <MarginView /> */}

        {Platform.OS === "ios" ? (
          <>
            <RowView>
              <View121>
                <Text
                  style={{
                    fontSize: 20,
                    color: startTime >= endTime ? "red" : "black",
                  }}
                >
                  시작 :{" "}
                </Text>
              </View121>
              <View12>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={startTime}
                  mode={"time"}
                  is24Hour={true}
                  display="clock"
                  onChange={offMode}
                  minuteInterval={5}
                  style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                />
              </View12>
              <View121>
                <Text
                  style={{
                    fontSize: 20,
                    color: startTime >= endTime ? "red" : "black",
                  }}
                >
                  끝 :{" "}
                </Text>
              </View121>
              <View12>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={endTime}
                  mode={"time"}
                  is24Hour={true}
                  display="clock"
                  onChange={offModeEnd}
                  minuteInterval={5}
                  style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                />
              </View12>
              <View13 />
            </RowView>
            {/* <View2>
                <TouchableOpacity onPress={() => setCalVisibleStart(!calVisibleStart)}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: startTime >= endTime ? "red" : "black",
                    }}
                  >
                    {moment(startTime).format("YYYY-MM-DD")}({dayList[startTime.getDay()]}
                    )&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Text>
                </TouchableOpacity>
                <Modal
                  animationType="slide"
                  transparent={true}
                  isVisible={calVisibleStart}
                  backdropColor={"black"}
                  onBackdropPress={() => setCalVisibleStart(!calVisibleStart)}
                >
                  <Calendar
                    current={startTime}
                    onDayPress={(day) => {
                      const date_tmp = new Date(day.timestamp)
                      date_tmp.setHours(startTime.getHours())
                      date_tmp.setMinutes(startTime.getMinutes())
                      startTime.setTime(date_tmp.getTime())
                      setCalVisibleStart(!calVisibleStart)
                    }}
                    monthFormat={"yyyy MM"}
                    onPressArrowLeft={(subtractMonth) => subtractMonth()}
                    onPressArrowRight={(addMonth) => addMonth()}
                  />
                </Modal>
                <TouchableOpacity onPress={showMode}>
                  <View2>
                    <Text
                      style={{
                        fontSize: 20,
                        color: startTime >= endTime ? "red" : "black",
                      }}
                    >
                      {startTimeText}
                    </Text>
                  </View2>
                </TouchableOpacity>
              </View2>
              <MarginView />
              <View2>
                <TouchableOpacity onPress={() => setCalVisibleEnd(!calVisibleEnd)}>
                  <Text style={{ fontSize: 20 }}>
                    {moment(endTime).format("YYYY-MM-DD")}({dayList[endTime.getDay()]}
                    )&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Text>
                </TouchableOpacity>
                <Modal
                  animationType="slide"
                  transparent={true}
                  isVisible={calVisibleEnd}
                  backdropColor={"black"}
                  onBackdropPress={() => setCalVisibleEnd(!calVisibleEnd)}
                >
                  <Calendar
                    current={endTime}
                    onDayPress={(day) => {
                      const date_tmp = new Date(day.timestamp)
                      date_tmp.setHours(endTime.getHours())
                      date_tmp.setMinutes(endTime.getMinutes())
                      endTime.setTime(date_tmp.getTime())
                      setCalVisibleEnd(!calVisibleEnd)
                    }}
                    monthFormat={"yyyy MM"}
                    onPressArrowLeft={(subtractMonth) => subtractMonth()}
                    onPressArrowRight={(addMonth) => addMonth()}
                  />
                </Modal>
                <TouchableOpacity onPress={showModeEnd}>
                  <View2>
                    <Text style={{ fontSize: 20 }}>{endTimeText}</Text>
                  </View2>
                </TouchableOpacity>
              </View2> */}
          </>
        ) : (
          <>
            <RowAndView>
              <View2>
                {/* <TouchableOpacity onPress={() => setCalVisibleStart(!calVisibleStart)}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: startTime >= endTime ? "red" : "black",
                    }}
                  >
                    {moment(startTime).format("YYYY-MM-DD")}({dayList[startTime.getDay()]}
                    )&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Text>
                </TouchableOpacity> */}
                {/* <Modal
                  animationType="slide"
                  transparent={true}
                  isVisible={calVisibleStart}
                  backdropColor={"black"}
                  onBackdropPress={() => setCalVisibleStart(!calVisibleStart)}
                >
                  <Calendar
                    current={startTime}
                    onDayPress={(day) => {
                      const date_tmp = new Date(day.timestamp)
                      date_tmp.setHours(startTime.getHours())
                      date_tmp.setMinutes(startTime.getMinutes())
                      startTime.setTime(date_tmp.getTime())
                      setCalVisibleStart(!calVisibleStart)
                    }}
                    monthFormat={"yyyy MM"}
                    onPressArrowLeft={(subtractMonth) => subtractMonth()}
                    onPressArrowRight={(addMonth) => addMonth()}
                  />
                </Modal> */}
                <View1>
                  <Text
                    style={{
                      fontSize: 20,
                      color: startTime >= endTime ? "red" : "black",
                    }}
                  >
                    시작
                  </Text>
                </View1>
                <Text
                  style={{
                    fontSize: 20,
                    color: startTime >= endTime ? "red" : "black",
                  }}
                >
                  {" "}
                  :{" "}
                </Text>
                <TouchableOpacity onPress={showMode}>
                  <View21>
                    <Text
                      style={{
                        fontSize: 20,
                        color: startTime >= endTime ? "red" : "black",
                      }}
                    >
                      {startTimeText}
                    </Text>
                  </View21>
                </TouchableOpacity>
              </View2>
              <View3></View3>
              {/* <MarginView /> */}
              <View2>
                {/* <TouchableOpacity onPress={() => setCalVisibleEnd(!calVisibleEnd)}>
                  <Text style={{ fontSize: 20 }}>
                    {moment(endTime).format("YYYY-MM-DD")}({dayList[endTime.getDay()]}
                    )&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Text>
                </TouchableOpacity> */}
                {/* <Modal
                animationType="slide"
                transparent={true}
                isVisible={calVisibleEnd}
                backdropColor={"black"}
                onBackdropPress={() => setCalVisibleEnd(!calVisibleEnd)}
              >
                <Calendar
                  current={endTime}
                  onDayPress={(day) => {
                    const date_tmp = new Date(day.timestamp)
                    date_tmp.setHours(endTime.getHours())
                    date_tmp.setMinutes(endTime.getMinutes())
                    endTime.setTime(date_tmp.getTime())
                    setCalVisibleEnd(!calVisibleEnd)
                  }}
                  monthFormat={"yyyy MM"}
                  onPressArrowLeft={(subtractMonth) => subtractMonth()}
                  onPressArrowRight={(addMonth) => addMonth()}
                />
              </Modal> */}
                <View1>
                  <Text
                    style={{
                      fontSize: 20,
                      color: startTime >= endTime ? "red" : "black",
                    }}
                  >
                    끝
                  </Text>
                </View1>
                <Text
                  style={{
                    fontSize: 20,
                    color: startTime >= endTime ? "red" : "black",
                  }}
                >
                  {" "}
                  :{" "}
                </Text>
                <TouchableOpacity onPress={showModeEnd}>
                  <View21>
                    <Text style={{ fontSize: 20 }}>{endTimeText}</Text>
                  </View21>
                </TouchableOpacity>
              </View2>
            </RowAndView>
          </>
        )}

        {Platform.OS === "ios" ? (
          // <EmptyView>
          //   <Modal
          //     animationType="slide"
          //     transparent={true}
          //     isVisible={modalVisible}
          //     backdropColor={"white"}
          //   >
          //     <EmptyView>
          //       <TouchableOpacity onPress={offMode}>
          //         <View style={{ alignItems: "flex-end" }}>
          //           <Text>선택</Text>
          //         </View>
          //       </TouchableOpacity>
          //       <View3>
          //         <View1>
          //           <DateTimePicker
          //             testID="dateTimePicker"
          //             value={startTime}
          //             mode={"time"}
          //             is24Hour={true}
          //             display="spinner"
          //             onChange={startPicker}
          //             minuteInterval={5}
          //           />
          //         </View1>
          //       </View3>
          //     </EmptyView>
          //   </Modal>
          //   <Modal
          //     animationType="slide"
          //     transparent={true}
          //     isVisible={modalVisibleEnd}
          //     backdropColor={"white"}
          //   >
          //     <EmptyView>
          //       <TouchableOpacity onPress={offModeEnd}>
          //         <View style={{ alignItems: "flex-end" }}>
          //           <Text>선택</Text>
          //         </View>
          //       </TouchableOpacity>
          //       <View3>
          //         <View1>
          //           <DateTimePicker
          //             testID="dateTimePicker"
          //             value={endTime}
          //             mode={"time"}
          //             is24Hour={true}
          //             display="spinner"
          //             onChange={endPicker}
          //             minuteInterval={5}
          //           />
          //         </View1>
          //       </View3>
          //     </EmptyView>
          //   </Modal>
          // </EmptyView>
          <></>
        ) : (
          <EmptyView>
            {modalVisible && (
              <DateTimePicker
                testID="dateTimePicker"
                value={startTime}
                mode={"time"}
                is24Hour={true}
                display="spinner"
                onChange={androidstartPicker}
                //   onClose={setModalVisible(false)}
                minuteInterval={5}
              />
            )}
            {modalVisibleEnd && (
              <DateTimePicker
                testID="dateTimePicker"
                value={endTime}
                mode={"time"}
                is24Hour={true}
                display="spinner"
                onChange={androidendPicker}
                minuteInterval={5}
              />
            )}
          </EmptyView>
        )}
        {/* </View1> */}

        <ModalView_State style={{ width: constants.width / 3.5 }}>
          <MarginView />
          <RNPickerSelect
            onValueChange={(value) => {
              if (value === null) {
                Alert.alert(`${myState[0]} 또는 ${myState[1]}를 선택하세요`)
              } else {
                setsubstate(value)
              }
            }}
            items={lists}
            placeholder={{
              label: `선택...`,
              value: null,
              color: "red",
            }}
            value={substate}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 9,
                right: 10,
              },
              placeholder: {
                color: "black",
                fontSize: 15,
                fontWeight: "bold",
              },
            }}
            Icon={() => {
              return (
                <Ionicons
                  name={Platform.OS === "ios" ? "ios-arrow-down" : "md-arrow-down"}
                  size={24}
                  color="gray"
                />
              )
            }}
          />
        </ModalView_State>
        <ModalView_Private>
          <CheckBox checked={!isPrivate} onPress={() => setPrivate(!isPrivate)} />
          {isPrivate ? (
            <Text style={styles.label}> 🔒(통계 미반영)</Text>
          ) : (
            <Text style={styles.label}> 🔓(통계 반영)</Text>
          )}
        </ModalView_Private>
        <ModalView>
          <AuthButton
            color="white"
            onPress={finSchedule}
            bgColor={"#0f4c82"}
            text="만들기"
            loading={modifyLoading}
          />
        </ModalView>
        <ModalView />
      </TotalView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  label: {
    margin: 8,
  },
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
  },
  inputAndroid: {
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
  },
})
