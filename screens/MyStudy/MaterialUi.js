import * as React from "react"
import { Switch, TextInput } from "react-native-paper"

const MaterialUi = () => {
  //   const [isSwitchOn, setIsSwitchOn] = React.useState(false)

  //   const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn)

  //   return <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
  // }
  const [text, setText] = React.useState("")

  return <TextInput label="Email" value={text} onChangeText={(text) => setText(text)} />
}

export default MaterialUi
