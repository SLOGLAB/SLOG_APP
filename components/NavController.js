import React from "react"
import { useIsLoggedIn } from "../AuthContext"
import AuthNavigation from "../navigation/AuthNavigation"
import MainNavigation from "../navigation/MainNavigation"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
// const CLASSID = gql`
//   {
//     me {
//       id
//       classes {
//         id
//       }
//     }
//   }
// `
export default () => {
  const isLoggedIn = useIsLoggedIn()
  // const { data: medata } = useQuery(CLASSID, {
  //   suspend: true,
  // })

  return isLoggedIn ? <MainNavigation /> : <AuthNavigation />
}
