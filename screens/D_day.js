import React, { useEffect, useState } from "react"
import styled from "styled-components"
import Dday from "../components/Date/Dday"
import { StyleSheet, TouchableOpacity, KeyboardAvoidingView, Switch, Platform } from "react-native"
import Modal from "react-native-modal"
import { Calendar, CalendarList, Agenda } from "react-native-calendars"
import AsyncStorage from "@react-native-community/async-storage"
import AuthInput from "../components/AuthInput"
import useInput from "../hooks/useInput"
import AuthButton from "../components/AuthButton"
import Icon from "../components/Icon"

const MainView = styled.View`
  justify-content: center;
  align-items: flex-start;
  /* position: absolute; */
  /* height: 100%; */
  width: 100%;
  /* padding-bottom: 10; */
  margin-top: 20;
  padding-left: 10;
`

const MainView1 = styled.View`
  flex-direction: row;
  background-color: rgba(255, 255, 255, 0);
`
const FlexView = styled.View`
  flex: 1;
`
const MainView2 = styled.View`
  align-items: center;
  flex: 1;
`

const NameView = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: 20;
`
const DdayText = styled.Text`
  font-family: "GmarketMedium";

  margin-left: 10;
  margin-top: 10;
  font-size: 10;
`

const D_day = ({ myData, editStudySetMutation }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectDay, setselectDay] = useState(0)
  const [selectDay2, setselectDay2] = useState(0)

  const selectDayNameInput = useInput(myData.dDateName)

  let nowTime = new Date()

  const onSaveSet = async () => {
    try {
      const {
        data: { editStudySet },
      } = await editStudySetMutation({
        variables: {
          nonScheduleRecord: myData.nonScheduleRecord,
          autoRefresh: myData.autoRefresh,
          autoRefreshTerm: myData.autoRefreshTerm,
          startScheduleTerm: myData.startScheduleTerm,
          cutExtenTerm: myData.cutExtenTerm,
          dDayOn: isEnabled,
          dDateName: selectDayNameInput.value,
          dDate: new Date(selectDay2),
        },
      })
      if (editStudySet) {
        // console.log("go")
      } else {
        // console.log("f")
      }
    } catch (e) {
      console.log(e)
    } finally {
      setModalVisible(!modalVisible)
    }
  }
  const [isEnabled, setIsEnabled] = useState(myData.dDayOn)
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState)
  useEffect(() => {
    if (!myData.dDayOn) {
      setIsEnabled(false)
    }
  }, [])
  return (
    <MainView>
      <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
        <Dday nowTime={nowTime} myData={myData} dDate={new Date(myData.dDate)} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        isVisible={modalVisible}
        backdropColor={"black"}
        onBackdropPress={() => setModalVisible(false)}
      >
        <>
          <MainView1>
            <AuthInput
              placeholder={"d-day이름"}
              value={selectDayNameInput.value}
              onChange={selectDayNameInput.setValue}
            />
            <MainView2>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#767577"}
                ios_backgroundColor="#F4F3F4"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </MainView2>
          </MainView1>
          <Calendar
            current={selectDay}
            minDate={"2012-05-10"}
            maxDate={"2112-05-30"}
            onDayPress={(day) => {
              setselectDay(
                day.year + "-" + day.dateString.split("-")[1] + "-" + day.dateString.split("-")[2]
              )
              // storeData(day.timestamp)
              setselectDay2(day.timestamp)
            }}
            markingType={"custom"}
            markedDates={{
              [selectDay]: { selected: true, marked: true, selectedColor: "blue" },
            }}
            monthFormat={"yyyy MM"}
            onPressArrowLeft={(subtractMonth) => subtractMonth()}
            onPressArrowRight={(addMonth) => addMonth()}
          />
          <NameView>
            <AuthButton
              onPress={() => {
                // storeNameData(selectDayNameInput.value)
                onSaveSet()
              }}
              text={"확인"}
              color="white"
            />
          </NameView>
        </>
      </Modal>
    </MainView>
  )
}
export default D_day

// const storeData = async (value) => {
//   try {
//     const jsonValue = JSON.stringify(value)
//     await AsyncStorage.setItem("DdayData", jsonValue)
//   } catch (e) {
//     console.log(e)
//   }
// }
// const storeNameData = async (value) => {
//   try {
//     const jsonValue = JSON.stringify(value)
//     await AsyncStorage.setItem("DdayNameData", jsonValue)
//   } catch (e) {
//     console.log(e)
//   } finally {
//     setModalVisible(!modalVisible)
//   }
// }
