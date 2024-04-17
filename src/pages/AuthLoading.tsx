import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Auth} from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {Colors} from '../styles';
import {useDispatch} from 'react-redux';
import * as authActions from '../store/actions/AuthActions';
import {Dictionary} from '../utils/dictionary';
import {showToast} from '../components/CustomToast';
import {Enum} from '../utils/enum';

const AuthLoading = props => {
  const dispatch = useDispatch();
  const [isInternetReachable] = useState(false);
  useEffect(() => {
    InternetChecker();
    AsyncStorage.getItem('termsAccepted').then(value => {
      if (value === 'true') {
        Auth.currentAuthenticatedUser()
          .then(userData => {
            dispatch(authActions.setCurrentUser(userData));
            if (userData.attributes['custom:role']) {
              if (
                userData.attributes['custom:role'] === Enum.roles.contractor
              ) {
                props.navigation.navigate('Contractor');
              } else if (
                userData.attributes['custom:role'] === Enum.roles.homeowner
              ) {
                props.navigation.navigate('HomeOwner');
              } else if (
                userData.attributes['custom:role'] ===
                Enum.roles.contractorPowerUser
              ) {
                props.navigation.navigate('ContractorPowerUser');
              }
            } else {
              props.navigation.replace('CreateProfile');
            }
          })
          .catch(err => {
            props.navigation.replace('Login');
          });
      } else {
        props.navigation.replace('Terms');
      }
    });
  }, []);

  const InternetChecker = () => {
    // Subscribe
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected === false) {
        //  Alert.alert(Dictionary.common.noInternetConnectivity);
        showToast(Dictionary.common.noInternetConnectivity);
      }
      //      setIsInternetReachable(state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  };
  return (
    <View style={styles.container}>
      <ActivityIndicator color={Colors.darkBlue} size="large" />
    </View>
  );
};

export default AuthLoading;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
