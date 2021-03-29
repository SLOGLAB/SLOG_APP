import React, { useState, useEffect } from "react"
import {
  TouchableWithoutFeedback,
  Alert,
  FlatList,
  Keyboard,
  Picker,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native"
import { CheckBox } from "native-base"

import styled from "styled-components"
const TopView = styled.View`
  margin-top: 10;
  flex: 1;
  width: 55;
  height: 55;
`
// const Text = styled.Text`
//   margin-left: 20;
// `

const CheckBoxs = ({ data, checked, onChange, subjectList }) => {
  const [check, setcheck] = useState(checked)

  // const Press = () => {
  //   setcheck(!check)
  //   // console.log(check)
  // }
  // const Press1 = () => {
  //   console.log(check)
  // }
  useEffect(() => {
    setcheck(checked)
  }, [check !== checked])
  return (
    <CheckBox
      checked={check}
      // onPress={Press}
      // color="green"
      onPress={onChange}
    />
  )
}
export default CheckBoxs
