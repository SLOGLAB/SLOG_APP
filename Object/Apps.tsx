import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { Button, Platform, StyleSheet, Text, View,Image, Alert } from "react-native";
import * as Permissions from "expo-permissions";
import * as posenet from "@tensorflow-models/posenet";
import { cameraWithTensors ,fetch} from "@tensorflow/tfjs-react-native";
import { Camera } from "expo-camera";
import { inputTensorHeight, inputTensorWidth, Pose } from "./Pose";
import { PoseNet } from "@tensorflow-models/posenet";

import { ExpoWebGLRenderingContext } from "expo-gl";
//==
import useInterval from "../hooks/useInterval"
import moment from 'moment';

import * as cocossd from "@tensorflow-models/coco-ssd"
import * as mobilenet from "@tensorflow-models/mobilenet"
import * as FileSystem from "expo-file-system"

import * as ImagePicker from "expo-image-picker"
import * as jpeg from "jpeg-js"
import { gql } from "apollo-boost"
import { useMutation } from '@apollo/react-hooks';

var image = null
const UPDATE_EXISTTOGGLE = gql`
  mutation update_existToggle($email: String!, $existToggle: Boolean!) {
    update_existToggle(email: $email, existToggle: $existToggle)
  }
`;
//
const useInitTensorFlow = (): boolean => {
  const [isTfReady, setIsTfReady] = useState(false);
  const initializeTf = async () => {
    await tf.ready();
    setIsTfReady(true);
  };
  useEffect(() => {
    initializeTf();
  }, []);

  return isTfReady;
};


const usePosenetModel = (): PoseNet | null => {
  const [posenetModel, setPosenetModel] = useState<any>(null);

  const initModel = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    
    const posenetModel = await posenet.load({
      // Config param information
      // https://github.com/tensorflow/tfjs-models/tree/master/posenet#config-params-in-posenetload
      architecture: "MobileNetV1",
      outputStride: 16,
      inputResolution: { width: inputTensorWidth, height: inputTensorHeight },
      multiplier: 0.75,
      quantBytes: 2,
    });

    setPosenetModel(posenetModel);
  };

  useEffect(() => {
    initModel();
    
  }, []);

  return posenetModel;
};
const AUTORENDER = false;

const useModel = ()=> {
  const [model, setModel] = useState<any>(null);

  const initModela = async () => {
    const models = await mobilenet.load()
    // const models = await cocoSsd.load({ base: 'mobilenet_v2' });
    // const models = await cocossd.load() // preparing COCO-SSD model
    setModel(models)
  };

  useEffect(() => {
    initModela();
    
  }, []);

  return model;
};
const TensorCamera = cameraWithTensors(Camera);

let a = undefined
const PoseCamera = () => {
  const posenetModel = usePosenetModel();
  const mobilenetModel =useModel();
  const [pose, setPose] = useState<posenet.Pose | null>(null);
  const rafId = useRef<number | null>(null);
  const camRef = useRef<any>(null);
  const [button, setButton] = useState(false)
  const [existToggleMutation] = useMutation(UPDATE_EXISTTOGGLE);

  // const [predictions, setPredictions] = useState()
  // const getPrediction = async () => {
  //   const prediction = await mobilenetModel.classify(image, 1)
  //   // const prediction = await mobilenetModel.detect(tensor)
  //   console.log(`prediction: ${JSON.stringify(prediction)}`)
  // }

  const handleImageTensorReady = async (
    images: IterableIterator<tf.Tensor3D>,
    updatePreview: () => void,
    gl: ExpoWebGLRenderingContext
  ) => {
    a =  setInterval(async()=>{
    console.log("button")
    if (!AUTORENDER && !button) {
      updatePreview();
    }
      const imageTensor = images.next().value;
      const flipHorizontal = Platform.OS === "ios" ? false : true;
      const pose = await posenetModel.estimateSinglePose(imageTensor, {
        flipHorizontal,
      });
        setPose(pose);
      tf.dispose([imageTensor]); 
      console.log(pose.score)    

      if(pose.score>0.1){
        existToggleMutation({variables: { email: "woobink123@hanmail.net", existToggle: true },
      });
    }
      if (!AUTORENDER) {
        gl.endFrameEXP();
      }
      }, 40000);
}
////////////////////

// //////
  if (!posenetModel) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  // TODO File issue to be able get this from expo.
  // Caller will still need to account for orientation/phone rotation changes
  let textureDims: { width: number; height: number };
  if (Platform.OS === "ios") {
    textureDims = {
      height: 1920,
      width: 1080,
    };
  } else {
    textureDims = {
      height: 1200,
      width: 1600,
    };
  }

  return (
    <>
    <View style={[{ justifyContent: "center", alignItems: "center" }]}>
      <View style={styles.cameraContainer}>
        <TensorCamera
          ref={camRef}
          style={[styles.camera]}
          type={Camera.Constants.Type.front}
          zoom={0}
          cameraTextureHeight={textureDims.height}
          cameraTextureWidth={textureDims.width}
          resizeHeight={inputTensorHeight}
          resizeWidth={inputTensorWidth}
          resizeDepth={3}
          onReady={handleImageTensorReady}
          autorender={false}
        />
      </View>
      <View style={[styles.modelResults]}>
          {pose && <Pose pose={pose} />}
      </View> 
    </View>
      <View style={[{ marginTop:50}]}>
            <Button
            title="stop"
            onPress={()=>{
              clearInterval(a)
       }}
            />
      </View>
      </>
  );
};

export default function Apps() {
  const isTfReady = useInitTensorFlow();
  
  if (!isTfReady) {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
      </View>
    );
  }

  return <PoseCamera />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  
  cameraContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    height: "50%",
    backgroundColor: "#fff",
  },
  camera: {
    position: "absolute",
    width: 600 / 4,
    height: 800 / 4,
    zIndex: 1,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 0,
  },
  modelResults: {
    position: "absolute",
    
    width: 600 / 4,
    height: 800 / 4,
    zIndex: 20,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 0,
  },
});
 // const loop = async () => {
  //   if (!AUTORENDER) {
  //     updatePreview();
  //   }
  //   const imageTensor = images.next().value;

  //   const flipHorizontal = Platform.OS === "ios" ? false : true;

  //   const pose = await posenetModel.estimateSinglePose(imageTensor, {
  //     flipHorizontal,
  //   });
  //   setPose(pose);
  //   tf.dispose([imageTensor]);     
  //   // await getPrediction(imageTensor)

  //   if (!AUTORENDER) {
  //     gl.endFrameEXP();
  //   }
  //   rafId.current = requestAnimationFrame(loop);
  // };
  // loop()


// import React, { useEffect, useRef, useState } from "react";
// import * as tf from "@tensorflow/tfjs";
// import { Button, Platform, StyleSheet, Text, View,Image } from "react-native";
// import * as Permissions from "expo-permissions";
// import * as posenet from "@tensorflow-models/posenet";
// import { cameraWithTensors ,fetch} from "@tensorflow/tfjs-react-native";
// import { Camera } from "expo-camera";
// import { inputTensorHeight, inputTensorWidth, Pose } from "./Pose";
// import { PoseNet } from "@tensorflow-models/posenet";
// import { ExpoWebGLRenderingContext } from "expo-gl";
// //==
// import * as cocoSsd from "@tensorflow-models/coco-ssd"
// import * as mobilenet from "@tensorflow-models/mobilenet"

// import * as ImagePicker from "expo-image-picker"
// import * as jpeg from "jpeg-js"
// var image = null

// //
// const useInitTensorFlow = (): boolean => {
//   const [isTfReady, setIsTfReady] = useState(false);

//   const initializeTf = async () => {
//     await tf.ready();
//     setIsTfReady(true);
//   };

//   useEffect(() => {
//     initializeTf();
//   }, []);

//   return isTfReady;
// };


// const usePosenetModel = (): PoseNet | null => {
//   const [posenetModel, setPosenetModel] = useState<any>(null);

//   const initModel = async () => {
//     await Permissions.askAsync(Permissions.CAMERA);
//     await Permissions.askAsync(Permissions.CAMERA_ROLL);
    
//     const posenetModel = await posenet.load({
//       // Config param information
//       // https://github.com/tensorflow/tfjs-models/tree/master/posenet#config-params-in-posenetload
//       architecture: "MobileNetV1",
//       outputStride: 16,
//       inputResolution: { width: inputTensorWidth, height: inputTensorHeight },
//       multiplier: 0.75,
//       quantBytes: 2,
//     });

//     setPosenetModel(posenetModel);
//   };

//   useEffect(() => {
//     initModel();
    
//   }, []);

//   return posenetModel;
// };
// const AUTORENDER = false;
// //=
// //  const usemodel = ()=>{
// //  const [model, setModel] = useState(null)

// //  const setting = async () => {
// //      const model = await cocoSsd.load()
// //      setModel(model)
// //  }
// //  useEffect(()=>{
// //    setting()
// //    },[])
// //  return model
// //  }
// //
// // tslint:disable-next-line: variable-name
// const TensorCamera = cameraWithTensors(Camera);


// const PoseCamera = () => {
//   // const model =usemodel();
//   const posenetModel = usePosenetModel();
//   const [pose, setPose] = useState<posenet.Pose | null>(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const rafId = useRef<number | null>(null);
//   const camRef = useRef<any>(null);

//   const [predictions, setPredictions] = useState()


//   const handleImageTensorReady = async (
//     images: IterableIterator<tf.Tensor3D>,
//     updatePreview: () => void,
//     gl: ExpoWebGLRenderingContext
//   ) => {
//     console.log(images,"09090")
//     const loop = async () => {
//       if (!AUTORENDER) {
//         updatePreview();
//       }

//       const imageTensor = images.next().value;
      

//       const flipHorizontal = Platform.OS === "ios" ? false : true;

//       const pose = await posenetModel.estimateSinglePose(imageTensor, {
//         flipHorizontal,
//       });

//       setPose(pose);
//       tf.dispose([imageTensor]);

//       if (!AUTORENDER) {
//         gl.endFrameEXP();
//       }

//       rafId.current = requestAnimationFrame(loop);
//     };
//     //=
//     const imageTensor = images.next().value;
//     // classifyImage(imageTensor)
//     // const prediction = await model.detect(imageTensor)
//     // setPredictions(prediction)
//     // console.log(prediction,"prediction")      
//     //
//     loop();
//   };
// //
//   useEffect(() => {
//     return () => {
//       if (rafId.current) {
//         cancelAnimationFrame(rafId.current);
//       }
//     };
//   }, []);

//   const startRecording = async () => {
//     setIsRecording(true);
//     console.log("Starting recording");
//     await camRef.current.camera.recordAsync();
//     console.log("Done Recording");
//     setIsRecording(false);
//   };

//   if (!posenetModel) {
//     return (
//       <View>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   // TODO File issue to be able get this from expo.
//   // Caller will still need to account for orientation/phone rotation changes
//   let textureDims: { width: number; height: number };
//   if (Platform.OS === "ios") {
//     textureDims = {
//       height: 1920,
//       width: 1080,
//     };
//   } else {
//     textureDims = {
//       height: 1200,
//       width: 1600,
//     };
//   }
// ////////////////////////////////////////////////////////////////////
// // const classifyImage = async ({imageTensor}) => {
// //   try {
// //     const prediction = await model.detect(imageTensor)
// //     setPredictions(prediction)
// //     // console.log(predictions)
// //   } catch (error) {
// //     console.log(error)
// //   }
// // }
// // const renderPrediction = (prediction, index) => {
// //   const pclass = prediction.class
// //   const score = prediction.score
// //   const x = prediction.bbox[0]
// //   const y = prediction.bbox[1]
// //   const w = prediction.bbox[2]
// //   const h = prediction.bbox[3]
// //   return (
// //     <Text key={index} style={styles.text}>
// //       Prediction: {pclass} {", "} Probability: {score} {", "} Bbox: {x} {", "} {y} {", "} {w}{" "}
// //       {", "} {h}
// //     </Text>
// //   )
// // }
// ////////////////////////

//   return (
//     <View style={[{ justifyContent: "center", alignItems: "center" ,flex:1}]}>
//       <View style={styles.cameraContainer}>
//         <TensorCamera
//           ref={camRef}
//           // Standard Camera props
//           style={[styles.camera]}
//           type={Camera.Constants.Type.front}
//           zoom={0}
//           // tensor related props
//           cameraTextureHeight={textureDims.height}
//           cameraTextureWidth={textureDims.width}
//           resizeHeight={inputTensorHeight}
//           resizeWidth={inputTensorWidth}
//           resizeDepth={3}
//           onReady={handleImageTensorReady}
//           autorender={AUTORENDER}
//         />

//         <View style={[styles.modelResults]}>
//           {pose && <Pose pose={pose} />}
//         </View>
//         {/* {  predictions.map((p, index) => renderPrediction(p, index))} */}

//       </View>
//       {/* <View style={{ bottom: 200 }}>
      
//         {isRecording ? (
//           <Button
//             title={"Stop Recording"}
//             onPress={async () => {
//               camRef.current.camera.stopRecording();
//             }}
//           />
//         ) : (
//           <Button
//             title={"Start Recording"}
//             onPress={() => {
//               startRecording();
//                }}
//           />
//         )}
//       </View> */}
//     </View>
//   );
// };

// export default function Apps() {
//   const isTfReady = useInitTensorFlow();
  
//   if (!isTfReady) {
//     return (
//       <View style={styles.container}>
//         <Text>Loading</Text>
//       </View>
//     );
//   }

//   return <PoseCamera />
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   cameraContainer: {
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     width: "100%",
//     height: "100%",
//     backgroundColor: "#fff",
//   },
//   camera: {
//     position: "absolute",
//     left: 50,
//     top: 100,
//     width: 600 / 2,
//     height: 800 / 2,
//     zIndex: 1,
//     borderWidth: 1,
//     borderColor: "black",
//     borderRadius: 0,
//   },
//   modelResults: {
//     position: "absolute",
//     left: 50,
//     top: 100,
//     width: 600 / 2,
//     height: 800 / 2,
//     zIndex: 20,
//     borderWidth: 1,
//     borderColor: "black",
//     borderRadius: 0,
//   },
//   recordingButton: {
//     position: "absolute",
//     left: 50,
//     bottom: 150,
//   },
//   text: {
//     color: "#ffffff",
//     fontSize: 16,
//   },
// });