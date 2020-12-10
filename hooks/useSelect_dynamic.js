import { useState, useEffect, useRef } from "react"
import { StyleSheet } from "react-native"

const style_tmp = {
  ...pickerSelectStyles,
  iconContainer: {
    top: 20,
    right: 10,
  },
  placeholder: {
    color: "black",
    fontSize: 15,
    fontWeight: "bold",
  },
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

    // paddingRight: 30, // to ensure the text is never behind the icon
  },
})

export default (list, ref_optionIndex, initValue, cusStyle = style_tmp) => {
  const style = cusStyle
  const items = list[ref_optionIndex !== -1 ? ref_optionIndex : 0]
  const optionList = items.map((obj) => {
    return obj.label
  })
  const valueList = items.map((obj) => {
    return obj.value
  })

  const [value, setValue] = useState(initValue ? initValue : valueList[0])
  const [optionIndex, setOptionIndex] = useState(0)

  const onValueChange = (e) => {
    if (e === null) {
      // Alert.alert(alertStr);
    } else {
      const indexCheck = (a) => a === e
      const valueIndex = valueList.findIndex(indexCheck)
      setValue(valueList[valueIndex])
      setOptionIndex(valueIndex)
    }
  }

  const optionIndexSet = (num) => {
    setValue(valueList[num])
    setOptionIndex(num)
  }

  const isFirstRun = useRef(true)
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    setValue(valueList[0])
    setOptionIndex(0)
  }, [ref_optionIndex])

  const isFirstRun2 = useRef(true)
  useEffect(() => {
    if (isFirstRun2.current) {
      isFirstRun2.current = false
      return
    }
    setOptionIndex(valueList.indexOf(value))
  }, [value])

  return {
    value,
    onValueChange,
    setValue,
    items,
    optionList,
    valueList,
    optionIndex,
    optionIndexSet,
    style,
  }
}
