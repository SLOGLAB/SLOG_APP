import React, { useState, useEffect } from "react"
import axios from "axios"
import { Image, ActivityIndicator, Alert } from "react-native"
import styled from "styled-components"
import { gql } from "apollo-boost"
import useInput from "../../hooks/useInput"
import styles from "../../styles"
import constants from "../../constants"
import { useMutation } from "@apollo/react-hooks"
import { ME } from "../../screens/Profile/UserProfile"
import imageResize from "../../components/imageResize"
import { Platform } from "react-native"

const View = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
`

const Container = styled.View`
  padding: 20px;
`

const Form = styled.View``

const STextInput = styled.TextInput`
  margin-bottom: 10px;
  border: 0px solid ${styles.lightGreyColor};
  border-bottom-width: 1px;
  padding-bottom: 10px;
  width: ${constants.width - 180};
`

const Button = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.blueColor};
  padding: 10px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`

const Text = styled.Text`
  color: white;
  font-weight: 600;
`
// const UPLOAD = gql`
//   mutation editAvatar($location: String!, $key: String!) {
//     editAvatar(location: $location, key: $key)
//   }
// `

export const EDIT_AVATAR = gql`
  mutation editAvatar($location: String!, $key: String!) {
    editAvatar(location: $location, key: $key)
  }
`

export const DELETE_AVATAR = gql`
  mutation deleteAvatar {
    deleteAvatar
  }
`
export default ({ navigation }) => {
  const [loading, setIsLoading] = useState(false)
  const photo = navigation.getParam("photo")
  const [selectFile, setSelectFile] = useState(null)

  const [editAvatarMuation] = useMutation(EDIT_AVATAR, {
    refetchQueries: () => [{ query: ME }],
  })
  const [deleteAvatarMuation] = useMutation(DELETE_AVATAR)
  // const handleFileInput = (photo) => {
  //   imageResize(photo, "preview-img", 640, setSelectFile)
  // }

  const onAvatar = async () => {
    // handleFileInput(photo)
    const formData = new FormData()

    // console.log(photo, "1212")
    const name = photo.filename
    const [, type] = name.split(".")

    formData.append("file", {
      name,
      type: type.toLowerCase(),
      uri: photo.uri,
    })

    try {
      setIsLoading(true)
      // console.log(formData, "formdata")
      // Alert.alert("프로필 이미지 변경 중...")
      const { data } = await axios.post(
        // process.env.REACT_APP_BACKEND_URI + "/api/upload/avatar",
        "https://slog-deeptime-backend.herokuapp.com/api/upload/avatar",
        // `http://${Platform.OS === "ios" ? "localhost" : "10.0.2.2"}:4000/api/upload/avatar`,
        // `http://192.168.0.229:19001/api/upload/avatar`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      )
      const {
        data: { editAvatar },
      } = await editAvatarMuation({
        variables: { location: data.location, key: data.key },
      })
      if (!editAvatar) {
        Alert.alert("프로필 이미지를 변경할 수 없습니다.")
      } else {
        setSelectFile(null)
        Alert.alert("프로필 이미지가 변경 되었습니다.")
        // await refetch()
        // return true
      }
    } catch (e) {
      console.log(e, "avatarError") //문제
      // Alert.alert("Error!IAM 사이트에서 변경하세요.")
      // return false
      // Alert.alert("Cant upload", "Try later")
    } finally {
      navigation.navigate("UserProfile")
      setIsLoading(false)
    }
  }

  const deleteAvatar = async () => {
    try {
      Alert.alert("프로필 이미지를 변경 중...")
      const {
        data: { deleteAvatar },
      } = await deleteAvatarMuation()
      if (!deleteAvatar) {
        Alert.alert("프로필 이미지를 변경할 수 없습니다.")
      } else {
        setSelectFile(null)
        await refetch()
        Alert.alert("프로필 이미지가 변경 되었습니다.")
        return true
      }
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
      return false
    }
  }
  // const handleSubmit = async () => {
  //   if (captionInput.value === "" || locationInput.value === "") {
  //     Alert.alert("All fields are required")
  //   }
  //   const formData = new FormData()
  //   const name = photo.filename
  //   const [, type] = name.split(".")
  //   formData.append("file", {
  //     name,
  //     type: type.toLowerCase(),
  //     uri: photo.uri,
  //   })
  //   try {
  //     setIsLoading(true)
  //     const {
  //       data: { location },
  //     } = await axios.post(process.env.REACT_APP_BACKEND_URI + "/api/upload/avatar", formData, {
  //       headers: {
  //         "content-type": "multipart/form-data",
  //       },
  //     })

  //     const {
  //       data: { upload },
  //     } = await uploadMutation({
  //       variables: {
  //         location: data.location,
  //         key: data.key,
  //       },
  //     })
  //     if (upload.id) {
  //       navigation.navigate("TabNavigation")
  //     }
  //   } catch (e) {
  //     Alert.alert("Cant upload", "Try later")
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }
  // useEffect(() => {
  //   console.log(photo)
  // }, [])
  return (
    <View>
      <Container>
        <Image
          source={{ uri: photo.uri }}
          style={{ height: 200, width: 200, borderRadius: 100, marginBottom: 30 }}
        />
        <Form>
          {/* <STextInput
            onChangeText={captionInput.onChange}
            value={captionInput.value}
            placeholder="Caption"
            multiline={true}
            placeholderTextColor={styles.darkGreyColor}
          />
          <STextInput
            onChangeText={locationInput.onChange}
            value={locationInput.value}
            placeholder="Location"
            multiline={true}
            placeholderTextColor={styles.darkGreyColor}
          /> */}
          <Button
            onPress={async () => {
              await onAvatar()
              // const fucResult = await onAvatar()
              // if (fucResult) {
              //   close()
              // }
            }}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text>사진 변경</Text>}
          </Button>
        </Form>
      </Container>
    </View>
  )
}
// import React, { useState, useEffect } from "react"
// import axios from "axios"
// import { Image, ActivityIndicator, Alert } from "react-native"
// import styled from "styled-components"
// import { gql } from "apollo-boost"
// import useInput from "../../hooks/useInput"
// import styles from "../../styles"
// import constants from "../../constants"
// import { useMutation } from "@apollo/react-hooks"
// // import { ME } from "../../screens/Profile/UserProfile"
// // import imageResize from "../../Components/imageResize"

// const View = styled.View`
//   align-items: center;
//   justify-content: center;
//   flex: 1;
// `

// const Container = styled.View`
//   padding: 20px;
// `

// const Form = styled.View``

// const STextInput = styled.TextInput`
//   margin-bottom: 10px;
//   border: 0px solid ${styles.lightGreyColor};
//   border-bottom-width: 1px;
//   padding-bottom: 10px;
//   width: ${constants.width - 180};
// `

// const Button = styled.TouchableOpacity`
//   background-color: ${(props) => props.theme.blueColor};
//   padding: 10px;
//   border-radius: 4px;
//   align-items: center;
//   justify-content: center;
// `

// const Text = styled.Text`
//   color: white;
//   font-weight: 600;
// `
// // const UPLOAD = gql`
// //   mutation editAvatar($location: String!, $key: String!) {
// //     editAvatar(location: $location, key: $key)
// //   }
// // `

// export const EDIT_AVATAR = gql`
//   mutation editAvatar($location: String!, $key: String!) {
//     editAvatar(location: $location, key: $key)
//   }
// `

// // export const DELETE_AVATAR = gql`
// //   mutation deleteAvatar {
// //     deleteAvatar
// //   }
// // `
// export default ({ navigation }) => {
//   const [loading, setIsLoading] = useState(false)
//   const photo = navigation.getParam("photo")
//   const [selectFile, setSelectFile] = useState(null)

//   const [editAvatarMuation] = useMutation(EDIT_AVATAR, {
//     refetchQueries: () => [{ query: ME }],
//   })
//   // const [deleteAvatarMuation] = useMutation(DELETE_AVATAR)

//   const onAvatar = async () => {
//     const formData = new FormData()

//     // formData.append("file", photo)

//     // const name = photo.filename
//     console.log(photo, "photo")
//     // const type = name.split(".")
//     formData.append("file", {
//       // name,
//       // type: type.toLowerCase(),
//       uri: photo.uri,
//     })

//     try {
//       setIsLoading(true)
//       // Alert.alert("프로필 이미지 변경 중...")
//       const { data } = await axios.post(
//         // process.env.REACT_APP_BACKEND_URI + "/api/upload/avatar",
//         "https://slog-iam-pl-backend.herokuapp.com/api/upload/avatar",
//         // `http://${Platform.OS === "ios" ? "localhost" : "10.0.2.2"}:4000/api/upload/avatar`,
//         formData,
//         {
//           headers: {
//             "content-type": "multipart/form-data",
//           },
//         }
//       )
//       const {
//         data: { editAvatar },
//       } = await editAvatarMuation({
//         variables: { location: data.location, key: data.key },
//       })
//       if (!editAvatar) {
//         Alert.alert("프로필 이미지를 변경할 수 없습니다.")
//       } else {
//         setSelectFile(null)
//         Alert.alert("프로필 이미지가 변경 되었습니다.")
//         // await refetch()
//         // return true
//       }
//     } catch (e) {
//       console.log(e, "안드로이드") //문제
//       // Alert.alert("Error!IAM 사이트에서 변경하세요.")
//       // return false
//       // Alert.alert("Cant upload", "Try later")
//     } finally {
//       navigation.navigate("UserProfile")
//       setIsLoading(false)
//     }
//   }

//   // const deleteAvatar = async () => {
//   //   try {
//   //     Alert.alert("프로필 이미지를 변경 중...")
//   //     const {
//   //       data: { deleteAvatar },
//   //     } = await deleteAvatarMuation()
//   //     if (!deleteAvatar) {
//   //       Alert.alert("프로필 이미지를 변경할 수 없습니다.")
//   //     } else {
//   //       setSelectFile(null)
//   //       await refetch()
//   //       Alert.alert("프로필 이미지가 변경 되었습니다.")
//   //       return true
//   //     }
//   //   } catch (e) {
//   //     const realText = e.message.split("GraphQL error: ")
//   //     Alert.alert(realText[1])
//   //     return false
//   //   }
//   // }
//   // const handleSubmit = async () => {
//   //   if (captionInput.value === "" || locationInput.value === "") {
//   //     Alert.alert("All fields are required")
//   //   }
//   //   const formData = new FormData()
//   //   const name = photo.filename
//   //   const [, type] = name.split(".")
//   //   formData.append("file", {
//   //     name,
//   //     type: type.toLowerCase(),
//   //     uri: photo.uri,
//   //   })
//   //   try {
//   //     setIsLoading(true)
//   //     const {
//   //       data: { location },
//   //     } = await axios.post(process.env.REACT_APP_BACKEND_URI + "/api/upload/avatar", formData, {
//   //       headers: {
//   //         "content-type": "multipart/form-data",
//   //       },
//   //     })

//   //     const {
//   //       data: { upload },
//   //     } = await uploadMutation({
//   //       variables: {
//   //         location: data.location,
//   //         key: data.key,
//   //       },
//   //     })
//   //     if (upload.id) {
//   //       navigation.navigate("TabNavigation")
//   //     }
//   //   } catch (e) {
//   //     Alert.alert("Cant upload", "Try later")
//   //   } finally {
//   //     setIsLoading(false)
//   //   }
//   // }
//   // useEffect(() => {
//   //   console.log(photo)
//   // }, [])
//   return (
//     <View>
//       <Container>
//         <Image
//           source={{ uri: photo.uri }}
//           style={{ height: 200, width: 200, borderRadius: 100, marginBottom: 30 }}
//         />
//         <Form>
//           {/* <STextInput
//             onChangeText={captionInput.onChange}
//             value={captionInput.value}
//             placeholder="Caption"
//             multiline={true}
//             placeholderTextColor={styles.darkGreyColor}
//           />
//           <STextInput
//             onChangeText={locationInput.onChange}
//             value={locationInput.value}
//             placeholder="Location"
//             multiline={true}
//             placeholderTextColor={styles.darkGreyColor}
//           /> */}
//           <Button
//             onPress={async () => {
//               await onAvatar()
//               // const fucResult = await onAvatar()
//               // if (fucResult) {
//               //   close()
//               // }
//             }}
//           >
//             {loading ? <ActivityIndicator color="white" /> : <Text>사진 변경</Text>}
//           </Button>
//         </Form>
//       </Container>
//     </View>
//   )
// }
