import React, { useState } from "react"
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

const MarginView = styled.View`
  flex: 1;
  height: 10;
`
const View1 = styled.View`
  flex: 1;
`
const View2 = styled.View`
  flex: 1;
  /* background-color: "#000000"; */
  flex-direction: row;
  justify-content: center;
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

export const SAVE_SCHEDULE = gql`
  mutation saveSchedule_my($scheduleArray: [ScheduleArray_my!]!) {
    saveSchedule_my(scheduleArray: $scheduleArray)
  }
`

let newScheduleArray = []
export default AddTimeSchedule = ({ goback, subjectsName, merefetch, myData }) => {
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
      Alert.alert("TASK을 선택하세요.")
      return
    } else if (titleInput.value === "") {
      Alert.alert("To Do List를 입력하세요.")
      return
    } else if (startTime >= endTime) {
      Alert.alert("시작 시간이 끝나는 시간보다 늦거나 같을 수 없습니다.")
      return
    }

    let overlap = false
    events_data.map((sch) => {
      if (new Date(sch.endDate) > startTime && new Date(sch.startDate) < endTime) {
        overlap = true
      }
    })
    if (overlap) {
      Alert.alert("스케줄 시간은 중복될 수 없습니다.")
      return
    }

    // 끝나는 시간이 0시 0분이면 1초 빼주기
    const endTime_tmp = new Date(endTime)
    if (endTime_tmp.getMinutes() === 0 && endTime_tmp.getHours() === 0) {
      endTime_tmp.setTime(endTime.getTime() - 1000)
    }

    const generateId =
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const schedules = {
      id: generateId,
      isAllDay: false,
      isPrivate,
      title: titleInput.value,
      location: locationInput.value,
      state: substate,
      start: startTime,
      end: endTime_tmp,
      totalTime: (endTime.getTime() - startTime.getTime()) / 1000,
      calendarId: subjectId,
      option: "create",
    }
    newScheduleArray = []
    newScheduleArray.push(schedules)

    try {
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <TotalView style={{ minHeight: Math.round(Dimensions.get("window").height) }}>
        <ModalView>
          <ModalView style={{ width: constants.width / 1.7 }}>
            <RNPickerSelect
              onValueChange={(value) => {
                if (value !== null) {
                  setSubjectId(value)
                }
              }}
              items={SubjectList}
              placeholder={{
                label: "TASK 선택...",
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
            placeholder={"To Do List"}
            keyboardType="email-address"
            returnKeyType="done"
            // onSubmitEditing={handleLogin}
            autoCorrect={false}
          />
          <AuthInput
            {...locationInput}
            // value={name}
            placeholder={"위치"}
            keyboardType="email-address"
            returnKeyType="done"
            // onSubmitEditing={handleLogin}
            autoCorrect={false}
          />
        </ModalView>
        <View1>
          <MarginView />
          {Platform.OS === "ios" ? (
            <>
              <View2>
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
              </View2>
            </>
          ) : (
            <>
              <View2>
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
              </View2>
            </>
          )}

          {Platform.OS === "ios" ? (
            <EmptyView>
              <Modal
                animationType="slide"
                transparent={true}
                isVisible={modalVisible}
                backdropColor={"white"}
              >
                <EmptyView>
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
                </EmptyView>
              </Modal>
              <Modal
                animationType="slide"
                transparent={true}
                isVisible={modalVisibleEnd}
                backdropColor={"white"}
              >
                <EmptyView>
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
                </EmptyView>
              </Modal>
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
        </View1>
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
