import React, { useEffect, useState } from "react"
import { Image, Platform, View } from "react-native"
import styled from "styled-components"
import { Ionicons } from "@expo/vector-icons"
import PropTypes from "prop-types"
import { gql } from "apollo-boost"
import constants from "../../../constants"
import styles from "../../../styles"
import { useMutation } from "@apollo/react-hooks"
import { withNavigation } from "react-navigation"
import Swiper from "react-native-swiper"

const Container = styled.View`
  margin-bottom: 5px;
  border: 0.2px;
  border-color: grey;
  /* align-items: center;
  justify-content: center; */
`
const Header = styled.View`
  padding: 15px;
  flex-direction: row;
  align-items: flex-start;
`
const Line = styled.View`
  width: ${constants.width / 1};
  height: 0.5px;
  background-color: black;
`
const Touchable = styled.TouchableOpacity``
const HeaderUserContainer = styled.View`
  margin-left: 10px;
`
const Bold = styled.Text`
  font-weight: 500;
`
const Location = styled.Text`
  font-size: 12px;
`
const IconsContainer = styled.View`
  flex-direction: row;
  margin-bottom: 5px;
`
const IconContainer = styled.View`
  margin-right: 10px;
`
const InfoContainer = styled.View`
  padding: 10px;
`
const Caption = styled.Text`
  margin: 5px 0px;
`
const CommentCount = styled.Text`
  opacity: 0.5;
  font-size: 13px;
`
const SwipeView = styled.View`
  height: ${constants.width / 1};
  width: ${constants.width / 1};
  background-color: rgba(255, 255, 255, 1);
`
const EmptyView = styled.View`
  width: ${constants.width / 1};
  height: ${constants.height / 10};
`

export default ({ item, medata, handleLike }) => {
  return (
    <>
      <EmptyView />
      <Container>
        <Header>
          <Touchable onPress={() => navigation.navigate("UserDetail", { username: user.username })}>
            <Image
              style={{ height: 40, width: 40, borderRadius: 20 }}
              source={{ uri: medata.avatar }}
            />
          </Touchable>
          <Touchable onPress={() => navigation.navigate("UserDetail", { username: user.username })}>
            <HeaderUserContainer>
              <Bold>{medata.username}</Bold>
              {/* <Location>{location}</Location> */}
            </HeaderUserContainer>
          </Touchable>
        </Header>
        <Line />
        <SwipeView>
          <Swiper showsPagination={false} showsButtons style={{ height: constants.height / 2.5 }}>
            {item.files.map((file) => (
              <Image
                key={file.id}
                style={{ height: constants.height / 2, width: constants.width / 1 }}
                resizeMode={"contain"}
                source={{ uri: file.url }}
              />
            ))}
          </Swiper>
        </SwipeView>

        <InfoContainer>
          <IconsContainer>
            <Touchable onPress={handleLike}>
              <IconContainer>
                {/* <Ionicons
                size={24}
                color={isLiked ? styles.redColor : styles.blackColor}
                name={
                  Platform.OS === "ios"
                    ? isLiked
                      ? "ios-heart"
                      : "ios-heart-empty"
                    : isLiked
                    ? "md-heart"
                    : "md-heart-empty"
                }
              /> */}
              </IconContainer>
            </Touchable>
            <Touchable>
              <IconContainer>
                <Ionicons
                  color={styles.blackColor}
                  size={24}
                  name={Platform.OS === "ios" ? "ios-text" : "md-text"}
                />
              </IconContainer>
            </Touchable>
          </IconsContainer>
          <Touchable>
            <Bold>{item.likeCount === 1 ? "1 like" : `${item.likeCount} likes`}</Bold>
          </Touchable>
          <Caption>{/* <Bold>{user.username}</Bold> {caption} */}</Caption>
          <Touchable>
            {/* <CommentCount>See all {comments.length} comments</CommentCount> */}
          </Touchable>
        </InfoContainer>
      </Container>
    </>
  )
}

// DetailScreen.propTypes = {
//   id: PropTypes.string.isRequired,
//   user: PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     avatar: PropTypes.string,
//     username: PropTypes.string.isRequired,
//   }).isRequired,
//   files: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string.isRequired,
//       url: PropTypes.string.isRequired,
//     })
//   ).isRequired,
//   likeCount: PropTypes.number.isRequired,
//   isLiked: PropTypes.bool.isRequired,
//   comments: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string.isRequired,
//       text: PropTypes.string.isRequired,
//       user: PropTypes.shape({
//         id: PropTypes.string.isRequired,
//         username: PropTypes.string.isRequired,
//       }).isRequired,
//     })
//   ).isRequired,
//   caption: PropTypes.string.isRequired,
//   location: PropTypes.string,
//   createdAt: PropTypes.string.isRequired,
// }
