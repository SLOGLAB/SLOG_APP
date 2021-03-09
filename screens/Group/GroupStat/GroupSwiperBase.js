import React, { Component } from "react"
import { Platform } from "react-native"
import { Container, TabHeading, Text, Tab, Tabs } from "native-base"
import GroupTodayController from "./GroupTodayController"
import GroupWeekController from "./GroupWeekController"
import GroupMonthController from "./GroupMonthController"
import { StatusBar } from "react-native"

export default ({
  groupData,
  groupRefetch,
  loading,
  navigation,
  myData,
  modlaOutMember,
  setmodlaOutMember,
  onOutMember,
  Groupid,
  search,
}) => {
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
            Platform.OS === "ios" ? { backgroundColor: "#ffffff" } : { backgroundColor: "#0f4c82" }
          }
          activeTabStyle={
            Platform.OS === "ios" ? { backgroundColor: "#ffffff" } : { backgroundColor: "#0f4c82" }
          }
        >
          <GroupTodayController
            groupData={groupData}
            groupRefetch={groupRefetch}
            loading={loading}
            navigation={navigation}
            myData={myData}
            modlaOutMember={modlaOutMember}
            setmodlaOutMember={setmodlaOutMember}
            onOutMember={onOutMember}
            Groupid={Groupid}
            search={search}
          />
        </Tab>
        <Tab
          heading={
            <TabHeading>
              <Text style={{ fontSize: 15, fontFamily: "GmarketMedium" }}>Week</Text>
            </TabHeading>
          }
          // heading="Week"
          tabStyle={
            Platform.OS === "ios" ? { backgroundColor: "#ffffff" } : { backgroundColor: "#0f4c82" }
          }
          activeTabStyle={
            Platform.OS === "ios" ? { backgroundColor: "#ffffff" } : { backgroundColor: "#0f4c82" }
          }
        >
          <GroupWeekController
            groupData={groupData}
            groupRefetch={groupRefetch}
            loading={loading}
            navigation={navigation}
            myData={myData}
            modlaOutMember={modlaOutMember}
            setmodlaOutMember={setmodlaOutMember}
            onOutMember={onOutMember}
            Groupid={Groupid}
            search={search}
          />
        </Tab>
        <Tab
          heading={
            <TabHeading>
              <Text style={{ fontSize: 15, fontFamily: "GmarketMedium" }}>Month</Text>
            </TabHeading>
          }
          // heading="Month"
          tabStyle={
            Platform.OS === "ios" ? { backgroundColor: "#ffffff" } : { backgroundColor: "#0f4c82" }
          }
          activeTabStyle={
            Platform.OS === "ios" ? { backgroundColor: "#ffffff" } : { backgroundColor: "#0f4c82" }
          }
        >
          <GroupMonthController
            groupData={groupData}
            groupRefetch={groupRefetch}
            loading={loading}
            navigation={navigation}
            myData={myData}
            modlaOutMember={modlaOutMember}
            setmodlaOutMember={setmodlaOutMember}
            onOutMember={onOutMember}
            Groupid={Groupid}
            search={search}
          />
        </Tab>
      </Tabs>
    </Container>
  )
}
