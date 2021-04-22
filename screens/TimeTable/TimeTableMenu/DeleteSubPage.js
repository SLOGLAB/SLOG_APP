import React, { useState } from "react"
import styled from "styled-components"
import { Alert, StyleSheet } from "react-native"
import RNPickerSelect from "react-native-picker-select"
import constants from "../../../constants"
import AuthButton from "../../../components/AuthButton"
import { Ionicons } from "@expo/vector-icons"

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`
const View2 = styled.View`
  justify-content: center;
  align-items: center;
  flex: 2;
`
const SelecView = styled.View`
  justify-content: center;
  align-items: center;
  border: 1px;
  width: ${constants.width / 1.7};
  border-color: gray;
  border-radius: 5;
  height: 40;
`

export default ({
  subjectList,
  goback,
  subjectId,
  setSubjectId,
  deleteSubjectMutation,
  refetch,
}) => {
  const [modifyLoading, setModifyLoading] = useState(false)
  const list = subjectList.map((file) => ({
    label: file.name,
    value: file.id,
  }))

  const DeleteSubject = () => {
    if (subjectId === "") {
      console.log("b")
      Alert.alert("과목을 선택하세요.")
      return
    }

    const excMutation = async () => {
      try {
        setModifyLoading(true)
        const {
          data: { deleteSubject },
        } = await deleteSubjectMutation()
        if (!deleteSubject) {
          Alert.alert("해당 과목을 제거할 수 없습니다.")
        } else {
          await refetch()
        }
      } catch (e) {
        const realText = e.message.split("GraphQL error: ")
        Alert.alert(realText[1])
      } finally {
        setModifyLoading(false)
        goback()
      }
    }

    Alert.alert("", "해당 과목이 기존 스케줄에서 삭제됩니다.\n그래도 삭제하시겠습니까?", [
      {
        text: "NO",
        onPress: () => {
          return
        },
      },
      {
        text: "YES",
        onPress: () => {
          excMutation()
        },
        style: "cancel",
      },
    ])
  }

  return (
    <>
      <View2 />
      <SelecView>
        <RNPickerSelect
          onValueChange={(value) => {
            setSubjectId(value)
          }}
          items={list}
          value={subjectId}
          placeholder={{
            ...pickerSelectStyles,

            iconContainer: {
              top: 9,
              right: 20,
            },
            label: "과목 선택...",
            value: null,
            color: "black",
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
      </SelecView>
      <View>
        <AuthButton
          color="white"
          onPress={DeleteSubject}
          bgColor={"#0f4c82"}
          text="과목 제거"
          loading={modifyLoading}
        />
      </View>
      <View2 />
    </>
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
  },
  inputAndroid: {
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
  },
})
