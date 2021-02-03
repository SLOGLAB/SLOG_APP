import React from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import constants from "../constants"
import { ActivityIndicator } from "react-native"

const Touchable = styled.TouchableOpacity``

const Container = styled.View`
  background-color: ${(props) => (props.bgColor ? props.bgColor : props.theme.blueColor)};
  padding: 10px;
  margin: 0px 50px;
  border-radius: 4px;
  width: ${constants.width / 3};
`

const Text = styled.Text`
  color: ${(props) => props.color};
  text-align: center;
  font-family: "GmarketBold";
`

const AButton = ({ text, onPress, loading = false, bgColor = null, color = "white" }) => (
  <Touchable disabled={loading} onPress={onPress}>
    <Container bgColor={bgColor}>
      {loading ? <ActivityIndicator color={"white"} /> : <Text color={color}>{text}</Text>}
    </Container>
  </Touchable>
)

AButton.propTypes = {
  loading: PropTypes.bool,
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
}

export default AButton
