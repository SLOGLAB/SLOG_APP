import React, { useState } from "react"
import styled from "styled-components"
import { TouchableWithoutFeedback, Dimensions, Keyboard, StyleSheet, Alert } from "react-native"
import RNPickerSelect from "react-native-picker-select"
import AuthInput from "../../../components/AuthInput"
import constants from "../../../constants"
import { useMutation } from "@apollo/react-hooks"
import { EDIT_SUBJECT } from "../TimeTableQueries"
import AuthButton from "../../../components/AuthButton"
import NativeColorPicker from "native-color-picker"
import { SUBJECT_NAME } from "../../Tabs/QueryBox"
import { SCHEDULE_USER } from "../../AWeekTime/TimetableWeek"
import { Ionicons } from "@expo/vector-icons"
const View1 = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const View2 = styled.View`
  flex: 3;
`
const View05 = styled.View`
  flex: 0.5;
  justify-content: center;
  align-items: center;
`
const View051 = styled.View`
  flex: 0.5;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`
const View052 = styled.View`
  justify-content: center;
  align-items: center;
  flex: 0.5;
`
const View053 = styled.View`
  justify-content: center;
  align-items: center;
  flex: 0.2;
`
const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`
const MenuView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const ViewS = styled.View`
  width: 40;
  height: 40;
  border-radius: 25;
  margin-right: 15;
  background-color: ${(props) => props.selectColor};
`
const BlueLine = styled.View`
  background-color: rgba(34, 76, 126, 1);
  height: 10;
`

export default ChangeSubPage = ({ subjectList, goback, subjectInput, colors }) => {
  const list = subjectList.map((file) => ({
    label: file.name,
    value: file.id,
  }))

  const [selected, setSelected] = useState("#e25241")
  const [valueid, setValueid] = useState("")
  const [subIndex, setSubIndex] = useState(0)
  const [modifyLoading, setModifyLoading] = useState(false)

  const [changesubjectMutation] = useMutation(EDIT_SUBJECT, {
    variables: {
      subjectId: valueid,
      bgColor: selected,
      name: subjectInput.value,
    },
    refetchQueries: () => [{ query: SUBJECT_NAME }, { query: SCHEDULE_USER }],
  })

  const onSelect = (value) => {
    if (value === null) {
      Alert.alert("과목을 선택하세요.")
    } else {
      const findSubIndex = (a) => a.id === value
      const subjectIndex = subjectList.findIndex(findSubIndex)
      setSubIndex(subjectIndex)
      subjectInput.setValue(subjectList[subjectIndex].name)
      setValueid(value)
      setSelected(subjectList[subjectIndex].bgColor)
    }
  }

  const EditSubject = () => {
    if (subjectInput.value === "" || valueid === "") {
      Alert.alert("과목을 선택하세요.")
      return
    }

    const excMutation = async () => {
      try {
        setModifyLoading(true)
        const {
          data: { editSubject },
        } = await changesubjectMutation()
        if (!editSubject) {
          Alert.alert("과목을 수정할 수 없습니다.")
        }
      } catch (e) {
        const realText = e.message.split("GraphQL error: ")
        Alert.alert(realText[1])
      } finally {
        setModifyLoading(false)
        goback()
      }
    }

    Alert.alert("", "수정 내용이 기존 스케줄에도 반영됩니다.\n그래도 수정하시겠습니까?", [
      {
        text: "YES",
        onPress: () => {
          excMutation()
        },
      },
      {
        text: "NO",
        onPress: () => {
          return
        },
        style: "cancel",
      },
    ])
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <MenuView>
        <View1>
          <View052 style={{ width: constants.width / 2 }}>
            <RNPickerSelect
              onValueChange={(value) => onSelect(value)}
              items={list}
              placeholder={{
                label: "과목 선택...",
                value: null,
                color: "black",
              }}
              value={valueid}
              style={{
                ...pickerSelectStyles,
                iconContainer: {
                  top: 9,
                  right: 10,
                },
                placeholder: {
                  color: "black",
                  fontSize: 15,
                  fontWeight: "bold",
                },
              }}
              Icon={() => {
                return (
                  <Ionicons
                    name={Platform.OS === "ios" ? "ios-arrow-down" : "md-arrow-down"}
                    size={24}
                    color="gray"
                  />
                )
              }}
            />
            {/* </View> */}
          </View052>
          <BlueLine />
          <View051>
            <ViewS selectColor={selected} />

            <AuthInput
              {...subjectInput}
              placeholder={"과목 이름 (예: 국어 or 문서작업)"}
              keyboardType="email-address"
              returnKeyType="done"
              // onSubmitEditing={handleLogin}
              autoCorrect={false}
            />
          </View051>
        </View1>
        <BlueLine />
        <View053 />
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
          </View>
        </View2>
        <View1>
          <View05>
            <AuthButton
              color="white"
              onPress={EditSubject}
              bgColor={"#0f4c82"}
              text="과목 수정"
              loading={modifyLoading}
            />
          </View05>
        </View1>
      </MenuView>
    </TouchableWithoutFeedback>
  )
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    marginLeft: 10,
    // paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    marginLeft: 10,

    // paddingRight: 30, // to ensure the text is never behind the icon
  },
})
