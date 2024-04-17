/**
 * @file Profile is a page in the hamburger menu for HomeOwner.
 * Profile information of currently logged in user are displayed here.
 * @author Krishna Priya Elango
 *
 */
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Linking,
  Image,
  Text,
  Platform,
} from 'react-native';
import {
  Button,
  CustomText,
  InfoTooltip,
  SectionHeading,
  Link,
  BoschIcon,
  ConfirmationDialog,
} from '../components';
import {useSelector, useDispatch} from 'react-redux';
import {Colors} from '../styles';
import ProfileInvitation from './ProfileInvitation';
import * as ContractorActions from '../store/actions/ContractorActions';
import * as AuthActions from '../store/actions/AuthActions';
import {removeDeviceToken} from '../store/actions/NotificationActions';
import {Enum} from '../utils/enum';
import {Dictionary} from '../utils/dictionary';
import {Icons} from '../utils/icons';
import UserAnalytics from '../components/UserAnalytics';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import Amplify, {Auth, Hub} from 'aws-amplify';
import awsconfig from '../../aws-exports';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile(props) {
  const userDetails = useSelector(state => state.auth.user);
  const role = userDetails.attributes['custom:role'];
  const roleName =
    role === Enum.roles.contractorPowerUser
      ? 'admin'
      : role === Enum.roles.contractor
      ? 'contractor'
      : 'homeowner';
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [inviteDetails, setInviteDetails] = useState(false);
  const [refreshCallback, setRefreshCallback] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [phoneNo, setPhoneNo] = useState(
    userDetails &&
      userDetails.attributes &&
      userDetails.attributes.phone_number,
  );
  const companyDetails = useSelector(
    state => state.contractor.contractorDetails.company,
  );
  const [companyData, setCompanyData] = useState({
    companyName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    companyPhoneNumber: '',
    adminName: '',
  });
  const dispatch = useDispatch();

  const idpIdToken = useSelector(
    state => state.auth.user.attributes['custom:id_token'],
  );

  UserAnalytics('ids_profile');


  // Logout Android --->
  async function callurl(url, redirectUrl) {
    await InAppBrowser.isAvailable();
    const {type, url: newUrl} = await InAppBrowser.openAuth(
      `https://stage.singlekey-id.com/auth/connect/endsession?post_logout_redirect_uri=idsmobileapp://&id_token_hint=${idpIdToken}&state=STATE`,
      //encodeURIComponent(redirectUrl),
      redirectUrl,
      {
        showTitle: false,
        enableUrlBarHiding: true,
        enableDefaultShare: false,
        ephemeralWebSession: true,
      },
    );
    if (type === 'success') {
      Linking.openURL(newUrl);
    } else {
      Hub.dispatch('browserClosed', {
        event: 'cancel',
        data: 'User clicked close button',
      });
    }
  }
  Platform.OS !== 'ios' &&
    Amplify.configure({
      ...awsconfig,
      oauth: {
        ...awsconfig.oauth,
        callurl,
      },
    });
  // Logout Android Ends --->

  useEffect(() => {
    if (companyDetails) {
      let fullAddress = companyDetails.address;
      let addressList = fullAddress.split(',');
      let address = '';
      let address1;
      let address2;

      if (addressList.length === 5) {
        address1 = addressList[addressList.length - 5];
        address2 = addressList[addressList.length - 4];
      } else if (addressList.length > 5) {
        for (let i = 0; i < addressList.length - 4; i++) {
          address = address + addressList[i] + ', ';
        }
        address1 = address;
        address2 = addressList[addressList.length - 4];
      } else {
        address1 = addressList[addressList.length - 4];
      }
      let city = addressList[addressList.length - 3];
      let state = addressList[addressList.length - 2];
      let zipCode = addressList[addressList.length - 1];
      let companyName = companyDetails.name;
      let companyPhoneNumber = companyDetails.phoneNumber;
      let companyAdminName = companyDetails.adminName;
      setCompanyData({
        companyName: companyName ? companyName.trim() : '',
        address1: address1 ? address1.trim() : '',
        address2: address2 ? address2.trim() : '',
        city: city ? city.trim() : '',
        state: state ? state.trim() : '',
        zipCode: zipCode ? zipCode.trim() : '',
        companyPhoneNumber: companyPhoneNumber ? companyPhoneNumber.trim() : '',
        adminName: companyAdminName ? companyAdminName.trim() : '',
      });
    }
    setRefreshCallback(false);
  }, [companyDetails]);

  function getCompanyInvite() {
    dispatch(
      ContractorActions.getCompanyInvite(data => {
        if (data.length > 0) {
          setInviteDetails(data[0]);
          setShowInvitePopup(true);
        } else {
          setInviteDetails(false);
          setShowInvitePopup(false);
        }
      }),
    );
  }
  const didFocusEvent = () => {
    props.navigation.addListener('didFocus', () => {
      getCompanyInvite();
    });
  };

  useEffect(() => {
    if (role === Enum.roles.contractor) {
      getCompanyInvite();
      didFocusEvent();
      dispatch(ContractorActions.getUnitsList());
    }
    validatePhoneNumber(
      userDetails &&
        userDetails.attributes &&
        userDetails.attributes.phone_number.substr(-10),
    );
  }, [refreshCallback]);

  function validatePhoneNumber(val) {
    let temp = val.substring(0, 3) + '-' + val.substring(3, val.length);
    let temp2 = temp.substring(0, 7) + '-' + temp.substring(7, temp.length);
    setPhoneNo(temp2);
  }

  const PersonalInfo = ({label, value}) => {
    return (
      <>
        {label === 'Role' ? (
          <View style={[styles.personalInfoTextRole]}>
            <View>
              <CustomText text={'Role'} font="medium" align="left" size={12} />
              <CustomText
                text={value}
                align="left"
                style={[styles.paddingVertical3]}
              />
            </View>
            <InfoTooltip
              positionHorizontal="right"
              positionVertical="top"
              text={
                role === Enum.roles.homeowner
                  ? Dictionary.profile.toolTipHomeOwner
                  : role === Enum.roles.contractor
                  ? Dictionary.profile.toolTipContractor
                  : Dictionary.profile.toolTipAdmin
              }
            />
          </View>
        ) : (
          <View style={[styles.paddingVertical10, styles.borderBottomWidth]}>
            <CustomText text={label} font="medium" align="left" size={12} />
            <CustomText
              text={value}
              align="left"
              style={[styles.paddingVertical3]}
            />
          </View>
        )}
      </>
    );
  };

  const CompanyInfo = ({label, value}) => {
    return (
      <View style={styles.companyInfo}>
        <CustomText
          style={styles.flex1}
          font="bold"
          text={label}
          align="left"
          size={12}
        />
        <CustomText style={styles.flex1} text={value} align="left" size={12} />
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!showInvitePopup ? (
        <View>
          <SectionHeading title={Dictionary.profile.personalInfo} />
          <View style={styles.paddingHorizontal20}>
            <PersonalInfo value={userDetails.attributes.name} label="Name" />

            <PersonalInfo value={Enum.rolesLabels[role]} label="Role" />
            <PersonalInfo value={phoneNo} label="Phone Number" />
          </View>

          <View style={styles.sectionHead}>
            <CustomText
              align="left"
              font="bold"
              style={styles.flex07}
              text={Dictionary.profile.accountInfo}
            />
            <BoschIcon
              size={30}
              name={Icons.edit}
              color={Colors.darkBlue}
              style={[styles.flex02, {height: 30}]}
              onPress={() =>
                Linking.openURL('https://stage.singlekey-id.com/myprofile/')
              }
            />
            <BoschIcon
              size={22}
              name={Icons.delete}
              color={Colors.darkBlue}
              style={[styles.flex01, {height: 22}]}
              onPress={() => setShowDeleteConfirmation(true)}
            />
          </View>
          <View style={styles.paddingHorizontal20}>
            <PersonalInfo value={userDetails.attributes.email} label="Email" />
            <View style={[styles.paddingVertical10, styles.borderBottomWidth]}>
              <CustomText
                text={'Password'}
                font="medium"
                align="left"
                size={12}
              />
              <Text>{'********'}</Text>
            </View>
            <View
              style={[styles.flexRow, styles.justifyContent, styles.editIcon]}>
              <Image
                style={styles.image}
                source={require('../assets/images/SKID_Logo.png')}
              />
            </View>
            {/* <View style={[styles.flexRow, styles.flex1]}>
              <View style={styles.buttonLeft}>
                {role === Enum.roles.homeowner && (
                  <Button
                    type="tertiary"
                    icon={Icons.delete}
                    text={Dictionary.profile.delete}
                    onPress={() => props.navigation.navigate('Help')}
                  />
                )}
              </View>
            </View> */}
          </View>

          {(role === Enum.roles.contractor ||
            role === Enum.roles.contractorPowerUser) && (
            <View>
              <SectionHeading title={Dictionary.profile.companyInfo} />
              <View style={styles.paddingVertical20}>
                <CompanyInfo label="Company:" value={companyData.companyName} />
                <CompanyInfo label="Address:" value={companyDetails.address} />
                <CompanyInfo
                  label="Phone Number:"
                  value={companyData.companyPhoneNumber}
                />
                {companyDetails &&
                  companyDetails.adminName &&
                  companyDetails.adminName !== null &&
                  companyDetails.adminName !== undefined && (
                    <CompanyInfo
                      label="Company Admin:"
                      value={companyData.adminName}
                    />
                  )}
              </View>
            </View>
          )}
        </View>
      ) : (
        <ProfileInvitation
          visible={showInvitePopup}
          setVisible={setShowInvitePopup}
          inviteDetails={inviteDetails}
          refresh={data => setRefreshCallback(data)}
        />
      )}
      {showDeleteConfirmation && (
        <ConfirmationDialog
          textAlign={'center'}
          visible={showDeleteConfirmation}
          text={Dictionary.profile.deleteConfirmation}
          primaryButton={Dictionary.profile.delete}
          secondaryButton={Dictionary.button.cancel}
          primaryButtonOnPress={() => {
            setShowDeleteConfirmation(false);
            AsyncStorage.setItem('MountAntenna', '');
            AsyncStorage.setItem('PowerUpODU', '');
            dispatch(
              AuthActions.deleteUser({type: roleName}, () => {
                dispatch(removeDeviceToken(props.navigation));
                if (Platform.OS !== 'ios') {
                  callurl();
                }
              }),
            );
          }}
          secondaryButtonOnPress={() => {
            setShowDeleteConfirmation(false);
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  flex1: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  paddingHorizontal20: {
    paddingHorizontal: 20,
  },
  paddingVertical20: {
    paddingVertical: 20,
  },
  paddingVertical10: {
    paddingVertical: 10,
  },
  paddingVertical3: {
    paddingBottom: 3,
  },
  borderBottomWidth: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  personalInfoTextRole: {
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  companyInfo: {
    paddingHorizontal: 40,
    paddingBottom: 10,
    flexDirection: 'row',
  },
  buttonLeft: {
    alignItems: 'flex-start',
    width: '50%',
    marginTop: 1,
  },
  padding: {
    paddingHorizontal: 10,
    // paddingTop: 20,
    // paddingBottom: 20,
  },
  image: {
    width: 200,
    height: 50,
  },
  justifyContent: {
    justifyContent: 'space-between',
  },
  singleKey: {
    paddingHorizontal: 40,
    paddingBottom: 30,
  },
  editIcon: {
    alignItems: 'center',
    paddingRight: 10,
    paddingVertical: 5,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 30,
    paddingVertical: 10,
    backgroundColor: Colors.lightGray,
  },
  flex07: {
    flex: 0.7,
  },
  flex02: {
    flex: 0.2,
    textAlign: 'right',
  },
  flex01: {
    flex: 0.1,
    textAlign: 'right',
  },
});
