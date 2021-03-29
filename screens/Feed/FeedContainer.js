import React, { useState, useEffect } from "react"
import { ScrollView, RefreshControl, Platform, TouchableOpacity } from "react-native"
import styled from "styled-components"
import { gql } from "apollo-boost"
import Loader from "../../components/Loader"
import Post from "../../components/Post"

import { useQuery, useMutation } from "@apollo/react-hooks"
import constants from "../../constants"
import Icon from "../../components/Icon"
import AuthButton from "../../components/AuthButton"
import LastWidth from "../../components/LastWidth"

export const FEED_ALL_QUERY = gql`
  query seeAllFeed($first: Int!) {
    seeAllFeed(first: $first) {
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

// export const EDIT_POST = gql`
//   mutation editPost($postId: String!, $caption: String!, $location: String!) {
//     editPost(postId: $postId, caption: $caption, location: $location)
//   }
// `;
const TopView = styled.View`
  width: ${constants.width / 1.01};
  height: ${constants.height / 25};
  /* border: 0.2px; */
  /* border-radius: 5;
  border-color: grey; */
  justify-content: center;
  align-items: center;
  /* padding-right: 20px; */
  margin-top: 1px;
`
export default ({ navigation }) => {
  const feedTerm = 20

  const [variables, setVariables] = useState({ first: feedTerm })
  const [refreshing, setRefreshing] = useState(false)

  const { data: feedData, loading: feedLoading, refetch: feedRefetch } = useQuery(FEED_ALL_QUERY, {
    variables,
  })
  const [createPostMutation] = useMutation(CREATE_POST)

  const onSubmit = async () => {
    let sizeCheck = false
    files.map((file) => {
      if (file.fileSize > 1048576) {
        sizeCheck = true
        return
      }
    })

    if (files.length === 0) {
      alert("이미지 파일을 최소 1개 이상 등록해주세요.")
      return
    } else if (sizeCheck) {
      alert("이미지 파일당 최대 크기는 1MB입니다.")
      return
    } else if (caption.value === "") {
      alert("게시물 내용을 작성하세요.")
      return
    }

    try {
      toast.info("게시물 추가 중...")
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
        alert("게시물을 추가할 수 없습니다.")
      } else {
        await refetch()
        allClear()
        setMyTabs(0)
        toast.success("게시물이 추가 되었습니다.")
      }
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      alert(realText[1])
    }
  }
  const refeshfeed = () => {
    if (variables == feedData.seeAllFeed.length) {
      setVariables({ first: variables.first + feedTerm })
    }
  }
  // const refresh = async () => {
  //   try {
  //     setRefreshing(true)
  //     await feedRefetch()
  //   } catch (e) {
  //     console.log(e)
  //   } finally {
  //     setRefreshing(false)
  //   }
  // }
  useEffect(() => {
    feedRefetch()
  }, [])
  return (
    <>
      <TopView>
        <TouchableOpacity onPress={() => navigation.navigate("FeedTabs")}>
          <Icon
            name={Platform.OS === "ios" ? "ios-add-circle" : "md-add-circle"}
            size={35}
            color={"#81B0FF"}
          />
        </TouchableOpacity>
      </TopView>
      {/* <ScrollView> */}
      <ScrollView
      // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={feedRefetch} />}
      >
        {/* {feedLoading ? (
          <Loader />
        ) : ( */}
        {feedData &&
          feedData.seeAllFeed &&
          feedData.seeAllFeed.map((post) => (
            <Post
              key={post.id}
              id={post.id}
              user={post.user}
              location={post.location}
              files={post.files}
              likeCount={post.likeCount}
              caption={post.caption}
              comments={post.comments}
              isLiked={post.isLiked}
              createdAt={post.createdAt}
              feedRefetch={feedRefetch}
            />
          ))}
        <TopView>
          <AuthButton
            color="white"
            onPress={() => {
              refeshfeed()
            }}
            text="게시물 20개 더보기"
            paddingArray={Platform.OS === "ios" ? [6.5, 6.5, 6.5, 6.5] : [10, 10, 10, 10]}
            // widthRatio={LastWidth(1.7, 2.5, 40)}
          />
        </TopView>
      </ScrollView>
    </>
  )
}
