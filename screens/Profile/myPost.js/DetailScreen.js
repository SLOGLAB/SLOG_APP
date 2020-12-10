import React, { useEffect, useState } from "react"
import { Image, Platform, View } from "react-native"
import styled from "styled-components"
import { Ionicons } from "@expo/vector-icons"
import PropTypes from "prop-types"
import { gql } from "apollo-boost"
import constants from "../../../constants"
import styles from "../../../styles"
import { useMutation, useQuery } from "@apollo/react-hooks"
import { withNavigation } from "react-navigation"
import Swiper from "react-native-swiper"
import DetailScreenP from "./DetailScreenP"
const Container = styled.View`
  margin-bottom: 5px;
  margin-top: 50px;
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
  height: ${constants.height / 2};
  width: ${constants.width / 1};
  background-color: rgba(255, 255, 255, 1);
`
export const ME = gql`
  {
    me {
      id
      avatar
      email
      fullName
      username
      studyPurpose
      studyGroup
      studyGroup2
      studyGroup3
      bio
      followingCount
      followersCount
      isFollowing
      followDates {
        id
        followId
        createdAt
      }
      following {
        id
        avatar
        email
        username
        isFollowing
        isSelf
      }
      followers {
        id
        avatar
        email
        username
        isFollowing
        isSelf
        followDates {
          id
          followId
          createdAt
        }
      }
      posts {
        id
        files {
          id
          url
          key
        }
        likeCount
        commentCount
      }
      organization {
        id
        name
        manager {
          id
          phoneNumber
        }
      }
      raspberry {
        id
        seatNumber
      }
    }
  }
`
export default ({ navigation }) => {
  const item = navigation.getParam("items")

  // const [isLiked, setIsLiked] = useState(isLikedProp)
  // const [likeCount, setLikeCount] = useState(likeCountProp)
  // const [toggleLikeMutaton] = useMutation(TOGGLE_LIKE, {
  //   variables: {
  //     postId: id,
  //   },
  // })
  const handleLike = async () => {
    if (isLiked === true) {
      setLikeCount((l) => l - 1)
    } else {
      setLikeCount((l) => l + 1)
    }
    setIsLiked((p) => !p)
    try {
      await toggleLikeMutaton()
    } catch (e) {}
  }
  const { loading, data, refetch } = useQuery(ME, {})

  useEffect(() => {
    // console.log(medata, "medata")
  }, [])
  return (
    <>
      <DetailScreenP item={item} medata={data} handleLike={handleLike} />
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
