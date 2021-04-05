import React, { useEffect, useState, useRef } from "react"
import {
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  Text,
  Platform,
  Alert,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  View,
  setting,
  setSetting,
} from "react-native"
import styled from "styled-components"
import RNPickerSelect from "react-native-picker-select"
import { Ionicons } from "@expo/vector-icons"
import AuthButton from "../../components/AuthButton"
import AuthButton2 from "../../components/AuthButton2"
import AuthInput from "../../components/AuthInput"
import LastWidth from "../../components/LastWidth"
import Icon from "../../components/Icon"
import Barcharts from "../../graphs/BarCharts"
import * as Notifications from "expo-notifications"
import { useMutation } from "@apollo/react-hooks"
import { EDIT_STUDYSET } from "../Tabs/QueryBox"
import Constants from "expo-constants"
import * as Permissions from "expo-permissions"
import VdayProgress from "../../graphsVictory/VdayProgress"
import VdayBar from "../../graphsVictory/VdayBar"
import VTodayBar from "../../graphsVictory/VTodayBar"
import Modal from "react-native-modal"
import useInput from "../../hooks/useInput"
import Input_100 from "../../components/Input_100"
import NumericInput from "react-native-numeric-input"
import constants from "../../constants"

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")

const ChartView = styled.View`
  border: 0px;
  border-radius: 5;
  background-color: rgba(255, 255, 255, 0.5);
  margin-left: 10;
  margin-right: 10;
  width: 95%;
  height: 23%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`
const MainView = styled.View`
  background-color: rgba(233, 237, 244, 0);
  margin-left: 10;
  margin-right: 10;
  width: 95%;
  height: 70%;

  /* flex-direction: row; */
`
const TextCenter = styled.View`
  align-items: center;
  background-color: rgba(255, 255, 255, 0);
  margin-bottom: 5;
`

const SubText2 = styled.Text`
  color: black;
  font-size: 14;
  font-family: "GmarketBold";
`
const Text1 = styled.Text`
  font-size: 12;
  font-family: "GmarketMedium";
`
const SubText3 = styled.Text`
  color: black;
  font-size: 15;
  font-family: "GmarketBold";
`
const ExistTimeText = styled.Text`
  color: rgba(34, 76, 126, 1);
  font-size: 25;
  font-family: "GmarketBold";
`
const ExistText = styled.Text`
  color: black;
  font-size: 18;
  font-family: "GmarketBold";
`
const TargetText = styled.Text`
  color: black;
  font-size: 10;
  font-family: "GmarketBold";
`

const FlexBox = styled.View`
  flex-direction: row;
`
const FlexBox2 = styled.View`
  flex-direction: row;
`
const FlexrowBox = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 75%;
`
const FlexrowBox2 = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 75%;
`

const TimeView = styled.View`
  /* height:35%; */
  margin-top: 5;
  margin-bottom: 5;
  padding-bottom: 5;
  padding-top: 15;
  background-color: rgba(255, 255, 255, 0.5);
  border: 1px;
  border-radius: 5;
  border-color: rgba(233, 236, 243, 1);
  width: 100%;
`
const TimeViewabsolute = styled.View`
  position: absolute;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-end;
  height: 100%;
  border-color: rgba(196, 196, 196, 1);
  padding-right: 0;
`
const SubView2 = styled.View`
  padding-bottom: 5;
  padding-top: 5;

  background-color: rgba(255, 255, 255, 0.5);
  justify-content: center;
  align-items: center;
  border: 1px;
  border-radius: 5;
  border-color: rgba(233, 236, 243, 1);
  width: 100%;
`

const StyledModalContainer = styled.View`
  flex-direction: column;
  align-items: center;
  /* 모달창 크기 조절 */
  flex: 0.8;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
`
const ModalLandView = styled.View`
  flex: 1;
  justify-content: center;
`
const ModalView = styled.View`
  flex: 1;
  justify-content: center;
`

const ModalSubView = styled.View`
  flex: 0.15;
  align-items: center;
  justify-content: center;
`
const CoText = styled.Text`
  color: rgba(17, 64, 116, 1);
  font-size: 20;
  font-family: "GmarketBold";
`
const LineView = styled.View`
  width: ${WIDTH / 1.4};
  height: 5px;
  color: #000;
`
const LineView2 = styled.View`
  width: 5px;
  height: 5px;
  color: #000;
`
const Modalflex1 = styled.View`
  width: 100%;
`
const Modalflex06 = styled.View`
  flex: 0.6;
`

const IndiviList1 = styled.View`
  align-items: center;
  flex: 0.15;

  /* background-color: ${(props) => (props.isOdd ? "#FAFAFA" : "#c7c7c7")}; */
`
const StyledModalLandContainer = styled.View`
  flex-direction: column;
  align-items: center;
  /* 모달창 크기 조절 */
  flex: 1;
  /* width: ${WIDTH / 1};
  height: ${HEIGHT / 1}; */
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
`

const ModalPlay = styled.View`
  flex: 0.6;
  justify-content: center;
  align-items: center;
  width: ${WIDTH / 1.15};
  border-width: 1;
  border-radius: 10;
  margin-bottom: 5px;
  border-color: rgba(196, 196, 196, 1);
`
const ModalPlay2 = styled.View`
  /* justify-content: center;
  align-items: center;
  border-width: 1;
  border-radius: 10;
  margin-bottom: 5px;
  border-color: rgba(196, 196, 196, 1); */
  flex: 0.35;
  justify-content: center;
  align-items: center;
  width: ${WIDTH / 1.15};
  border-width: 1;
  border-radius: 10;
  margin-bottom: 5px;
  border-color: rgba(196, 196, 196, 1);
`
const ModalPlay21 = styled.View`
  justify-content: center;
  align-items: center;
  width: ${WIDTH / 1.15};
  flex: 0.15;
  flex-direction: row;
  border-width: 1;
  border-radius: 10;
  margin-bottom: 5px;
  border-color: rgba(196, 196, 196, 1);
`
const ModalPlay3 = styled.View`
  flex: 0.15;
  justify-content: center;
  align-items: center;
  width: ${WIDTH / 1.15};
  border-width: 0;
  border-radius: 10;
  margin-bottom: 5px;
  border-color: rgba(196, 196, 196, 1);
`
const ModalLand = styled.View`
  flex-direction: row;
  width: 100%;
  height: 100%;
`
const ModalPlayLand = styled.View`
  flex: 0.45;
  justify-content: center;
  align-items: center;
  border-width: 1;
  border-radius: 10;
  margin-bottom: 5px;
  margin-left: 5px;
  margin-right: 0px;
  border-color: rgba(196, 196, 196, 1);
`
const Modalflex05 = styled.View`
  flex: 0.4;
  justify-content: center;
  align-items: center;
  border-width: 0;
  margin-left: 5px;
  margin-right: 5px;

  border-radius: 10;
  margin-bottom: 5px;
  border-color: rgba(196, 196, 196, 1);
`
const ModalPlayLand2 = styled.View`
  flex: 2;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-width: 1px;
  border-radius: 10;
  margin-bottom: 5px;
  border-color: rgba(196, 196, 196, 1);
`
const ModalPlayLand21 = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: row;
  border-width: 1px;
  border-radius: 10;
  margin-bottom: 5px;
  border-color: rgba(196, 196, 196, 1);
`
const ModalPlayLand3 = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  border-width: 0;
  border-radius: 10;
  margin-bottom: 5px;
  border-color: rgba(196, 196, 196, 1);
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
  margin-left: 5;
  flex: 0.5;
  /* justify-content: center; */
`
const StyledModalSetContainer = styled.View`
  flex-direction: column;
  align-items: center;
  /* 모달창 크기 조절 */
  flex: 0.6;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
`
const StyledTodoModalLandContainer = styled.View`
  flex-direction: column;
  align-items: center;
  /* 모달창 크기 조절 */
  flex: 0.8;
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
const TimeText = styled.Text`
  font-size: 25;
  color: #fff;
  font-family: "GmarketMedium";
  /* margin-bottom: 50; */
`
//
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})
const ChartTopView = styled.View`
  width: 100%;
  height: 10%;
  align-items: center;
  justify-content: center;
`
let taskArray_pre = []
export default ({
  nexistTime,
  nowtarget,
  donutPercent,
  taskArray,
  nowScheduleTime,
  nowScheduleTimeT,
  nowScheduleColor,
  nowTitle1,
  nowTitle2,
  break_title,
  break_time,
  break_countdown,
  nextTitle1,
  nextTitle2,
  next_TimeText,
  myData,
  myInfoRefetch,
  modalVisible,
  setModalVisible,
  modalVisible2,
  setModalVisible2,
  startScheduleMutation,
  cutScheduleMutation,
  extensionScheduleMutation,
  stopScheduleMutation,
  loading,
  onLoading,
  setOnLoading,
  todayGraph_calculate,
  nowScheduleIndex,
  subjectsName,
  todolistData,
  scheduleList_selectDay,
  scheduleList_selectDay_length,
  pullScheduleMutation,
  nextScheduleIndex,
  onstopLoading,
  setstopOnLoading,
  onexLoading,
  setexOnLoading,
  oncutLoading,
  setcutOnLoading,
  land,
  setting,
  setSetting,
  androidCam,
  setandroidCam,
  personOnoff,
  setpersonOnoff,
}) => {
  const [expoPushToken, setExpoPushToken] = useState("")
  const [notification, setNotification] = useState(true)
  const [subjectId, setSubjectId] = useState("")
  useEffect(() => {
    setTimeout(function () {
      setNotification(false)
    }, 9900)
  }, [])
  const notificationListener = useRef()
  const responseListener = useRef()
  taskArray_pre = new Array(24).fill(0)
  const titleInput = useInput("")
  const countInput = useInput("")
  const trimText = (text = "", limit) => (text.length > limit ? `${text.slice(0, limit)}...` : text)
  const [scheduletodoModal, setscheduleTodoModal] = useState(false)

  // 팔로우한 각 유저 데이터에 알맞은 createdAt 넣어주기(내가가 언제 팔로우 했는지)
  for (let i = 0; i < myData.followDates.length; i++) {
    const findUser = (a) => a.id === myData.followDates[i].followId
    const tmpIndex = myData.following.findIndex(findUser)
    const createdDate = new Date(myData.followDates[i].createdAt)

    if (tmpIndex > -1) {
      myData.following[tmpIndex].followingTime = createdDate.getTime()
      // // 동행자인지 정보 넣어주기
      myData.following[tmpIndex].goWith = myData.followDates[i].goWith
      myData.following[tmpIndex].followDateId = myData.followDates[i].id
    }
  }
  // 팔로우한 날짜 순으로 정렬 최신이 위로
  myData.following.sort(function (a, b) {
    return b.followingTime - a.followingTime
  })
  const minutes = Math.floor(nexistTime / 60)
  const hour = Math.floor(minutes / 60)
  const targetminutes = Math.floor(nowtarget / 60)
  const targethour = Math.floor(targetminutes / 60)
  const [editStudySetMutation] = useMutation(EDIT_STUDYSET, {
    refetchQueries: () => [{ query: ME }],
  })

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
  const maxTimeCal = (nowDate) => {
    let maxTermMin = 0
    const totalMin_now = Math.floor((nowDate.getHours() * 60 + nowDate.getMinutes()) / 5) * 5

    // 오늘 다음 스케줄이 있으면 부터
    if (nextScheduleIndex !== -1) {
      const nextSchedule = scheduleList_selectDay[nextScheduleIndex]
      const nextDate = new Date(nextSchedule.start)
      // 5분 단위 외 찌꺼기 시간 버림
      const totalMin_next = nextDate.getHours() * 60 + nextDate.getMinutes()
      maxTermMin = totalMin_next - totalMin_now
    } else {
      //24시간은 1440분
      maxTermMin = 1440 - totalMin_now
    }
    return maxTermMin
  }

  const [startScheduleTerm, setstartScheduleTerm] = useState(
    myData.studyDefaultSet.startScheduleTerm
  )
  const [extensionTerm, setextensionTerm] = useState(5)

  const [maxtime, setmaxtime] = useState(740)

  // todolist 미완료&북마크 된거 구분
  let todolistData_new = []
  todolistData.map((todolist) => {
    if (!todolist.finish && todolist.subject.bookMark) {
      todolistData_new.push(todolist)
    }
  })
  // todolistData_new 오름차순 정렬 (만든 순서대로는 백앤드에서 이미 반영)
  todolistData_new.sort(function (a, b) {
    return a.subject.name < b.subject.name ? -1 : a.subject.name > b.subject.name ? 1 : 0
  })
  // todolistData_new Task 없음이 위로오게
  todolistData_new.sort(function (a, b) {
    const word = "과목 없음"
    return a.subject.name === word && b.subject.name !== word
      ? -1
      : a.subject.name !== word && b.subject.name === word
      ? 1
      : 0
  })
  //단축
  const onCutSchedule = async () => {
    // 5분 단위 최소 5분 검증
    if (extensionTerm < 5) {
      Alert.alert("스케줄을 단축하기 위한 최소 시간은 5분입니다.")
      return
    } else if (extensionTerm % 5 !== 0) {
      Alert.alert("단축 시간은 5분 단위로 입력해주세요.\n예) 5분, 10분, 15분...")
      return
    }
    // 업데이트 오래걸릴 수 있어 toast 위로
    // Alert.alert("현재 스케줄 단축 중...")
    // 스케줄 데이터르 최신으로 업데이트 후 현재 진행중인 스케줄 확인
    await myInfoRefetch()
    await todayGraph_calculate()
    if (nowScheduleIndex === -1) {
      Alert.alert("현재 진행 중인 스케줄이 없습니다.")
      return
    }
    // 축소시 남은 시간 계산 5분 이하면 삭제 불리언 true
    let deleteBool = false
    if (scheduleList_selectDay[nowScheduleIndex].totalTime / 60 - extensionTerm < 5) {
      deleteBool = true
    }
    const start = new Date(scheduleList_selectDay[nowScheduleIndex].start)
    const end = new Date(scheduleList_selectDay[nowScheduleIndex].end)
    end.setTime(end.getTime() - extensionTerm * 60000)

    try {
      setcutOnLoading(true)
      const {
        data: { cutSchedule_study },
      } = await cutScheduleMutation({
        variables: {
          scheduleId: scheduleList_selectDay[nowScheduleIndex].id,
          totalTime: deleteBool ? 0 : (end.getTime() - start.getTime()) / 1000,
          end,
          deleteBool,
        },
      })
      if (!cutSchedule_study) {
        Alert.alert("현재 스케줄을 단축할 수 없습니다.")
      } else {
        await myInfoRefetch()
        setModalVisible(false)

        if (deleteBool) {
          Alert.alert("현재 스케줄이 5분 미만으로 축소돼 삭제됩니다.")
        } else {
          Alert.alert("현재 스케줄을 단축했습니다.")
        }
      }
    } catch (e) {
      console.log(e)
    } finally {
      setcutOnLoading(false)
    }
  }
  const [posibleMin, setposibleMin] = useState(740)

  //스케줄 연장
  const onExtensionSchedule = async () => {
    // 5분 단위 최소 5분 검증 extensionTerm, setextensionTerm
    if (extensionTerm < 5) {
      Alert.alert("스케줄을 연장하기 위한 최소 시간은 5분입니다.")
      return
    } else if (extensionTerm % 5 !== 0) {
      Alert.alert("연장 시간은 5분 단위로 입력해주세요.\n예) 5분, 10분, 15분...")
      return
    }
    // 업데이트 오래걸릴 수 있어 toast 위로
    // Alert.alert("현재 스케줄 연장 중...")
    // 스케줄 데이터르 최신으로 업데이트 후 현재 진행중인 스케줄 확인
    await myInfoRefetch()
    await todayGraph_calculate()
    if (nowScheduleIndex === -1) {
      Alert.alert("현재 진행 중인 스케줄이 없습니다.")
      return
    }
    // 최대 연장시간 점검
    const end = new Date(scheduleList_selectDay[nowScheduleIndex].end)
    setposibleMin(1440 - (end.getHours() * 60 + end.getMinutes()))
    if (end.getHours() === 0 && end.getMinutes() === 0) {
      Alert.alert("현재 스케줄은 더는 연장이 불가능합니다.")
      return
    } else if (posibleMin < extensionTerm) {
      Alert.alert(`오늘 연장 가능한 최대 시간은 ${posibleMin}분입니다.`)
      extensionTerm.setValue(posibleMin)
      return
    }
    // 연장시간
    const start = new Date(scheduleList_selectDay[nowScheduleIndex].start)
    let deleteArray = []
    let cutId = ""
    let cutTotalTime = 0
    end.setTime(end.getTime() + extensionTerm * 60000)
    // 삭제할 단축할 스케줄 계산
    for (var i = 0; i < scheduleList_selectDay.length; i++) {
      const start_tmp = new Date(scheduleList_selectDay[i].start)
      const end_tmp = new Date(scheduleList_selectDay[i].end)
      if (start < start_tmp && end >= end_tmp) {
        deleteArray.push({ id: scheduleList_selectDay[i].id })
      } else if (start < start_tmp && end > start_tmp) {
        cutId = scheduleList_selectDay[i].id
        cutTotalTime = (end_tmp.getTime() - end.getTime()) / 1000
      }
    }
    // if (deleteArray.length !== 0 || cutId !== "") {
    //   if (
    //     window.confirm(
    //       "스케줄 연장 시 시간이 중복돼 단축(삭제)되는 스케줄이 존재합니다.\n그래도 스케줄 연장을 진행하시겠습니까?"
    //     ) === false
    //   ) {
    //     return
    //   }
    // }

    try {
      setexOnLoading(true)
      const {
        data: { extensionSchedule_study },
      } = await extensionScheduleMutation({
        variables: {
          scheduleId: scheduleList_selectDay[nowScheduleIndex].id,
          totalTime: (end.getTime() - start.getTime()) / 1000,
          end: end,
          cutId: cutId,
          cutTotalTime: cutTotalTime,
          deleteArray: deleteArray,
        },
      })
      if (!extensionSchedule_study) {
        Alert.alert("현재 스케줄을 연장할 수 없습니다.")
      } else {
        await myInfoRefetch()
        setModalVisible(false)
      }
    } catch (e) {
      console.log(e)
    } finally {
      setexOnLoading(false)
    }
  }
  //스케줄 마침
  const onStopSchedule = async () => {
    // 업데이트 오래걸릴 수 있어 toast 위로
    // 스케줄 데이터르 최신으로 업데이트 후 현재 진행중인 스케줄 확인
    await myInfoRefetch()
    await todayGraph_calculate()
    if (nowScheduleIndex === -1) {
      Alert.alert("현재 진행 중인 스케줄이 없습니다.")
      return
    }
    // 끝나는 시간 계산
    const end_origin = new Date()
    const end = new Date()
    end.setTime(end_origin.getTime())
    end.setSeconds(0)
    end.setMilliseconds(0)
    end.setMinutes(Math.floor(end.getMinutes() / 5) * 5)
    // 스케줄 시작과 지금 사이가 0~5 사이면 스케줄을 그냥 삭제
    let deleteBool = false
    const start_schedule = new Date(scheduleList_selectDay[nowScheduleIndex].start)
    if (end_origin.getTime() - start_schedule.getTime() < 300000) {
      deleteBool = true
      Alert.alert("현재 스케줄이 시작된 지 5분 이내여서 삭제되었습니다.")
    } else {
      deleteBool = false
    }
    try {
      setstopOnLoading(true)
      const {
        data: { stopSchedule_study },
      } = await stopScheduleMutation({
        variables: {
          scheduleId: scheduleList_selectDay[nowScheduleIndex].id,
          totalTime: deleteBool ? 0 : (end.getTime() - start_schedule.getTime()) / 1000,
          end: end,
          deleteBool: deleteBool,
        },
      })
      if (!stopSchedule_study) {
        Alert.alert("현재 스케줄을 마칠 수 없습니다.")
      } else {
        await myInfoRefetch()
        setModalVisible(false)
      }
    } catch (e) {
      console.log(e)
    } finally {
      setstopOnLoading(false)
    }
  }
  //스케줄시작
  const onStartSchedule = async () => {
    try {
      if (subjectId === "") {
        Alert.alert("과목을 선택하세요")
        return
      }
      setOnLoading(true)
      //스케줄 데이터르 최신으로 업데이트 후 현재 진행중인 스케줄 확인
      await myInfoRefetch()
      await todayGraph_calculate()
      if (nowScheduleIndex !== -1) {
        Alert.alert("현재 진행 중인 스케줄이 있습니다.\n현재 스케줄 마무리 후 시도해주세요.")
        return
      }
      // 사전 점검
      if (titleInput.value === "") {
        Alert.alert("스케줄 제목을 입력하세요.")
        return
      }
      // 입력 시간이 최대 시간이내 인지 점검 xxx
      const nowDate = new Date()
      const maxTime = maxTimeCal(nowDate)
      if (maxTime < startScheduleTerm) {
        Alert.alert(`현재 가능한 최대 설정 시간은 ${maxTime}분 입니다.`)
        // setstartScheduleTerm(maxTime)
        return
      }

      //입력 시간 계산  xxxxx
      const start = new Date()
      start.setTime(nowDate.getTime())
      start.setSeconds(0)
      start.setMilliseconds(0)
      start.setMinutes(Math.floor(start.getMinutes() / 5) * 5)
      const end = new Date()
      end.setTime(start.getTime() + startScheduleTerm * 60000)

      const {
        data: { startSchedule_study },
      } = await startScheduleMutation({
        variables: {
          title: titleInput.value, //제목
          start: start,
          end: end,
          totalTime: (end.getTime() - start.getTime()) / 1000,
          calendarId: subjectId, //과목
          state: "자습", //상태
        },
      })
      if (!startSchedule_study) {
        Alert.alert("스케줄을 시작할 수 없습니다.")
      } else {
        // await todolistRefetch();
        await myInfoRefetch()
        setSubjectId("")
        titleInput.setValue("")
        setstartScheduleTerm(0)
        setModalVisible(false)
      }
    } catch (e) {
      Alert.alert(e)
    } finally {
      setOnLoading(false)
    }
  }
  const onPullSchedule = async () => {
    // 스케줄 데이터르 최신으로 업데이트 후 현재 진행중인 스케줄 확인
    await myInfoRefetch()
    await todayGraph_calculate()
    if (nowScheduleIndex !== -1) {
      Alert.alert("현재 스케줄이 없을 때 사용 가능합니다.")
      return
    } else if (nextScheduleIndex === -1) {
      Alert.alert("다음 스케줄이 없습니다.")
      return
    }
    // 시작 시간 계산
    const start = new Date()
    const end = new Date()
    start.setSeconds(0)
    start.setMilliseconds(0)
    start.setMinutes(Math.floor(start.getMinutes() / 5) * 5)
    end.setTime(start.getTime() + scheduleList_selectDay[nextScheduleIndex].totalTime * 1000)

    try {
      const {
        data: { pullSchedule_study },
      } = await pullScheduleMutation({
        variables: {
          scheduleId: scheduleList_selectDay[nextScheduleIndex].id,
          start,
          end,
        },
      })
      if (!pullSchedule_study) {
        Alert.alert("다음 스케줄을 당길 수 없습니다.")
      } else {
        await myInfoRefetch()
        setModalVisible(false)
      }
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {}, [])
  // useEffect(() => {
  //   registerForPushNotificationsAsync().then((token) => setExpoPushToken(token))
  //   notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
  //     setNotification(notification)
  //   })
  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(
  //     (response) => {}
  //   )

  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener)
  //     Notifications.removeNotificationSubscription(responseListener)
  //   }
  // }, [])

  // const pushToken = async () => {
  //   await sendPushNotification(expoPushToken)
  // }
  // const noti = () => {
  //   Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: "슬로그 알람!",
  //       body: "IAM!",
  //     },
  //     trigger: {
  //       seconds: 1,
  //     },
  //   })
  // }
  return (
    // <ScrollView horizontal={false}>
    <>
      <ChartTopView>
        {personOnoff && !notification ? (
          <>{setting ? <TimeText>열공중!!!</TimeText> : <TimeText>부재중...</TimeText>}</>
        ) : null}
      </ChartTopView>
      <ChartView>
        <ExistTimeText>{hour < 10 ? `0${hour}` : hour}</ExistTimeText>
        <ExistText>시간 </ExistText>
        <ExistTimeText>
          {minutes - hour * 60 < 10 ? `0${minutes - hour * 60}` : minutes - hour * 60}
        </ExistTimeText>
        <ExistText>분 </ExistText>
        <ExistText>/</ExistText>
        <FlexBox2>
          <TargetText>{targethour < 10 ? `0${targethour}` : targethour}</TargetText>
          <TargetText>시간 </TargetText>
          <TargetText>
            {targetminutes - targethour * 60 < 10
              ? `0${targetminutes - targethour * 60}`
              : targetminutes - targethour * 60}
          </TargetText>
          <TargetText>분 </TargetText>
        </FlexBox2>
      </ChartView>
      <MainView>
        <TimeView>
          <TextCenter>
            <SubText2>{trimText(nowTitle1, 20)}</SubText2>
            <Text1>{nowTitle2}</Text1>
          </TextCenter>
          {nowScheduleTime == 0 ? (
            <Barcharts nowScheduleTime={0} nowScheduleTimeT={1} nowScheduleColor={"#E9ECF3"} />
          ) : (
            <Barcharts
              nowScheduleTime={nowScheduleTime}
              nowScheduleTimeT={nowScheduleTimeT}
              nowScheduleColor={nowScheduleColor}
            />
          )}
          <TimeViewabsolute>
            {/* <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible)
                const maxTime_tmp = maxTimeCal(new Date())
                setmaxtime(maxTime_tmp)
              }}
            >
              <Icon
                name={Platform.OS === "ios" ? "ios-options" : "md-options"}
                color={"#000000"}
                size={20}
              />
            </TouchableOpacity> */}
            <AuthButton
              text={"스케줄조정"}
              color="black"
              bgColor={"#ECE9E9"}
              onPress={() => {
                setModalVisible(!modalVisible)
                const maxTime_tmp = maxTimeCal(new Date())
                setmaxtime(maxTime_tmp)
              }}
              widthRatio={4}
              paddingArray={[5, 0, 5, 0]}
              marginArray={[0, 0, 0, 0]}
              // loading={modifyLoading}
            />
          </TimeViewabsolute>
        </TimeView>
        <SubView2>
          <FlexBox>
            <SubText2>{nextTitle1}</SubText2>
            <Text1> {trimText(nextTitle2, 20)}</Text1>
          </FlexBox>
          <Text1>{next_TimeText}</Text1>
        </SubView2>
        <Modal
          isVisible={modalVisible}
          onBackdropPress={() => setModalVisible(false)}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            // minHeight: Math.round(Dimensions.get("window").height),
          }}
        >
          {land ? (
            <StyledModalLandContainer>
              <ModalSubView>
                <CoText>스케줄 컨트롤</CoText>
              </ModalSubView>
              <ModalLandView>
                <ModalLand>
                  <ModalPlayLand>
                    <FlexrowBox>
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
                          value={subjectId} //선택된 과목이 어떻게 들어가는지 봐야함
                          style={{
                            ...pickerSelectStyles,
                            iconContainer: {
                              top: 9,
                              right: 10,
                            },
                            placeholder: {
                              color: "black",
                              fontSize: 14,
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
                          widthRatio={5}
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
                        <StyledTodoModalLandContainer style={{ width: constants.width / 1.0 }}>
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
                                    setscheduleTodoModal(false)
                                  }}
                                >
                                  <TodoNameDiv>{trimText(list.name, 15)}</TodoNameDiv>
                                </TaskNameView>
                              </IndiviList>
                            ))}
                          </ScrollView>
                        </StyledTodoModalLandContainer>
                      </Modal>
                    </FlexrowBox>
                    <LineView></LineView>
                    <FlexrowBox>
                      <AuthInput
                        {...titleInput}
                        // value={name}
                        placeholder={"To Do List"}
                        keyboardType="default"
                        returnKeyType="done"
                        // onSubmitEditing={handleLogin}
                        autoCorrect={false}
                      />
                    </FlexrowBox>
                    <LineView></LineView>

                    <FlexrowBox2>
                      <NumericInput
                        value={startScheduleTerm}
                        onChange={(value) => setstartScheduleTerm(value)}
                        totalWidth={80}
                        totalHeight={35}
                        iconSize={25}
                        rounded
                        type="up-down"
                        minValue={0}
                        maxValue={maxtime}
                        step={5}
                        valueType="real"
                        rounded
                        validateOnBlur
                        textColor="#B0228C"
                        iconStyle={{ color: "black" }}
                        rightButtonBackgroundColor="#EA3788"
                        leftButtonBackgroundColor="#E56B70"
                      />

                      <SubText3> 분</SubText3>
                    </FlexrowBox2>
                    <LineView></LineView>
                    <LineView />

                    <AuthButton
                      onPress={() => {
                        onStartSchedule()
                      }}
                      text="스케줄 시작"
                      color="white"
                      bgColor={"#7BA9EB"}
                      widthRatio={LastWidth(1, 2, 18)}
                      loading={onLoading}
                    />
                  </ModalPlayLand>
                  <Modalflex05>
                    <ModalPlayLand2>
                      <FlexrowBox2>
                        <SubText3>현재 스케줄을 </SubText3>
                        <NumericInput
                          value={extensionTerm}
                          onChange={(value) => setextensionTerm(value)}
                          totalWidth={80}
                          totalHeight={35}
                          iconSize={25}
                          rounded
                          type="up-down"
                          minValue={0}
                          maxValue={posibleMin}
                          step={5}
                          valueType="real"
                          rounded
                          validateOnBlur
                          textColor="#B0228C"
                          iconStyle={{ color: "black" }}
                          rightButtonBackgroundColor="#EA3788"
                          leftButtonBackgroundColor="#E56B70"
                        />
                        <SubText3> 분</SubText3>
                      </FlexrowBox2>
                      <LineView />
                      <LineView />
                      <LineView />
                      <FlexrowBox2>
                        <AuthButton
                          onPress={() => {
                            onCutSchedule()
                          }}
                          text="단축"
                          color="white"
                          bgColor={"#7BA9EB"}
                          widthRatio={LastWidth(1, 2, 3)}
                          loading={oncutLoading}
                        />
                        <LineView2 />
                        <LineView2 />
                        <AuthButton
                          onPress={() => {
                            onExtensionSchedule()
                          }}
                          text="연장"
                          color="white"
                          bgColor={"#7BA9EB"}
                          widthRatio={LastWidth(1, 2, 3)}
                          loading={onexLoading}
                        />
                      </FlexrowBox2>
                    </ModalPlayLand2>
                    <ModalPlayLand21>
                      <AuthButton2
                        onPress={() => {
                          onStopSchedule()
                        }}
                        text="현재 스케줄 마침"
                        color="white"
                        bgColor={"#D83835"}
                        widthRatio={LastWidth(1, 2, 4.5)}
                        loading={onstopLoading}
                      />

                      <LineView2 />
                      <LineView2 />
                      <AuthButton2
                        onPress={() => {
                          onPullSchedule()
                        }}
                        text="다음 스케줄 당김"
                        color="white"
                        bgColor={"#7BA9EB"}
                        widthRatio={LastWidth(1, 2, 4.5)}
                        loading={onstopLoading}
                      />
                    </ModalPlayLand21>
                    <ModalPlayLand3>
                      <AuthButton
                        onPress={() => {
                          setModalVisible(false)
                        }}
                        text="닫기"
                        color="white"
                        bgColor={"#7BA9EB"}
                        widthRatio={LastWidth(1, 2, 18)}
                      />
                    </ModalPlayLand3>
                  </Modalflex05>
                </ModalLand>
              </ModalLandView>
            </StyledModalLandContainer>
          ) : (
            <StyledModalContainer>
              <ModalView>
                <ModalSubView>
                  <CoText>스케줄 컨트롤</CoText>
                </ModalSubView>
                <ModalPlay>
                  <FlexrowBox>
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
                          value={subjectId} //선택된 과목이 어떻게 들어가는지 봐야함
                          style={{
                            ...pickerSelectStyles,
                            iconContainer: {
                              top: 9,
                              right: 10,
                            },
                            placeholder: {
                              color: "black",
                              fontSize: 14,
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
                          widthRatio={5}
                          marginArray={[0, 0, 0, 0]}
                          // loading={modifyLoading}
                        />
                      </View05>
                    </TodoRowView>

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
                  </FlexrowBox>
                  <LineView></LineView>
                  <FlexrowBox>
                    <AuthInput
                      {...titleInput}
                      // value={name}
                      placeholder={"To Do List"}
                      keyboardType="default"
                      returnKeyType="done"
                      // onSubmitEditing={handleLogin}
                      autoCorrect={false}
                    />
                  </FlexrowBox>
                  <LineView></LineView>
                  <LineView />

                  <FlexrowBox2>
                    <NumericInput
                      value={startScheduleTerm}
                      onChange={(value) => setstartScheduleTerm(value)}
                      totalWidth={80}
                      totalHeight={35}
                      iconSize={25}
                      rounded
                      type="up-down"
                      minValue={0}
                      maxValue={maxtime}
                      step={5}
                      valueType="real"
                      rounded
                      validateOnBlur
                      textColor="#B0228C"
                      iconStyle={{ color: "black" }}
                      rightButtonBackgroundColor="#EA3788"
                      leftButtonBackgroundColor="#E56B70"
                    />
                    {/* <View style={pickerSelectStyles.seprator} /> */}
                    {/* <AuthButton
                    onPress={() => {
                      const maxTime_tmp = maxTimeCal(new Date())
                      console.log(maxTime_tmp, "maxTime_tmp")
                      setstartScheduleTerm(maxTime_tmp)
                    }}
                    text="MAX"
                    color="white"
                    bgColor={"#7BA9EB"}
                    widthRatio={LastWidth(1, 1, 18)}
                  /> */}
                    <SubText3> 분</SubText3>
                  </FlexrowBox2>
                  <LineView></LineView>
                  <LineView />

                  <AuthButton
                    onPress={() => {
                      onStartSchedule()
                    }}
                    text="스케줄 시작"
                    color="white"
                    bgColor={"#7BA9EB"}
                    widthRatio={LastWidth(1, 2, 18)}
                    loading={onLoading}
                  />
                </ModalPlay>
                <>
                  <ModalPlay2>
                    <FlexrowBox2>
                      <SubText3>현재 스케줄을 </SubText3>
                      <NumericInput
                        value={extensionTerm}
                        onChange={(value) => setextensionTerm(value)}
                        totalWidth={80}
                        totalHeight={35}
                        iconSize={25}
                        rounded
                        type="up-down"
                        minValue={0}
                        maxValue={posibleMin}
                        step={5}
                        valueType="real"
                        rounded
                        validateOnBlur
                        textColor="#B0228C"
                        iconStyle={{ color: "black" }}
                        rightButtonBackgroundColor="#EA3788"
                        leftButtonBackgroundColor="#E56B70"
                      />
                      <SubText3> 분</SubText3>
                    </FlexrowBox2>
                    <LineView />
                    <LineView />
                    <LineView />
                    <FlexrowBox2>
                      <AuthButton
                        onPress={() => {
                          onCutSchedule()
                        }}
                        text="단축"
                        color="white"
                        bgColor={"#7BA9EB"}
                        widthRatio={LastWidth(1, 2, 7)}
                        loading={oncutLoading}
                      />
                      <LineView2 />
                      <AuthButton
                        onPress={() => {
                          onExtensionSchedule()
                        }}
                        text="연장"
                        color="white"
                        bgColor={"#7BA9EB"}
                        widthRatio={LastWidth(1, 2, 7)}
                        loading={onexLoading}
                      />
                    </FlexrowBox2>
                  </ModalPlay2>
                  <ModalPlay21>
                    <AuthButton
                      onPress={() => {
                        onStopSchedule()
                      }}
                      text="현재 스케줄 마침"
                      color="white"
                      bgColor={"#D83835"}
                      widthRatio={LastWidth(1, 2, 7)}
                      loading={onstopLoading}
                    />
                    <LineView2 />

                    <AuthButton
                      onPress={() => {
                        onPullSchedule()
                      }}
                      text="다음 스케줄 당김"
                      color="white"
                      bgColor={"#7BA9EB"}
                      widthRatio={LastWidth(1, 2, 7)}
                      loading={onstopLoading}
                    />
                  </ModalPlay21>
                </>
                <ModalPlay3>
                  <AuthButton
                    onPress={() => {
                      setModalVisible(false)
                    }}
                    text="닫기"
                    color="white"
                    bgColor={"#7BA9EB"}
                    widthRatio={LastWidth(1, 2, 18)}
                  />
                </ModalPlay3>
              </ModalView>
            </StyledModalContainer>
          )}
        </Modal>
      </MainView>
    </>
  )
}
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "슬로그",
    body: "알림 성공!",
    data: { data: "goes here" },
  }

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  })
}

async function registerForPushNotificationsAsync() {
  let token
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
    let finalStatus = existingStatus
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      finalStatus = status
    }
    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for push notification!")
      return
    }
    token = (await Notifications.getExpoPushTokenAsync()).data
    // console.log(token)
  } else {
    Alert.alert("Must use physical device for Push Notifications")
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    })
  }

  return token
}
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
  seprator: {
    height: 10,
    width: 200,
    margin: 10,
  },
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  top: {
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    height: Dimensions.get("window").height / 15,
    width: Dimensions.get("window").width / 1,
    paddingLeft: 10,
  },
  people: {
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    height: Dimensions.get("window").height / 10,
    width: Dimensions.get("window").width / 1,
    paddingLeft: 10,
    paddingTop: 10,
    flexDirection: "row",
    // borderWidth:1,
    borderColor: "grey",
  },
  peopleLand: {
    // position:"absolute",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-end",

    flexDirection: "row",
    // backgroundColor: "#000",
  },
  cameraContainer: {
    // display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // flexDirection: "column",
    // borderWidth: 5,
    // backgroundColor: "#fff",
  },
  tensorcamera: {
    position: "absolute",
    backgroundColor: "#fff",
    // width: "100%",
    // height: "100%",
  },
  cameraAbsolute: {
    position: "absolute",

    alignItems: "center",
    justifyContent: "center",
    // width: "100%",
    // height: "100%",
    // zIndex: 1,

    backgroundColor: "#0F4C82",
  },
  indiviList: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 9,
    flex: 1,
    width: Dimensions.get("window").width / 6.5,
  },
  refresh: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: Dimensions.get("window").width / 6.5,
  },
  textstyle: {
    fontSize: 9,
    fontFamily: "GmarketMedium",
  },
  textTimestyle: {
    fontSize: 12,
    color: "#0F4C82",
    fontFamily: "GmarketMedium",
  },
  moon: {
    position: "absolute",
    height: "80%",
    flexDirection: "row",
  },
  moon2: {
    height: "50%",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    // backgroundColor: "#0F4B82",
  },
  moon3: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    marginTop: 10,
    // backgroundColor: "#0F4B82",
  },
  person: {
    height: "20%",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    // backgroundColor: "#0F4B82",
  },
  round: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 40,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  roundEye: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 40,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  posebutton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  switchView: {
    // justifyContent: "flex-end",
    // alignItems: "center",
    marginBottom: 20,
    marginTop: 3,
  },
  TextView: {
    justifyContent: "center",
    alignItems: "center",
  },
  MainView: {
    width: WIDTH / 1,
    height: HEIGHT / 1,
  },
})

{
  /* <TextView> */
}
{
  /* <LeftView>
            <SubText>24시 성취율(%)</SubText>
            </LeftView> */
}
{
  /* <VTodayBar
            taskArray={taskArray}
            taskArray_pre={taskArray_pre}
            // ylength={Math.max.apply(null, taskArray)}
            ylength={69.99}
            title={"시간별 Real 시간"}
            title_y={"Real 시간(분)"}
          /> */
}
{
  /* <TextView>
            <LeftView>
              <Text>시간대별 Deep Time</Text>
            </LeftView>
            <VdayBar taskArray={taskArray} />
          </TextView> */
}
{
  /* </TextView> */
}
{
  /* </ScrollView> */
}
{
  /* <Modalflex06>
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
                          fontSize: 14,
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
                  </Modalflex06> */
}
