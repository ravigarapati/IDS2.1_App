import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  AccessibilityActionEvent,
} from 'react-native';
import {Button, CustomWheelPickerColums} from '../../components';
import DateTime from '../DateTime';
import {CustomText, ModalComponent} from '../../components';
import SwitchToggle from 'react-native-switch-toggle';
import {Colors} from '../../styles';
import {Dictionary} from '../../utils/dictionary';
import {connect, useDispatch} from 'react-redux';
import {
  getInitConf,
  saveDateBCC50Schedule,
  saveTimeBCC50Schedule,
  updateUnitConfiguration,
} from '../../store/actions/HomeOwnerActions';
import { CustomWheelPick } from '../../components/CustomWheelPick';
import CLOCK from '../../assets/images/clock.svg';
import DATE from '../../assets/images/calendar.svg';
import moment from 'moment';

const DateAndTime = ({
  navigation,
  dateBCC50,
  timeBCC50,
  infoUnitConfiguration,
}) => {
  const dispatch = useDispatch();
  const [isEnabled24hrs, setIsEnabled24hrs] = useState(
    parseInt(infoUnitConfiguration.hours1224) == 1 ? true : false,
  );
  const [isEnableAuto, setIsEnableAuto] = useState(true);

  const [minutes, setMinutes] = useState(
    Array.from({length: 60}, (_, x) => `${x < 10 ? '0' + x : x}`),
  );
  const [hours12, setHours12] = useState(
    Array.from({length: 12}, (_, x) => `${x < 9 ? '0' + (x + 1) : x + 1}`),
  );
  const [hours24, setHours24] = useState(
    Array.from({length: 24}, (_, x) => `${x < 10 ? '0' + x : x}`),
  );


  const toggleSwitch24hrs = () => {
    setIsEnabled24hrs(!isEnabled24hrs);
    dispatch(
      updateUnitConfiguration({
        name: 'hours1224',
        value: !isEnabled24hrs ? 1 : 0,
      }),
    );
    let convDate = convert1224Hrs(timeBCC50, !isEnabled24hrs);
    dispatch(saveTimeBCC50Schedule(convDate));
  };

  const toggleSwitchAuto = () => {
    setIsEnableAuto(!isEnableAuto);
  };

  useEffect(() => {
    if(isEnableAuto)
    {
      const [datecalc, timecalc, convDatecalc, dateFormatedcalc] =calculateAutomaticTime();
      dispatch(saveTimeBCC50Schedule(convDatecalc));
      dispatch(saveDateBCC50Schedule(dateFormatedcalc));
    }
  }, [isEnableAuto]);


  const saveAndNavigate = () => {
    let date = '';
    date = dateBCC50.split(' ');
    let month = date[0];

    if (month == 'January') {
      month = 1;
    }
    if (month == 'February') {
      month = 2;
    }
    if (month == 'March') {
      month = 3;
    }
    if (month == 'April') {
      month = 4;
    }
    if (month == 'May') {
      month = 5;
    }
    if (month == 'June') {
      month = 6;
    }
    if (month == 'July') {
      month = 7;
    }
    if (month == 'August') {
      month = 8;
    }
    if (month == 'September') {
      month = 9;
    }
    if (month == 'October') {
      month = 10;
    }
    if (month == 'November') {
      month = 11;
    }
    if (month == 'December') {
      month = 12;
    }

    const day = parseInt(date[1]);

    const year = date[2].substring(2);

    let time1 = [];
    let time2 = [];
    let hour = 0;
    let minutes = 0;

    if (!isEnabled24hrs) {
      time1 = timeBCC50.split(' ');
      time2 = time1[0].split(':');
      if (time1[1] == 'PM') {
        hour = parseInt(time2[0]) + 12;
        minutes = parseInt(time2[1]);
      } else {
        hour = parseInt(time2[0]);
        minutes = parseInt(time2[1]);
      }
    } else {
      time1 = timeBCC50.split(':');
      hour = parseInt(time1[0]);
      minutes = parseInt(time1[1]);
    }


    dispatch(
      updateUnitConfiguration({
        name: 'dateTime',
        value: {
          anio: parseInt(year),
          month: month,
          day: day,
          hour: hour,
          minute: minutes,
          second: 0,
        },
      }),
    );
    navigation.navigate('Schedule');
  };


  function calculateAutomaticTime() {
    let dateAutomatically = '';
    let timeAutomatically = '';
    let convDateAutomatically = '';
    let dateFormatedAutomatically = '';

    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    let DateNow =''
    if(month < 10){
      DateNow=`${year}-0${month}-${day}`
    }else{
      DateNow=`${year}-${month}-${day}`
    }

    let d = new Date();
    let TimeNow = d.toLocaleTimeString();


      const [datel, timel, convDate, dateFormated] = adaptingDateTimeFormats(
        DateNow,
        TimeNow,
        /*
        Formato
        2024-02-28
        14:45:21
        */
      );
      dateAutomatically = datel;
      timeAutomatically = timel;
      convDateAutomatically = convDate;
      dateFormatedAutomatically = dateFormated;

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
    let convDate = convert1224Hrs(timeAda, isEnabled24hrs);
    return [dateAda, timeAda, convDate, dateFormated];
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
      } else {
        timetoReturn = hoursSplit.toString() + ':' + minutesSplit + ' AM';
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


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'space-between',
      }}>
      <Image
        style={{height: 8, width: '100%'}}
        source={require('./../../assets/images/header_ribbon.png')}
      />
      <ScrollView>
        <View style={styles.dateContainer}>
          <CustomText
          allowFontScaling={true}
            color={Colors.black}
            font={'bold'}
            text={Dictionary.DateTime.dateTime}
            align={'center'}
            size={18}
          />

          <CustomText
          allowFontScaling={true}
            style={{marginTop: 16, paddingHorizontal: 20}}
            color={Colors.black}
            font={'medium'}
            text={Dictionary.DateTime.initialText}
            align={'center'}
            size={16}
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
          style={styles.switchAndTextView}>
          <CustomText
          allowFontScaling={true}
            style={styles.customText}
            color={Colors.black}
            font={'medium'}
            text={Dictionary.DateTime.time}
            align={'center'}
            size={16}
          />
          <SwitchToggle
            testID="24hrSwitch"
            switchOn={isEnabled24hrs}
            onPress={() => toggleSwitch24hrs()}
            circleColorOff="#FFFFFF"
            circleColorOn="#FFFFFF"
            backgroundColorOn="#00629A"
            backgroundColorOff="#C1C7CC"
            containerStyle={styles.switchContainerStyle}
            circleStyle={styles.switchCircleStyle}
          />
        </View>
        {
          <View
            style={styles.switchAndTextView2}
            accessible={true}
            accessibilityLabel="Set automatically."
            accessibilityRole={'switch'}
            accessibilityHint={
              'Activate to enable of disable the auto time mode on the thermostat. Current mode: ' +
              (isEnableAuto ? 'Auto.' : 'Manual.')
            }
            accessibilityActions={[{name: 'activate'}]}
            onAccessibilityAction={(event: AccessibilityActionEvent) => {
              switch (event.nativeEvent.actionName) {
                case 'activate':
                  toggleSwitchAuto();
                  break;
              }
            }}>
            <CustomText
            allowFontScaling={true}
              style={styles.customText}
              color={Colors.black}
              font={'medium'}
              text={Dictionary.DateTime.automatically}
              align={'center'}
              size={16}
            />
            <SwitchToggle
              testID="automaticallySwitch"
              switchOn={isEnableAuto}
              onPress={() => toggleSwitchAuto()}
              circleColorOff="#FFFFFF"
              circleColorOn="#FFFFFF"
              backgroundColorOn="#00629A"
              backgroundColorOff="#C1C7CC"
              containerStyle={styles.switchContainerStyle2}
              circleStyle={styles.switchCircleStyle2}
            />
          </View>
        }

        <View style={{marginTop: 25, marginHorizontal: 16}}>
          <CustomWheelPick
            type={'date'}
            formatTime12Hrs={true}
            placeholder={'Date'}
            isSvgIcon={true}
            value={dateBCC50}
            icon={<DATE fill="#000" />}
            disabled={isEnableAuto}
            edit={dateBCC50 !== ''}
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
              if (dateToSend.includes('/')) {
                let auxDate = dateToSend.split('/');
                dateToSend = '20' + auxDate[2] + '-' + auxDate[0] + '-' + auxDate[1];
              }
              const [datel, timel, convDate, dateFormated] = adaptingDateTimeFormats(dateToSend,timeBCC50)
              dispatch(saveDateBCC50Schedule(dateFormated));
            }}
          />
        </View>

        <View style={{marginTop: 25, marginHorizontal: 16}}>
          <CustomWheelPick
            type={'hour'}
            formatTime12Hrs={!isEnabled24hrs}
            placeholder={'Time'}
            isSvgIcon={true}
            value={timeBCC50}
            icon={<CLOCK fill="#000" />}
            disabled={isEnableAuto}
            edit={timeBCC50 !== ''}
            onConfirm={res => {
              const dateLabel = new Date(dateBCC50).toLocaleDateString('sv');
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
              if (!isEnabled24hrs) {
                if (isAMPM === 1) {
                  dispatch(saveTimeBCC50Schedule(datetime + ' AM'));
                } else {
                  dispatch(saveTimeBCC50Schedule(datetime + ' PM'));
                }
              }
              else{
                dispatch(saveTimeBCC50Schedule(datetime));
              }

            }}
          />
        </View>
        <View style={styles.viewFooter}>
          <View style={styles.imageView}>
            <Image
              style={styles.dateImage}
              source={require('../../assets/images/infoBlue.png')}
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
        <View style={styles.viewButton}>
          <Button
            testID="buttonNext"
            text={Dictionary.DateTime.next}
            type="primary"
            accessibilityLabelText="Next button"
            accessibilityHintText="Click for go to shedule settings"
            onPress={saveAndNavigate}
            disabled={dateBCC50 === '' || (timeBCC50 === '' && true)}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    dateBCC50: state.homeOwner.dateBCC50,
    timeBCC50: state.homeOwner.timeBCC50,
    infoUnitConfiguration: state.homeOwner.infoUnitConfiguration,
  };
};

export default connect(mapStateToProps, null)(DateAndTime);

const styles = StyleSheet.create({
  dateTimeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  dateImage: {},
  dateContainer: {
    marginTop: 24,
    alignItems: 'center',
    paddingBottom: 40,
  },
  switchAndTextView: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '95%',
    alignSelf: 'center',
    borderBottomColor: '#BFC0C2',
    borderTopColor: '#BFC0C2',
  },
  customText: {
    paddingLeft: 15,
    height: 45,
    marginTop: 16,
  },
  switchContainerStyle: {
    marginTop: 16,
    width: 48,
    height: 24,
    borderRadius: 25,
    padding: 5,
    marginHorizontal: 1,
    marginRight: 15,
  },
  switchCircleStyle: {
    width: 12,
    height: 12,
    borderRadius: 20,
  },
  switchAndTextView2: {
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '95%',
    alignSelf: 'center',
    borderBottomColor: '#BFC0C2',
    borderTopColor: '#BFC0C2',
  },
  switchContainerStyle2: {
    marginTop: 16,
    width: 48,
    height: 24,
    borderRadius: 25,
    padding: 5,
    marginHorizontal: 1,
    marginRight: 15,
  },
  switchCircleStyle2: {
    width: 12,
    height: 12,
    borderRadius: 20,
  },
  viewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: 32,
  },
  imageView: {
    paddingRight: 14,
    paddingBottom: 10,
  },
  viewButton: {
    paddingTop: 10,
    paddingHorizontal: 15,
    flexDirection: 'column-reverse',
    paddingBottom: 32,
  },
});
