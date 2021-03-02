import React, { useEffect, useRef, useState } from "react"
import * as tf from "@tensorflow/tfjs"
import "@tensorflow/tfjs-react-native"
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
} from "react-native"
import * as Permissions from "expo-permissions"
import * as posenet from "@tensorflow-models/posenet"
import { cameraWithTensors, fetch } from "@tensorflow/tfjs-react-native"
import { Camera } from "expo-camera"
import { inputTensorHeight, inputTensorWidth, Pose } from "./Pose"
import Icon from "../components/Icon"
// import { gql } from "apollo-boost"
// import { useMutation } from "@apollo/react-hooks"
import * as mobilenet from "@tensorflow-models/mobilenet"
import { PoseNet } from "@tensorflow-models/posenet"
import { ExpoWebGLRenderingContext } from "expo-gl"
// import * as ScreenOrientation from "expo-screen-orientation"
// import Loader from "../components/Loader"
// import StudyPresenter from "../screens/Study/StudyPresenter"
// //==
// import constants from "../constants"
// import styled from "styled-components"
// import useInterval from "../hooks/useInterval"
// import moment from 'moment';

import * as cocossd from "@tensorflow-models/coco-ssd"
// import * as FileSystem from "expo-file-system"

// import * as ImagePicker from "expo-image-picker"
// import * as jpeg from "jpeg-js"
import * as Brightness from "expo-brightness"

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")
var image = null
// const UPDATE_EXISTTOGGLE = gql`
//   mutation update_existToggle($email: String!, $existToggle: Boolean!) {
//     update_existToggle(email: $email, existToggle: $existToggle)
//   }
// `
//
// export const UPDATE_EXISTTOGGLE = gql`
//   mutation update_existToggle($email: String!, $existToggle: Boolean!, $userStatus: String!) {
//     update_existToggle(email: $email, existToggle: $existToggle, userStatus: $userStatus)
//   }
// `
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
let texture
if (Platform.OS === "ios") {
  texture = {
    height: 200,
    width: 152,
  }
} else {
  texture = {
    height: 1200,
    width: 1600,
  }
}
const useSsdModel = () => {
  const [ssdModel, setSsdModel] = useState(null)

  const initModel = async () => {
    await Permissions.askAsync(Permissions.CAMERA)
    await Permissions.askAsync(Permissions.CAMERA_ROLL)
    const ssd_model = await cocossd.load({ base: "mobilenet_v2" })

    setSsdModel(ssd_model)
    beforeImg = tf.zeros([200, 152, 3])
  }

  useEffect(() => {
    initModel()
  }, [])

  return ssdModel
}
const AUTORENDER = false

const TensorCamera = cameraWithTensors(Camera)
let studyInterval = undefined
let studyArray = []
let heigt = 812 / HEIGHT
// 1.personBbox area
// val : pixel's diff
let normArray = new Array(24).fill(5000)
// 1.personBbox area
let personDecisionArray = new Array(24).fill(0)

let cellphoneDecisionArray = [0, 0, 0, 0, 0, 0] // 1.true 2.false

// let finalDecisionArray = []; // 1.study 2.none 3.cell phone 4.sleep

let detect_interval = 3000 * 1
let mutation_interval = 6

let decision_size = 6
let normDecision_size = decision_size * 4
let personDecision_size = decision_size * 2
let cellphoneDecision_size = decision_size
let window_size = decision_size * 5

const personSizeThreshold = 29999
const normArrayThreshold_low = 2000
const normArrayThreshold_midle = 3000
const normArrayThreshold_high = 10000

let displayDetectResult = true

let detect_count = 5
let doDrawResult = false

let ssd_model = null
let videoWidth = null
let videoHeight = null
let beforeImg = null

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
}) => {
  const SsdModel = useSsdModel()
  const [pose, setPose] = useState(null)
  const rafId = useRef(null)
  const camRef = useRef(null)
  const [button, setButton] = useState(false)
  // const [existToggleMutation] = useMutation(UPDATE_EXISTTOGGLE)
  const [setting, setSetting] = useState(true)
  const [brightnessButton, setbrightnessButton] = useState(true)
  const [poseonoff, setPoseonoff] = useState(true)
  const [personOnoff, setpersonOnoff] = useState(true)

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
  // useEffect(() => {
  //     // Ask for system brightness permission
  //     console.log(brightnessButton,"brightnessButton")
  //   if(brightnessButton)
  //   {
  //     console.log(brightnessButton,"brightnessButton true")
  //     getAndSetSystemBrightnessAsync();
  //   }
  // }, [brightnessButton]);
  //blinking 1초마다 10동안
  useEffect(() => {
    const interval = setInterval(() => {
      setSetting((setting) => !setting)
    }, 1000)
    setTimeout(function () {
      clearInterval(interval)
    }, 10000)
  }, [])

  const ConcludeFinalDecision = () => {
    // normArray = [] // val : pixel's diff
    // personDecisionArray = [] // 1.true 2.false
    // cellphoneDecisionArray = [] // 1.true 2.false

    let finalDecision = 0 // 0.study 1.none 2.sleep
    let finalDecisionPerson = true
    let finalDecisionNorm = true
    let finalDecisionCellphone = true

    //person data preprocessing
    let personDecisionArray_decision = personDecisionArray.slice(0, personDecision_size) //detect using the data for 2 min

    personDecisionArray_decision = personDecisionArray_decision.filter(
      (Decision) => Decision > personSizeThreshold
    )

    if (personDecisionArray_decision.length > 1) {
      finalDecisionPerson = true
    } else {
      finalDecisionPerson = false
    }

    //norm data preprocessing
    let normArray_decision = normArray.slice(0, normDecision_size) //detect using the data for 2 min

    let normArray_decision_sum = normArray_decision.reduce((a, b) => a + b)
    let normArray_decision_Average = normArray_decision_sum / normArray_decision.length
    // console.log(normArray_decision_Average)
    let normArray_decision_high = normArray_decision.filter(
      (Decision) => Decision > normArrayThreshold_high
    )

    if (
      normArray_decision_Average > normArrayThreshold_midle ||
      normArray_decision_high.length > 4
    ) {
      finalDecisionNorm = true
    } else {
      finalDecisionNorm = false
    }

    //cell phone data preprocessing
    let cellphoneDecisionArray_decision = cellphoneDecisionArray.slice(0, cellphoneDecision_size) //detect using the data for 1 min
    let cellphoneDecisionArray_decisionSum = cellphoneDecisionArray_decision.reduce((a, b) => a + b)

    if (cellphoneDecisionArray_decisionSum > 0) {
      finalDecisionCellphone = true
    } else {
      finalDecisionCellphone = false
    }

    //final decision
    if (finalDecisionPerson === true) {
      if (finalDecisionNorm === true) {
        if (finalDecisionCellphone === true) {
          console.log("phone")
          // ThrowTime(true, "phone")
          // setStudyBool(true)
        } else if (finalDecisionCellphone === false) {
          console.log("study")
          // ThrowTime(true, "study")
          // setStudyBool(true)
        }
      } else if (finalDecisionNorm === false) {
        console.log("sleep")
        // ThrowTime(false, "sleep")
        // setStudyBool(false)
      }
    } else if (finalDecisionPerson === false) {
      if (finalDecisionNorm === true) {
        if (normArray_decision_high.length >= decision_size) {
          if (finalDecisionCellphone === true) {
            console.log("phone")
            // ThrowTime(true, "phone")
            // setStudyBool(true)
          } else {
            console.log("study")
            // ThrowTime(true, "study")
            // setStudyBool(true)
          }
        } else if (normArray_decision_high.length < decision_size) {
          console.log("none")
          // ThrowTime(false, "none")
          // setStudyBool(false)
        }
      } else if (finalDecisionNorm === false) {
        console.log("none")
        // ThrowTime(false, "none")
        // setStudyBool(false)
      }
    }
  }
  /////////////////////////////////////
  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // const ThrowTime = async (existToggle, userStatus) => {
  //   existToggleMutation({
  //     variables: { email: myInfoData.me.email, existToggle, userStatus },
  //   })
  //   console.log("throw time!")
  // }

  // let finalDecisionArray=[] // 1.study 2.none 3.cell phone 4.sleep
  const personDecision = (personDetections) => {
    if (personDecisionArray.length >= window_size) {
      personDecisionArray.pop()
    }
    let bbox_area = 0
    let personBboxArray = []
    if (personDetections.length > 0) {
      for (var i = 0; i < personDetections.length; i++) {
        bbox_area = personDetections[i].bbox[2] * personDetections[i].bbox[3]
        personBboxArray = [bbox_area, ...personBboxArray]
      }
      personDecisionArray = [Math.max(...personBboxArray), ...personDecisionArray]
    } else {
      personDecisionArray = [0, ...personDecisionArray]
    }
    // console.log(personDecisionArray)
  }

  const cellphoneDecision = (cellphoneDetections) => {
    if (cellphoneDecisionArray.length >= window_size) {
      cellphoneDecisionArray.pop()
    }

    let cellphoneDecision = 0

    if (cellphoneDetections.length > 0) {
      cellphoneDecision = cellphoneDetections.length
    }
    cellphoneDecisionArray = [cellphoneDecision, ...cellphoneDecisionArray]
    // console.log(cellphoneDecisionArray)
  }
  const handleImageTensorReady = async (images, updatePreview, gl = ExpoWebGLRenderingContext) => {
    studyInterval = setInterval(async () => {
      if (!AUTORENDER && !button) {
        updatePreview()
      }
      console.log(images)
      const img = images.next().value
      const prediction = await SsdModel.detect(img)
      // console.log(prediction, "prediction")
      const personDetections = prediction.filter((p) => p.class === "person")
      const cellphoneDetections = prediction.filter((p) => p.class === "cell phone")
      const flipHorizontal = Platform.OS === "ios" ? false : true
      let sub = tf.sub(img, beforeImg)

      console.log("11111")

      // img.reshape([1, -1]).transpose().print()
      // img.transpose([1, -1]).print()

      img.print()

      console.log(img.shape)

      console.log("22222")

      beforeImg.print()
      console.log(beforeImg.shape)

      console.log("33333")

      sub.print()
      console.log(sub.shape)

      console.log(sub, "sub")
      let temp = sub.sum()
      console.log(temp, "temp")

      temp.print()
      let norm = await temp.array(1)
      console.log(norm, "norm")
      if (normArray.length >= window_size) {
        normArray.pop()
      }

      normArray = [norm, ...normArray]
      sub.dispose()
      temp.dispose()
      beforeImg.dispose()
      // console.log(normArray)
      beforeImg = img

      personDecision(personDetections)
      cellphoneDecision(cellphoneDetections)

      console.log(detect_count, "detect_count")
      if (detect_count % mutation_interval === 0) {
        ConcludeFinalDecision()
        detect_count = 0
      }

      // if (imgTensorArray.length === window_size + 1) {
      //   console.log("here")
      //   // console.log(imgTensorArray.length)
      //   await imgTensorArray[window_size].dispose()
      //   imgTensorArray[window_size].print()
      // }
      console.log("normArray: " + normArray)
      console.log("personDecisionArray: " + personDecisionArray)
      console.log("cellphoneDecisionArray" + cellphoneDecisionArray)

      detect_count = detect_count + 1
      // existToggleMutation({ variables: { email: myInfoData.me.email, existToggle: false } })
      if (!AUTORENDER) {
        gl.endFrameEXP()
      }
      await tf.nextFrame()
    }, 10000)
  }

  if (!SsdModel) {
    return (
      <View>
        <Text></Text>
      </View>
    )
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
    <>
      <View style={styles.peopleLand}>
        <TouchableOpacity
          onPress={() => {
            clearInterval(studyInterval)
            Brightness.setBrightnessAsync(Bright)
            // setSetting(false)
            // ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
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
          style={{ backgroundColor: "#ffffff", width: (WIDTH / 5) * 4 }}
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
      <View style={[{ justifyContent: "center", alignItems: "center", backgroundColor: "#000" }]}>
        <View style={styles.moon}>
          <View style={styles.person}>
            <TouchableOpacity
              onPress={() => {
                setpersonOnoff(!personOnoff)
              }}
              style={styles.round}
            >
              {personOnoff ? (
                <Icon
                  name={Platform.OS === "ios" ? "ios-eye" : "md-eye"}
                  color={"#fff"}
                  size={30}
                />
              ) : (
                <Icon
                  name={Platform.OS === "ios" ? "ios-eye-off" : "md-eye-off"}
                  color={"#E5E5E5"}
                  size={30}
                />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.moon2}>
            <TouchableOpacity
              onPress={() => {
                getAndSetSystemBrightnessAsync()
                // setbrightnessButton(!brightnessButton)
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
            <View style={styles.posebutton}>
              <TouchableOpacity
                onPress={() => {
                  setPoseonoff(!poseonoff)
                }}
              >
                {poseonoff ? (
                  <Image
                    style={{
                      height: 60,
                      width: 50,
                      marginTop: 0,
                      marginBottom: 0,
                    }}
                    source={require("../assets/poseon.png")}
                  />
                ) : (
                  <Image
                    style={{
                      height: 60,
                      width: 50,
                      marginTop: 0,
                      marginBottom: 0,
                    }}
                    source={require("../assets/poseoff.png")}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <>
          <View
            style={[
              styles.cameraContainer,
              {
                transform: [{ rotate: "0deg" }],
              },
            ]}
          >
            <TensorCamera
              ref={camRef}
              style={[styles.camera, { transform: [{ rotate: "360deg" }] }]}
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
            {poseonoff ? (
              <View style={[styles.modelResults]}>{pose && <Pose pose={pose} />}</View>
            ) : null}
          </View>
          {personOnoff ? null : <View style={styles.cameraAbsolute}></View>}
        </>
      </View>
    </>
  )
}
{
  /* <View style={[styles.modelResults]}>
    {pose && <Pose pose={pose} />}
</View>  */
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
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: "flex-start",
    justifyContent: "flex-end",
    height: Dimensions.get("window").height / 9.0,
    width: Dimensions.get("window").width / 1,
    paddingLeft: 10,
    paddingTop: 10,
    flexDirection: "row",
    // borderWidth:1,
    borderColor: "grey",
  },
  cameraContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width / 2.16 / heigt,
    height: Dimensions.get("window").height / 2.64,
    backgroundColor: "#fff",
  },
  cameraAbsolute: {
    position: "absolute",
    // width: 600 / 3,
    // height: 800 / 3,
    alignItems: "center",
    justifyContent: "center",
    width: "55%",
    height: "100%",
    zIndex: 1,
    // borderWidth: 1,
    borderColor: "black",
    borderRadius: 0,
    backgroundColor: "#0F4C82",
  },

  camAbsolute: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width / 1.7,
    height: Dimensions.get("window").height / 2.1,

    // width: Dimensions.get("window").width/1,
    // height: Dimensions.get("window").height/1.22222,

    backgroundColor: "#fff",
  },
  camera: {
    position: "absolute",
    // width: 600 / 3,
    // height: 800 / 3,
    width: "100%",
    height: "100%",
    zIndex: 1,
    // borderWidth: 1,
    borderColor: "black",
    borderRadius: 0,
  },
  modelResults: {
    position: "absolute",
    // width: "100%",
    // height: "100%",
    width: Dimensions.get("window").width / 2.16 / heigt / 0.8,
    height: Dimensions.get("window").height / 2.64,
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
    width: Dimensions.get("window").width / 1.1,
    height: "80%",
    // justifyContent: "flex-start",
    // alignItems: "flex-end",
    flexDirection: "row",
    // backgroundColor: "#0F4B82",
  },
  moon2: {
    height: "100%",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
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
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 40,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
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
  },
})
