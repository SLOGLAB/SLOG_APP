import React, { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { Dimensions, TouchableWithoutFeedback, Keyboard, Button, Text } from "react-native"
import StudyPresenter from "./StudyPresenter"
import BackButton from "../../components/BackButton"
import constants from "../../constants"
import {
  MY_SUBJECT,
  MY_TODOLIST,
  ADD_TODOLIST,
  DELETE_TODOLIST,
  FINISH_TODOLIST,
} from "../Tabs/QueryBox"
import { useQuery, useMutation } from "@apollo/react-hooks"
import Loader from "../../components/Loader"
import useInput from "../../hooks/useInput"
import Apps from "../../Object/Apps"
import Constants from "expo-constants"
import * as Notifications from "expo-notifications"
import * as Permissions from "expo-permissions"
import { gql } from "apollo-boost"

// import SwipeMenu from "../../components/SwipeMenu"
// import Apps from "../../Object/Apps"
export const ME = gql`
  {
    me {
      id
      username
      fullName
      avatar
      existToggle
      studyPurpose
      todayTime {
        attendanceStatus
        absenceReason
      }
      times {
        id
        existTime
        time_24
        createdAt
      }
      schedules {
        id
        isAllDay
        isPrivate
        title
        location
        state
        start
        end
        totalTime
        subject {
          id
          name
          bgColor
        }
      }
      studyDefaultSet {
        nonScheduleRecord
        autoRefresh
        autoRefreshTerm
        startScheduleTerm
        cutExtenTerm
        scheduleStart
        scheduleEnd
        dDayOn
        dDateName
        dDate
      }
      followDates {
        id
        followId
        goWith
        createdAt
      }
      withFollowing {
        id
        avatar
        username
        existToggle
      }
      following {
        id
        avatar
        email
        username
      }
    }
  }
`
const Main = styled.View`
  flex: 1;
`
const TopView = styled.View`
  height: ${constants.height / 18};
  background-color: rgba(15, 76, 130, 0.29);
  align-items: flex-start;
  justify-content: flex-end;
`
const SideView = styled.View`
  flex: 0.55;
`
const SideView1 = styled.View`
  flex: 0.45;
`
const AvatarView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const StudyView = styled.View`
  flex: 3;
  background-color: rgba(15, 76, 130, 0.29);
`
const TimeView = styled.View`
  flex: 1;
`
const RowView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")
export default () => {
  const { loading, data: myInfoData, refetch: myInfoRefetch } = useQuery(ME)

  return (
    <>
      <Main>
        <TopView>
          <BackButton />
        </TopView>
        <RowView>
          <AvatarView>
            <Apps />
          </AvatarView>

          <AvatarView>
            <StudyPresenter myInfoData={myInfoData} />
          </AvatarView>
        </RowView>
      </Main>
    </>
  )
}
