import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { useQuery } from "@apollo/react-hooks"
import { SUBJECT_NAME } from "../Tabs/QueryBox"
import Loader from "../../components/Loader"
import AddTimeSchedule from "./TimeTableMenu/AddTimeSchedule"
import { gql } from "apollo-boost"
import { Container, Header, TabHeading, Content, Tabs, Text } from "native-base"
import { SafeAreaView, TouchableOpacity } from "react-native"
import Icon from "../../components/Icon"
import { Platform } from "react-native"

const MenuView = styled.View`
  flex: 1;
`
const MainView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
`
const SubView = styled.View`
  flex: 1;
  align-items: flex-end;
  justify-content: flex-start;
`
const SubView1 = styled.View`
  flex: 1;
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
export const ME = gql`
  {
    me {
      id
      studyPurpose
    }
  }
`
export const MY_TODOLIST = gql`
  query myTodolist {
    myTodolist {
      id
      name
      finish
      finishAt
      subject {
        id
        name
        bgColor
        bookMark
      }
    }
  }
`
export default AddTimetable = ({ navigation, clesesheetRefhi, setandroidSchedule }) => {
  const { loading, data: subjectsName, refetch } = useQuery(SUBJECT_NAME, {})
  const {
    data: todolistData,
    loading: todolistLoading,
    refetch: todolistRefetch,
  } = useQuery(MY_TODOLIST)
  const { data: myData, refetch: merefetch } = useQuery(ME)
  var todaydate = new Date().getDate() //Current Date
  var todaymonth = new Date().getMonth() + 1 //Current Month
  var todayyear = new Date().getFullYear() //Current Year
  var targetMonth = String(todaymonth).length === 1 ? "0" + todaymonth : todaymonth
  var targetDay = String(todaydate).length === 1 ? "0" + todaydate : todaydate

  var targetToday = todayyear + "-" + targetMonth + "-" + targetDay
  const [selectDate, setSelectDate] = useState(new Date())

  const goback = () => {
    navigation.navigate("TabNavigation")
  }
  useEffect(() => {
    merefetch()
    refetch()
  }, [])

  return (
    <MenuView>
      {loading || todolistLoading ? (
        <Loader />
      ) : (
        <>
          <Container>
            <Header hasTabs>
              <MainView>
                <SubView></SubView>
                <SubView1>
                  {Platform.OS === "ios" ? (
                    <MainText>스케줄 만들기</MainText>
                  ) : (
                    <MainText2>스케줄 만들기</MainText2>
                  )}
                </SubView1>
                <SubView>
                  <TouchableOpacity
                    onPress={() => {
                      if (Platform.OS == "android") {
                        setandroidSchedule()
                      } else {
                        clesesheetRefhi()
                      }
                    }}
                  >
                    <Icon
                      name={
                        Platform.OS === "ios"
                          ? "ios-close-circle-outline"
                          : "md-close-circle-outline"
                      }
                      size={25}
                      color={Platform.OS === "ios" ? "black" : "white"}
                    />
                  </TouchableOpacity>
                </SubView>
              </MainView>
            </Header>
            <Content>
              <AddTimeSchedule
                refetch={refetch}
                myData={myData}
                merefetch={merefetch}
                subjectsName={subjectsName}
                loading={loading}
                goback={goback}
                //
                targetToday={targetToday}
                todolistData={todolistData}
                todolistRefetch={todolistRefetch}
              />
            </Content>
          </Container>
        </>
      )}
    </MenuView>
  )
}
