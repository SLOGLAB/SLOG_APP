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
import * as mobilenet from "@tensorflow-models/mobilenet"
import { PoseNet } from "@tensorflow-models/posenet"
import { ExpoWebGLRenderingContext } from "expo-gl"
const TimeText = styled.Text`
  font-size: 15;
  color: #fff;
  font-family: "GmarketMedium";
  margin-bottom: 50;
`
// import * as ScreenOrientation from "expo-screen-orientation"
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
  const posenetModel = usePosenetModel()
  const [pose, setPose] = useState(null)
  const rafId = useRef(null)
  const camRef = useRef(null)
  const [button, setButton] = useState(false)
  const [existToggleMutation] = useMutation(UPDATE_EXISTTOGGLE)
  const [setting, setSetting] = useState(true)
  const [brightnessButton, setbrightnessButton] = useState(true)
  const [androidCam, setandroidCam] = useState(true)
  const [personOnoff, setpersonOnoff] = useState(true)
  // const [androidTime, setandroidTime] = useState(1)

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
    }, 980)
    setTimeout(function () {
      setandroidCam(false)
    }, 9000)
    setTimeout(function () {
      clearInterval(interval)
      if (Platform.OS !== "ios") {
        setSetting(true)
      }
    }, 9800)
  }, [])
  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  const handleImageTensorReady = async (images, updatePreview, gl = ExpoWebGLRenderingContext) => {
    studyInterval = setInterval(async () => {
      if (!AUTORENDER && !button) {
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
                  setpersonOnoff(!personOnoff)
                }}
              >
                {personOnoff ? (
                  <Icon
                    name={Platform.OS === "ios" ? "ios-square-outline" : "md-square-outline"}
                    color={"#ffffff"}
                    size={45}
                  />
                ) : (
                  <Icon
                    name={Platform.OS === "ios" ? "ios-square" : "md-square"}
                    color={"#224C7E"}
                    size={45}
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
            {Platform.OS == "ios" ? (
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
            ) : (
              <>
                {androidCam ? (
                  <Camera
                    ref={camRef}
                    type={Camera.Constants.Type.front}
                    style={{
                      justifyContent: "flex-end",
                      padding: 15,
                      width: Dimensions.get("window").width / 2.16 / heigt,
                      height: Dimensions.get("window").height / 2.64,
                    }}
                  ></Camera>
                ) : (
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
                )}
              </>
            )}
          </View>
          {personOnoff ? null : (
            <View style={styles.cameraAbsolute}>
              {androidCam ? null : (
                <>{setting ? <TimeText>열공중!!!</TimeText> : <TimeText>부재중...</TimeText>}</>
              )}
            </View>
          )}
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
    width: Dimensions.get("window").width / 2 / heigt / 0.8,
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
