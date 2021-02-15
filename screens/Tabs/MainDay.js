import React, { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import VdayProgress from "../../graphsVictory/VdayProgress"
import VdayBar from "../../graphsVictory/VdayBar"
import {
  Alert,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
  Button,
} from "react-native"
import Barcharts from "../../graphs/BarCharts"
import Icon from "../../components/Icon"
import Modal from "react-native-modal"
import AuthButton from "../../components/AuthButton"
import LastWidth from "../../components/LastWidth"
import { gql } from "apollo-boost"
import { useMutation } from "@apollo/react-hooks"
import { EDIT_STUDYSET } from "../Tabs/QueryBox"
import { ME } from "./MainController"
import D_day from "../D_day"
import * as Notifications from "expo-notifications"
import * as Permissions from "expo-permissions"
import Constants from "expo-constants"
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")
import moment, { Moment } from "moment"
import StudyButton from "../../screens/Study/StudyButton"
const MainTView = styled.View`
  /* height:90%; */
  width: 100%;
`
const ChartView = styled.View`
  border: 2px;
  border-radius: 5;
  border-color: rgba(233, 236, 243, 1);
  margin-left: 5;
  margin-right: 5;
  margin-top: 10;
  /* height: 48%; */
`
const TextView = styled.View`
  /* height:35%; */
  margin-top: 10;
  margin-left: 5;
  margin-right: 5;
  background-color: rgba(255, 255, 255, 1);
  /* background-color: rgba(15, 76, 130, 1); */
  border: 2px;
  border-radius: 5;
  border-color: rgba(233, 236, 243, 1);
  /* height: 30%; */
`
const ProgressView = styled.View`
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 1);
`
const TextCenter = styled.View`
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 1);
  margin-bottom: 10;
`
const TimeView = styled.View`
  /* height:35%; */
  margin-left: 5;
  margin-right: 5;
  margin-top: 10;
  margin-bottom: 10;
  padding-bottom: 10;
  padding-top: 5;
  background-color: rgba(255, 255, 255, 1);
  border: 2px;
  border-radius: 5;
  border-color: rgba(233, 236, 243, 1);
`
const ChartTextView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 1);
  margin-bottom: 10;
`

const CoText = styled.Text`
  color: black;
  font-size: 20;
  font-weight: normal;
`
const SubText = styled.Text`
  color: black;
  font-family: "GmarketMedium";
  font-size: 10;
`
const SubText2 = styled.Text`
  color: black;
  font-size: 15;
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
  font-size: 15;
  font-family: "GmarketMedium";
`
const MainView = styled.View`
  background-color: rgba(255, 255, 255, 1);
  justify-content: center;
  align-items: center;
  flex-direction: row;
`

const SubView = styled.View`
  flex: 1;
  background-color: rgba(255, 255, 255, 1);
  justify-content: center;
  align-items: center;
  border: 2px;
  border-radius: 5;
  border-color: rgba(233, 236, 243, 1);
  margin-left: 5;
  margin-right: 5;
`
const SubView2 = styled.View`
  flex: 1;
  background-color: rgba(255, 255, 255, 1);
  justify-content: center;
  align-items: center;
  border: 2px;
  border-radius: 5;
  border-color: rgba(233, 236, 243, 1);
  margin-left: 5;
  margin-right: 5;
`
const Text = styled.Text`
  font-family: "GmarketBold";
  margin-top: 5;
  /* font-family: "Bemin"; */
`
const Text1 = styled.Text`
  font-family: "GmarketMedium";
`
const RedText = styled.Text`
  color: red;
`
const LeftView = styled.View`
  justify-content: flex-start;
  align-items: flex-start;
  /* background-color: rgba(233, 236, 243, 1); */
  padding-left: 10;
`
const AvatarView = styled.View`
  height: ${HEIGHT / 8};
  justify-content: center;
  align-items: flex-start;
`
//
const IndiviList = styled.View`
  justify-content: center;
  align-items: center;
  margin-left: 18;
  flex: 1;
  width: ${WIDTH / 6.5};
  /* background-color: ${(props) => (props.isOdd ? "#FAFAFA" : "#c7c7c7")}; */
`
const IndiviList1 = styled.View`
  align-items: center;

  /* background-color: ${(props) => (props.isOdd ? "#FAFAFA" : "#c7c7c7")}; */
`

const FollowerName_Text = styled.Text`
  font-size: 9;
  font-family: "GmarketMedium";
  /* border-color: ${(props) => (props.isOdd ? "#c7c7c7" : "#FAFAFA")}; */
`
const CircleAvartar = styled.View`
  height: ${HEIGHT / 32};
  width: ${WIDTH / 15};
  border: 2px;
  border-radius: 25;
`
const RowView = styled.View`
  /* flex-direction: row; */
  height: ${HEIGHT / 12.5};
  width: ${WIDTH / 7};
  border-radius: 30;
  position: absolute;
  justify-content: flex-end;
  align-items: flex-end;
`
const StyledModalContainer = styled.View`
  flex-direction: column;
  align-items: center;
  /* 모달창 크기 조절 */
  flex: 0.65;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
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
const ModalSubView2 = styled.View`
  flex: 0.8;
  width: ${WIDTH / 1.15};
`
const LineView = styled.View`
  width: ${WIDTH / 1.4};
  height: 2px;
  color: #000;
`
const IndiviListView = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: 50;
  margin-top: 10;
  margin-left: 4;
  margin-right: 4;
  /* background-color: ${(props) => (props.isOdd ? "#FAFAFA" : "#c7c7c7")}; */
`

const FollowerView = styled.View`
  width: 20%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const FollowerNameView = styled.View`
  width: 50%;
  justify-content: flex-start;
  align-items: flex-start;
`
const TaskFlagView = styled.View`
  width: 30%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const FollowerName_T = styled.Text`
  flex: 1;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 13;
  font-family: "GmarketMedium";

  /* border-color: ${(props) => (props.isOdd ? "#c7c7c7" : "#FAFAFA")}; */
`
const FollowerName_Text1 = styled.Text`
  flex: 1;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 13;
  color: rgba(0, 0, 0, 0.5);
  font-family: "GmarketMedium";

  /* border-color: ${(props) => (props.isOdd ? "#c7c7c7" : "#FAFAFA")}; */
`
const TextTimestyle = styled.Text`
  font-size: 12;
  color: rgba(15, 76, 130, 1);
  font-family: "GmarketMedium";

  /* border-color: ${(props) => (props.isOdd ? "#c7c7c7" : "#FAFAFA")}; */
`
const RowViewTime = styled.View`
  flex-direction: row;
`
const AvartarView = styled.View`
  flex: 0.75;
  /* background-color: rgba(196, 196, 196, 1); */
`
const AvartarView1 = styled.View`
  position: absolute;
  width: 10%;
  height: 20%;
  /* background-color: rgba(196, 196, 196, 1); */
`
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// })
// let a = undefined

const MainDay = ({
  nexistTime,
  myData,
  nowtarget,
  taskArray,
  donutPercent,
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
  onRefresh,
  goWithMutation,
  myInfoRefetch,
  modalVisible,
  setModalVisible,
  refreshing,
  setRefreshing,
  nowEnd,
}) => {
  const [expoPushToken, setExpoPushToken] = useState("")
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()

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
  useEffect(() => {}, [])
  return (
    <>
      <MainTView>
        <AvatarView>
          <ScrollView style={{ backgroundColor: "#ffffff" }} horizontal={true}>
            {/* <IndiviList1 /> */}
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <IndiviList>
                <RowViewTime>
                  <TextTimestyle>{hour < 10 ? `0${hour}` : hour}</TextTimestyle>
                  <TextTimestyle>:</TextTimestyle>
                  <TextTimestyle>
                    {minutes - hour * 60 < 10 ? `0${minutes - hour * 60}` : minutes - hour * 60}
                  </TextTimestyle>
                </RowViewTime>
                <AvartarView>
                  <Image
                    style={{
                      height: HEIGHT / 15,
                      width: HEIGHT / 15,
                      borderRadius: 30,
                      marginTop: 0,
                      marginBottom: 0,
                      borderWidth: 4.5,
                      borderColor: myData.existToggle
                        ? "rgba(107, 152, 247, 1)"
                        : "rgba(133, 133, 133, 1)",
                    }}
                    source={{ uri: myData.avatar }}
                  />
                </AvartarView>
                <RowView>
                  <Icon
                    name={Platform.OS === "ios" ? "ios-add-circle" : "md-add-circle"}
                    color={"rgba(15, 76, 130, 1)"}
                    size={20}
                  />
                </RowView>
                <FollowerName_Text>
                  {myData.username.length > 6
                    ? myData.username.substr(0, 5) + ".."
                    : myData.username}
                </FollowerName_Text>
              </IndiviList>
            </TouchableOpacity>

            {myData.withFollowing.map((list) => (
              <IndiviList key={list.id}>
                <TextTimestyle>
                  {Math.floor(list.todayTime.existTime / 3600) < 10
                    ? `0${Math.floor(list.todayTime.existTime / 3600)}`
                    : Math.floor(list.todayTime.existTime / 3600)}
                  :
                  {Math.floor(list.todayTime.existTime / 60) -
                    Math.floor(list.todayTime.existTime / 3600) * 60 <
                  10
                    ? `0${
                        Math.floor(list.todayTime.existTime / 60) -
                        Math.floor(list.todayTime.existTime / 3600) * 60
                      }`
                    : Math.floor(list.todayTime.existTime / 60) -
                      Math.floor(list.todayTime.existTime / 3600) * 60}
                </TextTimestyle>
                <AvartarView>
                  <Image
                    style={{
                      height: HEIGHT / 15,
                      width: HEIGHT / 15,
                      borderRadius: 30,
                      marginTop: 0,
                      marginBottom: 0,
                      borderWidth: 4.5,

                      borderColor: list.existToggle
                        ? "rgba(107, 152, 247, 1)"
                        : "rgba(133, 133, 133, 1)",
                    }}
                    source={{ uri: list.avatar }}
                  />
                </AvartarView>
                <FollowerName_Text>
                  {list.username.length > 6 ? list.username.substr(0, 5) + ".." : list.username}
                </FollowerName_Text>
              </IndiviList>
            ))}
            <IndiviList></IndiviList>
          </ScrollView>
        </AvatarView>
        {/* <AvartarView1> */}
        {/* {studyBool ? <Apps studyBool={studyBool} setStudyBool={setStudyBool} /> : null} */}
        {/* </AvartarView1> */}
        <TextView>
          <StudyButton />
        </TextView>

        <ChartView>
          <ProgressView>
            {/* {studyBool ? null : (
              <Button
                title="Start!!!"
                onPress={() => {
                  setStudyBool(!studyBool)
                }}
              />
            )} */}
            <TouchableOpacity onPress={onRefresh}>
              <VdayProgress number={donutPercent} />
            </TouchableOpacity>
          </ProgressView>
          <D_day myData={myData.studyDefaultSet} editStudySetMutation={editStudySetMutation} />

          <ChartTextView>
            <ExistTimeText>{hour < 10 ? `0${hour}` : hour}</ExistTimeText>
            <ExistText>시간 </ExistText>
            <ExistTimeText>
              {minutes - hour * 60 < 10 ? `0${minutes - hour * 60}` : minutes - hour * 60}
            </ExistTimeText>
            <ExistText>분 </ExistText>
            <ExistText>/</ExistText>

            <TargetText>{targethour < 10 ? `0${targethour}` : targethour}</TargetText>
            <TargetText>시간 </TargetText>
            <TargetText>
              {targetminutes - targethour * 60 < 10
                ? `0${targetminutes - targethour * 60}`
                : targetminutes - targethour * 60}
            </TargetText>
            <TargetText>분 </TargetText>
          </ChartTextView>
        </ChartView>

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
        <MainView>
          {/* <SubView>
            <Text>{break_title}</Text>
            {break_countdown == 0 ? (
              <Text1 />
            ) : (
              <RedText>
                {Math.floor(break_countdown / 3600000)}시간{" "}
                {Math.floor(break_countdown / 60000) % 60}분 남음
              </RedText>
            )}
            <Text1>{break_time}</Text1>
          </SubView> */}
          <SubView2>
            <Text>{nextTitle1}</Text>
            <Text1> {nextTitle2}</Text1>
            <Text1>{next_TimeText}</Text1>
          </SubView2>
        </MainView>
        <TextView>
          <LeftView>
            <Text>시간대별 Deep Time</Text>
            <SubText>24시 성취율(%)</SubText>
          </LeftView>
          <VdayBar taskArray={taskArray} />
        </TextView>
      </MainTView>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          minHeight: Math.round(Dimensions.get("window").height),
        }}
      >
        <StyledModalContainer>
          <ModalView>
            <ModalSubView>
              <CoText>동행자 관리</CoText>
            </ModalSubView>
            <LineView />
            <ModalSubView2>
              <ScrollView
                style={{ backgroundColor: "#ffffff" }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    style={{ backgroundColor: "#ffffff" }}
                  />
                }
              >
                {myData.following.map((list) => (
                  <IndiviListView key={list.id}>
                    <FollowerView>
                      <Image
                        style={{
                          height: 45,
                          width: 45,
                          borderRadius: 25,
                          marginTop: 0,
                          marginBottom: 0,
                        }}
                        source={{ uri: list.avatar }}
                      />
                    </FollowerView>
                    <FollowerNameView>
                      <FollowerName_T> {list.email}</FollowerName_T>
                      <FollowerName_Text1>{list.username}</FollowerName_Text1>
                    </FollowerNameView>
                    <TaskFlagView>
                      {list.goWith ? (
                        <AuthButton
                          onPress={() => {
                            onGoWith(list)
                          }}
                          text="동행중"
                          color="black"
                          bgColor={"#c7c7c7"}
                          paddingArray={Platform.OS === "ios" ? [10, 10, 10, 10] : [7, 7, 7, 7]}
                          widthRatio={LastWidth(1.5, 2.5, 18)}
                        />
                      ) : (
                        <AuthButton
                          onPress={() => {
                            onGoWith(list)
                          }}
                          text="동행"
                          color="white"
                          bgColor={"#7BA9EB"}
                          paddingArray={Platform.OS === "ios" ? [10, 10, 10, 10] : [7, 7, 7, 7]}
                          widthRatio={LastWidth(1.5, 2.5, 18)}
                        />
                      )}
                    </TaskFlagView>
                  </IndiviListView>
                ))}
              </ScrollView>
              <IndiviList1>
                <AuthButton
                  onPress={() => {
                    setModalVisible(false)
                  }}
                  text="닫기"
                  color="white"
                  bgColor={"#7BA9EB"}
                  widthRatio={LastWidth(1, 2, 18)}
                />
              </IndiviList1>
            </ModalSubView2>
          </ModalView>
        </StyledModalContainer>
      </Modal>
    </>
  )
}

export default MainDay
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
{
  /* <DayText>
          <MainView>
            <Image
              style={{ height: 40, width: 40, borderRadius: 20 }}
              source={{ uri: data.me.avatar }}
            />
          </MainView>

          <MainNameView>
            {data.me.existToggle ? (
              <CircleView style={{ backgroundColor: "#56BB37" }} />
            ) : (
              <CircleView style={{ backgroundColor: "black" }} />
            )}
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", marginLeft: 5 }}>
              {data.me.username}
            </Text>
          </MainNameView>
        </DayText> */
}
