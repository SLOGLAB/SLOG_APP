import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { useQuery } from "@apollo/react-hooks"
import { SUBJECT_NAME } from "../Tabs/QueryBox"
import Loader from "../../components/Loader"
import AddTimeSchedule from "./TimeTableMenu/AddTimeSchedule"
import { gql } from "apollo-boost"
import { Container, Header, TabHeading, Content, Tabs, Text } from "native-base"
import { SafeAreaView } from "react-native"
import BackButton from "../../components/BackButton"

const View1 = styled.View`
  flex: 1;
`
const View2 = styled.View`
  flex: 1;
  /* background-color: "#000000"; */
  flex-direction: row;
  justify-content: center;
`
const View3 = styled.View`
  flex: 0.5;
  /* background-color: "#000000"; */
  flex-direction: row;
  justify-content: center;
`

const TotalView = styled.View`
  flex: 1;
`
const Flex1View = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-left: 10;
`
const ModalView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const WeekView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`
const ModalText = styled.Text`
  font-size: 25;
  font-family: "GmarketBold";
`
const ModalTimeText = styled.Text`
  font-size: 15;
`
const StyledModalContainer = styled.View`
  flex-direction: column;
  align-items: center;
  /* 모달창 크기 조절 */
  width: 320px;
  height: 600px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
`
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
`
const SubView1 = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
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
export default AddTimetable = ({ navigation }) => {
  const { loading, data: subjectsName, refetch } = useQuery(SUBJECT_NAME, {})
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
      {loading ? (
        <Loader />
      ) : (
        <>
          <Container>
            <Header hasTabs>
              <MainView>
                <SubView>
                  <BackButton />
                </SubView>
                <SubView1>
                  {Platform.OS === "ios" ? (
                    <MainText>스케줄 만들기</MainText>
                  ) : (
                    <MainText2>스케줄 만들기</MainText2>
                  )}
                </SubView1>
                <SubView></SubView>
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
              />
            </Content>
          </Container>
        </>
      )}
    </MenuView>
  )
}
