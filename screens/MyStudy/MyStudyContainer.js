import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Image, Platform, View, ScrollView, Alert } from "react-native"
import MyStudyPresenter from "./MyStudyPresenter"
import Icon from "../../components/Icon"
import { SEE_USERBOOK } from "./MyStudyQueries"
import { useQuery } from "@apollo/react-hooks"
import { MY_SUBJECT } from "../../screens/Tabs/QueryBox"
const MainView = styled.View`
  /* justify-content: center;
  align-items: center; */
  flex: 1;
`
const GroupBox = styled.TouchableOpacity`
  width: 90%;
  justify-content: space-between;
  /* border-radius: 10; */
  margin-top: 10;
  /* margin-left: 10px;
margin-right: 10px; */
  flex-direction: row;
  /* height: 90; */
  /* border-width: 1; */
`
const SubBox = styled.View`
  /* margin-top: 20; */
  /* width: 100%; */

  border-width: 1;
  border-radius: 8;
  margin-left: 5;
  margin-right: 5;
  margin-top: 10;
`
const BookText = styled.Text`
  margin-top: 20;
  margin-bottom: 20;
  margin-left: 20;
`
export default ({ navigation }) => {
  const {
    data: userbookData,
    refetch: uesrbookRefetch,
    loading: userbookLoading,
  } = useQuery(SEE_USERBOOK)
  const {
    data: subjectData,
    refetch: subjectRefetch,
    loading: subjectLoading,
  } = useQuery(MY_SUBJECT)
  useEffect(() => {
    uesrbookRefetch()
    // console.log(userbookData)
  }, [])
  return (
    <>
      {userbookLoading || subjectLoading ? (
        <></>
      ) : (
        <MyStudyPresenter userbooks={userbookData.seeUserBook} uesrbookRefetch={uesrbookRefetch} />
      )}
    </>
  )
}
