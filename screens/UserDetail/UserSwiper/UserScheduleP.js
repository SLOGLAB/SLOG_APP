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
  position: absolute;
  justify-content: flex-start;
  align-items: flex-end;
  margin-right: 10;
  width: 100%;
  height: 90%;
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
  align-items: flex-start;
  justify-content: center;
  padding-left: 10px;
  /* 모달창 크기 조절 */
  flex: 0.25;
  /* width: 300; */
  background-color: rgba(255, 255, 255, 1);
  border-radius: 5px;
  border-top-color: ${(props) => props.color};
  border-top-width: 8px;
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
  align-items: flex-start;
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
  color: ${(props) => props.color};
  font-family: "GmarketMedium";
`
const RowBoldText = styled.Text`
  font-size: 20;
  color: ${(props) => props.color};
  font-family: "GmarketBold";
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
  navigation,
  username,
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

  const [modalVisible2, setModalVisible2] = useState(false)
  const [startTime, setstartTime] = useState(new Date())
  const [endTime, setendTime] = useState(new Date())
  const [startTimeText, setstartTimeText] = useState(moment(new Date()).format("hh:mm a"))
  const [endTimeText, setendTimeText] = useState(moment(new Date()).format("hh:mm a"))
  const [isModalVisible, issetModalVisible] = useState(false)

  const [subjectMain, setsubjectMain] = useState("")

  const [subjectName, setsubjectName] = useState("")
  const [modalVisibleEnd, setModalVisibleEnd] = useState(false)
  const [state, setstate] = useState("")
  const [color, setcolor] = useState("#114074")

  const [dateStr, setDateStr] = useState(moment(new Date()).format("YYYY-MM-DD"))

  const dateMark = new Object()
  dateMark[dateStr] = { selected: true }

  const settingData = async () => {
    try {
      events_data = scheduledata.userSchedule.map((List) => {
        const startDate = new Date(List.start)
        const endDate = new Date(List.end)
        endDate.setTime(endDate.getTime() - 1000)
        return {
          id: List.id,
          description:
            List.subject === null
              ? `${List.isPrivate ? "🔒\n" : ""}${List.title}`
              : `[${List.subject.name}]\n${List.isPrivate ? "🔒\n" : ""}${List.title}`,
          subjectMain: List.subject === null ? `` : `[${List.subject.name}]`,
          subjectName: `${List.title}`,
          location: List.location,
          startDate,
          endDate,
          color: List.subject === null ? "#A1B56C" : List.subject.bgColor,
          totalTime: List.totalTime,
          state: List.state,
        }
      })
    } catch (e) {
      console.log(e)
    } finally {
    }
  }

  const onEventPress = (evt) => {
    issetModalVisible(true)
    evt.endDate.setTime(evt.endDate.getTime() + 1000)

    // title에 좌물쇠 빼주기
    if (evt.description.includes("🔒")) {
      const tmpString = evt.description.split("🔒\n")
      evt.description = tmpString[1]
    }
    setsubjectName(evt.subjectName)
    setsubjectMain(evt.subjectMain)
    setstate(evt.state)
    setcolor(evt.color)
    setstartTime(evt.startDate)
    setendTime(evt.endDate)
    setstartTimeText(moment(evt.startDate).format("hh:mm a"))
    setendTimeText(moment(evt.endDate).format("hh:mm a"))
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
                width: "10%",
                alignItems: "flex-start",
                paddingLeft: 15,
              }}
            >
              <TouchableOpacity onPress={() => navigation.navigate("Userdetail")}>
                <Icon
                  name={Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"}
                  color={"#000000"}
                  size={40}
                />
              </TouchableOpacity>
            </View>
            <View style={{ width: "80%", alignItems: "center" }}>
              <TouchableOpacity onPress={() => setModalVisible2(!modalVisible2)}>
                <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                  {username}({dateStr})
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
                // position: "absolute",
                width: "10%",
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
            <StyledModalContainer style={{ width: constants.width / 1.1 }} color={color}>
              <EmptyView1>
                <TouchableOpacity
                  onPress={() => {
                    issetModalVisible(false)
                  }}
                >
                  <Icon
                    name={
                      Platform.OS === "ios" ? "ios-close-circle-outline" : "md-close-circle-outline"
                    }
                    size={23}
                  />
                </TouchableOpacity>
              </EmptyView1>
              <SetdayTopView>
                <RowBoldText color={color}>{subjectMain}</RowBoldText>
                <RowBoldText color={"#000000"}>{subjectName}</RowBoldText>
                <RowText color={"#000000"}>
                  {startTimeText} - {endTimeText}
                </RowText>
                <RowText color={"#CACACA"}>{state}</RowText>
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
