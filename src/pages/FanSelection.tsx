import React, {useEffect, useState} from 'react';
import {View, ScrollView, Image, StyleSheet, Text} from 'react-native';
import {Enum} from '../utils/enum';
import Option from '../components/Option';
import {Dictionary} from '../utils/dictionary';
import {Colors} from '../styles';
import CustomText from '../components/CustomText';
import {BoschIcon, Button} from '../components';
import {connect} from 'react-redux';
import {updateFanMode} from '../store/actions/HomeOwnerActions';
import moment from 'moment';

import FAN from '../assets/images/fan.svg';
import FAN_ALWAYS from '../assets/images/fan-frame.svg';
import FAN_CIRCULATION from '../assets/images/fan-arrows.svg';
import CustomWheelPicker from '../components/CustomWheelPicker';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Icons} from '../utils/icons';
import CLOCK from '../assets/images/clock.svg';
import {CustomWheelPick} from '../components/CustomWheelPick';

const fanMode = [
  {id: 0, name: 'Auto', description: 'Auto'},
  {id: 1, name: 'Always On', description: 'Always On'},
  {id: 2, name: 'Circulation', description: 'Circulation'},
];

const circulationFanMode = [
  {id: 3, name: 'No Schedule', description: 'No Schedule'},
  {id: 4, name: 'Schedule', description: 'Schedule'},
];

const FanSelection = ({
  navigation,
  selectedDevice,
  circulationModeIsScheduled,
  updateFanMode,
}) => {
  const [currentMode, setCurrentMode] = useState<any>('');
  const [isScheduled, setIsScheduled] = useState<any>(3);
  const [wasChanged, setWasChanged] = useState(false);
  const [wasChangedScheduled, setwasChangedScheduled] = useState(false);
  const [accesibilityMode, setAccesibilityMode] = useState('');
  const [accesibilityIsSchduled, setAccesibilityIsScheduled] = useState('');
  const timestamp = new Date().valueOf().toString();
  const [is24HoursSelected, setIs24HoursSelected] = useState(true);
  const [hourIndicator, setHourIndicator] = useState(['AM', 'PM']);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [minutes, setMinutes] = useState([
    '10',
    '20',
    '30',
    '40',
    '50',
    '60',
    '70',
    '80',
    '90',
    '100',
    '110',
    '120',
  ]);
  const [start_t, setStart_t] = useState(0);
  const [end_t, setEnd_t] = useState(0);
  const [onFor, setOnFor] = useState('');
  const [offFor, setOffFor] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [startTime1, setStartTime1] = useState(
    selectedDevice.d_hour === '0'
      ? [
          '12:00 AM',
          '12:30 AM',
          '01:00 AM',
          '01:30 AM',
          '02:00 AM',
          '02:30 AM',
          '03:00 AM',
          '03:30 AM',
          '04:00 AM',
          '04:30 AM',
          '05:00 AM',
          '05:30 AM',
          '06:00 AM',
          '06:30 AM',
          '07:00 AM',
          '07:30 AM',
          '08:00 AM',
          '08:30 AM',
          '09:00 AM',
          '09:30 AM',
          '10:00 AM',
          '10:30 AM',
          '11:00 AM',
          '11:30 AM',
          '12:00 PM',
          '12:30 PM',
          '01:00 PM',
          '01:30 PM',
          '02:00 PM',
          '02:30 PM',
          '03:00 PM',
          '03:30 PM',
          '04:00 PM',
          '04:30 PM',
          '05:00 PM',
          '05:30 PM',
          '06:00 PM',
          '06:30 PM',
          '07:00 PM',
          '07:30 PM',
          '08:00 PM',
          '08:30 PM',
          '09:00 PM',
          '09:30 PM',
          '10:00 PM',
          '10:30 PM',
          '11:00 PM',
          '11:30 PM',
        ]
      : [
          '00:00',
          '00:30',
          '01:00',
          '01:30',
          '02:00',
          '02:30',
          '03:00',
          '03:30',
          '04:00',
          '04:30',
          '05:00',
          '05:30',
          '06:00',
          '06:30',
          '07:00',
          '07:30',
          '08:00',
          '08:30',
          '09:00',
          '09:30',
          '10:00',
          '10:30',
          '11:00',
          '11:30',
          '12:00',
          '12:30',
          '13:00',
          '13:30',
          '14:00',
          '14:30',
          '15:00',
          '15:30',
          '16:00',
          '16:30',
          '17:00',
          '17:30',
          '18:00',
          '18:30',
          '19:00',
          '19:30',
          '20:00',
          '20:30',
          '21:00',
          '21:30',
          '22:00',
          '22:30',
          '23:00',
          '23:30',
        ],
  );

  const [allTimes, setAllTimes] = useState(
    selectedDevice.d_hour === '0'
      ? [
          '12:00 AM',
          '12:30 AM',
          '01:00 AM',
          '01:30 AM',
          '02:00 AM',
          '02:30 AM',
          '03:00 AM',
          '03:30 AM',
          '04:00 AM',
          '04:30 AM',
          '05:00 AM',
          '05:30 AM',
          '06:00 AM',
          '06:30 AM',
          '07:00 AM',
          '07:30 AM',
          '08:00 AM',
          '08:30 AM',
          '09:00 AM',
          '09:30 AM',
          '10:00 AM',
          '10:30 AM',
          '11:00 AM',
          '11:30 AM',
          '12:00 PM',
          '12:30 PM',
          '01:00 PM',
          '01:30 PM',
          '02:00 PM',
          '02:30 PM',
          '03:00 PM',
          '03:30 PM',
          '04:00 PM',
          '04:30 PM',
          '05:00 PM',
          '05:30 PM',
          '06:00 PM',
          '06:30 PM',
          '07:00 PM',
          '07:30 PM',
          '08:00 PM',
          '08:30 PM',
          '09:00 PM',
          '09:30 PM',
          '10:00 PM',
          '10:30 PM',
          '11:00 PM',
          '11:30 PM',
          '12:00 AM',
        ]
      : [
          '00:00',
          '00:30',
          '01:00',
          '01:30',
          '02:00',
          '02:30',
          '03:00',
          '03:30',
          '04:00',
          '04:30',
          '05:00',
          '05:30',
          '06:00',
          '06:30',
          '07:00',
          '07:30',
          '08:00',
          '08:30',
          '09:00',
          '09:30',
          '10:00',
          '10:30',
          '11:00',
          '11:30',
          '12:00',
          '12:30',
          '13:00',
          '13:30',
          '14:00',
          '14:30',
          '15:00',
          '15:30',
          '16:00',
          '16:30',
          '17:00',
          '17:30',
          '18:00',
          '18:30',
          '19:00',
          '19:30',
          '20:00',
          '20:30',
          '21:00',
          '21:30',
          '22:00',
          '22:30',
          '23:00',
          '23:30',
          '24:00',
        ],
  );

  const [endTime1, setEndTime1] = useState(
    selectedDevice.d_hour === '0'
      ? [
          '12:30 AM',
          '01:00 AM',
          '01:30 AM',
          '02:00 AM',
          '02:30 AM',
          '03:00 AM',
          '03:30 AM',
          '04:00 AM',
          '04:30 AM',
          '05:00 AM',
          '05:30 AM',
          '06:00 AM',
          '06:30 AM',
          '07:00 AM',
          '07:30 AM',
          '08:00 AM',
          '08:30 AM',
          '09:00 AM',
          '09:30 AM',
          '10:00 AM',
          '10:30 AM',
          '11:00 AM',
          '11:30 AM',
          '12:00 PM',
          '12:30 PM',
          '01:00 PM',
          '01:30 PM',
          '02:00 PM',
          '02:30 PM',
          '03:00 PM',
          '03:30 PM',
          '04:00 PM',
          '04:30 PM',
          '05:00 PM',
          '05:30 PM',
          '06:00 PM',
          '06:30 PM',
          '07:00 PM',
          '07:30 PM',
          '08:00 PM',
          '08:30 PM',
          '09:00 PM',
          '09:30 PM',
          '10:00 PM',
          '10:30 PM',
          '11:00 PM',
          '11:30 PM',
          '12:00 AM',
        ]
      : [
          '00:30',
          '01:00',
          '01:30',
          '02:00',
          '02:30',
          '03:00',
          '03:30',
          '04:00',
          '04:30',
          '05:00',
          '05:30',
          '06:00',
          '06:30',
          '07:00',
          '07:30',
          '08:00',
          '08:30',
          '09:00',
          '09:30',
          '10:00',
          '10:30',
          '11:00',
          '11:30',
          '12:00',
          '12:30',
          '13:00',
          '13:30',
          '14:00',
          '14:30',
          '15:00',
          '15:30',
          '16:00',
          '16:30',
          '17:00',
          '17:30',
          '18:00',
          '18:30',
          '19:00',
          '19:30',
          '20:00',
          '20:30',
          '21:00',
          '21:30',
          '22:00',
          '22:30',
          '23:00',
          '23:30',
          '24:00',
        ],
  );

  const DefaultStartTime1 =
    selectedDevice.d_hour === '0'
      ? [
          '12:00 AM',
          '12:30 AM',
          '01:00 AM',
          '01:30 AM',
          '02:00 AM',
          '02:30 AM',
          '03:00 AM',
          '03:30 AM',
          '04:00 AM',
          '04:30 AM',
          '05:00 AM',
          '05:30 AM',
          '06:00 AM',
          '06:30 AM',
          '07:00 AM',
          '07:30 AM',
          '08:00 AM',
          '08:30 AM',
          '09:00 AM',
          '09:30 AM',
          '10:00 AM',
          '10:30 AM',
          '11:00 AM',
          '11:30 AM',
          '12:00 PM',
          '12:30 PM',
          '01:00 PM',
          '01:30 PM',
          '02:00 PM',
          '02:30 PM',
          '03:00 PM',
          '03:30 PM',
          '04:00 PM',
          '04:30 PM',
          '05:00 PM',
          '05:30 PM',
          '06:00 PM',
          '06:30 PM',
          '07:00 PM',
          '07:30 PM',
          '08:00 PM',
          '08:30 PM',
          '09:00 PM',
          '09:30 PM',
          '10:00 PM',
          '10:30 PM',
          '11:00 PM',
          '11:30 PM',
        ]
      : [
          '00:00',
          '00:30',
          '01:00',
          '01:30',
          '02:00',
          '02:30',
          '03:00',
          '03:30',
          '04:00',
          '04:30',
          '05:00',
          '05:30',
          '06:00',
          '06:30',
          '07:00',
          '07:30',
          '08:00',
          '08:30',
          '09:00',
          '09:30',
          '10:00',
          '10:30',
          '11:00',
          '11:30',
          '12:00',
          '12:30',
          '13:00',
          '13:30',
          '14:00',
          '14:30',
          '15:00',
          '15:30',
          '16:00',
          '16:30',
          '17:00',
          '17:30',
          '18:00',
          '18:30',
          '19:00',
          '19:30',
          '20:00',
          '20:30',
          '21:00',
          '21:30',
          '22:00',
          '22:30',
          '23:00',
          '23:30',
        ];

  const enabledButton = () => {
    if (currentMode.toString() !== '2' && (wasChanged || wasChangedScheduled)) {
      return false;
    } else if (
      currentMode.toString() === '2' &&
      (wasChanged || wasChangedScheduled) &&
      onFor !== '' &&
      offFor !== '' &&
      isScheduled === 3
    ) {
      return false;
    } else if (
      currentMode.toString() === '2' &&
      (wasChanged || wasChangedScheduled) &&
      onFor !== '' &&
      offFor !== '' &&
      isScheduled === 4 &&
      startTime !== '' &&
      endTime !== ''
    ) {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    if (currentMode.toString() === '0') {
      setAccesibilityMode('Auto');
    } else if (currentMode.toString() === '1') {
      setAccesibilityMode('Always On');
    } else if (currentMode.toString() === '2') {
      setAccesibilityMode('Circulation');
    } else {
      setAccesibilityIsScheduled('Nothing selected');
    }
  }, [currentMode]);

  useEffect(() => {
    if (isScheduled.toString() === '3') {
      setAccesibilityIsScheduled('No Schedule');
    } else if (isScheduled.toString() === '4') {
      setAccesibilityIsScheduled('Schedule');
    } else {
      setAccesibilityIsScheduled('Nothing selected');
    }
  }, [isScheduled]);

  useEffect(() => {
    selectedDevice.fanMode !== '' &&
      setCurrentMode(parseInt(selectedDevice.fanMode));
    setIs24HoursSelected(selectedDevice.d_hour === '0' ? false : true);
    circulationModeIsScheduled !== '' &&
      setIsScheduled(
        circulationModeIsScheduled === '1'
          ? 3
          : circulationModeIsScheduled === '0'
          ? 4
          : 3,
      );

    if (selectedDevice.fanMode === '2') {
      setOffFor(selectedDevice.fanOffFor);
      setOnFor(selectedDevice.fanOnFor);
      setIsScheduled(selectedDevice.fanIsScheduled === '0' ? 4 : 3);
      if (selectedDevice.fanIsScheduled === '0') {
        setStartTime(
          selectedDevice.fanScheduledStart
            ? convertMinutesToString(selectedDevice.fanScheduledStart)
            : '',
        );
        let aux = convertMinutesToString(
          selectedDevice.fanScheduledStart,
        ).split(':');
        let endIndex = 0;
        allTimes.forEach((e, i) => {
          let a = e.split(':');
          if (a[0] == aux[0] && a[1][0] == aux[1][0]) {
            endIndex = i;
          }
        });
        setEndTime1(allTimes.slice(endIndex + 1, allTimes.length));

        setEndTime(
          selectedDevice.fanScheduledEnd
            ? convertMinutesToString(selectedDevice.fanScheduledEnd)
            : '',
        );

        let auxEnd = convertMinutesToString(
          selectedDevice.fanScheduledEnd,
        ).split(':');
        let startIndex = 0;
        allTimes.forEach((e, i) => {
          let a = e.split(':');
          if (a[0] == auxEnd[0] && a[1][0] == auxEnd[1][0]) {
            startIndex = i;
          }
        });

        setStartTime1(allTimes.slice(0, startIndex));
      }

      setStart_t(
        convertStringToMinutes(
          convertMinutesToString(selectedDevice.fanScheduledStart),
        ),
      );
      setEnd_t(
        convertStringToMinutes(
          convertMinutesToString(selectedDevice.fanScheduledEnd),
        ),
      );
    } else {
      setIsScheduled(3);
      setOnFor('');
      setOffFor('');
    }
  }, []);

  const renderFanIcon = (fan: any) => {
    switch (fan.description) {
      case 'Auto':
        return <FAN fill="#000" />;

      case 'Always On':
        return <FAN_ALWAYS fill="#000" />;

      case 'Circulation':
        return <FAN_CIRCULATION fill="#000" />;
      default:
    }
  };

  const convertStringToMinutes = hour => {
    let finalHour =
      selectedDevice.d_hour === '0'
        ? moment(hour, ['h:mm A']).format('HH:mm')
        : hour;
    let auxHour = parseInt(finalHour.split(':')[0]) * 60;
    let auxMin = parseInt(finalHour.split(':')[1]);
    return auxHour + auxMin;
  };

  const convertMinutesToString = minutes => {
    let minutesInt = parseInt(minutes);
    let hour = Math.floor(minutesInt / 60);
    hour = selectedDevice.d_hour === '0' ? hour % 12 || 12 : hour;
    let minute = minutesInt % 60;
    let hourFormat = minutesInt >= 720 ? 'PM' : 'AM';
    let finalResult = `${hour < 10 ? '0' + hour : hour}:${
      minute === 0 ? '00' : minute
    } ${selectedDevice.d_hour === '0' ? hourFormat : ''}`;
    return finalResult;
  };

  const onBack = () => {
    navigation.state.params.createStatusInterval();
    navigation.navigate('BCCDashboard');
  };
  return (
    <View style={{flex: 1}}>
      <View>
        <View style={styles.headerContainer}>
          <View style={styles.headerDivision}>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="back."
              accessibilityHint="Activate to go back to the BCC Dashboard screen."
              accessibilityRole="button"
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
            <Text
              style={{
                fontSize: 21,
                marginVertical: 10,
              }}>
              Fan
            </Text>
          </View>
        </View>
        <Image
          style={styles.headerRibbon}
          source={require('../assets/images/header_ribbon.png')}
        />
      </View>
      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{justifyContent: 'space-between', flexGrow: 1}}>
        <View>
          {fanMode.map(fan => {
            return (
              <Option
                key={fan.id}
                option={fan}
                setWasChanged={setWasChanged}
                setCurrent={setCurrentMode}
                renderIcon={() => renderFanIcon(fan)}
                currentSelected={currentMode}
                disable={false}
                enableHint={Dictionary.fanSelection.disabledMode}
                disableHint={`${Dictionary.fanSelection.activate1} ${fan.name} ${Dictionary.fanSelection.activate2} ${accesibilityMode}`}
                borderBottomColorIsDisabled={
                  fan.name === 'Circulation' && currentMode == '2' && true
                }
              />
            );
          })}
          {currentMode == '2' ? (
            <>
              <View style={styles.customContainer}>
                <CustomWheelPick
                  type={'picker'}
                  accessibilityLabelText={
                    onFor != ''
                      ? 'on for: ' + onFor + ' min'
                      : 'Currently not minutes selected.'
                  }
                  accessibilityHintText={
                    'Sets for how many minutes the device will be on.'
                  }
                  edit={onFor !== ''}
                  pickerWidth={'100%'}
                  placeholder={'On For'}
                  value={onFor != '' ? onFor + ' min' : ''}
                  isRequiredField={true}
                  values={minutes}
                  defaultIndex={0}
                  defaultValue={minutes[0]}
                  isSvgIcon={true}
                  icon={<CLOCK fill="#000" />}
                  accessibilityWheelPickerValue={[
                    'the amount of minutes the fan will be on.',
                  ]}
                  defaultValueZero={true}
                  onConfirm={selected => {
                    setWasChanged(true);
                    //setOnFor(minutes[selected['0']]);
                    setOnFor(minutes[selected ? selected['0'] : 0]);
                  }}
                  testID="Timer"
                />
              </View>
              <View style={styles.customContainer2}>
                <CustomWheelPick
                  type={'picker'}
                  accessibilityHintText={
                    'Sets for how many minutes the device will be off.'
                  }
                  edit={offFor !== ''}
                  pickerWidth={'100%'}
                  placeholder={'Off For'}
                  value={offFor != '' ? offFor + ' min' : ''}
                  isRequiredField={true}
                  values={minutes}
                  defaultIndex={0}
                  defaultValue={minutes[0]}
                  isSvgIcon={true}
                  icon={<CLOCK fill="#000" />}
                  accessibilityWheelPickerValue={[
                    'the amount of minutes the fan will be off.',
                  ]}
                  defaultValueZero={true}
                  onConfirm={selected => {
                    setWasChanged(true);
                    //setOffFor(minutes[selected['0']]);
                    setOffFor(minutes[selected ? selected['0'] : 0]);
                  }}
                  testID="Minutes"
                />
              </View>

              <View style={styles.customTextContainer}>
                <CustomText
                  allowFontScaling={true}
                  text={Dictionary.fanSelection.duration}
                  size={18}
                  font={'bold'}
                  align={'left'}
                />
              </View>

              {circulationFanMode.map(circulationFan => {
                return (
                  <Option
                    key={circulationFan.id}
                    option={circulationFan}
                    setWasChanged={setwasChangedScheduled}
                    setCurrent={setIsScheduled}
                    renderIcon={() => renderFanIcon(circulationFan)}
                    currentSelected={isScheduled}
                    disable={false}
                    enableHint={Dictionary.fanSelection.disabledMode}
                    disableHint={`${Dictionary.fanSelection.activate1} ${circulationFan.name} ${Dictionary.fanSelection.activate2} ${accesibilityIsSchduled}`}
                    borderBottomColorIsDisabled={
                      circulationFan.name === 'Schedule' &&
                      isScheduled == '4' &&
                      true
                    }
                  />
                );
              })}

              {isScheduled == '4' ? (
                <>
                  <View style={{marginHorizontal: 16}}>
                    <View style={{marginVertical: 16}}>
                      <CustomWheelPick
                        type={'picker'}
                        formatTime12Hrs={true}
                        placeholder={'Start Time'}
                        isSvgIcon={true}
                        value={startTime}
                        icon={<CLOCK fill="#000" />}
                        disabled={false}
                        edit={startTime !== ''}
                        defaultIndex={0}
                        defaultValue={startTime1[0]}
                        values={startTime1}
                        onConfirm={res => {
                          console.log('res', res);
                          setWasChanged(true);
                          //setStartTime(startTime1[selected['0']]);
                          setStartTime(startTime1[res ? res['0'] : 0]);
                          setStart_t(
                            // convertStringToMinutes(startTime1[selected['0']]),
                            convertStringToMinutes(
                              startTime1[res ? res['0'] : 0],
                            ),
                          );
                          //const newEndMin = startTime1[selected['0']];
                          const newEndMin = startTime1[res ? res['0'] : 0];
                          const newEndMinIndex = allTimes.indexOf(newEndMin);
                          setEndTime1(
                            allTimes.slice(newEndMinIndex + 1, allTimes.length),
                          );
                        }}
                      />

                      {/*<CustomWheelPicker
                        accessibilityHintText={'Start Time'}
                        edit={startTime !== ''}
                        pickerWidth={'100%'}
                        placeholder={'Start Time'}
                        value={startTime}
                        isRequiredField={true}
                        values={[startTime1]}
                        defaultValue={0}
                        isSvgIcon={true}
                        icon={<CLOCK fill="#000" />}
                        accessibilityWheelPickerValue={[
                          'the hour the fan will be turned on.',
                        ]}
                        defaultValueZero={true}
                        onConfirm={selected => {
                          console.log('selected', selected);
                          setWasChanged(true);
                          //setStartTime(startTime1[selected['0']]);
                          setStartTime(
                            startTime1[selected ? selected['0'] : 0],
                          );
                          setStart_t(
                            // convertStringToMinutes(startTime1[selected['0']]),
                            convertStringToMinutes(
                              startTime1[selected ? selected['0'] : 0],
                            ),
                          );
                          //const newEndMin = startTime1[selected['0']];
                          const newEndMin =
                            startTime1[selected ? selected['0'] : 0];
                          const newEndMinIndex = allTimes.indexOf(newEndMin);
                          setEndTime1(
                            allTimes.slice(newEndMinIndex + 1, allTimes.length),
                          );
                        }}
                        testID="HoursStartTime"
                      />*/}
                    </View>

                    <CustomWheelPick
                      type={'picker'}
                      formatTime12Hrs={true}
                      placeholder={'End Time'}
                      isSvgIcon={true}
                      value={endTime}
                      icon={<CLOCK fill="#000" />}
                      disabled={false}
                      defaultIndex={0}
                      edit={endTime !== ''}
                      values={endTime1}
                      defaultValue={endTime1[0]}
                      onConfirm={res => {
                        console.log('res', res);

                        setWasChanged(true);
                        setEnd_t(
                          //convertStringToMinutes(endTime1[selected['0']]),
                          convertStringToMinutes(endTime1[res ? res['0'] : 0]),
                        );
                        //setEndTime(endTime1[selected['0']]);
                        //const newStartMax = endTime1[selected['0']];
                        setEndTime(endTime1[res ? res['0'] : 0]);
                        const newStartMax = endTime1[res ? res['0'] : 0];
                        const newStartMaxIndex = allTimes.indexOf(newStartMax);
                        if (selectedDevice.d_hour === '0') {
                          if (newStartMaxIndex == 0) {
                            setStartTime1(DefaultStartTime1);
                          } else {
                            setStartTime1(allTimes.slice(0, newStartMaxIndex));
                          }
                        } else {
                          setStartTime1(allTimes.slice(0, newStartMaxIndex));
                        }
                      }}
                    />

                    {/*<CustomWheelPicker
                      accessibilityHintText={'End Time'}
                      edit={endTime !== ''}
                      pickerWidth={'100%'}
                      placeholder={'End Time'}
                      value={endTime}
                      isRequiredField={true}
                      values={[endTime1]}
                      defaultValue={0}
                      isSvgIcon={true}
                      icon={<CLOCK fill="#000" />}
                      accessibilityWheelPickerValue={[
                        'the hour the fan will be turned off.',
                      ]}
                      defaultValueZero={true}
                      onConfirm={selected => {
                        console.log('selected', selected);
                        setWasChanged(true);
                        setEnd_t(
                          //convertStringToMinutes(endTime1[selected['0']]),
                          convertStringToMinutes(
                            endTime1[selected ? selected['0'] : 0],
                          ),
                        );
                        //setEndTime(endTime1[selected['0']]);
                        //const newStartMax = endTime1[selected['0']];
                        setEndTime(endTime1[selected ? selected['0'] : 0]);
                        const newStartMax =
                          endTime1[selected ? selected['0'] : 0];
                        const newStartMaxIndex = allTimes.indexOf(newStartMax);
                        if (selectedDevice.d_hour === '0') {
                          if (newStartMaxIndex == 0) {
                            setStartTime1(DefaultStartTime1);
                          } else {
                            setStartTime1(allTimes.slice(0, newStartMaxIndex));
                          }
                        } else {
                          setStartTime1(allTimes.slice(0, newStartMaxIndex));
                        }
                      }}
                      testID="HoursEndTime"
                    />*/}
                  </View>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
        </View>

        <View>
          <View style={styles.buttonSubmitContainer}>
            <Button
              text={'Submit'}
              type={'primary'}
              disabled={enabledButton()}
              accessibilityLabelText={Dictionary.fanSelection.submitButton}
              accessibilityHintText={Dictionary.fanSelection.pressToSubmit}
              onPress={() => {
                navigation.state.params.setUpdateInfo(false);
                navigation.state.params.createStatusInterval();
                navigation.state.params.stopStatus();
                /*setTimeout(() => {
                  navigation.state.params.createStatusInterval();
                }, 3000);*/
                navigation.navigate('BCCDashboard');
                if (currentMode.toString() === '0') {
                  updateFanMode({
                    device_id: selectedDevice.macId,
                    fan: currentMode.toString(),
                    timestamp: timestamp,
                  });
                } else if (currentMode.toString() === '1') {
                  updateFanMode({
                    device_id: selectedDevice.macId,
                    fan: currentMode.toString(),
                    timestamp: timestamp,
                  });
                } else if (
                  currentMode.toString() === '2' &&
                  isScheduled.toString() === '3'
                ) {
                  updateFanMode({
                    device_id: selectedDevice.macId,
                    fan: currentMode.toString(),
                    timestamp: timestamp,
                    f_on_t: onFor,
                    f_off_t: offFor,
                    f_cir_mode: '1',
                  });
                } else if (
                  currentMode.toString() === '2' &&
                  isScheduled.toString() === '4'
                ) {
                  updateFanMode({
                    device_id: selectedDevice.macId,
                    fan: currentMode.toString(),
                    timestamp: timestamp,
                    f_on_t: onFor,
                    f_off_t: offFor,
                    f_cir_mode: '0',
                    start_t: start_t.toString(),
                    end_t: end_t.toString(),
                  });
                }
              }}
              testID="Submit"
            />
          </View>
          <View style={styles.buttonCancelContainer}>
            <Button
              text={'Cancel'}
              type={'secondary'}
              accessibilityLabelText={Dictionary.fanSelection.cancelButton}
              accessibilityHintText={Dictionary.fanSelection.pressToCancel}
              onPress={() => {
                navigation.state.params.createStatusInterval();
                navigation.navigate('BCCDashboard');
              }}
              testID="CancelButton"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    selectedDevice: state.homeOwner.selectedDevice,
    circulationModeIsScheduled: state.homeOwner.fanIsScheduled,
  };
};

const mapDispatchToProps = {
  updateFanMode,
};

export default connect(mapStateToProps, mapDispatchToProps)(FanSelection);

const styles = StyleSheet.create({
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
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  customContainer: {
    marginHorizontal: 15,
    paddingTop: 7,
  },
  customContainer2: {
    marginHorizontal: 15,
    paddingTop: 16,
  },
  customTextContainer: {
    paddingTop: 24,
    paddingLeft: 16,
    paddingBottom: 17,
    borderBottomWidth: 1,
    borderBottomColor: '#bfc0c2',
  },
  buttonSubmitContainer: {
    marginHorizontal: 15,
    marginTop: 43,
  },
  buttonCancelContainer: {
    marginHorizontal: 15,
    marginTop: 11,
    marginBottom: 32,
  },
});
