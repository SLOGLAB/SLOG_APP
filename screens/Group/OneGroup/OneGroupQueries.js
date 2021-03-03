import { gql } from 'apollo-boost';

export const SEEONE_GROUP = gql`
  query seeOneGroup($groupId: String!) {
    seeOneGroup(groupId: $groupId) {
      id
      name
      maxMember
      category
      targetTime
      publicBool
      bio
      manager {
        id
        username
      }
      member {
        id
        username
        avatar
        isSelf
        existToggle
        times {
          id
          existTime
          createdAt
        }
      }
      memberCount
      imManager
      createdAt
    }
  }
`;

export const JOIN_GROUP = gql`
  mutation joinGroup($groupId: String!) {
    joinGroup(groupId: $groupId)
  }
`;

export const DELETE_GROUP = gql`
  mutation deleteGroup($groupId: String!) {
    deleteGroup(groupId: $groupId)
  }
`;

export const OUT_GROUP = gql`
  mutation outGroup($groupId: String!) {
    outGroup(groupId: $groupId)
  }
`;

export const OUT_MEMBER = gql`
  mutation outMember($groupId: String!, $memberId: String!) {
    outMember(groupId: $groupId, memberId: $memberId)
  }
`;

export const EDIT_GROUP = gql`
  mutation editGroup(
    $groupId: String!
    $name: String!
    $maxMember: Int!
    $category: String!
    $targetTime: Int!
    $password: String!
    $bio: String!
  ) {
    editGroup(
      groupId: $groupId
      name: $name
      maxMember: $maxMember
      category: $category
      targetTime: $targetTime
      password: $password
      bio: $bio
    )
  }
`;
