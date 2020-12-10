import React, { useState } from "react"
import styled from "styled-components"
import { TouchableWithoutFeedback, Alert, Keyboard, Picker, TouchableHighlight } from "react-native"
import { gql } from "apollo-boost"

import { useMutation, useQuery } from "@apollo/react-hooks"
import AuthButton from "../../components/AuthButton"

import HandleLogout from "../Auth/HandleLogout"
const CHECK = gql`
  mutation update_existToggle($email: String!, $existToggle: Boolean!) {
    update_existToggle(email: $email, existToggle: $existToggle)
  }
`

export default Atten = ({ email }) => {
  const checkalert = () => {
    Alert.alert("출석확인")
  }
  const checkinalert = () => {
    Alert.alert("이미 출석하셨습니다.")
  }
  const [Checkin] = useMutation(CHECK, {
    variables: {
      email: email,
      existToggle: true,
    },
  })

  const check = async () => {
    try {
      await Checkin()
      checkalert()
    } catch (e) {
      console.log(e)
      checkinalert()
    } finally {
      // console.log(data)
    }
  }
  return <AuthButton color="white" onPress={check} text="출석" />
}
