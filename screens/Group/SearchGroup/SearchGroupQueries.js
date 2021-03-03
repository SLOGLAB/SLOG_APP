import { gql } from 'apollo-boost';

export const SEE_GROUP = gql`
  {
    seeGroup {
      id
      name
      maxMember
      category
      password
      targetTime
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

export const CREATE_GROUP = gql`
  mutation createGroup(
    $name: String!
    $maxMember: Int!
    $category: String!
    $targetTime: Int!
    $password: String!
    $bio: String!
  ) {
    createGroup(
      name: $name
      maxMember: $maxMember
      category: $category
      targetTime: $targetTime
      password: $password
      bio: $bio
    )
  }
`;
