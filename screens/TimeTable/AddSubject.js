import React, { useState } from "react"
import styled from "styled-components"
import { TouchableWithoutFeedback, Alert, Keyboard, Picker, Dimensions, View } from "react-native"
import AuthInput from "../../components/AuthInput"
import useInput from "../../hooks/useInput"
import { useMutation } from "@apollo/react-hooks"
import { ADD_SUBJECT } from "./TimeTableQueries"
import AuthButton from "../../components/AuthButton"
import NativeColorPicker from "native-color-picker"
import { SUBJECT_NAME } from "../Tabs/QueryBox"
import { SCHEDULE_USER } from "../AWeekTime/TimetableWeek"

const View1 = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const View2 = styled.View`
  flex: 3;
`
const MenuView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const ViewS = styled.View`
  width: 50;
  height: 50;
  border-radius: 25;
  background-color: ${(props) => props.selectColor};
`
const View11 = styled.View`
  flex: 0.5;
`
export default AddSubject = ({ navigation }) => {
  const [colors] = useState([
    "#d73964",
    "#d23440",
    "#db643a",
    "#e88334",
    "#e2a71e",
    "#e25241",
    "#d0da59",
    "#4053ae",
    "#70b949",
    "#73564a",
    "#67ab5a",
    "#8f36aa",
    "#f6c244",
    "#52b9d0",
    "#4595ec",
    "#009688",
    "#5abeA7",
    "#59bccd",
    "#4a97e4",
    "#2d68cd",
    "#9946c7",
    "#d9639e",
    "#6d6f74",
    "#939287",
    "#868ea3",
  ])
  const [selected, setSelected] = useState("#e25241")
  const [modifyLoading, setModifyLoading] = useState(false)

  const subjectInput = useInput("")
  const [addsubjectMutation] = useMutation(ADD_SUBJECT, {
    variables: {
      name: subjectInput.value,
      bgColor: selected,
    },
    refetchQueries: () => [{ query: SUBJECT_NAME }, { query: SCHEDULE_USER }],
  })
  const goback = () => {
    navigation.navigate("Timecontrol")
  }
  const AddSubject = async () => {
    if (subjectInput.value === "") {
      Alert.alert("과목 이름을 입력하세요.")
      return
    }
    try {
      setModifyLoading(true)
      const {
        data: { addSubject },
      } = await addsubjectMutation()
      if (!addSubject) {
        Alert.alert("과목을 추가할 수 없습니다.")
      } else {
        subjectInput.setValue("")
      }
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
    } finally {
      setModifyLoading(false)
      goback()
    }
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <MenuView>
        <View1>
          <AuthInput
            {...subjectInput}
            placeholder="과목 이름 (예: 국어 or 문서작업)"
            keyboardType="default"
            returnKeyType="done"
            // onSubmitEditing={handleLogin}
            autoCorrect={false}
          />
        </View1>

        <View2>
          <View
            styled={{
              height: Dimensions.get("window").height,
              width: Dimensions.get("window").width,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <NativeColorPicker
              colors={colors}
              selectedColor={selected}
              onSelect={(item) => setSelected(item)}
              sort
              shadow
              markerType="checkmark"
              // markerDisplay="contrast"
              // markerDisplay="adjust"
              scrollEnabled={false}
            />
            {/* <Text
              style={{
                fontSize: 22,
                color: selected,
                fontWeight: "500",
                marginTop: 20,
              }}
            >
              색상{selected}
            </Text> */}
          </View>
        </View2>

        <View1>
          <View11>
            <AuthButton
              color="white"
              onPress={AddSubject}
              bgColor={"#0f4c82"}
              text="과목 추가"
              loading={modifyLoading}
            />
          </View11>
        </View1>
      </MenuView>
    </TouchableWithoutFeedback>
  )
}
