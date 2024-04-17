import React, {Fragment, useState} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import {Colors, Typography} from '../styles';

type customSettingsInputProps = {
  title?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: any;
  formValues?: any;
  setFormValues?: any;
  typeValue?: string;
};

const handleValues = (
  formValues: any,
  setFormValues: any,
  newValue: any,
  typeValue: any,
) => {
  typeValue === 'adress1'
    ? setFormValues({
        ...formValues,
        address1: newValue,
      })
    : typeValue === 'adress2'
    ? setFormValues({
        ...formValues,
        address2: newValue,
      })
    : typeValue === 'city'
    ? setFormValues({
        ...formValues,
        city: newValue,
      })
    : typeValue === 'state'
    ? setFormValues({
        ...formValues,
        state: newValue,
      })
    : typeValue === 'zipcode'
    ? setFormValues({
        ...formValues,
        zipcode: newValue,
      })
    : null;
};

const CustomSettingsInput = ({
  title,
  placeholder,
  disabled,
  value,
  formValues,
  setFormValues,
  typeValue,
}: customSettingsInputProps) => {
  return (
    <View style={styles.mainContainer}>
      {disabled ? (
        <View pointerEvents="none">
          <Text style={styles.title}>{title}</Text>
          <TextInput
            placeholder={placeholder}
            style={styles.inputDisabled}
            value={value}
          />
        </View>
      ) : (
        <View>
          <Text style={styles.title}>{title}</Text>
          <TextInput
            placeholder={placeholder}
            style={styles.input}
            value={value}
            onChangeText={text =>
              handleValues(formValues, setFormValues, text, typeValue)
            }
            maxLength={title === 'Zip code' ? 5 : 20}
          />
        </View>
      )}
    </View>
  );
};

export default CustomSettingsInput;

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 16,
    backgroundColor: Colors.white,
    paddingHorizontal: 15,
  },
  title: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: 12,
    paddingLeft: 10,
    paddingBottom: 2,
  },
  input: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: 16,
    borderBottomColor: Colors.black,
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingTop: 2,
    paddingBottom: 7,
  },
  inputDisabled: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: 16,
    borderBottomColor: Colors.greyInputDisabled,
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingTop: 2,
    paddingBottom: 7,
  },
});
