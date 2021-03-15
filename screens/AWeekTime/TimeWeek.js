import React, { useState } from "react"
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Alert,
  Platform,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native"
import Timetablecontrol from "../../components/Timetablecontrol"

import WeekView from "./react-native-week-view/src/WeekView/WeekView"
import Loader from "../../components/Loader"
import Icon from "../../components/Icon"
import styled from "styled-components"
import Modal from "react-native-modal"
import AuthInput from "../../components/AuthInput"
import useInput from "../../hooks/useInput"
import { gql } from "apollo-boost"
import { useMutation } from "@apollo/react-hooks"
import DateTimePicker from "@react-native-community/datetimepicker"
import moment from "moment"
import constants from "../../constants"
import RNPickerSelect from "react-native-picker-select"
import { Calendar } from "react-native-calendars"
import AuthButton from "../../components/AuthButton"
import { CheckBox } from "native-base"
import ObjectCopy from "../../components/ObjectCopy"
import { Ionicons } from "@expo/vector-icons"

const EmptyView = styled.View``
const EmptyView10 = styled.View`
  flex: 0.1;
  align-items: flex-start;
  justify-content: flex-start;
  width: ${constants.width / 1.4};
`
const EmptyView5 = styled.View`
  flex: 0.08;
  align-items: flex-end;
  justify-content: center;
  margin-left: 5;
  margin-top: 5;
  width: ${constants.width / 1.3};
`
const ModalView04 = styled.View`
  flex: 0.5;
  /* justify-content: center;
  align-items: center; */
  width: ${constants.width / 1.2};
`
const EmptyView1 = styled.View`
  flex: 1;
  align-items: flex-end;
  margin-right: 10;
  margin-top: 10;
`
const ModalView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const ModalView2 = styled.View`
  flex: 0.2;
  justify-content: center;
  align-items: center;
`
const ModalView_State = styled.View`
  flex: 0.7;
  justify-content: center;
  align-items: center;
`

const ModalView_Private = styled.View`
  flex: 0.7;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const ButtonModalView = styled.View`
  flex: 2;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const StyledModalContainer = styled.View`
  flex-direction: column;
  align-items: center;
  /* 모달창 크기 조절 */
  flex: 0.8;
  width: 300;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
`
const StyledModalSetContainer = styled.View`
  flex-direction: column;
  align-items: center;
  /* 모달창 크기 조절 */
  flex: 0.5;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
`
const View1 = styled.View`
  flex: 0.5;
  justify-content: center;
  align-items: center;
  margin-top: 5;
`
const SetdayTopView = styled.View`
  flex: 0.5;
  align-items: center;
  justify-content: center;
`

const View2 = styled.View`
  flex: 1;
  background-color: rgba(255, 255, 255, 1);
  flex-direction: row;
  justify-content: center;
`
const View21 = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const RowView = styled.View`
  /* background-color: rgba(89, 189, 232, 1); */
  flex-direction: row;
  width: ${constants.width / 1.3};
  justify-content: center;
  align-items: center;
  height: 5%;
  margin-left: ${constants.width / 10};
`
const RowMidView = styled.View`
  /* background-color: rgba(89, 189, 232, 1); */
  flex-direction: row;
  width: ${constants.width / 1.3};
  justify-content: center;
  align-items: center;
  height: 5%;
`
const View12 = styled.View`
  flex: 1;
  /* justify-content: center; */
  /* background-color: rgba(233, 237, 244, 1); */
`
const View3 = styled.View`
  flex: 0.005;
  justify-content: center;
`
const RowText = styled.Text`
  font-size: 15;
  font-family: "GmarketMedium";
`
const CopyText = styled.Text`
  font-size: 17;
  font-family: "GmarketBold";
`
const LineView = styled.View`
  height: 10;
`
const ScheduleText = styled.Text`
  font-size: 20;
  font-family: "GmarketBold";
`
const ModalRow = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export const SAVE_SCHEDULE = gql`
  mutation saveSchedule_my($scheduleArray: [ScheduleArray_my!]!) {
    saveSchedule_my(scheduleArray: $scheduleArray)
  }
`
export let events_data = []
let newScheduleArray = []
export let selectDate = [new Date()]

const TimeWeek = ({ SCHEDULE_USER, scheduledata, loading, onRefresh, targetToday }) => {
  const myState = scheduledata.me.studyPurpose === "학습" ? ["자습", "강의"] : ["업무", "개인"]

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
  const dayList = ["일", "월", "화", "수", "목", "금", "토"]
  const SubjectList_tmp = scheduledata.mySubject.map((file) => {
    if (file.bookMark) {
      return {
        label: file.name,
        value: file.id,
        bgColor: file.bgColor,
      }
    }
  })
  // SubjectList_tmp.push({ label: "과목 없음", value: "" })
  const SubjectList = SubjectList_tmp.filter(function (el) {
    return el != undefined
  })

  const [modalVisible, setModalVisible] = useState(false)
  const [modalCopyVisible, setModalCopyVisible] = useState(false)

  const [calVisibleStart, setCalVisibleStart] = useState(false)
  const [calVisibleEnd, setCalVisibleEnd] = useState(false)
  const [modalVisible2, setModalVisible2] = useState(false)
  const [scheduleId, setScheduleId] = useState("")
  const [substate, setsubstate] = useState(`${myState[0]}`)
  const [startTime, setstartTime] = useState(new Date())
  const [endTime, setendTime] = useState(new Date())
  const [startTimeText, setstartTimeText] = useState(moment(new Date()).format("hh:mm a"))
  const [endTimeText, setendTimeText] = useState(moment(new Date()).format("hh:mm a"))
  const [isModalVisible, issetModalVisible] = useState(false)
  const [subjectId, setSubjectId] = useState("")
  const [modalVisibleEnd, setModalVisibleEnd] = useState(false)
  const [isPrivate, setPrivate] = useState(false)
  const [isAllDay, setAllDay] = useState(false)
  const [selectIndex, setSelectIndex] = useState(0)
  const [modifyLoading, setModifyLoading] = useState(false)
  const [delLoading, setDelLoading] = useState(false)
  const [dateStr, setDateStr] = useState(moment(new Date()).format("YYYY-MM-DD"))
  //하루 스케줄
  const [copyDayModal, setCopyDayModal] = useState(false)
  const [copyStartDay, setCopyStartDay] = useState(new Date())
  const [copyDaySetMdal, setCopydaySetMdal] = useState(false)
  const [copySetDay, setCopySetDay] = useState(new Date())
  const [copyDayLoading, setcopyDayLoading] = useState(false)

  //주간 스케줄
  const [selectDay, setselectDay] = useState(targetToday)
  const [CalmodalVisible, setCalModalVisible] = useState(false)
  const [selectSetDay, setselectSetDay] = useState(targetToday)
  const [CalmodalWeekVisible, setCalModalWeekVisible] = useState(false)
  const [copyWeekLoading, setcopyWeekLoading] = useState(false)

  //
  const dateMark = new Object()
  dateMark[dateStr] = { selected: true }

  const locationInput = useInput("")
  const titleInput = useInput("")

  const [scheduleMutation] = useMutation(SAVE_SCHEDULE, {
    variables: {
      scheduleArray: newScheduleArray,
    },
    refetchQueries: () => [{ query: SCHEDULE_USER }],
  })

  //copy 모달
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
  var currentSetDay = new Date(selectSetDay)
  var theSetYear = currentSetDay.getFullYear()
  var theSetMonth = currentSetDay.getMonth()
  var theSetDate = currentSetDay.getDate()
  var theSetDayOfWeek = currentSetDay.getDay() //요일
  var thisSetWeek = []
  var thisSetm = []
  var thisSetd = []
  var thisSety = []
  for (var i = 0; i < 7; i++) {
    var resultDay = new Date(theSetYear, theSetMonth, theSetDate + (i - theSetDayOfWeek))
    var yyyy = resultDay.getFullYear()
    var mm = Number(resultDay.getMonth()) + 1
    var dd = resultDay.getDate()

    mm = String(mm).length === 1 ? "0" + mm : mm
    dd = String(dd).length === 1 ? "0" + dd : dd

    thisSetWeek[i] = yyyy + "-" + mm + "-" + dd
    thisSety[i] = yyyy
    thisSetm[i] = mm
    thisSetd[i] = dd
  }
  ///
  const settingData = async () => {
    try {
      events_data = scheduledata.me.schedules.map((List) => {
        const findSubject = (a) => a.value === List.subjectId
        const subjectIndex = SubjectList.findIndex(findSubject)
        const startDate = new Date(List.start)
        const endDate = new Date(List.end)
        endDate.setTime(endDate.getTime() - 1000)
        return {
          id: List.id,
          description: `[${List.subjectName}]\n${List.isPrivate ? "🔒\n" : ""}${List.title}`,
          subjectName: `${List.title}`,
          location: List.location,
          startDate,
          endDate,
          color: subjectIndex === -1 ? "#A1B56C" : SubjectList[subjectIndex].bgColor,
          totalTime: List.totalTime,
          subjectId: List.subjectId,
          state: List.state,
          isPrivate: List.isPrivate,
          isAllDay: List.isAllDay,
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  const deleteSchedule = async () => {
    var deleteSchedules = {
      id: scheduleId,
      isAllDay,
      isPrivate,
      title: "",
      location: "",
      state: `${myState[0]}`,
      start: startTime,
      end: endTime,
      totalTime: 10,
      calendarId: subjectId,
      option: "delete",
    }
    newScheduleArray.push(deleteSchedules)

    try {
      setDelLoading(true)
      const {
        data: { saveSchedule_my },
      } = await scheduleMutation()
      if (!saveSchedule_my) {
        Alert.alert("스케줄을 제거할 수 없습니다.")
      } else {
        issetModalVisible(!isModalVisible)
      }
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
    } finally {
      newScheduleArray = []
      setDelLoading(false)
    }
  }

  const updateSchedule = async () => {
    if (titleInput.value === "") {
      Alert.alert("제목을 입력하세요.")
      return
    }
    let overlap = false
    const schedules_test = ObjectCopy(events_data)
    const checkExist = (a) => a.id === scheduleId
    const checkIndex = events_data.findIndex(checkExist)
    schedules_test.splice(checkIndex, 1)
    schedules_test.map((sch) => {
      if (new Date(sch.endDate) > startTime && new Date(sch.startDate) < endTime) {
        overlap = true
      }
    })
    if (overlap) {
      Alert.alert("스케줄 시간은 중복될 수 없습니다.")
      return
    }

    const updateSchedules = {
      id: scheduleId,
      isAllDay,
      isPrivate,
      title: titleInput.value,
      location: locationInput.value,
      state: substate,
      start: startTime,
      end: endTime,
      totalTime: (endTime.getTime() - startTime.getTime()) / 1000,
      calendarId: subjectId,
      option: "update",
    }
    newScheduleArray.push(updateSchedules)

    try {
      setModifyLoading(true)
      const {
        data: { saveSchedule_my },
      } = await scheduleMutation()
      if (!saveSchedule_my) {
        Alert.alert("스케줄을 수정할 수 없습니다.")
      } else {
        issetModalVisible(!isModalVisible)
      }
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
    } finally {
      setModifyLoading(false)
      newScheduleArray = []
    }
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
  const onEventPress = (evt) => {
    issetModalVisible(true)
    evt.endDate.setTime(evt.endDate.getTime() + 1000)
    // title에 좌물쇠 빼주기
    if (evt.description.includes("🔒")) {
      const tmpString = evt.description.split("🔒\n")
      evt.description = tmpString[1]
    }
    setSubjectId(evt.subjectId)
    setScheduleId(evt.id)
    setsubstate(evt.state)
    setPrivate(evt.isPrivate)
    setAllDay(evt.isAllDay)
    titleInput.setValue(evt.subjectName)
    locationInput.setValue(evt.location)
    setstartTime(evt.startDate)
    setendTime(evt.endDate)
    setstartTimeText(moment(evt.startDate).format("hh:mm a"))
    setendTimeText(moment(evt.endDate).format("hh:mm a"))
    // 선택한 TASK 인덱스 찾기
    const findSubject = (a) => a.id === evt.subjectId
    const tmpIndex = scheduledata.mySubject.findIndex(findSubject)
    setSelectIndex(tmpIndex)
  }

  const showMode = () => {
    setModalVisible(!modalVisible)
  }
  const showModeEnd = () => {
    setModalVisibleEnd(!modalVisibleEnd)
  }
  const offMode = () => {
    setModalVisible(!modalVisible)
    var timestartText = moment(startTime).format("hh:mm a")
    // var timeEndText = moment(endTime).format("hh:mm a")
    setstartTimeText(timestartText)
    // setendTimeText(timeEndText)
  }
  const offModeEnd = () => {
    setModalVisibleEnd(!modalVisibleEnd)
    // var timestartText = moment(startTime).format("hh:mm a")
    var timeEndText = moment(endTime).format("hh:mm a")
    // setstartTimeText(timestartText)
    setendTimeText(timeEndText)
  }
  const androidstartPicker = (event, selectedDate) => {
    setModalVisible(!modalVisible)
    const currentTime = new Date(selectedDate)
    if (currentTime.getMinutes() % 5 !== 0) {
      Alert.alert("시간 범위를 5분 단위로 설정해주세요.\n(예: 5분, 10분, 15분, ...)")
    } else if (currentTime > endTime) {
      Alert.alert("시작 시간이 끝나는 시간보다 늦을 수 없습니다.")
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
    } else if (currentTime < startTime) {
      Alert.alert("끝나는 시간이 시작 시간보다 빠를 수 없습니다.")
    } else {
      setendTime(currentTime)
      setendTimeText(moment(currentTime).format("hh:mm a"))
    }
  }

  //copyStartDay
  const copyDaySchedule = async () => {
    var coptSetDay = new Date(copySetDay)
    var theSetYear = coptSetDay.getFullYear()
    var theSetMonth = coptSetDay.getMonth() + 1
    var theSetDate = coptSetDay.getDate()
    var mm = String(theSetMonth).length === 1 ? "0" + theSetMonth : theSetMonth
    var dd = String(theSetDate).length === 1 ? "0" + theSetDate : theSetDate
    var thisCopy = theSetYear + "-" + mm + "-" + dd

    const onday = scheduledata.me.schedules.filter(
      (i) => moment(i.start).format("YYYY-MM-DD") == moment(copyStartDay).format("YYYY-MM-DD")
    )
    // console.log(onday, "onday")
    for (var i = 0; i < onday.length; i++) {
      const generateId =
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

      const copyDayschedules = {
        id: generateId,
        isAllDay: false,
        isPrivate,
        title: onday[i].title,
        location: onday[i].location,
        state: onday[i].state,
        start: moment(thisCopy + moment(onday[i].start).format("LT"), "YYYY-MM-DDLT"),
        end: moment(thisCopy + moment(onday[i].end).format("LT"), "YYYY-MM-DDLT"),
        totalTime: onday[i].totalTime,
        calendarId: onday[i].subjectId,
        option: "create",
      }
      newScheduleArray.push(copyDayschedules)
    }
    try {
      setcopyDayLoading(true)
      const {
        data: { saveSchedule_my },
      } = await scheduleMutation()
      if (!saveSchedule_my) {
        Alert.alert("스케줄을 수정할 수 없습니다.")
      } else {
        setModalCopyVisible(!modalCopyVisible)
      }
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
    } finally {
      setcopyDayLoading(false)
      newScheduleArray = []
    }
  }
  //copyStartWeek
  const copyWeekSchedule = async () => {
    for (var i = 0; i < 7; i++) {
      const onweekDay = scheduledata.me.schedules.filter(
        (k) => moment(k.start).format("YYYY-MM-DD") == thisWeek[i]
      )
      for (var j = 0; j < onweekDay.length; j++) {
        const generateId =
          Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        const copyWeekSchedules = {
          id: generateId,
          isAllDay: false,
          isPrivate,
          title: onweekDay[j].title,
          location: onweekDay[j].location,
          state: onweekDay[j].state,
          start: moment(thisSetWeek[i] + moment(onweekDay[j].start).format("LT"), "YYYY-MM-DDLT"),
          end: moment(thisSetWeek[i] + moment(onweekDay[j].end).format("LT"), "YYYY-MM-DDLT"),
          totalTime: onweekDay[j].totalTime,
          calendarId: onweekDay[j].subjectId,
          option: "create",
        }
        newScheduleArray.push(copyWeekSchedules)
      }
    }
    try {
      setcopyWeekLoading(true)
      const {
        data: { saveSchedule_my },
      } = await scheduleMutation()
      if (!saveSchedule_my) {
        Alert.alert("스케줄을 수정할 수 없습니다.")
        newScheduleArray = []
      } else {
        setModalCopyVisible(!modalCopyVisible)
      }
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
    } finally {
      setcopyWeekLoading(false)
      newScheduleArray = []
    }
  }
  if (!loading) {
    settingData()
  }

  return (
    <>
      {Platform.OS == "ios" ? (
        <StatusBar barStyle="dark-content" />
      ) : (
        <StatusBar barStyle="light-content" />
      )}
      {loading ? (
        <Loader />
      ) : (
        <SafeAreaView style={styles.container}>
          <View
            style={{
              flex: 0.08,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              // position: "relative",
            }}
          >
            <View
              style={{
                // position: "absolute",
                width: "15%",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  onRefresh()
                }}
              >
                <Icon name={Platform.OS === "ios" ? "ios-refresh" : "md-refresh"} size={25} />
              </TouchableOpacity>
            </View>
            <View style={{ width: "55%", alignItems: "center" }}>
              <TouchableOpacity onPress={() => setModalVisible2(!modalVisible2)}>
                <Text style={{ fontSize: 17, fontWeight: "bold" }}>스케줄 ({dateStr})</Text>
              </TouchableOpacity>
              <Modal
                animationType="slide"
                transparent={true}
                isVisible={modalVisible2}
                backdropColor={"black"}
                onBackdropPress={() => setModalVisible2(false)}
              >
                <Calendar
                  current={selectDate[0]}
                  minDate={"2012-05-10"}
                  maxDate={"2050-05-30"}
                  onDayPress={(day) => {
                    const tmpDate = new Date(day.timestamp)
                    tmpDate.setHours(selectDate[0].getHours())
                    tmpDate.setMinutes(selectDate[0].getMinutes())
                    tmpDate.setSeconds(selectDate[0].getSeconds())
                    selectDate[0] = tmpDate
                    setDateStr(day.dateString)
                    setModalVisible2(!modalVisible2)
                  }}
                  monthFormat={"yyyy MM"}
                  onPressArrowLeft={(subtractMonth) => subtractMonth()}
                  onPressArrowRight={(addMonth) => addMonth()}
                  markedDates={dateMark}
                />
              </Modal>
            </View>

            <View
              style={{
                width: "15%",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setModalCopyVisible(!modalCopyVisible)
                }}
              >
                <Icon name={Platform.OS === "ios" ? "ios-copy" : "md-copy"} size={25} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: "10%",
                alignItems: "center",
              }}
            >
              <Timetablecontrol />
            </View>
          </View>

          <WeekView
            events={events_data}
            selectedDate={selectDate[0]}
            numberOfDays={7}
            onEventPress={onEventPress}
            headerStyle={styles.headerStyle}
            formatDateHeader="D(dd)"
            hoursInDisplay={12}
            startHour={new Date().getHours()}
            onSwipeNext={(date) => {
              selectDate[0].setTime(date.getTime())
              setDateStr(moment(new Date(date)).format("YYYY-MM-DD"))
            }}
            onSwipePrev={(date) => {
              selectDate[0].setTime(date.getTime())
              setDateStr(moment(new Date(date)).format("YYYY-MM-DD"))
            }}
          />

          <Modal
            isVisible={modalCopyVisible}
            onBackdropPress={() => setModalCopyVisible(false)}
            style={{
              justifyContent: "center",
              alignItems: "center",
              minHeight: Math.round(Dimensions.get("window").height),
            }}
          >
            <StyledModalSetContainer style={{ width: constants.width / 1.2 }}>
              <EmptyView5>
                <TouchableOpacity
                  onPress={() => {
                    setModalCopyVisible(!modalCopyVisible)
                  }}
                >
                  <Icon
                    name={
                      Platform.OS === "ios" ? "ios-close-circle-outline" : "md-close-circle-outline"
                    }
                    size={23}
                  />
                </TouchableOpacity>
              </EmptyView5>
              <ModalView04>
                <SetdayTopView>
                  <CopyText>하루 스케줄 복사</CopyText>
                </SetdayTopView>
                <View21>
                  <ModalView>
                    <TouchableOpacity onPress={() => setCopyDayModal(!copyDayModal)}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: "GmarketMedium",
                        }}
                      >
                        {moment(copyStartDay).format("YYYY-MM-DD")}(
                        {dayList[moment(copyStartDay).weekday()]})
                      </Text>
                    </TouchableOpacity>
                  </ModalView>
                  <ModalView2>
                    <Icon
                      name={Platform.OS === "ios" ? "ios-arrow-forward" : "md-arrow-forward"}
                      size={30}
                    />
                  </ModalView2>
                  <ModalView>
                    <TouchableOpacity onPress={() => setCopydaySetMdal(!copyDaySetMdal)}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: "GmarketMedium",
                        }}
                      >
                        {moment(copySetDay).format("YYYY-MM-DD")}(
                        {dayList[moment(copySetDay).weekday()]})
                      </Text>
                    </TouchableOpacity>
                  </ModalView>
                </View21>
                <View21>
                  <AuthButton
                    text={"복사"}
                    color="white"
                    bgColor={"#0f4c82"}
                    onPress={() => {
                      copyDaySchedule()
                    }}
                    widthRatio={5}
                    marginArray={[0, 0, 0, 0]}
                    loading={copyDayLoading}
                  />
                </View21>
                <Modal
                  animationType="slide"
                  transparent={true}
                  isVisible={copyDayModal}
                  backdropColor={"black"}
                  onBackdropPress={() => setCopyDayModal(!copyDayModal)}
                >
                  <Calendar
                    current={copyStartDay}
                    onDayPress={(day) => {
                      const date_tmp = new Date(day.timestamp)
                      date_tmp.setHours(copyStartDay.getHours())
                      date_tmp.setMinutes(copyStartDay.getMinutes())
                      copyStartDay.setTime(date_tmp.getTime())
                      setCopyDayModal(!copyDayModal)
                    }}
                    monthFormat={"yyyy MM"}
                    onPressArrowLeft={(subtractMonth) => subtractMonth()}
                    onPressArrowRight={(addMonth) => addMonth()}
                  />
                </Modal>
                <Modal
                  animationType="slide"
                  transparent={true}
                  isVisible={copyDaySetMdal}
                  backdropColor={"black"}
                  onBackdropPress={() => setCopydaySetMdal(!copyDaySetMdal)}
                >
                  <Calendar
                    current={copySetDay}
                    onDayPress={(day) => {
                      // const date_tmp = new Date(day.timestamp)
                      // date_tmp.setHours(copySetDay.getHours())
                      // date_tmp.setMinutes(copySetDay.getMinutes())
                      // copySetDay.setTime(date_tmp.getTime())
                      setCopySetDay(day.timestamp)
                      setCopydaySetMdal(!copyDaySetMdal)
                    }}
                    monthFormat={"yyyy MM"}
                    onPressArrowLeft={(subtractMonth) => subtractMonth()}
                    onPressArrowRight={(addMonth) => addMonth()}
                  />
                </Modal>
              </ModalView04>
              <EmptyView5 />
              <ModalView04>
                <SetdayTopView>
                  <CopyText>주간 스케줄 복사</CopyText>
                </SetdayTopView>
                <View21>
                  <ModalView>
                    <TouchableOpacity
                      onPress={() => {
                        setCalModalVisible(!CalmodalVisible)
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "GmarketMedium",
                        }}
                      >
                        {thism[0]}.{thisd[0]}(일)~{thism[6]}.{thisd[6]}(토)
                      </Text>
                    </TouchableOpacity>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      isVisible={CalmodalVisible}
                      onBackdropPress={() => {
                        setCalModalVisible(!CalmodalVisible)
                      }}
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
                  </ModalView>
                  <ModalView2>
                    <Icon
                      name={Platform.OS === "ios" ? "ios-arrow-forward" : "md-arrow-forward"}
                      size={30}
                    />
                  </ModalView2>
                  <ModalView>
                    <TouchableOpacity
                      onPress={() => {
                        setCalModalWeekVisible(!CalmodalWeekVisible)
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "GmarketMedium",
                        }}
                      >
                        {thisSetm[0]}.{thisSetd[0]}(일)~
                        {thisSetm[6]}.{thisSetd[6]}(토)
                      </Text>
                    </TouchableOpacity>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      isVisible={CalmodalWeekVisible}
                      onBackdropPress={() => {
                        setCalModalWeekVisible(!CalmodalWeekVisible)
                      }}
                      backdropColor={"black"}
                    >
                      <Calendar
                        current={selectSetDay}
                        minDate={"2012-05-10"}
                        maxDate={"2030-05-30"}
                        onDayPress={(day) => {
                          setselectSetDay(day.timestamp)
                          setCalModalWeekVisible(!CalmodalWeekVisible)
                        }}
                        monthFormat={"yyyy MM"}
                        onPressArrowLeft={(subtractMonth) => subtractMonth()}
                        onPressArrowRight={(addMonth) => addMonth()}
                      />
                    </Modal>
                  </ModalView>
                </View21>
                <View21>
                  <AuthButton
                    text={"복사"}
                    color="white"
                    bgColor={"#0f4c82"}
                    onPress={() => {
                      copyWeekSchedule()
                    }}
                    widthRatio={5}
                    marginArray={[0, 0, 0, 0]}
                    loading={copyWeekLoading}
                  />
                </View21>
              </ModalView04>
            </StyledModalSetContainer>
          </Modal>
          {/* ///////////////////////////////////////////////////////////// */}
          <Modal
            isVisible={isModalVisible}
            onBackdropPress={() => issetModalVisible(false)}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              minHeight: Math.round(Dimensions.get("window").height),
            }}
          >
            <StyledModalContainer style={{ width: constants.width / 1.1 }}>
              <ModalRow>
                <EmptyView1>
                  <TouchableOpacity
                    onPress={() => {
                      issetModalVisible(false)
                    }}
                  >
                    <Icon
                      name={
                        Platform.OS === "ios"
                          ? "ios-close-circle-outline"
                          : "md-close-circle-outline"
                      }
                      size={23}
                    />
                  </TouchableOpacity>
                </EmptyView1>
              </ModalRow>
              <SetdayTopView>
                <ScheduleText>스케줄 수정</ScheduleText>
              </SetdayTopView>
              <ModalView style={{ width: constants.width / 1.7 }}>
                <RNPickerSelect
                  onValueChange={(value) => {
                    if (value === null) {
                      Alert.alert("과목을 선택하세요.")
                    } else {
                      const findSubject = (a) => a.id === value
                      const tmpIndex = scheduledata.mySubject.findIndex(findSubject)
                      setSelectIndex(tmpIndex)
                      setSubjectId(value)
                    }
                  }}
                  items={SubjectList}
                  placeholder={{
                    label: "과목 선택...",
                    value: null,
                  }}
                  value={scheduledata.mySubject[selectIndex].id}
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
              <AuthInput
                {...titleInput}
                placeholder={"(필수) 제목"}
                keyboardType="default"
                returnKeyType="done"
                // onSubmitEditing={handleLogin}
                autoCorrect={false}
              />
              <LineView />
              <AuthInput
                {...locationInput}
                placeholder={"(선택) 위치"}
                keyboardType="default"
                returnKeyType="done"
                // onSubmitEditing={}
                autoCorrect={false}
              />
              <View1 />
              {Platform.OS === "ios" ? (
                <>
                  <RowView>
                    <View3 />
                    <View12>
                      <TouchableOpacity onPress={() => setCalVisibleStart(!calVisibleStart)}>
                        <Text
                          style={{
                            fontSize: 15,
                            color: startTime >= endTime ? "red" : "black",
                            fontFamily: "GmarketMedium",
                          }}
                        >
                          {moment(startTime).format("YYYY-MM-DD")}({dayList[startTime.getDay()]}
                          )&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Text>
                      </TouchableOpacity>
                    </View12>
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
                    <View3 />

                    <View12>
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={startTime}
                        mode={"time"}
                        is24Hour={true}
                        display="spinner"
                        onChange={startPicker}
                        minuteInterval={5}
                        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                      />
                    </View12>
                  </RowView>
                  <RowMidView>
                    <RowText>|</RowText>
                  </RowMidView>
                  <RowView>
                    <View3 />
                    <View12>
                      <TouchableOpacity onPress={() => setCalVisibleEnd(!calVisibleEnd)}>
                        <Text style={{ fontSize: 15, fontFamily: "GmarketMedium" }}>
                          {moment(endTime).format("YYYY-MM-DD")}({dayList[endTime.getDay()]}
                          )&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Text>
                      </TouchableOpacity>
                    </View12>
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
                    <View3 />
                    <View12>
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={endTime}
                        mode={"time"}
                        is24Hour={true}
                        display="spinner"
                        onChange={endPicker}
                        minuteInterval={5}
                        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                      />
                    </View12>
                  </RowView>
                </>
              ) : (
                <>
                  <View21>
                    <TouchableOpacity onPress={() => setCalVisibleStart(!calVisibleStart)}>
                      <View2>
                        <Text
                          style={{
                            fontSize: 18,
                            color: startTime >= endTime ? "red" : "black",
                            fontFamily: "GmarketMedium",
                          }}
                        >
                          {moment(startTime).format("YYYY-MM-DD")}({dayList[startTime.getDay()]}
                          )&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Text>
                      </View2>
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
                            fontSize: 18,
                            color: startTime >= endTime ? "red" : "black",
                            fontFamily: "GmarketMedium",
                          }}
                        >
                          {startTimeText}
                        </Text>
                      </View2>
                    </TouchableOpacity>
                  </View21>
                  <View21>
                    <TouchableOpacity onPress={() => setCalVisibleEnd(!calVisibleEnd)}>
                      <View2>
                        <Text style={{ fontSize: 18, fontFamily: "GmarketMedium" }}>
                          {moment(endTime).format("YYYY-MM-DD")}({dayList[endTime.getDay()]}
                          )&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Text>
                      </View2>
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
                        <Text style={{ fontSize: 18, fontFamily: "GmarketMedium" }}>
                          {endTimeText}
                        </Text>
                      </View2>
                    </TouchableOpacity>
                  </View21>
                </>
              )}
              <ModalView_State style={{ width: constants.width / 4 }}>
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
                    label: "선택...",
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
              <ButtonModalView>
                <View style={{ marginRight: 20 }}>
                  <AuthButton
                    text={"수정"}
                    color="white"
                    bgColor={"#0f4c82"}
                    onPress={() => {
                      updateSchedule()
                    }}
                    widthRatio={4}
                    marginArray={[0, 0, 0, 0]}
                    loading={modifyLoading}
                  />
                </View>
                <AuthButton
                  text={"삭제"}
                  color={"black"}
                  bgColor={"#ee5253"}
                  onPress={() => {
                    Alert.alert("", "스케줄을 정말 삭제하시겠습니까?", [
                      {
                        text: "NO",
                        onPress: () => {
                          return
                        },
                      },
                      {
                        text: "YES",
                        onPress: () => {
                          deleteSchedule()
                        },
                        style: "cancel",
                      },
                    ])
                  }}
                  widthRatio={4}
                  marginArray={[0, 0, 0, 0]}
                  loading={delLoading}
                />
              </ButtonModalView>
            </StyledModalContainer>
            {Platform.OS === "ios" ? null : (
              <EmptyView>
                {modalVisible && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={startTime}
                    mode={"time"}
                    is24Hour={true}
                    display="spinner"
                    onChange={androidstartPicker}
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
          </Modal>
        </SafeAreaView>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    // paddingTop: 22,
  },
  headerStyle: {
    backgroundColor: "#0f4c82",
    color: "#fff",
    borderColor: "#fff",
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
    fontFamily: "GmarketMedium",
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

    // paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",

    // paddingRight: 30, // to ensure the text is never behind the icon
  },
})

export default TimeWeek
