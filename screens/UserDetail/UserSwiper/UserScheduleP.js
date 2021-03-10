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
import Timetablecontrol from "../../../components/Timetablecontrol"

import WeekView from "../../AWeekTime/react-native-week-view/src/WeekView/WeekView"
import Loader from "../../../components/Loader"
import Icon from "../../../components/Icon"
import styled from "styled-components"
import Modal from "react-native-modal"
import AuthInput from "../../../components/AuthInput"
import useInput from "../../../hooks/useInput"
import { gql } from "apollo-boost"
import { useMutation } from "@apollo/react-hooks"
import DateTimePicker from "@react-native-community/datetimepicker"
import moment from "moment"
import constants from "../../../constants"
import RNPickerSelect from "react-native-picker-select"
import { Calendar } from "react-native-calendars"
import AuthButton from "../../../components/AuthButton"
import { CheckBox } from "native-base"
import ObjectCopy from "../../../components/ObjectCopy"
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

const UserScheduleP = ({
  Subjectdata,
  SCHEDULE_USER,
  scheduledata,
  loading,
  onRefresh,
  targetToday,
}) => {
  const dayList = ["일", "월", "화", "수", "목", "금", "토"]
  const SubjectList_tmp = Subjectdata.userSubject.map((file) => {
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
      events_data = scheduledata.userSchedule.map((List) => {
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
          // color: List.subject.bgColor,

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
    const tmpIndex = scheduledata.seeUser.subject.findIndex(findSubject)
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
                <ScheduleText>스케줄 정보</ScheduleText>
              </SetdayTopView>
            </StyledModalContainer>
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

export default UserScheduleP
