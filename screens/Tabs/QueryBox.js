import { gql } from "apollo-boost"

export const Time = gql`
  {
    todayMyTime {
      id
      existTime

      time_24
    }
    myTargetTimeBox {
      id
      monday
      tuesday
      wednesday
      thursday
      friday
      saturday
      sunday
    }
    me {
      id
      checkAttendance
      existToggle
      avatar
      times {
        id
        existTime
        createdAt
      }
    }
  }
`
export const TODAY = gql`
  {
    todayMyTime {
      id
      existTime
      time_24
    }
    me {
      id
      checkAttendance
      existToggle
      times {
        id
        existTime
        time_24

        createdAt
      }
      schedules {
        id
        start
        end
        subjectName
        totalTime
      }
    }
  }
`

export const STime = gql`
  query todayMyTime {
    todayMyTime {
      id
      existTime
    }
  }
`
export const MY_TARGET = gql`
  {
    me {
      id
      times {
        id
        existTime
        time_24

        createdAt
      }
      schedules {
        id
        start
        end
        subjectName
        totalTime
      }
    }
  }
`
export const TIMES = gql`
  {
    me {
      id
      times {
        id
        createdAt
        time_24
      }
    }
  }
`
export const SUBJECT_NAME = gql`
  {
    mySubject {
      id
      name
      bgColor
      bookMark
    }
  }
`
export const SAVE_SCHEDULE = gql`
  mutation saveSchedule_my($scheduleArray: [ScheduleArray_my!]!) {
    saveSchedule_my(scheduleArray: $scheduleArray)
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

export const DELETE_SUBJECT = gql`
  mutation deleteSubject($subjectId: String!) {
    deleteSubject(subjectId: $subjectId)
  }
`

export const BOOKMARK_SUBJECT = gql`
  mutation bookMarkSubject($subjectId: [String!]!, $bookMark: [Boolean!]!) {
    bookMarkSubject(subjectId: $subjectId, bookMark: $bookMark)
  }
`

export const ADD_TODOLIST = gql`
  mutation addTodolist($name: String!, $subjectId: String!) {
    addTodolist(name: $name, subjectId: $subjectId)
  }
`

export const DELETE_TODOLIST = gql`
  mutation deleteTodolist($todolistId: String!) {
    deleteTodolist(todolistId: $todolistId)
  }
`

export const FINISH_TODOLIST = gql`
  mutation finishTodolist($todolistId: String!) {
    finishTodolist(todolistId: $todolistId)
  }
`

export const MY_SUBJECT = gql`
  query mySubject {
    mySubject {
      id
      name
      color
      bgColor
      dragBgColor
      borderColor
      bookMark
    }
  }
`

export const MY_TODOLIST = gql`
  query myTodolist {
    myTodolist {
      id
      name
      finish
      finishAt
      subject {
        id
        name
        bgColor
        bookMark
      }
    }
  }
`
export const START_SCHEDULE = gql`
  mutation startSchedule_study(
    $title: String!
    $start: String!
    $end: String!
    $totalTime: Int!
    $calendarId: String!
    $state: String!
    $existTodo: Boolean!
  ) {
    startSchedule_study(
      title: $title
      start: $start
      end: $end
      totalTime: $totalTime
      calendarId: $calendarId
      state: $state
      existTodo: $existTodo
    )
  }
`

export const STOP_SCHEDULE = gql`
  mutation stopSchedule_study($scheduleId: String!, $end: String!, $deleteBool: Boolean!) {
    stopSchedule_study(scheduleId: $scheduleId, end: $end, deleteBool: $deleteBool)
  }
`
export const GO_WITH = gql`
  mutation goWith($followDateId: String!, $goWithBool: Boolean!) {
    goWith(followDateId: $followDateId, goWithBool: $goWithBool)
  }
`
export const EDIT_STUDYSET = gql`
  mutation editStudySet(
    $nonScheduleRecord: Boolean
    $autoRefresh: Boolean
    $autoRefreshTerm: Int
    $startScheduleTerm: Int
    $cutExtenTerm: Int
    $scheduleStart: Int
    $scheduleEnd: Int
    $dDayOn: Boolean
    $dDateName: String
    $dDate: String
  ) {
    editStudySet(
      nonScheduleRecord: $nonScheduleRecord
      autoRefresh: $autoRefresh
      autoRefreshTerm: $autoRefreshTerm
      startScheduleTerm: $startScheduleTerm
      cutExtenTerm: $cutExtenTerm
      scheduleStart: $scheduleStart
      scheduleEnd: $scheduleEnd
      dDayOn: $dDayOn
      dDateName: $dDateName
      dDate: $dDate
    )
  }
`
