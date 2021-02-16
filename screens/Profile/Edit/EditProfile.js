import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { useMutation } from "@apollo/react-hooks"
import useInput from "../../../hooks/useInput"
import { Alert } from "react-native"
import {
  EDIT_ACCOUNT,
  EDIT_ACCOUNT_M,
  EDIT_PASSWORD,
  S_PHONE_VERIFICATION,
  S_EMAIL_VERIFICATION,
  C_EMAIL_VERIFICATION,
  C_PHONE_VERIFICATION,
} from "../AccountTabsQueries"
import SetProfile from "./SetProfile"
import {
  studyOption_group,
  studyOption_group2,
  studyOption_group3,
  address1,
  address2_total,
} from "../../../components/LongArray"
import useSelect from "../../../hooks/useSelect"
import useSelect_dynamic from "../../../hooks/useSelect_dynamic"
import useSelect_dynamic2 from "../../../hooks/useSelect_dynamic2"
import { ME } from "../UserProfile"
const EditProfile = ({ navigation, data, refetch, onRefresh, loading }) => {
  const maxLen_11 = (value) => value.length <= 12
  const minLen_6 = (value) => value.length < 6 && value.length > 0
  const minLen_150 = (value) => value.length < 151

  const firstName = useInput(data.me.firstName)
  const lastName = useInput(data.me.lastName)
  const username = useInput(data.me.username, maxLen_11)
  const bio = useInput(data.me.bio, minLen_150)
  const email = useInput(data.me.email)
  const emailKey = useInput("")
  var phone = data.me.phoneNumber
  const phoneNumber = useInput(phone.substring(2, 13))
  const phoneKey = useInput("")
  const organizationName = useInput(data.me.organization?.name)
  const detailAddress = useInput(data.me.organization?.detailAddress)
  const [marketing, setMarketing] = useState(data.me.termsOfMarketing)
  const password_pre = useInput("")
  const password = useInput("", "", minLen_6)
  const passChk = (value) => value !== password.value
  const password2 = useInput("", "", passChk)
  const [acLoading, setAcLoading] = useState(false)
  const [vLoading, setVLoading] = useState(false)
  // console.log(data.me.studyPurpose)
  const studyPurpose = useSelect(
    [
      { label: "학습", value: "학습" },
      { label: "업무", value: "업무" },
    ],
    data.me.studyPurpose
  )
  const studyGroup = useSelect(
    studyOption_group,
    data.me.studyPurpose === "학습" ? data.me.studyGroup : "중학생"
  )

  const studyGroup2 = useSelect_dynamic(
    studyOption_group2,
    // studyOption_group2,
    studyGroup.optionList.indexOf(studyGroup.value),
    data.me.studyPurpose === "학습" ? data.me.studyGroup2 : "1학년"
  )

  const studyGroup3 = useSelect_dynamic2(
    studyOption_group3,
    studyGroup.optionList.indexOf(studyGroup.value),
    // studyGroup2.optionIndex,
    studyGroup2.optionList.indexOf(studyGroup2.value),
    data.me.studyGroup3
  )

  const myAddress1 = useSelect(address1, data.me.address1)
  const myAddress2 = useSelect_dynamic(
    address2_total,
    // myAddress1.optionIndex,
    myAddress1.optionList.indexOf(myAddress1.value),
    data.me.address2
  )
  // const myAddress1 = useSelect(
  //   address1,
  //   address1,
  //   data.me.loginPosition === "student" ? data.me.address1 : data.me.organization.address1
  // )
  // const myAddress2 = useSelect_dynamic(
  //   address2_total,
  //   address2_total,
  //   myAddress1.optionList,
  //   myAddress1.option,
  //   data.me.loginPosition === "student" ? data.me.address2 : data.me.organization.address2
  // )
  const onChangeMarketing = () => {
    setMarketing(!marketing)
  }
  const [editAccountMutation] = useMutation(EDIT_ACCOUNT)
  const [editAccountMMutation] = useMutation(EDIT_ACCOUNT_M)
  const [editPasswordMutation] = useMutation(EDIT_PASSWORD)
  const [sPhoneVerificationMutation] = useMutation(S_PHONE_VERIFICATION, {
    variables: {
      phoneNumber: "82" + phoneNumber.value,
    },
  })
  const [cPhoneVerificationMutation] = useMutation(C_PHONE_VERIFICATION, {
    variables: {
      phoneNumber: "82" + phoneNumber.value,
      key: phoneKey.value,
    },
  })
  const [sEmailVerificationMutation] = useMutation(S_EMAIL_VERIFICATION, {
    variables: {
      emailAdress: email.value,
    },
  })
  const [cEmailVerificationMutation] = useMutation(C_EMAIL_VERIFICATION, {
    variables: {
      emailAdress: email.value,
      key: emailKey.value,
    },
  })
  const onEditAccount = async (e) => {
    e.preventDefault()
    if (data.me.loginPosition === "student") {
      try {
        setAcLoading(true)
        // Alert.alert("프로필 수정 중...")
        const {
          data: { editAccount },
        } = await editAccountMutation({
          variables: {
            firstName: firstName.value,
            lastName: lastName.value,
            username: username.value,
            bio: bio.value,
            email: email.value,
            phoneNumber: "82" + phoneNumber.value,
            studyPurpose: studyPurpose.value,
            studyGroup: studyPurpose.value === "학습" ? studyGroup.value : "해당 없음",
            studyGroup2: studyPurpose.value === "학습" ? studyGroup2.value : "해당 없음",
            studyGroup3: studyPurpose.value === "학습" ? studyGroup3.value : "해당 없음",
            address1: myAddress1.value,
            address2: myAddress2.value,
            termsOfMarketing: marketing,
            pubOfFeed: data.me.pubOfFeed,
            pubOfStatistic: data.me.pubOfStatistic,
            pubOfSchedule: data.me.pubOfSchedule,
          },
          refetchQueries: () => [{ query: ME }],
        })

        if (!editAccount) {
          Alert.alert("프로필을 수정할 수 없습니다.")
        } else {
          await refetch()
          Alert.alert("프로필 수정이 완료되었습니다.")
          navigation.navigate("UserProfile")
        }
      } catch (e) {
        const realText = e.message.split("GraphQL error: ")
        Alert.alert(realText[1])
      } finally {
        setAcLoading(false)
      }
    } else {
      try {
        setAcLoading(true)

        // Alert.alert("프로필 수정 중...")
        const {
          data: { editAccount_M },
        } = await editAccountMMutation({
          variables: {
            firstName: firstName.value,
            lastName: lastName.value,
            username: username.value,
            email: email.value,
            bio: bio.value,
            phoneNumber: "82" + phoneNumber.value,
            name: organizationName.value,
            address1: myAddress1.value,
            address2: myAddress2.value,
            detailAddress: detailAddress.value,
            termsOfMarketing: marketing,
            pubOfFeed: data.me.pubOfFeed,
            pubOfStatistic: data.me.pubOfStatistic,
            pubOfSchedule: data.me.pubOfSchedule,
          },
          refetchQueries: () => [{ query: ME }],
        })
        if (!editAccount_M) {
          Alert.alert("프로필을 수정할 수 없습니다.")
        } else {
          await refetch()
          Alert.alert("프로필 수정이 완료되었습니다.")
          navigation.navigate("UserProfile")
        }
      } catch (e) {
        const realText = e.message.split("GraphQL error: ")
        Alert.alert(realText[1])
      } finally {
        setAcLoading(false)
      }
    }
  }

  const onEditPassword = async (e) => {
    e.preventDefault()
    if (password_pre.value === password.value) {
      Alert.alert("이전 비밀번호와 새 비밀번호가 동일합니다.")
    } else if (password.errorChk || password2.errorChk) {
      Alert.alert("새 비밀번호를 다시 확인하세요.")
    } else {
      try {
        setAcLoading(true)
        const {
          data: { editPassword },
        } = await editPasswordMutation({
          variables: {
            password_pre: password_pre.value,
            password: password.value,
          },
        })
        if (!editPassword) {
          Alert.alert("비밀번호를 수정할 수 없습니다.")
          setAcLoading(false)
        } else {
          await refetch()
          password_pre.setValue("")
          password.setValue("")
          password2.setValue("")
          Alert.alert("비밀번호 수정이 완료되었습니다.")
          navigation.navigate("UserProfile")
        }
      } catch (e) {
        const realText = e.message.split("GraphQL error: ")
        // alert(realText[1]);
        Alert.alert(realText[1])
        setAcLoading(false)
      } finally {
        setAcLoading(false)
      }
    }
  }

  const sEmailOnClick = async () => {
    try {
      setVLoading(true)
      const {
        data: { startEmailVerification },
      } = await sEmailVerificationMutation()
      if (!startEmailVerification) {
        Alert.alert("인증번호를 요청할 수 없습니다.")
      } else {
        Alert.alert("해당 Email로 인증번호를 발송했습니다.")
      }
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
    } finally {
      setVLoading(false)
    }
  }

  const sPhoneOnClick = async () => {
    try {
      setVLoading(true)
      const {
        data: { startPhoneVerification },
      } = await sPhoneVerificationMutation()
      if (!startPhoneVerification) {
        Alert.alert("인증번호를 요청할 수 없습니다.")
      } else {
        Alert.alert("해당 번호로 인증번호를 발송했습니다.")
      }
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
    } finally {
      setVLoading(false)
    }
  }

  const cEmailOnClick = async () => {
    try {
      Alert.alert("인증번호 확인 중...")
      await cEmailVerificationMutation()
      emailKey.setValue("")
      Alert.alert("Email 인증이 완료됐습니다.")
      return true
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
      return false
    }
  }

  const cPhoneOnClick = async () => {
    try {
      Alert.alert("인증번호 확인 중...")
      await cPhoneVerificationMutation()
      phoneKey.setValue("")
      Alert.alert("휴대폰 인증이 완료됐습니다.")
      return true
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
      return false
    }
  }
  return (
    <SetProfile
      data={data}
      onRefresh={onRefresh}
      navigation={navigation}
      loading={loading}
      firstName={firstName}
      lastName={lastName}
      username={username}
      bio={bio}
      email={email}
      emailKey={emailKey}
      phoneNumber={phoneNumber}
      phoneKey={phoneKey}
      studyPurpose={studyPurpose}
      studyGroup={studyGroup}
      studyGroup2={studyGroup2}
      studyGroup3={studyGroup3}
      myAddress1={myAddress1}
      myAddress2={myAddress2}
      organizationName={organizationName}
      detailAddress={detailAddress}
      marketing={marketing}
      onChangeMarketing={onChangeMarketing}
      onEditAccount={onEditAccount}
      onEditPassword={onEditPassword}
      sPhoneOnClick={sPhoneOnClick}
      cPhoneOnClick={cPhoneOnClick}
      sEmailOnClick={sEmailOnClick}
      cEmailOnClick={cEmailOnClick}
      password_pre={password_pre}
      password={password}
      password2={password2}
      maxLen_11={maxLen_11}
      vLoading={vLoading}
      acLoading={acLoading}
    />
  )
}

export default EditProfile
