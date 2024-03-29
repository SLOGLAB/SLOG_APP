import React, { useState, useEffect } from "react"
import { Image, StyleSheet, TouchableOpacity, StatusBar, Alert, Platform } from "react-native"
import styled from "styled-components"
import styles from "../../styles"
import { Ionicons } from "@expo/vector-icons"
import HandleLogout from "../Auth/HandleLogout"
import Modal from "react-native-modal"
import AuthInput from "../../components/AuthInput"
import Icon from "../../components/Icon"
import Post from "../../components/Post"
import { Container, Header, Content, Button, Text, Row } from "native-base"
import constants from "../../constants"
import BackButton from "../../components/BackButton"
const ProfileHeader2 = styled.View`
  width: ${constants.width / 1.7};
  flex: 1;
`
// const MainView = styled.View`
//   align-items: center;
//   background-color: rgba(255, 255, 255, 1);
// `
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
  padding: 0px;
  justify-content: space-between;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 0;

  margin-bottom: 45;
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
  font-size: 12;
  font-family: "GmarketMedium";

  color: ${styles.darkGreyColor};
  /* margin-left: 8;
  margin-right: 8; */
`
const StatName2 = styled.Text`
  font-size: 15;
  font-family: "GmarketBold";
`

const ProfileMeta = styled.View`
  margin-top: 20;
`

const View = styled.View`
  background-color: rgba(237, 237, 239, 1);
  height: 1;
`
const StyledModalContainer = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* 모달창 크기 조절 */
  flex: 0.5;
  width: 300;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
`
const ProfileBox = styled.View`
  /* border-radius: 20; */
  /* background-color: rgba(196, 196, 196, 1); */
  flex-direction: row;
`
const Box = styled.View`
  align-items: center;
`
const PostView = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  width: ${constants.width / 1};
`
const PostStyle = styled.View`
  margin-left: 5;
`
const Profiledetail = ({ data, navigation, raspberrySerial, onRegist, onUnRegist }) => {
  const [isModalVisible, isSetModalVisible] = useState(false)
  const [isModalVisible2, isSetModalVisible2] = useState(false)

  const toggleModal = () => {
    isSetModalVisible(!isModalVisible)
  }
  const toggleModal2 = () => {
    isSetModalVisible2(!isModalVisible2)
  }
  const QrcodeNavi = () => {
    isSetModalVisible(!isModalVisible)
    navigation.navigate("QRcode")
  }
  let existTime_sec = 0
  data.me.times.forEach((time) => {
    existTime_sec += time.existTime
  })
  let existTime_min = existTime_sec / 60
  const total_hour = String(Math.floor(existTime_min / 60))
  existTime_min = existTime_min - total_hour * 60
  const total_min = String(Math.floor(existTime_min))
  useEffect(() => {
    // console.log(data.me.posts, "data.me.posts")
  }, [])
  return (
    <>
      <Header hasTabs>
        <PostView>
          <BackButton />
        </PostView>
      </Header>
      <MainView2>
        {Platform.OS == "ios" ? (
          <StatusBar barStyle="dark-content" />
        ) : (
          <StatusBar barStyle="light-content" />
        )}
        {/* <Setting></Setting> */}

        <MainView>
          <ProfileHeader>
            <ProfileBox>
              <Box>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("PhotoNavigation")
                  }}
                >
                  <Image
                    style={{
                      height: 120,
                      width: 120,
                      borderRadius: 100,
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                    source={{ uri: data.me.avatar }}
                  />
                </TouchableOpacity>
              </Box>
              <Box>
                <ProfileMeta>
                  <QrView>
                    <Bold>{data.me.username} </Bold>
                    <TouchableOpacity onPress={() => navigation.navigate("EditAccount")}>
                      <Icon
                        name={Platform.OS === "ios" ? "ios-settings" : "md-settings"}
                        size={25}
                        color={"#262626"}
                      />
                    </TouchableOpacity>
                  </QrView>
                </ProfileMeta>
                <ProfileMeta>
                  <StatName>{data.me.email}</StatName>
                </ProfileMeta>
                <AdView>
                  {data.me.studyGroup === "해당 없음" ? (
                    <Stat5>
                      <StatName>{data.me.studyPurpose}</StatName>
                    </Stat5>
                  ) : (
                    <Stat5>
                      <StatName>{data.me.studyGroup}</StatName>
                    </Stat5>
                  )}
                  {data.me.studyGroup2 === "해당 없음" ? null : (
                    <Stat5>
                      <StatName>{data.me.studyGroup2}</StatName>
                    </Stat5>
                  )}
                  {data.me.studyGroup3 === "해당 없음" ? null : (
                    <Stat5>
                      <StatName>{data.me.studyGroup3}</StatName>
                    </Stat5>
                  )}
                </AdView>
                <AdView>
                  {/* <Stat5>
                <Bold2>게시물 {data.me.posts.length}</Bold2>
              </Stat5> */}
                  <Stat5>
                    <TouchableOpacity onPress={() => navigation.navigate("FollowSwiper")}>
                      <Bold2>팔로워 {data.me.followersCount}</Bold2>
                    </TouchableOpacity>
                  </Stat5>
                  <Stat5>
                    <TouchableOpacity onPress={() => navigation.navigate("FollowSwiper")}>
                      <Bold2>팔로잉 {data.me.followingCount}</Bold2>
                    </TouchableOpacity>
                  </Stat5>
                </AdView>
              </Box>
            </ProfileBox>
            <LineView />
            <AdView2>
              <Bold3>{data.me.bio}</Bold3>
            </AdView2>
            <LineView />
            <StatName2>총 학습 시간</StatName2>
            <TotalTimeBold>
              {total_hour.length === 1 ? "0" + total_hour : total_hour} :{" "}
              {total_min.length === 1 ? "0" + total_min : total_min}
            </TotalTimeBold>
            <LineView />
          </ProfileHeader>
          <HandleLogout />

          <View />
          {/* 내 포스트 !!!!!!!!!! */}
          {/* <PostView>
            {data.me.posts.map((list) => (
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

        <Modal
          isVisible={isModalVisible2}
          onBackdropPress={() => isSetModalVisible(false)}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <StyledModalContainer>
            <MainView21>
              <Stat4>
                <ProfileHeader2>
                  <SeatView>
                    <Bold2>Meta 해제</Bold2>
                  </SeatView>
                  {/* <Stat4>
                  <Bold>기관명 :</Bold>
                  <Bold>{data.me.organization?.name}</Bold>
                  <Bold>관리자 연락처 :</Bold>

                  <Bold></Bold>

                  <Bold>좌석번호 :</Bold>

                  <Bold>{data.me.raspberry?.seatNumber}</Bold>
                </Stat4> */}
                </ProfileHeader2>
              </Stat4>

              <Stat3>
                <SeatView>
                  <Button
                    style={buttonStyle.container}
                    onPress={() => {
                      Alert.alert(
                        // "독서실을 통한 IAM 서비스가 중단됩니다.",
                        // "그래도 좌석을 해제하시겠습니까?",
                        "Meta을 통한 IAM 서비스가 중단됩니다.",
                        "그래도 해제하시겠습니까?",
                        [
                          {
                            text: "Cancel",
                            style: "cancel",
                          },
                          {
                            text: "OK",
                            onPress: () => {
                              let organizationNonExist = false
                              if (data.me.organization === null) {
                                organizationNonExist = true
                              }
                              onUnRegist(organizationNonExist)
                            },
                          },
                        ],
                        { cancelable: false }
                      )
                    }}
                  >
                    <Text style={{ color: "black" }}>해제</Text>
                  </Button>
                </SeatView>
                <SeatView>
                  <Button
                    style={buttonStyle.container}
                    onPress={() => {
                      toggleModal2()
                    }}
                  >
                    <Text style={{ color: "black" }}>닫기</Text>
                  </Button>
                </SeatView>
              </Stat3>
            </MainView21>
          </StyledModalContainer>
        </Modal>
        {/* /////////////////////////// */}
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => isSetModalVisible(false)}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <StyledModalContainer>
            <MainView21>
              <Stat4>
                <SeatView>
                  <Bold2>Meta 연결</Bold2>
                </SeatView>
                <AuthInput
                  {...raspberrySerial}
                  // value={name}
                  placeholder={"시리얼 넘버(예:a0001-a01-a0001)"}
                  keyboardType="default"
                  returnKeyType="send"
                  // onSubmitEditing={handleLogin}
                  autoCorrect={false}
                />
                {/* <AuthInput
                {...secretCode}
                // value={name}
                placeholder={"가입번호(예:123456)"}
                keyboardType="email-address"
                returnKeyType="send"
                // onSubmitEditing={handleLogin}
                autoCorrect={false}
              /> */}
                <QrView>
                  <Ionicons
                    name={Platform.OS === "ios" ? "ios-qr-scanner" : "md-qr-scanner"}
                    color={"#0F4C82"}
                    size={20}
                  />
                  <TouchableOpacity onPress={() => QrcodeNavi()}>
                    <StatName>QR코드 </StatName>
                  </TouchableOpacity>
                </QrView>
              </Stat4>
              <Stat3>
                <SeatView>
                  <Button
                    style={buttonStyle.container}
                    onPress={() => {
                      onRegist()
                    }}
                  >
                    <Text style={{ color: "black" }}>연결</Text>
                  </Button>
                </SeatView>
                <SeatView>
                  <Button
                    style={buttonStyle.container}
                    onPress={() => {
                      toggleModal()
                    }}
                  >
                    <Text style={{ color: "black" }}>닫기</Text>
                  </Button>
                </SeatView>
              </Stat3>
            </MainView21>
          </StyledModalContainer>
        </Modal>
      </MainView2>
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
export default Profiledetail
