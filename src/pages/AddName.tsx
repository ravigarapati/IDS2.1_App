import React, {useState, useEffect} from 'react';
import {CustomText, CustomInputText, Button} from '../components';
import {Dictionary} from '../utils/dictionary';
import {Enum} from '../utils/enum';
import {StyleSheet, View} from 'react-native';
import * as authActions from '../store/actions/AuthActions';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {validateInputField} from '../utils/Validator';
import {Colors} from '../styles/colors';
import {Typography} from '../styles';

export default function AddName(props) {
  const dispatch = useDispatch();
  const userFromStore = useSelector(state => state.auth.user);
  const userToCreate = useSelector(state => state.auth.currentUser);

  const [userName, setuserName] = useState({
    firstName: userToCreate.firstName,
    lastName: userToCreate.lastName,
  });
  const [errorData, setErrorData] = useState({
    firstName: userName.firstName ? '' : null,
    lastName: userName.lastName ? '' : null,
  });
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    if (errorData.firstName === '' && errorData.lastName === '') {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [errorData]);

  function setCurrentStepValue(stepNumber) {
    dispatch(authActions.setCurrentStep(stepNumber));
  }

  function setFormValue(field, value) {
    setuserName(prevData => ({
      ...prevData,
      [field]: value,
    }));
    dispatch(authActions.setUserName(userName));
  }

  function changeHandler(field, value, pattern) {
    setFormValue(field, value);
    let validation = validateInputField(value, pattern);
    setErrorValue(field, validation.errorText);
  }

  function setUserAttributes() {
    let user = {name: userName.firstName + ' ' + userName.lastName};
    dispatch(authActions.updateUserAttributes(userFromStore, user));
    let userObj = {firstName: userName.firstName, lastName: userName.lastName};
    dispatch(authActions.updateUserObject(userObj));
    setCurrentStepValue(2);
  }

  function setErrorValue(field, value) {
    setErrorData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  }

  return (
    <View style={[styles.flex1]}>
      <View style={[styles.flex1, styles.spaceEvenly]}>
        <CustomInputText
          disableCache={false}
          autoCapitalize="words"
          placeholder={Dictionary.createProfile.firstName}
          value={userName.firstName}
          onChange={(text: any) =>
            changeHandler('firstName', text, Enum.firstNamePattern)
          }
          isRequiredField={true}
          maxLength={25}
          errorText={
            errorData.firstName
              ? Dictionary.createProfile.firstNameRequired
              : ''
          }
        />

        <CustomInputText
          disableCache={false}
          autoCapitalize="words"
          placeholder={Dictionary.createProfile.lastName}
          value={userName.lastName}
          maxLength={25}
          onChange={(text: any) =>
            changeHandler('lastName', text, Enum.lastNamePattern)
          }
          isRequiredField={true}
          errorText={
            errorData.lastName ? Dictionary.createProfile.lastNameRequired : ''
          }
        />
      </View>
      <View style={styles.buttonContainer}>
        <CustomText text={Dictionary.createProfile.pressNext} newline={true} />
        <Button
          disabled={!formValid}
          type="primary"
          text={Dictionary.button.next}
          onPress={() => {
            setUserAttributes();
          }}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  spaceEvenly: {
    justifyContent: 'space-evenly',
  },
  buttonContainer: {
    paddingTop: 20,
    justifyContent: 'flex-end',
    flex: 1,
  },
});
