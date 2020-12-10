import React from "react"
import { ActivityIndicator } from "react-native"
import styled from "styled-components"
import styles from "../styles"

const Container = styled.View`
  background-color: rgba(255, 255, 255, 0);
  justify-content: center;
  align-items: center;
`

export default ({ size = "small" }) => (
  <Container>
    <ActivityIndicator size={size} color={styles.classicBlue} />
  </Container>
)

///////
// import React from "react"
// import styled, { keyframes } from "styled-components"
// import { Logo } from "./Icons"

// const Animation = keyframes`
//     0%{
//         opacity:0
//     }
//     50%{
//         opacity:1
//     }
//     100%{
//         opacity:0;
//     }
// `

// const Loader = styled.div`
//   animation: ${Animation} 1s linear infinite;
//   width: 100%;
//   text-align: center;
// `

// export default () => (
//   <Loader>
//     <Logo size={36} />
//   </Loader>
// )
