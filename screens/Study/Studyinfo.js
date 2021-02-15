import React, { useEffect, useState, useRef } from "react"
import {
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native"
import styled from "styled-components"
import RNPickerSelect from "react-native-picker-select"
import { Ionicons } from "@expo/vector-icons"
import AuthButton from "../../components/AuthButton"
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

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")
const MainTView = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding-top: 15;
`
const Text = styled.Text`
  font-family: "GmarketBold";

  margin-top: 5;
`
const SubText = styled.Text`
  color: black;
  font-size: 10;
  /*   font-family: "GmarketBold";
 */
`
const TextView = styled.View`
  /* height:35%; */
  margin-left: 5;
  margin-right: 5;
  padding-top: 10;
  background-color: rgba(255, 255, 255, 1);
  border: 0px;
  border-radius: 5;
  border-color: rgba(233, 236, 243, 1);
  /* height: 30%; */
`
const LeftView = styled.View`
  justify-content: flex-start;
  align-items: flex-start;
  /* background-color: rgba(233, 236, 243, 1); */
  padding-left: 10;
`
const ChartView = styled.View`
  border: 1px;
  border-radius: 5;
  border-color: rgba(233, 236, 243, 1);
  margin-left: 15;
  margin-right: 15;
  width: 95%;
  height: 10%;
  justify-content: center;
`
const MainView = styled.View`
  background-color: rgba(255, 255, 255, 1);
  /* justify-content: center;
  align-items: center; */
  /* flex-direction: row; */
  width: 95%;
`
const TextCenter = styled.View`
  align-items: center;
  background-color: rgba(255, 255, 255, 1);
  margin-bottom: 10;
`
const ChartTextView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 1);
`
const SubText2 = styled.Text`
  color: black;
  font-size: 10;
  font-family: "GmarketBold";
`
const ExistTimeText = styled.Text`
  color: rgba(34, 76, 126, 1);
  font-size: 20;
  font-family: "GmarketBold";
`
const ExistText = styled.Text`
  color: grey;
  font-size: 20;
  font-family: "GmarketBold";
`
const TargetText = styled.Text`
  color: grey;
  font-size: 10;
  font-family: "GmarketBold";
`

const FlexBox = styled.View`
  flex-direction: row;
`

const TimeView = styled.View`
  /* height:35%; */
  margin-top: 5;
  margin-bottom: 5;
  padding-bottom: 5;
  padding-top: 5;
  background-color: rgba(255, 255, 255, 1);
  border: 1px;
  border-radius: 5;
  border-color: rgba(233, 236, 243, 1);
  width: 100%;
`
const SubView2 = styled.View`
  background-color: rgba(255, 255, 255, 1);
  justify-content: center;
  align-items: center;
  border: 1px;
  border-radius: 5;
  border-color: rgba(233, 236, 243, 1);
  width: 100%;
`

const Text1 = styled.Text`
  font-size: 10;
`

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})
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
}) => {
  const [expoPushToken, setExpoPushToken] = useState("")
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()
  taskArray_pre = new Array(24).fill(0)

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

  const onGoWith = async (list) => {
    try {
      const {
        data: { goWith },
      } = await goWithMutation({
        variables: {
          followDateId: list.followDateId,
          goWithBool: !list.goWith,
        },
      })
      if (!goWith) {
        Alert.alert("동행 정보를 변경할 수 없습니다.")
      }
    } catch (e) {
      console.log(e)
    }
  }
  const [studyBool, setStudyBool] = useState(false)

  // if (nowEnd == moment(now).format("hh:mma")) {
  //   noti()
  // }
  // setInterval(() => {
  //   if (nowEnd === moment(new Date().format("hh:mma"))) {
  //     noti()
  //   }
  // }, 60000)
  useEffect(() => {
    // console.log(next_TimeText, "nowTitle1,")
    // console.log(break_countdown, "break_countdown,")
    // console.log(break_time, "break_time")
    // noti()
  }, [])
  return (
    <ScrollView>
      <MainTView>
        <ChartView>
          {/* <D_day myData={myData.studyDefaultSet} editStudySetMutation={editStudySetMutation} /> */}
          <ChartTextView>
            <ExistTimeText>{hour < 10 ? `0${hour}` : hour}</ExistTimeText>
            <ExistText>시간 </ExistText>
            <ExistTimeText>
              {minutes - hour * 60 < 10 ? `0${minutes - hour * 60}` : minutes - hour * 60}
            </ExistTimeText>
            <ExistText>분 </ExistText>
            <ExistText>/</ExistText>
            <FlexBox>
              <TargetText>{targethour < 10 ? `0${targethour}` : targethour}</TargetText>
              <TargetText>시간 </TargetText>
              <TargetText>
                {targetminutes - targethour * 60 < 10
                  ? `0${targetminutes - targethour * 60}`
                  : targetminutes - targethour * 60}
              </TargetText>
              <TargetText>분 </TargetText>
            </FlexBox>
          </ChartTextView>
        </ChartView>
        <MainView>
          <TimeView>
            <TextCenter>
              <SubText2>{nowTitle1}</SubText2>
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
          </TimeView>
          {/* <SubView>
          <SubText2>{break_title}</SubText2>
          {break_countdown == 0 ? (
            <>
              <Text1>{break_time}</Text1>
              <Text1 />
            </>
          ) : (
            <>
              <RedText>
                {Math.floor(break_countdown / 3600000)}시간{" "}
                {Math.floor(break_countdown / 60000) % 60}분 남음
              </RedText>
              <Text1>{break_time}</Text1>
            </>
          )}
        </SubView> */}
          <SubView2>
            <FlexBox>
              <SubText2>{nextTitle1}</SubText2>
              <Text1> {nextTitle2}</Text1>
            </FlexBox>
            <Text1>{next_TimeText}</Text1>
          </SubView2>
        </MainView>
        <TextView>
          {/* <LeftView>
            <SubText>24시 성취율(%)</SubText>
            </LeftView> */}
          <VTodayBar
            taskArray={taskArray}
            taskArray_pre={taskArray_pre}
            // ylength={Math.max.apply(null, taskArray)}
            ylength={69.99}
            title={"시간별 Real 시간"}
            title_y={"Real 시간(분)"}
          />
        </TextView>
      </MainTView>
    </ScrollView>
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
