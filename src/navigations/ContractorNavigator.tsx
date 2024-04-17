import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';
import {BoschIcon, CustomText} from '../components';
import {Icons} from '../utils/icons';
import {
  AddODU,
  ContractorHome,
  AdminPortalContractors,
  InstallationRegisterWarranty,
  InstallationChargeUnit,
  InstallationRemoteAccess,
  AddComponentWarranty,
  Profile,
  Legal,
  Settings,
  Help,
  MountAntenna,
  PowerUpODU,
  AddGateway,
  AddUnitSuccess,
  InstallationSystemData,
  LiveCheckpointValues,
  Service,
  Notification,
  ContractorUnitAccess,
  TermsAndConditions,
  Email,
  ProductRegistrationInfo,
  AddProductInfo,
  AddHomeownerInfo,
  SerialNumberLocator,
} from '../pages';
import {Colors, Typography} from '../styles';
import {CustomDrawer} from './CustomDrawer';
import {
  navOptions,
  MenuButton,
  BackButton,
  tabOptions,
  NotificationButton,
  GoToContractorHome,
  PRBackButton,
} from './NavConfig';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import AdminPortalRequests from '../pages/AdminPortalRequests';
import {InstallationDashboard} from './InstallationDashboard';
import FAQ from '../pages/FAQ';
import {StyleSheet} from 'react-native';

function excludeAdminPortalForContractor(paths) {
  var newPaths = {};
  Object.keys(paths).forEach(key => {
    if (!key.includes('AdminPortal')) {
      newPaths[key] = paths[key];
    }
  });
  return newPaths;
}
const InstallationTabs = createMaterialTopTabNavigator(
  {
    LiveData: {
      screen: InstallationSystemData,
      navigationOptions: {
        tabBarLabel: 'System Data',
        tabBarIcon: ({tintColor}) => (
          <BoschIcon
            name={Icons.chartLine}
            color={tintColor}
            size={20}
            style={{height: 20}}
          />
        ),
      },
    },
    ChargeUnit: {
      screen: InstallationChargeUnit,
      navigationOptions: {
        tabBarLabel: 'Charge Unit',
        tabBarIcon: ({tintColor}) => (
          <BoschIcon
            name={Icons.speedometer}
            color={tintColor}
            size={20}
            style={{height: 20}}
          />
        ),
      },
    },
    RemoteAccess: {
      screen: InstallationRemoteAccess,
      navigationOptions: {
        tabBarLabel: 'Remote Request',
        tabBarIcon: ({tintColor}) => (
          <BoschIcon
            name={Icons.wifi}
            color={tintColor}
            size={20}
            style={{height: 20}}
          />
        ),
      },
    },
    RegisterWarranty: {
      screen: InstallationRegisterWarranty,
      navigationOptions: {
        tabBarLabel: 'Register Warranty',
        tabBarIcon: ({tintColor}) => (
          <BoschIcon
            name={Icons.warranty}
            color={tintColor}
            size={20}
            style={{height: 20}}
          />
        ),
      },
    },
  },
  {
    tabBarComponent: props => <InstallationDashboard {...props} />,
    tabBarOptions: tabOptions,
  },
);

const AdminPortalTab = createMaterialTopTabNavigator(
  {
    companyContractor: {
      screen: AdminPortalContractors,
      navigationOptions: {
        tabBarLabel: ({focused}) => (
          <CustomText
            text={'Company Contractors'}
            style={{
              color: focused ? Colors.darkBlue : Colors.black,
              fontSize: 16,
              fontFamily: Typography.FONT_FAMILY_REGULAR,
              paddingVertical: 15,
            }}
          />
        ),
      },

    },
    requests: {
      screen: AdminPortalRequests,
      navigationOptions: {
        tabBarLabel: ({focused}) => (
          <CustomText
            text={'Requests'}
            style={{
              color: focused ? Colors.darkBlue : Colors.black,
              fontSize: 16,
              fontFamily: Typography.FONT_FAMILY_REGULAR,
              paddingVertical: 15,
            }}
          />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      ...tabOptions,
      showIcon: false,
      labelStyle: {
        fontSize: 16,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        paddingVertical: 15,
      },
    },
  },
);

const contractorStack = createStackNavigator(
  {
    ContractorHome: {
      screen: ContractorHome,
      params: {
        tab: 'map',
      },
      navigationOptions: ({navigation}) => ({
        title: 'Home',
        headerTitleAlign: 'left',
        headerLeft: () => <MenuButton navigation={navigation} />,
        headerRight: () => <NotificationButton navigation={navigation} />,
      }),
    },
    MountAntenna: {
      screen: MountAntenna,
      navigationOptions: ({navigation}) => ({
        title: 'Add a New Unit',
        headerTitleAlign: 'left',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    PowerUpODU: {
      screen: PowerUpODU,
      navigationOptions: ({navigation}) => ({
        title: 'Add a New Unit',
        headerTitleAlign: 'left',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    AddODU: {
      screen: AddODU,
      navigationOptions: ({navigation}) => ({
        title: 'Add a New Unit',
        headerTitleAlign: 'left',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    AddGateway: {
      screen: AddGateway,
      navigationOptions: ({navigation}) => ({
        title: 'Add a New Unit',
        headerTitleAlign: 'left',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    ReplaceGateway: {
      screen: AddGateway,
      navigationOptions: ({navigation}) => ({
        title: 'Replace Gateway',
        headerTitleAlign: 'left',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    AddUnitSuccess: {
      screen: AddUnitSuccess,
      navigationOptions: ({navigation}) => ({
        title: 'Add a New Unit',
        headerTitleAlign: 'left',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    ReplaceUnitSuccess: {
      screen: AddUnitSuccess,
      navigationOptions: ({navigation}) => ({
        title: 'Replace Gateway',
        headerTitleAlign: 'left',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    Installation: {
      screen: InstallationTabs,
      navigationOptions: ({navigation}) => ({
        title: 'Unit Dashboard',
        headerTitleAlign: 'left',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    LiveCheckpointValues: {
      screen: LiveCheckpointValues,
      navigationOptions: ({navigation}) => ({
        title: 'Advanced Information',
        headerTitleAlign: 'left',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    Service: {
      screen: Service,
      navigationOptions: ({navigation}) => ({
        title: 'Service',
        headerTitleAlign: 'left',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    AddWarranty: {
      screen: AddComponentWarranty,
      navigationOptions: ({navigation}) => ({
        title: navigation.getParam('title'),
        headerTitleAlign: 'left',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    Notification: {
      screen: Notification,
      navigationOptions: ({navigation}) => ({
        title: 'Notification',
        headerTitleAlign: 'left',
        headerLeft: () => <GoToContractorHome navigation={navigation} />,
      }),
    },
    Terms: {
      screen: TermsAndConditions,
      navigationOptions: {
        headerTitleAlign: 'left',
        title: 'Terms and Conditions',
      },
    },
    Email: {
      screen: Email,
      navigationOptions: {
        headerTitleAlign: 'left',
        title: 'Email',
      },
    },
    AdminPortal: {
      screen: AdminPortalTab,
      navigationOptions: ({navigation}) => ({
        title: 'Admin Portal ',
        headerLeft: () => <MenuButton navigation={navigation} />,
      }),
    },
    ContractorUnitAccess: {
      screen: ContractorUnitAccess,
      navigationOptions: ({navigation}) => ({
        title:
          navigation.getParam('firstName') +
          ' ' +
          navigation.getParam('lastName') +
          "'s Unit Access",
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
  },
  {
    initialRouteName: 'ContractorHome',
    defaultNavigationOptions: {
      ...navOptions,
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
);
contractorStack.navigationOptions = ({navigation}) => {
  let drawerLockMode = 'unlocked';
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed';
  }
  return {
    drawerLockMode,
  };
};
const ContractorHomeDrawerStack = createStackNavigator(
  {
    ContractorHome: {
      screen: ContractorHome,
      params: {
        tab: 'map',
      },
      navigationOptions: ({navigation}) => ({
        title: 'Home',
        headerTitleAlign: 'left',
        headerLeft: () => <MenuButton navigation={navigation} />,
        headerRight: () => <NotificationButton navigation={navigation} />,
      }),
    },
    Terms: {
      screen: TermsAndConditions,
      navigationOptions: {
        headerTitleAlign: 'left',
        title: 'Terms and Conditions',
      },
    },
  },
  {
    defaultNavigationOptions: navOptions,
  },
);
const AdminPortalStack = createStackNavigator(
  {
    AdminPortal: {
      screen: AdminPortalTab,
      navigationOptions: ({navigation}) => ({
        title: 'Admin Portal ',
        headerTitleAlign: 'left',
        headerLeft: () => <MenuButton navigation={navigation} />,
      }),
    },
    ContractorUnitAccess: {
      screen: ContractorUnitAccess,
      navigationOptions: ({navigation}) => ({
        title:
          navigation.getParam('firstName') +
          ' ' +
          navigation.getParam('lastName') +
          "'s Unit Access",
        headerTitleAlign: 'left',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
  },
  {
    initialRouteName: 'AdminPortal',
    defaultNavigationOptions: {
      ...navOptions,
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
);
AdminPortalStack.navigationOptions = ({navigation}) => {
  let drawerLockMode = 'unlocked';
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed';
  }
  return {
    drawerLockMode,
  };
};
const ProfileStack = createStackNavigator(
  {
    Profile: {
      screen: Profile,
      navigationOptions: ({navigation}) => ({
        title: 'Profile',
        headerTitleAlign: 'left',
        headerLeft: () => <MenuButton navigation={navigation} />,
      }),
    },
  },
  {
    defaultNavigationOptions: navOptions,
  },
);
const LegalStack = createStackNavigator(
  {
    Legal: {
      screen: Legal,
      navigationOptions: ({navigation}) => ({
        title: 'Legal',
        headerTitleAlign: 'left',
        headerLeft: () => <MenuButton navigation={navigation} />,
      }),
    },
  },
  {
    defaultNavigationOptions: navOptions,
  },
);

const SettingsStack = createStackNavigator(
  {
    Settings: {
      screen: Settings,
      navigationOptions: ({navigation}) => ({
        title: 'Settings',
        headerTitleAlign: 'left',
        headerLeft: () => <MenuButton navigation={navigation} />,
      }),
    },
  },
  {
    defaultNavigationOptions: navOptions,
  },
);
const HelpStack = createStackNavigator(
  {
    Help: {
      screen: Help,
      navigationOptions: ({navigation}) => ({
        title: 'Help',
        headerTitleAlign: 'left',
        headerLeft: () => <MenuButton navigation={navigation} />,
      }),
    },
    Faq: {
      screen: FAQ,
      navigationOptions: ({navigation}) => ({
        headerTitleAlign: 'left',
        title: 'FAQ',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
  },
  {
    defaultNavigationOptions: navOptions,
  },
);

const ProductRegistrationStack = createStackNavigator(
  {
    ProductInfo: {
      screen: ProductRegistrationInfo,
      navigationOptions: ({navigation}) => ({
        title: 'Product Registration',
        headerTitleAlign: 'left',
        headerShown: false,
      }),
    },
    AddProductInfo: {
      screen: AddProductInfo,
      navigationOptions: ({navigation}) => ({
        title: 'Add a New Unit',
        headerTitleAlign: 'left',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    AddHomeOwnerInfo: {
      screen: AddHomeownerInfo,
      navigationOptions: ({navigation}) => ({
        title: 'Add Homeowner Information',
        headerTitleAlign: 'left',
        //headerLeft: () => <PRBackButton navigation={navigation} />,
      }),
    },
    SerialNumberLocator: {
      screen: SerialNumberLocator,
      navigationOptions: ({navigation}) => ({
        title: 'Serial Number Locator',
        headerTitleAlign: 'left',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
  },
  {
    defaultNavigationOptions: navOptions,
  },
);

const drawerOptions = {
  contentComponent: CustomDrawer,
  contentOptions: {
    activeTintColor: Colors.darkBlue,
    labelStyle: {
      fontWeight: 'normal',
      ...Typography.boschReg16,
      flexShrink: 1,
      marginLeft: 5,
    },
    itemStyle: {
      paddingLeft: 10,
    },
  },
  initialRouteName: 'Home',
};

const styles = StyleSheet.create({
  drawerLabel: {
    fontWeight: 'normal',
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: 16,
    flexShrink: 1,
    marginLeft: 5,
    paddingVertical: 15,
  },
});

const contractorDrawerPaths = {
  Home: {
    screen: ContractorHomeDrawerStack,
    navigationOptions: {
      //title: 'Home',
      drawerLabel: (
        <CustomText
          style={{...styles.drawerLabel}}
          text={'Home'}
          align="left"
        />
      ),
      drawerIcon: () => (
        <BoschIcon name={Icons.home} size={25} style={{height: 25}} />
      ),
    },
  },
  Profile: {
    screen: ProfileStack,
    navigationOptions: {
      //title: 'Profile ',
      drawerLabel: (
        <CustomText
          style={{...styles.drawerLabel}}
          text={'Profile'}
          align="left"
        />
      ),
      drawerIcon: () => (
        <BoschIcon name={Icons.myBrandFrame} size={25} style={{height: 25}} />
      ),
    },
  },
  AdminPortal: {
    screen: AdminPortalStack,
    navigationOptions: {
      //title: 'Admin Portal ',
      drawerLabel: (
        <CustomText
          style={{...styles.drawerLabel}}
          text={'Admin Portal'}
          align="left"
        />
      ),
      drawerIcon: () => (
        <BoschIcon name={Icons.keysUserAccess} size={25} style={{height: 25}} />
      ),
    },
  },
  ProductRegistration: {
    screen: ProductRegistrationStack,
    navigationOptions: {
      //title: 'Product Registration ',
      drawerLabel: (
        <CustomText
          style={{...styles.drawerLabel}}
          text={'Product Registration'}
          align="left"
        />
      ),
      drawerIcon: () => (
        <BoschIcon name={Icons.productRegistration} size={25} />
      ),
    },
  },
  Legal: {
    screen: LegalStack,
    navigationOptions: {
      //title: 'Legal ',
      drawerLabel: (
        <CustomText
          style={{...styles.drawerLabel}}
          text={'Legal'}
          align="left"
        />
      ),
      drawerIcon: () => (
        <BoschIcon name={Icons.scale} size={25} style={{height: 25}} />
      ),
    },
  },
  Settings: {
    screen: SettingsStack,
    navigationOptions: {
      //title: 'Settings ',
      drawerLabel: (
        <CustomText
          style={{...styles.drawerLabel}}
          text={'Settings'}
          align="left"
        />
      ),
      drawerIcon: () => (
        <BoschIcon name={Icons.settings} size={25} style={{height: 25}} />
      ),
    },
  },
  Help: {
    screen: HelpStack,
    navigationOptions: {
      //title: 'Help ',
      drawerLabel: (
        <CustomText
          style={{...styles.drawerLabel}}
          text={'Help'}
          align="left"
        />
      ),
      drawerIcon: () => (
        <BoschIcon name={Icons.questionFrame} size={25} style={{height: 25}} />
      ),
    },
  },
  Logout: {
    screen: ContractorHomeDrawerStack,
    navigationOptions: {
      //title: 'Logout ',
      drawerLabel: (
        <CustomText
          style={{...styles.drawerLabel}}
          text={'Logout'}
          align="left"
        />
      ),
      drawerIcon: () => (
        <BoschIcon name={Icons.logout} size={25} style={{height: 25}} />
      ),
    },
  },
  stackMenus: {
    screen: contractorStack,
    navigationOptions: {
      drawerLabel: () => null,
      title: null,
      drawerIcon: () => null,
    },
  },
};

const contractorDemoModeDrawerPaths = {
  Home: {
    screen: ContractorHomeDrawerStack,
    navigationOptions: {
      title: 'Home',
      drawerIcon: () => (
        <BoschIcon name={Icons.home} size={25} style={{height: 25}} />
      ),
    },
  },
  ProductRegistration: {
    screen: ProductRegistrationStack,
    navigationOptions: {
      title: 'Product Registration ',
      drawerIcon: () => (
        <BoschIcon name={Icons.productRegistration} size={25} />
      ),
    },
  },
  Legal: {
    screen: LegalStack,
    navigationOptions: {
      title: 'Legal ',
      drawerIcon: () => (
        <BoschIcon name={Icons.scale} size={25} style={{height: 25}} />
      ),
    },
  },
  Settings: {
    screen: SettingsStack,
    navigationOptions: {
      title: 'Settings ',
      drawerIcon: () => (
        <BoschIcon name={Icons.settings} size={25} style={{height: 25}} />
      ),
    },
  },
  Help: {
    screen: HelpStack,
    navigationOptions: {
      title: 'Help ',
      drawerIcon: () => (
        <BoschIcon name={Icons.questionFrame} size={25} style={{height: 25}} />
      ),
    },
  },
  stackMenus: {
    screen: contractorStack,
    navigationOptions: {
      drawerLabel: () => null,
      title: null,
      drawerIcon: () => null,
    },
  },
};

export const contractorDrawerNavigator = createDrawerNavigator(
  excludeAdminPortalForContractor(contractorDrawerPaths),
  drawerOptions,
);
export const powerUserDrawerNavigator = createDrawerNavigator(
  contractorDrawerPaths,
  drawerOptions,
);
export const contractorDemoModeDrawerNavigator = createDrawerNavigator(
  contractorDemoModeDrawerPaths,
  drawerOptions,
);
