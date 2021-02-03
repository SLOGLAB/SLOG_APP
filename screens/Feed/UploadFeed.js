import React, { useEffect, useState } from "react"
import {
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
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
import useInput from "../../hooks/useInput"
import AuthInput from "../../components/AuthInput"
import AuthInputline from "../../components/AuthInputline"
import Modal from "react-native-modal"
import AuthButton from "../../components/AuthButton"
import LastWidth from "../../components/LastWidth"

export const EDIT_POST = gql`
  mutation editPost($postId: String!, $caption: String!, $location: String!) {
    editPost(postId: $postId, caption: $caption, location: $location)
  }
`
export const CREATE_POST = gql`
  mutation createPost(
    $location: String!
    $caption: String!
    $fileUrl: [String!]!
    $fileKey: [String!]!
  ) {
    createPost(location: $location, caption: $caption, fileUrl: $fileUrl, fileKey: $fileKey)
  }
`
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
  font-family: "GmarketBold";
`
const Bold2 = styled.Text`
  font-family: "GmarketBold";

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
  flex: 1;
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
const ImageContainer = styled.Image`
  width: ${constants.width / 3};
  height: ${constants.width / 3};
`
const RowView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
export default ({ navigation }) => {
  const location = useInput("")
  const caption = useInput("")
  const photo = navigation.getParam("photo")
  const photo2 = navigation.getParam("photo2")
  const photo3 = navigation.getParam("photo3")
  const data = navigation.getParam("data")

  const [editPostMutation] = useMutation(EDIT_POST)
  const [createPostMutation] = useMutation(CREATE_POST)

  const onSubmit = async (e) => {
    // let sizeCheck = false;
    // files.map((file) => {
    //   if (file.fileSize > 1048576) {
    //     sizeCheck = true;
    //     return;
    //   }
    // });

    // if (files.length === 0) {
    //   alert('이미지 파일을 최소 1개 이상 등록해주세요.');
    //   return;
    // } else if (sizeCheck) {
    //   alert('이미지 파일당 최대 크기는 1MB입니다.');
    //   return;
    // } else if (caption.value === '') {
    //   alert('게시물 내용을 작성하세요.');
    //   return;
    // }

    try {
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i].file)
      }

      const { data } = await axios.post(
        process.env.REACT_APP_BACKEND_URI + "/api/upload/feed",
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      )
      const fileUrl = data.map((file) => file.location)
      const fileKey = data.map((file) => file.key)

      const {
        data: { createPost },
      } = await createPostMutation({
        variables: {
          location: location.value,
          caption: caption.value,
          fileUrl,
          fileKey,
        },
      })
      if (!createPost) {
        Alert.alert("게시물을 추가할 수 없습니다.")
      } else {
        await refetch()
        allClear()
        setMyTabs(0)
        toast.success("게시물이 추가 되었습니다.")
      }
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1], "hi")
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <StyledModalContainer>
        <TextView2>
          <Bold2>게시물 추가</Bold2>
        </TextView2>
        <RowView>
          <ImageContainer source={photo} />
          {photo2 === null ? null : <ImageContainer source={photo2} />}
          {photo3 === null ? null : <ImageContainer source={photo3} />}
        </RowView>
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

        <AuthInputline
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
            onPress={() => onSubmit()}
            text="게시"
            paddingArray={Platform.OS === "ios" ? [6.5, 6.5, 6.5, 6.5] : [10, 10, 10, 10]}
            widthRatio={LastWidth(1.7, 2.5, 40)}
          />
          <AuthButton
            color="white"
            onPress={() => navigation.navigate("Select")}
            text="돌아가기"
            paddingArray={Platform.OS === "ios" ? [6.5, 6.5, 6.5, 6.5] : [10, 10, 10, 10]}
            widthRatio={LastWidth(1.7, 2.5, 40)}
          />
        </InfoContainer>
      </StyledModalContainer>
    </TouchableWithoutFeedback>
  )
}
