import { gql } from 'apollo-boost';

export const SEARCH_BOOK = gql`
  mutation searchBook($word: String!, $display: Int!) {
    searchBook(word: $word, display: $display) {
      title
      link
      image
      author
      publisher
      isbn
    }
  }
`;

export const CREATE_BOOKOFUSER = gql`
  mutation createBookOfUser(
    $title: String!
    $link: String!
    $image: String!
    $author: String!
    $publisher: String!
    $isbn: String!
    $subjectId: String!
    $startPage: Int!
    $endPage: Int!
    $startDate: String!
    $endDate: String!
  ) {
    createBookOfUser(
      title: $title
      link: $link
      image: $image
      author: $author
      publisher: $publisher
      isbn: $isbn
      subjectId: $subjectId
      startPage: $startPage
      endPage: $endPage
      startDate: $startDate
      endDate: $endDate
    )
  }
`;
