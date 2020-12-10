import React, { useEffect } from "react"
// import { SharedElement } from "react-navigation-shared-element"
import { TouchableOpacity, Image } from "react-native"
import constants from "../../../constants"
// export default class MainScreen extends React.Component {
//   renderItem(item) {
//     const { navigation } = this.props

export default ({ item, navigation }) => {
  // let items = item
  //   useEffect(() => {
  //     console.log(item)
  //   }, [])
  return (
    <Image
      style={{
        height: constants.width / 3.5,
        width: constants.width / 3.5,
        marginLeft: 10,
        marginTop: 10,
        borderRadius: 10,
      }}
      source={{ uri: item.files[0].url }}
    />
  )
}
