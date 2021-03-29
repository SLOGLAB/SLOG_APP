import React, { useState, useEffect } from "react"
import { View, Button, Platform, Text } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import Modal from "react-native-modal"

const TimePicker = () => {
  const [modalVisible, setModalVisible] = useState(false)

  var _today = new Date()
  // console.log(_today.format("HH:mm:ss"))
  const [date, setDate] = useState(_today)
  const [date1, setDate1] = useState(_today)

  const [mode, setMode] = useState("0")
  const [mode1, setMode1] = useState("0")

  // const [show, setShow] = useState(false)

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    // setShow(Platform.OS === "ios")
    setDate(currentDate)
  }
  const onChange1 = (event, selectedDate1) => {
    const currentDate = selectedDate1 || date1
    // setShow(Platform.OS === "ios")
    setDate1(currentDate)
  }
  const showMode = () => {
    setModalVisible(!modalVisible)
    setMode(date.toLocaleTimeString())
    setMode1(date1.toLocaleTimeString())
  }

  useEffect(() => {
    // console.log(dateTime)
  }, [])

  return (
    <View>
      {/* <View>
        <Button onPress={showTimepicker} title="Time" />
        <Text>date</Text>
      </View> */}
      <View style={{ backgroundColor: "white", flexDirection: "row", justifyContent: "center" }}>
        <Text style={{ fontSize: 20 }}>{mode}</Text>
        <Text style={{ fontSize: 20 }}>~</Text>
        <Text style={{ fontSize: 20 }}>{mode1}</Text>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        isVisible={modalVisible}
        backdropColor={"black"}
      >
        <View style={{ flex: 1 }} />
        <View style={{ backgroundColor: "white", flexDirection: "row", flex: 0.5 }}>
          <View style={{ flex: 1 }}>
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={"time"}
              is24Hour={true}
              display="spinner"
              onChange={onChange}
              minuteInterval={5}
            />
          </View>
          <View style={{ flex: 1 }}>
            <DateTimePicker
              testID="dateTimePicker"
              value={date1}
              mode={"time"}
              is24Hour={true}
              display="spinner"
              onChange={onChange1}
              minuteInterval={5}
            />
          </View>
          <Button onPress={showMode} title="선택" />
        </View>
      </Modal>
      <Button onPress={showMode} title="Time" />

      {/* {show && (
        <View>
          <View>
            <View>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={"time"}
                is24Hour={true}
                display="spinner"
                onChange={onChange}
                minuteInterval={5}
              />
            </View>
            <View>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={"time"}
                is24Hour={true}
                display="spinner"
                onChange={onChange}
                minuteInterval={5}
              />
            </View>
          </View>

          <Button onPress={showTimepicker} title="Time" />
        </View>
      )}*/}
    </View>
  )
}

export default TimePicker
