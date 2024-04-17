import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  SectionList,
  View,
  ScrollView,
  AppState,
} from 'react-native';
import {CustomText, SectionHeading, ToggleButton} from '../components';
import {Colors} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {Auth} from 'aws-amplify';
import {Enum} from '../utils/enum';
import {useDispatch, useSelector} from 'react-redux';
import * as NotificationActions from '../store/actions/NotificationActions';
import * as ContractorActions from '../store/actions/ContractorActions';
import * as HomeOwnerActions from '../store/actions/HomeOwnerActions';
import analytics from '@react-native-firebase/analytics';
import {checkNotifications} from 'react-native-permissions';

export default function Settings(props) {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [userType, setUserType] = useState('');
  const [gatewayFault, setGatewayFault] = useState(false);
  const [heatPumpFault, setHeatPumpFault] = useState(false);
  const [remoteAccess, setRemoteAccess] = useState(false);
  const [companyAccess, setCompanyAccess] = useState(false);
  const [firstNotify, setFirstNotify] = useState('1');
  const [userAnalytics, setUserAnalytics] = useState(true);
  const [systemError, setSystemError] = useState(false);
  const [energyUsage, setEnergyUsage] = useState(false);
  const [maintenanceReminders, setMaintenanceReminders] = useState(true);
  const [homeownerUserAnalytics, setHomeownerUserAnalytics] = useState(true);
  const [checkNotifPermission, setCheckNotifPermission] = useState(null);
  const [demoMode, setDemoMode] = useState(false);
  const isWeatherFahrenheit = useSelector(
    state => state.homeOwner.actualWeatherOnFahrenheit,
  );
  const [temperatureScale, setTemperatureScale] = useState(isWeatherFahrenheit);
  const hapticVibration = useSelector(state => state.homeOwner.hapticVibration);
  const [vibration, setVibration] = useState(hapticVibration);
  let version = Dictionary.common.appVersion;
  const appState = useRef(AppState.currentState);
  const demoModeStore = useSelector(state => state.notification.demoStatus);
  /*
  hapticVibration
  timestamp
  user/sethapticvibration
*/
  function clickHandler(field, value) {
    if (userType !== 'homeowner') {
      if (field === Dictionary.settings.gatewayFault) {
        if (value === 0) {
          setGatewayFault(false);
          let settingConfig = {
            gatewayFault: false,
            heatPumpFault: heatPumpFault,
            remoteAccess: remoteAccess,
            companyAccess: companyAccess,
            firstNotify: firstNotify,
            userAnalytics: userAnalytics,
            demoMode: demoMode,
          };
          onSettingConfiguration(settingConfig);
        } else if (value === 1) {
          setGatewayFault(true);
          let settingConfig = {
            gatewayFault: true,
            heatPumpFault: heatPumpFault,
            remoteAccess: remoteAccess,
            companyAccess: companyAccess,
            firstNotify: firstNotify,
            userAnalytics: userAnalytics,
            demoMode: demoMode,
          };
          onSettingConfiguration(settingConfig);
        }
      } else if (field === Dictionary.settings.heatPumpFault) {
        if (value === 0) {
          setHeatPumpFault(false);
          let settingConfig = {
            gatewayFault: gatewayFault,
            heatPumpFault: false,
            remoteAccess: remoteAccess,
            companyAccess: companyAccess,
            firstNotify: firstNotify,
            userAnalytics: userAnalytics,
            demoMode: demoMode,
          };
          onSettingConfiguration(settingConfig);
        } else if (value === 1) {
          setHeatPumpFault(true);
          let settingConfig = {
            gatewayFault: gatewayFault,
            heatPumpFault: true,
            remoteAccess: remoteAccess,
            companyAccess: companyAccess,
            firstNotify: firstNotify,
            userAnalytics: userAnalytics,
            demoMode: demoMode,
          };
          onSettingConfiguration(settingConfig);
        }
      } else if (field === Dictionary.settings.remoteAccess) {
        if (value === 0) {
          setRemoteAccess(false);
          let settingConfig = {
            gatewayFault: gatewayFault,
            heatPumpFault: heatPumpFault,
            remoteAccess: false,
            companyAccess: companyAccess,
            firstNotify: firstNotify,
            userAnalytics: userAnalytics,
            demoMode: demoMode,
          };
          onSettingConfiguration(settingConfig);
        } else if (value === 1) {
          setRemoteAccess(true);
          let settingConfig = {
            gatewayFault: gatewayFault,
            heatPumpFault: heatPumpFault,
            remoteAccess: true,
            companyAccess: companyAccess,
            firstNotify: firstNotify,
            userAnalytics: userAnalytics,
            demoMode: demoMode,
          };
          onSettingConfiguration(settingConfig);
        }
      } else if (field === Dictionary.settings.companyAccess) {
        if (value === 0) {
          setCompanyAccess(false);
          let settingConfig = {
            gatewayFault: gatewayFault,
            heatPumpFault: heatPumpFault,
            remoteAccess: remoteAccess,
            companyAccess: false,
            firstNotify: firstNotify,
            userAnalytics: userAnalytics,
            demoMode: demoMode,
          };
          onSettingConfiguration(settingConfig);
        } else if (value === 1) {
          setCompanyAccess(true);
          let settingConfig = {
            gatewayFault: gatewayFault,
            heatPumpFault: heatPumpFault,
            remoteAccess: remoteAccess,
            companyAccess: true,
            firstNotify: firstNotify,
            userAnalytics: userAnalytics,
            demoMode: demoMode,
          };
          onSettingConfiguration(settingConfig);
        }
      } else if (field === Dictionary.settings.firstNotify) {
        if (value === 0) {
          setFirstNotify('1');
          let settingConfig = {
            gatewayFault: gatewayFault,
            heatPumpFault: heatPumpFault,
            remoteAccess: remoteAccess,
            companyAccess: companyAccess,
            firstNotify: '1',
            userAnalytics: userAnalytics,
            demoMode: demoMode,
          };
          onSettingConfiguration(settingConfig);
        } else if (value === 1) {
          setFirstNotify('24');
          let settingConfig = {
            gatewayFault: gatewayFault,
            heatPumpFault: heatPumpFault,
            remoteAccess: remoteAccess,
            companyAccess: companyAccess,
            firstNotify: '24',
            userAnalytics: userAnalytics,
            demoMode: demoMode,
          };
          onSettingConfiguration(settingConfig);
        }
      } else if (field === Dictionary.settings.analytics) {
        if (value === 0) {
          setUserAnalytics(false);
          let settingConfig = {
            gatewayFault: gatewayFault,
            heatPumpFault: heatPumpFault,
            remoteAccess: remoteAccess,
            companyAccess: companyAccess,
            firstNotify: firstNotify,
            userAnalytics: false,
            demoMode: demoMode,
          };
          onSettingConfiguration(settingConfig);
          analytics().setAnalyticsCollectionEnabled(false);
          if (!demoMode) {
            dispatch(ContractorActions.checkAnalyticsValue(false));
          }
        } else if (value === 1) {
          setUserAnalytics(true);
          let settingConfig = {
            gatewayFault: gatewayFault,
            heatPumpFault: heatPumpFault,
            remoteAccess: remoteAccess,
            companyAccess: companyAccess,
            firstNotify: firstNotify,
            userAnalytics: true,
            demoMode: demoMode,
          };
          onSettingConfiguration(settingConfig);
          analytics().setAnalyticsCollectionEnabled(true);
          if (!demoMode) {
            dispatch(ContractorActions.checkAnalyticsValue(true));
          }
        }
      } else if (field === Dictionary.settings.demoMode) {
        if (value === 0) {
          setDemoMode(false);
          setDemoModeGlobal(false);
          let settingConfig = {
            gatewayFault: gatewayFault,
            heatPumpFault: heatPumpFault,
            remoteAccess: remoteAccess,
            companyAccess: companyAccess,
            firstNotify: firstNotify,
            userAnalytics: userAnalytics,
            demoMode: false,
          };
          onSettingConfiguration(settingConfig);
          Auth.currentAuthenticatedUser().then(userData => {
            if (userData.attributes['custom:role'] === Enum.roles.contractor) {
              props.navigation.navigate('Contractor');
            } else {
              props.navigation.navigate('ContractorPowerUser');
            }
          });
        } else if (value === 1) {
          setDemoMode(true);
          setDemoModeGlobal(true);
          let settingConfig = {
            gatewayFault: gatewayFault,
            heatPumpFault: heatPumpFault,
            remoteAccess: remoteAccess,
            companyAccess: companyAccess,
            firstNotify: firstNotify,
            userAnalytics: userAnalytics,
            demoMode: true,
          };
          onSettingConfiguration(settingConfig);
          props.navigation.navigate('ContractorDemoMode');
        }
      }
    } else {
      if (field === Dictionary.settings.systemError) {
        if (value === 0) {
          setSystemError(false);
          let settingConfig = {
            systemError: false,
            energyUsage: energyUsage,
            serviceReminder: maintenanceReminders,
            userAnalytics: userAnalytics,
          };
          onSettingConfiguration(settingConfig);
        } else if (value === 1) {
          setSystemError(true);
          let settingConfig = {
            systemError: true,
            energyUsage: energyUsage,
            serviceReminder: maintenanceReminders,
            userAnalytics: userAnalytics,
          };
          onSettingConfiguration(settingConfig);
        }
      } else if (field === Dictionary.settings.energyUsage) {
        if (value === 0) {
          setEnergyUsage(false);
          let settingConfig = {
            systemError: systemError,
            energyUsage: false,
            serviceReminder: maintenanceReminders,
            userAnalytics: userAnalytics,
          };
          onSettingConfiguration(settingConfig);
        } else if (value === 1) {
          setEnergyUsage(true);
          let settingConfig = {
            systemError: systemError,
            energyUsage: true,
            serviceReminder: maintenanceReminders,
            userAnalytics: userAnalytics,
          };
          onSettingConfiguration(settingConfig);
        }
      } else if (field === Dictionary.settings.maintanceReminders) {
        if (value === 0) {
          setMaintenanceReminders(false);
          let settingConfig = {
            systemError: systemError,
            energyUsage: energyUsage,
            serviceReminder: false,
            userAnalytics: userAnalytics,
          };
          onSettingConfiguration(settingConfig);
        } else if (value === 1) {
          setMaintenanceReminders(true);
          let settingConfig = {
            systemError: systemError,
            energyUsage: energyUsage,
            serviceReminder: true,
            userAnalytics: userAnalytics,
          };
          onSettingConfiguration(settingConfig);
        }
      } else if (field === Dictionary.settings.analytics) {
        if (value === 0) {
          setHomeownerUserAnalytics(false);
          let settingConfig = {
            systemError: systemError,
            energyUsage: energyUsage,
            serviceReminder: maintenanceReminders,
            userAnalytics: false,
          };
          onSettingConfiguration(settingConfig);
          analytics().setAnalyticsCollectionEnabled(false);
          if (!demoMode) {
            dispatch(HomeOwnerActions.checkHoAnalyticsValue(false));
          }
        } else if (value === 1) {
          setHomeownerUserAnalytics(true);
          let settingConfig = {
            systemError: systemError,
            energyUsage: energyUsage,
            serviceReminder: maintenanceReminders,
            userAnalytics: true,
          };
          onSettingConfiguration(settingConfig);
          analytics().setAnalyticsCollectionEnabled(true);
          if (!demoMode) {
            dispatch(HomeOwnerActions.checkHoAnalyticsValue(true));
          }
        }
      } else if (field === 'Temperature Scale') {
        if (value === 0) {
          setTemperatureScale(false);
          let settingConfig = {
            systemError: systemError,
            energyUsage: energyUsage,
            serviceReminder: maintenanceReminders,
            userAnalytics: userAnalytics,
          };
          onTemperatureScaleConfiguration(true);
          //onSettingConfiguration(settingConfig);
        } else if (value === 1) {
          setTemperatureScale(true);
          let settingConfig = {
            systemError: systemError,
            energyUsage: energyUsage,
            serviceReminder: maintenanceReminders,
            userAnalytics: userAnalytics,
          };
          onTemperatureScaleConfiguration(false);
          //onSettingConfiguration(settingConfig);
        }
      } else if (field === 'Haptic Vibration') {
        if (value === 0) {
          setVibration(false);
          onVibrationConfiguration(false);
          onHapticUpdate({
            hapticVibration: '0',
          });
        } else if (value === 1) {
          setVibration(true);
          onVibrationConfiguration(true);
          onHapticUpdate({
            hapticVibration: '1',
          });
        }
      }
    }
  }
  const onSettingConfiguration = settingConfig => {
    if (!demoMode) {
      dispatch(NotificationActions.setSettingConfiguration(settingConfig));
    }
  };

  const onHapticUpdate = settingConfig => {
    dispatch(
      HomeOwnerActions.updateHapticVibration({
        hapticVibration: settingConfig.hapticVibration,
        timestamp: `${new Date().valueOf()}`,
      }),
    );
  };

  const onTemperatureScaleConfiguration = temperatureScaleConfig => {
    dispatch(
      HomeOwnerActions.updateActualWeather({
        unit: temperatureScaleConfig ? 'F' : 'C',
        timestamp: `${new Date().valueOf()}`,
      }),
    );
  };
  const onVibrationConfiguration = vibrationConfig => {
    dispatch(HomeOwnerActions.updateVibration(vibrationConfig));
  };
  const settingConfig = useSelector(
    state => state.notification.settingConfiguration,
  );

  useEffect(() => {
    setTemperatureScale(!isWeatherFahrenheit);
    AppState.addEventListener('change', nextAppState => {
      if (AppState.currentState === 'active') {
        checkNotifications().then(({status}) => {
          setCheckNotifPermission(status === 'granted' ? true : false);
        });
      }
      appState.current = nextAppState;
    });
  }, []);

  useEffect(() => {
    checkNotifications().then(({status}) => {
      setCheckNotifPermission(status === 'granted' ? true : false);
    });
  }, []);

  useEffect(() => {
    props.navigation.addListener('didFocus', () => {
      checkNotifications().then(({status}) => {
        setCheckNotifPermission(status === 'granted' ? true : false);
      });
    });
  }, [props.navigation]);

  useEffect(() => {
    Auth.currentAuthenticatedUser().then(userData => {
      if (userData.attributes['custom:role'] === Enum.roles.homeowner) {
        setData(homeownerData);
        setUserType('homeowner');
        setSystemError(
          checkNotifPermission ? settingConfig.settings.systemError : false,
        );
        setEnergyUsage(
          checkNotifPermission ? settingConfig.settings.energyUsage : false,
        );
        setMaintenanceReminders(
          checkNotifPermission ? settingConfig.settings.serviceReminder : false, //aquiii
        );
        setHomeownerUserAnalytics(settingConfig.settings.userAnalytics);
        setTemperatureScale(!isWeatherFahrenheit);
        setVibration(hapticVibration);
      } else {
        setData(contractorData);
        setUserType('admin/contractor');
        setGatewayFault(
          checkNotifPermission ? settingConfig.settings.gatewayFault : false,
        );
        setHeatPumpFault(
          checkNotifPermission ? settingConfig.settings.heatPumpFault : false,
        );
        setRemoteAccess(
          checkNotifPermission ? settingConfig.settings.remoteAccess : false,
        );
        setCompanyAccess(
          checkNotifPermission ? settingConfig.settings.companyAccess : false,
        );
        setFirstNotify(settingConfig.settings.firstNotify);
        setUserAnalytics(settingConfig.settings.userAnalytics);
        setDemoMode(demoModeStore);
        setDemoModeGlobal(demoModeStore);
      }
    });
  }, [checkNotifPermission]);

  const setDemoModeGlobal = status => {
    dispatch(NotificationActions.setDemoModeGlobal(status));
  };

  const contractorData = [
    {
      title: Dictionary.settings.push,
      data: [
        Dictionary.settings.gatewayFault,
        Dictionary.settings.heatPumpFault,
        Dictionary.settings.remoteAccess,
        Dictionary.settings.companyAccess,
      ],
    },
    {
      title: Dictionary.settings.faultCodeNotification,
      data: [Dictionary.settings.firstNotify],
    },
    {
      title: Dictionary.settings.userData,
      data: [Dictionary.settings.analytics],
    },
    {
      title: Dictionary.settings.appDemo,
      data: [Dictionary.settings.demoMode],
    },
  ];
  const homeownerData = [
    {
      title: 'Weather',
      data: ['Temperature Scale'],
    },
    {
      title: 'Vibration',
      data: ['Haptic Vibration'],
    },
    {
      title: Dictionary.settings.push,
      data: [
        Dictionary.settings.systemError,
        Dictionary.settings.energyUsage,
        Dictionary.settings.maintanceReminders,
      ],
    },
    {
      title: Dictionary.settings.userData,
      data: [Dictionary.settings.analytics],
    },
  ];
  const Item = ({title}) => (
    <View style={styles.item}>
      <View style={styles.flex1}>
        <CustomText
          accessible={true}
          accessibilityLabelText={`${title} configuration`}
          text={title}
          align="left"
        />
      </View>

      <View style={styles.flex1}>
        {userType !== 'homeowner' ? (
          <ToggleButton
            button1={
              title === Dictionary.settings.firstNotify
                ? '1 Hrs'
                : Dictionary.button.off
            }
            button2={
              title === Dictionary.settings.firstNotify
                ? '24 Hrs'
                : Dictionary.button.on
            }
            pressed={
              title === Dictionary.settings.gatewayFault
                ? gatewayFault === true
                  ? 1
                  : 0
                : title === Dictionary.settings.heatPumpFault
                ? heatPumpFault === true
                  ? 1
                  : 0
                : title === Dictionary.settings.heatPumpFault
                ? heatPumpFault === true
                  ? 1
                  : 0
                : title === Dictionary.settings.remoteAccess
                ? remoteAccess === true
                  ? 1
                  : 0
                : title === Dictionary.settings.companyAccess
                ? companyAccess === true
                  ? 1
                  : 0
                : title === Dictionary.settings.firstNotify
                ? firstNotify === '24'
                  ? 1
                  : 0
                : title === Dictionary.settings.analytics
                ? userAnalytics === true
                  ? 1
                  : 0
                : title === Dictionary.settings.demoMode
                ? demoMode === true
                  ? 1
                  : 0
                : null
            }
            settingCheck={
              title === Dictionary.settings.analytics
                ? true
                : checkNotifPermission
            }
            isvisible={title === Dictionary.settings.version ? false : true}
            onChange={(value: any) =>
              checkNotifPermission || title === Dictionary.settings.analytics
                ? clickHandler(title, value)
                : null
            }
          />
        ) : (
          <ToggleButton
            button1={
              title === 'Temperature Scale' ? '°F' : Dictionary.button.off
            }
            button2={
              title === 'Temperature Scale' ? '°C' : Dictionary.button.on
            }
            pressed={
              title === Dictionary.settings.systemError
                ? systemError === true
                  ? 1
                  : 0
                : title === Dictionary.settings.energyUsage
                ? energyUsage === true
                  ? 1
                  : 0
                : title === Dictionary.settings.maintanceReminders
                ? maintenanceReminders === true
                  ? 1
                  : 0
                : title === Dictionary.settings.analytics
                ? homeownerUserAnalytics === true
                  ? 1
                  : 0
                : title === 'Temperature Scale'
                ? temperatureScale === true
                  ? 1
                  : 0
                : title === 'Haptic Vibration'
                ? vibration === true
                  ? 1
                  : 0
                : null
            }
            settingCheck={
              title === 'Temperature Scale' || title === 'Haptic Vibration'
                ? true
                : title === Dictionary.settings.analytics
                ? true
                : checkNotifPermission
            }
            isvisible={title.includes('App') ? false : true}
            onChange={(value: any) =>
              title === 'Temperature Scale' || title === 'Haptic Vibration'
                ? clickHandler(title, value)
                : checkNotifPermission ||
                  title === Dictionary.settings.analytics
                ? clickHandler(title, value)
                : null
            }
          />
        )}
      </View>
    </View>
  );
  return (
    <ScrollView>
      <View>
        {data.map(d => {
          return (
            <View key={d.title}>
              <SectionHeading
                key={`SectionHeading-${d.title}`}
                title={d.title}
              />
              {d.data.map(item => {
                return <Item key={item} title={item} />;
              })}
            </View>
          );
        })}
      </View>
      <View accessible={true} style={styles.item1}>
        <CustomText font="bold" text={Dictionary.settings.about} align="left" />
      </View>
      <View style={styles.item2}>
        <CustomText
          text={`${Dictionary.settings.version} ${version}`}
          align="left"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  item: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  item1: {height: 60, paddingHorizontal: 20, justifyContent: 'center'},
  item2: {
    height: 60,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
});
