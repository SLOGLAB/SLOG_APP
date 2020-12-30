import React, { useEffect, useState, useRef } from "react"
import {
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native"
import styled from "styled-components"
import RNPickerSelect from "react-native-picker-select"
import { Ionicons } from "@expo/vector-icons"
import AuthButton from "../../components/AuthButton"
import AuthInput from "../../components/AuthInput"
import LastWidth from "../../components/LastWidth"
import Icon from "../../components/Icon"

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")
const MainView = styled.View`
  justify-content: center;
  align-items: center;
`

export default ({ myInfoData }) => {
  useEffect(() => {
    // console.log(myInfoData)
  }, [])
  return <MainView></MainView>
}
