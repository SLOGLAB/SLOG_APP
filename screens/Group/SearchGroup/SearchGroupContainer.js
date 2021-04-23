import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { useQuery } from "@apollo/react-hooks"
import { studyOption_group } from "../../../components/LongArray"
import SearchGroupPresenter from "./SearchGroupPresenter"
import { SEE_GROUP } from "./SearchGroupQueries"
import Loader from "../../../components/Loader"
import { TouchableOpacity } from "react-native-gesture-handler"
import Icon from "../../../components/Icon"
import { Container, Header, Content, CheckBox } from "native-base"
import RNPickerSelect from "react-native-picker-select"
import { Ionicons } from "@expo/vector-icons"
import { StyleSheet } from "react-native"
import constants from "../../../constants"

// studyOption_group
const MainView = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`
const TopView = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: center;
`
const TopView1 = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  /* background-color: rgba(234, 50, 35, 1); */
`
const FlexBox = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`
const FlexTouchBox = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`
const FlexBox2 = styled.View`
  flex: 1;
  justify-content: center;
  padding-left: 10;
`
const ButtonText = styled.Text`
  font-size: 15;
  margin-left: 5;
  margin-bottom: 3;
  font-family: "GmarketMedium";
`
const Button2Text = styled.Text`
  font-size: 15;
  margin-left: 5;
  margin-bottom: 3;
  font-family: "GmarketMedium";
  color: #ffffff;
`
const MainText = styled.Text`
  font-size: 17;
  font-family: "GmarketBold";

  color: #0f4c82;
`
const MainText2 = styled.Text`
  font-size: 17;
  font-family: "GmarketBold";

  color: #ffffff;
`
const CheckText = styled.Text`
  font-family: "GmarketMedium";
  font-size: 13;
  margin-left: 20;
  margin-right: 5;
  /* margin-top: 5; */
`
const StyledModalContainer = styled.View`
  flex-direction: column;
  align-items: center;
  /* 모달창 크기 조절 */
  flex: 0.7;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
`
const SelectView = styled.View`
  margin-bottom: 10;
  margin-left: 0;
  margin-top: 10;
  justify-content: flex-start;
`

const filterArray = ["최신순", "높은 출석률순"]
const filterArray_value = ["createdAt_DESC", "lastAttendance_DESC"]
const getOrder = filterArray.map((a, index) => {
  return { label: filterArray[index], value: filterArray_value[index] }
})

const getAll = studyOption_group.slice()
getAll.unshift({ label: "전체", value: "전체" })

//더보기 개수
export const feedTerm = 2

let groupData_Box = []

const SearchGroupContainer = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false)
  const [modlaOutMember, setmodlaOutMember] = useState(false)

  const [publicBool, setPublicBool] = useState(false)
  const [empty, setEmpty] = useState(false)
  const [first, setFirst] = useState(feedTerm)
  const [categoryData, setCategoryData] = useState(getAll[0].value)
  const [orderByData, setOrderByData] = useState(filterArray_value[0])
  const [category_tmp, setCategory_tmp] = useState(getAll[0].value)
  const [order_tmp, setOrder_tmp] = useState(getOrder[0].value)

  const [variables, setVariables] = useState({
    category: getAll[0],
    orderBy: filterArray_value[0],
    publicBool,
    empty,
    first,
  })
  const { data: groupData, refetch: groupRefetch, networkStatus: groupNetwork } = useQuery(
    SEE_GROUP,
    {
      variables,
      notifyOnNetworkStatusChange: true,
    }
  )

  const onRefresh = async () => {
    try {
      setRefreshing(true)
      await groupRefetch()
    } catch (e) {
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    setVariables({
      category: categoryData,
      orderBy: orderByData,
      publicBool,
      empty,
      first: feedTerm,
    })
    // 피드 개수 초기화
    setFirst(feedTerm)
  }, [categoryData, orderByData, publicBool, empty])

  // 더보기 할때만 개수 늘어나게 따로
  useEffect(() => {
    setVariables({
      category: categoryData,
      orderBy: orderByData,
      publicBool,
      empty,
      first,
    })
  }, [first])

  if (groupData !== undefined) {
    groupData_Box = groupData.seeGroup
  }

  return (
    <Container>
      <Header hasTabs>
        <TopView>
          <FlexBox2>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("TabNavigation")
              }}
            >
              <Icon
                name={Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"}
                color={"#000000"}
                size={40}
              />
            </TouchableOpacity>
          </FlexBox2>
          <FlexBox>
            {Platform.OS === "ios" ? (
              <MainText>그룹 검색</MainText>
            ) : (
              <MainText2>그룹 검색</MainText2>
            )}
          </FlexBox>
          <FlexTouchBox
            onPress={() => {
              navigation.navigate("CreateGroupContainer")
            }}
          >
            <Icon
              name={Platform.OS === "ios" ? "ios-add" : "md-add"}
              color={Platform.OS === "ios" ? "#000000" : "#ffffff"}
              size={30}
            />
            {Platform.OS === "ios" ? (
              <ButtonText>그룹 만들기</ButtonText>
            ) : (
              <Button2Text>그룹 만들기</Button2Text>
            )}
          </FlexTouchBox>
        </TopView>
      </Header>
      <Content>
        <SelectView style={{ width: constants.width / 1, flexDirection: "row" }}>
          <TopView>
            <RNPickerSelect
              onValueChange={(value) => {
                if (value !== null) {
                  setCategory_tmp(value)
                  if (Platform.OS !== "ios") {
                    setCategoryData(value)
                  }
                }
              }}
              onDonePress={() => {
                setCategoryData(category_tmp)
              }}
              items={getAll}
              value={category_tmp} //선택된 과목이 어떻게 들어가는지 봐야함
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
          </TopView>
          <TopView>
            <RNPickerSelect
              onValueChange={(value) => {
                if (value !== null) {
                  setOrder_tmp(value)
                  if (Platform.OS !== "ios") {
                    setOrderByData(value)
                  }
                }
              }}
              onDonePress={() => {
                setOrderByData(order_tmp)
              }}
              items={getOrder}
              value={order_tmp}
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
          </TopView>
          <FlexBox>
            <TopView1>
              <CheckBox
                checked={publicBool}
                onPress={() => {
                  setPublicBool(!publicBool)
                }}
              />
              <CheckText>공개</CheckText>
            </TopView1>
            <TopView1>
              <CheckBox
                checked={empty}
                onPress={() => {
                  setEmpty(!empty)
                }}
              />
              <CheckText>빈방</CheckText>
            </TopView1>
          </FlexBox>
        </SelectView>
        {/* {(groupNetwork === 1 || groupNetwork === 2) && (
          <MainView>
            <Loader />
          </MainView>
        )}
        {groupData !== undefined && (
          <SearchGroupPresenter
            groupData={groupData.seeGroup}
            groupRefetch={groupRefetch}
            navigation={navigation}
            refreshing={refreshing}
            setRefreshing={setRefreshing}
            onRefresh={onRefresh}
            modlaOutMember={modlaOutMember}
            setmodlaOutMember={setmodlaOutMember}
            first={first}
            setFirst={setFirst}
            feedTerm={feedTerm}
          />
        )} */}
        {groupNetwork === 1 ? (
          <MainView>
            <Loader />
          </MainView>
        ) : (
          <SearchGroupPresenter
            groupData={groupData_Box}
            groupRefetch={groupRefetch}
            navigation={navigation}
            refreshing={refreshing}
            setRefreshing={setRefreshing}
            onRefresh={onRefresh}
            modlaOutMember={modlaOutMember}
            setmodlaOutMember={setmodlaOutMember}
            first={first}
            setFirst={setFirst}
            feedTerm={feedTerm}
          />
        )}
      </Content>
    </Container>
  )
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    width: constants.width / 4,
  },
  inputAndroid: {
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    width: constants.width / 4,
  },
  seprator: {
    height: 10,
    width: 200,
    margin: 10,
  },
})

export default SearchGroupContainer
