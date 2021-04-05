import React, { useState, useEffect } from "react"
import { Alert, Image } from "react-native"
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler"
import styled from "styled-components"
import Icon from "../../../components/Icon"
import AuthButton from "../../../components/AuthButton"
import LastWidth from "../../../components/LastWidth"
import GroupSwiperBase from "../GroupStat/GroupSwiperBase"
import Modal from "react-native-modal"

const MainView = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: rgba(255, 255, 255, 1);
  border-width: 1;
`
const GroupBox = styled.View`
  flex: ${(props) => (props.not ? 0.6 : 0.05)};
  width: 100%;
  /* border-width: 1; */
  /* align-items: center; */
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
const BoxMainView = styled.View`
  justify-content: center;
  align-items: flex-start;
  flex: 1;
  /* border-width: 0.5; */
  /* padding: 10px; */
  margin-left: 1;
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
  height: 25;
`
const GroupText = styled.Text`
  font-family: "GmarketMedium";
  font-size: 13;
  margin-right: 5;
`
const GroupGreyText = styled.Text`
  font-family: "GmarketMedium";
  color: #c7c7c7;
  font-size: 13;
  margin-right: 5;
`
const RowGroup = styled.View`
  flex-direction: row;
`
const BoxView = styled.View`
  width: 100%;
  height: 25%;
  justify-content: center;
  /* background-color: rgba(196, 196, 196, 1); */
  flex-direction: row;
  border-top-width: 1;
  border-color: rgba(199, 199, 199, 1);
  padding-top: 10;
`
const PhotoCircle = styled.View`
  width: 200;
  border-radius: 50;
`
const dayArray = ["일", "월", "화", "수", "목", "금", "토"]

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
                <TouchableOpacity
                  onPress={() => {
                    // setModalPlayVisible(!modalPlayVisible)
                  }}
                >
                  <Icon
                    name={Platform.OS === "ios" ? "ios-calendar-sharp" : "md-calendar-sharp"}
                    size={30}
                  />
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
                ) : null}
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
      <BoxView>
        <Image
          source={{ uri: groupData.imgUrl }}
          style={{ width: 200, borderRadius: 0 }}
          resizeMode="contain"
        />
        <BoxMainView>
          <GroupName>{groupData.name}</GroupName>
          <RowGroup>
            <GroupGreyText>카테고리</GroupGreyText>
            <GroupText>{groupData.category}</GroupText>
          </RowGroup>
          <RowGroup>
            <GroupGreyText>활동 요일</GroupGreyText>

            <GroupText>
              {groupData.activeDay.findIndex((e) => e == false) == -1
                ? " 매일 "
                : groupData.activeDay.map((bool, index) => {
                    if (bool) {
                      if (index === groupData.activeDay.lastIndexOf(true)) {
                        return dayArray[index]
                      } else {
                        return dayArray[index] + ","
                      }
                    }
                  })}
            </GroupText>
          </RowGroup>
          <RowGroup>
            <GroupGreyText>하루 목표</GroupGreyText>
            <GroupText>{groupData.targetTime}시간</GroupText>
          </RowGroup>
          <RowGroup>
            <GroupGreyText>평균 학습량</GroupGreyText>
            <GroupText>{Math.floor(groupData.lastStudyTime)}시간</GroupText>
          </RowGroup>
          <RowGroup>
            <GroupGreyText>평균 출석률</GroupGreyText>
            <GroupText>{Math.floor(groupData.lastAttendance)}%</GroupText>
          </RowGroup>
          <RowGroup>
            <RowGroup>
              <GroupGreyText>인원</GroupGreyText>
              <GroupText>
                {groupData.memberCount}/{groupData.maxMember}
              </GroupText>
            </RowGroup>
            <RowGroup>
              <GroupGreyText>방장</GroupGreyText>
              <GroupText>{groupData.manager.username}</GroupText>
              {/* <GroupText>{groupData.publicBool ? "공개방" : "비공개방"}</GroupText> */}
            </RowGroup>
          </RowGroup>
        </BoxMainView>
      </BoxView>
      <GroupBox not={noti}>
        {noti ? (
          <ScrollView>
            <GroupGreyText>그룹 소개</GroupGreyText>
            <GroupText>{groupData.bio}</GroupText>
          </ScrollView>
        ) : null}
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
