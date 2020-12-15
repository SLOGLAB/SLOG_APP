import React, { useState, useEffect } from "react"

//react native
import {
  ActivityIndicator,
  Text,
  View,
  ScrollView,
  StyleSheet,
  Button,
  Platform,
} from "react-native"

//Expo
import Constants from "expo-constants"
import * as Permissions from "expo-permissions"
import { Camera } from "expo-camera"
//Tensorflow
import * as tf from "@tensorflow/tfjs"
import * as mobilenet from "@tensorflow-models/mobilenet"
import { cameraWithTensors } from "@tensorflow/tfjs-react-native"
import * as cocossd from "@tensorflow-models/coco-ssd"

//disable yellow warnings on EXPO client!
console.disableYellowBox = true

export default function Apps() {
  const [predictionFound, setPredictionFound] = useState(false)
  const [hasPermission, setHasPermission] = useState(null)

  //Tensorflow and Permissions
  const [mobilenetModel, setMobilenetModel] = useState(null)
  const [frameworkReady, setFrameworkReady] = useState(false)

  //defaults

  //TF Camera Decorator
  const TensorCamera = cameraWithTensors(Camera)
  //RAF ID
  let requestAnimationFrameId = 0

  //performance hacks (Platform dependent)
  const textureDims =
    Platform.OS === "ios" ? { width: 1080, height: 1920 } : { width: 1600, height: 1200 }
  const tensorDims = { width: 152, height: 200 }

  useEffect(() => {
    if (!frameworkReady) {
      ;(async () => {
        //check permissions
        const { status } = await Camera.requestPermissionsAsync()
        console.log(`permissions status: ${status}`)
        setHasPermission(status === "granted")

        //we must always wait for the Tensorflow API to be ready before any TF operation...
        await tf.ready()

        //load the mobilenet model and save it in state
        setMobilenetModel(await loadMobileNetModel())

        setFrameworkReady(true)
      })()
    }
  }, [])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestAnimationFrameId)
    }
  }, [requestAnimationFrameId])

  const loadMobileNetModel = async () => {
    const model = await mobilenet.load()
    return model
  }

  const getPrediction = async (tensor) => {
    if (!tensor) {
      return
    }
    //topk set to 1
    const prediction = await mobilenetModel.classify(tensor, 1)
    // if (`${JSON.stringify(prediction)}` === "nematode worm") {
    //   console.log(`prediction: ${JSON.stringify(prediction)}`)
    // }
    console.log(`${JSON.stringify(prediction)}`)

    if (!prediction || prediction.length === 0) {
      return
    }
    //only attempt translation when confidence is higher than 20%
    if (prediction[0].probability > 0.5) {
      //stop looping!
      cancelAnimationFrame(requestAnimationFrameId)
      setPredictionFound(true)
      //get translation!
      // await getTranslation(prediction[0].className)
    }
  }

  const handleCameraStream = (imageAsTensors) => {
    const loop = async () => {
      const nextImageTensor = await imageAsTensors.next().value
      await getPrediction(nextImageTensor)
      requestAnimationFrameId = requestAnimationFrame(loop)
    }
    if (!predictionFound) loop()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Object</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.cameraView}>
          <TensorCamera
            style={styles.camera}
            type={Camera.Constants.Type.front}
            zoom={0}
            cameraTextureHeight={textureDims.height}
            cameraTextureWidth={textureDims.width}
            resizeHeight={tensorDims.height}
            resizeWidth={tensorDims.width}
            resizeDepth={3}
            onReady={(imageAsTensors) => handleCameraStream(imageAsTensors)}
            autorender={true}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#E8E8E8",
  },
  header: {
    backgroundColor: "#41005d",
  },
  title: {
    margin: 10,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#ffffff",
  },
  body: {
    padding: 5,
    paddingTop: 25,
  },
  cameraView: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    width: "100%",
    height: "100%",
    paddingTop: 10,
  },
  camera: {
    width: 700 / 2,
    height: 800 / 2,
    zIndex: 1,
    borderWidth: 0,
    borderRadius: 0,
  },
  translationView: {
    marginTop: 30,
    padding: 20,
    borderColor: "#cccccc",
    borderWidth: 1,
    borderStyle: "solid",
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    height: 500,
  },
  translationTextField: {
    fontSize: 60,
  },
  wordTextField: {
    textAlign: "right",
    fontSize: 20,
    marginBottom: 50,
  },
  legendTextField: {
    fontStyle: "italic",
    color: "#888888",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "purple",
    borderStyle: "solid",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#ffffff",
  },
})
