import React from 'react';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';
import {BoschIcon} from '../components';
import {
  HomeOwnerDetails,
  HomeOwnerUsage,
  Profile,
  MyAppliance,
  Legal,
  Settings,
  Help,
  MyApplianceAdd,
  MyApplianceEdit,
  HomeOwnerRemoteAccess,
  HomeOwnerNotification,
  TermsAndConditions,
  TabSettings,
} from '../pages';
import {Colors, Typography} from '../styles';
import {CustomDrawer} from './CustomDrawer';
import {
  navOptions,
  MenuButton,
  tabOptions,
  BackButton,
  BackButtonDrawer,
  HomeOwnerNotificationButton,
  GoToHomeOwnerHome,
  navOptions2,
} from './NavConfig';
import {HomeOwnerTabs} from './HomeOwnerTabs';
import {Icons} from '../utils/icons';
import AddUnitHomeowner from './../pages/AddUnitHomeowner';
import {HomeOwnerAddAddress} from '../pages';
import AddBcc from '../pages/AddBcc';
import AddAnotherDevice from './../pages/AddAnotherDevice';

import HomeOwnerLanding from '../pages/HomeOwnerLanding';
//import HomeOwnerLanding from '../pages/SocketTest';
import EditDevice from '../pages/EditDevice';
import EditLocation from '../pages/EditLocation';
import FAQ from '../pages/FAQ';
import BCCDashboard from '../pages/BCCDashoard';
import ModeSelection from '../pages/ModeSelection';
import FanSelection from '../pages/FanSelection';
import ScheduleConfiguration from '../pages/ScheduleConfiguration';
import AddPeriod from '../pages/AddPeriod';

import Accesories from './../pages/Accesories';
import Location from './../pages/Location2';
import ReconnectWiFi from './../pages/ReconnectWiFi';
import SkipSetupBCC50 from './../pages/SkipSetupBCC50';
import DateTime from './../pages/DateTime';
import DeviceInformationDeviceSettings from '../pages/DeviceInformationDeviceSettings';
import TemperatureDeviceSettings from '../pages/TemperatureDeviceSettings';
import LockSettingsTab from '../pages/LockSettingsTab';
import UnitConfiguration from '../pages/UnitConfiguration/UnitConfiguration';
import FossilFuel1 from '../pages/UnitConfiguration/FossilFuel1';
import FossilFuel2 from '../pages/UnitConfiguration/FossilFuel2';
import InstallationAddress from '../pages/InstallationAddress';
import ContractorMonitoringStatus from '../pages/ContractorMonitoringStatus';
import ApplicationInformation from '../pages/ApplianceInformation';
import ApplianceInformation from '../pages/ApplianceInformation';
import UtilityEnergySavings from '../pages/UtilityEnergySavings';
import HeatPump1 from '../pages/UnitConfiguration/HeatPump1';
import HeatPump2 from '../pages/UnitConfiguration/HeatPump2';
import Electric1 from '../pages/UnitConfiguration/Electric1';
import NoHeating1 from '../pages/UnitConfiguration/NoHeating1';
import DualFuel1 from '../pages/UnitConfiguration/DualFuel1';
import DualFuel2 from '../pages/UnitConfiguration/DualFuel2';
import DualFuel3 from '../pages/UnitConfiguration/DualFuel3';
import BCCDashboardSettings from '../pages/BCCDashboardSettings';
import ScreenSettings from '../pages/ScreenSettings';
import RuntimeSettings from '../pages/RuntimeSettings';
import DateAndTime from '../pages/UnitConfiguration/DateAndTime';
import Schedule from '../pages/UnitConfiguration/Schedule';
import ReviewAddUnit from '../pages/UnitConfiguration/ReviewAddUnit';
import Accessory from '../pages/UnitConfiguration/Accesory';
import Electric2 from '../pages/UnitConfiguration/Electric2';
import ScheduleConfigurationOnBoarding from '../pages/UnitConfiguration/ScheduleConfigurationOnBoarding';
import AddPeriodOnBoarding from '../pages/UnitConfiguration/AddPeriodOnBoarding';
import ScreenAdvancedSettings from '../pages/ScreenAdvancedSettings';
import ScreenAdvancedSettings2 from '../pages/ScreenAdvancedSettings2';
import DeadBandScreen from '../pages/DeadBandScreen';
import RelativeHumidityHysteresisScreen from '../pages/RelativeHumidityHysteresisScreen';
import SensivityLevelScreen from '../pages/SensivityLevelScreen';
import StagingScreen from '../pages/StagingScreen';
import NoHeating2 from '../pages/UnitConfiguration/NoHeating2';
import PairScreen from '../pages/PairScreen';
import PairedDevice from '../pages/PairedDevice';
import AppliancePairing from '../pages/AppliancePairing';
import HumidityCalibration from '../pages/HumidityCalibration';
import SensorCalibrationScreen from '../pages/SensorCalibrationScreen';
import BCC101OnboardingSchedule from '../pages/BCC101OnboardingSchedule';
import BCCOnboardingAdded from '../pages/BCCOnboardingAdded';
import AddBccUpdate from '../pages/AddBccUpdate';

const HomeTabs = createMaterialTopTabNavigator(
  {
    Usage: {
      screen: HomeOwnerUsage,
      navigationOptions: {
        tabBarLabel: 'Energy Usage',
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
    Details: {
      screen: HomeOwnerDetails,
      navigationOptions: {
        tabBarLabel: 'Details',
        tabBarIcon: ({tintColor}) => (
          <BoschIcon
            name={Icons.documentSearch}
            color={tintColor}
            size={20}
            style={{height: 20}}
          />
        ),
      },
    },
    TabSettings: {
      screen: TabSettings,
      navigationOptions: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({tintColor}) => (
          <BoschIcon name={Icons.settings} color={tintColor} size={20} />
        ),
      },
    },
  },
  {
    tabBarComponent: props => <HomeOwnerTabs {...props} />,
    tabBarOptions: tabOptions,
  },
);

const HomeStack = createStackNavigator(
  {
    Home: {
      screen: HomeTabs,
      navigationOptions: ({navigation}) => ({
        title: 'Heat Pump',
        headerTitleAlign: 'left',
        headerLeft: () => <BackButtonDrawer navigation={navigation} />,
        headerRight: () => (
          <HomeOwnerNotificationButton navigation={navigation} />
        ),
      }),
    },
    InstallationAddress: {
      screen: InstallationAddress,
      navigationOptions: ({navigation}) => ({
        title: 'Installation Address',
        headerTitleAlign: 'left',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    ContractorMonitoringStatus: {
      screen: ContractorMonitoringStatus,
      navigationOptions: ({navigation}) => ({
        title: 'Contractor Monitoring',
        headerTitleAlign: 'left',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    Terms: {
      screen: TermsAndConditions,
      navigationOptions: {
        title: 'Terms and Conditions',
      },
    },
    ApplianceInformation: {
      screen: ApplianceInformation,
      navigationOptions: ({navigation}) => ({
        title: 'Appliance Information',
        headerTitleAlign: 'left',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    UtilityEnergySavings: {
      screen: UtilityEnergySavings,
      navigationOptions: ({navigation}) => ({
        title: 'Utility Energy Savings',
        headerTitleAlign: 'left',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: navOptions,
  },
);
const ProfileStack = createStackNavigator(
  {
    Profile: {
      screen: Profile,
      navigationOptions: ({navigation}) => ({
        title: 'Profile',
        headerLeft: () => <MenuButton navigation={navigation} />,
        headerTitleAlign: 'left',
        headerRight: () => (
          <HomeOwnerNotificationButton navigation={navigation} />
        ),
      }),
    },
    HomeOwnerNotification: {
      screen: HomeOwnerNotification,
      navigationOptions: ({navigation}) => ({
        title: 'Notification',
        headerTitleAlign: 'left',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
  },
  {
    defaultNavigationOptions: navOptions,
  },
);

const HomeDrawerStack = createStackNavigator(
  {
    HomeTabs: {
      screen: HomeOwnerLanding,
      navigationOptions: ({navigation}) => ({
        title: 'Home',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <MenuButton navigation={navigation} />,
        headerRight: () => (
          <HomeOwnerNotificationButton navigation={navigation} landing={true} />
        ),
      }),
    },
    BCC101OnboardingSchedule: {
      screen: BCC101OnboardingSchedule,
      navigationOptions: ({navigation}) => ({
        title: 'Schedule Configuration',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    BCCOnboardingAdded: {
      screen: BCCOnboardingAdded,
      navigationOptions: ({navigation}) => ({
        title: 'Device Added',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    BCCDashboard: {
      screen: BCCDashboard,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
    ScreenSettings: {
      screen: ScreenSettings,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
    RuntimeSettings: {
      screen: RuntimeSettings,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
    DeviceInformation: {
      screen: DeviceInformationDeviceSettings,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
    ScreenAdvancedSettings: {
      screen: ScreenAdvancedSettings,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
    ScreenAdvancedSettings2: {
      screen: ScreenAdvancedSettings2,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
    DeadBandScreen: {
      screen: DeadBandScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Deadband',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    RelativeHumidityHysteresisScreen: {
      screen: RelativeHumidityHysteresisScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Relative Humidity Hysteresis',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    SensivityLevelScreen: {
      screen: SensivityLevelScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Sensivity Level',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    StagingScreen: {
      screen: StagingScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Staging',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    Temperature: {
      screen: TemperatureDeviceSettings,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
    HumidityCalibration: {
      screen: HumidityCalibration,
      navigationOptions: ({navigation}) => ({
        title: 'Humidity Calibration',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    SensorCalibration: {
      screen: SensorCalibrationScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Sensor Calibration',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    UnitConfiguration: {
      screen: UnitConfiguration,
      navigationOptions: ({navigation}) => ({
        title: 'Unit Configuration',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    FossilFuel1: {
      screen: FossilFuel1,
      navigationOptions: ({navigation}) => ({
        title: 'Fossil Fuel',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    FossilFuel2: {
      screen: FossilFuel2,
      navigationOptions: ({navigation}) => ({
        title: 'Fossil Fuel',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    FossilFuel3: {
      screen: Accessory,
      navigationOptions: ({navigation}) => ({
        title: 'Fossil Fuel',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    DualFuel1: {
      screen: DualFuel1,
      navigationOptions: ({navigation}) => ({
        title: 'Dual Fuel',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    DualFuel2: {
      screen: DualFuel2,
      navigationOptions: ({navigation}) => ({
        title: 'Dual Fuel',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    DualFuel3: {
      screen: DualFuel3,
      navigationOptions: ({navigation}) => ({
        title: 'Dual Fuel',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    DualFuel4: {
      screen: Accessory,
      navigationOptions: ({navigation}) => ({
        title: 'Dual Fuel',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    HeatPump1: {
      screen: HeatPump1,
      navigationOptions: ({navigation}) => ({
        title: 'Heat Pump',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    HeatPump2: {
      screen: HeatPump2,
      navigationOptions: ({navigation}) => ({
        title: 'Heat Pump',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    HeatPump3: {
      screen: Accessory,
      navigationOptions: ({navigation}) => ({
        title: 'Heat Pump',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    Electric1: {
      screen: Electric1,
      navigationOptions: ({navigation}) => ({
        title: 'Electric',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    Electric2: {
      screen: Electric2,
      navigationOptions: ({navigation}) => ({
        title: 'Electric',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    NoHeating1: {
      screen: NoHeating1,
      navigationOptions: ({navigation}) => ({
        title: 'No Heating',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    NoHeating2: {
      screen: NoHeating2,
      navigationOptions: ({navigation}) => ({
        title: 'No Heating',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    DateAndTime: {
      screen: DateAndTime,
      navigationOptions: ({navigation}) => ({
        title: 'Date & Time',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    Schedule: {
      screen: Schedule,
      navigationOptions: ({navigation}) => ({
        title: 'Schedule',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    ScheduleConfigurationOnBoarding: {
      screen: ScheduleConfigurationOnBoarding,
      navigationOptions: ({navigation}) => ({
        title: 'Schedule',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    ReviewAddUnit: {
      screen: ReviewAddUnit,
      navigationOptions: ({navigation}) => ({
        title: 'Review',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    ScheduleConfiguration: {
      screen: ScheduleConfiguration,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
    AddPeriod: {
      screen: AddPeriod,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
    AddPeriodOnBoarding: {
      screen: AddPeriodOnBoarding,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
    ModeSelection: {
      screen: ModeSelection,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
    Accesories: {
      screen: Accesories,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
    AppliancePairing: {
      screen: AppliancePairing,
      navigationOptions: ({navigation}) => ({
        title: 'Appliance Pairing',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    Location: {
      screen: Location,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
    ReconnectWiFi: {
      screen: ReconnectWiFi,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
    AddBccUpdate: {
      screen: AddBccUpdate,
      navigationOptions: ({navigation}) => ({
        title: 'Add Device',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    SkipSetupBCC50: {
      screen: SkipSetupBCC50,
      navigationOptions: ({navigation}) => ({
        title: 'Add Device',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    DateTime: {
      screen: DateTime,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
    FanSelection: {
      screen: FanSelection,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
    HomeOwnerNotification: {
      screen: HomeOwnerNotification,
      navigationOptions: ({navigation}) => ({
        title: 'Notification',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    EditDevice: {
      screen: EditDevice,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
    EditLocation: {
      screen: EditLocation,
      navigationOptions: ({navigation}) => ({
        title: 'Edit Your Location',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 21,
          fontFamily: Typography.FONT_FAMILY_MEDIUM,
        },
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    Terms: {
      screen: TermsAndConditions,
      navigationOptions: {
        title: 'Terms and Conditions',
      },
    },
    LockScreen: {
      screen: LockSettingsTab,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
    EditAppliance: {
      screen: MyApplianceEdit,
      navigationOptions: ({navigation}) => ({
        title: 'Edit Appliance Info',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
  },
  {
    defaultNavigationOptions: navOptions2,
  },
);

const MyApplianceStack = createStackNavigator(
  {
    MyAppliance: {
      screen: MyAppliance,
      navigationOptions: ({navigation}) => ({
        title: 'My Appliance',
        headerLeft: () => <MenuButton navigation={navigation} />,
      }),
    },
    AddAppliance: {
      screen: MyApplianceAdd,
      navigationOptions: ({navigation}) => ({
        title: 'Add Your Unit',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    EditAppliance: {
      screen: MyApplianceEdit,
      navigationOptions: ({navigation}) => ({
        title: 'Edit Appliance Info',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    HomeOwnerRemoteAccess: {
      screen: HomeOwnerRemoteAccess,
      navigationOptions: ({navigation}) => ({
        title: 'Contractor Monitoring Status',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
  },
  {
    defaultNavigationOptions: {
      ...navOptions,
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
);
const LegalStack = createStackNavigator(
  {
    Legal: {
      screen: Legal,
      navigationOptions: ({navigation}) => ({
        title: 'Legal',
        headerLeft: () => <MenuButton navigation={navigation} />,
        headerTitleAlign: 'left',
        headerRight: () => (
          <HomeOwnerNotificationButton navigation={navigation} />
        ),
      }),
    },
    HomeOwnerNotification: {
      screen: HomeOwnerNotification,
      navigationOptions: ({navigation}) => ({
        title: 'Notification',
        headerTitleAlign: 'left',
        headerLeft: () => <BackButton navigation={navigation} />,
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
        headerLeft: () => <MenuButton navigation={navigation} />,
        headerRight: () => (
          <HomeOwnerNotificationButton navigation={navigation} />
        ),
        headerTitleAlign: 'left',
      }),
    },
    HomeOwnerNotification: {
      screen: HomeOwnerNotification,
      navigationOptions: ({navigation}) => ({
        title: 'Notification',
        headerTitleAlign: 'left',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
  },
  {
    defaultNavigationOptions: navOptions,
  },
);
const AddUnitDeviceStack = createStackNavigator(
  {
    /*PairScreen: {
      screen: PairScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    PairedDevice: {
      screen: PairedDevice,
      navigationOptions: {
        headerShown: false,
      },
    },*/
    Add: {
      screen: AddUnitHomeowner,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
    addIds: {
      screen: HomeOwnerAddAddress,
      navigationOptions: {
        headerShown: false,
      },
    },
    addBcc: {
      screen: AddBcc,
      navigationOptions: {
        headerShown: false,
      },
    },
    configureScheduleOnboarding: {
      screen: ScheduleConfiguration,
      navigationOptions: {
        headerShown: false,
      },
    },
    AddPeriodOnBoardingBCC101: {
      screen: AddPeriod,
      navigationOptions: {
        headerShown: false,
      },
    },
    addAnotherDevice: {
      screen: AddAnotherDevice,
      navigationOptions: ({navigation}) => ({
        title: 'Add Appliance',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
    HomeOwnerRemoteAccessHeatpump: {
      screen: HomeOwnerRemoteAccess,
      navigationOptions: ({navigation}) => ({
        title: 'Contractor Monitoring Status',
        headerLeft: () => <BackButton navigation={navigation} />,
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
        headerTitleAlign: 'left',
        title: 'Help',
        headerLeft: () => <MenuButton navigation={navigation} />,
        headerRight: () => (
          <HomeOwnerNotificationButton navigation={navigation} />
        ),
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
    HomeOwnerNotification: {
      screen: HomeOwnerNotification,
      navigationOptions: ({navigation}) => ({
        title: 'Notification',
        headerTitleAlign: 'left',
        headerLeft: () => <BackButton navigation={navigation} />,
      }),
    },
  },
  {
    defaultNavigationOptions: navOptions,
  },
);

export const homeOwnerDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: HomeDrawerStack,
      navigationOptions: {
        title: 'Home ',
        drawerIcon: ({tintColor}) => (
          <BoschIcon
            name={Icons.home}
            color={tintColor}
            size={25}
            style={{height: 25}}
          />
        ),
      },
    },
    AddUnit: {
      screen: AddUnitDeviceStack,
      navigationOptions: {
        drawerLabel: () => null,
      },
    },

    Profile: {
      screen: ProfileStack,
      navigationOptions: {
        title: 'Profile ',
        drawerIcon: ({tintColor}) => (
          <BoschIcon
            name={Icons.myBrandFrame}
            color={tintColor}
            size={25}
            style={{height: 25}}
          />
        ),
      },
    },
    Legal: {
      screen: LegalStack,
      navigationOptions: {
        title: 'Legal ',
        drawerIcon: ({tintColor}) => (
          <BoschIcon
            name={Icons.scale}
            color={tintColor}
            size={25}
            style={{height: 25}}
          />
        ),
      },
    },
    Settings: {
      screen: SettingsStack,
      navigationOptions: {
        title: 'Settings ',
        drawerIcon: ({tintColor}) => (
          <BoschIcon
            name={Icons.settings}
            color={tintColor}
            size={25}
            style={{height: 25}}
          />
        ),
      },
    },
    Help: {
      screen: HelpStack,
      navigationOptions: {
        title: 'Help ',
        drawerIcon: ({tintColor}) => (
          <BoschIcon
            name={Icons.questionFrame}
            color={tintColor}
            size={25}
            style={{height: 25}}
          />
        ),
      },
    },
    Logout: {
      screen: HomeStack,
      navigationOptions: {
        title: 'Logout ',
        drawerIcon: () => (
          <BoschIcon name={Icons.logout} size={25} style={{height: 25}} />
        ),
      },
    },
  },
  {
    contentComponent: CustomDrawer,
    contentOptions: {
      activeTintColor: Colors.darkBlue,
      labelStyle: {
        fontWeight: 'normal',
        ...Typography.boschReg16,
        marginLeft: 5,
        flexShrink: 1,
      },
      itemStyle: {
        paddingLeft: 10,
      },
    },
  },
);
