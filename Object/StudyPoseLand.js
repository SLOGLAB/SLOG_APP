import React, { useEffect, useRef, useState } from "react"
import * as tf from "@tensorflow/tfjs"
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  Switch,
} from "react-native"
import * as Permissions from "expo-permissions"
import * as posenet from "@tensorflow-models/posenet"
import { cameraWithTensors, fetch } from "@tensorflow/tfjs-react-native"
import { Camera } from "expo-camera"
import { inputTensorHeight, inputTensorWidth, Pose } from "./Pose"
import Icon from "../components/Icon"
import { gql } from "apollo-boost"
import { useMutation } from "@apollo/react-hooks"
import styled from "styled-components"
import AsyncStorage from "@react-native-community/async-storage"

import * as mobilenet from "@tensorflow-models/mobilenet"
import { PoseNet } from "@tensorflow-models/posenet"
import { ExpoWebGLRenderingContext } from "expo-gl"
const TimeText = styled.Text`
  font-size: 25;
  color: #fff;
  font-family: "GmarketMedium";
  /* margin-bottom: 50; */
`
const SwitchText = styled.Text`
  font-size: 10;
  color: rgba(255, 255, 255, 1);
`
import * as ScreenOrientation from "expo-screen-orientation"
// import Loader from "../components/Loader"
// import StudyPresenter from "../screens/Study/StudyPresenter"
// //==
// import constants from "../constants"
// import styled from "styled-components"
// import useInterval from "../hooks/useInterval"
// import moment from 'moment';

// import * as cocossd from "@tensorflow-models/coco-ssd"
// import * as FileSystem from "expo-file-system"

// import * as ImagePicker from "expo-image-picker"
// import * as jpeg from "jpeg-js"
import * as Brightness from "expo-brightness"

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")
var image = null

export const UPDATE_EXISTTOGGLE = gql`
  mutation update_existToggle($email: String!, $existToggle: Boolean!, $userStatus: String!) {
    update_existToggle(email: $email, existToggle: $existToggle, userStatus: $userStatus)
  }
`
const useInitTensorFlow = () => {
  const [isTfReady, setIsTfReady] = useState(false)
  const initializeTf = async () => {
    await tf.ready()
    setIsTfReady(true)
  }
  useEffect(() => {
    initializeTf()
  }, [])

  return isTfReady
}
export default function StudyPoseLand({
  loading,
  selectDate,
  nextDate,
  studyBool,
  setStudyBool,
  navigation,
  myInfoData,
  myInfoRefetch,
  nexistTime,
  Bright,
  land,
  setting,
  setSetting,
}) {
  const isTfReady = useInitTensorFlow()

  if (!isTfReady) {
    return (
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          <Text>Loading</Text>
        </View>
      </View>
    )
  }

  return (
    <PoseCamera
      studyBool={studyBool}
      setStudyBool={setStudyBool}
      navigation={navigation}
      myInfoData={myInfoData}
      myInfoRefetch={myInfoRefetch}
      loading={loading}
      selectDate={selectDate}
      nextDate={nextDate}
      nexistTime={nexistTime}
      Bright={Bright}
      land={land}
      setting={setting}
      setSetting={setSetting}
    />
  )
}

const usePosenetModel = () => {
  const [posenetModel, setPosenetModel] = useState(null)

  const initModel = async () => {
    await Permissions.askAsync(Permissions.CAMERA)
    await Permissions.askAsync(Permissions.CAMERA_ROLL)

    const posenetModel = await posenet.load({
      // Config param information
      // https://github.com/tensorflow/tfjs-models/tree/master/posenet#config-params-in-posenetload
      architecture: "MobileNetV1",
      outputStride: 16,
      inputResolution: { width: inputTensorWidth, height: inputTensorHeight },
      multiplier: 0.75,
      quantBytes: 2,
    })

    setPosenetModel(posenetModel)
  }

  useEffect(() => {
    initModel()
  }, [])

  return posenetModel
}
const AUTORENDER = false

const TensorCamera = cameraWithTensors(Camera)
let studyInterval = undefined
let studyArray = []
let heigt = 812 / HEIGHT
let studySetInterval = undefined
let brighttime = undefined
let isEnabledTime = undefined
const PoseCamera = ({
  navigation,
  myInfoData,
  myInfoRefetch,
  nexistTime,
  Bright,
  studyBool,
  setStudyBool,
  loading,
  selectDate,
  nextDate,
  land,
  setting,
  setSetting,
}) => {
  const posenetModel = usePosenetModel()
  const [pose, setPose] = useState(null)
  const rafId = useRef(null)
  const camRef = useRef(null)
  const [existToggleMutation] = useMutation(UPDATE_EXISTTOGGLE)
  // const [setting, setSetting] = useState(false)
  const [brightnessButton, setbrightnessButton] = useState(true)
  const [androidCam, setandroidCam] = useState(true)
  const [personOnoff, setpersonOnoff] = useState(true)
  const [settingTime, setsettingTime] = useState(10000)
  const [isEnabled, setIsEnabled] = useState(false)
  useEffect(() => {
    clearInterval(studyInterval)
    clearInterval(studySetInterval)
    clearTimeout(brighttime)
    clearTimeout(isEnabledTime)
  }, [land])

  const toggleSwitch = async () => {
    // ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
    setIsEnabled((previousState) => !previousState)
    if (!isEnabled) {
      isEnabledTime = setTimeout(function () {
        getAndSetSystemBrightnessAsync()
      }, settingTime)
    } else {
      clearTimeout(brighttime)
      clearTimeout(isEnabledTime)
    }
  }
  //함수 2개 가로 세로 버전

  let OSbright = Platform.OS == "ios" ? 150 : 1

  const getAndSetSystemBrightnessAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.SYSTEM_BRIGHTNESS)
    if (status === "granted") {
      setbrightnessButton(!brightnessButton)
      if (brightnessButton) {
        for (let i = OSbright; i > -1; i--) {
          await Brightness.setBrightnessAsync(i / 1000)
        }
      } else {
        await Brightness.setBrightnessAsync(Bright)
      }
    } else {
      // Web browsers
      console.error("System brightness permission not granted")
    }
  }
  useEffect(() => {
    if (brightnessButton) {
      brighttime = setTimeout(function () {
        if (isEnabled) {
          getAndSetSystemBrightnessAsync()
        }
      }, settingTime)
    } else {
      clearTimeout(brighttime)
    }
  }, [brightnessButton])

  //blinking 1초마다 10동안
  useEffect(() => {
    const interval = setInterval(() => {
      setSetting((setting) => !setting)
    }, 990)
    setTimeout(function () {
      setandroidCam(false)
      clearInterval(interval)
      if (Platform.OS !== "ios") {
        setSetting(true)
      }
    }, 9900)
  }, [])

  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  const isFirstRun = useRef(true)
  const handleImageTensorReady = async (images, updatePreview, gl = ExpoWebGLRenderingContext) => {
    if (Platform.OS !== "ios") {
      studySetInterval = setInterval(async () => {
        updatePreview()

        const imageTensor = images.next().value
        tf.dispose([imageTensor])
        if (!AUTORENDER) {
          gl.endFrameEXP()
        }
      }, 100)
    }
    studyInterval = setInterval(async () => {
      if (isFirstRun.current) {
        clearInterval(studySetInterval)
        isFirstRun.current = false
      }
      if (Platform.OS !== "ios") {
        updatePreview()
      }
      const imageTensor = images.next().value
      const flipHorizontal = Platform.OS === "ios" ? false : true
      const pose = await posenetModel.estimateSinglePose(imageTensor, {
        flipHorizontal,
      })
      setPose(pose)
      let sub = tf.sub(imageTensor, imageTensor)
      let temp = sub.norm(2).sum()
      let norm = await temp.array(1)
      tf.dispose([imageTensor])
      if (pose.score > 0.1) {
        studyArray.push("true")
        setSetting(true)
      } else {
        studyArray.push("false")
        setSetting(false)
      }
      if (studyArray.length == 6) {
        myInfoRefetch()
        if (studyArray.findIndex((obj) => obj == "true") == -1) {
          existToggleMutation({
            variables: { email: myInfoData.me.email, existToggle: false, userStatus: "none" },
          })
          studyArray = []
        } else {
          existToggleMutation({
            variables: { email: myInfoData.me.email, existToggle: true, userStatus: "study" },
          })
          studyArray = []
        }
      }
      if (!AUTORENDER) {
        gl.endFrameEXP()
      }
    }, 9900)
  }

  if (!posenetModel) {
    return <View></View>
  }
  // TODO File issue to be able get this from expo.
  // Caller will still need to account for orientation/phone rotation changes
  let textureDims
  if (Platform.OS === "ios") {
    textureDims = {
      height: 1920,
      width: 1080,
    }
  } else {
    textureDims = {
      height: 1200,
      width: 1600,
    }
  }

  return (
    <View>
      <TouchableOpacity
        disabled={brightnessButton}
        onPressIn={() => {
          if (!brightnessButton) {
            getAndSetSystemBrightnessAsync()
          }
        }}
      >
        <View
          style={[
            {
              justifyContent: land ? "flex-start" : "center",
              alignItems: "center",
              backgroundColor: land ? "#6B98F7" : setting ? "#6B98F7" : "#858585",
              height: land ? WIDTH / 1 : HEIGHT / 1,
              width: land ? HEIGHT / 1 : WIDTH / 1,
            },
          ]}
        >
          <>
            <View
              style={[
                styles.cameraContainer,
                {
                  height: land ? WIDTH / 1 : HEIGHT / 1,
                  width: land ? HEIGHT / 1 : WIDTH / 1,
                },
              ]}
            >
              <TensorCamera
                ref={camRef}
                style={[
                  styles.tensorcamera,
                  {
                    borderColor: setting ? "#6B98F7" : "#858585",
                    // width: land ? HEIGHT / 1.1 : "100%",
                    // height: land ? WIDTH / heigt : "100%",
                    width: "100%",
                    height: "100%",
                    // borderWidth: 10,
                  },
                ]}
                type={Camera.Constants.Type.front}
                zoom={0}
                cameraTextureHeight={textureDims.height}
                cameraTextureWidth={textureDims.width}
                resizeHeight={200}
                resizeWidth={152}
                resizeDepth={3}
                onReady={handleImageTensorReady}
                autorender={false}
                // rotation={90} // or -90 for landscape right
              />
            </View>

            {/* <View
              style={[
                styles.modelResults,
                { height: land ? WIDTH / 1 : HEIGHT / 1, width: land ? HEIGHT / 1 : WIDTH / 1 },
              ]}
            >
              {<Pose pose={pose} />}
            </View> */}
          </>
        </View>
        <View
          style={[
            styles.moon,
            {
              height: land ? WIDTH / 1 : HEIGHT / 1,
              width: land ? HEIGHT / 1 : WIDTH / 1,
              backgroundColor: "rgba(189, 0, 248, 0)",
            },
          ]}
        >
          <View
            style={[
              styles.peopleLand,
              {
                height: land ? WIDTH / 4.3 : HEIGHT / 8,
                width: land ? HEIGHT / 2 : WIDTH / 1,
                marginTop: land ? 0 : 10,
                paddingLeft: Platform.OS == "android" ? 10 : 10,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                clearInterval(studyInterval)
                clearInterval(studySetInterval)
                clearTimeout(brighttime)
                clearTimeout(isEnabledTime)
                setIsEnabled(false)
                Brightness.setBrightnessAsync(Bright)
                // setandroidCam(true)
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
                navigation.navigate("TabNavigation")
              }}
            >
              <Icon
                name={Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"}
                color={"#000000"}
                size={40}
              />
            </TouchableOpacity>
            <ScrollView
              style={{
                backgroundColor: "rgba(189, 0, 248, 0)",
                // width: (WIDTH / 5) * 4,
                width: WIDTH / 1,
              }}
              horizontal={true}
            >
              <View style={styles.indiviList}>
                <Text style={styles.textTimestyle}>
                  {Math.floor(nexistTime / 3600) < 10
                    ? `0${Math.floor(nexistTime / 3600)}`
                    : Math.floor(nexistTime / 3600)}
                  :
                  {Math.floor(nexistTime / 60) - Math.floor(nexistTime / 3600) * 60 < 10
                    ? `0${Math.floor(nexistTime / 60) - Math.floor(nexistTime / 3600) * 60}`
                    : Math.floor(nexistTime / 60) - Math.floor(nexistTime / 3600) * 60}
                </Text>
                <Image
                  style={{
                    height: HEIGHT / 17,
                    width: HEIGHT / 17,
                    borderRadius: 25,
                    marginTop: 0,
                    marginBottom: 0,
                    borderWidth: 4,
                    // borderColor: myInfoData.me.existToggle
                    borderColor: setting ? "rgba(107, 152, 247, 1)" : "rgba(133, 133, 133, 1)",
                  }}
                  source={{ uri: myInfoData.me.avatar }}
                />
                <Text style={styles.textstyle}>
                  {myInfoData.me.username.length > 6
                    ? myInfoData.me.username.substr(0, 5) + ".."
                    : myInfoData.me.username}
                </Text>
              </View>

              {myInfoData.me.withFollowing.map((list) => (
                <View style={styles.indiviList} key={list.id}>
                  <Text style={styles.textTimestyle}>
                    {Math.floor(list.todayTime.existTime / 3600) < 10
                      ? `0${Math.floor(list.todayTime.existTime / 3600)}`
                      : Math.floor(list.todayTime.existTime / 3600)}
                    :
                    {Math.floor(list.todayTime.existTime / 60) -
                      Math.floor(list.todayTime.existTime / 3600) * 60 <
                    10
                      ? `0${
                          Math.floor(list.todayTime.existTime / 60) -
                          Math.floor(list.todayTime.existTime / 3600) * 60
                        }`
                      : Math.floor(list.todayTime.existTime / 60) -
                        Math.floor(list.todayTime.existTime / 3600) * 60}
                  </Text>

                  <Image
                    style={{
                      height: HEIGHT / 17,
                      width: HEIGHT / 17,
                      borderRadius: 25,
                      marginTop: 0,
                      marginBottom: 0,
                      borderWidth: 4,
                      borderColor: list.existToggle
                        ? "rgba(107, 152, 247, 1)"
                        : "rgba(133, 133, 133, 1)",
                    }}
                    source={{ uri: list.avatar }}
                  />
                  <Text style={styles.textstyle}>
                    {list.username.length > 6 ? list.username.substr(0, 5) + ".." : list.username}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <View
            style={[
              styles.moon3,
              {
                width: land ? HEIGHT / 1.1 : WIDTH / 1.1,
                // backgroundColor: "rgba(189, 0, 248, 1)",
              },
            ]}
          >
            <View style={styles.posebutton}>
              <TouchableOpacity
                onPress={() => {
                  setpersonOnoff(!personOnoff)
                }}
              >
                {personOnoff ? (
                  <Icon
                    name={Platform.OS === "ios" ? "ios-square-outline" : "md-square-outline"}
                    color={"#ffffff"}
                    size={70}
                  />
                ) : (
                  <Icon
                    name={Platform.OS === "ios" ? "ios-square" : "md-square"}
                    color={"#224C7E"}
                    size={70}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  getAndSetSystemBrightnessAsync()
                }}
                style={styles.round}
              >
                {brightnessButton ? (
                  <Icon
                    name={Platform.OS === "ios" ? "ios-sunny" : "md-sunny"}
                    color={"#fff"}
                    size={40}
                  />
                ) : (
                  <Icon
                    name={Platform.OS === "ios" ? "ios-moon" : "md-moon"}
                    color={"#fff"}
                    size={40}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {personOnoff ? null : (
          <View
            style={[
              styles.cameraAbsolute,
              {
                // width: "100%",
                // height: "100%",
                height: land ? (WIDTH * 3.3) / 3.3 : HEIGHT / 1,
                width: land ? HEIGHT / 1 : WIDTH / 1,
                // height: land ? (WIDTH * 6) / 9 : HEIGHT / 1.8,
                // width: land ? HEIGHT / 1.8 : WIDTH / 1,
              },
            ]}
          >
            {androidCam ? null : (
              <>{setting ? <TimeText>열공중!!!</TimeText> : <TimeText>부재중...</TimeText>}</>
            )}
            <View
              style={[
                styles.moon,
                {
                  height: land ? WIDTH / 1 : HEIGHT / 1,
                  width: land ? HEIGHT / 1 : WIDTH / 1,
                },
              ]}
            >
              <View
                style={[
                  styles.peopleLand,
                  {
                    height: land ? WIDTH / 4.3 : HEIGHT / 8.0,
                    width: land ? HEIGHT / 2 : WIDTH / 1,
                    marginTop: land ? 0 : 10,
                    paddingLeft: Platform.OS == "android" ? 10 : 10,
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    clearInterval(studyInterval)
                    clearInterval(studySetInterval)
                    clearTimeout(brighttime)
                    clearTimeout(isEnabledTime)
                    setIsEnabled(false)
                    Brightness.setBrightnessAsync(Bright)
                    // setandroidCam(true)
                    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
                    navigation.navigate("TabNavigation")
                  }}
                >
                  <Icon
                    name={Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"}
                    color={"#000000"}
                    size={40}
                  />
                </TouchableOpacity>
                <ScrollView
                  style={{
                    backgroundColor: "rgba(189, 0, 248, 0)",
                    // width: (WIDTH / 5) * 4,
                    width: WIDTH / 1,
                  }}
                  horizontal={true}
                >
                  <View style={styles.indiviList}>
                    <Text style={styles.textTimestyle}>
                      {Math.floor(nexistTime / 3600) < 10
                        ? `0${Math.floor(nexistTime / 3600)}`
                        : Math.floor(nexistTime / 3600)}
                      :
                      {Math.floor(nexistTime / 60) - Math.floor(nexistTime / 3600) * 60 < 10
                        ? `0${Math.floor(nexistTime / 60) - Math.floor(nexistTime / 3600) * 60}`
                        : Math.floor(nexistTime / 60) - Math.floor(nexistTime / 3600) * 60}
                    </Text>
                    <Image
                      style={{
                        height: HEIGHT / 17,
                        width: HEIGHT / 17,
                        borderRadius: 25,
                        marginTop: 0,
                        marginBottom: 0,
                        borderWidth: 4,
                        // borderColor: myInfoData.me.existToggle
                        borderColor: setting ? "rgba(107, 152, 247, 1)" : "rgba(133, 133, 133, 1)",
                      }}
                      source={{ uri: myInfoData.me.avatar }}
                    />
                    <Text style={styles.textstyle}>
                      {myInfoData.me.username.length > 6
                        ? myInfoData.me.username.substr(0, 5) + ".."
                        : myInfoData.me.username}
                    </Text>
                  </View>

                  {myInfoData.me.withFollowing.map((list) => (
                    <View style={styles.indiviList} key={list.id}>
                      <Text style={styles.textTimestyle}>
                        {Math.floor(list.todayTime.existTime / 3600) < 10
                          ? `0${Math.floor(list.todayTime.existTime / 3600)}`
                          : Math.floor(list.todayTime.existTime / 3600)}
                        :
                        {Math.floor(list.todayTime.existTime / 60) -
                          Math.floor(list.todayTime.existTime / 3600) * 60 <
                        10
                          ? `0${
                              Math.floor(list.todayTime.existTime / 60) -
                              Math.floor(list.todayTime.existTime / 3600) * 60
                            }`
                          : Math.floor(list.todayTime.existTime / 60) -
                            Math.floor(list.todayTime.existTime / 3600) * 60}
                      </Text>

                      <Image
                        style={{
                          height: HEIGHT / 17,
                          width: HEIGHT / 17,
                          borderRadius: 25,
                          marginTop: 0,
                          marginBottom: 0,
                          borderWidth: 4,
                          borderColor: list.existToggle
                            ? "rgba(107, 152, 247, 1)"
                            : "rgba(133, 133, 133, 1)",
                        }}
                        source={{ uri: list.avatar }}
                      />
                      <Text style={styles.textstyle}>
                        {list.username.length > 6
                          ? list.username.substr(0, 5) + ".."
                          : list.username}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
              <View
                style={[
                  styles.moon3,
                  {
                    width: land ? HEIGHT / 1.1 : WIDTH / 1.1,
                  },
                ]}
              >
                <View style={styles.posebutton}>
                  <TouchableOpacity
                    onPress={() => {
                      setpersonOnoff(!personOnoff)
                    }}
                  >
                    {personOnoff ? (
                      <Icon
                        name={Platform.OS === "ios" ? "ios-square-outline" : "md-square-outline"}
                        color={"#ffffff"}
                        size={70}
                      />
                    ) : (
                      <Icon
                        name={Platform.OS === "ios" ? "ios-square" : "md-square"}
                        color={"#ffffff"}
                        size={70}
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      getAndSetSystemBrightnessAsync()
                    }}
                    style={styles.round}
                  >
                    {brightnessButton ? (
                      <Icon
                        name={Platform.OS === "ios" ? "ios-sunny" : "md-sunny"}
                        color={"#fff"}
                        size={40}
                      />
                    ) : (
                      <Icon
                        name={Platform.OS === "ios" ? "ios-moon" : "md-moon"}
                        color={"#fff"}
                        size={40}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  top: {
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    height: Dimensions.get("window").height / 15,
    width: Dimensions.get("window").width / 1,
    paddingLeft: 10,
  },
  people: {
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    height: Dimensions.get("window").height / 10,
    width: Dimensions.get("window").width / 1,
    paddingLeft: 10,
    paddingTop: 10,
    flexDirection: "row",
    // borderWidth:1,
    borderColor: "grey",
  },
  peopleLand: {
    // position:"absolute",
    backgroundColor: "#fff",
    // opacity: 0,

    alignItems: "center",
    justifyContent: "flex-end",

    flexDirection: "row",
    // backgroundColor: "#000",
  },
  cameraContainer: {
    // display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // flexDirection: "column",
    // borderWidth: 5,
    // backgroundColor: "#fff",
  },
  tensorcamera: {
    position: "absolute",
    backgroundColor: "#fff",
    // width: "100%",
    // height: "100%",
  },
  cameraAbsolute: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F4C82",
  },

  modelResults: {
    position: "absolute",
    // width: "100%",
    // height: "100%",

    // width: Dimensions.get("window").width / 2 / heigt / 0.8,
    // height: Dimensions.get("window").height / 2.64,
    zIndex: 20,
    borderWidth: 0,
    borderColor: "grey",
    borderRadius: 0,
  },
  indiviList: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 9,
    flex: 1,
    width: Dimensions.get("window").width / 6.5,
  },
  refresh: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: Dimensions.get("window").width / 6.5,
  },
  textstyle: {
    fontSize: 9,
    fontFamily: "GmarketMedium",
  },
  textTimestyle: {
    fontSize: 12,
    color: "#0F4C82",
    fontFamily: "GmarketMedium",
  },
  moon: {
    position: "absolute",
    height: "80%",
    // flexDirection: "row",
  },
  moon2: {
    height: "50%",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    // backgroundColor: "#0F4B82",
  },
  moon3: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: 10,
    // backgroundColor: "#0F4B82",
  },
  person: {
    height: "20%",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    // backgroundColor: "#0F4B82",
  },
  round: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 40,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  roundEye: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 40,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  posebutton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginBottom: 20,
  },
  switchView: {
    // justifyContent: "flex-end",
    // alignItems: "center",
    marginBottom: 20,
    marginTop: 3,
  },
  TextView: {
    justifyContent: "center",
    alignItems: "center",
  },
  MainView: {
    width: WIDTH / 1,
    height: HEIGHT / 1,
  },
})
{
  /* {!isEnabled ? (
                <View style={styles.TextView}>
                  <SwitchText>1분 자동</SwitchText>
                  <SwitchText>화면 밝기</SwitchText>
                </View>
              ) : (
                <View style={styles.TextView}>
                  <SwitchText></SwitchText>
                  <SwitchText></SwitchText>
                </View>
              )}

              <View style={styles.switchView}>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isEnabled ? "#f5dd4b" : "#767577"}
                  ios_backgroundColor="#F4F3F4"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </View> */
}
{
  /* <View
          style={[
            styles.peopleLand,
            {
              height: land ? WIDTH / 4.3 : HEIGHT / 9.0,
              width: land ? HEIGHT / 1 : WIDTH / 1,
              marginTop: land ? 0 : 10,
              paddingLeft: Platform.OS == "android" ? 10 : 10,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              clearInterval(studyInterval)
              clearInterval(studySetInterval)
              clearTimeout(brighttime)
              clearTimeout(isEnabledTime)
              setIsEnabled(false)
              Brightness.setBrightnessAsync(Bright)
              // setandroidCam(true)
              ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
              navigation.navigate("TabNavigation")
            }}
          >
            <Icon
              name={Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"}
              color={"#000000"}
              size={40}
            />
          </TouchableOpacity>
          <ScrollView
            style={{
              backgroundColor: "#ffffff",
              // width: (WIDTH / 5) * 4,
              width: WIDTH / 1,
            }}
            horizontal={true}
          >
            <View style={styles.indiviList}>
              <Text style={styles.textTimestyle}>
                {Math.floor(nexistTime / 3600) < 10
                  ? `0${Math.floor(nexistTime / 3600)}`
                  : Math.floor(nexistTime / 3600)}
                :
                {Math.floor(nexistTime / 60) - Math.floor(nexistTime / 3600) * 60 < 10
                  ? `0${Math.floor(nexistTime / 60) - Math.floor(nexistTime / 3600) * 60}`
                  : Math.floor(nexistTime / 60) - Math.floor(nexistTime / 3600) * 60}
              </Text>
              <Image
                style={{
                  height: HEIGHT / 17,
                  width: HEIGHT / 17,
                  borderRadius: 25,
                  marginTop: 0,
                  marginBottom: 0,
                  borderWidth: 4,
                  // borderColor: myInfoData.me.existToggle
                  borderColor: setting ? "rgba(107, 152, 247, 1)" : "rgba(133, 133, 133, 1)",
                }}
                source={{ uri: myInfoData.me.avatar }}
              />
              <Text style={styles.textstyle}>
                {myInfoData.me.username.length > 6
                  ? myInfoData.me.username.substr(0, 5) + ".."
                  : myInfoData.me.username}
              </Text>
            </View>

            {myInfoData.me.withFollowing.map((list) => (
              <View style={styles.indiviList} key={list.id}>
                <Text style={styles.textTimestyle}>
                  {Math.floor(list.todayTime.existTime / 3600) < 10
                    ? `0${Math.floor(list.todayTime.existTime / 3600)}`
                    : Math.floor(list.todayTime.existTime / 3600)}
                  :
                  {Math.floor(list.todayTime.existTime / 60) -
                    Math.floor(list.todayTime.existTime / 3600) * 60 <
                  10
                    ? `0${
                        Math.floor(list.todayTime.existTime / 60) -
                        Math.floor(list.todayTime.existTime / 3600) * 60
                      }`
                    : Math.floor(list.todayTime.existTime / 60) -
                      Math.floor(list.todayTime.existTime / 3600) * 60}
                </Text>

                <Image
                  style={{
                    height: HEIGHT / 17,
                    width: HEIGHT / 17,
                    borderRadius: 25,
                    marginTop: 0,
                    marginBottom: 0,
                    borderWidth: 4,
                    borderColor: list.existToggle
                      ? "rgba(107, 152, 247, 1)"
                      : "rgba(133, 133, 133, 1)",
                  }}
                  source={{ uri: list.avatar }}
                />
                <Text style={styles.textstyle}>
                  {list.username.length > 6 ? list.username.substr(0, 5) + ".." : list.username}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View> */
}
