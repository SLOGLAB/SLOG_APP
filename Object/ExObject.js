import React, { useEffect, useState } from "react"
import {
  Alert,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native"
import * as tf from "@tensorflow/tfjs"
import { fetch } from "@tensorflow/tfjs-react-native"
import * as mobilenet from "@tensorflow-models/mobilenet"
import * as cocoSsd from "@tensorflow-models/coco-ssd"

import Constants from "expo-constants"
import * as Permissions from "expo-permissions"
import * as jpeg from "jpeg-js"
// import { image } from "@tensorflow/tfjs"
import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system" //
import { cameraWithTensors } from "@tensorflow/tfjs-react-native" //
import { Camera } from "expo-camera" //

var image = null
// var predictions = null
const ExObject = ({ navigation }) => {
  const TensorCamera = cameraWithTensors(Camera) //

  const [isTfReady, setIsTfReady] = useState(false) //
  const [isModelReady, setIsModelReady] = useState(false) //
  const [predictions, setPredictions] = useState()
  const [hasPermission, setHasPermission] = useState(null)

  // const [image, setImage] = useState(null)
  const [model, setModel] = useState(null)
  const setting = async () => {
    try {
      await tf.ready()
      setIsTfReady(true)
      const model = await cocoSsd.load()
      setModel(model)
      setIsModelReady(true)
      getPermissionAsync()
    } catch (e) {
      console.log(e)
    }
  } //

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if (status !== "granted") {
        Alert.alert("Sorry, we need camera roll permissions to make this work!")
      }
    }
  } //

  const imageToTensor = (rawImageData) => {
    const TO_UINT8ARRAY = true
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(width * height * 3)
    let offset = 0 // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset]
      buffer[i + 1] = data[offset + 1]
      buffer[i + 2] = data[offset + 2]

      offset += 4
    }

    return tf.tensor3d(buffer, [height, width, 3])
  }
  const classifyImage = async () => {
    try {
      console.log(image)
      const imageAssetPath = Image.resolveAssetSource(image)
      const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
      const rawImageData = await response.arrayBuffer()
      const imageTensor = imageToTensor(rawImageData)

      const prediction = await model.detect(imageTensor)
      setPredictions(prediction)
      // console.log(predictions)
    } catch (error) {
      console.log(error)
    }
  }
  const selectImage = async () => {
    try {
      let response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
      })

      if (!response.cancelled) {
        const source = { uri: response.uri }
        image = source
        classifyImage()
        // detectObjects()
      }
    } catch (error) {
      console.log(error)
    }
  }
  // const [frameWorkReady, setFrameWorkReady] = useState(false)
  // useEffect(() => {
  //   if (!frameWorkReady) {
  //     ;(async () => {
  //       const { status } = await Camera.requestPermissionsAsync().catch((e) => console.log(e))
  //       setHasPermission(status === "granted")
  //       await tf.ready().catch((e) => console.log(e))

  //       setIsTfReady(true)
  //       setModel(await cocoSsd.load().catch((e) => console.log(e)))
  //       setIsModelReady(true)
  //       getPermissionAsync()

  //       setFrameWorkReady(true)
  //     })()
  //   }
  // }, [])

  // function sleep(milliseconds) {
  //   const date = Date.now()
  //   let currentDate = null
  //   do {
  //     currentDate = Date.now()
  //   } while (currentDate - date < milliseconds)
  // }

  // const handleCameraStream = (imageAsTensors) => {
  //   if (!imageAsTensors) {
  //     console.log("Image not found!")
  //   }
  //   const loop = async () => {
  //     const imageTensor = await imageAsTensors.next().value
  //     if (model !== null) {
  //       console.log("Started")
  //       await getPrediction(imageTensor).catch((e) => console.log(e))
  //     }
  //     tf.dispose(imageAsTensors)

  //     // await getPrediction(nextImageTensor)
  //     requestAnimationFrameId = requestAnimationFrame(loop)
  //   }
  //   sleep(1000)
  //   loop()
  // }
  const renderPrediction = (prediction, index) => {
    // console.log(prediction)
    const pclass = prediction.class
    const score = prediction.score
    const x = prediction.bbox[0]
    const y = prediction.bbox[1]
    const w = prediction.bbox[2]
    const h = prediction.bbox[3]

    return (
      <Text key={index} style={styles.text}>
        Prediction: {pclass} {", "} Probability: {score} {", "} Bbox: {x} {", "} {y} {", "} {w}{" "}
        {", "} {h}
      </Text>
    )
  } //

  useEffect(() => {
    setting()
  })
  return (
    <ScrollView>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <View style={styles.footer}>
            <Text style={styles.poweredBy}>Apps by:</Text>
          </View>
          <Text style={styles.commonTextStyles}>
            TFJS ready? {isTfReady ? <Text>✅</Text> : ""}
          </Text>

          <View style={styles.loadingModelContainer}>
            <Text style={styles.text}>Model ready? </Text>
            {isModelReady ? (
              <Text style={styles.text}>✅</Text>
            ) : (
              <ActivityIndicator size="small" />
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.imageWrapper}
          onPress={isModelReady ? selectImage : undefined}
        >
          {image && <Image source={image} style={styles.imageContainer} />}

          {isModelReady && !image && (
            <Text style={styles.transparentText}>Tap to choose image</Text>
          )}
        </TouchableOpacity>
        <View style={styles.predictionWrapper}>
          {isModelReady && image && (
            <Text style={styles.text}>Predictions: {predictions ? "" : "Predicting..."}</Text>
          )}
          {isModelReady && predictions && predictions.map((p, index) => renderPrediction(p, index))}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171f24",
    alignItems: "center",
  },
  loadingContainer: {
    marginTop: 80,
    justifyContent: "center",
  },
  text: {
    color: "#ffffff",
    fontSize: 16,
  },
  loadingModelContainer: {
    flexDirection: "row",
    marginTop: 10,
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
  imageWrapper: {
    width: 280,
    height: 280,
    padding: 10,
    borderColor: "#cf667f",
    borderWidth: 5,
    borderStyle: "dashed",
    marginTop: 40,
    marginBottom: 10,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: 250,
    height: 250,
    position: "absolute",
    top: 10,
    left: 10,
    bottom: 10,
    right: 10,
  },
  predictionWrapper: {
    height: 100,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  transparentText: {
    color: "#ffffff",
    opacity: 0.7,
  },
  footer: {
    marginTop: 40,
  },
  poweredBy: {
    fontSize: 20,
    color: "#e69e34",
    marginBottom: 6,
  },
  tfLogo: {
    width: 125,
    height: 70,
  },
})

export default ExObject
