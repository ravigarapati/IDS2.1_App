import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  Linking,
} from 'react-native';
import {
  BoschIcon,
  CustomText,
  InfoTooltip,
  ProgressIndicator,
  Button,
  Link,
  CreateProfileWalkthrough,
} from '../components';
import {Colors, Typography} from '../styles';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Dictionary} from '../utils/dictionary';
import * as authActions from '../store/actions/AuthActions';
import AddName from './AddName';
import ContractorAddAddress from './ContractorAddAddress';
import HomeOwnerAddAddress from './HomeOwnerAddAddress';
import VerifyPhoneNumber from './VerifyPhoneNumber';
import WelcomePage from './WelcomePage';
import {Enum} from '../utils/enum';
import {Icons} from '../utils/icons';

export default function CreateProfile(props) {
  const dispatch = useDispatch();
  const currentStep = useSelector(state => state.auth.currentStep);
  const showRole = useSelector(state => state.auth.showRole);
  const [stepCount, setStepCount] = useState(3);
  const userRole = useSelector(state => state.auth.currentRole);
  const userFromStore = useSelector(state => state.auth.user);
  var scrollViewRef = useRef<ScrollView>();
  const [phoneNoVerified, setPhoneNoVerified] = useState(false);
  const stepTitles = useSelector(state => state.auth.stepTitles);
  const verificationStatusValue = val => {
    setPhoneNoVerified(val);
  };

  useEffect(() => {
    setStepCount(stepTitles.length);
  }, []);

  useEffect(() => {
    scrollViewRef?.current?.scrollTo({x: 0, y: 0, animated: false});
  }, [currentStep]);

  function setCurrentStepValue(stepNumber) {
    dispatch(authActions.setCurrentStep(stepNumber));
  }
  function onBack() {
    if (currentStep === 1) {
      setCurrentStepValue(0);
      dispatch(authActions.resetUser());
    } else if (userRole !== Enum.roles.homeowner && currentStep === 2) {
      setCurrentStepValue(1);
    } else if (userRole === Enum.roles.homeowner && currentStep === 2) {
      setCurrentStepValue(1);
    } else if (currentStep === 3) {
      setCurrentStepValue(2);
    } else if (currentStep === 0 && showRole) {
      dispatch(authActions.setShowRole(false));
    }
  }
  function setUserAttributes() {
    let userObj = {
      role: userRole,
      email: userFromStore.attributes.email,
    };
    dispatch(authActions.updateUserObject(userObj));
    if (userRole === Enum.roles.contractor) {
      dispatch(
        authActions.setStepTitles([
          {name: Dictionary.createProfile.step1ContractorInfo},
          {name: Dictionary.createProfile.step2ContractorAddress},
          {name: Dictionary.createProfile.step3VerifyPhoneNumber},
        ]),
      );
    } else if (userRole === Enum.roles.homeowner) {
      dispatch(
        authActions.setStepTitles([
          {name: Dictionary.createProfile.step1HomeownerInfo},
          {name: Dictionary.createProfile.step2VerifyPhoneNumber},
        ]),
      );
    } else {
      dispatch(
        authActions.setStepTitles([
          {name: Dictionary.createProfile.step1AdminInfo},
          {name: Dictionary.createProfile.step2ContractorAddress},
          {name: Dictionary.createProfile.step3VerifyPhoneNumber},
        ]),
      );
    }
    setCurrentStepValue(1);
  }
  return (
    <View style={[styles.flex1]}>
      <>
        <View style={styles.headerContainer}>
          {currentStep < 4 && showRole && (
            <View style={styles.headerDivision}>
              <TouchableOpacity
                style={styles.headerBackButton}
                onPress={() => onBack()}>
                <BoschIcon
                  name={Icons.backLeft}
                  size={24}
                  style={[styles.marginHorizontal10, {height: 24}]}
                />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.headerTitle}>
            <CustomText size={21} newline={true} text="Create Your Profile" />
          </View>
        </View>
        <Image
          style={styles.headerRibbon}
          source={require('../assets/images/header_ribbon.png')}
        />
      </>
      {currentStep !== 0 && currentStep !== 4 && (
        <View
          style={[
            styles.stepper,
            {paddingHorizontal: userRole === Enum.roles.homeowner ? 70 : 10},
          ]}>
          <ProgressIndicator
            steps={stepCount}
            currentStep={currentStep - 1}
            phoneNoVerified={phoneNoVerified}
            stepTitles={stepTitles}
          />
        </View>
      )}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.container}
        contentContainerStyle={styles.flexGrow1}
        ref={scrollViewRef}>
        {currentStep === 0 && !showRole && (
          <View style={[styles.flex1, styles.padding10]}>
            <View style={[styles.flex1, styles.justifyCenter]}>
              <CustomText
                size={21}
                newline={true}
                text={Dictionary.createProfile.thanks}
              />
              <CustomText
                size={16}
                newline={true}
                text={Dictionary.createProfile.additionalInfo}
              />
              <View style={styles.flexRow}>
                <BoschIcon
                  size={20}
                  name={Icons.infoTooltip}
                  color={Colors.black}
                  accessibilityLabel={'Info'}
                  style={{height: 20}}
                />
                <CustomText
                  size={12}
                  align="left"
                  newline={true}
                  text={Dictionary.createProfile.respectPrivacy}
                  style={[styles.flexShrink1, styles.padLeft5]}
                />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <CustomText
                text={Dictionary.createProfile.pressNext}
                newline={true}
              />
              <Button
                type="primary"
                text={Dictionary.button.next}
                onPress={() => dispatch(authActions.setShowRole(true))}
              />
            </View>
          </View>
        )}
        {currentStep === 0 && showRole && (
          <>
            <CreateProfileWalkthrough />
            <View style={styles.flex1}>
              <View
                style={[styles.flex1, styles.padding20, styles.justifyCenter]}>
                <CustomText
                  size={20}
                  newline={true}
                  text={Dictionary.createProfile.whoAreYou}
                />
                <View
                  style={[
                    styles.flexRow,
                    styles.spaceBetween,
                    styles.alignCenter,
                  ]}>
                  <CustomText
                    align="left"
                    text={Dictionary.createProfile.selectRole}
                  />

                  <InfoTooltip
                    positionHorizontal="right"
                    positionVertical="bottom"
                    text={Dictionary.createProfile.tooltipText}
                  />
                </View>
                <Button
                  type={
                    userRole === Enum.roles.homeowner ? 'primary' : 'secondary'
                  }
                  text={Dictionary.userRole.homeowner}
                  onPress={() => {
                    setStepCount(2);
                    dispatch(authActions.setUserRole(Enum.roles.homeowner));
                  }}
                />
                <Button
                  type={
                    userRole === Enum.roles.contractor ? 'primary' : 'secondary'
                  }
                  text={Dictionary.userRole.contractor}
                  onPress={() => {
                    setStepCount(3);
                    dispatch(authActions.setUserRole(Enum.roles.contractor));
                  }}
                />
                <Button
                  type={
                    userRole === Enum.roles.contractorPowerUser
                      ? 'primary'
                      : 'secondary'
                  }
                  text={Dictionary.userRole.adminContractor}
                  onPress={() => {
                    setStepCount(3);
                    dispatch(
                      authActions.setUserRole(Enum.roles.contractorPowerUser),
                    );
                  }}
                />
              </View>

              <View style={styles.buttonContainer}>
                <CustomText
                  newline={true}
                  text={Dictionary.createProfile.pressNext}
                />

                <Button
                  type="primary"
                  disabled={userRole === ''}
                  text={Dictionary.button.next}
                  onPress={() => setUserAttributes()}
                />
              </View>
            </View>
          </>
        )}
        {currentStep === 1 && <AddName role={userRole} />}
        {userRole !== Enum.roles.homeowner && currentStep === 2 && (
          <ContractorAddAddress />
        )}
        {userRole === Enum.roles.homeowner && currentStep === 2 && (
          <VerifyPhoneNumber
            verificationStatus={verificationStatusValue}
            role={userRole}
          />
        )}

        {currentStep === 3 && (
          <VerifyPhoneNumber
            verificationStatus={verificationStatusValue}
            role={userRole}
          />
        )}

        {currentStep === 4 && <WelcomePage navigation={props.navigation} />}

        <View style={styles.footer}>
          <Link
            text={Dictionary.button.privacy}
            url="https://issuu.com/boschthermotechnology/docs/ids_2.1_privacy_policy?fr=sNzI2MjM0ODk1MzU"
            size={12}
          />

          <Link
            text={Dictionary.button.termsAndConditions}
            url="https://issuu.com/boschthermotechnology/docs/ids_2.1_terms_of_conditions?fr=sZWY1YTM0ODk1MzU"
            size={12}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...Typography.alignCenter,
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: Colors.white,
    flex: 1,
  },
  stepper: {
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: Colors.white,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
  },
  flex1: {
    flex: 1,
  },
  spaceEvenly: {
    justifyContent: 'space-evenly',
  },
  fontSize12: {
    fontSize: 12,
  },
  flexRow: {
    flexDirection: 'row',
  },
  paddingTop10: {
    paddingTop: 10,
  },
  alignCenter: {
    alignItems: 'center',
  },
  flexGrow1: {
    flexGrow: 1,
  },
  flexShrink1: {
    flexShrink: 1,
  },
  padLeft5: {
    paddingLeft: 5,
  },
  padding10: {
    padding: 10,
  },
  padding20: {
    padding: 20,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  headerContainer: {backgroundColor: '#ffff', height: 70, flexDirection: 'row'},
  headerDivision: {
    flexDirection: 'column',
    flex: 0.15,
    backgroundColor: '#ffff',
    justifyContent: 'center',
  },
  headerBackButton: {
    justifyContent: 'center',
    flex: 1,
  },
  marginHorizontal10: {marginHorizontal: 10},
  headerTitle: {
    flexDirection: 'column',
    flex: 0.7,
    alignItems: 'flex-start',
    justifyContent: 'center',
    top: 15,
    marginHorizontal: 20,
  },
  headerRibbon: {height: 8, width: '100%'},
});
