import React from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import constants from "../constants"
import { ActivityIndicator } from "react-native"

const Touchable = styled.TouchableOpacity``

const Container = styled.View`
  background-color: white;
  width: ${constants.width / 9};
  padding: 10px;
  border: 1px solid ${(props) => props.theme.darkGreyColor};
  border-radius: 4px;
`

const Text = styled.Text`
  color: black;
  text-align: center;
  font-family: "GmarketBold";
`

const WeekButton = ({ text, onPress, loading = false, bgColor }) => (
  <Touchable onPress={onPress}>
    <Container bgColor={bgColor}>
      {loading ? <ActivityIndicator color={"white"} /> : <Text>{text}</Text>}
    </Container>
  </Touchable>
)

WeekButton.propTypes = {
  loading: PropTypes.bool,
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
}

export default WeekButton
