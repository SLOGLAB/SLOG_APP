import React from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import constants from "../constants"
import { ActivityIndicator } from "react-native"

const Touchable = styled.TouchableOpacity``

const Container = styled.View`
  background-color: ${(props) => (props.bgColor ? props.bgColor : props.theme.blueColor)};
  padding: ${(props) => props.paddingArray[0]}px ${(props) => props.paddingArray[1]}px
    ${(props) => props.paddingArray[2]}px ${(props) => props.paddingArray[3]}px;
  margin: ${(props) => props.marginArray[0]}px ${(props) => props.marginArray[1]}px
    ${(props) => props.marginArray[2]}px ${(props) => props.marginArray[3]}px;
  border-radius: 4px;
  width: ${(props) => constants.width / props.widthRatio};
`

const Text = styled.Text`
  color: ${(props) => props.color};
  text-align: center;
  font-family: "GmarketMedium";
  font-size: 10;
`

const AuthButton = ({
  text,
  color,
  onPress,
  loading = false,
  bgColor = null,
  marginArray = [0, 0, 0, 0],
  paddingArray = [10, 10, 10, 10],
  widthRatio = 1.7,
}) => (
  <Touchable disabled={loading} onPress={onPress}>
    <Container
      bgColor={bgColor}
      marginArray={marginArray}
      widthRatio={widthRatio}
      paddingArray={paddingArray}
    >
      {loading ? <ActivityIndicator color={color} /> : <Text color={color}>{text}</Text>}
    </Container>
  </Touchable>
)

AuthButton.propTypes = {
  loading: PropTypes.bool,
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
}

export default AuthButton
