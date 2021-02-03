import React, { Component } from "react"
import { Platform } from "react-native"
import { Container, TabHeading, Text, Tab, Tabs } from "native-base"
import TodayController from "./TodayController"
import WeekController from "./WeekController"
import MonthController from "./MonthController"
import { StatusBar } from "react-native"

export default class SwiperBase extends Component {
  render() {
    return (
      <Container>
        {Platform.OS == "ios" ? (
          <StatusBar barStyle="dark-content" />
        ) : (
          <StatusBar barStyle="light-content" />
        )}
        {/* <Header hasTabs /> */}
        <Tabs>
          <Tab
            heading={
              <TabHeading>
                <Text style={{ fontSize: 15, fontFamily: "GmarketMedium" }}>Today</Text>
              </TabHeading>
            }
            // heading="Today"
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
            <TodayController />
          </Tab>
          <Tab
            heading={
              <TabHeading>
                <Text style={{ fontSize: 15, fontFamily: "GmarketMedium" }}>Week</Text>
              </TabHeading>
            }
            // heading="Week"
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
            <WeekController />
          </Tab>
          <Tab
            heading={
              <TabHeading>
                <Text style={{ fontSize: 15, fontFamily: "GmarketMedium" }}>Month</Text>
              </TabHeading>
            }
            // heading="Month"
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
            <MonthController />
          </Tab>
        </Tabs>
      </Container>
    )
  }
}
