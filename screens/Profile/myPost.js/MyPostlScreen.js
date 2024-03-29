import React, { useEffect, useState } from "react"
import {
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native"
import styled from "styled-components"
import { Ionicons } from "@expo/vector-icons"
import PropTypes from "prop-types"
import { gql } from "apollo-boost"
import constants from "../../../constants"
import styles from "../../../styles"
import { useMutation, useQuery } from "@apollo/react-hooks"
import moment from "moment"
import { withNavigation } from "react-navigation"
import Swiper from "react-native-swiper"
import Loader from "../../../components/Loader"
import Post from "../../../components/Post"
import { ME } from "../UserProfile"
import useInput from "../../../hooks/useInput"
import AuthInput from "../../../components/AuthInput"
import Modal from "react-native-modal"
import AuthButton from "../../../components/AuthButton"
import LastWidth from "../../../components/LastWidth"
import Icon from "../../../components/Icon"
import MyPost from "./MyPost"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

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
export const FEED_ONE_QUERY = gql`
  query seeOneFeed($postId: String!) {
    seeOneFeed(postId: $postId) {
      id
      location
      caption
      user {
        id
        avatar
        username
      }
      files {
        id
        url
        key
      }
      likeCount
      isLiked
      isSelf
      comments {
        id
        text
        createdAt
        user {
          id
          username
        }
      }
      createdAt
    }
  }
`
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
export const DELETE_POST = gql`
  mutation deletePost($postId: String!, $fileKey: [String!]!) {
    deletePost(postId: $postId, fileKey: $fileKey)
  }
`
export const DELETE_COMMENT = gql`
  mutation deleteComment($commentId: String!) {
    deleteComment(commentId: $commentId)
  }
`
export const EDIT_POST = gql`
  mutation editPost($postId: String!, $caption: String!, $location: String!) {
    editPost(postId: $postId, caption: $caption, location: $location)
  }
`
export default ({ navigation }) => {
  const [isEmailVisible, setEmailVisible] = useState(false)
  const comment = useInput("")

  const { Loading: feedLoading, data: feedData, refetch: feedrefetch } = useQuery(FEED_ONE_QUERY, {
    variables: { postId: navigation.getParam("item") },
  })
  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE, {
    variables: { postId: navigation.getParam("item") },
    refetchQueries: () => [{ query: FEED_ONE_QUERY }],
  })
  // const keys = feedData.seeOneFeed.files.map((file) => file.key)

  const [deletePostMutation] = useMutation(DELETE_POST, {
    variables: {
      postId: navigation.getParam("item"),
      fileKey: feedData.seeOneFeed.files.map((file) => file.key),
    },
    refetchQueries: () => [{ query: ME }],
  })
  const [editPostMutation] = useMutation(EDIT_POST, {
    refetchQueries: [{ query: FEED_ONE_QUERY }],
  })
  const [addCommentMutation] = useMutation(ADD_COMMENT, {
    variables: { postId: navigation.getParam("item"), text: comment.value },
  })
  const addCommentf = async () => {
    try {
      await addCommentMutation()
    } catch (e) {
      console.log(e)
    } finally {
      comment.setValue("")
      refresh1()
    }
  }
  const postDelete = async () => {
    try {
      await deletePostMutation()
    } catch (e) {
      console.log(e)
    } finally {
      navigation.navigate("UserProfile")
    }
  }

  const [deleteCommentMutation] = useMutation(DELETE_COMMENT, {
    refetchQueries: () => [{ query: FEED_ONE_QUERY }],
  })
  const onDeleteComment = async (commentId) => {
    try {
      const {
        data: { deleteComment },
      } = await deleteCommentMutation({
        variables: {
          commentId,
        },
      })
      if (!deleteComment) {
        Alert.alert("댓글을 삭제할 수 없습니다.")
      }
    } catch (e) {
      console.log(e)
    } finally {
      refresh1()
    }
  }
  const minLen_150 = (value) => value.length < 151

  const location = useInput(feedData.seeOneFeed.location, minLen_150)
  const caption = useInput(feedData.seeOneFeed.caption, minLen_150)

  const onEdit = async () => {
    try {
      const {
        data: { editPost },
      } = await editPostMutation({
        variables: {
          postId: navigation.getParam("item"),
          location: location.value,
          caption: caption.value,
        },
      })
      if (!editPost) {
        Alert.alert("게시물을 수정할 수 없습니다.")
      }
    } catch (e) {
      console.log(e)
    } finally {
      refresh1()
      setEmailVisible(!isEmailVisible)
    }
  }
  const [refreshing, setRefreshing] = useState(false)

  const [visible, setVisible] = useState(false)

  const handleLike = async () => {
    try {
      await toggleLikeMutation()
    } catch (e) {
      console.log(e)
    } finally {
      feedrefetch()
    }
  }
  const nowDate = new Date()
  const createTime = new Date(feedData.seeOneFeed.createdAt)
  const createTime_cut = new Date(
    createTime.getFullYear(),
    createTime.getMonth(),
    createTime.getDate()
  )
  const timeGap = nowDate.getTime() - createTime.getTime()
  const timeGap_cut = nowDate.getTime() - createTime_cut.getTime()
  // 시간 표현 기준 어레이 1시간 / 하루 / 8일 이하(render 표현식에서)
  const gapTerm = [3600000, 86400000]

  const refresh = async () => {
    try {
      setRefreshing(true)
      await feedrefetch()
    } catch (e) {
      console.log(e)
    } finally {
      setRefreshing(false)
    }
  }
  const refresh1 = async () => {
    try {
      await feedrefetch()
    } catch (e) {
      console.log(e)
    } finally {
    }
  }
  useEffect(() => {
    refresh()
  }, [])
  return (
    <>
      <TopView></TopView>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
        {feedLoading ? (
          <Loader />
        ) : (
          <MyPost
            navigation={navigation}
            feedData={feedData}
            setEmailVisible={setEmailVisible}
            isEmailVisible={isEmailVisible}
            postDelete={postDelete}
            handleLike={handleLike}
            timeGap={timeGap}
            gapTerm={gapTerm}
            visible={visible}
            setVisible={setVisible}
            comment={comment}
            addCommentf={addCommentf}
            location={location}
            caption={caption}
            onEdit={onEdit}
            timeGap_cut={timeGap_cut}
            createTime={createTime}
            nowDate={nowDate}
          />
        )}
      </ScrollView>
    </>
  )
}
// <Container>
//   <KeyboardAwareScrollView>
//     <HeaderUserContainer>
//       <Touchable onPress={() => navigation.navigate("UserProfile")}>
//         <Icon
//           name={Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"}
//           color={"#262626"}
//           size={40}
//         />
//       </Touchable>
//     </HeaderUserContainer>
//     <Line />
//     <Header>
//       <HeaderView>
//         <Touchable onPress={() => navigation.navigate("UserProfile")}>
//           <Image
//             style={{ height: 40, width: 40, borderRadius: 20 }}
//             source={{ uri: feedData.seeOneFeed.user.avatar }}
//           />
//         </Touchable>
//         <Touchable onPress={() => navigation.navigate("UserProfile")}>
//           <HeaderUserContainer>
//             <Bold>{feedData.seeOneFeed.user.username}</Bold>
//             <Location>{feedData.seeOneFeed.location}</Location>
//           </HeaderUserContainer>
//         </Touchable>
//       </HeaderView>
//       <HeaderView>
//         <Touchable onPress={() => setEmailVisible(!isEmailVisible)}>
//           <IconContainer>
//             <Ionicons
//               size={24}
//               color={styles.blackColor}
//               name={Platform.OS === "ios" ? "ios-build" : "md-build"}
//             />
//           </IconContainer>
//         </Touchable>
//         <Touchable onPress={postDelete}>
//           <IconContainer>
//             <Ionicons
//               size={24}
//               color={styles.blackColor}
//               name={
//                 Platform.OS === "ios"
//                   ? "ios-close-circle-outline"
//                   : "md-close-circle-outline"
//               }
//             />
//           </IconContainer>
//         </Touchable>
//       </HeaderView>
//     </Header>

//     {/* <SwipeView> */}
//     {/* <Swiper showsPagination={true} showsButtons style={{ height: constants.height / 2.5 }}> */}
//     {feedData.seeOneFeed.files.map((file) => (
//       <Image
//         style={{ height: constants.height / 2, width: constants.width / 1 }}
//         key={file.id}
//         resizeMode={"contain"}
//         source={{ uri: file.url }}
//       />
//     ))}
//     {/* </Swiper> */}
//     {/* </SwipeView> */}

//     <IconsContainer>
//       <HeaderView>
//         <Touchable onPress={handleLike}>
//           <IconContainer>
//             <Ionicons
//               size={24}
//               color={feedData.seeOneFeed.isLiked ? styles.redColor : styles.blackColor}
//               name={
//                 Platform.OS === "ios"
//                   ? feedData.seeOneFeed.isLiked
//                     ? "ios-heart"
//                     : "ios-heart-empty"
//                   : feedData.seeOneFeed.isLiked
//                   ? "md-heart"
//                   : "md-heart-empty"
//               }
//             />
//           </IconContainer>
//         </Touchable>

//         <CenterView>
//           <Bold>
//             {feedData.seeOneFeed.likeCount === 1
//               ? "1 like"
//               : `${feedData.seeOneFeed.likeCount} likes`}
//           </Bold>
//         </CenterView>
//       </HeaderView>
//       <HeaderView>
//         <CommentCount>
//           {timeGap < gapTerm[0]
//             ? `${Math.floor(timeGap / 60000)}분 전`
//             : timeGap < gapTerm[1]
//             ? `${Math.floor(timeGap / 3600000)}시간 전`
//             : Math.floor(timeGap_cut / 86400000) < 8
//             ? `${Math.floor(timeGap_cut / 86400000)}일 전`
//             : createTime.getFullYear() === nowDate.getFullYear()
//             ? `${moment(feedData.seeOneFeed.createdAt).format("MM월 DD일")}`
//             : `${moment(feedData.seeOneFeed.createdAt).format("YYYY년 MM월 DD일")}`}
//         </CommentCount>
//       </HeaderView>
//     </IconsContainer>
//     <InfoContainer>
//       <TextView>
//         <TextView2>
//           <Bold>{feedData.seeOneFeed.caption}</Bold>
//         </TextView2>
//         {visible ? (
//           <>
//             {feedData.seeOneFeed.comments.map((comment) => (
//               <ComentHeader>
//                 <Caption>
//                   <Bold>{comment.user.username}</Bold> {comment.text}
//                 </Caption>
//                 <Touchable onPress={() => onDeleteComment(comment.id)}>
//                   <Ionicons
//                     size={24}
//                     color={styles.blackColor}
//                     name={
//                       Platform.OS === "ios"
//                         ? "ios-close-circle-outline"
//                         : "md-close-circle-outline"
//                     }
//                   />
//                 </Touchable>
//               </ComentHeader>
//             ))}
//             <Touchable
//               onPress={() => {
//                 setVisible(!visible)
//               }}
//             >
//               <CommentCount>댓글 닫기</CommentCount>
//             </Touchable>
//           </>
//         ) : (
//           <>
//             {feedData.seeOneFeed.comments.length < 3 ? null : (
//               <Touchable
//                 onPress={() => {
//                   setVisible(!visible)
//                 }}
//               >
//                 <CommentCount>
//                   댓글 {feedData.seeOneFeed.comments.length}개 모두 보기
//                 </CommentCount>
//               </Touchable>
//             )}

//             {feedData.seeOneFeed.comments.length - 2 < 0 ? null : (
//               <ComentHeader>
//                 <Caption>
//                   <Bold>
//                     {
//                       feedData.seeOneFeed.comments[
//                         feedData.seeOneFeed.comments.length - 2
//                       ].user.username
//                     }
//                   </Bold>{" "}
//                   {
//                     feedData.seeOneFeed.comments[feedData.seeOneFeed.comments.length - 2]
//                       .text
//                   }
//                 </Caption>
//                 <Touchable
//                   onPress={() =>
//                     onDeleteComment(
//                       feedData.seeOneFeed.comments[
//                         feedData.seeOneFeed.comments.length - 2
//                       ].id
//                     )
//                   }
//                 >
//                   <Ionicons
//                     size={24}
//                     color={styles.blackColor}
//                     name={
//                       Platform.OS === "ios"
//                         ? "ios-close-circle-outline"
//                         : "md-close-circle-outline"
//                     }
//                   />
//                 </Touchable>
//               </ComentHeader>
//             )}
//             {feedData.seeOneFeed.comments.length - 1 < 0 ? null : (
//               <ComentHeader>
//                 <Caption>
//                   <Bold>
//                     {
//                       feedData.seeOneFeed.comments[
//                         feedData.seeOneFeed.comments.length - 1
//                       ].user.username
//                     }
//                   </Bold>{" "}
//                   {
//                     feedData.seeOneFeed.comments[feedData.seeOneFeed.comments.length - 1]
//                       .text
//                   }
//                 </Caption>
//                 <Touchable
//                   onPress={() =>
//                     onDeleteComment(
//                       feedData.seeOneFeed.comments[
//                         feedData.seeOneFeed.comments.length - 1
//                       ].id
//                     )
//                   }
//                 >
//                   <Ionicons
//                     size={24}
//                     color={styles.blackColor}
//                     name={
//                       Platform.OS === "ios"
//                         ? "ios-close-circle-outline"
//                         : "md-close-circle-outline"
//                     }
//                   />
//                 </Touchable>
//               </ComentHeader>
//             )}
//           </>
//         )}
//         <ComentBody>
//           <AuthInput
//             paddingArray={[5, 0, 5, 0]}
//             numberOfLines={1}
//             {...comment}
//             placeholder="  댓글 달기..."
//             returnKeyType="done"
//             autoCorrect={false}
//           />
//           <AuthButton
//             color="white"
//             onPress={() => addCommentf()}
//             text="게시"
//             paddingArray={Platform.OS === "ios" ? [6.5, 3.5, 6.5, 3.5] : [10, 10, 10, 10]}
//             widthRatio={LastWidth(1.7, 2.5, 40)}
//           />
//         </ComentBody>
//       </TextView>
//     </InfoContainer>
//   </KeyboardAwareScrollView>
// </Container>
{
  /* <Modal
          isVisible={isEmailVisible}
          onBackdropPress={() => setEmailVisible(false)}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            minHeight: Math.round(Dimensions.get("window").height),
          }}
        >
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
        </Modal> */
}
