import { gql } from "apollo-boost"

export const SEE_USERBOOK = gql`
  query seeUserBook {
    seeUserBook {
      id
      title
      image
      isbn
      totalPage_target
      startPage_target
      endPage_target
      startDate_target
      endDate_target
      pageOfDay
      subject {
        id
        name
      }
      clearRecords {
        id
        startPage
        endPage
        totalPage
        pageOfHour
        clearDate
      }
    }
  }
`

export const CREATE_CLEARRECORD = gql`
  mutation createClearRecord(
    $startPage: Int!
    $endPage: Int!
    $userBookId: String!
    $clearDate: String!
  ) {
    createClearRecord(
      startPage: $startPage
      endPage: $endPage
      userBookId: $userBookId
      clearDate: $clearDate
    )
  }
`
