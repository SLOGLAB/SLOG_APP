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
const EmptyView92 = styled.View`
  flex: 0.92;
`
const EmptyView1 = styled.View`
  flex: 1;
`
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
  flex: 0.7;
  width: 300;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
`
const View1 = styled.View`
  flex: 0.5;
`

const View2 = styled.View`
  flex: 1;
  background-color: rgba(255, 255, 255, 1);
  flex-direction: row;
  justify-content: center;
`
const View21 = styled.View`
  flex: 1;
  background-color: rgba(255, 255, 255, 1);
  flex-direction: row;
  justify-content: center;
`

const View3 = styled.View`
  flex: 0.5;
  background-color: rgba(255, 255, 255, 1);
  flex-direction: row;
  justify-content: center;
`

export const SAVE_SCHEDULE = gql`
  mutation saveSchedule_my($scheduleArray: [ScheduleArray_my!]!) {
    saveSchedule_my(scheduleArray: $scheduleArray)
  }
`
export let events_data = []
let newScheduleArray = []
export let selectDate = [new Date()]

const TimeWeek = ({ SCHEDULE_USER, scheduledata, loading, onRefresh }) => {
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
  // SubjectList_tmp.push({ label: "TASK 없음", value: "" })
  const SubjectList = SubjectList_tmp.filter(function (el) {
    return el != undefined
  })

  const [modalVisible, setModalVisible] = useState(false)
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

  const settingData = async () => {
    try {
      events_data = scheduledata.me.schedules.map((List) => {
        // if (new Date(List.start).getDate() === 1) {
        //   console.log(List);
        // }
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
      Alert.alert("To Do List를 입력하세요.")
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
                flex: 1,
                // position: "absolute",
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
            <View style={{ flex: 2, alignItems: "center" }}>
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
                flex: 1,
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
            isVisible={isModalVisible}
            onBackdropPress={() => issetModalVisible(false)}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              minHeight: Math.round(Dimensions.get("window").height),
            }}
          >
            <StyledModalContainer style={{ width: constants.width / 1.5 }}>
              <View1 />
              <ModalView style={{ width: constants.width / 1.7 }}>
                <RNPickerSelect
                  onValueChange={(value) => {
                    if (value === null) {
                      Alert.alert("TASK을 선택하세요.")
                    } else {
                      const findSubject = (a) => a.id === value
                      const tmpIndex = scheduledata.mySubject.findIndex(findSubject)
                      setSelectIndex(tmpIndex)
                      setSubjectId(value)
                    }
                  }}
                  items={SubjectList}
                  placeholder={{
                    label: "TASK 선택...",
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
                placeholder={"To Do List"}
                keyboardType="email-address"
                returnKeyType="done"
                // onSubmitEditing={handleLogin}
                autoCorrect={false}
              />
              <AuthInput
                {...locationInput}
                placeholder={"위치"}
                keyboardType="email-address"
                returnKeyType="done"
                // onSubmitEditing={}
                autoCorrect={false}
              />
              <View1 />
              {Platform.OS === "ios" ? (
                <>
                  <View21>
                    <TouchableOpacity onPress={() => setCalVisibleStart(!calVisibleStart)}>
                      <Text
                        style={{
                          fontSize: 15,
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
                            fontSize: 15,
                            color: startTime >= endTime ? "red" : "black",
                          }}
                        >
                          {startTimeText}
                        </Text>
                      </View2>
                    </TouchableOpacity>
                  </View21>
                  <View21>
                    <TouchableOpacity onPress={() => setCalVisibleEnd(!calVisibleEnd)}>
                      <Text style={{ fontSize: 15 }}>
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
                        <Text style={{ fontSize: 15 }}>{endTimeText}</Text>
                      </View2>
                    </TouchableOpacity>
                  </View21>
                </>
              ) : (
                <>
                  <View21>
                    <TouchableOpacity onPress={() => setCalVisibleStart(!calVisibleStart)}>
                      <Text
                        style={{
                          fontSize: 18,
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
                            fontSize: 18,
                            color: startTime >= endTime ? "red" : "black",
                          }}
                        >
                          {startTimeText}
                        </Text>
                      </View2>
                    </TouchableOpacity>
                  </View21>
                  <View21>
                    <TouchableOpacity onPress={() => setCalVisibleEnd(!calVisibleEnd)}>
                      <Text style={{ fontSize: 18 }}>
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
                        <Text style={{ fontSize: 18 }}>{endTimeText}</Text>
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
                        text: "YES",
                        onPress: () => {
                          deleteSchedule()
                        },
                      },
                      {
                        text: "NO",
                        onPress: () => {
                          return
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
            {Platform.OS === "ios" ? (
              <EmptyView>
                <EmptyView>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    isVisible={modalVisible}
                    backdropColor={"white"}
                  >
                    <TouchableOpacity onPress={offMode}>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text>선택</Text>
                      </View>
                    </TouchableOpacity>
                    <View3>
                      <View1>
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={startTime}
                          mode={"time"}
                          is24Hour={true}
                          display="spinner"
                          onChange={startPicker}
                          minuteInterval={5}
                        />
                      </View1>
                    </View3>
                  </Modal>
                </EmptyView>
                <EmptyView>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    isVisible={modalVisibleEnd}
                    backdropColor={"white"}
                  >
                    <TouchableOpacity onPress={offModeEnd}>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text>선택</Text>
                      </View>
                    </TouchableOpacity>
                    <View3>
                      <View1>
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={endTime}
                          mode={"time"}
                          is24Hour={true}
                          display="spinner"
                          onChange={endPicker}
                          minuteInterval={5}
                        />
                      </View1>
                    </View3>
                  </Modal>
                </EmptyView>
              </EmptyView>
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
