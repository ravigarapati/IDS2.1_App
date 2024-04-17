import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {CustomHeader} from '../components';
import {
  AuthLoading,
  Login,
  TermsAndConditions,
  CreateProfile,
  HomeOwnerRemoteAccess,
} from '../pages';
import {Colors, Typography} from '../styles';
import {Dictionary} from '../utils/dictionary';

const navOptions = {
  header: (props) => <CustomHeader {...props} />,
  headerBackTitleVisible: false,
  headerStyle: {
    backgroundColor: Colors.white,
  },
  headerTitleStyle: {
    ...Typography.boschReg21,
  },
};
export const authStack = createStackNavigator(
  {
    Terms: {
      screen: TermsAndConditions,
      navigationOptions: {
        title: Dictionary.termsAndConditions.title,
      },
    },
    CreateProfile: {
      screen: CreateProfile,
      navigationOptions: {
        title: Dictionary.createProfile.title,
        headerShown: false,
      },
    },
    HomeOwnerRemoteAccess: {
      screen: HomeOwnerRemoteAccess,
      navigationOptions: {
        title: 'Contractor Monitoring Status',
      },
    },
    Loading: {
      screen: AuthLoading,
      navigationOptions: {
        headerShown: false,
      },
    },
    Login: {
      screen: Login,
    },
  },
  {
    initialRouteName: 'Loading',
    defaultNavigationOptions: navOptions,
  },
);
