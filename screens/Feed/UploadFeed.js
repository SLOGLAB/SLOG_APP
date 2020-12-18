import React, { useEffect, useState } from "react"
import {
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native"
import styled from "styled-components"
import { Ionicons } from "@expo/vector-icons"
import PropTypes from "prop-types"
import { gql } from "apollo-boost"
import constants from "../../constants"
import { useMutation, useQuery } from "@apollo/react-hooks"
import moment from "moment"
import { withNavigation } from "react-navigation"
import Swiper from "react-native-swiper"
import Loader from "../../components/Loader"

import AuthInput from "../../components/AuthInput"
import Modal from "react-native-modal"
import AuthButton from "../../components/AuthButton"
import LastWidth from "../../components/LastWidth"

const Container = styled.View`
  /* margin-bottom: 15px; */
  /* margin-top: 0px; */
`
const HeaderView = styled.View`
  flex-direction: row;
`
const Line = styled.View`
  /* margin-bottom: 15px; */
  /* margin-top: 0px; */
  width: ${constants.width / 1};
  height: 1px;
  margin-top: 1px;
  margin-bottom: 1px;
  background-color: grey;
`
const Header = styled.View`
  padding: 15px;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`
const ComentHeader = styled.View`
  flex-direction: row;
  width: ${constants.width / 1.1};

  align-items: flex-start;
  justify-content: space-between;
`
const Touchable = styled.TouchableOpacity``
const HeaderUserContainer = styled.View`
  margin-left: 10px;
  align-items: flex-start;
  justify-content: center;
`
const Bold = styled.Text`
  font-weight: bold;
`
const Bold2 = styled.Text`
  font-weight: bold;
  font-size: 20;
`
const Location = styled.Text`
  font-size: 12px;
`
const IconsContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 10;
  justify-content: space-between;
  width: ${constants.width / 1.05};
  margin-left: 7px;
  margin-top: 7px;
`
const IconContainer = styled.View`
  margin-right: 10px;
`
const InfoContainer = styled.View`
  padding: 10px;
  justify-content: space-between;
  flex-direction: row;
  width: ${constants.width / 2};
`
const TextView = styled.View`
  margin-top: 2;
`
const TextView2 = styled.View`
  margin-bottom: 10;
`
const Caption = styled.Text`
  margin: 5px 0px;
`
const CommentCount = styled.Text`
  opacity: 0.5;
  font-size: 13px;
`
const TopView = styled.View`
  width: ${constants.width / 1};
  height: ${constants.height / 15};
  /* border: 0.2px; */
  /* border-radius: 5;
border-color: grey; */
  justify-content: center;
  align-items: center;
  /* padding-right: 20px; */
  margin-top: 1px;
`
const CenterView = styled.View`
  justify-content: center;
  align-items: center;
`
const StyledModalContainer = styled.View`
  width: ${constants.width / 1};

  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* 모달창 크기 조절 */
  flex: 0.35;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
`
const ComentBody = styled.View`
  flex-direction: row;
  width: ${constants.width / 1.05};
  margin-top: 10;
  align-items: flex-start;
  justify-content: space-between;
`
export default () => {
  return (
    <StyledModalContainer>
      <TextView2>
        <Bold2>게시물 수정</Bold2>
      </TextView2>
      <TextView2 />
      <AuthInput
        paddingArray={[5, 0, 5, 0]}
        numberOfLines={1}
        {...location}
        placeholder=" (선택 항목) 위치"
        returnKeyType="done"
        autoCorrect={false}
        // {...bio}
        // placeholder={"자기소개 (150자 이내)"}
        // required={false}
      />

      <AuthInput
        paddingArray={[0, 0, 70, 5]}
        numberOfLines={4}
        {...caption}
        placeholder="(필수 항목) 내용"
        returnKeyType="done"
        autoCorrect={false}
        // {...bio}
        // placeholder={"자기소개 (150자 이내)"}
        // required={false}
      />
      <InfoContainer>
        <AuthButton
          color="white"
          onPress={() => onEdit()}
          text="수정"
          paddingArray={Platform.OS === "ios" ? [6.5, 6.5, 6.5, 6.5] : [10, 10, 10, 10]}
          widthRatio={LastWidth(1.7, 2.5, 40)}
        />
        <AuthButton
          color="white"
          onPress={() => setEmailVisible(!isEmailVisible)}
          text="돌아가기"
          paddingArray={Platform.OS === "ios" ? [6.5, 6.5, 6.5, 6.5] : [10, 10, 10, 10]}
          widthRatio={LastWidth(1.7, 2.5, 40)}
        />
      </InfoContainer>
    </StyledModalContainer>
  )
}
