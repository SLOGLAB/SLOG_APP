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
import { PoseNet } from "@tensorflow-models/posenet"
import { ExpoWebGLRenderingContext } from "expo-gl"
import Icon from "../components/Icon"
import * as mobilenet from "@tensorflow-models/mobilenet"
import { gql } from "apollo-boost"
import { useMutation } from "@apollo/react-hooks"
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
const UPDATE_EXISTTOGGLE = gql`
  mutation update_existToggle($email: String!, $existToggle: Boolean!) {
    update_existToggle(email: $email, existToggle: $existToggle)
  }
`
//

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
const PoseCamera = ({
  studyBool,
  setStudyBool,
  navigation,
  myInfoData,
  myInfoRefetch,
  deg,
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
  const [setting, setSetting] = useState(false)
  const [brightnessButton, setbrightnessButton] = useState(true)
  const [poseonoff, setPoseonoff] = useState(true)
  const getAndSetSystemBrightnessAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.SYSTEM_BRIGHTNESS)
    // bright = await Brightness.getSystemBrightnessAsync();
    if (status === "granted") {
      setbrightnessButton(!brightnessButton)
      if (brightnessButton) {
        for (let i = 200; i > -1; i--) {
          await Brightness.setBrightnessAsync(i / 1000)
        }
      } else {
        await Brightness.setBrightnessAsync(0.7)
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
      tf.dispose([imageTensor])
      // console.log(pose.score,"pose")
      // console.log(pose,"all")

      if (pose.score > 0.1) {
        studyArray.push("true")
      } else {
        studyArray.push("false")
      }
      if (studyArray.length == 4) {
        if (studyArray.findIndex((obj) => obj == "true") == -1) {
          existToggleMutation({ variables: { email: myInfoData.me.email, existToggle: false } })
          studyArray = []
          myInfoRefetch()
        } else {
          existToggleMutation({ variables: { email: myInfoData.me.email, existToggle: true } })
          studyArray = []
          myInfoRefetch()
        }
      }
      if (!AUTORENDER) {
        gl.endFrameEXP()
      }
    }, 10000)
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
            <Image
              style={{
                height: HEIGHT / 18,
                width: HEIGHT / 18,
                borderRadius: 25,
                marginTop: 0,
                marginBottom: 0,
                borderWidth: 3.5,
                borderColor: myInfoData.me.existToggle
                  ? "rgba(65, 129, 247, 1)"
                  : "rgba(133, 133, 133, 1)",
              }}
              source={{ uri: myInfoData.me.avatar }}
            />
            <Text style={styles.textstyle}>
              {myInfoData.me.username.length > 6
                ? myInfoData.me.username.substr(0, 5) + "..."
                : myInfoData.me.username}
            </Text>
          </View>

          {myInfoData.me.withFollowing.map((list) => (
            <View style={styles.indiviList} key={list.id}>
              <Image
                style={{
                  height: HEIGHT / 18,
                  width: HEIGHT / 18,
                  borderRadius: 25,
                  marginTop: 0,
                  marginBottom: 0,
                  borderWidth: 3.5,
                  borderColor: list.existToggle
                    ? "rgba(65, 129, 247, 1)"
                    : "rgba(133, 133, 133, 1)",
                }}
                source={{ uri: list.avatar }}
              />
              <Text style={styles.textstyle}>
                {list.username.length > 6 ? list.username.substr(0, 5) + "..." : list.username}
              </Text>
            </View>
          ))}
        </ScrollView>
        {/* <TouchableOpacity onPress={()=>{
        getAndSetSystemBrightnessAsync()
        // setbrightnessButton(!brightnessButton)
      }}>
      <Icon name={Platform.OS === "ios" ? "ios-moon" : "md-moon"} color={"#000000"} size={40}/>
      </TouchableOpacity> */}
      </View>
      <View style={[{ justifyContent: "center", alignItems: "center", backgroundColor: "#000" }]}>
        <View style={styles.moon}>
          <View style={styles.round}>
            <TouchableOpacity
              onPress={() => {
                getAndSetSystemBrightnessAsync()
                // setbrightnessButton(!brightnessButton)
              }}
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
        <>
          <View
            style={[
              styles.cameraContainer,
              {
                // transform: [{ rotate:"270deg" }]
              },
            ]}
          >
            <TensorCamera
              ref={camRef}
              style={[styles.camera]}
              type={Camera.Constants.Type.front}
              zoom={0}
              // cameraTextureHeight={Dimensions.get("window").height/4}
              // cameraTextureWidth={Dimensions.get("window").width/1}
              cameraTextureHeight={textureDims.height}
              cameraTextureWidth={textureDims.width}
              resizeHeight={200}
              resizeWidth={152}
              resizeDepth={3}
              onReady={handleImageTensorReady}
              autorender={false}
            />
            {poseonoff ? (
              <View style={[styles.modelResults]}>{pose && <Pose pose={pose} />}</View>
            ) : null}
          </View>
          {/* {setting?
        null
        :
        <View style={[styles.cameraAbsolute,{
          transform: [{ rotate:"270deg" }]
        }]}>
          <View>
            <Loader/>
          </View>
        </View> 
        } */}
          {/* {camsetting?
        null
        :
        <View style={[styles.camAbsolute,{
          transform: [{ rotate:"270deg" }]
        }]}>
          <View style={styles.cameraAbsoluteView}>
          </View>
        </View> 
        } */}
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
  deg,
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
      deg={deg}
      loading={loading}
      selectDate={selectDate}
      nextDate={nextDate}
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
    height: Dimensions.get("window").height / 10,
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
    width: Dimensions.get("window").width / 1.8 / 1.2,
    height: Dimensions.get("window").height / 2.2 / 1.3,
    backgroundColor: "#fff",
  },
  cameraAbsolute: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width / 1.3,
    height: Dimensions.get("window").height / 2.1,
    backgroundColor: "#fff",
  },
  cameraAbsoluteView: {
    width: Dimensions.get("window").width / 1.8 / 2,
    height: Dimensions.get("window").height / 2.2 / 2,
    backgroundColor: "#000",
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
    width: "100%",
    height: "100%",
    // width: 600 / 3,
    // height: 800 / 3,
    zIndex: 20,
    borderWidth: 1,
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
    fontSize: 10,
  },
  moon: {
    position: "absolute",
    width: Dimensions.get("window").width / 1.1,
    height: "80%",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    // backgroundColor:"#0F4B82",
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
  posebutton: {
    width: 50,
    height: 50,

    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
})
