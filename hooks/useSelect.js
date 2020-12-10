import { useState, useRef, useEffect } from "react"
import { Alert, StyleSheet } from "react-native"

export default (list, initValue, alertStr = "항목을 선택하세요.") => {
  const items = list
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
      Alert.alert(alertStr)
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
  }
}
// import { useState, useRef, useEffect } from "react"

// export default (options, values, initValue) => {
//   const [option, setOption] = useState(initValue ? initValue : values[0])
//   const [optionIndex, setOptionIndex] = useState(0)
//   const optionList = options
//   const valueList = values

//   const onChange = (e) => {
//     const {
//       target: { value },
//     } = e
//     setOption(values[value])
//     setOptionIndex(value)
//   }

//   const optionIndexSet = (num) => {
//     setOptionIndex(num)
//     setOption(values[num])
//   }

//   const isFirstRun = useRef(true)
//   useEffect(() => {
//     if (isFirstRun.current) {
//       isFirstRun.current = false
//       return
//     }
//     setOptionIndex(valueList.indexOf(option))
//   }, [option])

//   return {
//     option,
//     onChange,
//     setOption,
//     optionList,
//     valueList,
//     optionIndex,
//     optionIndexSet,
//   }
// }
