import React, { useEffect, useState } from "react"
import { Image, Platform, View } from "react-native"
import styled from "styled-components"
import { Ionicons } from "@expo/vector-icons"
import PropTypes from "prop-types"
import { gql } from "apollo-boost"
import constants from "../constants"
import styles from "../styles"
import { useMutation } from "@apollo/react-hooks"
import { withNavigation } from "react-navigation"
import Swiper from "react-native-swiper"
import moment from "moment"
import AuthInput from "./AuthInput"
import AuthButton from "./AuthButton"
import LastWidth from "./LastWidth"
import useInput from "../hooks/useInput"
import { FEED_ALL_QUERY } from "../screens/Feed/FeedContainer"
export const TOGGLE_LIKE = gql`
  mutation toggelLike($postId: String!) {
    toggleLike(postId: $postId)
  }
`
export const ADD_COMMENT = gql`
  mutation addComment($postId: String!, $text: String!) {
    addComment(postId: $postId, text: $text) {
      id
      text
      user {
        username
      }
    }
  }
`
const Container = styled.View`
  margin-bottom: 5px;
  margin-top: 3px;
  border: 0.2px;
  border-color: grey;
`
const Header = styled.View`
  padding: 15px;
  flex-direction: row;
  align-items: flex-start;
`
const HeaderView = styled.View`
  flex-direction: row;
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
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 10;
  justify-content: space-between;
  width: ${constants.width / 1.05};
  margin-left: 7px;
  margin-top: 7px;
`
const Caption = styled.Text`
  margin: 5px 0px;
`
const CommentCount = styled.Text`
  opacity: 0.5;
  font-size: 13px;
`
const SwipeView = styled.View`
  height: ${constants.height / 2};
  width: ${constants.width / 1};
  background-color: rgba(255, 255, 255, 1);
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
const TextView = styled.View`
  margin-top: 2;
`
const TextView2 = styled.View`
  margin-bottom: 10;
`
const ComentHeader = styled.View`
  flex-direction: row;
  width: ${constants.width / 1.1};

  align-items: flex-start;
  justify-content: space-between;
`
const ComentBody = styled.View`
  flex-direction: row;
  width: ${constants.width / 1.05};
  margin-top: 10;
  align-items: flex-start;
  justify-content: space-between;
`
const Post = ({
  id,
  user,
  location,
  files = [],
  likeCount: likeCountProp,
  caption,
  comments = [],
  isLiked: isLikedProp,
  navigation,
  createdAt,
  feedRefetch,
}) => {
  const [visible, setVisible] = useState(false)

  const [isLiked, setIsLiked] = useState(isLikedProp)
  const [likeCount, setLikeCount] = useState(likeCountProp)
  const comment = useInput("")
  const [addCommentMutation] = useMutation(ADD_COMMENT, {
    variables: { postId: id, text: comment.value },
  })
  const addCommentf = async () => {
    try {
      await addCommentMutation()
    } catch (e) {
      console.log(e)
    } finally {
      comment.setValue("")
      feedRefetch()
    }
  }
  const nowDate = new Date()
  const createTime = new Date(createdAt)
  const createTime_cut = new Date(
    createTime.getFullYear(),
    createTime.getMonth(),
    createTime.getDate()
  )
  const timeGap = nowDate.getTime() - createTime.getTime()
  const timeGap_cut = nowDate.getTime() - createTime_cut.getTime()
  // 시간 표현 기준 어레이 1시간 / 하루 / 8일 이하(render 표현식에서)
  const gapTerm = [3600000, 86400000]
  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE, {
    // refetchQueries: () => [{ query: FEED_ALL_QUERY }],
  })
  const toggleLikes = async (toggleId) => {
    if (isLiked === true) {
      setLikeCount((l) => l - 1)
    } else {
      setLikeCount((l) => l + 1)
    }
    setIsLiked((p) => !p)
    try {
      const {
        data: { toggleLike },
      } = await toggleLikeMutation({
        variables: {
          postId: toggleId,
        },
      })
      if (!toggleLike) {
        Alert.alert("댓글을 삭제할 수 없습니다.")
      }
    } catch (e) {
      console.log(e)
    } finally {
      feedRefetch()
    }
  }
  useEffect(() => {
    // console.log(createdAt)
  }, [])
  return (
    <>
      <Container>
        <Header>
          <Touchable onPress={() => navigation.navigate("UserDetail", { username: user.username })}>
            <Image
              style={{ height: 40, width: 40, borderRadius: 20 }}
              source={{ uri: user.avatar }}
            />
          </Touchable>
          <Touchable onPress={() => navigation.navigate("UserDetail", { username: user.username })}>
            <HeaderUserContainer>
              <Bold>{user.username}</Bold>
              <Location>{location}</Location>
            </HeaderUserContainer>
          </Touchable>
        </Header>
        <Line />

        {files.length > 1 ? (
          <Swiper showsPagination={false} showsButtons style={{ height: constants.height / 2.5 }}>
            {files.map((file) => (
              <Image
                style={{ height: constants.height / 2.5, width: constants.width / 1 }}
                key={file.id}
                resizeMode={"contain"}
                source={{ uri: file.url }}
              />
            ))}
          </Swiper>
        ) : (
          <>
            {files.map((file) => (
              <Image
                style={{ height: constants.height / 2.5, width: constants.width / 1 }}
                key={file.id}
                resizeMode={"contain"}
                source={{ uri: file.url }}
              />
            ))}
          </>
        )}
        <Line />

        <IconsContainer>
          <HeaderView>
            <Touchable onPress={() => toggleLikes(id)}>
              <IconContainer>
                <Ionicons
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
                />
              </IconContainer>
            </Touchable>
            <Touchable>
              <Bold>{likeCount === 1 ? "1 like" : `${likeCount} likes`}</Bold>
            </Touchable>
          </HeaderView>
          <HeaderView>
            <Touchable>
              <CommentCount>
                {timeGap < gapTerm[0]
                  ? `${Math.floor(timeGap / 60000)}분 전`
                  : timeGap < gapTerm[1]
                  ? `${Math.floor(timeGap / 3600000)}시간 전`
                  : Math.floor(timeGap_cut / 86400000) < 8
                  ? `${Math.floor(timeGap_cut / 86400000)}일 전`
                  : createTime.getFullYear() === nowDate.getFullYear()
                  ? `${moment(createdAt).format("MM월 DD일")}`
                  : `${moment(createdAt).format("YYYY년 MM월 DD일")}`}
              </CommentCount>
            </Touchable>
          </HeaderView>
        </IconsContainer>
        <InfoContainer>
          <TextView>
            <TextView2>
              <Bold>{caption}</Bold>
            </TextView2>
            {visible ? (
              <>
                {comments.map((comment) => (
                  <ComentHeader>
                    <Caption>
                      <Bold>{comment.user.username}</Bold> {comment.text}
                    </Caption>
                  </ComentHeader>
                ))}
                <Touchable
                  onPress={() => {
                    setVisible(!visible)
                  }}
                >
                  <CommentCount>댓글 닫기</CommentCount>
                </Touchable>
              </>
            ) : (
              <>
                {comments.length < 3 ? null : (
                  <Touchable
                    onPress={() => {
                      setVisible(!visible)
                    }}
                  >
                    <CommentCount>댓글 {comments.length}개 모두 보기</CommentCount>
                  </Touchable>
                )}

                {comments.length - 2 < 0 ? null : (
                  <ComentHeader>
                    <Caption>
                      <Bold>{comments[comments.length - 2].user.username}</Bold>{" "}
                      {comments[comments.length - 2].text}
                    </Caption>
                  </ComentHeader>
                )}
                {comments.length - 1 < 0 ? null : (
                  <ComentHeader>
                    <Caption>
                      <Bold>{comments[comments.length - 1].user.username}</Bold>{" "}
                      {comments[comments.length - 1].text}
                    </Caption>
                  </ComentHeader>
                )}
              </>
            )}
            <ComentBody>
              <AuthInput
                paddingArray={[5, 0, 5, 0]}
                numberOfLines={1}
                {...comment}
                placeholder="  댓글 달기..."
                returnKeyType="done"
                autoCorrect={false}
              />
              <AuthButton
                color="white"
                onPress={() => addCommentf()}
                text="게시"
                paddingArray={Platform.OS === "ios" ? [6.5, 3.5, 6.5, 3.5] : [10, 10, 10, 10]}
                widthRatio={LastWidth(1.7, 2.5, 40)}
              />
            </ComentBody>
          </TextView>
        </InfoContainer>
      </Container>
    </>
  )
}

Post.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired,
  }).isRequired,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  likeCount: PropTypes.number.isRequired,
  isLiked: PropTypes.bool.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
  caption: PropTypes.string.isRequired,
  location: PropTypes.string,
  createdAt: PropTypes.string.isRequired,
}

export default withNavigation(Post)
