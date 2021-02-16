import React, { useState, useEffect } from "react"
import * as Permissions from "expo-permissions"
import { Image, ScrollView, TouchableOpacity } from "react-native"
import * as MediaLibrary from "expo-media-library"
import styled from "styled-components"
import Loader from "../../components/Loader"
import constants from "../../constants"
import styles from "../../styles"
import { Platform } from "react-native"

const View = styled.View`
  flex: 1;
`

const Button = styled.TouchableOpacity`
  width: 100px;
  height: 30px;
  position: absolute;
  right: 5px;
  top: 15px;
  background-color: ${styles.blueColor};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`

const Text = styled.Text`
  color: white;
  font-family: "GmarketMedium";
`

export default ({ navigation }) => {
  const [loading, setLoading] = useState(true)
  const [hasPermission, setHasPermission] = useState(false)
  const [selected, setSelected] = useState()
  const [allPhotos, setAllPhotos] = useState()
  const changeSelected = (photo) => {
    setSelected(photo)
  }
  let OSPhoto = Platform.OS == "ios" ? 500 : 300
  const getPhotos = async () => {
    try {
      const { assets } = await MediaLibrary.getAssetsAsync({ first: OSPhoto })
      const [firstPhoto] = assets
      setSelected(firstPhoto)
      setAllPhotos(assets)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }
  const askPermission = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if (status === "granted") {
        setHasPermission(true)
        getPhotos()
      }
    } catch (e) {
      console.log(e)
      setHasPermission(false)
    }
  }
  const handleSelected = () => {
    navigation.navigate("Upload", { photo: selected })
  }
  useEffect(() => {
    askPermission()
  }, [])
  return (
    <View>
      {loading ? (
        <Loader />
      ) : (
        <View>
          {hasPermission ? (
            <>
              <Image
                style={{ width: constants.width, height: constants.height / 2.5 }}
                source={{ uri: selected.uri }}
              />

              <Button onPress={handleSelected}>
                <Text>Select Photo</Text>
              </Button>

              <ScrollView
                contentContainerStyle={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {allPhotos.map((photo) => (
                  <TouchableOpacity key={photo.id} onPress={() => changeSelected(photo)}>
                    <Image
                      source={{ uri: photo.uri }}
                      style={{
                        width: constants.width / 4,
                        height: constants.height / 8,
                        opacity: photo.id === selected.id ? 0.5 : 1,
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          ) : null}
        </View>
      )}
    </View>
  )
}
// import React, { useState, useEffect } from "react"
// import * as Permissions from "expo-permissions"
// import {
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
// } from "react-native"
// import * as MediaLibrary from "expo-media-library"
// import styled from "styled-components"
// import Loader from "../../components/Loader"
// import constants from "../../constants"
// import styles from "../../styles"
// import * as ImagePicker from "expo-image-picker"
// import * as FileSystem from "expo-file-system"
// import Icon from "../../components/Icon"
// const View = styled.View`
//   flex: 1;
//   justify-content: center;
//   align-items: center;
// `

// const Button = styled.TouchableOpacity`
//   width: 100px;
//   height: 30px;
//   right: 5px;
//   top: 15px;
//   background-color: ${styles.blueColor};
//   justify-content: center;
//   align-items: center;
//   border-radius: 5px;
// `

// const Text = styled.Text`
//   color: white;
//   font-family: "GmarketBold";
// `
// const ChoosePhoto = styled.TouchableOpacity`
//   width: ${constants.width / 1.5};
//   height: ${constants.width / 1.5};
//   border-color: rgba(15, 76, 130, 1);
//   border-width: 2;
//   border-style: dashed;
//   position: relative;
//   justify-content: center;
//   align-items: center;
//   margin-bottom: 5;
// `

// const ImageContainer = styled.Image`
//   width: ${constants.width / 1.6};
//   height: ${constants.width / 1.6};
//   position: absolute;
// `
// const RowView = styled.View`
//   flex-direction: row;
// `
// export default ({ navigation }) => {
//   const [loading, setLoading] = useState(true)
//   const [hasPermission, setHasPermission] = useState(false)
//   const [selected, setSelected] = useState()
//   const [allPhotos, setAllPhotos] = useState()
//   const changeSelected = (photo) => {
//     setSelected(photo)
//   }
//   const getPhotos = async () => {
//     try {
//       const { assets } = await MediaLibrary.getAssetsAsync()
//       const [firstPhoto] = assets
//       setSelected(firstPhoto)
//       setAllPhotos(assets)
//     } catch (e) {
//       console.log(e)
//     } finally {
//       setLoading(false)
//     }
//   }
//   const askPermission = async () => {
//     try {
//       const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
//       if (status === "granted") {
//         setHasPermission(true)
//         getPhotos()
//       }
//       setisModelReady(true)
//     } catch (e) {
//       console.log(e)
//       setHasPermission(false)
//     }
//   }
//   const handleSelected = () => {
//     if (image !== null) {
//       navigation.navigate("Upload", { photo: image })
//     } else {
//       Alert.alert("이미지 파일을 최소 1개 이상 등록해주세요.")
//     }
//   }

//   const [isModelReady, setisModelReady] = useState(false)
//   const [image, setimage] = useState(null)

//   const selectImage = async () => {
//     try {
//       let response = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.All,
//         allowsEditing: true,
//         aspect: [4, 3],
//       })

//       if (!response.cancelled) {
//         const source = { uri: response.uri }
//         setimage(source)
//         // detectObjects()
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   useEffect(() => {
//     askPermission()
//   }, [])
//   return (
//     <View>
//       {loading ? (
//         <Loader />
//       ) : (
//         <View>
//           {hasPermission ? (
//             <>
//               {/* <Image
//                 style={{ width: constants.width, height: constants.height / 2.5 }}
//                 source={{ uri: selected.uri }}
//               /> */}
//               <ChoosePhoto onPress={isModelReady ? selectImage : undefined}>
//                 {image && <ImageContainer source={image} />}

//                 {isModelReady && !image && (
//                   <Icon
//                     name={
//                       Platform.OS === "ios" ? "ios-add-circle-outline" : "md-add-circle-outline"
//                     }
//                     color={"grey"}
//                     size={45}
//                   />
//                 )}
//               </ChoosePhoto>
//               <Button onPress={handleSelected}>
//                 <Text>Select Photo</Text>
//               </Button>
//               {/* <ScrollView
//                 contentContainerStyle={{
//                   flexDirection: "row",
//                   flexWrap: "wrap",
//                 }}
//               >
//                 {allPhotos.map((photo) => (
//                   <TouchableOpacity key={photo.id} onPress={() => changeSelected(photo)}>
//                     <Image
//                       source={{ uri: photo.uri }}
//                       style={{
//                         width: constants.width / 4,
//                         height: constants.height / 8,
//                         opacity: photo.id === selected.id ? 0.5 : 1,
//                       }}
//                     />
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView> */}
//             </>
//           ) : null}
//         </View>
//       )}
//     </View>
//   )
// }

// const styless = StyleSheet.create({
//   imageWrapper: {
//     width: 280,
//     height: 280,
//     padding: 10,
//     borderColor: "blue",
//     borderWidth: 5,
//     borderStyle: "dashed",
//     marginTop: 40,
//     marginBottom: 10,
//     position: "relative",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   ImageContainer: {
//     width: 250,
//     height: 250,
//     position: "absolute",
//     top: 10,
//     left: 10,
//     bottom: 10,
//     right: 10,
//   },

//   transparentText: {
//     color: "#ffffff",
//     opacity: 0.7,
//   },
// })
