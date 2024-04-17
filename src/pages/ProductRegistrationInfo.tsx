import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
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
import {useFocusEffect} from 'react-navigation-hooks';
import {Colors, Typography} from '../styles';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Dictionary} from '../utils/dictionary';
import * as contractorActions from '../store/actions/ContractorActions';
import AddProductInfo from './ProductRegistration/AddProductInfo';
import AddHomeOwnerInfo from './ProductRegistration/AddHomeOwnerInfo';
import {Enum} from '../utils/enum';
import {Icons} from '../utils/icons';
import {MenuButton} from '../navigations/NavConfig';
import {FONT_FAMILY_BOLD, alignCenter} from '../styles/typography';
import Amplify, {Auth, Hub} from 'aws-amplify';

export default function ProductRegistrationInfo(props) {
  const dispatch = useDispatch();
  const padding = {paddingHorizontal: 10};
  const currentStep = useSelector(state => state.contractor.currentStep);
  const [stepCount, setStepCount] = useState(2);
  const homeownerInfo = useSelector(state => state.contractor.prHomeownerInfo);
  const showRegisteredPopup = useSelector(
    state => state.contractor.prPopups.showRegisteredPopup,
  );
  const showHomeownerPopupState = useSelector(
    state => state.contractor.prPopups.showHomeownerPopup,
  );
  const accessToken = useSelector(
    state => state.contractor.prTokenDetails.prToken,
  );
  const tokenTimestamp = useSelector(
    state => state.contractor.prTokenDetails.prTokenTimestamp,
  );
  const ppAccountCreated = useSelector(
    state => state.contractor.ppAccountCreated,
  );
  const ppAccountCompleted = useSelector(
    state => state.contractor.ppAccountCompleted,
  );
  const stepTitles = [
    {name: Dictionary.productRegistration.productInfo},
    {name: Dictionary.productRegistration.homeownerInfo},
  ];
  var scrollViewRef = useRef<ScrollView>();
  const [isScannerActive, setIsScannerActive] = useState(false);
  const initialized = useRef(false);
  const demoMode = useSelector(state => state.notification.demoStatus);

  const scannerStatusValue = val => {
    setIsScannerActive(val);
  };
  const homeownerStatus = val => {
    setShowHomeownerPopup(val);
  };
  const [showPopup, setShowPopup] = useState(false);
  const [showSignUpPopup, setShowSignUpPopup] = useState(false);
  const [showCompletePopup, setShowCompletePopup] = useState(false);
  // const [showRegisteredPopup, setShowRegisteredPopup] = useState(false);
  const [showHomeownerPopup, setShowHomeownerPopup] = useState(false);

  const currentUser = async () => {
    try {
      // attributes are only updated here until re-auth
      // so grab attributes from here
      const session = await Auth.currentSession();

      const attributes = await Auth.currentUserInfo();
      let body = {
        username: attributes.username,
      };
      dispatch(contractorActions.getSKIDAccessToken(body));
    } catch (error) {}
  };

  function checkTimestamps() {
    let currentTimestamp = new Date().getTime();
    let timeDiff = (currentTimestamp - tokenTimestamp) / 1000;
    if (tokenTimestamp === 0) {
      currentUser();
    } else if ((!ppAccountCompleted && timeDiff > 5) || timeDiff >= 3600) {
      currentUser();
    }
  }

  useEffect(() => {
    scrollViewRef?.current?.scrollTo({x: 0, y: 0, animated: false});
  }, [currentStep]);

  function setCurrentStepValue(stepNumber) {
    if (showRegisteredPopup) {
      dispatch(contractorActions.prResetFlow());
      setShowHomeownerPopup(false);
    }
    dispatch(contractorActions.setCurrentStep(stepNumber));
  }
  function onBack() {
    if (currentStep === 1) {
      setCurrentStepValue(0);
    } else if (currentStep === 2) {
      setCurrentStepValue(1);
    } else if (currentStep === 3) {
      setCurrentStepValue(2);
    } else if (currentStep === 0) {
    }
  }

  useFocusEffect(() => {
    if (!demoMode) {
      if (!initialized.current) {
        initialized.current = true;
        if (!ppAccountCompleted || tokenTimestamp === 0) {
          checkTimestamps();
        }

        if (homeownerInfo.fullName == '') {
          setShowHomeownerPopup(false);
        }
      }
    } else {
      setShowPopup(false);
      setShowSignUpPopup(false);
      setShowCompletePopup(false);
    }
  });

  useEffect(() => {
    if (accessToken != '' && (!ppAccountCreated || !ppAccountCompleted)) {
      let data = {
        AccessToken: accessToken,
      };
      dispatch(contractorActions.getPPAccountInformation(data));
    }
  }, [accessToken]);

  useEffect(() => {
    if (!ppAccountCreated) {
      setShowPopup(true);
      setShowSignUpPopup(true);
      setShowCompletePopup(false);
    } else if (!ppAccountCompleted) {
      setShowPopup(true);
      setShowSignUpPopup(false);
      setShowCompletePopup(true);
    } else {
      setShowPopup(false);
      setShowSignUpPopup(false);
      setShowCompletePopup(false);
    }
  }, [ppAccountCreated, ppAccountCompleted]);

  return (
    <View style={[styles.flex1]}>
      <>
        {!showPopup && (
          <View style={styles.headerContainer}>
            <View style={styles.headerDivision}>
              {currentStep == 0 && (
                <TouchableOpacity
                  style={padding}
                  testID="step-1"
                  onPress={() => {
                    props.navigation.openDrawer();
                  }}>
                  <BoschIcon
                    name={Icons.listViewMobile}
                    size={34}
                    accessibilityLabel={'Menu'}
                  />
                </TouchableOpacity>
              )}
              {currentStep == 1 && (
                <TouchableOpacity
                  style={styles.headerBackButton}
                  testID="step-2"
                  onPress={() => onBack()}>
                  <BoschIcon
                    name={Icons.backLeft}
                    size={24}
                    style={styles.marginHorizontal10}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View
              style={[
                styles.headerTitle,
                {top: Platform.OS === 'ios' ? 0 : 10},
              ]}>
              <CustomText
                size={21}
                newline={true}
                text="Product Registration"
              />
            </View>
          </View>
        )}
        <Image
          style={styles.headerRibbon}
          source={require('../assets/images/header_ribbon.png')}
        />
      </>
      {!isScannerActive && !showPopup && !showHomeownerPopup && (
        <View style={styles.stepper}>
          <ProgressIndicator
            steps={stepCount}
            currentStep={currentStep}
            stepTitles={stepTitles}
            phoneNoVerified={false}
          />
        </View>
      )}
      {showSignUpPopup && (
        <View style={styles.container}>
          <View style={styles.inviteContractorContainer}>
            <View style={styles.modalContainer}>
              <CustomText
                text={Dictionary.productRegistration.pPAccountNeededTitle}
                align="center"
                font="bold"
              />
              <CustomText
                text={Dictionary.productRegistration.pPAccountNeeded}
                align="center"
                style={{padding: 10, paddingBottom: 20}}
              />
              <View style={styles.graycontainer}>
                <CustomText
                  text={'Benefits:'}
                  align="center"
                  style={{padding: 10}}
                />
                <View style={styles.flexcontainer}>
                  <BoschIcon
                    name={Icons.medal}
                    size={45}
                    color={Colors.blueOnPress}
                    accessibilityLabel={'Medal'}
                    style={[styles.flexitem, {textAlign: 'center'}]}
                  />
                  <BoschIcon
                    name={Icons.customerService}
                    size={45}
                    color={Colors.blueOnPress}
                    accessibilityLabel={'Customer Service'}
                    style={[styles.flexitem, {textAlign: 'center'}]}
                  />
                  <BoschIcon
                    name={Icons.barChartSearch}
                    size={45}
                    color={Colors.blueOnPress}
                    accessibilityLabel={'Bar Chart Search'}
                    style={[styles.flexitem, {textAlign: 'center'}]}
                  />
                  <CustomText
                    text={Dictionary.productRegistration.pPBenefits1}
                    align="center"
                    //font='bold'
                    size={15}
                    style={styles.flexitem}
                  />
                  <CustomText
                    text={Dictionary.productRegistration.pPBenefits2}
                    align="center"
                    //font='bold'
                    size={15}
                    style={styles.flexitem}
                  />
                  <CustomText
                    text={Dictionary.productRegistration.pPBenefits3}
                    align="center"
                    //font='bold'
                    size={15}
                    style={styles.flexitem}
                  />
                </View>
              </View>
              <Button
                type="primary"
                //disabled={selectedContractorId === ''}
                text={Dictionary.productRegistration.pPAccountNeededButton}
                style={{paddingTop: 10}}
                onPress={() =>
                  Linking.openURL(
                    'https://bosch-us-home.thernovo-dev.com/profile',
                  )
                }
              />
              <Button
                type="secondary"
                text={Dictionary.button.cancel}
                onPress={() => props.navigation.navigate('Home')}
              />
            </View>
          </View>
        </View>
      )}
      {showCompletePopup && (
        <View style={styles.container}>
          <View style={styles.inviteContractorContainer}>
            <View style={styles.modalContainer}>
              <CustomText
                text={Dictionary.productRegistration.pPIncompleteAccountTitle}
                align="center"
                font="bold"
              />
              <CustomText
                text={Dictionary.productRegistration.pPIncompleteAccount}
                align="center"
                style={{padding: 10}}
              />
              <View style={styles.graycontainer}>
                <CustomText
                  text={'Benefits:'}
                  align="center"
                  style={{padding: 10}}
                />
                <View style={styles.flexcontainer}>
                  <BoschIcon
                    name={Icons.medal}
                    size={45}
                    color={Colors.blueOnPress}
                    accessibilityLabel={'Medal'}
                    style={[styles.flexitem, {textAlign: 'center'}]}
                  />
                  <BoschIcon
                    name={Icons.customerService}
                    size={45}
                    color={Colors.blueOnPress}
                    accessibilityLabel={'Customer Service'}
                    style={[styles.flexitem, {textAlign: 'center'}]}
                  />
                  <BoschIcon
                    name={Icons.barChartSearch}
                    size={45}
                    color={Colors.blueOnPress}
                    accessibilityLabel={'Bar Chart Search'}
                    style={[styles.flexitem, {textAlign: 'center'}]}
                  />
                  <CustomText
                    text={Dictionary.productRegistration.pPBenefits1}
                    align="center"
                    //font='bold'
                    size={15}
                    style={styles.flexitem}
                  />
                  <CustomText
                    text={Dictionary.productRegistration.pPBenefits2}
                    align="center"
                    //font='bold'
                    size={15}
                    style={styles.flexitem}
                  />
                  <CustomText
                    text={Dictionary.productRegistration.pPBenefits3}
                    align="center"
                    //font='bold'
                    size={15}
                    style={styles.flexitem}
                  />
                </View>
              </View>

              <Button
                type="primary"
                //disabled={selectedContractorId === ''}
                text={Dictionary.productRegistration.pPIncompleteAccountButton}
                style={{paddingTop: 10}}
                onPress={() =>
                  Linking.openURL(
                    'https://bosch-us-home.thernovo-dev.com/profile',
                  )
                }
              />
              <Button
                type="secondary"
                text={Dictionary.button.cancel}
                onPress={() => props.navigation.navigate('Home')}
              />
            </View>
          </View>
        </View>
      )}
      {!showPopup && (
        <ScrollView keyboardShouldPersistTaps="handled" ref={scrollViewRef}>
          {currentStep === 0 && (
            <AddProductInfo
              navigation={props.navigation}
              scannerStatus={scannerStatusValue}
            />
          )}
          {currentStep === 1 && (
            <AddHomeOwnerInfo
              navigation={props.navigation}
              homeownerStatus={homeownerStatus}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...Typography.alignCenter,
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: Colors.blur,
    flex: 1,
  },
  stepper: {
    paddingHorizontal: 50,
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
  headerContainer: {backgroundColor: '#ffff', height: 50, flexDirection: 'row'},
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
    //top: 0,
    marginLeft: 40,
  },
  headerRibbon: {height: 8, width: '100%'},
  modalContainer: {
    //flexGrow: 1,
    maxHeight: '70%',
    //overflow: 'hidden',
    width: '100%',
    borderWidth: 0.5,
    borderColor: Colors.mediumGray,
    backgroundColor: Colors.white,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inviteContractorContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blur,
  },
  borderStyle: {
    borderBottomColor: Colors.mediumGray,
    borderBottomWidth: 1,
  },
  selected: {
    backgroundColor: Colors.darkBlue,
    padding: 10,
  },
  unselected: {
    backgroundColor: Colors.transparent,
  },
  graycontainer: {
    backgroundColor: Colors.lightGray,
    // marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  flexcontainer: {
    flexDirection: 'row',
    //flex: 1,
    flexWrap: 'wrap',
  },
  flexitem: {
    flexBasis: '33%',
    paddingVertical: 5,
  },
  flexitem2: {
    flexBasis: '50%',
    padding: 5,
    paddingVertical: 5,
  },
});
