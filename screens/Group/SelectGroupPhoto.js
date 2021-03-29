import React, { useState, useEffect } from "react"
import * as Permissions from "expo-permissions"
import { Image, ScrollView, TouchableOpacity, SafeAreaView } from "react-native"
import * as MediaLibrary from "expo-media-library"
import styled from "styled-components"
import Loader from "../../components/Loader"
import constants from "../../constants"
import styles from "../../styles"
import { Platform } from "react-native"
import { Container, Header, TabHeading, Content, Tabs } from "native-base"
import NavBlackIcon from "../../components/NavBlackIcon"

const View = styled.View`
  flex: 1;
`

const Button = styled.TouchableOpacity`
  width: 100px;
  height: 30px;
  position: absolute;
  right: 5px;
  top: 15px;
  background-color: ${styles.blueColor};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`

const Text = styled.Text`
  color: white;
  font-family: "GmarketMedium";
`
const MainView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
`
const SubView = styled.View`
  flex: 1;
`
const SubView1 = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`
const MainText = styled.Text`
  font-size: 17;
  font-family: "GmarketBold";

  color: #0f4c82;
`
const MainText2 = styled.Text`
  font-size: 17;
  font-family: "GmarketBold";

  color: #ffffff;
`
export default ({ navigation }) => {
  const [loading, setLoading] = useState(true)
  const [hasPermission, setHasPermission] = useState(false)
  const [selected, setSelected] = useState()
  const [allPhotos, setAllPhotos] = useState()
  const changeSelected = (photo) => {
    setSelected(photo)
  }
  let OSPhoto = Platform.OS == "ios" ? 500 : 300
  const getPhotos = async () => {
    try {
      const { assets } = await MediaLibrary.getAssetsAsync({ first: OSPhoto })
      const [firstPhoto] = assets
      setSelected(firstPhoto)
      setAllPhotos(assets)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }
  const param = navigation.getParam("id")
  const askPermission = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if (status === "granted") {
        setHasPermission(true)
        getPhotos()
      }
    } catch (e) {
      console.log(e)
      setHasPermission(false)
    }
  }

  const handleSelected = () => {
    if (param == "createGroup") {
      navigation.navigate("CreateGroupContainer", { photo: selected })
    } else {
      navigation.navigate("EditGroup", { photo: selected })
    }
  }
  useEffect(() => {
    askPermission()
  }, [])
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <View>
          {hasPermission ? (
            <Container>
              <Header hasTabs>
                <MainView>
                  <SubView>
                    <TouchableOpacity
                      onPress={() => {
                        if (param == "createGroup") {
                          navigation.navigate("CreateGroupContainer")
                        } else {
                          navigation.navigate("EditGroup")
                        }
                      }}
                    >
                      <NavBlackIcon
                        name={
                          Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"
                        }
                      />
                    </TouchableOpacity>
                  </SubView>
                  <SubView1>
                    {Platform.OS === "ios" ? (
                      <MainText>사진 선택</MainText>
                    ) : (
                      <MainText2>사진 선택</MainText2>
                    )}
                  </SubView1>
                  <SubView></SubView>
                </MainView>
              </Header>
              <Content>
                <Image
                  style={{ width: constants.width, height: constants.height / 2.5 }}
                  source={{ uri: selected.uri }}
                />

                <Button onPress={handleSelected}>
                  <Text>Select Photo</Text>
                </Button>

                <ScrollView
                  contentContainerStyle={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  {allPhotos.map((photo) => (
                    <TouchableOpacity key={photo.id} onPress={() => changeSelected(photo)}>
                      <Image
                        source={{ uri: photo.uri }}
                        style={{
                          width: constants.width / 4,
                          height: constants.height / 8,
                          opacity: photo.id === selected.id ? 0.5 : 1,
                        }}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Content>
            </Container>
          ) : null}
        </View>
      )}
    </>
  )
}
