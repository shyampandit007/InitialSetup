import React, { Component } from 'react'
import { Animated, Easing, StyleSheet, TextInput, TextInputProps, View } from 'react-native'
import { CustomText, IconButtonWrapper } from '.'
import { borderRadius, colors, fontDimens } from '../common'
import { icons } from '../common/icons'

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderRadius: borderRadius.radius,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderColor: colors.grey,
    backgroundColor: colors.grey,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textInput: {
    padding: 0,
    margin: 0,
    flex: 1
  },
  labelContainer: {
    position: 'absolute',
    // top: -3 - (fontDimens.normal / 2),
    left: 15,
    backgroundColor: colors.white
  },
  labelText: {
    fontSize: fontDimens.normal,
    // lineHeight: 34,
    color: colors.labelColor,
    paddingHorizontal: 5
  },
  errorMsg: {
    color: colors.red,
    paddingVertical: 2
  }
})

interface IProps extends TextInputProps {
  label?: string
  shouldShowEyeIcon?: boolean
  inputValue?: string
  errorMsg?: string
}

interface IState {
  isPasswordVisible?: boolean
}

export class TextInputComponent extends Component<IProps, IState> {

  animatedValue
  borderColor
  backgroundColor
  labelColor
  labelViewZIndex
  constructor(props: IProps, state: IState) {
    super(props, state)
    this.animatedValue = props.inputValue?.length > 0 ? new Animated.Value(1) : new Animated.Value(0)
    this.borderColor = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.grey, colors.lightBlue]
    })
    this.backgroundColor = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.grey, colors.white]
    })
    this.labelColor = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.labelColor, colors.lightBlue]
    })
    this.labelViewZIndex = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-1, 1]
    })
    this.state = {
      isPasswordVisible: props.shouldShowEyeIcon ? true : false
    }
  }

  textInputRef

  onFocusTextInput = () => {
    // this.animatedValue.setValue(1)
    Animated.timing(this.animatedValue, {
      toValue: 1,
      useNativeDriver: false,
      duration: 300,
      easing: Easing.out(Easing.ease)
    }).start()
  }

  onBlurTextInput = () => {
    const { inputValue } = this.props
    if (!inputValue) {
      Animated.timing(this.animatedValue, {
        toValue: 0,
        useNativeDriver: false,
        duration: 300,
        easing: Easing.out(Easing.ease)
      }).start()
    }
  }

  onEyeIconPressed = () => {
    const { isPasswordVisible } = this.state

    this.setState({
      isPasswordVisible: !isPasswordVisible
    })
  }

  renderEyeIcon = () => {
    const { isPasswordVisible } = this.state
    return (
      <IconButtonWrapper
        iconImage={ isPasswordVisible ? icons.EYE_ICON : icons.EYE_ICON}
        iconHeight = {11}
        iconWidth = {20}
        imageResizeMode = {'contain'}
        submitFunction = {this.onEyeIconPressed}
      />
    )
  }

  renderErrorMsg = () => {
    const { errorMsg} = this.props
    return (
      <CustomText textStyle={styles.errorMsg}>
        {errorMsg}
      </CustomText>
    )
  }

  renderLabelComponent = () => {
    const { label, errorMsg } = this.props
    let labelColor = this.labelColor
    if (errorMsg) {
      labelColor = colors.red
    }
    return (
      <Animated.View style = {[styles.labelContainer, {
        transform: [
          {
            translateY: this.animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -15 - (fontDimens.normal / 2)],
              extrapolate: 'clamp'
            })
          }
        ],
        zIndex: this.labelViewZIndex,
        backgroundColor: this.backgroundColor

      }]}>
        <CustomText textStyle={{ ...styles.labelText,
          color: labelColor
        }}
        useAnimatedText>{label}</CustomText>
      </Animated.View>
    )
  }

  render() {
    const { inputValue, errorMsg = '', shouldShowEyeIcon, label } = this.props
    const { isPasswordVisible } = this.state
    let borderColor = this.borderColor
    let labelColor = this.labelColor
    if (errorMsg) {
      borderColor = colors.red
      labelColor = colors.red
    }
    return (
      <>
        <Animated.View style = {[styles.inputContainer, { borderColor, backgroundColor: this.backgroundColor }]}>
          <TextInput style = {styles.textInput}
            ref = {(ref) => {
              if (!this.textInputRef) {
                this.textInputRef = ref
              }
            }}
            onFocus={this.onFocusTextInput}
            onBlur = {this.onBlurTextInput}
            value = {inputValue}
            selectionColor = {colors.black}
            secureTextEntry = {isPasswordVisible}
            {...this.props}
          />
          {this.renderLabelComponent()}
          {shouldShowEyeIcon && this.renderEyeIcon()}
        </Animated.View>
        {errorMsg?.length > 0 && ( this.renderErrorMsg() )}
      </>
    )
  }
}
