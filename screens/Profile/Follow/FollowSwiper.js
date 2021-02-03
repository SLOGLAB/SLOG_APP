import React from "react"
import { Platform } from "react-native"
import { Container, Header, Tab, Tabs, TabHeading, Text } from "native-base"
import FollowerController from "./FollowerController"
import FollowingController from "./FollowingController"
import { StatusBar } from "react-native"
import styled from "styled-components"
import NavBlackIcon from "../../../components/NavBlackIcon"

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
  font-family: "GmarketBold";

  color: #0f4c82;
`
const MainText2 = styled.Text`
  font-size: 17;
  font-family: "GmarketBold";

  color: #ffffff;
`

const Container1 = styled.TouchableOpacity`
  padding-right: 20px;
  margin-left: 20;
`
export default ({ navigation }) => {
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
            <Container1 onPress={() => navigation.navigate("UserProfile")}>
              <NavBlackIcon
                name={Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"}
              />
            </Container1>
          </SubView>
          <SubView1>
            {Platform.OS === "ios" ? <MainText></MainText> : <MainText2></MainText2>}
          </SubView1>
          <SubView></SubView>
        </MainView>
      </Header>
      <Tabs>
        <Tab
          heading={
            <TabHeading>
              <Text style={{ fontSize: 15, fontFamily: "GmarketMedium" }}>팔로워</Text>
            </TabHeading>
          }
          // heading="팔로워"
          tabStyle={
            Platform.OS === "ios" ? { backgroundColor: "#ffffff" } : { backgroundColor: "#0f4c82" }
          }
          activeTabStyle={
            Platform.OS === "ios" ? { backgroundColor: "#ffffff" } : { backgroundColor: "#0f4c82" }
          }
        >
          <FollowerController />
        </Tab>
        <Tab
          heading={
            <TabHeading>
              <Text style={{ fontSize: 15, fontFamily: "GmarketMedium" }}>팔로잉</Text>
            </TabHeading>
          }
          // heading="팔로잉"
          tabStyle={
            Platform.OS === "ios" ? { backgroundColor: "#ffffff" } : { backgroundColor: "#0f4c82" }
          }
          activeTabStyle={
            Platform.OS === "ios" ? { backgroundColor: "#ffffff" } : { backgroundColor: "#0f4c82" }
          }
        >
          <FollowingController />
        </Tab>
      </Tabs>
    </Container>
  )
}
