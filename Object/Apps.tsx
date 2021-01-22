import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { Button, Platform, StyleSheet, Text, View,TouchableOpacity, ScrollView ,Dimensions,Image} from "react-native";
import * as Permissions from "expo-permissions";
import * as posenet from "@tensorflow-models/posenet";
import { cameraWithTensors ,fetch} from "@tensorflow/tfjs-react-native";
import { Camera } from "expo-camera";
import { inputTensorHeight, inputTensorWidth, Pose } from "./Pose";
import { PoseNet } from "@tensorflow-models/posenet";
import { ExpoWebGLRenderingContext } from "expo-gl";
import Icon from "../components/Icon"
import * as mobilenet from "@tensorflow-models/mobilenet"
import { gql } from "apollo-boost"
import { useMutation } from '@apollo/react-hooks';
import * as ScreenOrientation from "expo-screen-orientation"
//==
import constants from "../constants"
import styled from "styled-components"
import useInterval from "../hooks/useInterval"
import moment from 'moment';

import * as cocossd from "@tensorflow-models/coco-ssd"
import * as FileSystem from "expo-file-system"

import * as ImagePicker from "expo-image-picker"
import * as jpeg from "jpeg-js"

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")

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
    clearInterval(studyInterval)

  }, []);

  return model;
};
const TensorCamera = cameraWithTensors(Camera);

let studyInterval = undefined
const PoseCamera = ({studyBool,setStudyBool,navigation,myInfoData,myInfoRefetch}) => {
  const posenetModel = usePosenetModel();
  const mobilenetModel =useModel();
  const [pose, setPose] = useState<posenet.Pose | null>(null);
  const rafId = useRef<number | null>(null);
  const camRef = useRef<any>(null);
  const [button, setButton] = useState(false)
  const [existToggleMutation] = useMutation(UPDATE_EXISTTOGGLE);
  const cameraRef = useRef()

  const handleImageTensorReady = async (
    images: IterableIterator<tf.Tensor3D>,
    updatePreview: () => void,
    gl: ExpoWebGLRenderingContext
  ) => {

    studyInterval = setInterval(async()=>{
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
  
      myInfoRefetch() 
      // console.log(Dimensions.get('window').width,"Dimensions.get('window').width")
      // console.log(Dimensions.get('window').height,"Dimensions.get('window').height")
    //   if(pose.score>0.1){
    //     existToggleMutation({variables: { email: myInfoData.me.email, existToggle: true },
    //   })
    //  }else{
    //   existToggleMutation({variables: { email: myInfoData.me.email, existToggle: false },
    //   })
    //  }
      if (!AUTORENDER) {
        gl.endFrameEXP();
      }
      }, 10000);
  }

  if (!posenetModel) {
    return (
      <View>
        <Text></Text>
      </View>
    );
  }

  // TODO File issue to be able get this from expo.
  // Caller will still need to account for orientation/phone rotation changes
  let textureDims: { width: number; height: number };
  if (Platform.OS === "ios") {
    textureDims = {
      width: 1920,
      height: 1080,
      // height: 1920,
      // width: 1080,
     
    };
  } else {
    textureDims = {
      // height: 1200,
      // width: 1600,
      width: 1200,
      height: 1600,
      
    };
  }

  // width:Dimensions.get("window").width/2,
  // height:Dimensions.get("window").height/2,
  // borderWidth:1,
  // backgroundColor:"rgba(196, 196, 196, 1)"}
  return (
    <>
    <View style={styles.people}>
      <TouchableOpacity onPress={()=>{
          clearInterval(studyInterval)
          ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
          navigation.navigate("TabNavigation")
      }}>
      <Icon name={Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"} color={"#000000"} size={40}/>
      </TouchableOpacity>
    <ScrollView style={{ backgroundColor: "#ffffff" ,width:WIDTH/5*4 }} horizontal={true}>
    <View style={styles.indiviList}>
    <Image
      style={{
        height: HEIGHT / 18,
        width: HEIGHT / 18,
        borderRadius: 25,
        marginTop: 0,
        marginBottom: 0,
        borderWidth: 3.5,
        borderColor: 
        myInfoData.me.existToggle
          ? "rgba(65, 129, 247, 1)"
          : "rgba(133, 133, 133, 1)",
             }}
      source={{ uri: myInfoData.me.avatar }}
      />
      <Text>
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
        <Text>
          {list.username.length > 6 ? list.username.substr(0, 5) + "..." : list.username}
        </Text>
      </View>
    ))} 
    </ScrollView>
    <View style={styles.refresh}>
      {/* <TouchableOpacity onPress={()=>myInfoRefetch()}>
           <Icon name={Platform.OS === "ios" ? "ios-refresh" : "md-refresh"} color={"#000000"} size={25}/>
      </TouchableOpacity> */}
    </View>

    </View>

    <View style={[{justifyContent: "center",alignItems: "center"}]}>
    {/* <View style={styles.cameraContainer1}> 
        <Camera
          ref={cameraRef}
          style={[styles.camera]}
          type={Camera.Constants.Type.front}
          // cameraTextureHeight={Dimensions.get("window").height/4}
          // cameraTextureWidth={Dimensions.get("window").width/1}
          
        />
      </View> */}
      <View style={styles.cameraContainer}> 
        <TensorCamera
          ref={camRef}
          style={[styles.camera]}
          type={Camera.Constants.Type.front}
          zoom={0}
          // cameraTextureHeight={Dimensions.get("window").height/4}
          // cameraTextureWidth={Dimensions.get("window").width/1}
          cameraTextureHeight={textureDims.height}
          cameraTextureWidth={textureDims.width}
          // resizeHeight={200}
          // resizeWidth={152}
          resizeWidth={200}
          resizeHeight={152}
          resizeDepth={3}
          onReady={handleImageTensorReady}
          autorender={false}
        />
      </View>
      {/* <View style={[styles.modelResults]}>
          {pose && <Pose pose={pose} />}
      </View>  */}
    </View>
     
      </>
  );
};

export default function Apps({studyBool,setStudyBool,navigation,myInfoData,myInfoRefetch}) {
  const isTfReady = useInitTensorFlow();
  
  if (!isTfReady) {
    return (
      <View style={styles.container}>
              <View style={styles.cameraContainer}> 
        <Text>Loading</Text>
        </View>

      </View>
    );
  }

  return <PoseCamera studyBool={studyBool} setStudyBool={setStudyBool} navigation={navigation} myInfoData={myInfoData} myInfoRefetch={myInfoRefetch}/>
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
    height: Dimensions.get("window").height/15,
    width: Dimensions.get("window").width/1,
    // height: Dimensions.get("window").width/1,
    // width: Dimensions.get("window").height/15,
    paddingLeft:10
  },
  people: {
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    height: Dimensions.get("window").height/10,
    width: Dimensions.get("window").width/1,
    // height: Dimensions.get("window").width/1,
    // width: Dimensions.get("window").height/10,
    paddingLeft:10,
    paddingTop:10,
    flexDirection:"row",
    // borderWidth:1,
    borderColor: "grey",

  },
  cameraContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").width/1.5/1.2,
    width: Dimensions.get("window").height/2/1.1,
    // width: Dimensions.get("window").width/1.5/1.2,
    // height: Dimensions.get("window").height/2/1.1,
    backgroundColor: "#fff",
  },
  cameraContainer1: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").width/1.5/1.2,
    width: Dimensions.get("window").height/2/1.1,
    // width: Dimensions.get("window").width/1.5/1.2,
    // height: Dimensions.get("window").height/2/1.1,
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
    width: 600 / 3,
    height: 800 / 3,
    zIndex: 20,
    borderWidth: 0,
    borderColor: "grey",
    borderRadius: 0,
  },
  indiviList:{
    justifyContent:"center",
    alignItems: "center",
    marginLeft:9,
    flex:1,
    width:Dimensions.get('window').width/6.5
  },
  refresh:{
    justifyContent:"center",
    alignItems: "center",
    flex:1,
    width:Dimensions.get('window').width/6.5
  },
});
 


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