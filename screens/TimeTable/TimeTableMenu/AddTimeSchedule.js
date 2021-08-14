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
  ScrollView,
} from "react-native"
import { useMutation } from "@apollo/react-hooks"
import RNPickerSelect from "react-native-picker-select"
import AuthInput from "../../../components/AuthInput"
import Icon from "../../../components/Icon"
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
import CalendarDate from "../../../components/Date/CalendarDate"

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
  flex: 0.1;
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
  margin-top: 10;
`
const ModalView02 = styled.View`
  flex: 0.2;
  justify-content: center;
  align-items: center;
  margin-top: 10;
`

const RowAndView = styled.View`
  /* flex-direction: row; */
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: 1;
  margin-top: 0;
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
  margin-top: 5;
  margin-bottom: 10;
  border-width: 0;
  border-color: rgba(15, 76, 130, 1);
  border-radius: 5;
  padding: 3px;
`
const RowText = styled.Text`
  font-size: 15;
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
const View01 = styled.View`
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
const StyledModalSetContainer = styled.View`
  flex-direction: column;
  align-items: center;
  /* 모달창 크기 조절 */
  flex: 0.6;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
`
const TodoRowView = styled.View`
  flex-direction: row;
`
const TodoModalTopEnd = styled.View`
  justify-content: flex-end;
  align-items: flex-end;
  width: 90%;
  height: 10%;
`
const TodoModalTop = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 10%;
`
const CopyText = styled.Text`
  font-size: 17;
  font-family: "GmarketBold";
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
    $userBookId: String!
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
      userBookId: $userBookId
    )
  }
`
// export const CREATE_SCHEDULE = gql`
//   mutation createSchedule(
//     $option: String!
//     $scheduleId: String!
//     $days: [Boolean!]!
//     $calendarId: String!
//     $state: String!
//     $title: String!
//     $location: String!
//     $start: String!
//     $end: String!
//   ) {
//     createSchedule(
//       option: $option
//       scheduleId: $scheduleId
//       days: $days
//       calendarId: $calendarId
//       state: $state
//       title: $title
//       location: $location
//       start: $start
//       end: $end
//     )
//   }
// `

let newScheduleArray = []
export default AddTimeSchedule = ({
  goback,
  subjectsName,
  targetToday,
  myData,
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

  const myState = myData.me.studyPurpose === "학습" ? ["자습", "강의"] : ["업무", "개인"]

  const [selectDay, setselectDay] = useState(targetToday)
  const [scheduletodoModal, setscheduleTodoModal] = useState(false)

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
  const [day1, setday1] = useState(new Date().getDay() === 1)
  const [day2, setday2] = useState(new Date().getDay() === 2)
  const [day3, setday3] = useState(new Date().getDay() === 3)
  const [day4, setday4] = useState(new Date().getDay() === 4)
  const [day5, setday5] = useState(new Date().getDay() === 5)
  const [day6, setday6] = useState(new Date().getDay() === 6)
  const [day7, setday7] = useState(new Date().getDay() === 7)
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
  // const [substate, setsubstate] = useState(`${myState[0]}`)
  const [substate, setsubstate] = useState("자습")

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

  const [createScheMutation] = useMutation(CREATE_SCHEDULE)

  const allClear = () => {
    setSubjectId("")
    titleInput.setValue("")
    locationInput.setValue("")
    // setsubstate(`${myState[0]}`)
    setstartTime(initDate)
    setendTime(initDate2)
    setstartTimeText(moment(initDate).format("hh:mm a"))
    setendTimeText(moment(initDate2).format("hh:mm a"))
    // setday1(new Date().getDay() === 1)
    // setday2(new Date().getDay() === 2)
    // setday3(new Date().getDay() === 3)
    // setday4(new Date().getDay() === 4)
    // setday5(new Date().getDay() === 5)
    // setday6(new Date().getDay() === 6)
    // setday7(new Date().getDay() === 0)
    // setPrivate(false)
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
      if (selectedDate !== undefined) {
        Alert.alert("시간 범위를 5분 단위로 설정해주세요.\n(예: 5분, 10분, 15분, ...)")
      }
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
    } else {
      setendTime(currentTime)
      setendTimeText(moment(currentTime).format("hh:mm a"))
    }
  }

  const finSchedule = async () => {
    if (dayLists.findIndex((e) => e === true) === -1) {
      Alert.alert("요일을 선택하세요")
      return
    } else if (subjectId === "") {
      Alert.alert("과목을 선택하세요.")
      return
    } else if (titleInput.value === "") {
      Alert.alert("제목을 입력하세요.")
      return
    } else if (startTime >= endTime) {
      Alert.alert("시작 시간이 끝나는 시간보다 늦거나 같을 수 없습니다.")
      return
    }

    try {
      setModifyLoading(true)
      const {
        data: { createSchedule },
      } = await createScheMutation({
        variables: {
          option: "create",
          scheduleId: "",
          days: dayLists,
          calendarId: subjectId,
          state: "자습",
          title: titleInput.value,
          location: locationInput.value,
          start: startTime,
          end: endTime,
        },
        refetchQueries: () => [{ query: SCHEDULE_USER }],
      })
      if (!createSchedule) {
        Alert.alert("스케줄을 만들 수 없습니다.")
      } else {
        allClear()
      }
    } catch (e) {
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
      <TotalView>
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
              markedDates={CalendarDate(selectDay)}
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
          <ModalView02 style={{ width: constants.width / 1.7 }}>
            <TodoRowView>
              <View01>
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
              </View01>
              <View05>
                <AuthButton
                  text={"TODO"}
                  color="black"
                  bgColor={"#ECE9E9"}
                  onPress={() => {
                    setscheduleTodoModal(true)
                  }}
                  widthRatio={4}
                  marginArray={[0, 0, 0, 0]}
                  // loading={modifyLoading}
                />
              </View05>
              <Modal
                isVisible={scheduletodoModal}
                onBackdropPress={() => setscheduleTodoModal(false)}
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
                        setscheduleTodoModal(false)
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
                          <ColorBox size={"10px"} radius={"16px"} bgColor={list.subject.bgColor} />

                          <TaskName_todo color={list.subject.bgColor}>
                            {trimText(list.subject.name, 10)}
                          </TaskName_todo>
                        </TaskView>
                        <TaskNameView
                          onPress={() => {
                            setSubjectId(list.subject.id)
                            titleInput.setValue(list.name)
                            setscheduleTodoModal(false)
                          }}
                        >
                          <TodoNameDiv>{trimText(list.name, 15)}</TodoNameDiv>
                        </TaskNameView>
                      </IndiviList>
                    ))}
                  </ScrollView>
                </StyledModalSetContainer>
              </Modal>
            </TodoRowView>
            <MarginR style={{ height: constants.height / 50 }} />
            <RNPickerSelect
              onValueChange={(value) => {
                if (value !== null) {
                  setSubjectId(value)
                }
              }}
              items={SubjectList}
              placeholder={{
                label: "(선택사항)교재 선택",
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
            <MarginR style={{ height: constants.height / 50 }} />

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
          </ModalView02>
        </ModalView>

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
          </>
        ) : (
          <>
            <RowAndView>
              <View2>
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
              <View2>
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

        <ModalView>
          <AuthButton
            color="white"
            onPress={finSchedule}
            bgColor={"#0f4c82"}
            text="만들기"
            loading={modifyLoading}
          />
        </ModalView>
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

{
  /* </View1> */
}

{
  /* <ModalView_State style={{ width: constants.width / 3.5 }}>
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
        </ModalView_State> */
}
