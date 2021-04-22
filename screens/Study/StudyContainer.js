import React, { useEffect, useState, useRef } from "react"
import { View, Dimensions, StyleSheet, SafeAreaView, Platform, StatusBar } from "react-native"

import { useQuery, useMutation } from "@apollo/react-hooks"
import Loader from "../../components/Loader"
import useInput from "../../hooks/useInput"

import { withNavigationFocus } from "react-navigation"
import { useKeepAwake } from "expo-keep-awake"
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")
import StudyCal from "./StudyCal"
import { ME } from "../../screens/Tabs/QueryBox"

const useScreenDimensions = () => {
  const [screenData, setScreenData] = useState(Dimensions.get("screen"))

  useEffect(() => {
    const onChange = (result) => {
      setScreenData(result.screen)
    }

    Dimensions.addEventListener("change", onChange)

    return () => Dimensions.removeEventListener("change", onChange)
  })

  return {
    ...screenData,
    isLandscape: screenData.width > screenData.height,
  }
}

const StudyContainer = ({ navigation }) => {
  const Bright = navigation.getParam("Bright")

  const screenData = useScreenDimensions()
  const { loading, data: myInfoData, refetch: myInfoRefetch } = useQuery(ME)

  let heigt = 812 / HEIGHT

  useKeepAwake() //화면 안꺼지게 expo
  ///
  const minValue_10 = (value) => value >= 10
  const refreshTerm = useInput(10, minValue_10)

  const [androidCam, setandroidCam] = useState(true)
  const [personOnoff, setpersonOnoff] = useState(true)

  const [selectDate, setSelectDate] = useState(new Date())
  const [nextDate, setNextDate] = useState(new Date())
  const [setting, setSetting] = useState(false)

  const oneDayHours_tmp = Array.from(Array(24).keys())
  const oneDayHours = oneDayHours_tmp.map(String)

  const isFirstRun = useRef(true)
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      nextDate.setDate(new Date().getDate() + 1)
      return
    }
    nextDate.setTime(selectDate.getTime())
    nextDate.setDate(nextDate.getDate() + 1)
  }, [selectDate])

  useEffect(() => {
    myInfoRefetch()
  }, [])

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {Platform.OS == "ios" ? (
            <StatusBar barStyle="dark-content" />
          ) : (
            <StatusBar barStyle="light-content" />
          )}
          <StudyCal
            navigation={navigation}
            myInfoData={myInfoData}
            myInfoRefetch={myInfoRefetch}
            deg={"270deg"}
            // setbool={true}
            loading={loading}
            selectDate={selectDate}
            nextDate={nextDate}
            Bright={Bright}
            land={screenData.isLandscape}
            setting={setting}
            setSetting={setSetting}
            androidCam={androidCam}
            setandroidCam={setandroidCam}
            personOnoff={personOnoff}
            setpersonOnoff={setpersonOnoff}
            myData={myInfoData.me}
          />
        </>
      )}
    </>
  )
}

export default withNavigationFocus(StudyContainer)
