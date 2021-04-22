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
import ObjectCopy from "../../components/ObjectCopy"
import { Ionicons } from "@expo/vector-icons"
import ActionButton from "react-native-action-button"
import BottomSheet from "reanimated-bottom-sheet"
import AddTimetable from "../../screens/TimeTable/AddTimetable"
import todayDateRange from "../../components/Date/todayDateRange"
import CalendarDate from "../../components/Date/CalendarDate"

const EmptyView = styled.View``
const EmptyView10 = styled.View`
  align-items: flex-end;
  justify-content: flex-end;
  width: ${constants.width / 1};
  margin-bottom: 0;
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
  flex: 0.5;
  justify-content: center;
  align-items: center;
`
const ModalView1 = styled.View`
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
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const StyledModalContainer = styled.View`
  flex-direction: column;
  align-items: center;
  /* 모달창 크기 조절 */
  flex: 0.6;
  width: 300;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
`
const StyledModalSetContainer = styled.View`
  flex-direction: column;
  align-items: center;
  /* 모달창 크기 조절 */
  flex: 0.6;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
`
const TodoModalTop = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 10%;
`
const TodoModalTopEnd = styled.View`
  justify-content: flex-end;
  align-items: flex-end;
  width: 90%;
  height: 10%;
`
const View1 = styled.View`
  flex: 0.2;
  justify-content: center;
  align-items: center;
  margin-top: 5;
`
const SetdayTopView = styled.View`
  flex: 0.3;
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
  flex: 0.5;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const View22 = styled.View`
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
const View05 = styled.View`
  margin-left: 10;
  flex: 0.5;
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
//
const IndiviList = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: 40;
  margin-top: 3;

  border: 0.5px;
  border-color: rgba(196, 196, 196, 1);

  /* background-color: ${(props) => (props.isOdd ? "#FAFAFA" : "#c7c7c7")}; */
`
const TaskView = styled.View`
  width: 20%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const TaskNameView = styled.TouchableOpacity`
  width: 70%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const TaskName_todo = styled.Text`
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding-right: 5px;
  margin-left: 3px;
  font-size: 13;
  /* color: ${(props) => props.color}; */
  color: rgba(0, 0, 0, 1);

  font-family: "GmarketMedium";

  /* border-color: ${(props) => (props.isOdd ? "#c7c7c7" : "#FAFAFA")}; */
`
const TodoNameDiv = styled.Text`
  flex: 1;
  flex-direction: row;
  align-items: center;
  width: 220px;
  font-size: 13;
  padding: 0 10px;
  font-family: "GmarketMedium";

  /* border-color: ${(props) => (props.isOdd ? "#c7c7c7" : "#FAFAFA")}; */
`
const ColorBox = styled.View`
  height: ${(props) => props.size};
  width: ${(props) => props.size};
  background-color: ${(props) => props.bgColor};
  margin-right: 5px;
  border-radius: ${(props) => props.radius};
`
const TimeView = styled.View`
  height: 30;
  width: 100;
  background-color: rgba(216, 56, 53, 1);
`
export const SAVE_SCHEDULE = gql`
  mutation saveSchedule_my($scheduleArray: [ScheduleArray_my!]!) {
    saveSchedule_my(scheduleArray: $scheduleArray)
  }
`
export const CREATE_SCHEDULE = gql`
  mutation createSchedule(
    $option: String!
    $scheduleId: String!
    $days: [Boolean!]!
    $calendarId: String!
    $state: String!
    $title: String!
    $location: String!
    $start: String!
    $end: String!
  ) {
    createSchedule(
      option: $option
      scheduleId: $scheduleId
      days: $days
      calendarId: $calendarId
      state: $state
      title: $title
      location: $location
      start: $start
      end: $end
    )
  }
`
export const DELETE_SCHEDULE = gql`
  mutation deleteSchedule($scheduleId: String!) {
    deleteSchedule(scheduleId: $scheduleId)
  }
`

export let events_data = []
let newScheduleArray = []
export let selectDate = [new Date()]

const TimeWeek = ({
  SCHEDULE_USER,
  scheduledata,
  loading,
  onRefresh,
  navigation,
  todolistData,
  todolistRefetch,
}) => {
  let todolistData_new = []
  let todolistData_finish = []
  todolistData.myTodolist.map((todolist) => {
    if (todolist.finish) {
      todolistData_finish.push(todolist)
    } else {
      todolistData_new.push(todolist)
    }
  })
  const trimText = (text = "", limit) => (text.length > limit ? `${text.slice(0, limit)}...` : text)

  const myState = scheduledata.me.studyPurpose === "학습" ? ["자습", "강의"] : ["업무", "개인"]

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
  // const [substate, setsubstate] = useState(`${myState[0]}`)
  const [substate, setsubstate] = useState("자습")

  const [startTime, setstartTime] = useState(new Date())
  const [endTime, setendTime] = useState(new Date())
  const [startTimeText, setstartTimeText] = useState(moment(new Date()).format("hh:mm a"))
  const [endTimeText, setendTimeText] = useState(moment(new Date()).format("hh:mm a"))
  const [isModalVisible, issetModalVisible] = useState(false)
  const [todoModal, setTodoModal] = useState(false)

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
  const [copySetDay, setCopySetDay] = useState(new Date(new Date().getTime() + 86400000))
  const [copyDayLoading, setcopyDayLoading] = useState(false)

  //주간 스케줄
  const [selectDay, setselectDay] = useState(new Date())
  const [CalmodalVisible, setCalModalVisible] = useState(false)
  const [selectSetDay, setselectSetDay] = useState(new Date(new Date().getTime() + 86400000 * 7))
  const [CalmodalWeekVisible, setCalModalWeekVisible] = useState(false)
  const [copyWeekLoading, setcopyWeekLoading] = useState(false)

  // 날짜 택스트로 변환
  // const makeDatesValue = (refDate) => {
  //   const dateText = moment(refDate).format("YYYY-MM-DD")
  //   const resultObj = { String(dateText): { a: 1 } }
  //   return resultObj
  // }
  // console.log(makeDatesValue(copySetDay))

  //
  const dateMark = new Object()
  dateMark[dateStr] = { selected: true, selectedColor: "#0F4C82" }

  const locationInput = useInput("")
  const titleInput = useInput("")

  const [scheduleMutation] = useMutation(SAVE_SCHEDULE, {
    variables: {
      scheduleArray: newScheduleArray,
    },
    refetchQueries: () => [{ query: SCHEDULE_USER }],
  })
  const [updateScheduleMutation] = useMutation(CREATE_SCHEDULE, {
    refetchQueries: () => [{ query: SCHEDULE_USER }],
  })
  const [deleteScheduleMutation] = useMutation(DELETE_SCHEDULE, {
    refetchQueries: () => [{ query: SCHEDULE_USER }],
  })

  //copy 모달
  var theYear = selectDay.getFullYear()
  var theMonth = selectDay.getMonth()
  var theDate = selectDay.getDate()
  var theDayOfWeek = selectDay.getDay() //요일
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
  var theSetYear = selectSetDay.getFullYear()
  var theSetMonth = selectSetDay.getMonth()
  var theSetDate = selectSetDay.getDate()
  var theSetDayOfWeek = selectSetDay.getDay() //요일
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
    try {
      setDelLoading(true)
      const {
        data: { deleteSchedule },
      } = await deleteScheduleMutation({
        variables: {
          scheduleId,
        },
      })
      if (!deleteSchedule) {
        Alert.alert("스케줄을 삭제할 수 없습니다.")
      } else {
        issetModalVisible(!isModalVisible)
      }
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
    } finally {
      setDelLoading(false)
    }
  }

  const updateSchedule = async () => {
    if (subjectId === "") {
      Alert.alert("과목을 선택하세요")
      return
    } else if (titleInput.value === "") {
      Alert.alert("제목을 입력하세요.")
      return
    } else if (startTime >= endTime) {
      alert("끝 시간이 시작 시간과 같거나 빠를 수 없습니다.")
      return
    } else if (endTime.getTime() - startTime.getTime() > 86400000) {
      alert("스케줄 기간은 24시간 이내로만 가능합니다.")
      return
    }

    // 요일 배열 구성
    const dayLists = new Array(7).fill(false)
    dayLists[startTime.getDay()] = true

    try {
      setModifyLoading(true)
      const {
        data: { createSchedule },
      } = await updateScheduleMutation({
        variables: {
          option: "update",
          scheduleId,
          days: dayLists,
          calendarId: subjectId,
          state: "자습",
          title: titleInput.value,
          location: locationInput.value,
          start: startTime,
          end: endTime,
        },
      })
      if (!createSchedule) {
        Alert.alert("스케줄을 수정할 수 없습니다.")
      } else {
        issetModalVisible(!isModalVisible)
      }
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
    } finally {
      setModifyLoading(false)
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
    // setsubstate(evt.state)
    // setPrivate(evt.isPrivate)
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

  const androidstartPicker = (event, selectedDate) => {
    setModalVisible(!modalVisible)
    const currentTime = new Date(selectedDate)

    if (currentTime.getMinutes() % 5 !== 0) {
      if (selectedDate !== undefined) {
        Alert.alert("시간 범위를 5분 단위로 설정해주세요.\n(예: 5분, 10분, 15분, ...)")
      }
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
      if (selectedendTime !== undefined) {
        Alert.alert("시간 범위를 5분 단위로 설정해주세요.\n(예: 5분, 10분, 15분, ...)")
      }
    } else if (currentTime < startTime) {
      Alert.alert("끝나는 시간이 시작 시간보다 빠를 수 없습니다.")
    } else {
      setendTime(currentTime)
      setendTimeText(moment(currentTime).format("hh:mm a"))
    }
  }

  // 스케줄 가공 전처리
  const schePreTreat = ({ sches, diffTime = 0 }) => {
    let checkEmpty = true
    const tmpSchedules = sches.map((sche) => {
      // 어플만
      sche.start = new Date(sche.start)
      sche.end = new Date(sche.end)
      sche.calendarId = sche.subjectId
      delete sche.subjectId
      delete sche.__typename
      delete sche.subjectName
      //
      if (sche.calendarId === "") {
        checkEmpty = false
      }
      delete sche.category
      delete sche.raw
      delete sche.dueDateClass
      delete sche.isVisible
      delete sche.bgColor
      delete sche.borderColor
      delete sche.dragBgColor
      delete sche.color
      sche.totalTime = (sche.end.getTime() - sche.start.getTime()) / 1000
      sche.option = "create"
      if (diffTime !== 0) {
        sche.start.setTime(sche.start.getTime() + diffTime)
        sche.end.setTime(sche.end.getTime() + diffTime)
      }
      const generateId =
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      sche.id = generateId
      return sche
    })

    if (!checkEmpty) {
      return false
    }
    return tmpSchedules
  }

  //하루 스케줄 복사
  const copyDaySchedule = async () => {
    // 해당일 스케줄 필터링
    const weekFilter = (sche) => {
      const { startDate, endDate } = todayDateRange(copyStartDay)
      return new Date(sche.start) >= startDate && new Date(sche.start) <= endDate
    }
    const nowSche = ObjectCopy(scheduledata.me.schedules)
    const weekSche = nowSche.filter(weekFilter)

    const { startDate: copySD } = todayDateRange(copyStartDay)
    const { startDate: pasteSD } = todayDateRange(copySetDay)
    const diffTime = pasteSD.getTime() - copySD.getTime()
    const scheTmpArray = schePreTreat({
      sches: weekSche,
      diffTime,
    })

    if (scheTmpArray.length === 0) {
      alert("해당 기간에 복사할 스케줄이 없습니다.")
      return
    } else if (scheTmpArray === false) {
      alert("과목이 할당되지 않은 스케줄이 존재합니다.\n과목 할당 후 다시 시도하세요.")
      return
    }

    try {
      setcopyDayLoading(true)
      const {
        data: { saveSchedule_my },
      } = await scheduleMutation({
        variables: {
          scheduleArray: scheTmpArray,
        },
      })
      if (!saveSchedule_my) {
        Alert.alert("스케줄을 복사할 수 없습니다.")
      } else {
        const nowDate = new Date()
        setModalCopyVisible(!modalCopyVisible)
        setCopyStartDay(nowDate)
        setCopySetDay(new Date(nowDate.getTime() + 86400000))
      }
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
    } finally {
      setcopyDayLoading(false)
    }
  }

  const copyWeekSchedule = async () => {
    // 날짜 형식으로 재정립
    const copyStart = new Date(thisWeek[0]) // 복사하는 날짜 1주일 시작 날짜
    const copyEnd = new Date(thisWeek[6]) // 복사하는 날짜 1주일 마지막 날짜
    copyEnd.setDate(copyEnd.getDate() + 1) // 마지막 끝나는 시점으로 맞추기 위해 00시 00분
    const pasteStart = new Date(thisSetWeek[0]) // 붙여넣는 날짜 1주일 시작 날짜

    // 해당주 스케줄 필터링
    const weekFilter = (sche) =>
      new Date(sche.start) >= copyStart && new Date(sche.start) <= copyEnd
    const nowSche = ObjectCopy(scheduledata.me.schedules)
    const weekSche = nowSche.filter(weekFilter)

    const diffTime = pasteStart.getTime() - copyStart.getTime()
    const scheTmpArray = schePreTreat({
      sches: weekSche,
      diffTime,
    })

    if (scheTmpArray.length === 0) {
      alert("해당 기간에 복사할 스케줄이 없습니다.")
      return
    } else if (scheTmpArray === false) {
      alert("과목이 할당되지 않은 스케줄이 존재합니다.\n과목 할당 후 다시 시도하세요.")
      return
    }

    try {
      setcopyWeekLoading(true)
      const {
        data: { saveSchedule_my },
      } = await scheduleMutation({
        variables: {
          scheduleArray: scheTmpArray,
        },
      })
      if (!saveSchedule_my) {
        Alert.alert("스케줄을 복사할 수 없습니다.")
      } else {
        const nowDate = new Date()
        setModalCopyVisible(!modalCopyVisible)
        setselectDay(nowDate)
        setselectSetDay(new Date(nowDate.getTime() + 86400000 * 7))
      }
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
    } finally {
      setcopyWeekLoading(false)
    }
  }

  if (!loading) {
    settingData()
  }

  const [isMenuOpen, setisMenuOpen] = useState(false)

  const handleMenuToggle = () => setisMenuOpen(!isMenuOpen)
  const clesesheetRefhi = () => sheetRef.current.snapTo(1)

  const renderContent = () => (
    <View
      style={{
        height: "100%",
      }}
    >
      <AddTimetable clesesheetRefhi={clesesheetRefhi} />
    </View>
  )

  const sheetRef = React.useRef(null)
  const [androidSchedule, setandroidSchedule] = useState(false)

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
            {/* <View
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
            </View> */}
            <View style={{ width: "50%", alignItems: "center" }}>
              <TouchableOpacity onPress={() => setModalVisible2(!modalVisible2)}>
                <Text style={{ fontSize: 17, fontWeight: "bold", fontFamily: "GmarketBold" }}>
                  {dateStr}
                </Text>
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
                width: "25%",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <AuthButton
                text={"복사"}
                color="white"
                bgColor={"#0f4c82"}
                onPress={() => {
                  setModalCopyVisible(!modalCopyVisible)
                }}
                widthRatio={6}
                marginArray={[0, 0, 0, 0]}
                paddingArray={[6, 0, 6, 0]}
                loading={modifyLoading}
              />
              {/* <TouchableOpacity
                onPress={() => {
                  setModalCopyVisible(!modalCopyVisible)
                }}
              >
                <Icon name={Platform.OS === "ios" ? "ios-copy" : "md-copy"} size={25} />
              </TouchableOpacity> */}
            </View>
            <View
              style={{
                width: "15%",
                alignItems: "center",
              }}
            >
              <AuthButton
                text={"과목설정"}
                color="white"
                bgColor={"#0f4c82"}
                onPress={() => {
                  navigation.navigate("TimetableNavi")
                }}
                widthRatio={6}
                marginArray={[0, 0, 0, 0]}
                paddingArray={[6, 0, 6, 0]}
                loading={modifyLoading}
              />
              {/* <TouchableOpacity
                onPress={() => {
                  navigation.navigate("TimetableNavi")
                }}
              >
                <Icon name={Platform.OS === "ios" ? "ios-settings" : "md-settings"} size={25} />
              </TouchableOpacity> */}
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
          {androidSchedule ? (
            <AddTimetable
              clesesheetRefhi={clesesheetRefhi}
              setandroidSchedule={setandroidSchedule}
            />
          ) : null}
          <ActionButton buttonColor="rgba(231,76,60,1)">
            <ActionButton.Item
              buttonColor="#114074"
              title="스케줄 만들기"
              onPress={() => {
                if (Platform.OS == "android") {
                  setandroidSchedule(true)
                } else {
                  sheetRef.current.snapTo(0)
                }
              }}
            >
              <Icon
                name={Platform.OS === "ios" ? "ios-calendar" : "md-calendar"}
                size={30}
                color="white"
              />
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor="#114074"
              title="+ TO DO"
              onPress={() => navigation.navigate("TodoListSwiper")}
            >
              <Icon
                name={
                  Platform.OS === "ios"
                    ? "ios-checkmark-circle-outline"
                    : "md-checkmark-circle-outline"
                }
                size={30}
                color="white"
              />
            </ActionButton.Item>
          </ActionButton>

          <Modal
            isVisible={modalCopyVisible}
            onBackdropPress={() => setModalCopyVisible(false)}
            style={{
              justifyContent: "center",
              alignItems: "center",
              minHeight: Math.round(Dimensions.get("window").height),
            }}
          >
            <StyledModalSetContainer style={{ width: constants.width / 1 }}>
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
                <View22>
                  <ModalView1>
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
                  </ModalView1>
                  <ModalView2>
                    <Icon
                      name={Platform.OS === "ios" ? "ios-arrow-forward" : "md-arrow-forward"}
                      size={30}
                    />
                  </ModalView2>
                  <ModalView1>
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
                  </ModalView1>
                </View22>
                <View22>
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
                </View22>

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
                      setCopyStartDay(new Date(day.timestamp))
                      setCopyDayModal(!copyDayModal)
                    }}
                    monthFormat={"yyyy MM"}
                    onPressArrowLeft={(subtractMonth) => subtractMonth()}
                    onPressArrowRight={(addMonth) => addMonth()}
                    markedDates={CalendarDate(copySetDay)}
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
                      setCopySetDay(new Date(day.timestamp))
                      setCopydaySetMdal(!copyDaySetMdal)
                    }}
                    monthFormat={"yyyy MM"}
                    onPressArrowLeft={(subtractMonth) => subtractMonth()}
                    onPressArrowRight={(addMonth) => addMonth()}
                    markedDates={CalendarDate(copySetDay)}
                  />
                </Modal>
              </ModalView04>
              <EmptyView5 />
              <ModalView04>
                <SetdayTopView>
                  <CopyText>주간 스케줄 복사</CopyText>
                </SetdayTopView>
                <View22>
                  <ModalView1>
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
                          setselectDay(new Date(day.timestamp))
                          setCalModalVisible(!CalmodalVisible)
                        }}
                        monthFormat={"yyyy MM"}
                        onPressArrowLeft={(subtractMonth) => subtractMonth()}
                        onPressArrowRight={(addMonth) => addMonth()}
                        markedDates={CalendarDate(selectDay)}
                      />
                    </Modal>
                  </ModalView1>
                  <ModalView2>
                    <Icon
                      name={Platform.OS === "ios" ? "ios-arrow-forward" : "md-arrow-forward"}
                      size={30}
                    />
                  </ModalView2>
                  <ModalView1>
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
                          setselectSetDay(new Date(day.timestamp))
                          setCalModalWeekVisible(!CalmodalWeekVisible)
                        }}
                        monthFormat={"yyyy MM"}
                        onPressArrowLeft={(subtractMonth) => subtractMonth()}
                        onPressArrowRight={(addMonth) => addMonth()}
                        markedDates={CalendarDate(selectSetDay)}
                      />
                    </Modal>
                  </ModalView1>
                </View22>
                <View22>
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
                </View22>
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
              <ModalView style={{ width: constants.width / 1.7, flexDirection: "row" }}>
                <View12>
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
                    // value={scheduledata.mySubject[selectIndex].id}
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
                </View12>
                <View05>
                  <AuthButton
                    text={"TODO"}
                    color="black"
                    bgColor={"#ECE9E9"}
                    onPress={() => {
                      setTodoModal(true)
                    }}
                    widthRatio={4}
                    marginArray={[0, 0, 0, 0]}
                    // loading={modifyLoading}
                  />
                </View05>
                <Modal
                  isVisible={todoModal}
                  onBackdropPress={() => setTodoModal(false)}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: Math.round(Dimensions.get("window").height),
                  }}
                >
                  <StyledModalSetContainer style={{ width: constants.width / 1.1 }}>
                    <TodoModalTopEnd>
                      <TouchableOpacity
                        onPress={() => {
                          setTodoModal(false)
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
                    </TodoModalTopEnd>
                    <TodoModalTop>
                      <CopyText>To Do List</CopyText>
                    </TodoModalTop>
                    <ScrollView>
                      {todolistData_new.map((list) => (
                        <IndiviList key={list.id}>
                          <TaskView>
                            <ColorBox
                              size={"10px"}
                              radius={"16px"}
                              bgColor={list.subject.bgColor}
                            />

                            <TaskName_todo color={list.subject.bgColor}>
                              {trimText(list.subject.name, 10)}
                            </TaskName_todo>
                          </TaskView>
                          <TaskNameView
                            onPress={() => {
                              setSubjectId(list.subject.id)
                              titleInput.setValue(list.name)
                              setTodoModal(false)
                            }}
                          >
                            <TodoNameDiv>{trimText(list.name, 15)}</TodoNameDiv>
                          </TaskNameView>
                        </IndiviList>
                      ))}
                    </ScrollView>
                  </StyledModalSetContainer>
                </Modal>
              </ModalView>
              <AuthInput
                {...titleInput}
                placeholder={"(필수) 제목"}
                keyboardType="default"
                returnKeyType="done"
                // onSubmitEditing={handleLogin}
                autoCorrect={false}
              />
              {/* <LineView /> */}
              {/* <AuthInput
                {...locationInput}
                placeholder={"(선택) 위치"}
                keyboardType="default"
                returnKeyType="done"
                // onSubmitEditing={}
                autoCorrect={false}
              /> */}
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
                        markedDates={CalendarDate(startTime)}
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
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          width: 100,
                          height: 70,
                        }}
                      />
                    </View12>
                  </RowView>
                  <RowMidView></RowMidView>
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
                        markedDates={CalendarDate(endTime)}
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
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          width: 100,
                          height: 70,
                        }}
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
                        markedDates={CalendarDate(startTime)}
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
                        markedDates={CalendarDate(endTime)}
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
                    display="clock"
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
                    display="clock"
                    onChange={androidendPicker}
                    minuteInterval={5}
                  />
                )}
              </EmptyView>
            )}
          </Modal>
        </SafeAreaView>
      )}
      <BottomSheet
        ref={sheetRef}
        snapPoints={[450, 0]}
        borderRadius={20}
        initialSnap={1}
        renderContent={renderContent}
        enabledGestureInteraction={true}
        // isBackDrop={true}
        // isBackDropDismisByPress={true}
        // isRoundBorderWithTipHeader={true}
      />
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
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white",
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
