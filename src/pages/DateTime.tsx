import {
  View,
  StyleSheet,
  Image,
  AccessibilityActionEvent,
  ScrollView,
} from 'react-native';
import SwitchToggle from 'react-native-switch-toggle';
import {
  CustomText,
  CustomPickerColumns,
  Button,
  BoschIcon,
} from '../components';
import React, {useEffect, useRef, useState} from 'react';
import {Colors} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {connect} from 'react-redux';
import {
  getDeviceStatus,
  editDateTimeSettings,
  getLocationDateTime,
  editDateTimeHour,
  editDateTimeSettingsAuto,
} from '../store/actions/HomeOwnerActions';
import CLOCK from '../assets/images/clock.svg';
import DATE from '../assets/images/calendar.svg';
import {Icons} from '../utils/icons';
import DATETIME_SETTINGS from '../assets/images/DateTimeSettings.svg';
import {TouchableOpacity} from 'react-native';
import {CustomWheelPick} from '../components/CustomWheelPick';
import moment from 'moment';

const DateTime = ({
  selectedDevice,
  getDeviceStatus,
  editDateTimeSettings,
  getLocationDateTime,
  editDateTimeHour,
  editDateTimeSettingsAuto,
  navigation,
  //isButtonEnable,
}) => {
  const [isEnabled24hrs, setIsEnabled24hrs] = useState(false);
  const [isEnabledAuto, setIsEnabledAuto] = useState(true);
  const [dateLabel, setDateLabel] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [AMPM, setAMPM] = useState(0);
  const [AMPM2, setAMPM2] = useState(0);
  const [timeZone, setTimeZone] = useState('');
  const [firstTime, setFirstTime] = useState(true);
  const fieldsUpdated = useRef(true);
  const update24 = useRef(false);
  const updateAuto = useRef(false);
  const updateTime = useRef(false);
  const timeoutRef = useRef(null);

  const [minutes, setMinutes] = useState(
    Array.from({length: 60}, (_, x) => `${x < 10 ? '0' + x : x}`),
  );
  const [hours12, setHours12] = useState(
    Array.from({length: 12}, (_, x) => `${x < 9 ? '0' + (x + 1) : x + 1}`),
  );
  const [hours24, setHours24] = useState(
    Array.from({length: 24}, (_, x) => `${x < 10 ? '0' + x : x}`),
  );
  const [hourFormat, setHourFormat] = useState(['AM', 'PM']);

  let stopStatus = () => {
    clearTimeout(timeoutRef.current);
    fieldsUpdated.current = false;
    timeoutRef.current = setTimeout(() => {
      fieldsUpdated.current = true;
    }, 14000);
  };

  const convert1224Hrs = (timeF, is2412) => {
    let timeSplit = timeF.toString().split(':');
    let hoursSplit = timeSplit[0];
    let minutesSplit = timeSplit[1];
    let timetoReturn = '';
    let strPM = timeF.toString().slice(-2);
    //24hrs
    if (is2412) {
      let hour = 0;
      if (Number(hoursSplit) < 12 && strPM === 'PM') {
        hour = Number(hoursSplit) + 12;
        timetoReturn =
          hour.toString() + ':' + minutesSplit.toString().substring(0, 2);
      } else {
        hour = Number(hoursSplit);
        timetoReturn =
          hour.toString() + ':' + minutesSplit.toString().substring(0, 2);
      }
    }
    //12hrs
    else {
      let hour = 0;
      if (parseInt(hoursSplit) >= 12) {
        hour = parseInt(hoursSplit) == 12 ? 12 : parseInt(hoursSplit) - 12;
        timetoReturn =
          (parseInt(hoursSplit) !== 12 && parseInt(hoursSplit) - 12 < 10
            ? '0'
            : '') +
          hour.toString() +
          ':' +
          minutesSplit +
          ' PM';
        setAMPM(0);
        setAMPM2(0);
      } else {
        timetoReturn = hoursSplit.toString() + ':' + minutesSplit + ' AM';
        setAMPM(1);
        setAMPM2(1);
      }
    }
    if (timetoReturn.includes('PM') || timetoReturn.includes('AM')) {
      if (
        timetoReturn.split(':')[0] &&
        parseInt(timetoReturn.split(':')[0]) < 10 &&
        !timetoReturn.split(':')[0].includes('0')
      ) {
        timetoReturn = '0' + timetoReturn;
      }
    }
    return timetoReturn;
  };

  const toggleSwitch24hrs = () => {
    update24.current = true;
    stopStatus();
    navigation.state.params.stopStatus();
    navigation.state.params.setIs24hrs(!isEnabled24hrs);
    navigation.state.params.setUpdateInfo(false);
    navigation.state.params.createStatusInterval();
    /*setTimeout(() => {
      navigation.state.params.createStatusInterval();
    }, 3000);*/
    setIsEnabled24hrs(previousState => !previousState);
    let is24 = !isEnabled24hrs;
    let convDate = convert1224Hrs(time, is24);
    setTime(convDate);
    saveDataDate(
      dateLabel,
      convDate,
      !isEnabled24hrs,
      isEnabledAuto,
      undefined,
    );
    setTimeout(() => {
      saveDataDate(
        dateLabel,
        convDate,
        !isEnabled24hrs,
        isEnabledAuto,
        undefined,
      );
    }, 2000);
  };
  const toggleSwitchAuto = () => {
    updateAuto.current = true;
    stopStatus();
    navigation.state.params.stopStatus();
    navigation.state.params.setUpdateInfo(false);
    navigation.state.params.createStatusInterval();
    /*setTimeout(() => {
      navigation.state.params.createStatusInterval();
    }, 3000);*/
    setIsEnabledAuto(previousState => !previousState);
    let auto = !isEnabledAuto;
    //if (auto) {
    const [datecalc, timecalc, convDatecalc, dateFormatedcalc] =
      calculateAutomaticTime();
    setTime(timecalc);
    setDate(dateFormatedcalc);
    setTime(convDatecalc);
    setDateLabel(datecalc);
    saveDataDate(
      datecalc,
      convDatecalc,
      isEnabled24hrs,
      !isEnabledAuto,
      undefined,
    );
  };
  const [notAvailableModal, setNotAvailableModal] = useState(false);

  function calculateAutomaticTime() {
    let timeZoneLocal = '';
    let dateAutomatically = '';
    let timeAutomatically = '';
    let convDateAutomatically = '';
    let dateFormatedAutomatically = '';

    if (selectedDevice.DateTime_TimeZone != undefined) {
      timeZoneLocal = selectedDevice.DateTime_TimeZone;
      let timeZoneSelected = timeZoneLocal;
      var Moment = require('moment-timezone');
      let stringTimeZone = Moment().tz(timeZoneSelected).format().split('T');
      let stringTimeZoneTime = stringTimeZone[1].toString().substring(0, 8);
      const [datel, timel, convDate, dateFormated] = adaptingDateTimeFormats(
        stringTimeZone[0],
        stringTimeZoneTime,
      );
      dateAutomatically = datel;
      timeAutomatically = timel;
      convDateAutomatically = convDate;
      dateFormatedAutomatically = dateFormated;
    }
    return [
      dateAutomatically,
      timeAutomatically,
      convDateAutomatically,
      dateFormatedAutomatically,
    ];
  }

  const adaptingDateTimeFormats = (dateAda, timeAda) => {
    let dateSplit = dateAda.toString().split('-');
    let dateFormated =
      Dictionary.PickerCollections.Months[Number(dateSplit[1]) - 1] +
      ' ' +
      dateSplit[2] +
      ' ' +
      dateSplit[0];
    let is24 = selectedDevice.d_hour === '0' ? false : true;
    let convDate = convert1224Hrs(timeAda, is24);
    return [dateAda, timeAda, convDate, dateFormated];
  };

  const selectedDeviceUpdateMethod = () => {
    let dateAuto = '';
    let timeAuto = '';
    let convDateAuto = '';
    let dateFormatedAuto = '';

    setIsEnabled24hrs(selectedDevice.d_hour === '0' ? false : true);

    if (selectedDevice.auto_time === '1') {
      const [datecalc, timecalc, convDatecalc, dateFormatedcalc] =
        calculateAutomaticTime();
      dateAuto = datecalc;
      timeAuto = timecalc;
      convDateAuto = convDatecalc;
      dateFormatedAuto = dateFormatedcalc;
    } else {
      let localTime = selectedDevice.datetime.toString().split(' ');
      const [dateAd, timeAd, convDateAd, dateFormatedAd] =
        adaptingDateTimeFormats(
          localTime[0].toString(),
          localTime[1].toString(),
        );
      dateAuto = dateAd;
      timeAuto = timeAd;
      convDateAuto = convDateAd;
      dateFormatedAuto = dateFormatedAd;
    }

    setDateLabel(dateAuto);

    setIsEnabledAuto(selectedDevice.auto_time === '0' ? false : true);
    setTime(timeAuto);
    setDate(dateFormatedAuto);
    setTime(convDateAuto);

    let is24 = !isEnabled24hrs;
  };

  useEffect(() => {
    selectedDeviceUpdateMethod();
  }, []);

  useEffect(() => {
    if (fieldsUpdated.current) {
      selectedDeviceUpdateMethod();
    }
  }, [selectedDevice]);

  const saveDataDate = (date, hour, hr24, autoT, AM, hourChanged) => {
    navigation.state.params.setUpdateInfo(false);
    navigation.state.params.createStatusInterval();
    /*setTimeout(() => {
      navigation.state.params.createStatusInterval();
    }, 3000);*/
    //setTime(hour);
    if (date.includes('/')) {
      let auxDate = date.split('/');
      date = '20' + auxDate[2] + '-' + auxDate[0] + '-' + auxDate[1];
    }

    let newDateAux = date.split('-');
    if (newDateAux[2].length >= 3) {
      date = `${newDateAux[0]}-${newDateAux[1]}-${newDateAux[2].substr(1, 2)}`;
    }

    if (!isEnabled24hrs && updateTime.current && hourChanged) {
      if (AM === 1) {
        setTime(hour + ' AM');
      } else {
        setTime(hour + ' PM');
      }
    }

    setAMPM(AM);
    const [dateAd, timeAd, convDateAd, dateFormatedAd] =
      adaptingDateTimeFormats(date, hour);
    setDate(dateFormatedAd);

    let dateSave = '';
    let hourSave = hour.toString().split(':');

    if (AM === undefined) {
      let timeUnd = hour.toString().substring(0, 5);
      let timeSpl = timeUnd.toString().split(':');
      let hourUnd = timeSpl[0];
      let minUnd = timeSpl[1];
      let hourNum = 0;
      console.log(timeUnd);
      console.log(timeSpl);
      let AMUnd = hour.toString().slice(-2);
      if (AMUnd === 'PM') {
        hourNum = Number(hourUnd) + 12;
      } else if (AMUnd === 'AM') {
        hourNum = hourUnd;
      } else {
        hourNum = hourUnd;
      }
      hourSave = hourNum.toString() + ':' + minUnd + ':00';
      console.log('hour', hourSave);
    } else if (!hr24 && AM === 0) {
      let hourNum;
      if (Number(hourSave[0]) != 12) {
        hourNum = Number(hourSave[0]) + 12;
      } else {
        //if(Number(hourSave[0]) != 12){
        hourNum = Number(hourSave[0]);
        //}else{
        //  hor
        //}
      }

      hourSave = hourNum.toString() + ':' + hourSave[1] + ':00';
    } else {
      hourSave = hour.toString() + ':00';
    }
    dateSave = date.toString() + ' ' + hourSave.trim();
    if (updateTime.current) {
      updateTime.current = false;
      let aux = dateSave.split(' ');
      console.log('aux', aux);
      let aux2 = aux[1].split(':');
      if (aux2[0].length !== 2) {
        dateSave = aux[0] + (' 0' + aux2[0]) + ':' + aux2[1] + ':' + aux2[2];
      }
      editDateTimeSettings(
        {
          datetime: dateSave,
          //d_hour: hr24 ? 1 : 0,
          //auto_time: autoT ? 1 : 0,
        },
        selectedDevice.macId,
      );
    }

    if (updateAuto.current) {
      updateAuto.current = false;
      editDateTimeSettingsAuto(
        {
          //datetime: dateSave,
          // d_hour: hr24 ? 1 : 0,
          auto_time: autoT ? 1 : 0,
        },
        selectedDevice.macId,
      );
    }
    if (update24.current) {
      update24.current = false;
      editDateTimeHour(
        {
          // datetime: dateSave,
          d_hour: hr24 ? 1 : 0,
          //auto_time: autoT ? 1 : 0,
        },
        selectedDevice.macId,
      );
    }
  };

  const [isButtonEnable, setIsButtonEnable] = useState(true);

  const onBack = () => {
    clearTimeout(timeoutRef.current);
    navigation.goBack();
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.headerContainer}>
        <View style={styles.headerDivision}>
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={() => {
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
          <CustomText
            text={'Date & Time'}
            allowFontScaling={true}
            size={21}
            font="medium"
          />
        </View>
      </View>
      <Image
        style={{height: 8, width: '100%'}}
        source={require('../assets/images/header_ribbon.png')}
      />
      <ScrollView
        style={styles.dateTimeContainer}
        contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.dateContainer}>
          {false ? (
            <CustomText
              allowFontScaling={true}
              color={Colors.black}
              font={'bold'}
              text={Dictionary.DateTime.dateTime}
              align={'center'}
              size={18}
            />
          ) : (
            <DATETIME_SETTINGS fill="#000" />
          )}

          <CustomText
            allowFontScaling={true}
            style={{marginTop: 16, paddingHorizontal: 20}}
            color={Colors.black}
            font={'regular'}
            text={Dictionary.DateTime.initialText}
            align={'center'}
          />
        </View>
        <View
          accessible={true}
          accessibilityLabel="24 hours."
          accessibilityRole={'switch'}
          accessibilityHint={
            'Activate to enable of disable 24 hours mode on the thermostat. Current mode: ' +
            (isEnabled24hrs ? '24 hours.' : '12 hours.')
          }
          accessibilityActions={[{name: 'activate'}]}
          onAccessibilityAction={(event: AccessibilityActionEvent) => {
            switch (event.nativeEvent.actionName) {
              case 'activate':
                toggleSwitch24hrs();
                break;
            }
          }}
          style={{
            borderBottomWidth: 1,
            borderTopWidth: 1,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'flex-start',
            width: '95%',
            alignSelf: 'center',
            borderBottomColor: '#BFC0C2',
            borderTopColor: '#BFC0C2',
          }}>
          <CustomText
            allowFontScaling={true}
            style={{paddingLeft: 15, height: 45, marginTop: 16}}
            color={Colors.black}
            font={'medium'}
            text={Dictionary.DateTime.time}
            align={'center'}
            size={16}
          />
          <SwitchToggle
            switchOn={isEnabled24hrs}
            onPress={() => {
              toggleSwitch24hrs();
            }}
            // switchOn={true}
            // onPress={() => nothing()}
            circleColorOff="#FFFFFF"
            circleColorOn="#FFFFFF"
            backgroundColorOn="#00629A"
            backgroundColorOff="#C1C7CC"
            containerStyle={{
              marginTop: 16,
              width: 48,
              height: 24,
              borderRadius: 25,
              padding: 5,
              marginHorizontal: 1,
              marginRight: 15,
            }}
            circleStyle={{
              width: 12,
              height: 12,
              borderRadius: 20,
            }}
            testID="SwitchToogle24"
          />
        </View>
        <View
          accessible={true}
          accessibilityLabel="Set automatically."
          accessibilityRole={'switch'}
          accessibilityHint={
            'Activate to enable of disable the auto time mode on the thermostat. Current mode: ' +
            (isEnabledAuto ? 'Auto.' : 'Manual.')
          }
          accessibilityActions={[{name: 'activate'}]}
          onAccessibilityAction={(event: AccessibilityActionEvent) => {
            switch (event.nativeEvent.actionName) {
              case 'activate':
                toggleSwitchAuto();
                break;
            }
          }}
          style={{
            borderBottomWidth: 1,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'flex-start',
            width: '95%',
            alignSelf: 'center',
            borderBottomColor: '#BFC0C2',
            borderTopColor: '#BFC0C2',
          }}>
          <CustomText
            allowFontScaling={true}
            style={{height: 45, marginTop: 16, paddingLeft: 15}}
            color={Colors.black}
            font={'medium'}
            text={Dictionary.DateTime.automatically}
            align={'center'}
            size={16}
          />
          <SwitchToggle
            switchOn={isEnabledAuto}
            onPress={() => toggleSwitchAuto()}
            // switchOn={true}
            // onPress={() => nothing()}
            circleColorOff="#FFFFFF"
            circleColorOn="#FFFFFF"
            backgroundColorOn="#00629A"
            backgroundColorOff="#C1C7CC"
            containerStyle={{
              marginTop: 16,
              width: 48,
              height: 24,
              borderRadius: 25,
              padding: 5,
              marginHorizontal: 1,
              marginRight: 15,
            }}
            circleStyle={{
              width: 12,
              height: 12,
              borderRadius: 20,
            }}
          />
        </View>

        {/*<CustomPickerColumns
          selection={'Date'}
          icon={<DATE fill="#000" />}
          isSvgIcon={true}
          hrs24={isEnabled24hrs}
          label={date}
          selectedDevice={selectedDevice}
          auto_T={isEnabledAuto}
          timeLabel={time}
          dateLabel={dateLabel}
          save={(anio, timeLabel, hrs24, auto_T) => {
            updateTime.current = true;
            stopStatus();
            navigation.state.params.stopStatus();
            console.log('es esta', anio, timeLabel, hrs24, auto_T);
            console.log(
              'estos son los valores que se tienen',
              isEnabled24hrs,
              isEnabledAuto,
              time,
            );
            saveDataDate(anio, timeLabel, hrs24, auto_T, undefined, false);
          }}
          AMPM={AMPM}
          AutoEnabled={isEnabledAuto}
        />*/}
        <View style={{marginTop: 25, marginHorizontal: 16}}>
          <CustomWheelPick
            type={'date'}
            formatTime12Hrs={true}
            placeholder={'Date'}
            isSvgIcon={true}
            value={date}
            icon={<DATE fill="#000" />}
            disabled={isEnabledAuto}
            edit={date !== ''}
            onConfirm={res => {
              let dateToSend = '';
              if (res === '') {
                var d = new Date(res);
                dateToSend = moment(d).utcOffset(0).format('MM/DD/YY')
                /*newDate.getFullYear() +
                  '-' +
                  (Number(newDate.getMonth()) + 1 < 10
                    ? '0' + (Number(newDate.getMonth()) + 1)
                    : newDate.getMonth() + 1) +
                  '-' +
                  newDate.getDate();*/
              } else {
                var d = new Date(res);
                dateToSend = moment(d).utcOffset(0).format('MM/DD/YY')
              }
              updateTime.current = true;
              stopStatus();
              navigation.state.params.stopStatus();
              saveDataDate(
                dateToSend,
                time,
                isEnabled24hrs,
                isEnabledAuto,
                undefined,
                false,
              );
            }}
          />
        </View>

        <View style={{marginTop: 25, marginHorizontal: 16}}>
          <CustomWheelPick
            type={'hour'}
            formatTime12Hrs={!isEnabled24hrs}
            placeholder={'Time'}
            isSvgIcon={true}
            value={time}
            icon={<CLOCK fill="#000" />}
            disabled={isEnabledAuto}
            edit={time !== ''}
            onConfirm={res => {
              updateTime.current = true;
              stopStatus();
              navigation.state.params.stopStatus();

              const dateLabel = new Date(date).toLocaleDateString('sv');
              let isAMPM = 0;
              let datetime = '';
              if (isEnabled24hrs) {
                datetime = hours24[res[0]] + ':' + minutes[res[1]];
                if (res[0] >= 12) {
                  isAMPM = 0;
                } else {
                  isAMPM = 1;
                }
              } else {
                datetime = hours12[res[0]] + ':' + minutes[res[1]];
                isAMPM = res[2] !== undefined && res[2] === 0 ? 1 : 0;
              }
              if (!isEnabled24hrs && updateTime.current && true) {
                if (isAMPM === 1) {
                  setTime(datetime + ' AM');
                } else {
                  setTime(datetime + ' PM');
                }
              }
              setTime(datetime);

              saveDataDate(
                dateLabel,
                datetime,
                isEnabled24hrs,
                isEnabledAuto,
                isAMPM,
                true,
              );
            }}
          />
        </View>
        {/*<CustomPickerColumns
          selection={'Time'}
          icon={<CLOCK fill="#000" />}
          isSvgIcon={true}
          hrs24={isEnabled24hrs}
          label={time}
          selectedDevice={selectedDevice}
          auto_T={isEnabledAuto}
          timeLabel={time}
          dateLabel={dateLabel}
          save={(dateLabel, datetime, hrs24, auto_T, isAMPM) => {
            updateTime.current = true;
            stopStatus();
            navigation.state.params.stopStatus();
            setTime(datetime);
            if (!isEnabled24hrs && updateTime.current && true) {
              if (isAMPM === 1) {
                setTime(datetime + ' AM');
              } else {
                setTime(datetime + ' PM');
              }
            }
            console.log(
              'results',
              dateLabel,
              datetime,
              isEnabled24hrs,
              isEnabledAuto,
              isAMPM,
              true,
            );
            saveDataDate(dateLabel, datetime, hrs24, auto_T, isAMPM, true);
          }}
          AMPM={AMPM2}
          AutoEnabled={isEnabledAuto}
        />*/}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignContent: 'center',
            width: '90%',
            alignItems: 'center',
            alignSelf: 'center',
            paddingTop: 32,
          }}>
          <View
            style={{
              paddingRight: 10,
              paddingBottom: 10,
            }}>
            <BoschIcon
              size={20}
              name={Icons.infoTooltip}
              color={Colors.mediumBlue}
              accessibilityLabel={'Info'}
            />
          </View>

          <CustomText
            allowFontScaling={true}
            color={Colors.black}
            font={'medium'}
            text={Dictionary.DateTime.textSettingDate}
            align={'left'}
            size={12}
          />
        </View>

        {false && (
          <View
            style={{
              flex: 1,
              paddingHorizontal: 15,
              flexDirection: 'column-reverse',
              paddingBottom: 32,
            }}>
            <Button
              text={Dictionary.DateTime.next}
              type="primary"
              accessibilityLabelText="Next button"
              accessibilityHintText="Click for go to shedule settings"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  dateTimeContainer: {
    flex: 1,
    //justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  dateImage: {},
  dateContainer: {
    marginTop: 24,
    alignItems: 'center',
    paddingBottom: 40,
    //flex: 1,
    //justifyContent: 'space-between',
  },
  headerContainer: {
    backgroundColor: '#ffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 7,
    paddingTop: 7,
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
  marginHorizontal10: {marginHorizontal: 10},
});

const mapDispatchToProps = {
  getDeviceStatus,
  editDateTimeSettings,
  getLocationDateTime,
  editDateTimeHour,
  editDateTimeSettingsAuto,
};

const mapStateToProps = state => {
  return {
    selectedDevice: state.homeOwner.selectedDevice,
    _24HrsFormatSelected:
      state.homeOwner.selectedDevice.d_hour === '0' ? false : true,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DateTime);
