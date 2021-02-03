import React, { useState, useEffect } from "react"
import { Image, StyleSheet, Alert, Platform, ScrollView, RefreshControl } from "react-native"
import styled from "styled-components"
import AuthButton from "../../../components/AuthButton"
import AuthInput from "../../../components/AuthInput"
import LastWidth from "../../../components/LastWidth"

const MainView = styled.View`
  background-color: rgba(255, 255, 255, 1);
  /* height: 100%;
  width: 100%; */
`
const AddToDoView = styled.View`
  height: 8%;
  flex-direction: row;
  /* margin-left: 5;
  margin-right: 5; */
  margin-top: 20;
  align-items: center;
  justify-content: center;
`

const AddToDoNameView = styled.View`
  height: 100%;
  width: 60%;
  padding-left: 6;
`
const AddToDoButtonView = styled.View`
  height: 100%;
  width: 15%;
  margin-right: 0;
`
const ListView = styled.View`
  background-color: rgba(255, 255, 255, 1);
  border-radius: 3;
  border-width: 2;
  border-color: rgba(196, 196, 196, 1);
  margin-left: 5;
  margin-right: 7;
  height: 83%;
`
const Widhi100 = styled.View`
  width: 100%;
`

const ListsView = styled.View``
//
//
const IndiviList = styled.View`
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
const FollowerName_Text = styled.Text`
  flex: 1;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 15;
  font-family: "GmarketMedium";

  /* border-color: ${(props) => (props.isOdd ? "#c7c7c7" : "#FAFAFA")}; */
`
const FollowerName_Text1 = styled.Text`
  flex: 1;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 15;
  color: rgba(0, 0, 0, 0.5);
  font-family: "GmarketMedium";

  /* border-color: ${(props) => (props.isOdd ? "#c7c7c7" : "#FAFAFA")}; */
`
const FollowingPresenter = ({
  data,
  onRefresh,
  unFollowMuation,
  followMuation,
  refreshing,
  followInput,
  navigation,
  loading,
  secretCode,
  onAddFollow,
  goWithMutation,
  refetch,
}) => {
  useEffect(() => {}, [])

  // 팔로우한 각 유저 데이터에 알맞은 createdAt 넣어주기(seeUser가 언제 팔로우 했는지)
  for (let i = 0; i < data.me.followDates.length; i++) {
    const findUser = (a) => a.id === data.me.followDates[i].followId
    const tmpIndex = data.me.following.findIndex(findUser)
    const createdDate = new Date(data.me.followDates[i].createdAt)
    if (tmpIndex > -1) {
      data.me.following[tmpIndex].followingTime = createdDate.getTime()
      // 동행자인지 정보 넣어주기
      data.me.following[tmpIndex].goWith = data.me.followDates[i].goWith
      data.me.following[tmpIndex].followDateId = data.me.followDates[i].id
    }
  }
  // 팔로우한 날짜 순으로 정렬 최신이 위로
  data.me.following.sort(function (a, b) {
    return b.followingTime - a.followingTime
  })
  // const onGoWith = async (list) => {
  //   try {
  //     // onChangeLoad(index, true);
  //     const {
  //       data: { goWith },
  //     } = await goWithMutation({
  //       variables: {
  //         followDateId: list.followDateId,
  //         goWithBool: !list.goWith,
  //       },
  //     })
  //     if (!goWith) {
  //       console.log("동행 정보를 변경할 수 없습니다.")
  //     }
  //   } catch (e) {
  //     console.log(e)
  //   }
  //   // finally {
  //   //   onChangeLoad(index, false);
  //   // }
  // }
  const onFollow = async (id) => {
    try {
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
  // useEffect(() => {
  //   console.log(data.me.followersCount, "1")
  // }, [])
  return (
    <MainView>
      <AddToDoView>
        <AddToDoNameView>
          <AuthInput
            paddingArray={[8.5, 8.5, 8.5, 8.5]}
            {...followInput}
            // onChange={() => {}}
            placeholder="email 또는 닉네임.."
            keyboardType="email-address"
            returnKeyType="done"
            autoCorrect={false}
            widthRatio={1.8}
          />
        </AddToDoNameView>
        <AddToDoButtonView>
          <AuthButton
            color="white"
            onPress={() => {
              onAddFollow()
            }}
            text="팔로우"
            paddingArray={Platform.OS === "ios" ? [10, 10, 10, 10] : [7, 7, 7, 7]}
            widthRatio={LastWidth(1.5, 2.5, 18)}
          />
        </AddToDoButtonView>
      </AddToDoView>
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
            {data.me.following.map((list) => (
              <IndiviList key={list.id}>
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
                  <FollowerName_Text> {list.email}</FollowerName_Text>
                  <FollowerName_Text1>{list.username}</FollowerName_Text1>
                </FollowerNameView>
                <TaskFlagView>
                  {list.isFollowing ? (
                    <AuthButton
                      onPress={() => {
                        onUnFollow(list.id)
                        // onGoWith(list)
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
export default FollowingPresenter
