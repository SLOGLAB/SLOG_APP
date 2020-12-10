import React, { useState, useEffect } from "react"
import styled from "styled-components"
import ChangeSubPage from "./TimeTableMenu/ChangeSubPage"
import { SUBJECT_NAME } from "../../screens/Tabs/QueryBox"
import { useQuery } from "@apollo/react-hooks"
import Loader from "../../components/Loader"
import useInput from "../../hooks/useInput"

const TopView = styled.View`
  flex: 4;
`
const BottomView = styled.View`
  flex: 4;
`
const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`
const MenuView = styled.View`
  flex: 1;
`
const Text = styled.Text``

export default ChangeSubject = ({ navigation }) => {
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
  const { loading, data: subjectList, refetch } = useQuery(SUBJECT_NAME, {
    // pollInterval: 300000,
    // notifyOnNetworkStatusChange: true,
  })
  const goback = () => {
    navigation.navigate("Timecontrol")
  }
  const subjectInput = useInput("")

  useEffect(() => {
    refetch()
  }, [])
  return (
    <MenuView>
      {loading ? (
        <Loader />
      ) : (
        <ChangeSubPage
          subjectList={subjectList.mySubject}
          goback={goback}
          refetch={refetch}
          subjectInput={subjectInput}
          colors={colors}
        />
      )}
    </MenuView>
  )
}
