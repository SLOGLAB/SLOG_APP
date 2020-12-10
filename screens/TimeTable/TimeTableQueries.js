import { gql } from "apollo-boost"

export const EDIT_BOOKMARK = gql`
  mutation bookMarkSubject($subjectId: [String!]!, $bookMark: [Boolean!]!) {
    bookMarkSubject(subjectId: $subjectId, bookMark: $bookMark)
  }
`

export const ADD_SUBJECT = gql`
  mutation addSubject($name: String!, $bgColor: String!) {
    addSubject(name: $name, bgColor: $bgColor)
  }
`

export const EDIT_SUBJECT = gql`
  mutation editSubject($subjectId: String!, $name: String!, $bgColor: String!) {
    editSubject(subjectId: $subjectId, name: $name, bgColor: $bgColor)
  }
`
//TASK 수정
export const DELETE_SUBJECT = gql`
  mutation deleteSubject($subjectId: String!) {
    deleteSubject(subjectId: $subjectId)
  }
`
//TASK 제거
///////////////////////////////////////////////////////////
//스케쥴 클릭 modal
export const SAVE_SCHEDULE = gql`
  mutation saveSchedule_my($scheduleArray: [ScheduleArray_my!]!) {
    saveSchedule_my(scheduleArray: $scheduleArray)
  }
`
