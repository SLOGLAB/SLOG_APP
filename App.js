import React, { useState, useEffect } from "react"
import { View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { AppLoading } from "expo"
import { Asset } from "expo-asset"
import * as Font from "expo-font"
import AsyncStorage from "@react-native-community/async-storage"
import { InMemoryCache } from "apollo-cache-inmemory"
import { persistCache } from "apollo-cache-persist"

import ApolloClient from "apollo-boost"
import apolloClientOptions from "./apollo"
import { ThemeProvider } from "styled-components"
import { ApolloProvider } from "@apollo/react-hooks"
import styles from "./styles"
import NavController from "./components/NavController"
import { AuthProvider } from "./AuthContext"

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [client, setClient] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(null) //null은 내가 체크 안한것 true는 체크했고 로그인
  const preLoad = async () => {
    // AsyncStorage.clear()
    try {
      await Font.loadAsync({
        Roboto: require("native-base/Fonts/Roboto.ttf"),
        Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
        ...Ionicons.font,
      })
      // await loadAsync({
      //   roboto: {
      //     uri: require('./roboto.ttf'),
      //     // Only effects web
      //     display: FontDisplay.SWAP,
      //   },
      // });
      await Asset.loadAsync([require("./assets/DeepTime.png")])

      const cache = new InMemoryCache()

      await persistCache({
        cache,
        storage: AsyncStorage,
      })
      const client = new ApolloClient({
        cache,
        request: async (operation) => {
          const token = await AsyncStorage.getItem("jwt") //json web token
          return operation.setContext({
            headers: { Authorization: `Bearer ${token}` },
          }) //backend에 token 전달
        },
        ...apolloClientOptions,
        // wsLink
      }) //5 여기까지 캐쉬를 초기화
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn") //6
      if (!isLoggedIn || isLoggedIn === "false") {
        setIsLoggedIn(false)
      } else {
        setIsLoggedIn(true)
      }
      setLoaded(true) //7
      setClient(client) //8
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    preLoad()
  }, [])

  return loaded && client && isLoggedIn !== null ? (
    <ApolloProvider client={client}>
      <ThemeProvider theme={styles}>
        <AuthProvider isLoggedIn={isLoggedIn}>
          <NavController />
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  ) : (
    <AppLoading />
  )
}

// import { WebSocketLink } from "apollo-link-ws"
////////

// const wsLink = new WebSocketLink({
//   uri: `https://slog-iam-backend.herokuapp.com/`,
//   options: {
//     reconnect: true
//   }
// })
///////////////
// import { WebSocketLink } from "apollo-link-ws";
// import { SubscriptionClient } from "subscriptions-transport-ws";

// const GRAPHQL_ENDPOINT = "ws://localhost:3000/graphql";

// const client = new SubscriptionClient(GRAPHQL_ENDPOINT, {
//   reconnect: true
// });

// const link = new WebSocketLink(client);
