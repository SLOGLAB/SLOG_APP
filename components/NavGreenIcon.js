import React from "react"
import { Ionicons } from "@expo/vector-icons"
import { Platform } from "react-native"

import PropTypes from "prop-types"
import styles from "../styles"

const NavGreenIcon = ({ focused = true, name, color = "#0F4C82", size = 30 }) => (
  <Ionicons name={name} color={focused ? color : styles.darkGreyColor} size={size} />
)

NavGreenIcon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
  focused: PropTypes.bool,
}

export default NavGreenIcon
