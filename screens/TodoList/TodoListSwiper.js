import React, { Component } from "react"
import { Platform, StatusBar, Dimensions } from "react-native"
import { Container, Header, Content, Tab, Tabs, Text } from "native-base"
import TodoListController from "./TodoListController"
import TodoListEndController from "./TodoListEndController"
import BackButton from "../../components/BackButton"
import styled from "styled-components"
const MainView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
`
const SubView = styled.View`
  flex: 1;
`
const SubView1 = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`
const MainText = styled.Text`
  font-size: 17;
  font-weight: bold;
  color: #0f4c82;
`
const MainText2 = styled.Text`
  font-size: 17;
  font-weight: bold;
  color: #ffffff;
`
export default class TodoListSwiper extends Component {
  render() {
    return (
      <Container>
        {Platform.OS == "ios" ? (
          <StatusBar barStyle="dark-content" />
        ) : (
          <StatusBar barStyle="light-content" />
        )}
        <Header hasTabs>
          <MainView>
            <SubView>
              <BackButton />
            </SubView>
            <SubView1>
              {Platform.OS === "ios" ? (
                <MainText>To Do List</MainText>
              ) : (
                <MainText2>To Do List</MainText2>
              )}
            </SubView1>
            <SubView></SubView>
          </MainView>
        </Header>
        <Tabs>
          <Tab
            heading="계획"
            tabStyle={
              Platform.OS === "ios"
                ? { backgroundColor: "#ffffff" }
                : { backgroundColor: "#0f4c82" }
            }
            activeTabStyle={
              Platform.OS === "ios"
                ? { backgroundColor: "#ffffff" }
                : { backgroundColor: "#0f4c82" }
            }
          >
            <TodoListController />
          </Tab>
          <Tab
            heading="완료"
            tabStyle={
              Platform.OS === "ios"
                ? { backgroundColor: "#ffffff" }
                : { backgroundColor: "#0f4c82" }
            }
            activeTabStyle={
              Platform.OS === "ios"
                ? { backgroundColor: "#ffffff" }
                : { backgroundColor: "#0f4c82" }
            }
          >
            <TodoListEndController />
          </Tab>
        </Tabs>
      </Container>
    )
  }
}
