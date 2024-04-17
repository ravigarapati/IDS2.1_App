import React, {useEffect, useRef, useState} from 'react';
import {Picker, DatePicker} from 'react-native-wheel-pick';
import {
  View,
  ImageBackground,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  LayoutAnimation,
  PixelRatio,
  Platform,
  Linking,
  Alert,
  AppState,
} from 'react-native';
import Tile from '../components/Tile';
import {BoschIcon, Button, CustomText, ModalComponent} from '../components';
import WeatherForecast from '../components/WeatherForecast';
import {connect, useDispatch} from 'react-redux';
import {Icons} from '../utils/icons';
import {Enum} from '../utils/enum';
import {Dictionary} from '../utils/dictionary';
import {getFaqList} from '../store/actions/ContractorActions';
import {removeDeviceToken} from '../store/actions/NotificationActions';
import {
  deleteApplianceHomeOwner,
  deleteDevice,
  getDeviceList,
  getDeviceList2,
  getDeviceListWhenDeleting,
  getWeatherInfo,
  getTempUnitAndHaptic,
  notifications,
  checkHoAnalyticsValue,
  unreadHomeownerNotificationCount,
  getWeatherInfoWithNoLoading,
  selectBcc,
  registerLogin,
} from '../store/actions/HomeOwnerActions';
import {Colors} from '../styles';
import UES from './../assets/images/UES.svg';
import EDIT from '../assets/images/edit.svg';
import {ONLY_WEATHER_INFO} from '../store/labels/NotificationLabels';
import {WEATHER_INFO} from '../store/labels/HomeOwnerLabels';
import {turnOffLoader} from '../store/actions/CommonActions';
import {showToast} from '../components/CustomToast';
import ARROWUP from '../assets/images/arrowup.svg';
import ARROWDOWN from '../assets/images/arrowdown.svg';
import EDITICON from './../assets/images/EditIcon.svg';
import {getSettingConfiguration} from '../store/actions/NotificationActions';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {Hub} from 'aws-amplify';
import {CustomWheelPick} from '../components/CustomWheelPick';
import CLOCK from '../assets/images/clock.svg';
const ALERT_ICON = require('./../assets/images/alert-warning.png');
import {getActiveNotificationListHomeOwner} from '../store/actions/NotificationActions';

function HomeOwnerLanding({
  navigation,
  username,
  isFahrenheit,
  devices,
  deleteDevice,
  location,
  getFaqList,
  getDeviceList,
  device1,
  user,
  getDeviceList2,
  getWeatherInfo,
  weatherInfo,
  weatherInfoLocation,
  getDeviceListWhenDeleting,
  deleteApplianceHomeOwner,
  getTempUnitAndHaptic,
  notifications,
  unreadHomeownerNotificationCount,
  getSettingConfiguration,
  checkHoAnalyticsValue,
  getWeatherInfoWithNoLoading,
  loadedInfoCounter,
  deviceListCounter,
  selectBcc,
  selectedDevice,
  registerLogin,
  email,
  getActiveNotificationListHomeOwner,
}) {
  const [backgroundImage, setBackgroundImage] = useState({});
  const [expandedImage, setExpandedImage] = useState({});
  const [weatherIcon, setWeatherIcon] = useState({});
  const [opened, setOpened] = useState(false);
  const [currentWeatherDescription, setCurrentWeatherDescription] =
    useState('');
  const [utilityEnergyModal, setUtilityEnergyModal] = useState(false);
  const [alreadyGotList, setAlreadyGotList] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const dispatch = useDispatch();
  const [gotDevices, setGotDevices] = useState(true);
  const [dayNames, setDayNames] = useState([
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]);
  const statusIntervalAux = useRef(0);
  const [weatherInfoRetrieved, setWeatherInfoRetrieved] = useState(false);
  const [informationLoaded, setInformationLoaded] = useState(false);
  const addNewDevice = () => {
    navigation.navigate('Add', {addAnother: true, showBackButton: true});
    //navigation.navigate('PairScreen', {deviceType: 'BCC101'});
    //navigation.navigate('PairScreen', {deviceType: 'IDS'});
  };
  const appState = useRef(AppState.currentState);

  const selectTemperatureSymbol = () => (isFahrenheit ? 'F' : 'C');

  const selectTemperatureWord = () => (isFahrenheit ? 'Fahrenheit' : 'Celcius');
  const deviceListCounterRef = useRef(0);

  const getDayNames = () => {
    let daysNames = ['Today'];
    var days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    var d = new Date();
    var dayName = days[d.getDay()];
  };

  /**
   *
   * overCloudyDay
   */

  useEffect(() => {
    deviceListCounterRef.current = deviceListCounter;
  }, [deviceListCounter]);

  async function callurl(url, redirectUrl) {
    await InAppBrowser.isAvailable();
    const {type, url: newUrl} = await InAppBrowser.openAuth(
      `https://stage.singlekey-id.com/auth/connect/endsession?post_logout_redirect_uri=idsmobileapp://&id_token_hint=${idpIdToken}&state=STATE`,
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

  const validateKeys = (keys, index) =>
    keys[index][1] !== undefined &&
    keys[index][1] !== '' &&
    keys[index][1] !== null;

  const accessDashboardIfRequired = () => {
    AsyncStorage.multiGet([
      'lastMacIdOpened',
      'lastMacIdOpenedTimestamp',
      'lastDeviceName',
      'lastDeviceType',
      'lastMode',
    ]).then(keys => {
      if (
        validateKeys(keys, 0) &&
        validateKeys(keys, 1) &&
        validateKeys(keys, 2) &&
        validateKeys(keys, 3) &&
        validateKeys(keys, 4)
      ) {
        let currentDateToCheckString = Date.now().toString();
        let currentDateToCheck =
          currentDateToCheckString.length > 10
            ? currentDateToCheckString.substring(0, 10)
            : currentDateToCheckString;
        let lastDate = Number(keys[1][1]);
        //let lastDate = 1708511015;
        const hourDifference = (currentDateToCheck - lastDate) / 60 / 60;
        if (hourDifference >= 36) {
          let existingDevice = devices.find(d => d.macId == keys[0][1]);
          if (existingDevice !== undefined) {
            if (existingDevice.isOn) {
              selectBcc(keys[0][1]);
              navigation.navigate('BCCDashboard', {
                selectedDevice: selectedDevice,
                currentMacId: keys[0][1],
                deviceName: existingDevice.deviceName,
                deviceMode: Number(keys[4][1]),
                deviceType: keys[3][1],
              });
            }
          } else {
            AsyncStorage.setItem('lastDeviceName', '');
            AsyncStorage.setItem('lastDeviceType', '');
            AsyncStorage.setItem('lastMode', '');
            AsyncStorage.setItem('lastMacIdOpened', '');
            AsyncStorage.setItem('lastMacIdOpenedTimestamp', ``);
          }
        }
      }
    });
  };

  async function callurlLogOut(url, redirectUrl) {
    await InAppBrowser.isAvailable();
    const {type, url: newUrl} = await InAppBrowser.openAuth(
      `https://stage.singlekey-id.com/auth/connect/endsession?&id_token_hint=${idpIdToken}&state=STATE`,
      `idsmobileapp://`,
      {
        showTitle: false,
        enableUrlBarHiding: true,
        enableDefaultShare: false,
        showInRecents: true,
        ephemeralWebSession: true,
      },
    );
    if (type === 'success') {
      //Linking.openURL(newUrl);
    } else {
      Hub.dispatch('browserClosed', {
        event: 'cancel',
        data: 'User clicked close button',
      });
      InAppBrowser.close();
    }
  }

  const logout = () => {
    if (Platform.OS !== 'ios') {
      callurlLogOut();
    }
    dispatch(removeDeviceToken(navigation));
  };

  const verifyNotificationLogOut = res => {
    const arrayNotifications = res.data.Items;

    const exist = arrayNotifications.find(
      element => element.notificationType == 'userDeleted',
    );
    if (exist) {
      Alert.alert(
        'Bosch EasyAir App',
        Dictionary.common.userDeleted,
        [
          {
            text: 'Ok',
            onPress: () => {
              logout();
            },
          },
        ],
        {cancelable: true},
      );
    }
  };

  useEffect(() => {
    AsyncStorage.getItem('forceLogout8').then(value => {
      if (value === 'true') {
        let ratio = PixelRatio.get();
        const input = {
          role: 'homeowner',
          imageSize:
            ratio >= 1 && ratio < 2
              ? 'image1x'
              : ratio >= 2 && ratio < 3
              ? 'image2x'
              : 'image3x',
        };

        AppState.addEventListener('change', nextAppState => {
          if (nextAppState === 'active') {
            getActiveNotificationListHomeOwner({}, res => {
              verifyNotificationLogOut(res);
            });
          }
          appState.current = nextAppState;
        });

        getFaqList(input);
        registerLogin(email, user.attributes.sub);
        getSettingConfiguration(returnValue => {
          checkHoAnalyticsValue(returnValue.settings.userAnalytics);
        }),
          getTempUnitAndHaptic();
        getWeatherInfo(null, true);
        //notifications({});
        unreadHomeownerNotificationCount();
        //if (devices.length == 0 && !alreadyGotList) {
        setAlreadyGotList(true);
        selectBackgroundImageAndIcon(
          Enum.HomeownerLandingScreen.weatherCombinations.clearCloudy,
        );

        getDeviceList2({
          userId: user.attributes.sub,
          counter: deviceListCounterRef.current,
        });
        messaging()
          .getInitialNotification()
          .then(initialMessage => {
            if (initialMessage != null || initialMessage != undefined) {
              navigation.navigate('HomeOwnerNotification');
            }
          });
        messaging().onNotificationOpenedApp(remoteMessage => {
          if (remoteMessage != null || remoteMessage != undefined) {
            navigation.navigate('HomeOwnerNotification');
          }
        });
        //}
        createStatusInterval();
        return () => {
          clearInterval(statusIntervalAux.current);
          //subscription.remove();
        };
      } else {
        dispatch(removeDeviceToken(navigation));
        setTimeout(() => {
          if (Platform.OS !== 'ios') {
            callurl();
          }
        }, 100);

        AsyncStorage.setItem('forceLogout8', 'true');
      }
    });
  }, []);

  useEffect(() => {
    if (loadedInfoCounter === 3) {
      setTimeout(() => {
        setInformationLoaded(true);
      }, 1000);
    }
  }, [loadedInfoCounter]);

  const createStatusInterval = () => {
    clearInterval(statusIntervalAux.current);
    let interval = setInterval(() => {
      getDeviceList2({
        userId: user.attributes.sub,
        counter: deviceListCounterRef.current,
      });
    }, 6000);
    statusIntervalAux.current = interval;

    //setStatusInterval(interval);
  };

  const clearStatusInterval = () => {
    clearInterval(statusIntervalAux.current);
  };

  useEffect(() => {
    getWeatherInfoWithNoLoading(null, true);

    if (gotDevices && devices.length !== 0) {
      setGotDevices(false);
      accessDashboardIfRequired();
    }
  }, [devices]);

  useEffect(() => {
    getWeatherInfoWithNoLoading(null, false);
  }, [weatherInfoLocation]);

  useEffect(() => {
    selectBackgroundImageAndIcon(weatherInfo.weatherCode);
  }, [weatherInfo]);

  const selectForecaseIcon = icon => {
    switch (icon) {
      case Enum.HomeownerLandingScreen.weatherCombinations.clearCloudy:
        return Enum.HomeownerLandingScreen.weatherIcons.SUNNY_AND_CLOUDY;
      case Enum.HomeownerLandingScreen.weatherCombinations.clearCloudyNight:
        return Enum.HomeownerLandingScreen.weatherIcons.NIGHT_AND_CLOUDY;
      case Enum.HomeownerLandingScreen.weatherCombinations.clearNight:
        return Enum.HomeownerLandingScreen.weatherIcons.MOON_CLEAR_NIGHT;
      case Enum.HomeownerLandingScreen.weatherCombinations.cloudyDay:
        return Enum.HomeownerLandingScreen.weatherIcons.CLOUDY;
      case Enum.HomeownerLandingScreen.weatherCombinations.cloudyNight:
        return Enum.HomeownerLandingScreen.weatherIcons.NIGHT_AND_CLOUDY;
      case Enum.HomeownerLandingScreen.weatherCombinations.overCloudyDay:
        return Enum.HomeownerLandingScreen.weatherIcons.OVERCLOUDY;
      case Enum.HomeownerLandingScreen.weatherCombinations.overCloudyNight:
        return Enum.HomeownerLandingScreen.weatherIcons.OVERCLOUDY;
      case Enum.HomeownerLandingScreen.weatherCombinations.rainyDay:
        return Enum.HomeownerLandingScreen.weatherIcons.RAINY;
      case Enum.HomeownerLandingScreen.weatherCombinations.rainyNight:
        return Enum.HomeownerLandingScreen.weatherIcons.RAINY;
      case Enum.HomeownerLandingScreen.weatherCombinations.rainySnowyDay:
        return Enum.HomeownerLandingScreen.weatherIcons.RAIN_AND_SNOWY;
      case Enum.HomeownerLandingScreen.weatherCombinations.rainySnowyNight:
        return Enum.HomeownerLandingScreen.weatherIcons.RAIN_AND_SNOWY;
      case Enum.HomeownerLandingScreen.weatherCombinations.rainyThunderstormDay:
        return Enum.HomeownerLandingScreen.weatherIcons.RAIN_AND_LIGHTNING;
      case Enum.HomeownerLandingScreen.weatherCombinations
        .rainyThunderstormNight:
        return Enum.HomeownerLandingScreen.weatherIcons.RAIN_AND_LIGHTNING;
      case Enum.HomeownerLandingScreen.weatherCombinations.snowyDay:
        return Enum.HomeownerLandingScreen.weatherIcons.SNOWY;
      case Enum.HomeownerLandingScreen.weatherCombinations.snowyNight:
        return Enum.HomeownerLandingScreen.weatherIcons.SNOWY;
      case Enum.HomeownerLandingScreen.weatherCombinations.snowyThuderstormDay:
        return Enum.HomeownerLandingScreen.weatherIcons.SNOW_AND_LIGHTNING;
      case Enum.HomeownerLandingScreen.weatherCombinations
        .snowyThuderstormNight:
        return Enum.HomeownerLandingScreen.weatherIcons.SNOW_AND_LIGHTNING;
      case Enum.HomeownerLandingScreen.weatherCombinations.sunnyClearDay:
        return Enum.HomeownerLandingScreen.weatherIcons.SUNNY_CLEAR_DAY;
      case Enum.HomeownerLandingScreen.weatherCombinations.thunderstormDay:
        return Enum.HomeownerLandingScreen.weatherIcons.LIGHTNING;
      case Enum.HomeownerLandingScreen.weatherCombinations.thunderstormNight:
        return Enum.HomeownerLandingScreen.weatherIcons.LIGHTNING;
    }
  };

  const selectBackgroundImageAndIcon = weather => {
    switch (weather) {
      case Enum.HomeownerLandingScreen.weatherCombinations.clearCloudy:
        setBackgroundImage(
          Enum.HomeownerLandingScreen.backgroundWeather.CLEAR_CLOUDY,
        );
        setWeatherIcon(Enum.HomeownerLandingScreen.weatherIcons.CLOUDY);
        setExpandedImage(
          Enum.HomeownerLandingScreen.backgroundWeather.CLEAR_CLOUDY_EXPANDED,
        );
        setCurrentWeatherDescription(
          Enum.HomeownerLandingScreen.weatherDescriptions.clearCloudy,
        );
        break;
      case Enum.HomeownerLandingScreen.weatherCombinations.clearCloudyNight:
        setBackgroundImage(
          Enum.HomeownerLandingScreen.backgroundWeather.CLEAR_CLOUDY_NIGHT,
        );
        setWeatherIcon(Enum.HomeownerLandingScreen.weatherIcons.CLOUDY);
        setExpandedImage(
          Enum.HomeownerLandingScreen.backgroundWeather
            .CLEAR_CLOUDY_NIGHT_EXPANDED,
        );
        setCurrentWeatherDescription(
          Enum.HomeownerLandingScreen.weatherDescriptions.clearCloudyNight,
        );
        break;
      case Enum.HomeownerLandingScreen.weatherCombinations.clearNight:
        setBackgroundImage(
          Enum.HomeownerLandingScreen.backgroundWeather.CLEAR_NIGHT,
        );
        setWeatherIcon(Enum.HomeownerLandingScreen.weatherIcons.MOON_ICON);
        setExpandedImage(
          Enum.HomeownerLandingScreen.backgroundWeather.CLEAR_NIGHT_EXPANDED,
        );
        setCurrentWeatherDescription(
          Enum.HomeownerLandingScreen.weatherDescriptions.clearNight,
        );
        break;
      case Enum.HomeownerLandingScreen.weatherCombinations.cloudyDay:
        setBackgroundImage(
          Enum.HomeownerLandingScreen.backgroundWeather.CLOUDY_DAY,
        );
        setWeatherIcon(Enum.HomeownerLandingScreen.weatherIcons.CLOUDY);
        setExpandedImage(
          Enum.HomeownerLandingScreen.backgroundWeather.CLOUDY_DAY_EXPANDED,
        );
        setCurrentWeatherDescription(
          Enum.HomeownerLandingScreen.weatherDescriptions.cloudyDay,
        );
        break;
      case Enum.HomeownerLandingScreen.weatherCombinations.cloudyNight:
        setBackgroundImage(
          Enum.HomeownerLandingScreen.backgroundWeather.CLOUDY_NIGHT,
        );
        setWeatherIcon(Enum.HomeownerLandingScreen.weatherIcons.CLOUDY);
        setExpandedImage(
          Enum.HomeownerLandingScreen.backgroundWeather.CLOUDY_NIGHT_EXPANDED,
        );
        setCurrentWeatherDescription(
          Enum.HomeownerLandingScreen.weatherDescriptions.cloudyNight,
        );
        break;
      case Enum.HomeownerLandingScreen.weatherCombinations.overCloudyDay:
        setBackgroundImage(
          Enum.HomeownerLandingScreen.backgroundWeather.MISTY_DAY,
        );
        setWeatherIcon(Enum.HomeownerLandingScreen.weatherIcons.OVERCLOUDY);
        setExpandedImage(
          Enum.HomeownerLandingScreen.backgroundWeather.MISTY_DAY_EXPANDED,
        );
        setCurrentWeatherDescription(
          Enum.HomeownerLandingScreen.weatherDescriptions.overCloudyDay,
        );
        break;
      case Enum.HomeownerLandingScreen.weatherCombinations.overCloudyNight:
        setBackgroundImage(
          Enum.HomeownerLandingScreen.backgroundWeather.MISTY_NIGHT,
        );
        setWeatherIcon(Enum.HomeownerLandingScreen.weatherIcons.OVERCLOUDY);
        setExpandedImage(
          Enum.HomeownerLandingScreen.backgroundWeather.MISTY_NIGHT_EXPANDED,
        );
        setCurrentWeatherDescription(
          Enum.HomeownerLandingScreen.weatherDescriptions.overCloudyNight,
        );
        break;
      case Enum.HomeownerLandingScreen.weatherCombinations.rainyThunderstormDay:
        setBackgroundImage(
          Enum.HomeownerLandingScreen.backgroundWeather.RAINY_AND_THUNDERSTORM,
        );
        setWeatherIcon(
          Enum.HomeownerLandingScreen.weatherIcons.RAIN_AND_LIGHTNING,
        );
        setExpandedImage(
          Enum.HomeownerLandingScreen.backgroundWeather
            .THUNDERSTORM_AND_RAINY_EXPANDED,
        );
        setCurrentWeatherDescription(
          Enum.HomeownerLandingScreen.weatherDescriptions.rainyThunderstormDay,
        );
        break;
      case Enum.HomeownerLandingScreen.weatherCombinations.rainySnowyDay:
        setBackgroundImage(
          Enum.HomeownerLandingScreen.backgroundWeather.SNOWY_AND_RAINY_DAY,
        );
        setWeatherIcon(Enum.HomeownerLandingScreen.weatherIcons.RAIN_AND_SNOWY);
        setExpandedImage(
          Enum.HomeownerLandingScreen.backgroundWeather
            .RAINY_AND_SNOWY_EXPANDED,
        );
        setCurrentWeatherDescription(
          Enum.HomeownerLandingScreen.weatherDescriptions.rainySnowyDay,
        );
        break;
      case Enum.HomeownerLandingScreen.weatherCombinations.rainySnowyNight:
        setBackgroundImage(
          Enum.HomeownerLandingScreen.backgroundWeather.SNOWY_AND_RAINY_NIGHT,
        );
        setWeatherIcon(Enum.HomeownerLandingScreen.weatherIcons.RAIN_AND_SNOWY);
        setExpandedImage(
          Enum.HomeownerLandingScreen.backgroundWeather
            .SNOWY_AND_RAINY_NIGHT_EXPANDED,
        );
        setCurrentWeatherDescription(
          Enum.HomeownerLandingScreen.weatherDescriptions.rainySnowyNight,
        );
        break;
      case Enum.HomeownerLandingScreen.weatherCombinations
        .rainyThunderstormNight:
        setBackgroundImage(
          Enum.HomeownerLandingScreen.backgroundWeather
            .THUNDERSTORM_AND_RAINY_NIGHT,
        );
        setWeatherIcon(
          Enum.HomeownerLandingScreen.weatherIcons.RAIN_AND_LIGHTNING,
        );
        setExpandedImage(
          Enum.HomeownerLandingScreen.backgroundWeather
            .THUNDERSTORM_AND_RAIN_NIGHT_EXPANDED,
        );
        setCurrentWeatherDescription(
          Enum.HomeownerLandingScreen.weatherDescriptions
            .rainyThunderstormNight,
        );
        break;
      case Enum.HomeownerLandingScreen.weatherCombinations.rainyDay:
        setBackgroundImage(
          Enum.HomeownerLandingScreen.backgroundWeather.RAINY_DAY,
        );
        setWeatherIcon(Enum.HomeownerLandingScreen.weatherIcons.RAINY);
        setExpandedImage(
          Enum.HomeownerLandingScreen.backgroundWeather.RAINY_DAY_EXPANDED,
        );
        setCurrentWeatherDescription(
          Enum.HomeownerLandingScreen.weatherDescriptions.rainyDay,
        );
        break;
      case Enum.HomeownerLandingScreen.weatherCombinations.rainyNight:
        setBackgroundImage(
          Enum.HomeownerLandingScreen.backgroundWeather.RAINY_NIGHT,
        );
        setExpandedImage(
          Enum.HomeownerLandingScreen.backgroundWeather.RAINY_NIGHT_EXPANDED,
        );
        setWeatherIcon(Enum.HomeownerLandingScreen.weatherIcons.RAINY);
        setCurrentWeatherDescription(
          Enum.HomeownerLandingScreen.weatherDescriptions.rainyNight,
        );
        break;
      case Enum.HomeownerLandingScreen.weatherCombinations
        .snowyThuderstormNight:
        setBackgroundImage(
          Enum.HomeownerLandingScreen.backgroundWeather
            .THUNDERSTORM_AND_SNOWY_NIGHT,
        );
        setWeatherIcon(Enum.HomeownerLandingScreen.weatherIcons.RAIN_AND_SNOWY);
        setExpandedImage(
          Enum.HomeownerLandingScreen.backgroundWeather
            .THUNDERSTORM_AND_SNOWY_NIGHT_EXPANDED,
        );
        setCurrentWeatherDescription(
          Enum.HomeownerLandingScreen.weatherDescriptions.snowyThuderstormNight,
        );
        break;
      case Enum.HomeownerLandingScreen.weatherCombinations.snowyThuderstormDay:
        setBackgroundImage(
          Enum.HomeownerLandingScreen.backgroundWeather.SNOWY_AND_THUNDERSTORM,
        );
        setExpandedImage(
          Enum.HomeownerLandingScreen.backgroundWeather
            .SNOWY_AND_THUNDERSTORM_EXPANDED,
        );
        setWeatherIcon(Enum.HomeownerLandingScreen.weatherIcons.RAIN_AND_SNOWY);
        setCurrentWeatherDescription(
          Enum.HomeownerLandingScreen.weatherDescriptions.snowyThuderstormDay,
        );
        break;
      case Enum.HomeownerLandingScreen.weatherCombinations.snowyDay:
        setBackgroundImage(
          Enum.HomeownerLandingScreen.backgroundWeather.SNOWY_DAY,
        );
        setExpandedImage(
          Enum.HomeownerLandingScreen.backgroundWeather.SNOWY_DAY_EXPANDED,
        );
        setWeatherIcon(Enum.HomeownerLandingScreen.weatherIcons.SNOWY);
        setCurrentWeatherDescription(
          Enum.HomeownerLandingScreen.weatherDescriptions.snowyDay,
        );
        break;
      case Enum.HomeownerLandingScreen.weatherCombinations.snowyNight:
        setBackgroundImage(
          Enum.HomeownerLandingScreen.backgroundWeather.SNOWY_NIGHT,
        );
        setExpandedImage(
          Enum.HomeownerLandingScreen.backgroundWeather.SNOWY_NIGHT_EXPANDED,
        );
        setWeatherIcon(Enum.HomeownerLandingScreen.weatherIcons.SNOWY);
        setCurrentWeatherDescription(
          Enum.HomeownerLandingScreen.weatherDescriptions.snowyNight,
        );
        break;
      case Enum.HomeownerLandingScreen.weatherCombinations.sunnyClearDay:
        setBackgroundImage(
          Enum.HomeownerLandingScreen.backgroundWeather.SUNNY_DAY,
        );
        setWeatherIcon(
          Enum.HomeownerLandingScreen.weatherIcons.SUNNY_CLEAR_DAY,
        );
        setExpandedImage(
          Enum.HomeownerLandingScreen.backgroundWeather.CLEAR_DAY_EXPANDED,
        );
        setCurrentWeatherDescription(
          Enum.HomeownerLandingScreen.weatherDescriptions.sunnyClearDay,
        );
        break;
      case Enum.HomeownerLandingScreen.weatherCombinations.thunderstormNight:
        setBackgroundImage(
          Enum.HomeownerLandingScreen.backgroundWeather.THUNDERSTORN_NIGHT,
        );
        setWeatherIcon(Enum.HomeownerLandingScreen.weatherIcons.LIGHTNING);
        setExpandedImage(
          Enum.HomeownerLandingScreen.backgroundWeather
            .THUNDERSTORM_NIGHT_EXPANDED,
        );
        setCurrentWeatherDescription(
          Enum.HomeownerLandingScreen.weatherDescriptions.thunderstormNight,
        );
        break;
      case Enum.HomeownerLandingScreen.weatherCombinations.thunderstormDay:
        setBackgroundImage(
          Enum.HomeownerLandingScreen.backgroundWeather.THUNDERSTORM,
        );
        setExpandedImage(
          Enum.HomeownerLandingScreen.backgroundWeather.THUNDERSTORM_EXPANDED,
        );
        setWeatherIcon(Enum.HomeownerLandingScreen.weatherIcons.LIGHTNING);
        setCurrentWeatherDescription(
          Enum.HomeownerLandingScreen.weatherDescriptions.thunderstormDay,
        );
        break;
    }
  };

  const checkPairFunctionality = isThermostat => {
    if (isThermostat) {
      return (
        devices.filter(d => d.deviceType.includes('IDS Arctic') && !d.paired)
          .length != 0
      );
    } else {
      //checar que haya 100
      return (
        devices.filter(d => d.deviceType.includes('BCC10') && !d.paired)
          .length != 0
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={{height: 8, width: '100%'}}
        source={require('../assets/images/header_ribbon.png')}
      />
      <View style={styles.informationContainer}>
        <View style={{height: weatherInfo.current ? (opened ? 265 : 159) : 35}}>
          {weatherInfo.current ? (
            <ImageBackground
              source={opened ? expandedImage : backgroundImage}
              resizeMode={'stretch'}
              style={[styles.backgroundImage]}>
              <View style={styles.welcomeUsername}>
                <CustomText
                  allowFontScaling={true}
                  accessibilityHintText={
                    Dictionary.homeownerLanding.landingScreenLabel
                  }
                  color={'#FFFFFF'}
                  text={`${Dictionary.homeownerLanding.welcome} ${username}`}
                  size={18}
                  align={'left'}
                  style={styles.username}
                />
              </View>

              <View style={styles.weatherInformationSection}>
                <View>
                  <View style={styles.currentInformationWeather}>
                    <View>
                      <View style={styles.currentTemperature}>
                        <CustomText
                          allowFontScaling={true}
                          accessibilityLabelText={`Current temperature: ${
                            weatherInfo.current
                          } ${selectTemperatureWord()} degrees`}
                          text={`${
                            weatherInfo.current
                              ? weatherInfo.current + '°'
                              : '--'
                          }`}
                          size={45}
                          color={'#FFFFFF'}
                        />
                        <CustomText
                          allowFontScaling={true}
                          accessible={false}
                          style={styles.temperatureSign}
                          text={
                            weatherInfo.current ? selectTemperatureSymbol() : ''
                          }
                          size={35}
                          color={'#FFFFFF'}
                        />
                      </View>
                    </View>
                    <View
                      accessible={true}
                      accessibilityLabel={`${Dictionary.homeownerLanding.currentWeatherLabel} ${currentWeatherDescription}`}
                      style={[styles.currentWeatherIcon]}></View>
                  </View>
                  <View style={styles.currentLocation}>
                    {weatherInfoLocation.city && (
                      <CustomText
                        allowFontScaling={true}
                        accessibilityLabelText={`${Dictionary.homeownerLanding.currentLocationLabel} ${weatherInfoLocation.city}`}
                        text={
                          weatherInfoLocation.city.length > 15
                            ? weatherInfoLocation.city.substring(0, 13) + '...'
                            : weatherInfoLocation.city
                        }
                        size={14}
                        color={'#FFFFFF'}
                      />
                    )}
                    <Pressable
                      testID="EditLocation"
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={
                        Dictionary.homeownerLanding.modifyLocationLabel
                      }
                      accessibilityHint={
                        Dictionary.homeownerLanding.modifyLocationHint
                      }
                      onPress={() => navigation.navigate('EditLocation')}>
                      <EDITICON />
                    </Pressable>
                  </View>
                </View>
                <View style={{marginTop: -20}}>
                  <Image
                    style={{
                      height: 89,
                      width: 89,
                    }}
                    resizeMode={'stretch'}
                    source={weatherIcon}
                  />
                  <Pressable
                    testID="WeatherEvents"
                    style={{height: 30, marginBottom: -15}}
                    onPress={() => {
                      LayoutAnimation.configureNext(
                        LayoutAnimation.Presets.easeInEaseOut,
                      );
                      setOpened(!opened);
                    }}>
                    {opened ? (
                      <CustomText
                        allowFontScaling={true}
                        text={``}
                        size={10}
                        color={'white'}
                      />
                    ) : (
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <CustomText
                          allowFontScaling={true}
                          accessibilityLabelText={`${
                            opened ? 'Hide' : 'Show'
                          } Forecast. Activate to ${
                            opened ? 'Hide' : 'Show'
                          } information about the weather condition of the next three days.`}
                          accessible={true}
                          text={`${opened ? 'Hide' : 'Show'} Forecast`}
                          size={10}
                          color={'white'}
                        />
                        {/*<Image
                        source={
                          Enum.HomeownerLandingScreen.screenIcons.ARROW_DOWN
                        }
                      />*/}
                        <View style={{marginLeft: 5, marginTop: 2}}>
                          <ARROWDOWN fill={'#000'} />
                        </View>
                      </View>
                    )}
                  </Pressable>
                </View>
              </View>
              {opened && (
                <View>
                  <View accessible={true} style={styles.forecastContainer}>
                    {weatherInfo.forecaseInfo.map((f, i) => {
                      let nextDay = new Date();
                      nextDay.setDate(nextDay.getDate() + i);
                      return (
                        <WeatherForecast
                          key={i === 0 ? 'Today' : dayNames[nextDay.getDay()]}
                          accessibilityLabelDay={`${
                            i === 0
                              ? 'Today.'
                              : dayNames[nextDay.getDay()] + '.'
                          } Highest:${
                            f.max
                          } ${selectTemperatureWord()} degrees ;Lowest:${
                            f.min
                          } ${selectTemperatureWord()} degrees.`}
                          accessibilityLabelImage={''}
                          day={i === 0 ? 'Today' : dayNames[nextDay.getDay()]}
                          temperature={`H:${f.max}°/L:${f.min}°`}
                          icon={selectForecaseIcon(f.conditionCode)}
                        />
                      );
                    })}
                  </View>
                  <View
                    style={{
                      alignItems: 'flex-end',
                      marginRight: 30,
                    }}>
                    <Pressable
                      testID="setOpened"
                      style={{height: 30, marginBottom: -15, marginTop: 16}}
                      onPress={() => {
                        LayoutAnimation.configureNext(
                          LayoutAnimation.Presets.easeInEaseOut,
                        );
                        setOpened(!opened);
                      }}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <CustomText
                          allowFontScaling={true}
                          accessibilityLabelText={`${
                            opened ? 'Hide' : 'Show'
                          } Forecast. Activate to ${
                            opened ? 'Hide' : 'Show'
                          } information about the weather condition of the next three days.`}
                          accessible={true}
                          text={`${opened ? 'Hide' : 'Show'} Forecast`}
                          size={10}
                          color={'white'}
                        />
                        {/*<Image
                        source={
                          Enum.HomeownerLandingScreen.screenIcons.ARROW_UP
                        }
                      />*/}
                        <View style={{marginLeft: 5, marginTop: 2}}>
                          <ARROWUP fill="#000" />
                        </View>
                      </View>
                    </Pressable>
                  </View>
                </View>
              )}
            </ImageBackground>
          ) : (
            <View style={styles.welcomeUsernameEmpty}>
              <CustomText
                allowFontScaling={true}
                accessibilityHintText={
                  Dictionary.homeownerLanding.landingScreenLabel
                }
                color={'#000'}
                text={`${Dictionary.homeownerLanding.welcome} ${username}`}
                size={18}
                align={'left'}
                style={styles.username}
              />
            </View>
          )}
        </View>
        <ScrollView
          style={styles.tilesContainer}
          contentContainerStyle={
            devices.length === 0
              ? {
                  flex: 1,
                  justifyContent: 'center',
                }
              : {}
          }>
          {devices.length != 0
            ? devices.map(device => {
                return (
                  <Tile
                    TestId="TileComponent"
                    key={device.id}
                    {...device}
                    navigation={navigation}
                    serviceStartDate={
                      device.serviceStartDate !== undefined
                        ? device.serviceStartDate
                        : undefined
                    }
                    createStatusInterval={createStatusInterval}
                    clearStatusInterval={clearStatusInterval}
                    deleteFunction={() => {
                      if (device.isThermostat) {
                        deleteDevice(
                          {
                            macId: device.macId,
                          },
                          (dispatch, path, response) => {
                            if (
                              response.Message !== 'Internal server error' &&
                              response.Message !==
                                'User is not authorized to access this resource'
                            ) {
                              getDeviceListWhenDeleting(
                                {
                                  userId: user.attributes.sub,
                                  isThermostat: true,
                                  macId: device.macId,
                                },
                                () => {},
                              );
                            } else {
                              showToast(
                                'There was an error. Try again.',
                                'error',
                              );
                              turnOffLoader(dispatch, path);
                            }
                          },
                        );
                      } else {
                        deleteApplianceHomeOwner([device.macId], () => {
                          getDeviceListWhenDeleting(
                            {
                              userId: user.attributes.sub,
                              isThermostat: false,
                            },
                            () => {
                              //turnOffLoader(dispatch, path);
                            },
                          );
                        });
                      }
                    }}
                    pairFunctionality={checkPairFunctionality(
                      device.isThermostat,
                    )}
                  />
                );
              })
            : informationLoaded && (
                <View>
                  <CustomText
                    allowFontScaling={true}
                    text={'No Appliance is Added'}
                    size={24}
                    color={'#707070'}
                    font={'bold'}
                  />
                </View>
              )}
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          accessibilityLabelText="Add Apliance"
          accessibilityHintText={Dictionary.homeownerLanding.addUnitDeviceLabel}
          icon={Icons.addFrame}
          text={Dictionary.homeownerLanding.addUnitDevice}
          type={'primary'}
          onPress={addNewDevice}
          testID="AddNewDevice"
        />
      </View>
      <ModalComponent
        modalVisible={utilityEnergyModal}
        closeModal={() => setUtilityEnergyModal(false)}>
        <View style={{width: '97%'}}>
          <Image
            style={{alignSelf: 'center', marginBottom: 23, marginTop: 16}}
            source={require('./../assets/images/UtilityEnergy-Green.png')}
          />
          <CustomText
            allowFontScaling={true}
            text={'Utility Energy Savings'}
            size={21}
            font={'medium'}
            style={{marginBottom: 13}}
          />
          <CustomText
            allowFontScaling={true}
            text={
              'Thank you for your cooperation in keeping community powered during high demand preiods'
            }
            font={'regular'}
          />
          <View style={styles.tipSection}>
            <BoschIcon
              size={20}
              name={Icons.infoTooltip}
              color={Colors.mediumBlue}
              accessibilityLabel={'Info'}
            />
            <CustomText
              allowFontScaling={true}
              accessibilityLabelText={
                'To help prevent potential power outages in the community, Utility Energy Savings are now in effect due to high demand exceding supply.Normal operation will resume at 6:00 PM.'
              }
              size={12}
              align="left"
              newline={true}
              text={
                'To help prevent potential power outages in the community, Utility Energy Savings are now in effect due to high demand exceding supply.\nNormal operation will resume at 6:00 PM.'
              }
              style={[styles.flexShrink1, styles.paddingLeft5]}
            />
          </View>
          <Button
            type={'primary'}
            text={'Close'}
            onPress={() => {
              setUtilityEnergyModal(false);
            }}
            testID="SetEnergyModal"
          />
          <Button
            type={'secondary'}
            text={'End Event'}
            onPress={() => {
              setUtilityEnergyModal(false);
            }}
            testID="EndEvent"
          />
        </View>
      </ModalComponent>
    </View>
  );
}

const mapStateToProps = state => {
  return {
    username: state.auth.user.attributes.name.split(' ')[0],
    email: state.auth.user.attributes.email,
    isFahrenheit: state.homeOwner.actualWeatherOnFahrenheit,
    devices: state.homeOwner.deviceList2,
    location: state.homeOwner.location.split(',')[0],
    device1: state.homeOwner.deviceList,
    user: state.auth.user,
    weatherInfo: state.homeOwner.weatherInfo,
    weatherInfoLocation: state.homeOwner.weatherInfoLocation,
    loadedInfoCounter: state.homeOwner.loadedInfoCounter,
    deviceListCounter: state.homeOwner.deviceListCounter,
    selectedDevice: state.homeOwner.selectedDevice,
  };
};

const mapDispatchToProps = {
  deleteDevice,
  getDeviceList,
  getDeviceList2,
  getWeatherInfo,
  getDeviceListWhenDeleting,
  deleteApplianceHomeOwner,
  getTempUnitAndHaptic,
  notifications,
  unreadHomeownerNotificationCount,
  getSettingConfiguration,
  checkHoAnalyticsValue,
  getWeatherInfoWithNoLoading,
  getFaqList,
  registerLogin,
  selectBcc,
  getActiveNotificationListHomeOwner,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  informationContainer: {
    flex: 1,
  },
  weatherInformationContainer: {
    height: 159,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    marginBottom: 12,
  },
  welcomeUsername: {},
  welcomeUsernameEmpty: {},
  username: {
    paddingLeft: 20,
    paddingTop: 11,
  },
  weatherInformationSection: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 112,
  },
  currentInformationWeather: {
    flexDirection: 'row',
    marginTop: -12,
  },
  currentTemperature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -14,
  },
  currentWeatherIcon: {
    justifyContent: 'center',
  },
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tilesContainer: {
    marginTop: 14,
  },
  buttonContainer: {marginHorizontal: 15},
  temperatureSign: {
    marginBottom: -7,
  },
  energySavingsContainer: {
    backgroundColor: '#86D7A2',
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marginLeft13: {
    marginLeft: 13,
  },
  energySavingsArrow: {
    width: 16,
    height: 16,
  },
  tipSection: {
    flexDirection: 'row',
    marginTop: 33,
  },
  flexShrink1: {
    flexShrink: 1,
  },
  paddingLeft5: {
    paddingLeft: 5,
  },

  marginTop37: {marginTop: 37},
  marginTop49: {marginTop: 49},
  marginBottom56: {marginBottom: 56},
  marginBottom10: {marginBottom: 10},
  width97Percent: {width: '100%'},
  checkWifiImage: {alignSelf: 'center', marginTop: 12},
  icon: {
    alignSelf: 'center',
  },
  justifyContentCenter: {justifyContent: 'center'},
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeOwnerLanding);
/*
<View accessible={true} style={styles.forecastContainer}>
                <WeatherForecast
                  accessibilityLabelDay={
                    Dictionary.homeownerLanding.forecastWeatherLabel
                  }
                  accessibilityLabelTemperature={`72 ${selectTemperatureWord()} degrees,`}
                  accessibilityLabelImage={`${Enum.HomeownerLandingScreen.weatherDescriptions.clearNight}.`}
                  day={'Today'}
                  temperature={`72°${selectTemperatureSymbol()}`}
                  icon={Enum.HomeownerLandingScreen.weatherIcons.MOON_ICON}
                />
                <WeatherForecast
                  accessibilityLabelDay="Tue,"
                  accessibilityLabelTemperature={`86 ${selectTemperatureWord()} degrees,`}
                  accessibilityLabelImage={`${Enum.HomeownerLandingScreen.weatherDescriptions.cloudyDay}.`}
                  day={'Tue'}
                  temperature={`86°${selectTemperatureSymbol()}`}
                  icon={
                    Enum.HomeownerLandingScreen.weatherIcons.SUNNY_AND_CLOUDY
                  }
                />
                <WeatherForecast
                  accessibilityLabelDay="Wed,"
                  accessibilityLabelTemperature={`78 ${selectTemperatureWord()} degrees,`}
                  accessibilityLabelImage={`${Enum.HomeownerLandingScreen.weatherDescriptions.cloudyDay}.`}
                  day={'Wed'}
                  temperature={`78°${selectTemperatureSymbol()}`}
                  icon={Enum.HomeownerLandingScreen.weatherIcons.CLOUDY}
                />
                <WeatherForecast
                  accessibilityLabelDay="Thu,"
                  accessibilityLabelTemperature={`96 ${selectTemperatureWord()} degrees,`}
                  accessibilityLabelImage={`${Enum.HomeownerLandingScreen.weatherDescriptions.sunnyClearDay}.`}
                  day={'Thu'}
                  temperature={`96°${selectTemperatureSymbol()}`}
                  icon={
                    Enum.HomeownerLandingScreen.weatherIcons.SUNNY_CLEAR_DAY
                  }
                />
              </View>
*/
