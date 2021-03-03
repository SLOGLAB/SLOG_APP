import { gql } from 'apollo-boost';

export const MY_GROUP = gql`
  {
    myGroup {
      id
      name
      maxMember
      category
      targetTime
      bookmark
      password
      publicBool
      bio
      imManager
      manager {
        id
        username
      }
      memberCount
      createdAt
    }
  }
`;

export const BOOKMARK_GROUP = gql`
  mutation bookmarkGroup($groupId: String!, $orderBool: Boolean!) {
    bookmarkGroup(groupId: $groupId, orderBool: $orderBool)
  }
`;
