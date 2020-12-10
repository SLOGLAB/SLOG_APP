import React, { useState } from "react"
import styled from "styled-components"
import { TouchableWithoutFeedback, Alert, Keyboard, Picker, TouchableHighlight } from "react-native"
import { gql } from "apollo-boost"

import { useMutation, useQuery } from "@apollo/react-hooks"
import AButton from "../../components/AButton"
import AuthButton from "../../components/AuthButton"

const CHECK = gql`
  mutation checkAttendance($email: String!) {
    checkAttendance(email: $email)
  }
`
const MenuView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const View = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: 15;
`
const SubView = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: 15;
  flex-direction: row;
`
const DayView = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
`

const Text = styled.Text`
  color: black;
`
const ME = gql`
  {
    me {
      id
      email
      phoneNumber
    }
  }
`
export default Timecontrol = ({ navigation }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <MenuView>
        <View>
          <AuthButton
            color="white"
            bgColor={"#0f4c82"}
            onPress={() => navigation.navigate("AddTimetable")}
            text="스케줄 만들기"
          />
        </View>
        <View />
        <SubView>
          <AButton
            bgColor={"rgb(230, 230, 230)"}
            onPress={() => navigation.navigate("BookmarkSubject")}
            text="TASK 북마크"
            color={"black"}
          />
        </SubView>
        <SubView>
          <AButton
            bgColor={"rgb(230, 230, 230)"}
            onPress={() => navigation.navigate("AddSubject")}
            text="TASK 추가"
            color={"black"}
          />
        </SubView>
        <SubView>
          <AButton
            bgColor={"rgb(230, 230, 230)"}
            onPress={() => navigation.navigate("ChangeSubject")}
            text="TASK 수정"
            color={"black"}
          />
        </SubView>
        <SubView>
          <AButton
            bgColor={"rgb(230, 230, 230)"}
            onPress={() => navigation.navigate("DeleteSubject")}
            text="TASK 제거"
            color={"black"}
          />
        </SubView>
      </MenuView>
    </TouchableWithoutFeedback>
  )
}
