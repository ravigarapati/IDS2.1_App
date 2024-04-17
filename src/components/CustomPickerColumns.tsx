import {
  View,
  AccessibilityActionEvent,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import React, {useState, useEffect, memo} from 'react';
import {Colors} from '../styles';
import {CustomText, Button, ModalComponent, SwitchContent} from '../components';
import {Dictionary} from '../utils/dictionary';
import WheelPicker from 'react-native-wheely';
import {months} from 'moment';

type CustomPickerColumsProps = {
  selection: any;
  icon: any;
  hrs24: any;
  label: any;
  selectedDevice: any;
  auto_T: any;
  timeLabel: any;
  dateLabel: any;
  save: any;
  AMPM: any;
  AutoEnabled: any;
  isSvgIcon?: boolean;
};

function CustomPickerColumns({
  selection,
  icon,
  hrs24,
  label,
  selectedDevice,
  auto_T,
  timeLabel,
  dateLabel,
  save,
  AMPM,
  AutoEnabled,
  isSvgIcon = false,
}: CustomPickerColumsProps) {
  const [notAvailableModal, setNotAvailableModal] = useState(false);
  const [monthIndex, setMonthIndex] = useState(0);

  const [daySelected, setDaySelected] = useState(0);
  const [monthSelected, setMonthSelected] = useState(0);
  const [yearSelected, setYearSelected] = useState(0);

  const [hourSelected, setHourSelected] = useState(0);
  const [minuteSelected, setMinuteSelected] = useState(0);
  const [ampmSelected, setAMPMSelected] = useState(0);

  const [days, setDays] = useState(['']);
  const [daysAux, setDaysAux] = useState([
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
  ]);
  const [years, setYears] = useState(['']);
  const [hours, setHours] = useState(['']);
  const [minutes, setMinutes] = useState(['']);
  const [isAMPM, setIsAMPM] = useState(0);
  const [alreadyLoaded, setIsAlreadyLoaded] = useState(true);
  const [currentState, setCurrentState] = useState(false);

  const isPmOrAm = ['PM', 'AM'];

  const loadTime = () => {
    let hours = [''];
    let minutes = [''];

    let hoursConcat = '';
    let minutesConcat = '';
    let hrsFormat = 0;

    if (hrs24) {
      hrsFormat = 23;
    } else {
      hrsFormat = 12;
      //hrsFormat = 23;
    }

    //hrsFormat = 23;

    for (let i = hrs24 ? 0 : 1; i <= hrsFormat; i++) {
      if (i < 10) {
        hoursConcat = '0' + i.toString();
      } else {
        hoursConcat = i.toString();
      }
      hours.push(hoursConcat);
    }
    hours.shift();
    setHours(hours);

    for (let i = 0; i <= 59; i++) {
      if (i < 10) {
        minutesConcat = '0' + i.toString();
      } else {
        minutesConcat = i.toString();
      }
      minutes.push(minutesConcat);
    }
    minutes.shift();
    setMinutes(minutes);
  };

  const getAnio = () => {
    let time = selectedDevice?.datetime?.toString().split(' ');
    let dateSplit = time[0].toString().split('-');

    let init = 2000;
    let end = Number(new Date().getFullYear());
    let localYears = [''];
    let count = 0;

    for (let i = init; i <= end; i++) {
      ++count;
      localYears.push(i.toString());
      if (i.toString() === dateSplit[0].toString()) {
        setYearSelected(count - 1);
      }
    }
    localYears.shift();
    setYears(localYears);
  };

  const isLeap = year => {
    return year % 400 === 0 ? true : year % 100 === 0 ? false : year % 4 === 0;
  };

  const updateDaysByYear = index => {
    if (monthSelected === 1 && daySelected === 28 && !isLeap(index + 2000)) {
      console.log('ASDFASDFS');
      let day = 28;
      setDaySelected(daySelected - 1);
      let days = [''];
      let dayConcat = '';
      for (let i = 1; i < day + 1; i++) {
        if (i < 10) {
          dayConcat = '0' + i.toString();
        } else {
          dayConcat = i.toString();
        }
        days.push(dayConcat);
      }
      days.shift();
      console.log(days);
      console.log(daySelected - 1);
      setDays(days);
    } else if (monthSelected === 1 && isLeap(index + 2000)) {
      console.log('ASDFASDFS');
      let day = 29;
      let days = [''];
      let dayConcat = '';
      for (let i = 1; i < day + 1; i++) {
        if (i < 10) {
          dayConcat = '0' + i.toString();
        } else {
          dayConcat = i.toString();
        }
        days.push(dayConcat);
      }
      days.shift();
      setDays(days);
    }
  };

  const updateDays = index => {
    let day = 0;

    if (Dictionary.PickerCollections.months31days.includes(index + 1)) {
      day = 31;
    } else if (Dictionary.PickerCollections.months30days.includes(index + 1)) {
      day = 30;
    } else if (Dictionary.PickerCollections.months28days.includes(index + 1)) {
      if (isLeap(yearSelected + 2000)) {
        day = 29;
      } else {
        day = 28;
      }
    } else {
      day = 31;
    }
    if (daySelected >= day) {
      setDaySelected(day - 1);
    }
    let days = [''];
    let dayConcat = '';
    for (let i = 1; i < day + 1; i++) {
      if (i < 10) {
        dayConcat = '0' + i.toString();
      } else {
        dayConcat = i.toString();
      }
      days.push(dayConcat);
    }
    days.shift();
    setDays(days);
  };

  const dayMonth = index => {
    let day = 0;

    if (Dictionary.PickerCollections.months31days.includes(index + 1)) {
      day = 31;
    } else if (Dictionary.PickerCollections.months30days.includes(index + 1)) {
      day = 30;
    } else if (Dictionary.PickerCollections.months28days.includes(index + 1)) {
      day = 28;
    } else {
      day = 31;
    }
    if (daySelected >= day) {
      setDaySelected(day - 1);
    }
    let days = [''];
    let dayConcat = '';
    for (let i = 1; i < day + 1; i++) {
      if (i < 10) {
        dayConcat = '0' + i.toString();
      } else {
        dayConcat = i.toString();
      }
      days.push(dayConcat);
    }
    days.shift();
    setDays(days);
    getAnio();
  };
  useEffect(() => {
    if (selection === 'Date' && alreadyLoaded) {
      setIsAlreadyLoaded(false);
      dayMonth(0);
      getAnio();
    } else if (selection === 'Time') {
      loadTime();
    }
  }, [selectedDevice]);

  useEffect(() => {
    let time = selectedDevice.datetime.toString().split(' ');
    if (selection === 'Date') {
      let dateSplit = time[0].toString().split('-');
      setDaySelected(dateSplit[2] - 1);
      setMonthSelected(Number(dateSplit[1]) - 1);
      //setIsAMPM(AMPM);
    } else {
      let timeLocal = selectedDevice.datetime.toString().split(' ');
      let timeL = timeLocal[1];
      let timeHours2 = timeL.toString().split(':');
      if (timeHours2 != undefined && timeHours2 != '') {
        setHourSelected(0);
        setMinuteSelected(0);
      }
    }
  }, []);

  useEffect(() => {
    let timeLocal = selectedDevice.datetime.toString().split(' ');
    let timeHours2 = timeLabel.toString().split(':');
    let timeHours = timeLocal[1].toString().split(':');

    if (timeHours2 != undefined && timeHours2 != '') {
      setHourSelected(0);
      setMinuteSelected(0);
    }

    setIsAMPM(AMPM);
  }, [timeLabel]);

  useEffect(() => {
    console.log('3', notAvailableModal);
    if (notAvailableModal) {
      let time = selectedDevice.datetime.toString().split(' ');
      let dateSplit = time[0].toString().split('-');

      let day = 0;
      console.log(dateSplit, Dictionary.PickerCollections.months31days);

      if (
        Dictionary.PickerCollections.months31days.includes(Number(dateSplit[1]))
      ) {
        day = 31;
      } else if (
        Dictionary.PickerCollections.months30days.includes(Number(dateSplit[1]))
      ) {
        day = 30;
      } else if (
        Dictionary.PickerCollections.months28days.includes(Number(dateSplit[1]))
      ) {
        console.log(yearSelected);
        if (isLeap(yearSelected + 2000)) {
          day = 29;
        } else {
          day = 28;
        }
      } else {
        day = 31;
      }
      if (daySelected >= day) {
        setDaySelected(day - 1);
      }
      let days = [''];
      let dayConcat = '';
      for (let i = 1; i < day + 1; i++) {
        if (i < 10) {
          dayConcat = '0' + i.toString();
        } else {
          dayConcat = i.toString();
        }
        days.push(dayConcat);
      }
      days.shift();
      setDays(days);
    } else {
      setDays(['']);
    }
  }, [notAvailableModal]);

  useEffect(() => {
    let time = selectedDevice.datetime.toString().split(' ');
    let dateSplit = time[0].toString().split('-');
    updateDays(Number(dateSplit[1]) - 1);
    setDaySelected(dateSplit[2] - 1);
    setMonthSelected(Number(dateSplit[1]) - 1);
    setIsAMPM(AMPM);
  }, [dateLabel]);

  const saveData = () => {
    if (selection === 'Date') {
      let month = Number(monthSelected) + 1;
      let day = Number(daySelected) + 1;

      let anio =
        years[yearSelected] +
        '-' +
        (Number(month) < 10 ? '0' + month.toString() : month.toString()) +
        '-' +
        (Number(daySelected) < 10 ? '0' + day.toString() : day.toString());
      save(anio, timeLabel, hrs24, auto_T);
      setNotAvailableModal(false);
    } else if (selection === 'Time') {
      let hour = hourSelected - (hrs24 ? 1 : 0);
      let minutes = minuteSelected - 1;
      hour++;
      minutes++;
      let datetime =
        (hour < 10 ? '0' + hour : hour) +
        ':' +
        (minutes < 10 ? '0' + minutes : minutes);
      save(dateLabel, datetime, hrs24, auto_T, isAMPM);
      setNotAvailableModal(false);
    }
  };

  return (
    <View>
      <Pressable
        style={{}}
        onPress={() => setNotAvailableModal(true)}
        disabled={AutoEnabled}>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            height: 56,
            marginHorizontal: 16,
            backgroundColor: '#EEEEEE',
            marginTop: 25,
            borderBottomWidth: 2,
          }}>
          <View
            style={{
              flexDirection: 'column',
              alignContent: 'flex-start',
              alignItems: 'flex-start',
              paddingLeft: 11,
              paddingTop: 10,
            }}>
            <CustomText
              allowFontScaling={true}
              style={{}}
              color={Colors.black}
              font={'medium'}
              text={
                selection === 'Date'
                  ? Dictionary.DateTime.date
                  : Dictionary.DateTime.timeClock
              }
              align={'center'}
              size={12}
            />
            <CustomText
              style={{}}
              allowFontScaling={true}
              color={Colors.black}
              font={'medium'}
              text={label}
              align={'center'}
              size={16}
            />
          </View>
          <View style={{marginRight: 15, alignSelf: 'center'}}>
            {isSvgIcon ? (
              icon
            ) : (
              <Image style={styles.dateImage} source={icon} />
            )}
          </View>
        </View>
      </Pressable>
      <ModalComponent
        modalVisible={notAvailableModal}
        closeModal={() => setNotAvailableModal(false)}>
        <View
          style={{
            // borderWidth: 1.5,
            borderColor: '#8A9097',
            width: 344,
            height: 442,
          }}
          accessible={true}
          accessibilityLabel={`This is a Set Point Picker to select`}
          accessibilityRole={'adjustable'}
          accessibilityActions={[
            {name: 'increment'},
            {name: 'decrement'},
            {name: 'activate'},
          ]}
          onAccessibilityAction={(event: AccessibilityActionEvent) => {
            switch (event.nativeEvent.actionName) {
              case 'activate':
                break;
              case 'increment':
                break;
              case 'decrement':
                break;
            }
          }}>
          {selection === 'Date' ? (
            <View style={{flex: 1}}>
              <CustomText
                allowFontScaling={true}
                color={Colors.black}
                font={'bold'}
                text={Dictionary.PickerCollections.titleDate}
                align={'center'}
                size={16}
                style={{paddingBottom: 33, paddingTop: 20}}
              />
              <View style={styles.mainContainer}>
                <View
                  style={{}}
                  accessible={true}
                  accessibilityLabel={`This is a Set Point Picker to select the month.`}
                  accessibilityRole={'adjustable'}
                  accessibilityActions={[
                    {name: 'increment'},
                    {name: 'decrement'},
                    {name: 'activate'},
                  ]}
                  onAccessibilityAction={(event: AccessibilityActionEvent) => {
                    switch (event.nativeEvent.actionName) {
                      case 'activate':
                        break;
                      case 'increment':
                        setMonthSelected(
                          (parseInt(monthSelected) + 1).toString(),
                        );
                        break;
                      case 'decrement':
                        setMonthSelected(
                          (parseInt(monthSelected) - 1).toString(),
                        );
                        break;
                    }
                  }}>
                  <WheelPicker
                    visibleRest={3}
                    selectedIndex={monthSelected}
                    options={Dictionary.PickerCollections.Months}
                    onChange={index => {
                      updateDays(index);
                      setMonthSelected(index);
                    }}
                    containerStyle={{}}
                    itemTextStyle={styles.textWheelyValues}
                    selectedIndicatorStyle={styles.selectedIndicadorStyles}
                  />
                </View>
                <View
                  style={{}}
                  accessible={true}
                  accessibilityLabel={`This is a Set Point Picker to select the day.`}
                  accessibilityRole={'adjustable'}
                  accessibilityActions={[
                    {name: 'increment'},
                    {name: 'decrement'},
                    {name: 'activate'},
                  ]}
                  onAccessibilityAction={(event: AccessibilityActionEvent) => {
                    switch (event.nativeEvent.actionName) {
                      case 'activate':
                        break;
                      case 'increment':
                        setDaySelected((parseInt(daySelected) + 1).toString());
                        break;
                      case 'decrement':
                        setDaySelected((parseInt(daySelected) - 1).toString());
                        break;
                    }
                  }}>
                  <WheelPicker
                    visibleRest={3}
                    selectedIndex={daySelected}
                    options={days.length > 1 ? days : daysAux}
                    onChange={index => {
                      if (index <= days.length) {
                        setDaySelected(index);
                      }
                    }}
                    containerStyle={{}}
                    itemTextStyle={styles.textWheelyValues}
                    selectedIndicatorStyle={styles.selectedIndicadorStyles}
                  />
                </View>
                <View
                  style={{}}
                  accessible={true}
                  accessibilityLabel={`This is a Set Point Picker to select the year.`}
                  accessibilityRole={'adjustable'}
                  accessibilityActions={[
                    {name: 'increment'},
                    {name: 'decrement'},
                    {name: 'activate'},
                  ]}
                  onAccessibilityAction={(event: AccessibilityActionEvent) => {
                    switch (event.nativeEvent.actionName) {
                      case 'activate':
                        break;
                      case 'increment':
                        setYearSelected(
                          (parseInt(yearSelected) + 1).toString(),
                        );
                        break;
                      case 'decrement':
                        setYearSelected(
                          (parseInt(yearSelected) - 1).toString(),
                        );
                        break;
                    }
                  }}>
                  <WheelPicker
                    visibleRest={3}
                    selectedIndex={yearSelected}
                    options={years}
                    onChange={index => {
                      updateDaysByYear(index);
                      setYearSelected(index);
                    }}
                    containerStyle={{}}
                    itemTextStyle={styles.textWheelyValues}
                    selectedIndicatorStyle={styles.selectedIndicadorStyles}
                  />
                </View>
              </View>
            </View>
          ) : selection === 'Time' ? (
            <View style={{flex: 1}}>
              <CustomText
                color={Colors.black}
                font={'bold'}
                text={Dictionary.PickerCollections.titleHoursMinutes}
                align={'center'}
                size={12}
                style={{paddingBottom: 33, paddingTop: 20}}
              />
              <View style={styles.mainContainer}>
                <View
                  style={{}}
                  accessible={true}
                  accessibilityLabel={`This is a Set Point Picker to select the hour.`}
                  accessibilityRole={'adjustable'}
                  accessibilityActions={[
                    {name: 'increment'},
                    {name: 'decrement'},
                    {name: 'activate'},
                  ]}
                  onAccessibilityAction={(event: AccessibilityActionEvent) => {
                    switch (event.nativeEvent.actionName) {
                      case 'activate':
                        break;
                      case 'increment':
                        setHourSelected(
                          (parseInt(hourSelected) + 1).toString(),
                        );
                        break;
                      case 'decrement':
                        setHourSelected(
                          (parseInt(hourSelected) - 1).toString(),
                        );
                        break;
                    }
                  }}>
                  <WheelPicker
                    selectedIndex={hourSelected}
                    options={hours}
                    onChange={index => {
                      setHourSelected(index);
                    }}
                    containerStyle={{}}
                    itemTextStyle={styles.textWheelyValues}
                    selectedIndicatorStyle={styles.selectedIndicadorStyles}
                  />
                </View>
                <View
                  style={{}}
                  accessible={true}
                  accessibilityLabel={`This is a Set Point Picker to select the minutes.`}
                  accessibilityRole={'adjustable'}
                  accessibilityActions={[
                    {name: 'increment'},
                    {name: 'decrement'},
                    {name: 'activate'},
                  ]}
                  onAccessibilityAction={(event: AccessibilityActionEvent) => {
                    switch (event.nativeEvent.actionName) {
                      case 'activate':
                        break;
                      case 'increment':
                        setMinuteSelected(
                          (parseInt(minuteSelected) + 1).toString(),
                        );
                        break;
                      case 'decrement':
                        setMinuteSelected(
                          (parseInt(minuteSelected) - 1).toString(),
                        );
                        break;
                    }
                  }}>
                  <WheelPicker
                    selectedIndex={minuteSelected}
                    options={minutes}
                    onChange={index => {
                      setMinuteSelected(index);
                    }}
                    containerStyle={{}}
                    itemTextStyle={styles.textWheelyValues}
                    selectedIndicatorStyle={styles.selectedIndicadorStyles}
                  />
                </View>
                {!hrs24 ? (
                  <View
                    style={{}}
                    accessible={true}
                    accessibilityLabel={`This is a Set Point Picker to select the minutes.`}
                    accessibilityRole={'adjustable'}
                    accessibilityActions={[
                      {name: 'increment'},
                      {name: 'decrement'},
                      {name: 'activate'},
                    ]}
                    onAccessibilityAction={(
                      event: AccessibilityActionEvent,
                    ) => {
                      switch (event.nativeEvent.actionName) {
                        case 'activate':
                          break;
                        case 'increment':
                          setIsAMPM((parseInt(isAMPM) + 1).toString());
                          break;
                        case 'decrement':
                          setIsAMPM((parseInt(isAMPM) - 1).toString());
                          break;
                      }
                    }}>
                    <WheelPicker
                      selectedIndex={isAMPM}
                      options={isPmOrAm}
                      onChange={index => {
                        setIsAMPM(index);
                      }}
                      containerStyle={{}}
                      itemTextStyle={styles.textWheelyValues}
                      selectedIndicatorStyle={styles.selectedIndicadorStyles}
                    />
                  </View>
                ) : null}
              </View>
            </View>
          ) : null}
          <View style={{marginHorizontal: 16}}>
            <Button
              text={'Confirm'}
              type={'primary'}
              onPress={() => {
                saveData();
              }}
              /* accessibilityHintText={
                !wasChanged
                  ? Dictionary.modeSelection.submitDisabledButton
                  : `${Dictionary.Accesories.changesSetPointConfirm} ${currentMode}.`
              }*/
            />
            <Button
              text={'Cancel'}
              type={'secondary'}
              onPress={() => {
                let time = selectedDevice.datetime.toString().split(' ');
                let dateSplit = time[0].toString().split('-');
                setDaySelected(dateSplit[2] - 1);
                setMonthSelected(Number(dateSplit[1]) - 1);
                setIsAMPM(AMPM);
                setNotAvailableModal(false);
              }}
            />
          </View>
        </View>
      </ModalComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  selectedIndicadorStyles: {
    backgroundColor: Colors.white,
    borderTopColor: '#BFC0C2',
    borderTopWidth: 1,
    borderBottomColor: '#BFC0C2',
    borderBottomWidth: 1,
    borderRadius: 0,
  },
  mainContainer: {
    flexDirection: 'row',
    borderBottomColor: Colors.mediumGray,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  textWheelyValues: {
    fontSize: 20,
  },
  dateImage: {},
});

export default CustomPickerColumns;
