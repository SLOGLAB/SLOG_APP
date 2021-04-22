import { gql } from "apollo-boost"

// export const SEE_GROUP = gql`
//   {
//     seeGroup {
//       id
//       name
//       maxMember
//       category
//       password
//       targetTime
//       publicBool
//       bio
//       imgUrl
//       activeDay
//       imManager
//       manager {
//         id
//         username
//       }
//       memberCount
//       lastStudyTime
//       lastAttendance
//       createdAt
//     }
//   }
// `
export const SEE_GROUP = gql`
  query seeGroup(
    $category: String!
    $orderBy: String!
    $publicBool: Boolean!
    $empty: Boolean!
    $first: Int!
  ) {
    seeGroup(
      category: $category
      orderBy: $orderBy
      publicBool: $publicBool
      empty: $empty
      first: $first
    ) {
      id
      name
      maxMember
      category
      password
      targetTime
      publicBool
      bio
      imgUrl
      activeDay
      imManager
      manager {
        id
        username
      }
      memberCount
      lastAttendance
      createdAt
    }
  }
`
export const CREATE_GROUP = gql`
  mutation createGroup(
    $name: String!
    $maxMember: Int!
    $category: String!
    $targetTime: Int!
    $password: String!
    $bio: String!
    $imgUrl: String!
    $imgKey: String!
    $activeDay: [Boolean!]!
  ) {
    createGroup(
      name: $name
      maxMember: $maxMember
      category: $category
      targetTime: $targetTime
      password: $password
      bio: $bio
      imgUrl: $imgUrl
      imgKey: $imgKey
      activeDay: $activeDay
    )
  }
`
