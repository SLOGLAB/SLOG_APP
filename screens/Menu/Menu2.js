import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { TouchableWithoutFeedback, Alert, Keyboard, Picker, TouchableHighlight } from "react-native"
import { gql } from "apollo-boost"

import { useMutation, useQuery } from "@apollo/react-hooks"
import AuthButton from "../../components/AuthButton"
import Atten from "./Atten"
import HandleLogout from "../Auth/HandleLogout"
import * as Notifications from "expo-notifications"
import * as Permissions from "expo-permissions"

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
export default Menu2 = ({ navigation }) => {
  const { loading, data } = useQuery(ME)
  // const checkalert = () => {
  //   Alert.alert("출석확인")
  // }
  // const checkinalert = () => {
  //   Alert.alert("이미 출석하셨습니다.")
  // }
  // const [Checkin] = useMutation(CHECK, {
  //   variables: {
  //     email: data.me.email
  //   }
  // })

  // const check = async () => {
  //   try {
  //     await Checkin()
  //     checkalert()
  //   } catch (e) {
  //     console.log(e)
  //     checkinalert()
  //   } finally {
  //     // console.log(data)
  //   }
  // }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <MenuView>
        {/* <View>
          <AuthButton onPress={() => navigation.navigate("Menu2")} text="목표시간변경" />
        </View> */}
        <View>
          <Atten {...data.me} />
        </View>

        <View>
          <HandleLogout />
        </View>
      </MenuView>
    </TouchableWithoutFeedback>
  )
}
