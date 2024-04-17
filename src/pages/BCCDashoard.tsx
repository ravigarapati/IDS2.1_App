import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  Vibration,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Colors, Typography} from '../styles';
import {
  BoschIcon,
  CustomText,
  Button,
  Loader,
  RadioButton,
  ModalComponent,
} from '../components';
import {Icons} from '../utils/icons';
import {Dictionary} from '../utils/dictionary';
import {HomeOwnerNotificationButton} from './../navigations/NavConfig';
import CircularSlider from '../components/CircularSlider';
import {connect} from 'react-redux';
import {setSelectedDevice} from '../store/actions/HomeOwnerActions';
import {getAccessToken} from '../store/actions/CommonActions';
import {updateThermostatTemperature} from '../store/actions/HomeOwnerActions';
import {Enum} from '../utils/enum';
import BCCDashboardHome from './BCCDashboardHome';
import BCCDashboardSchedule from './BCCDashboardSchedule';
import {
  getScheduleList,
  getDeviceStatus,
  updateLockDevice,
  updateThermostatSelected,
  updateSelected,
  prevBcc,
  getDeviceStatusWithNoLoadingScreen,
  setisOnboardingBcc101,
  getDeviceStatusWhenChangingSchedule,
} from '../store/actions/HomeOwnerActions';
import BCCDashboardSettings from './BCCDashboardSettings';
import BCCDashboardSettingsWIFI from './BCCDashboardSettingsWIFI';
const ALERT_ICON = require('./../assets/images/alert-warning.png');
import HOME from '../assets/images/home.svg';
import SETTINGS from '../assets/images/settings.svg';
import SCHEDULE from '../assets/images/calendar_clock.svg';
import FAN from '../assets/images/fan.svg';
import FAN_ALWAYS from '../assets/images/fan-frame.svg';
import FAN_CIRCULATION from '../assets/images/fan-arrows.svg';
import DROP from '../assets/images/drop.svg';
import HEAT from './../assets/images/heat.svg';
import EMHEAT from './../assets/images/emheat.svg';
import COOL from './../assets/images/cool.svg';
import OFF from './../assets/images/off.svg';
import AUTO from './../assets/images/auto.svg';
import {trigger} from 'react-native-haptic-feedback';
import AsyncStorage from '@react-native-async-storage/async-storage';

// optional
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function BCCDashboard({
  navigation,
  selectedDevice,
  setSelectedDevice,
  updateThermostatTemperature,
  vibration,
  getScheduleList,
  getDeviceStatus,
  updateLockDevice,
  updateThermostatSelected,
  updateSelected,
  getDeviceStatusWithNoLoadingScreen,
  prevBcc,
  previousBcc,
  setisOnboardingBcc101,
  scheduleUpdate,
  getDeviceStatusWhenChangingSchedule,
}) {
  const [currentTab, setCurrentTab] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [stage, setStage] = useState('');
  const [fanStatus, setFanStatus] = useState('');
  const [fanMode, setFanMode] = useState('');
  const [currentTemp, setCurrentTemp] = useState(0);
  const [coolingTemp, setCoolingTemp] = useState(0);
  const [cooling, setCooling] = useState(0);
  const [auxCooling, setAuxCooling] = useState(0);
  const [auxHeating, setAuxHeating] = useState(0);
  const [currentCooling, setCurrentCooling] = useState(-1);
  const [heatingTemp, setHeatingTemp] = useState(0);
  const [heating, setHeating] = useState(0);
  const [currentHeating, setCurrentHeating] = useState(-1);
  const [heatSelected, setHeatSelected] = useState(false);
  const [coolSelected, setCoolSelected] = useState(false);
  const [heatTimer, setHeatTimer] = useState(null);
  const [coolTimer, setCoolTimer] = useState(null);
  const [divisor, setDivisor] = useState(
    selectedDevice.isFahrenheit ? 5.57 : 9.62,
  );
  const [notAvailableModal, setNotAvailableModal] = useState(false);
  const [plus, setPlus] = useState(selectedDevice.isFahrenheit ? 45 : 7);
  const [temperatureLimits, setTemperatureLimits] = useState(
    selectedDevice.isFahrenheit ? {min: 45, max: 99} : {min: 7, max: 38},
  );

  const [changedCooling, setChangedCooling] = useState(false);
  const [changedHeating, setChangedHeating] = useState(false);
  const [updatedSchedule, setUpdateSchedule] = useState(false);
  const [auxiliaryHeating, setAuxiliaryHeating] = useState(false);
  const [statusInterval, setStatusInterval] = useState(null);
  const [power, setPower] = useState(false);
  const statusIntervalAux = useRef(0);
  const statusTimeout = useRef(0);
  const [hold, setHold] = useState('');
  const [pCooling, setPCooling] = useState(0);
  const [pHeating, setPHeating] = useState(0);
  const [auxHold, setAuxHold] = useState(true);
  const [updateInfo, setUpdateInfo] = useState(true);
  const [fahrenheit, setFahrenheit] = useState(true);
  const [deadband, setDeadband] = useState(0);
  const tempTimer = useRef(0);
  const heat1 = useRef(0);
  const notBlockPetition = useRef(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const [rejectStatus, setRejectStatus] = useState(true);
  const timeoutRef = useRef(null);
  const [mode, setMode] = useState(-1);
  const [turnedDevice, setTurned] = useState(false);
  const [lockedDevice, setLockedDevice] = useState(false);
  const [lockCode, setLockCode] = useState('');
  const [showIcon, setShowIcon] = useState(false);
  const showIconRef = useRef(null);
  const [holdingCool, setHoldingCool] = useState(false);
  const [holdingHeat, setHoldingHeat] = useState(false);
  const [is24hrs, setIs24hrs] = useState(false);
  const [isOnSchedule, setIsOnSchedule] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [getStatusAfterChanged, setGetStatusAfterChanged] = useState(false);
  const [heatType, setHeatType] = useState('');
  const [bcc50IsOff, setBCC50IsOff] = useState(false);
  const [allowStatus, setAllowStatus] = useState(true);
  const [accessedDashboard, setAccessedDashboard] = useState(true);

  const onBack = () => {
    setShowIcon(false);
    clearTimeout(showIconRef.current);
    clearInterval(statusIntervalAux.current);
    navigation.navigate('HomeTabs');
  };

  useEffect(() => {
    setisOnboardingBcc101(false);

    if (
      navigation.getParam('currentMacId') !== undefined &&
      navigation.getParam('currentMacId') != previousBcc
    ) {
      setShowDashboard(false);
      prevBcc(selectedDevice.macId);
      getDeviceStatus(
        {
          deviceId: selectedDevice.macId,
        },
        response => {
          if (response.message !== 'Operation succeed') {
            if (navigation.getParam('deviceType') === 'BCC50') {
              setBCC50IsOff(true);
              setCurrentTab(2);
              setNotAvailableModal(false);
              setShowDashboard(false);
            } else {
              setNotAvailableModal(true);
            }
          }
          setUpdateInfo(true);
          updateSelected({...response});
          setShowDashboard(true);
        },
      );
      getScheduleList({
        deviceId: selectedDevice.macId,
        unit: `${selectedDevice.isFahrenheit ? 'F' : 'C'}`,
      });
    } else {
      if (selectedDevice.roomTemp === undefined) {
        setShowDashboard(false);
        getDeviceStatus(
          {
            deviceId: selectedDevice.macId,
          },
          response => {
            if (response.message !== 'Operation succeed') {
              if (navigation.getParam('deviceType') === 'BCC50') {
                setBCC50IsOff(true);
                setCurrentTab(2);
                setNotAvailableModal(false);
                setShowDashboard(false);
              } else {
                setNotAvailableModal(true);
              }
            }
            setUpdateInfo(true);
            updateSelected({...response});
            setShowDashboard(true);
          },
        );
        getScheduleList({
          deviceId: selectedDevice.macId,
          unit: `${selectedDevice.isFahrenheit ? 'F' : 'C'}`,
        });
      } else {
        setShowDashboard(true);
        notBlockPetition.current = false;
        setUpdateInfo(true);
        getDeviceStatusWithNoLoadingScreen(
          {
            deviceId: selectedDevice.macId,
          },
          (response: any) => {
            if (navigation.getParam('deviceType') === 'BCC50') {
              setBCC50IsOff(true);
              setCurrentTab(2);
              setShowDashboard(false);
              setNotAvailableModal(false);
            } else {
              setNotAvailableModal(true);
            }
            //updateSelected({...response});
          },
        );
      }
      //if (selectedDevice.roomTemp != undefined) {
      //  updateSelected({...selectedDevice});
      //
    }

    //clearInterval(statusInterval);
    createStatusInterval();

    return () => {
      clearInterval(statusIntervalAux.current);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (heatTimer !== null) {
        clearTimeout(heatTimer);
      }
    };
  }, [heatTimer]);

  useEffect(() => {
    let accessToken = getAccessToken();
  }, []);

  const createTempTimer = (
    mode,
    coolTemp,
    heatTemp,
    newCoolTemp?,
    newHeatTemp?,
  ) => {
    clearTimeout(tempTimer.current);
    let tempString = '';
    switch (mode) {
      case 1:
        tempString = `${newCoolTemp.toFixed(1).toString()}-${heatTemp
          .toFixed(1)
          .toString()}`;
        break;
      case 2:
      case 4:
        tempString = `${coolTemp.toFixed(1).toString()}-${newHeatTemp
          .toFixed(1)
          .toString()}`;
        break;
      case 3:
        tempString = `${newCoolTemp.toFixed(1).toString()}-${newHeatTemp
          .toFixed(1)
          .toString()}`;
        break;
    }
    setTimeout(() => {
      createStatusInterval();
    }, 100);
    let timeout = setTimeout(() => {
      updateThermostatTemperature({
        unit: selectedDevice.isFahrenheit ? 'F' : 'C',
        deviceId: selectedDevice.macId,
        temp: tempString,
        hold: !selectedDevice.isOnSchedule ? '2' : '1',
      });
      /*setTimeout(() => {
        updateThermostatTemperature({
          unit: selectedDevice.isFahrenheit ? 'F' : 'C',
          deviceId: selectedDevice.macId,
          temp: tempString,
          hold: !selectedDevice.isOnSchedule ? '2' : '1',
        });
      }, 2000);*/
    }, 2000);
    tempTimer.current = timeout;
  };

  const createStatusInterval = () => {
    //clearInterval(statusInterval);
    clearInterval(statusIntervalAux.current);
    //clearTimeout(statusTimeout.current);
    //statusTimeout.current = setTimeout(() => {
    let interval = setInterval(() => {
      setAuxHold(true);
      setUpdateInfo(true);

      setStatusInterval(null);
      getDeviceStatusWithNoLoadingScreen(
        {
          deviceId: selectedDevice.macId,
        },
        (response: any) => {
          if (navigation.getParam('deviceType') === 'BCC50') {
            setBCC50IsOff(true);
            setCurrentTab(2);
            setShowDashboard(false);
            setNotAvailableModal(false);
          } else {
            setNotAvailableModal(true);
          }
          //updateSelected({...response});
        },
      );
      getScheduleList({
        deviceId: selectedDevice.macId,
        unit: `${selectedDevice.isFahrenheit ? 'F' : 'C'}`,
      });
      //getScheduleList({
      //  deviceId: selectedDevice.macId,
      //  unit: `${selectedDevice.isFahrenheit ? 'F' : 'C'}`,
      //});
    }, 6000);
    statusIntervalAux.current = interval;
    //}, 6000);

    //setStatusInterval(interval);
  };

  const selectStage = () => {
    if (selectedDevice.stage !== undefined) {
      setStage(selectedDevice.stage);
    } else {
      setStage('0');
    }
  };

  useEffect(() => {
    return () => {
      if (coolTimer !== null) {
        clearTimeout(coolTimer);
      }
    };
  }, [coolTimer]);

  useEffect(() => {
    if (rejectStatus) {
      setSchedules(selectedDevice.schedules);
    }
  }, [selectedDevice.schedules]);

  const setInfoInAsyncStorage = () => {
    if (accessedDashboard) {
      //let lastDate = new Date();
      setAccessedDashboard(false);
      AsyncStorage.setItem('lastDeviceName', navigation.getParam('deviceName'));
      AsyncStorage.setItem('lastDeviceType', navigation.getParam('deviceType'));
      AsyncStorage.setItem(
        'lastMode',
        navigation.getParam('deviceMode').toString(),
      );
      AsyncStorage.setItem('lastMacIdOpened', selectedDevice.macId);
      AsyncStorage.setItem(
        'lastMacIdOpenedTimestamp',
        Date.now().toString().substring(0, 10),
      );
    }
  };

  useEffect(() => {
    if (rejectStatus) {
      if (allowStatus) {
        if (
          (selectedDevice.roomTemp != undefined && updateInfo) ||
          (selectedDevice.power === '4' && power) ||
          (selectedDevice.power === '2' && !power)
        ) {
          setInfoInAsyncStorage();
          setCurrentTemp(parseInt(selectedDevice.roomTemp));
          setCoolingTemp(parseInt(selectedDevice.coolingTemp));
          setCooling(returnAuxValue(parseInt(selectedDevice.coolingTemp)));
          //setAuxCooling(returnAuxValue(parseInt(selectedDevice.coolingTemp)));
          setHeatingTemp(parseInt(selectedDevice.heatingTemp));
          setHeating(returnAuxValue(parseInt(selectedDevice.heatingTemp)));
          setAuxHeating(returnAuxValue(parseInt(selectedDevice.heatingTemp)));
          setHumidity(parseInt(selectedDevice.humidity));
          //setStage(
          //  selectedDevice.heatType.split('-')[selectedDevice.mode === 1 ? 1 : 2],
          //);
          selectStage();
          setFanStatus(selectedDevice.fanStatus);
          setDivisor(selectedDevice.isFahrenheit ? 5.57 : 9.62);
          setPlus(selectedDevice.isFahrenheit ? 45 : 7);
          setTemperatureLimits(
            selectedDevice.isFahrenheit
              ? {min: 45, max: 99}
              : {min: 7, max: 38},
          );
          if (auxHold) {
            setHold(selectedDevice.hold.toString());
          }
          setPCooling(parseInt(selectedDevice.periodCooling));
          setPHeating(parseInt(selectedDevice.periodHeating));

          setFanMode(selectedDevice.fanMode);
          //if (
          //  selectedDevice.heatType.split('-')[3] &&
          //  (selectedDevice.heatType.split('-')[3] === '2' ||
          //    selectedDevice.heatType.split('-')[3] === '3')
          //) {
          //  setAuxiliaryHeating(true);
          //}
          setMode(selectedDevice.mode);
          setFahrenheit(selectedDevice.isFahrenheit);
          setDeadband(parseInt(selectedDevice.deadband));
          setLockedDevice(selectedDevice.lockDevice);
          setLockCode(selectedDevice.code);
          setIs24hrs(selectedDevice.d_hour === '0' ? false : true);
          setIsOnSchedule(selectedDevice.isOnSchedule);
          setHeatType(selectedDevice.heatType);
          showIconRef.current = setTimeout(() => {
            setShowIcon(true);
          }, 3000);
          if (notBlockPetition.current) {
            setUpdateInfo(false);
          } else {
            setUpdateInfo(true);
            notBlockPetition.current = true;
          }

          setPower(selectedDevice.power === '4' ? false : true);
        }
      } else {
        setAllowStatus(true);
      }
    }
  }, [selectedDevice]);

  useEffect(() => {
    if (getStatusAfterChanged) {
      getDeviceStatusWhenChangingSchedule(
        {
          deviceId: selectedDevice.macId,
        },
        (response: any) => {
          setNotAvailableModal(true);
          //updateSelected({...response});
        },
      );
    }
  }, [getStatusAfterChanged]);

  useEffect(() => {
    if (getStatusAfterChanged) {
      setCurrentTemp(parseInt(selectedDevice.roomTemp));
      setCoolingTemp(parseInt(selectedDevice.coolingTemp));
      setCooling(returnAuxValue(parseInt(selectedDevice.coolingTemp)));
      //setAuxCooling(returnAuxValue(parseInt(selectedDevice.coolingTemp)));
      setHeatingTemp(parseInt(selectedDevice.heatingTemp));
      setHeating(returnAuxValue(parseInt(selectedDevice.heatingTemp)));
      setAuxHeating(returnAuxValue(parseInt(selectedDevice.heatingTemp)));
      setHumidity(parseInt(selectedDevice.humidity));
      //setStage(
      //  selectedDevice.heatType.split('-')[selectedDevice.mode === 1 ? 1 : 2],
      //);
      selectStage();
      setFanStatus(selectedDevice.fanStatus);
      setDivisor(selectedDevice.isFahrenheit ? 5.57 : 9.62);
      setPlus(selectedDevice.isFahrenheit ? 45 : 7);
      setTemperatureLimits(
        selectedDevice.isFahrenheit ? {min: 45, max: 99} : {min: 7, max: 38},
      );
      if (auxHold) {
        setHold(selectedDevice.hold.toString());
      }
      setPCooling(parseInt(selectedDevice.periodCooling));
      setPHeating(parseInt(selectedDevice.periodHeating));

      setFanMode(selectedDevice.fanMode);
      //if (
      //  selectedDevice.heatType.split('-')[3] &&
      //  (selectedDevice.heatType.split('-')[3] === '2' ||
      //    selectedDevice.heatType.split('-')[3] === '3')
      //) {
      //  setAuxiliaryHeating(true);
      //}
      setMode(selectedDevice.mode);
      setFahrenheit(selectedDevice.isFahrenheit);
      setDeadband(parseInt(selectedDevice.deadband));
      setLockedDevice(selectedDevice.lockDevice);
      setLockCode(selectedDevice.code);
      setIs24hrs(selectedDevice.d_hour === '0' ? false : true);
      setIsOnSchedule(selectedDevice.isOnSchedule);
      showIconRef.current = setTimeout(() => {
        setShowIcon(true);
      }, 3000);
      if (notBlockPetition.current) {
        setUpdateInfo(false);
      } else {
        setUpdateInfo(true);
        notBlockPetition.current = true;
      }

      setPower(selectedDevice.power === '4' ? false : true);
      setGetStatusAfterChanged(false);
    }
  }, [scheduleUpdate]);

  let turnOnDevice = mode => {
    setPower(true);
    setMode(mode);
  };

  const hapticVibration = () => {
    if (vibration) {
      trigger('impactLight', options);
    }
  };

  const setModeTemp = (setFunction, value) => {
    const valueDegree = Math.floor((value - 30) / divisor + plus);
    setFunction(valueDegree);
  };

  const cancelScheduleChange = () => {
    clearInterval(statusIntervalAux.current);
    switch (mode) {
      case 2:
      case 4:
        //setHeating(currentHeating);
        //setModeTemp(setHeatingTemp, currentHeating);
        setHeatingTemp(parseInt(pHeating));
        setHeating(returnAuxValue(parseInt(pHeating)));
        updateThermostatTemperature({
          unit: selectedDevice.isFahrenheit ? 'F' : 'C',
          deviceId: selectedDevice.macId,
          temp: `${parseInt(selectedDevice.coolingTemp)
            .toFixed(1)
            .toString()}-${Math.floor(pHeating).toFixed(1).toString()}`,
          hold: '0',
        });
        setHold('0');
        setAuxHold(false);
        setUpdateInfo(false);
        setCurrentHeating(-1);
        setChangedHeating(false);
        break;
      case 1:
        //setCooling(currentCooling);
        //setModeTemp(setCoolingTemp, currentCooling);

        setCooling(returnAuxValue(parseInt(pCooling)));
        setCoolingTemp(parseInt(pCooling));

        updateThermostatTemperature({
          unit: selectedDevice.isFahrenheit ? 'F' : 'C',
          deviceId: selectedDevice.macId,
          temp: `${Math.floor(pCooling).toFixed(1).toString()}-${parseInt(
            selectedDevice.heatingTemp,
          )
            .toFixed(1)
            .toString()}`,
          hold: '0',
        });
        setCurrentCooling(-1);
        setChangedCooling(false);
        setHold('0');
        setAuxHold(false);
        setUpdateInfo(false);
        break;
      case 3:
        updateThermostatTemperature({
          unit: selectedDevice.isFahrenheit ? 'F' : 'C',
          deviceId: selectedDevice.macId,
          temp: `${Math.floor(pCooling).toFixed(1).toString()}-${Math.floor(
            pHeating,
          )
            .toFixed(1)
            .toString()}`,
          hold: '0',
        });
        setHold('0');
        //if (currentCooling !== -1) {
        //setCooling(currentCooling);
        //setModeTemp(setCoolingTemp, currentCooling);

        setCooling(returnAuxValue(parseInt(pCooling)));
        setCoolingTemp(parseInt(pCooling));
        setChangedCooling(false);
        setCurrentCooling(-1);
        //}
        //if (currentHeating !== -1) {
        //setHeating(currentHeating);
        //setModeTemp(setHeatingTemp, currentHeating);

        setHeatingTemp(parseInt(pHeating));
        setHeating(returnAuxValue(parseInt(pHeating)));
        setChangedHeating(false);
        setCurrentHeating(-1);
        //}
        setHold('0');
        setAuxHold(false);
        setUpdateInfo(false);
        break;
    }
    createStatusInterval();
    /*setTimeout(() => {
      createStatusInterval();
    }, 3000);*/
  };

  const selectModeName = () => {
    let modeName = '';
    switch (mode) {
      case 0:
        modeName = 'Off';
        break;
      case 1:
        modeName = 'Cooling';
        break;
      case 2:
        modeName = 'Heating';
        break;
      case 3:
        modeName = 'Auto';
        break;
      case 4:
        modeName = 'Em Heat';
        break;
    }
    return modeName;
  };

  const selectTemperature = () => {
    return selectedDevice.isFahrenheit ? 'F' : 'C';
  };

  const renderFanIcon = () => {
    switch (selectedDevice.fanMode) {
      case '0':
        return <FAN fill="#000" />;
      case '1':
        return <FAN_ALWAYS fill="#000" />;
      case '2':
        return <FAN_CIRCULATION fill="#000" />;
    }
  };

  const returnThermostatIcon = index => {
    switch (index) {
      case 1:
        return <COOL />;
      case 2:
        if (auxiliaryHeating) {
          return <Image source={Enum.BccDashboardScreen.ACCELERATED_HEATING} />;
        }
        return <HEAT fill="#000" />;
      case 4:
        if (auxiliaryHeating) {
          return <Image source={Enum.BccDashboardScreen.ACCELERATED_HEATING} />;
        }
        return (
          <View style={styles.emHeatIcon}>
            <EMHEAT fill="#000" />
          </View>
        );
      case 3:
        return <AUTO fill="#000" />;
      case 0:
        return (
          <View style={styles.offThermostatIcon}>
            <OFF fill="#000" />
          </View>
        );
      default:
    }
  };

  const renderThermostatIcon = () => {
    if (!showIcon) {
      return returnThermostatIcon(
        navigation.getParam('deviceMode') !== undefined &&
          selectedDevice.power != 4
          ? navigation.getParam('deviceMode')
          : 0,
      );
    } else {
      if (mode !== undefined && mode != -1) {
        if (selectedDevice.power != 4) {
          return returnThermostatIcon(mode);
        } else {
          return returnThermostatIcon(0);
        }
      }
    }
  };

  const updateAutoTemperature = (newCooling, newHeating) => {
    setCooling(newCooling);
    setHeating(newHeating);
  };

  const initializeTimerHeat = () => {
    setHeatTimer(
      setTimeout(() => {
        setHeatSelected(false);
      }, 10000),
    );
  };

  const initializeTimerCool = () => {
    setCoolTimer(
      setTimeout(() => {
        setCoolSelected(false);
      }, 10000),
    );
  };

  const clearHeatTimer = () => {
    clearTimeout(heatTimer);
    setHeatTimer(null);
  };

  const clearCoolTimer = () => {
    clearTimeout(coolTimer);
    setCoolTimer(null);
  };

  const updateTemperatureDragging = (
    value,
    currentTemp,
    setCurrentTemp,
    temp,
    setTemp,
    setChangedTemp,
    setAuxTemp,
  ) => {
    const degreeValue = Math.floor((value - 30) / divisor + plus);
    const auxDegree = (value - 30) / divisor + plus;
    if (
      degreeValue >= temperatureLimits.min &&
      degreeValue <= temperatureLimits.max
    ) {
      if (mode === 1) {
        setCoolingTemp(degreeValue);
      } else {
        setHeatingTemp(degreeValue);
      }
      if (currentTemp === -1) {
        setCurrentTemp(temp);
      }
      if (
        Math.floor((value - 30) / divisor + plus) !==
        Math.floor((temp - 30) / divisor + plus)
      ) {
        //hapticVibration();
      }

      setTemp(value);
      setAuxTemp(value);
      if (selectedDevice.isOnSchedule) {
        setChangedTemp(true);
      }
    }
  };

  const updateTermperature = operation => {
    let newTemp = 0;
    stopStatus();
    clearInterval(statusIntervalAux.current);
    let newTempDegrees = 0;
    switch (mode) {
      case 1:
        if (selectedDevice.isOnSchedule) {
          setChangedCooling(true);
          if (currentCooling === -1) {
            setCurrentCooling(cooling);
          }
        }

        newTemp = coolingTemp;
        if (operation == 'add' && newTemp < temperatureLimits.max) {
          newTemp++;

          newTempDegrees = returnAuxValue(newTemp);
          setCooling(newTempDegrees);
          setCoolingTemp(newTemp);
        } else if (
          operation == 'substract' &&
          newTemp > temperatureLimits.min
        ) {
          newTemp--;
          newTempDegrees = returnAuxValue(newTemp);
          setCooling(newTempDegrees);
          setCoolingTemp(newTemp);
        }
        createTempTimer(mode, coolingTemp, heatingTemp, newTemp, undefined);
        /*updateThermostatTemperature({
          unit: selectedDevice.isFahrenheit ? 'F' : 'C',
          deviceId: selectedDevice.macId,
          temp: `${Math.floor((newTempDegrees - 30) / divisor + plus)
            .toFixed(1)
            .toString()}-${selectedDevice.heatingTemp}`,
          hold: !selectedDevice.isOnSchedule ? '0' : '1',
        });*/
        setHold(!selectedDevice.isOnSchedule ? '0' : '1');
        setAuxHold(false);
        setUpdateInfo(false);
        //xcreateStatusInterval();
        break;
      case 4:
      case 2:
        if (selectedDevice.isOnSchedule) {
          setChangedHeating(true);
          if (currentHeating === -1) {
            setCurrentHeating(heating);
          }
        }
        newTemp = heatingTemp;
        if (operation == 'add' && newTemp < temperatureLimits.max) {
          newTemp++;
          heat1.current = newTemp;
          newTempDegrees = returnAuxValue(newTemp);
          setHeating(newTempDegrees);
          setHeatingTemp(newTemp);
        } else if (
          operation == 'substract' &&
          newTemp > temperatureLimits.min
        ) {
          newTemp--;
          newTempDegrees = returnAuxValue(newTemp);
          setHeating(newTempDegrees);
          setHeatingTemp(newTemp);
        }
        createTempTimer(mode, coolingTemp, heatingTemp, undefined, newTemp);
        /*updateThermostatTemperature({
          unit: selectedDevice.isFahrenheit ? 'F' : 'C',
          deviceId: selectedDevice.macId,
          temp: `${selectedDevice.coolingTemp}-${Math.floor(newTemp)
            .toFixed(1)
            .toString()}`,
          hold: !selectedDevice.isOnSchedule ? '0' : '1',
        });*/
        setHold(!selectedDevice.isOnSchedule ? '0' : '1');
        setAuxHold(false);
        setUpdateInfo(false);
        //createStatusInterval();
        break;

      case 3:
        let auxCooling1 = coolingTemp;
        let auxHeating1 = heatingTemp;
        if (heatSelected) {
          if (selectedDevice.isOnSchedule) {
            setChangedHeating(true);
            setChangedCooling(true);
            if (currentHeating === -1) {
              setCurrentHeating(heating);
            }
            if (currentCooling === -1) {
              setCurrentCooling(cooling);
            }
          }

          if (operation == 'add' && auxHeating1 < temperatureLimits.max) {
            if (auxCooling1 - auxHeating1 <= deadband) {
              if (auxCooling1 < temperatureLimits.max) {
                auxCooling1++;
                let newCoolingTempDegrees = returnAuxValue(auxCooling1);
                setCooling(newCoolingTempDegrees);
                setCoolingTemp(auxCooling1);
              }
            }
            if (
              auxCooling1 < temperatureLimits.max ||
              auxCooling1 - auxHeating1 > deadband
            ) {
              auxHeating1++;

              let newHeatingTempDegrees = returnAuxValue(auxHeating1);
              setHeating(newHeatingTempDegrees);
              setHeatingTemp(auxHeating1);
            }
          } else if (
            operation == 'substract' &&
            auxHeating1 > temperatureLimits.min
          ) {
            auxHeating1--;
            let newHeatingTempDegrees = returnAuxValue(auxHeating1);
            setHeating(newHeatingTempDegrees);
            setHeatingTemp(auxHeating1);
          }
          clearHeatTimer();
          initializeTimerHeat();
        } else if (coolSelected) {
          if (selectedDevice.isOnSchedule) {
            setChangedCooling(true);
            setChangedHeating(true);
            if (currentCooling === -1) {
              setCurrentCooling(cooling);
            }
            if (currentHeating === -1) {
              setCurrentHeating(heating);
            }
          }
          if (operation == 'add' && auxCooling1 < temperatureLimits.max) {
            auxCooling1++;
            let newCoolingTempDegrees = returnAuxValue(auxCooling1);
            setCooling(newCoolingTempDegrees);
            setCoolingTemp(auxCooling1);
          } else if (
            operation == 'substract' &&
            auxCooling1 > temperatureLimits.min
          ) {
            if (auxCooling1 - auxHeating1 <= deadband) {
              if (auxHeating1 > temperatureLimits.min) {
                auxHeating1--;
                let newHeatingTempDegrees = returnAuxValue(auxHeating1);
                setHeating(newHeatingTempDegrees);
                setHeatingTemp(auxHeating1);
              }
            }
            if (
              auxHeating1 > temperatureLimits.min ||
              auxCooling1 - auxHeating1 > deadband
            ) {
              auxCooling1--;
              let newCoolingTempDegrees = returnAuxValue(auxCooling1);
              setCooling(newCoolingTempDegrees);
              setCoolingTemp(auxCooling1);
            }
          }
          clearCoolTimer();
          initializeTimerCool();
        }
        createTempTimer(
          mode,
          coolingTemp,
          heatingTemp,
          auxCooling1,
          auxHeating1,
        );
        /*updateThermostatTemperature({
          unit: selectedDevice.isFahrenheit ? 'F' : 'C',
          deviceId: selectedDevice.macId,
          temp: `${auxCooling1.toFixed(1).toString()}-${auxHeating1
            .toFixed(1)
            .toString()}`,
          hold: !selectedDevice.isOnSchedule ? '0' : '1',
        });*/
        setHold(!selectedDevice.isOnSchedule ? '0' : '1');
        setAuxHold(false);
        setUpdateInfo(false);
        //createStatusInterval();
        break;
      case 0:
        return (
          <Image
            style={styles.offThermostatIcon}
            resizeMode="stretch"
            source={Enum.BccDashboardScreen.OFF_THERMOSTAT}
          />
        );
      default:
    }
    hapticVibration();
    setUpdateSchedule(false);
    createStatusInterval();
    /*setTimeout(() => {
      createStatusInterval();
    }, 3000);*/
  };

  let degreesToTempF = {
    45: 27,
    46: 33,
    47: 38,
    48: 44,
    49: 50,
    50: 55,
    51: 61,
    52: 67,
    53: 72,
    54: 78,
    55: 84,
    56: 89,
    57: 95,
    58: 101,
    59: 106,
    60: 112,
    61: 117,
    62: 123,
    63: 129,
    64: 135,
    65: 141,
    66: 146,
    67: 152,
    68: 158,
    69: 164,
    70: 170,
    71: 175,
    72: 181,
    73: 187,
    74: 192,
    75: 198,
    76: 204,
    77: 210,
    78: 216,
    79: 221,
    80: 227,
    81: 233,
    82: 239,
    83: 244,
    84: 250,
    85: 256,
    86: 261,
    87: 267,
    88: 273,
    89: 278,
    90: 284,
    91: 290,
    92: 295,
    93: 301,
    94: 306,
    95: 312,
    96: 318,
    97: 323,
    98: 329,
    99: 335,
  };

  let degreesToTempC = {
    7: 27,
    8: 37,
    9: 47,
    10: 56,
    11: 66,
    12: 76,
    13: 86,
    14: 96,
    15: 106,
    16: 116,
    17: 126,
    18: 136,
    19: 146,
    20: 156,
    21: 166,
    22: 176,
    23: 186,
    24: 196,
    25: 206,
    26: 216,
    27: 226,
    28: 236,
    29: 246,
    30: 256,
    31: 265,
    32: 275,
    33: 285,
    34: 295,
    35: 305,
    36: 314,
    37: 324,
    38: 334,
  };

  const returnAuxValue = value => {
    let newValue;
    if (selectedDevice.isFahrenheit) {
      newValue = degreesToTempF[value];
    } else {
      newValue = degreesToTempC[value];
    }
    return newValue;
  };

  let temperaturesF = {
    27: 45,
    33: 46,
    38: 47,
    44: 48,
    50: 49,
    55: 50,
    61: 51,
    67: 52,
    72: 53,
    78: 54,
    84: 55,
    89: 56,
    95: 57,
    101: 58,
    106: 59,
    112: 60,
    117: 61,
    123: 62,
    129: 63,
    135: 64,
    141: 65,
    146: 66,
    152: 67,
    158: 68,
    164: 69,
    170: 70,
    175: 71,
    181: 72,
    187: 73,
    192: 74,
    198: 75,
    204: 76,
    210: 77,
    216: 78,
    221: 79,
    227: 80,
    233: 81,
    239: 82,
    244: 83,
    250: 84,
    256: 85,
    261: 86,
    267: 87,
    273: 88,
    278: 89,
    284: 90,
    290: 91,
    295: 92,
    301: 93,
    306: 94,
    312: 95,
    318: 96,
    323: 97,
    329: 98,
    335: 99,
  };

  let stopStatus = () => {
    clearTimeout(timeoutRef.current);
    setRejectStatus(false);
    setAllowStatus(false);
    timeoutRef.current = setTimeout(() => {
      setRejectStatus(true);
    }, 14000);
  };

  let temperaturesC = {
    27: 7,
    37: 8,
    46: 9,
    56: 10,
    66: 11,
    76: 12,
    86: 13,
    96: 14,
    106: 15,
    116: 16,
    126: 17,
    136: 18,
    146: 19,
    156: 20,
    166: 21,
    176: 22,
    186: 23,
    196: 24,
    206: 25,
    216: 26,
    226: 27,
    236: 28,
    246: 29,
    256: 30,
    265: 31,
    275: 32,
    285: 33,
    295: 34,
    305: 35,
    314: 36,
    324: 37,
    334: 38,
  };

  const selectTempBasedOnDegree = (
    set1,
    set2,
    value,
    isAuto = undefined,
    isCool = undefined,
    secondaryToUpdate = undefined,
    secondaryToUpdateDegrees = undefined,
  ) => {
    let newValue = 0;

    if (selectedDevice.isFahrenheit) {
      newValue = temperaturesF[value] ? temperaturesF[value] : 0;
    } else {
      newValue = temperaturesC[value] ? temperaturesC[value] : 0;
    }
    if (!isAuto) {
      if (newValue != 0) {
        if (isCool) {
          if (newValue - coolingTemp > 1) {
            newValue = coolingTemp + 1;
            if (selectedDevice.isFahrenheit) {
              value = degreesToTempF[newValue];
            } else {
              value = degreesToTempC[newValue];
            }
          } else if (coolingTemp - newValue > 1) {
            newValue = coolingTemp - 1;
            if (selectedDevice.isFahrenheit) {
              value = degreesToTempF[newValue];
            } else {
              value = degreesToTempC[newValue];
            }
          }
        } else {
          if (newValue - heatingTemp > 1) {
            newValue = heatingTemp + 1;
            if (selectedDevice.isFahrenheit) {
              value = degreesToTempF[newValue];
            } else {
              value = degreesToTempC[newValue];
            }
          } else if (heatingTemp - newValue > 1) {
            newValue = heatingTemp - 1;
            if (selectedDevice.isFahrenheit) {
              value = degreesToTempF[newValue];
            } else {
              value = degreesToTempC[newValue];
            }
          }
        }
        set1(value);
        set2(newValue);
        if (isCool) {
          if (coolingTemp != newValue) {
            hapticVibration();
          }
        } else {
          if (heatingTemp != newValue) {
            hapticVibration();
          }
        }
      }
    } else if (newValue != 0) {
      if (isCool) {
        if (newValue - heatingTemp >= deadband) {
          set1(value);
          set2(newValue);
          hapticVibration();
        } else {
          if (newValue - coolingTemp > 1) {
            newValue = coolingTemp + 1;
            if (selectedDevice.isFahrenheit) {
              value = degreesToTempF[newValue];
            } else {
              value = degreesToTempC[newValue];
            }
          } else if (coolingTemp - newValue > 1) {
            newValue = coolingTemp - 1;
            if (selectedDevice.isFahrenheit) {
              value = degreesToTempF[newValue];
            } else {
              value = degreesToTempC[newValue];
            }
          }

          if (
            heatingTemp - 1 >= temperatureLimits.min &&
            heatingTemp - 1 <= temperatureLimits.max
          ) {
            set1(value);
            set2(newValue);
            secondaryToUpdate(heatingTemp - 1);
            secondaryToUpdateDegrees(returnAuxValue(heatingTemp - 1));
          }
          hapticVibration();
        }
      } else {
        if (coolingTemp - newValue >= deadband) {
          set1(value);
          set2(newValue);
          hapticVibration();
        } else {
          if (newValue - heatingTemp > 1) {
            newValue = heatingTemp + 1;
            if (selectedDevice.isFahrenheit) {
              value = degreesToTempF[newValue];
            } else {
              value = degreesToTempC[newValue];
            }
          } else if (heatingTemp - newValue > 1) {
            newValue = heatingTemp - 1;
            if (selectedDevice.isFahrenheit) {
              value = degreesToTempF[newValue];
            } else {
              value = degreesToTempC[newValue];
            }
          }

          if (
            coolingTemp + 1 <= temperatureLimits.max &&
            coolingTemp + 1 >= temperatureLimits.min
          ) {
            set1(value);
            set2(newValue);
            secondaryToUpdate(coolingTemp + 1);
            secondaryToUpdateDegrees(returnAuxValue(coolingTemp + 1));
          }
          hapticVibration();
        }
      }
    }
  };

  const renderThermostatChart = () => {
    if (selectedDevice.roomTemp && power && currentTemp) {
      switch (mode) {
        case 1:
          return (
            <CircularSlider
              mode={'Cooling'}
              humidity={humidity}
              layoutWidth={width}
              width={width * 0.8}
              height={width * 0.8}
              textColorInnerCircle="#FFF"
              cooling={cooling}
              coolingTemp={coolingTemp}
              updateTemperature={updateTermperature}
              currentTemp={currentTemp}
              holdingCool={holdingCool}
              setHoldingCool={setHoldingCool}
              fahrenheit={fahrenheit}
              onCoolingChange={value => {
                stopStatus();
                clearInterval(statusIntervalAux.current);
                updateTemperatureDragging(
                  value,
                  currentCooling,
                  setCurrentCooling,
                  cooling,
                  setCooling,
                  setChangedCooling,
                  setAuxCooling,
                );
              }}
              onAuxCoolingChange={value => {
                const degreeValue = Math.floor((value - 30) / divisor + plus);
                stopStatus();
                clearInterval(statusIntervalAux.current);
                selectTempBasedOnDegree(
                  setCooling,
                  setCoolingTemp,
                  value,
                  undefined,
                  true,
                );
              }}
              onCoolingRelease={value => {
                //const degreeValue = Math.floor((cooling - 30) / divisor + plus);
                createStatusInterval();
                /*setTimeout(() => {
                  createStatusInterval();
                }, 3000);*/
                setUpdateSchedule(false);
                createTempTimer(
                  mode,
                  coolingTemp,
                  heatingTemp,
                  coolingTemp,
                  heatingTemp,
                );
                /*updateThermostatTemperature({
                  unit: selectedDevice.isFahrenheit ? 'F' : 'C',
                  deviceId: selectedDevice.macId,
                  temp: `${coolingTemp.toFixed(1).toString()}-${heatingTemp
                    .toFixed(1)
                    .toString()}`,
                  hold: !selectedDevice.isOnSchedule ? '2' : '1',
                });*/
                setHold(!selectedDevice.isOnSchedule ? '2' : '1');
                setAuxHold(false);
                setUpdateInfo(false);
              }}
              auxCooling={auxCooling}
            />
          );
        case 2:
        case 4:
          return (
            <CircularSlider
              mode={mode === 2 ? 'Heating' : 'Em Heat'}
              layoutWidth={width}
              humidity={humidity}
              width={width * 0.8}
              height={width * 0.8}
              textColorInnerCircle="#FFF"
              heating={heating}
              heatingTemp={heatingTemp}
              holdingHeat={holdingHeat}
              setHoldingHeat={setHoldingHeat}
              updateTemperature={updateTermperature}
              currentTemp={currentTemp}
              fahrenheit={fahrenheit}
              onHeatingChange={value => {
                stopStatus();
                clearInterval(statusIntervalAux.current);
                updateTemperatureDragging(
                  value,
                  currentHeating,
                  setCurrentHeating,
                  heating,
                  setHeating,
                  setChangedHeating,
                  setAuxHeating,
                );
              }}
              onAuxHeatingChange={value => {
                stopStatus();
                clearInterval(statusIntervalAux.current);
                selectTempBasedOnDegree(
                  setHeating,
                  setHeatingTemp,
                  value,
                  undefined,
                  false,
                );
              }}
              onHeatingRelease={value => {
                const degreeValue = Math.floor((heating - 30) / divisor + plus);
                createStatusInterval();
                setUpdateSchedule(false);
                createTempTimer(
                  mode,
                  coolingTemp,
                  heatingTemp,
                  coolingTemp,
                  heatingTemp,
                );
                /*updateThermostatTemperature({
                  unit: selectedDevice.isFahrenheit ? 'F' : 'C',
                  deviceId: selectedDevice.macId,
                  temp: `${coolingTemp.toFixed(1).toString()}-${heatingTemp
                    .toFixed(1)
                    .toString()}`,
                  hold: !selectedDevice.isOnSchedule ? '2' : '1',
                });*/
                setHold(!selectedDevice.isOnSchedule ? '2' : '1');
                setAuxHold(false);
                setUpdateInfo(false);
              }}
              auxHeating={auxHeating}
            />
          );

        case 3:
          return (
            <CircularSlider
              mode={'Auto'}
              updateAutoTemperature={(newCooling, newHeating) =>
                updateAutoTemperature(newCooling, newHeating)
              }
              humidity={humidity}
              initializeTimerHeat={initializeTimerHeat}
              initializeTimerCool={initializeTimerCool}
              clearHeatTimer={clearHeatTimer}
              clearCoolTimer={clearCoolTimer}
              heatSelected={heatSelected}
              coolSelected={coolSelected}
              heatTimer={heatTimer}
              coolTimer={coolTimer}
              setHeatSelected={setHeatSelected}
              setCoolSelected={setCoolSelected}
              layoutWidth={width}
              width={width * 0.8}
              height={width * 0.8}
              holdingCool={holdingCool}
              setHoldingCool={setHoldingCool}
              holdingHeat={holdingHeat}
              setHoldingHeat={setHoldingHeat}
              fahrenheit={fahrenheit}
              textColorInnerCircle="#FFF"
              heating={heating}
              heatingTemp={heatingTemp}
              cooling={cooling}
              coolingTemp={coolingTemp}
              updateTemperature={updateTermperature}
              currentTemp={currentTemp}
              onHeatingChange={value => {
                stopStatus();
                clearInterval(statusIntervalAux.current);
                const degreeValue = Math.floor((value - 30) / divisor + plus);
                const auxCooling1 = Math.floor(
                  Math.floor((cooling - 30) / divisor + plus),
                );
                const auxHeating1 = Math.floor(
                  Math.floor((value - 30) / divisor + plus),
                );
                if (
                  degreeValue >= temperatureLimits.min &&
                  degreeValue <= temperatureLimits.max
                ) {
                  if (currentHeating === -1) {
                    setCurrentHeating(heating);
                  }
                  if (
                    Math.floor((value - 30) / divisor + plus) !==
                    Math.floor((heating - 30) / divisor + plus)
                  ) {
                    setHeatingTemp(degreeValue);
                    clearHeatTimer();
                    initializeTimerHeat();
                    hapticVibration();
                  }
                  setHeating(value);
                  if (selectedDevice.isOnSchedule) {
                    setChangedHeating(true);
                  }
                }
              }}
              onAuxHeatingChange={value => {
                stopStatus();
                clearHeatTimer();
                initializeTimerHeat();
                clearInterval(statusIntervalAux.current);
                selectTempBasedOnDegree(
                  setHeating,
                  setHeatingTemp,
                  value,
                  true,
                  false,
                  setCoolingTemp,
                  setCooling,
                );
              }}
              onHeatingRelease={() => {
                createStatusInterval();
                /*setTimeout(() => {
                  createStatusInterval();
                }, 3000);*/
                /*updateThermostatTemperature({
                  unit: selectedDevice.isFahrenheit ? 'F' : 'C',
                  deviceId: selectedDevice.macId,
                  temp: `${coolingTemp.toFixed(1).toString()}-${heatingTemp
                    .toFixed(1)
                    .toString()}`,
                  hold: !selectedDevice.isOnSchedule ? '2' : '1',
                });*/
                setUpdateSchedule(false);
                createTempTimer(
                  mode,
                  coolingTemp,
                  heatingTemp,
                  coolingTemp,
                  heatingTemp,
                );
                setHold(!selectedDevice.isOnSchedule ? '2' : '1');
                setAuxHold(false);
                setUpdateInfo(false);
              }}
              onCoolingChange={value => {
                stopStatus();
                clearInterval(statusIntervalAux.current);
                const degreeValue = Math.floor(
                  Math.floor((value - 30) / divisor + plus),
                );
                const auxCooling1 = Math.floor(
                  Math.floor((cooling - 30) / divisor + plus),
                );
                const auxHeating1 = Math.floor(
                  Math.floor((heating - 30) / divisor + plus),
                );

                if (
                  degreeValue >= temperatureLimits.min &&
                  degreeValue <= temperatureLimits.max
                ) {
                  if (currentCooling === -1) {
                    setCurrentCooling(cooling);
                  }
                  if (
                    Math.floor((value - 30) / divisor + plus) !==
                    Math.floor((cooling - 30) / divisor + plus)
                  ) {
                    setCoolingTemp(degreeValue);
                    hapticVibration();
                  }
                  clearCoolTimer();
                  initializeTimerCool();
                }
                setCooling(value);
                if (selectedDevice.isOnSchedule) {
                  setChangedCooling(true);
                }
              }}
              onAuxCoolingChange={value => {
                stopStatus();
                clearCoolTimer();
                initializeTimerCool();
                clearInterval(statusIntervalAux.current);
                selectTempBasedOnDegree(
                  setCooling,
                  setCoolingTemp,
                  value,
                  true,
                  true,
                  setHeatingTemp,
                  setHeating,
                );
              }}
              onCoolingRelease={() => {
                setUpdateSchedule(false);
                createStatusInterval();
                /*setTimeout(() => {
                  createStatusInterval();
                }, 3000);*/
                /*updateThermostatTemperature({
                  unit: selectedDevice.isFahrenheit ? 'F' : 'C',
                  deviceId: selectedDevice.macId,
                  temp: `${coolingTemp.toFixed(1).toString()}-${heatingTemp
                    .toFixed(1)
                    .toString()}`,
                  hold: !selectedDevice.isOnSchedule ? '2' : '1',
                });*/
                createTempTimer(
                  mode,
                  coolingTemp,
                  heatingTemp,
                  coolingTemp,
                  heatingTemp,
                );
                setHold(!selectedDevice.isOnSchedule ? '2' : '1');
                setAuxHold(false);
                setUpdateInfo(false);
              }}
            />
          );
        case 0:
          return (
            <CircularSlider
              mode={'Off'}
              minimumValue={50}
              maximumValue={310}
              humidity={humidity}
              currentTemp={currentTemp}
              layoutWidth={width}
              fahrenheit={fahrenheit}
              width={width * 0.8}
              height={width * 0.8}
              meterColor="#0cd"
              textColor="#000"
              textColorInnerCircle="#FFF"
            />
          );
        default:
      }
    } else if (selectedDevice.roomTemp && !power) {
      return (
        <CircularSlider
          mode={'Off'}
          minimumValue={50}
          maximumValue={310}
          currentTemp={currentTemp}
          layoutWidth={width}
          width={width * 0.8}
          height={width * 0.8}
          fahrenheit={fahrenheit}
          meterColor="#0cd"
          textColor="#000"
          textColorInnerCircle="#FFF"
        />
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={{zIndex: 0}}>
        <View style={styles.headerContainer}>
          <View style={styles.headerDivision}>
            <TouchableOpacity
              style={styles.headerBackButton}
              onPress={() => {
                updateThermostatSelected({data: true});
                onBack();
              }}>
              <BoschIcon
                name={Icons.backLeft}
                size={24}
                style={styles.marginHorizontal10}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.headerTitle}>
            <Text
              style={{
                fontSize: 21,
                marginVertical: 10,
              }}>
              {navigation.getParam('deviceName')}
            </Text>
          </View>
          <HomeOwnerNotificationButton navigation={navigation} landing={true} />
        </View>
        <Image
          style={styles.headerRibbon}
          source={require('../assets/images/header_ribbon.png')}
        />
      </View>
      <View style={styles.screenContainer}>
        <View>
          <View style={styles.tabContainer}>
            {bcc50IsOff === false && (
              <>
                <Pressable
                  accessible={true}
                  accessibilityLabel={'Home tab.'}
                  accessibilityHint={
                    'Activate it to navigate to home tab and manage the setpoints, thermostat mode, fan mode, and accessories.'
                  }
                  style={[
                    styles.tabElement,
                    {
                      borderBottomWidth: currentTab == 0 ? 2 : 0,
                      borderBottomColor: currentTab == 0 ? Colors.darkBlue : '',
                      width: '26%',
                    },
                  ]}
                  onPress={() => setCurrentTab(0)}>
                  <View style={styles.alignSelfCenter}>
                    <HOME fill={currentTab == 0 ? '#004975' : '#000'} />
                  </View>

                  <CustomText
                    allowFontScaling={true}
                    text={'Home'}
                    size={16}
                    color={currentTab == 0 ? Colors.darkBlue : Colors.black}
                  />
                </Pressable>

                <Pressable
                  accessible={true}
                  accessibilityLabel={
                    Dictionary.bccDashboard.schedule.scheduleTab
                  }
                  accessibilityRole={'menuitem'}
                  accessibilityHint={
                    Dictionary.bccDashboard.schedule.scheduleTabHint
                  }
                  style={[
                    styles.tabElement,
                    {
                      borderBottomWidth: currentTab == 1 ? 2 : 0,
                      borderBottomColor: currentTab == 1 ? Colors.darkBlue : '',
                      width: '34%',
                    },
                  ]}
                  onPress={() => setCurrentTab(1)}>
                  <View style={styles.alignSelfCenter}>
                    <SCHEDULE fill={currentTab == 1 ? '#004975' : '#000'} />
                  </View>

                  <CustomText
                    allowFontScaling={true}
                    text={'Schedule'}
                    size={16}
                    color={currentTab == 1 ? Colors.darkBlue : Colors.black}
                  />
                </Pressable>
              </>
            )}
            <Pressable
              accessible={true}
              accessibilityLabel={Dictionary.bccDashboard.settingTab}
              accessibilityRole={'menuitem'}
              accessibilityHint={Dictionary.bccDashboard.settingTabHint}
              style={[
                styles.tabElement,
                {
                  borderBottomWidth: currentTab == 2 ? 2 : 0,
                  borderBottomColor: currentTab == 2 ? Colors.darkBlue : '',
                  width: '31%',
                },
              ]}
              onPress={() => setCurrentTab(2)}>
              <View style={styles.alignSelfCenter}>
                <SETTINGS fill={currentTab == 2 ? '#004975' : '#000'} />
              </View>

              <CustomText
                allowFontScaling={true}
                text={'Settings'}
                size={16}
                color={currentTab == 2 ? Colors.darkBlue : Colors.black}
              />
            </Pressable>
          </View>

          {currentTab === 0 && (
            <View
              style={[
                styles.marginHorizontal16,
                {
                  height: '91%',
                  justifyContent: 'space-between',
                  paddingTop:
                    height <= 700
                      ? 0
                      : height > 700 && height <= 820
                      ? height * 0.03
                      : height > 820
                      ? height * 0.04
                      : 0,
                },
              ]}>
              {showDashboard ? (
                <BCCDashboardHome
                  pCool={pCooling}
                  pHeat={pHeating}
                  setHold={setHold}
                  hold={hold}
                  styles={styles}
                  width={width}
                  height={height}
                  currentTemp={currentTemp}
                  selectTemperature={selectTemperature}
                  selectedDevice={selectedDevice}
                  heatSelected={heatSelected}
                  heating={heating}
                  heatingTemp={heatingTemp}
                  coolSelected={coolSelected}
                  cooling={cooling}
                  coolingTemp={coolingTemp}
                  divisor={divisor}
                  plus={plus}
                  renderThermostatChart={renderThermostatChart}
                  updateTermperature={updateTermperature}
                  changedCooling={changedCooling}
                  changedHeating={changedHeating}
                  updatedSchedule={updatedSchedule}
                  cancelScheduleChange={cancelScheduleChange}
                  setUpdateSchedule={setUpdateSchedule}
                  setChangedCooling={setChangedCooling}
                  setChangedHeating={setChangedHeating}
                  isFahrenheit={selectedDevice.isFahrenheit}
                  temperatureLimits={temperatureLimits}
                  updateThermostatTemperature={updateThermostatTemperature}
                  currentCooling={currentCooling}
                  currentHeating={currentHeating}
                  setModeTemp={setModeTemp}
                  setHeating={setHeating}
                  setCooling={setCooling}
                  setCurrentHeating={setCurrentHeating}
                  setCurrentCooling={setCurrentCooling}
                  setHeatingTemp={setHeatingTemp}
                  setCoolingTemp={setCoolingTemp}
                  humidity={humidity}
                  updateLockDevice={updateLockDevice}
                  statusInterval={statusInterval}
                  createStatusInterval={createStatusInterval}
                  power={power}
                  setAuxHold={setAuxHold}
                  setUpdateInfo={setUpdateInfo}
                  returnAuxValue={returnAuxValue}
                  stopStatus={stopStatus}
                  mode={mode}
                  lockedDevice={lockedDevice}
                  setLockCode={setLockCode}
                  setLockedDevice={setLockedDevice}
                  is24hrs={is24hrs}
                  isOnSchedule={isOnSchedule}
                />
              ) : (
                <View></View>
              )}
              <View style={[styles.buttonsSection]}>
                <View style={styles.flexDirectionRow}>
                  <Pressable
                    accessible={true}
                    accessibilityLabel={`${
                      Dictionary.bccDashboard.changeMode
                    } ${
                      selectedDevice.acceleratedHeating
                        ? Dictionary.bccDashboard.acceleratedHeating
                        : selectModeName()
                    }. ${
                      stage !== '' && stage != '0'
                        ? 'Current Staging: ' + stage
                        : ' '
                    }`}
                    accessibilityHint={Dictionary.bccDashboard.changeModeHint}
                    onPress={() => {
                      clearInterval(statusIntervalAux.current);
                      setUpdateInfo(false);
                      setChangedCooling(false);
                      setChangedHeating(false);
                      setUpdateSchedule(false);
                      setCurrentCooling(-1);
                      setCurrentHeating(-1);
                      navigation.navigate('ModeSelection', {
                        stopStatus: stopStatus,
                        createStatusInterval: createStatusInterval,
                        setAuxHold: setAuxHold,
                        setUpdateInfo: setUpdateInfo,
                        power: power,
                        statusInterval: statusIntervalAux.current,
                        setMode: setMode,
                        turnOnDevice: turnOnDevice,
                        heatType: heatType,
                      });
                    }}
                    style={styles.bottomButton}>
                    {renderThermostatIcon()}
                    {stage !== '' && stage != '0' && (
                      <CustomText
                        color={
                          selectedDevice.mode === 2 || selectedDevice.mode === 4
                            ? Colors.metalicRed
                            : Colors.mediumBlue
                        }
                        style={styles.stageStyle}
                        text={stage}
                      />
                    )}
                  </Pressable>
                  <Pressable
                    accessible={true}
                    accessibilityLabel={
                      Dictionary.bccDashboard.changeFanModeLabel
                    }
                    accessibilityHint={`${
                      Dictionary.bccDashboard.changeFanModeHint1
                    } Current fan mode: ${
                      selectedDevice.fanMode === '0'
                        ? 'Auto'
                        : selectedDevice.fanMode === '1'
                        ? 'Always on'
                        : 'Circulation'
                    }`}
                    onPress={() => {
                      clearInterval(statusIntervalAux.current);
                      navigation.navigate('FanSelection', {
                        createStatusInterval: createStatusInterval,
                        setUpdateInfo: setUpdateInfo,
                        stopStatus: stopStatus,
                      });
                    }}
                    style={styles.bottomButton}>
                    {selectedDevice.fanMode !== undefined
                      ? renderFanIcon()
                      : null}
                    {selectedDevice.fanStatus != undefined
                      ? fanStatus === '1' && (
                          <View style={styles.connectedFan}></View>
                        )
                      : null}
                  </Pressable>
                  <Pressable
                    style={styles.bottomButton}
                    accessible={true}
                    accessibilityLabel={Dictionary.Accesories.Accesory}
                    accessibilityHint={Dictionary.Accesories.AccesoryHint}
                    onPress={() => {
                      createStatusInterval();
                      /*setTimeout(() => {
                        createStatusInterval();
                      }, 3000);*/
                      navigation.navigate('Accesories', {
                        selectedDevice: selectedDevice,
                        createStatusInterval: createStatusInterval,
                        setUpdateInfo: setUpdateInfo,
                        updateInfo: updateInfo,
                        statusInterval: statusIntervalAux.current,
                      });
                    }}>
                    <DROP fill="#000" />
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          {currentTab === 1 && bcc50IsOff === false && (
            <BCCDashboardSchedule
              navigation={navigation}
              isFahrenheit={selectedDevice.isFahrenheit}
              selectedDevice={selectedDevice}
              schedules={schedules}
              isReusable={false}
              createStatusInterval={createStatusInterval}
              setUpdateInfo={setUpdateInfo}
              isOnSchedule={isOnSchedule}
              setIsOnSchedule={setIsOnSchedule}
              stopStatus={stopStatus}
              setSchedules={setSchedules}
              setGetStatusAfterChanged={setGetStatusAfterChanged}
            />
          )}
          {currentTab === 2 && bcc50IsOff === false && (
            <BCCDashboardSettings
              interval={statusIntervalAux.current}
              createStatusInterval={createStatusInterval}
              navigation={navigation}
              selectedDevice={selectedDevice}
              setAuxHold={setAuxHold}
              setUpdateInfo={setUpdateInfo}
              lockedDevice={lockedDevice}
              setLockedDevice={setLockedDevice}
              setLockCode={setLockCode}
              lockCode={lockCode}
              is24hrs={is24hrs}
              setIs24hrs={setIs24hrs}
              stopStatus={stopStatus}
            />
          )}
          {currentTab === 2 && bcc50IsOff && (
            <BCCDashboardSettingsWIFI
              interval={statusIntervalAux.current}
              createStatusInterval={createStatusInterval}
              navigation={navigation}
              selectedDevice={selectedDevice}
              setAuxHold={setAuxHold}
              setUpdateInfo={setUpdateInfo}
              lockedDevice={lockedDevice}
              setLockedDevice={setLockedDevice}
              setLockCode={setLockCode}
              lockCode={lockCode}
              is24hrs={is24hrs}
              setIs24hrs={setIs24hrs}
              stopStatus={stopStatus}
            />
          )}
        </View>
      </View>
      <ModalComponent
        modalVisible={notAvailableModal}
        closeModal={() => setNotAvailableModal(false)}>
        <View style={[styles.width97Percent, styles.justifyContentCenter]}>
          <Image style={styles.checkWifiImage} source={ALERT_ICON} />
          <CustomText
            style={styles.marginTop37}
            align="left"
            text={Dictionary.tile.checkWifi}
          />
          <Button
            style={styles.marginTop49}
            type="primary"
            text={'Close'}
            onPress={() => {
              navigation.navigate('HomeTabs', {offlineDevice: true});
              setNotAvailableModal(false);
            }}
          />
        </View>
      </ModalComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  justifyContentCenter: {justifyContent: 'center'},
  width97Percent: {width: '100%'},
  checkWifiImage: {alignSelf: 'center', marginTop: 12},
  marginTop37: {marginTop: 37},
  marginTop49: {marginTop: 49},
  minusIconStyle: {marginRight: 100, paddingVertical: 12},
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#A8ADB2',
    justifyContent: 'space-between',
    height: 63,
    marginHorizontal: 16,
    //borderWidth: 1,
  },
  marginHorizontal16: {
    marginHorizontal: 16,
  },
  scheduleSection: {
    marginTop: 17,
    borderTopWidth: 1,
    borderBottomWidth: 1,

    width: '100%',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 12,
    borderTopColor: '#C1C7CC',
    borderBottomColor: '#C1C7CC',
  },
  tabElement: {
    paddingHorizontal: 0,
    justifyContent: 'center',
    marginHorizontal: 5,

    //borderWidth: 1,
  },
  headerContainer: {
    backgroundColor: '#ffff',
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  headerTitle: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 24,
  },
  headerRibbon: {height: 8, width: '100%'},
  confirmationPageContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  marginHorizontal10: {marginHorizontal: 10},
  emHeatIcon: {
    marginHorizontal: 3,
  },
  offThermostatIcon: {
    height: 18,
    width: 18,
    marginHorizontal: 3,
  },
  scheduleChangeConfirmation: {
    width: '100%',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 12,
    borderTopColor: '#C1C7CC',
    borderBottomColor: '#C1C7CC',
    alignItems: 'center',
    marginTop: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  controlsSection: {flexDirection: 'row', alignItems: 'center', marginTop: 5},
  buttonsSection: {
    alignItems: 'center',
    marginBottom: 26,
  },
  flexDirectionRow: {flexDirection: 'row'},
  bottomButton: {
    backgroundColor: '#E0E2E5',
    paddingHorizontal: width * 0.11,
    paddingVertical: 13,
    marginHorizontal: width * 0.02,
  },
  connectedFan: {
    position: 'absolute',
    left: 63,
    top: 30,
    borderRadius: 50,
    height: 10,
    width: 10,
    backgroundColor: '#4CD964',
  },
  stageStyle: {position: 'absolute', left: 70, top: 22},
  alignItemsCenter: {alignItems: 'center'},
  alignSelfCenter: {alignSelf: 'center'},
});

const mapStateToProps = state => {
  return {
    selectedDevice: state.homeOwner.selectedDevice,
    vibration: state.homeOwner.hapticVibration,
    previousBcc: state.homeOwner.previousBcc,
    scheduleUpdate: state.homeOwner.scheduleUpdate,
  };
};

const mapDispatchToProps = {
  setSelectedDevice,
  updateThermostatTemperature,
  getScheduleList,
  getDeviceStatus,
  updateLockDevice,
  updateThermostatSelected,
  updateSelected,
  getDeviceStatusWithNoLoadingScreen,
  prevBcc,
  setisOnboardingBcc101,
  getDeviceStatusWhenChangingSchedule,
};

export default connect(mapStateToProps, mapDispatchToProps)(BCCDashboard);

/*<View style={{position: 'absolute'}}>
                <View
                  style={{
                    position: 'absolute',
                    width: 6,
                    height: 4,
                    backgroundColor: 'gray',
                    top: 220,
                  }}></View>
                <CustomText //heating
                  text={`${Math.floor((heating - 30) / divisor + plus)}°`}
                  size={21}
                  color={heatSelected ? '#C20B1E' : 'gray'}
                  font={'bold'}
                  style={{position: 'absolute', top: 204, left: -40}}
                />
                <CustomText //cooling
                  text={`${Math.floor((cooling - 30) / divisor + plus)}°`}
                  size={21}
                  color={coolSelected ? '#00629A' : 'gray'}
                  font={'bold'}
                  style={{position: 'absolute', top: 204, left: 17}}
                />
                </View>*/
