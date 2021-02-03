import React from "react"
import { Ionicons } from "@expo/vector-icons"
import PropTypes from "prop-types"
import styles from "../styles"
import { Platform } from "react-native"

const NavBlackIcon = ({ focused = true, name, color = "#262626", size = 40 }) => (
  <Ionicons name={name} color={focused ? color : styles.darkGreyColor} size={size} />
)

NavBlackIcon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
  focused: PropTypes.bool,
}

export default NavBlackIcon
