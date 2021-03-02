import React, { useState, useEffect } from "react"
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  Platform,
  Dimensions,
  ScrollView,
  RefreshControl,
} from "react-native"
import styled from "styled-components"
import styles from "../../styles"
import { Ionicons } from "@expo/vector-icons"
import HandleLogout from "../Auth/HandleLogout"
import Modal from "react-native-modal"
import AuthInput from "../../components/AuthInput"
import Icon from "../../components/Icon"
import LastWidth from "../../components/LastWidth"
import AuthButton from "../../components/AuthButton"
import { Container, Header, Content, Button, Text, Row } from "native-base"
import constants from "../../constants"
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")

const ProfileHeader2 = styled.View`
  width: ${constants.width / 1.7};
  flex: 1;
`
// const MainView = styled.View`
//   align-items: center;
//   background-color: rgba(255, 255, 255, 1);
// `
const IndiviList1 = styled.View`
  align-items: center;

  /* background-color: ${(props) => (props.isOdd ? "#FAFAFA" : "#c7c7c7")}; */
`
const Bold2 = styled.Text`
  font-size: 18;
  font-family: "GmarketBold";
`
const Bold3 = styled.Text`
  font-size: 15;
  font-family: "GmarketMedium";
`
const SeatView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const ProfileHeader = styled.View`
  padding: 20px;
  justify-content: space-between;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 20;
  margin-left: 20;
  margin-right: 20;
`
const MainView = styled.View`
  align-items: center;
  /* background-color: rgba(255, 255, 255, 1); */
`
const MainView2 = styled.View`
  background-color: rgba(233, 237, 244, 1);
`
const MainView21 = styled.View`
  flex: 1;
  background-color: rgba(255, 255, 255, 1);
`
const Stat2 = styled.View`
  width: ${constants.width / 5};
  align-items: center;
  /* margin-left: 30;
  margin-right: 10;
  margin-top: 10;
  margin-bottom: 10; */
  /* background-color: rgba(255, 255, 255, 1); */
`
const LineView = styled.View`
  /* margin-bottom: 15px; */
  /* margin-top: 0px; */
  width: ${constants.width / 1};
  height: 0.5px;
  margin-top: 5px;
  margin-bottom: 5px;
  background-color: grey;
`
const Stat3 = styled.View`
  flex-direction: row;
  flex: 1;
  justify-content: center;
`
const AdView = styled.View`
  flex-direction: row;
  justify-content: center;
  /* margin-top: 15; */
  width: ${constants.width / 1.5};
  height: ${constants.height / 25};
`
const AdView2 = styled.View`
  justify-content: flex-start;
  align-items: flex-start;
  width: ${constants.width / 1.1};
  height: ${constants.height / 9.5};
  border-width: 0;
  border-color: rgba(196, 196, 196, 1);
`
const QrView = styled.View`
  flex-direction: row;
  justify-content: center;
`
const Stat4 = styled.View`
  flex: 1.5;
  justify-content: center;
`
const Stat5 = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const Bold = styled.Text`
  font-size: 20;
  font-family: "GmarketBold";
`
const TotalTimeBold = styled.Text`
  font-size: 25;
  font-family: "GmarketBold";
  color: #0f4c82;
  margin-top: 5;
`
//   font-family: "GmarketBold";

const StatName = styled.Text`
  font-size: 15;
  font-family: "GmarketMedium";

  color: ${styles.darkGreyColor};
  margin-left: 8;
  margin-right: 8;
`
const StatName2 = styled.Text`
  font-size: 15;
  font-family: "GmarketBold";
`

const ProfileMeta = styled.View`
  margin-top: 20;
`
const Setting = styled.View`
  margin-top: 25;
  /* margin-right: 25; */
  padding-left: 15;
  margin-bottom: 0;
  justify-content: center;
  align-items: flex-start;
`
const ProfileMeta2 = styled.View``
const BlueView = styled.View`
  background-color: rgba(34, 76, 126, 1);
  height: 2;
`
const View = styled.View`
  background-color: rgba(237, 237, 239, 1);
  height: 1;
`
// const StyledModalContainer = styled.View`
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   /* 모달창 크기 조절 */
//   flex: 0.5;
//   width: 300;
//   background-color: rgba(255, 255, 255, 1);
//   border-radius: 10px;
// `
const ProfileBox = styled.View`
  flex-direction: row;
`
const Box = styled.View`
  align-items: center;
`
const StyledModalContainer = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;

  /* 모달창 크기 조절 */
  flex: 0.65;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
`
const ModalSubView = styled.View`
  flex: 0.15;
  align-items: center;
  justify-content: center;
`
const CoText = styled.Text`
  color: black;
  font-size: 20;
  font-weight: normal;
  font-family: "GmarketMedium";
`
const ModalSubView2 = styled.View`
  flex: 0.8;
  width: ${WIDTH / 1.15};
  align-items: center;
  justify-content: center;
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
const TaskFlagView = styled.View`
  width: 30%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const PostView = styled.View`
  flex-direction: row;
  margin-top: 10;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  width: ${constants.width / 1};
`
const PostStyle = styled.View`
  margin-left: 5;
`
const ModalView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const UserDetailPresenter = ({
  data,
  navigation,
  modalVisible2,
  setModalVisible2,
  modalVisible,
  setModalVisible,
  refreshing,
  onRefresh,
  addFollowMuation,
  unFollowMuation,
  refetch,
  myname,
}) => {
  let existTime_sec = 0
  data.seeUser.times.forEach((time) => {
    existTime_sec += time.existTime
  })
  let existTime_min = existTime_sec / 60
  const total_hour = String(Math.floor(existTime_min / 60))
  existTime_min = existTime_min - total_hour * 60
  const total_min = String(Math.floor(existTime_min))
  const onFollow = async (id) => {
    try {
      const {
        data: { follow },
      } = await addFollowMuation({
        variables: { id },
      })
      if (!follow) {
        Alert.alert("팔로우를 추가할 수 없습니다.")
      } else {
        await refetch()
      }
    } catch (e) {
      console.log(e)
    }
  }

  const onUnFollow = async (id) => {
    try {
      const {
        data: { unfollow },
      } = await unFollowMuation({
        variables: { id },
      })
      if (!unfollow) {
        Alert.alert("팔로우를 취소할 수 없습니다.")
      } else {
        await refetch()
      }
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    // console.log(data.seeUser.posts, "data.seeUser.posts")
  }, [])
  return (
    <>
      <MainView2>
        {Platform.OS == "ios" ? (
          <StatusBar barStyle="dark-content" />
        ) : (
          <StatusBar barStyle="light-content" />
        )}
        <Setting>
          <TouchableOpacity onPress={() => navigation.navigate("TabNavigation")}>
            <Icon
              name={Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"}
              color={"#000000"}
              size={40}
            />
          </TouchableOpacity>
        </Setting>

        <MainView>
          <ProfileHeader>
            <ProfileBox>
              <Box>
                <Image
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 70,
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                  source={{ uri: data.seeUser.avatar }}
                />
              </Box>
              <Box>
                <ProfileMeta>
                  <QrView>
                    <Bold>{data.seeUser.username} </Bold>
                  </QrView>
                </ProfileMeta>
                <ProfileMeta>
                  <StatName>{data.seeUser.email}</StatName>
                </ProfileMeta>
                <AdView>
                  {data.seeUser.studyGroup === "해당 없음" ? (
                    <Stat5>
                      <StatName>{data.seeUser.studyPurpose}</StatName>
                    </Stat5>
                  ) : (
                    <Stat5>
                      <StatName>{data.seeUser.studyGroup}</StatName>
                    </Stat5>
                  )}
                  {data.seeUser.studyGroup2 === "해당 없음" ? null : (
                    <Stat5>
                      <StatName>{data.seeUser.studyGroup2}</StatName>
                    </Stat5>
                  )}
                  {data.seeUser.studyGroup3 === "해당 없음" ? null : (
                    <Stat5>
                      <StatName>{data.seeUser.studyGroup3}</StatName>
                    </Stat5>
                  )}
                </AdView>
              </Box>
            </ProfileBox>
            <LineView />
            <StatName2>총 학습 시간</StatName2>
            <TotalTimeBold>
              {total_hour.length === 1 ? "0" + total_hour : total_hour} :{" "}
              {total_min.length === 1 ? "0" + total_min : total_min}
            </TotalTimeBold>
            <LineView />
            <AdView2>
              <Bold3>{data.seeUser.bio}</Bold3>
            </AdView2>
            <LineView />
            <AdView>
              <Stat5>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(true)
                  }}
                >
                  <Bold2>팔로워 {data.seeUser.followersCount}</Bold2>
                </TouchableOpacity>
              </Stat5>
              <Stat5>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible2(true)
                  }}
                >
                  <Bold2>팔로잉 {data.seeUser.followingCount}</Bold2>
                </TouchableOpacity>
              </Stat5>
            </AdView>
          </ProfileHeader>

          <View />
          {/* 내 포스트 !!!!!!!!!! */}
          {/* <PostView>
            {data.seeUser.posts.map((list) => (
              <TouchableOpacity
                key={list.id}
                onPress={() => {
                  navigation.navigate("MyPostlScreen", { item: list.id })
                }}
              >
                <Image
                  key={list.id}
                  style={{
                    height: constants.width / 3.5,
                    width: constants.width / 3.5,
                    marginLeft: 10,
                    marginTop: 10,
                    borderRadius: 10,
                  }}
                  source={{ uri: list.files[0].url }}
                />
              </TouchableOpacity>
              //<MainScreen key={list.id} item={list} />
            ))}
          </PostView> */}
        </MainView>
        {/* <Post /> */}
        {/* <ProfileMeta>
            <TouchableOpacity
              onPress={() => {
                toggleModal()
              }}
            >
              <Bold>Meta 연결</Bold>
            </TouchableOpacity>
          </ProfileMeta>
          <ProfileMeta>
            <TouchableOpacity
              onPress={() => {
                toggleModal2()
              }}
            >
              <Bold>Meta 해제</Bold>
            </TouchableOpacity>
          </ProfileMeta> */}
        {/* <Stat2>
          <Ionicons
            name={Platform.OS === "ios" ? "ios-qr-scanner" : "md-qr-scanner"}
            color={"#0F4C82"}
            size={20}
          />
          <TouchableOpacity onPress={() => navigation.navigate("QRcode")}>
            <StatName>QR코드 </StatName>
          </TouchableOpacity>
        </Stat2> */}
      </MainView2>
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
              <CoText>팔로워</CoText>
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
                {data.seeUser.followers.map((list) => (
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
                    {myname == list.username ? (
                      <TaskFlagView />
                    ) : (
                      <TaskFlagView>
                        {list.isFollowing ? (
                          <AuthButton
                            onPress={() => {
                              onUnFollow(list.id)
                            }}
                            text="팔로잉"
                            color="black"
                            bgColor={"#c7c7c7"}
                            paddingArray={Platform.OS === "ios" ? [10, 10, 10, 10] : [7, 7, 7, 7]}
                            widthRatio={LastWidth(1.5, 2.5, 18)}
                          />
                        ) : (
                          <AuthButton
                            onPress={() => {
                              onFollow(list.id)
                            }}
                            text="팔로우"
                            color="white"
                            bgColor={"#7BA9EB"}
                            paddingArray={Platform.OS === "ios" ? [10, 10, 10, 10] : [7, 7, 7, 7]}
                            widthRatio={LastWidth(1.5, 2.5, 18)}
                          />
                        )}
                      </TaskFlagView>
                    )}
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
      <Modal
        isVisible={modalVisible2}
        onBackdropPress={() => setModalVisible2(false)}
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
              <CoText>팔로잉</CoText>
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
                {data.seeUser.following.map((list) => (
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
                    {myname == list.username ? (
                      <TaskFlagView />
                    ) : (
                      <TaskFlagView>
                        {list.isFollowing ? (
                          <AuthButton
                            onPress={() => {
                              onUnFollow(list.id)
                            }}
                            text="팔로잉"
                            color="black"
                            bgColor={"#c7c7c7"}
                            paddingArray={Platform.OS === "ios" ? [10, 10, 10, 10] : [7, 7, 7, 7]}
                            widthRatio={LastWidth(1.5, 2.5, 18)}
                          />
                        ) : (
                          <AuthButton
                            onPress={() => {
                              onFollow(list.id)
                            }}
                            text="팔로우"
                            color="white"
                            bgColor={"#7BA9EB"}
                            paddingArray={Platform.OS === "ios" ? [10, 10, 10, 10] : [7, 7, 7, 7]}
                            widthRatio={LastWidth(1.5, 2.5, 18)}
                          />
                        )}
                      </TaskFlagView>
                    )}
                  </IndiviListView>
                ))}
              </ScrollView>
              <IndiviList1>
                <AuthButton
                  onPress={() => {
                    setModalVisible2(false)
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
const buttonStyle = StyleSheet.create({
  container: {
    backgroundColor: "rgba(233, 237, 244, 1)",
    alignSelf: "center",
    justifyContent: "center",
    width: 90,
    height: 35,
  },
})
export default UserDetailPresenter
