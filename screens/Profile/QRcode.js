import React, { useState, useEffect } from "react"
import { Text, View, StyleSheet, Button, Alert } from "react-native"
import Constants from "expo-constants"
import * as Permissions from "expo-permissions"
import ProfileBack from "../../components/ProfileBack"
import { BarCodeScanner } from "expo-barcode-scanner"

import { useMutation, useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"

export const CONNECT_STUDENT = gql`
  mutation connectStudent($secretCode: String!, $raspberrySerial: String!) {
    connectStudent(secretCode: $secretCode, raspberrySerial: $raspberrySerial)
  }
`
export default ({ navigation }) => {
  const [hasCameraPermission, sethasCameraPermission] = useState(null)
  const [scanned, setScannde] = useState(false)
  //
  const [raspberrySerial, setraspberrySerial] = useState("")
  const [secretCode, setsecretCode] = useState("")

  const [connectStudentMutation] = useMutation(CONNECT_STUDENT)

  const clearOnRegist = () => {
    setraspberrySerial("")
    setsecretCode("")
  }

  const onRegist = async () => {
    try {
      const {
        data: { connectStudent },
      } = await connectStudentMutation({
        variables: {
          secretCode: secretCode,
          raspberrySerial: raspberrySerial,
        },
      })
      if (!connectStudent) {
        Alert.alert("Meta을 연결할 수 없습니다.")
      } else {
        await clearOnRegist()
        await navigation.navigate("UserProfile")
        Alert.alert("Meta 연결이 완료되었습니다.")
        return true
      }
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
      // Alert.alert(e)

      return false
    }
  }
  //
  const askPermission = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA)

      if (status === "granted") {
        sethasCameraPermission(true)
      }
      if (hasCameraPermission === null) {
        return <Text> Requesting for camera permission </Text>
      }
      if (hasCameraPermission === false) {
        return <Text> No access to camera </Text>
      }
    } catch (e) {
      console.log(e)
      sethasCameraPermission(false)
    }
  }
  handleBarCodeScanned = ({ type, data }) => {
    setScannde(true)
    //
    setraspberrySerial(data)
    //
    alert(`${data}`)
  }
  useEffect(() => {
    // getPermissionsAsync()
    askPermission()
  })

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <View
        style={{
          flex: 0.8,
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <ProfileBack />
      </View>
      <View
        style={{
          flex: 5,
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />

        {scanned && <Button title={"QR코드 스캔"} onPress={() => setScannde(false)} />}
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 15 }}>{raspberrySerial}</Text>
        {scanned && <Button title={"Meta 연결"} onPress={() => onRegist()} />}
      </View>
    </View>
  )
}

// import React, { useState, useEffect } from "react"
// import { Text, View, StyleSheet, Button } from "react-native"
// import { BarCodeScanner } from "expo-barcode-scanner"

// export default () => {
//   const [hasPermission, setHasPermission] = useState(null)
//   const [scanned, setScanned] = useState(false)

//   useEffect(() => {
//     ;(async () => {
//       const { status } = await BarCodeScanner.requestPermissionsAsync()
//       setHasPermission(status === "granted")
//     })()
//   }, [])

//   const handleBarCodeScanned = ({ type, data }) => {
//     setScanned(true)
//     alert(`Bar code with type ${type} and data ${data} has been scanned!`)
//   }

//   if (hasPermission === null) {
//     return <Text>Requesting for camera permission</Text>
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>
//   }

//   return (
//     <View
//       style={{
//         flex: 1,
//         flexDirection: "column",
//         justifyContent: "flex-end",
//       }}
//     >
//       <BarCodeScanner
//         onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//         style={StyleSheet.absoluteFillObject}
//       />

//       {scanned && <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />}
//     </View>
//   )
// }
