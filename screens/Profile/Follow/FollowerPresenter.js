import React, { useState, useEffect } from "react"
import {
  Image,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Alert,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native"
import styled from "styled-components"
import AuthButton from "../../../components/AuthButton"
import LastWidth from "../../../components/LastWidth"

const MainView = styled.View`
  background-color: rgba(255, 255, 255, 1);
  /* height: 100%;
  width: 100%; */
`
const AddToDoView = styled.View`
  height: 0.3%;
  flex-direction: row;
  margin-left: 5;
  margin-right: 5;
  margin-top: 20;
  align-items: center;
  justify-content: center;
`

const ListView = styled.View`
  background-color: rgba(255, 255, 255, 1);
  border-radius: 3;
  border-width: 2;
  border-color: rgba(196, 196, 196, 1);
  margin-left: 5;
  margin-right: 7;
  height: 89.7%;
`
const Widhi100 = styled.View`
  width: 100%;
`

const IndiviList = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: 50;
  margin-top: 10;
  margin-left: 4;
  margin-right: 4;
  /* border: 0.5px;
  border-color: rgba(196, 196, 196, 1); */

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
const FollowerName_Text = styled.Text`
  flex: 1;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 15;
  /* border-color: ${(props) => (props.isOdd ? "#c7c7c7" : "#FAFAFA")}; */
`
const FollowerName_Text1 = styled.Text`
  flex: 1;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 15;
  color: rgba(0, 0, 0, 0.5);
  /* border-color: ${(props) => (props.isOdd ? "#c7c7c7" : "#FAFAFA")}; */
`

const FollowwePresenter = ({
  data,
  navigation,
  raspberrySerial,
  onRegist,
  onUnRegist,
  onRefresh,
  refetch,
  loading,
  secretCode,
  onAddFollow,
  unFollowMuation,
  followMuation,
  refreshing,
}) => {
  useEffect(() => {
    // console.log(data.me.followDates, "10")
  }, [])
  // // 팔로우한 각 유저 데이터에 알맞은 createdAt 넣어주기(seeUser가 언제 팔로우 했는지)
  // for (let i = 0; i < data.me.followDates.length; i++) {
  //   const findUser = (a) => a.id === data.me.followDates[i].followId
  //   const tmpIndex = data.me.following.findIndex(findUser)
  //   const createdDate = new Date(data.me.followDates[i].createdAt)
  //   data.me.following[tmpIndex].followingTime = createdDate.getTime()
  // }
  // // 팔로우한 날짜 순으로 정렬 최신이 위로
  // data.me.following.sort(function (a, b) {
  //   return b.followingTime - a.followingTime
  // })

  // 팔로워 각 유저 데이터에 알맞은 createdAt 넣어주기(각 팔로워가 seeUser를 언제 팔로우 했는지)
  for (let i = 0; i < data.me.followers.length; i++) {
    const findSeeUser = (a) => a.followId === data.me.id
    const tmpIndex = data.me.followers[i].followDates.findIndex(findSeeUser)
    const createdDate = new Date(data.me.followers[i].followDates[tmpIndex].createdAt)
    data.me.followers[i].followerTime = createdDate.getTime()
  }
  // 팔로워가 seeUser를 팔로우한 날짜 순으로 정렬 최신이 위로
  data.me.followers.sort(function (a, b) {
    return b.followerTime - a.followerTime
  })

  // const onChangeLoad_ers = (index, bool) => {
  //   let newArr = [...followerLoad]
  //   newArr[index] = bool
  //   setFollowerLoad(newArr)
  // }
  // const onChangeLoad_ing = (index, bool) => {
  //   let newArr = [...followingLoad]
  //   newArr[index] = bool
  //   setFollowingLoad(newArr)
  // }

  const onFollow = async (id) => {
    try {
      // if (isFollowerBox) {
      //   onChangeLoad_ers(index, true)
      // } else {
      //   onChangeLoad_ing(index, true)
      // }
      const {
        data: { follow },
      } = await followMuation({
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
    // finally {
    //   if (isFollowerBox) {
    //     onChangeLoad_ers(index, false)
    //   } else {
    //     onChangeLoad_ing(index, false)
    //   }
    // }
  }

  const onUnFollow = async (id) => {
    // if (Alert.alert("정말로 팔로우를 취소하시겠습니까?") === false) {
    //   return
    // }

    try {
      // if (isFollowerBox) {
      //   onChangeLoad_ers(index, true)
      // } else {
      //   onChangeLoad_ing(index, true)
      // }
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
      // const realText = e.message.split("GraphQL error: ")
      console.log(e)
    }
    // finally {
    //   if (isFollowerBox) {
    //     onChangeLoad_ers(index, false)
    //   } else {
    //     onChangeLoad_ing(index, false)
    //   }
    // }
  }

  // const followerList = ({ data, index, style }) => {
  //   const indiUser = data.me.followers[index]

  //   return (
  //     <IndiviList key={index} style={style}>
  //       <Avatar
  //         size="sm"
  //         url={indiUser.avatar}
  //         onClick={() => {
  //           history.push(`${indiUser.username}`)
  //           data()
  //         }}
  //         cursor={"pointer"}
  //       />
  //       <IndiviName>
  //         {indiUser.email}
  //         <span>{indiUser.username}</span>
  //       </IndiviName>
  //       {!indiUser.isSelf && (
  //         <Button_custom
  //           text={indiUser.isFollowing ? "팔로잉" : "팔로우"}
  //           width={"60px"}
  //           height={"28px"}
  //           margin={"0 15px"}
  //           padding={"0"}
  //           bgColor={indiUser.isFollowing ? "#c7c7c7" : "#7BA9EB"}
  //           color={indiUser.isFollowing ? "black" : "white"}
  //           loading={followerLoad[index]}
  //           onClick={() => {
  //             if (indiUser.isFollowing) {
  //               onUnFollow(index, indiUser.id, true)
  //             } else {
  //               onFollow(index, indiUser.id, true)
  //             }
  //           }}
  //         />
  //       )}
  //     </IndiviList>
  //   )
  // }
  return (
    <>
      {Platform.OS == "ios" ? (
        <StatusBar barStyle="dark-content" />
      ) : (
        <StatusBar barStyle="light-content" />
      )}
      <MainView>
        <AddToDoView></AddToDoView>
        <ListView>
          <Widhi100>
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
              {data.me.followers.map((list) => (
                <IndiviList key={list.id}>
                  <FollowerView>
                    <Image
                      style={{
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                        marginTop: 0,
                        marginBottom: 0,
                      }}
                      source={{ uri: list.avatar }}
                    />
                  </FollowerView>
                  <FollowerNameView>
                    <FollowerName_Text> {list.email}</FollowerName_Text>
                    <FollowerName_Text1>{list.username}</FollowerName_Text1>
                  </FollowerNameView>
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
                </IndiviList>
              ))}
            </ScrollView>
          </Widhi100>
        </ListView>
      </MainView>
    </>
  )
}
const buttonStyle = StyleSheet.create({
  container: {
    backgroundColor: "rgba(123, 169, 234, 1)",
    alignSelf: "center",
    justifyContent: "center",
    width: 90,
    height: 35,
  },
})
export default FollowwePresenter
