import React, { useState, useEffect } from "react"
import { Alert } from "react-native"
import { TouchableOpacity, ScrollView, Dimensions } from "react-native-gesture-handler"
import styled from "styled-components"
import Icon from "../../../components/Icon"
import AuthButton from "../../../components/AuthButton"
import LastWidth from "../../../components/LastWidth"
import GroupSwiperBase from "../GroupStat/GroupSwiperBase"
import Modal from "react-native-modal"
import { not } from "react-native-reanimated"

const MainView = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: rgba(255, 255, 255, 1);
  border-width: 1;
`
const GroupBox = styled.View`
  flex: ${(props) => (props.not ? 0.6 : 0.3)};
  width: 100%;
  border-width: 1;
  justify-content: center;
  padding: 10px;
  border-color: rgba(196, 196, 196, 1);
  background-color: rgba(255, 255, 255, 1);
`
const LineView = styled.View`
  width: 100%;
  height: 5%;
`
const GroupName = styled.Text`
  font-family: "GmarketMedium";
  font-size: 18;
  /* margin-top: 5; */
  margin-bottom: 5;
`
const GroupCate = styled.Text`
  font-family: "GmarketMedium";
  color: rgba(34, 76, 126, 1);
`
const GroupText = styled.Text`
  font-family: "GmarketLight";
`
const BoxTopView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 10;
  padding-top: 10;
  width: 100%;
  margin-top: 25;
`
const BoxTopView2 = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-right: 10;
  width: 100%;
`
const BoxinView = styled.View`
  flex-direction: row;
  justify-content: center;
`
const BoxinButtonView = styled.View`
  margin-right: 15px;
`
const StyledPlayModalContainer = styled.View`
  flex-direction: column;
  align-items: center;
  /* 모달창 크기 조절 */
  flex: 0.4;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
`
const ModalView = styled.View`
  flex: 1;
  justify-content: center;
`
const Container = styled.TouchableOpacity`
  /* padding-right: 20px; */
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex: 1;
`
const CaretView = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
`

export default ({
  groupData,
  navigation,
  myData,
  Groupid,
  groupRefetch,
  loading,
  clearintervalrefetch,
  onDelete,
  onOut,
  modalPlayVisible,
  setModalPlayVisible,
  modlaOutMember,
  setmodlaOutMember,
  onOutMember,
  onBookmark,
  search,
  onJoin,
  MyGroupdata,
}) => {
  let list = []
  for (var i = 0; i < MyGroupdata.myGroup.length; i += 1) {
    var picked = MyGroupdata.myGroup[i].id
    list.push(picked)
  }
  let findmygroup = list.findIndex((e) => e == groupData.id)
  const [noti, setnoti] = useState(false)
  useEffect(() => {}, [])
  return (
    <MainView>
      <BoxTopView>
        {search ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SearchGroupContainer")
              clearintervalrefetch()
            }}
          >
            <Icon
              name={Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"}
              color={"#000000"}
              size={40}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("TabNavigation")
              clearintervalrefetch()
            }}
          >
            <Icon
              name={Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"}
              color={"#000000"}
              size={40}
            />
          </TouchableOpacity>
        )}
        <BoxinView>
          {findmygroup == -1 ? (
            <>
              <AuthButton
                onPress={() => {
                  onJoin(groupData.id)
                  navigation.navigate("TabNavigation")
                  clearintervalrefetch()
                }}
                text="가입하기"
                color="white"
                bgColor={"#CA5040"}
                widthRatio={LastWidth(1, 2, 5)}
              />
              <BoxinButtonView></BoxinButtonView>
            </>
          ) : (
            <>
              <BoxinButtonView>
                <TouchableOpacity
                  onPress={() => {
                    groupRefetch()
                  }}
                >
                  <Icon name={Platform.OS === "ios" ? "ios-refresh" : "md-refresh"} size={30} />
                </TouchableOpacity>
              </BoxinButtonView>
              <BoxinButtonView>
                {groupData.imManager ? (
                  <TouchableOpacity
                    onPress={() => {
                      setModalPlayVisible(!modalPlayVisible)
                    }}
                  >
                    <Icon name={Platform.OS === "ios" ? "ios-settings" : "md-settings"} size={30} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => {}}>
                    <Icon name={Platform.OS === "ios" ? "ios-settings" : "md-settings"} size={30} />
                  </TouchableOpacity>
                )}
              </BoxinButtonView>
              <BoxinButtonView>
                {groupData.imManager ? (
                  <TouchableOpacity
                    onPress={() => {
                      onDelete(groupData.id)
                      onBookmark(Groupid, false)
                      clearintervalrefetch()
                    }}
                  >
                    <Icon name={Platform.OS === "ios" ? "ios-trash" : "md-trash"} size={30} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      onOut(groupData.id)
                      onBookmark(Groupid, false)
                      clearintervalrefetch()
                    }}
                  >
                    <Icon name={Platform.OS === "ios" ? "ios-log-out" : "md-log-out"} size={30} />
                  </TouchableOpacity>
                )}
              </BoxinButtonView>
            </>
          )}
        </BoxinView>
      </BoxTopView>
      <GroupBox not={noti}>
        <BoxTopView2>
          <GroupCate>{groupData.category} </GroupCate>
          <GroupText>멤버 {groupData.memberCount}</GroupText>
        </BoxTopView2>
        <GroupName>{groupData.name}</GroupName>
        <GroupText>최소 학습 시간 : {groupData.targetTime}시간</GroupText>
        <ScrollView>
          <GroupText>{groupData.bio}</GroupText>
        </ScrollView>
        <CaretView>
          <TouchableOpacity
            onPress={() => {
              setnoti(!noti)
            }}
          >
            {noti ? (
              <Icon name={Platform.OS === "ios" ? "ios-arrow-up" : "md-arrow-up"} size={20} />
            ) : (
              <Icon name={Platform.OS === "ios" ? "ios-arrow-down" : "md-arrow-down"} size={20} />
            )}
          </TouchableOpacity>
        </CaretView>
      </GroupBox>
      <GroupSwiperBase
        groupData={groupData}
        groupRefetch={groupRefetch}
        loading={loading}
        navigation={navigation}
        myData={myData}
        modlaOutMember={modlaOutMember}
        setmodlaOutMember={setmodlaOutMember}
        onOutMember={onOutMember}
        Groupid={Groupid}
        search={search}
      />
      <Modal
        isVisible={modalPlayVisible}
        onBackdropPress={() => setModalPlayVisible(false)}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StyledPlayModalContainer>
          <ModalView>
            <Container>
              {groupData.imManager ? (
                <AuthButton
                  onPress={() => {
                    navigation.navigate("EditGroup", { id: groupData.id })
                    setModalPlayVisible(false)
                  }}
                  text="그룹 정보 수정"
                  color="white"
                  bgColor={"#7BA9EB"}
                  widthRatio={LastWidth(1, 2, 10)}
                />
              ) : null}
            </Container>
          </ModalView>
        </StyledPlayModalContainer>
      </Modal>
    </MainView>
  )
}
