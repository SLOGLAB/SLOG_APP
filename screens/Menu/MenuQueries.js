import { gql } from "apollo-boost"

export const TARGET_TIMEBOX = gql`
  mutation edit_myTargetTimeBox(
    $monday: Int!
    $tuesday: Int!
    $wednesday: Int!
    $thursday: Int!
    $friday: Int!
    $saturday: Int!
    $sunday: Int!
  ) {
    edit_myTargetTimeBox(
      monday: $monday
      tuesday: $tuesday
      wednesday: $wednesday
      thursday: $thursday
      friday: $friday
      saturday: $saturday
      sunday: $sunday
    )
  }
`
