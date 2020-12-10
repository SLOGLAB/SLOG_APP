import React, { useState } from "react"
import AuthButton from "../../components/AuthButton"
import { useLogOut } from "../../AuthContext"
import { AsyncStorage } from "react-native"

export default () => {
  const logOut = useLogOut()
  const [loading, setLoading] = useState(false)
  //user.token = '';

  const handleLogout = async () => {
    try {
      setLoading(false)
      logOut()
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <AuthButton
      loading={loading}
      onPress={handleLogout}
      bgColor={"#0f4c82"}
      text="로그아웃"
      color="white"
    />
  )
}
