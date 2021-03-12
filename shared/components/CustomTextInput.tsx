import React from 'react';
import {StyleSheet, Platform, TextInput} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

type IProps = {
  bottomBorderColor?: string;
  placeholder: string;
  setfocusBorder?: () => void;
  setBlurfocusBorder?: () => void;
  onChangeFn: (value: string) => void;
  value: string;
  isPassword?: boolean | undefined;
  keyboardType:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'number-pad'
    | 'decimal-pad'
    | 'visible-password'
    | 'ascii-capable'
    | 'numbers-and-punctuation'
    | 'url'
    | 'name-phone-pad'
    | 'twitter'
    | 'web-search'
    | undefined;
};

export function CustomTextInput({
  bottomBorderColor,
  placeholder,
  setfocusBorder,
  setBlurfocusBorder,
  onChangeFn,
  value,
  isPassword,
  keyboardType,
}: IProps) {
  const {colors} = useThemeState();
  const styles = getStyles(colors);
  let pass = isPassword || false;
  return (
    <TextInput
      autoCapitalize="none"
      style={[styles.inputStyle, {borderBottomColor: bottomBorderColor}]}
      placeholder={placeholder}
      onFocus={setfocusBorder}
      onBlur={setBlurfocusBorder}
      onChangeText={onChangeFn}
      placeholderTextColor={Color.$grey_100}
      keyboardType={keyboardType}
      value={value}
      secureTextEntry={pass}
    />
  );
}

const getStyles = (colors: IColors) => {
  return StyleSheet.create({
    inputStyle: {
      marginTop: Platform.OS === 'ios' ? hp(3) : hp(1),
      borderBottomWidth: 2,
      paddingBottom: hp(1),
      borderBottomColor: $grey_200,
      color: colors['header-text'],
    },
  });
};
