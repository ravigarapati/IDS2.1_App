import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {Icons} from '../../utils/icons';
import {BoschIcon, Button} from '../../components';
import {Colors, Typography} from '../../styles';
import {Dictionary} from '../../utils/dictionary';
import {connect} from 'react-redux';
import {useDispatch} from 'react-redux';
import {
  exitCom,
  getInitConf,
  saveBCC50,
  setSchedule,
} from '../../store/actions/HomeOwnerActions';
import {getAccessToken} from '../../store/actions/CommonActions';
import Ping from 'react-native-ping';
import { showToast } from '../../components/CustomToast';
import { addEventListener, useNetInfo } from '@react-native-community/netinfo';

type ReviewAddUnitProps = {
  date?: any;
  time?: any;
  schedule?: any;
  navigation: any;
  dateBCC50: any;
  timeBCC50: any;
  scheduleBCC50Response: any;
  scheduleSelectedBCC50: any;
  selectedDevice: any;
  infoUnitConfiguration: any;
  schedulesOnBoarding: any;
  selectedSchedule: any;
  locationOnboarding: any;
  nameDeviceOnboarding: any;
  user: any;
  BCC50macID: any;
};

const ReviewAddUnit = ({
  date,
  time,
  schedule,
  navigation,
  dateBCC50,
  timeBCC50,
  scheduleBCC50Response,
  scheduleSelectedBCC50,
  selectedDevice,
  infoUnitConfiguration,
  schedulesOnBoarding,
  selectedSchedule,
  locationOnboarding,
  nameDeviceOnboarding,
  user,
  BCC50macID,
}: ReviewAddUnitProps) => {
  const dispatch = useDispatch();

  const [scheduleSelectedName, setScheduleSelectedName] = useState('');
  const [isDataSentToDevice, setIsDataSentToDevice] = useState(false)
  const options = [
    /*{
      icon: require('../../assets/images/BCC50Thermostat512.png'),
      name: 'Device Location',
      hint: 'Where is the device location',
      subtitle: 'Bedroom',
    },*/
    {
      icon: require('../../assets/images/SunIce512.png'),
      name: 'Unit Configuration',
      hint: 'Configuration for the heat pump',
      subtitle:
        infoUnitConfiguration.type == 0
          ? 'Fossil Fuel'
          : infoUnitConfiguration.type == 1
          ? 'Electric'
          : infoUnitConfiguration.type == 2
          ? 'Heat Pump'
          : infoUnitConfiguration.type == 3
          ? 'No Heat'
          : infoUnitConfiguration.type == 4
          ? 'Dual Fuel'
          : '',
    },
    {
      icon: require('../../assets/images/Calendar512.png'),
      name: 'Date Time',
      hint: 'The time is',
      subtitle: dateBCC50 + ', ' + timeBCC50,
    },
    {
      icon: require('../../assets/images/CalendarClock512.png'),
      name: 'Schedule',
      hint: 'The current schedule mode is',
      subtitle:
        scheduleSelectedBCC50 === '' ? 'No Schedule' : scheduleSelectedBCC50,
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'SHOW_LOADING',
      data: false,
    });
    verifyScheduleSelectedName();
  }, []);

  const netInfo = useNetInfo()

  useEffect(() => {
    if(netInfo.isConnected==true && netInfo.isInternetReachable==true && isDataSentToDevice==true){
      sendDataToEndPoint()
    }
  }, [netInfo])

  const verifyScheduleSelectedName = () => {
    schedulesOnBoarding.forEach(item => {
      if (item.model_id == selectedSchedule) {
        setScheduleSelectedName(item.name);
      } else if (selectedSchedule == '0') {
        setScheduleSelectedName('No Schedule');
      }
    });
  };

  const parseTemp = (temp, index) =>
    parseInt(temp.split('-')[index]).toFixed(0);

  const sendDataToDevice = async () => {
    let sch = {
      exist: false,
      schl: {},
    };

    schedulesOnBoarding.forEach(item => {
      delete item.data.unit;
    });
    // getInitConf(infoUnitConfiguration);
    if (selectedSchedule != '0') {
      let schedule = {};
      schedulesOnBoarding.forEach(item => {
        if (item.model_id == selectedSchedule) {
          schedule.scheduleName = item.name;
          schedule.mode = 3;
          let schN = [];
          Object.keys(item.data).forEach(key => {
            let day = {};
            day.numberProg = item.data[key].length;
            let programs = [];
            item.data[key].forEach(s => {
              let program = {
                heat: parseTemp(s.t, 0) * 10,
                cool: parseTemp(s.t, 1) * 10,
                time: parseInt(s.h),
              };
              programs.push(program);
            });
            day.programs = programs;
            schN.push(day);
          });
          schedule.schN = schN;
        }
      });
      sch.exist = true;
      sch.schl = schedule;
      //setSchedule(schedule);
    }

    dispatch({
      type: 'SHOW_LOADING',
      data: true,
    });
    getInitConf(infoUnitConfiguration, sch, async res => {
      if (res) {
        setIsDataSentToDevice(true)
      }
    })
  };

  const sendDataToEndPoint = async()=>{

    if(!netInfo.isConnected==true && !netInfo.isInternetReachable==true)
    {
      showToast("No Internet Connection")
      return
    }

    let objToEndPoint = {}

    schedulesOnBoarding.forEach(item => {
      item.data.unit = 'F';
    });

    if(Object.keys(locationOnboarding.placeid).length === 0){
      objToEndPoint = {
        deviceId: BCC50macID,
        userId: user.attributes.sub,
        city: locationOnboarding.city,
        state: locationOnboarding.state,
        zipcode: locationOnboarding.zipcode,
        country: locationOnboarding.country,
        deviceName: nameDeviceOnboarding,
        schedules: schedulesOnBoarding,
      };
    }
    else{
      objToEndPoint = {
        deviceId: BCC50macID,
        userId: user.attributes.sub,
        city: locationOnboarding.city,
        state: locationOnboarding.placeid.TimeZoneData.Region,
        zipcode: locationOnboarding.zipcode,
        country: locationOnboarding.country,
        placeId: locationOnboarding.placeid.TimeZoneData,
        deviceName: nameDeviceOnboarding,
        schedules: schedulesOnBoarding,
      };
      objToEndPoint.placeId.zone = locationOnboarding.placeid.zone;
      objToEndPoint.placeId.location = locationOnboarding.placeid.location;
    }
    
    dispatch(
      saveBCC50(objToEndPoint, res => {
        if (res) {
          navigation.navigate('HomeTabs');
        }
        else{
          dispatch({
            type: 'SHOW_LOADING',
            data: false,
          });
        }
      }),
    );
  }

  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  } 

  return (
    <View style={styles.mainContainer}>
      <Image
        style={{height: 8, width: '100%'}}
        source={require('./../../assets/images/header_ribbon.png')}
      />
      {options.map((o, index) => {
        return (
          <View
            style={styles.optionView}
            key={index}
            accessibilityHint={o.hint}
            accessible={true}
            accessibilityLabel={`${o.name}. ${
              index != 3
                ? o.subtitle
                : scheduleSelectedName
            }`}>
            <Image source={o.icon} style={styles.image} />
            <Text style={styles.title}>{o.name}</Text>
            <View style={styles.optionSelectedView}>
              <Text style={styles.optionSelected}>
                {index != 2
                  ? o.subtitle
                  : selectedSchedule === '0'
                  ? 'No Schedule'
                  : scheduleSelectedName}
              </Text>
            </View>
          </View>
        );
      })}
      <View
        style={styles.buttonView}
        accessibilityHint="Button to complete the BCC50 configuration">
        <Button
          testID="completeButton"
          text={Dictionary.review.complete}
          type="primary"
          onPress={!isDataSentToDevice?sendDataToDevice:sendDataToEndPoint}
        />
      </View>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    dateBCC50: state.homeOwner.dateBCC50,
    timeBCC50: state.homeOwner.timeBCC50,
    scheduleBCC50Response: state.homeOwner.scheduleBCC50Response,
    scheduleSelectedBCC50: state.homeOwner.scheduleSelectedBCC50,
    selectedDevice: state.homeOwner.selectedDevice,
    infoUnitConfiguration: state.homeOwner.infoUnitConfiguration,
    schedulesOnBoarding: state.homeOwner.schedulesOnBoarding,
    selectedSchedule: state.homeOwner.selectedSchedule,
    locationOnboarding: state.homeOwner.locationOnboarding,
    nameDeviceOnboarding: state.homeOwner.nameDeviceOnboarding,
    user: state.auth.user,
    BCC50macID: state.homeOwner.BCC50macID,
  };
};

const mapDispatchToProps = {
  saveBCC50,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewAddUnit);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  optionView: {
    flexDirection: 'row',
    width: '100%',
    height: 64,
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomColor: Colors.greyInputDisabled,
    borderBottomWidth: 1,
  },
  image: {
    height: 24,
    width: 24,
  },
  title: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: 16,
    paddingLeft: 16,
  },
  optionSelectedView: {
    flex: 1,
  },
  optionSelected: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: 16,
    alignSelf: 'flex-end',
  },
  buttonView: {
    flex: 1,
    flexDirection: 'column-reverse',
    paddingHorizontal: 15,
    paddingBottom: 32,
  },
});
