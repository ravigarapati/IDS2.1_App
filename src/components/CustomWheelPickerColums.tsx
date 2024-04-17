import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  AccessibilityActionEvent,
} from 'react-native';
import WheelPicker from 'react-native-wheely';
import CustomText from './CustomText';
import ModalComponent from './ModalComponent';
import {Colors, Typography} from '../styles';
import {Dictionary} from '../utils/dictionary';
import Button from './Button';
import {connect} from 'react-redux';
import {useDispatch} from 'react-redux';
import {
  saveDateBCC50Schedule,
  saveTimeBCC50Schedule,
} from './../store/actions/HomeOwnerActions';

type CustomWheelPickerColumsProps = {
  title: String;
  value: any;
  icon: any;
  type: String;
  is24Hrs?: Boolean;
  disabled?: Boolean;
  month?: String;
  day?: String;
  year?: String;
};

const CustomWheelPickerColums = ({
  title,
  value,
  icon,
  type,
  is24Hrs,
  month,
  day,
  year,
}: CustomWheelPickerColumsProps) => {
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [monthSelected, setMonthSelected] = useState<any>('');
  const [daySelected, setDaySelected] = useState('');
  const [yearSelected, setYearSelected] = useState<any>('');
  const [hourSelected, setHourSelected] = useState<String>('');
  const [minutesSelected, setMinutesSelected] = useState<String>('');
  const [isPmOrAm, setIsPmOrAm] = useState<String>('');
  const [valueComplete, setValueComplete] = useState<String>('');
  const [monthIndex, setMonthIndex] = useState(0);
  const [dayIndex, setDayIndex] = useState(0);
  const [yearIndex, setYearIndex] = useState(0);
  const [hourIndex, setHourIndex] = useState(0);
  const [minutesIndex, setMinutesIndex] = useState(0);
  const [amOrPmIndex, setAmOrPmIndex] = useState(0);

  const handleModalVisibility = () => {
    setIsModalVisible(true);
  };

  const handleMonthSelected = index => {
    index === 1 && setMonthSelected('January');
    index === 2 && setMonthSelected('February');
    index === 3 && setMonthSelected('March');
    index === 4 && setMonthSelected('April');
    index === 5 && setMonthSelected('May');
    index === 6 && setMonthSelected('June');
    index === 7 && setMonthSelected('July');
    index === 8 && setMonthSelected('August');
    index === 9 && setMonthSelected('September');
    index === 10 && setMonthSelected('October');
    index === 11 && setMonthSelected('November');
    index === 12 && setMonthSelected('December');
  };

  const handleDaySelected = index => {
    if (index < 10) {
      setDaySelected('0' + index);
    } else {
      setDaySelected(index);
    }
  };

  const handleYearSelected = index => {
    index === 1 && setYearSelected('2020');
    index === 2 && setYearSelected('2021');
    index === 3 && setYearSelected('2022');
    index === 4 && setYearSelected('2023');
    index === 5 && setYearSelected('2024');
    index === 6 && setYearSelected('2025');
    index === 7 && setYearSelected('2026');
    index === 8 && setYearSelected('2027');
    index === 9 && setYearSelected('2028');
    index === 10 && setYearSelected('2029');
    index === 11 && setYearSelected('2030');
  };

  const handleHourSelected = index => {
    if (index < 10) {
      setHourSelected('0' + index);
    } else {
      setHourSelected(index);
    }
  };

  const handleMinutesSelected = index => {
    if (index < 10) {
      setMinutesSelected('0' + index);
    } else {
      setMinutesSelected(index);
    }
  };

  const handleAmOrPm = index => {
    index === 2 ? setIsPmOrAm('PM') : setIsPmOrAm('AM');
  };

  const handleCancel = () => {
    monthSelected == '' && setMonthSelected('');
    daySelected == '' && setDaySelected('');
    yearSelected == '' && setYearSelected('');

    hourSelected == '' && setHourSelected('');
    minutesSelected == '' && setMinutesSelected('');
    isPmOrAm == '' && setIsPmOrAm('');

    setIsModalVisible(false);
  };

  useEffect(() => {
    if (monthSelected !== '' && daySelected !== '' && yearSelected !== '') {
      let input = monthSelected + '/' + daySelected + '/' + yearSelected;
      dispatch(saveDateBCC50Schedule(input));
    }

    if (hourSelected !== '' && minutesSelected !== '') {
      let input = hourSelected + ':' + minutesSelected + ' ' + isPmOrAm;
      dispatch(saveTimeBCC50Schedule(input));
    }
  }, [
    monthSelected,
    daySelected,
    yearSelected,
    value,
    hourSelected,
    minutesSelected,
    isPmOrAm,
  ]);

  useEffect(() => {
    if (type === 'Date') {
      dispatch(saveDateBCC50Schedule(value));
    }
  }, [value]);

  useEffect(() => {
    if (type === 'Time') {
      dispatch(saveTimeBCC50Schedule(value));
    }
  }, [value]);

  return (
    <Pressable
      style={styles.mainContainer}
      onPress={() => handleModalVisibility()}>
      <View style={styles.inputView}>
        <View style={styles.textView}>
          <CustomText font="regular" size={12} align={'left'} text={title} allowFontScaling={true}/>
          <CustomText
          allowFontScaling={true}
            font="regular"
            size={16}
            align={'left'}
            text={
              type === 'Date'
                ? value === ''
                  ? monthSelected + ' ' + daySelected + ' ' + yearSelected
                  : value
                : type === 'Time'
                ? value === '' &&
                  is24Hrs === true &&
                  hourSelected !== '' &&
                  minutesSelected !== ''
                  ? hourSelected + ':' + minutesSelected
                  : value === '' &&
                    is24Hrs === false &&
                    hourSelected !== '' &&
                    minutesSelected !== ''
                  ? hourSelected + ':' + minutesSelected + ' ' + isPmOrAm
                  : value
                : ''
            }
          />
        </View>
        <Image source={icon} style={styles.icon} />
      </View>

      <ModalComponent
        blur={true}
        modalVisible={isModalVisible}
        closeModal={() => setIsModalVisible(false)}>
        <View style={{paddingTop: 15}}>
          <CustomText
          allowFontScaling={true}
            text={type === 'Date' ? 'Select Date' : 'Select Time'}
            font={'bold'}
            size={16}
            align={'center'}
          />
        </View>

        <View style={styles.wheelPickersView}>
          {type === 'Date' ? (
            <>
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
                      handleMonthSelected(monthIndex + 1);
                      setMonthIndex(monthIndex + 1);

                      break;
                    case 'decrement':
                      handleMonthSelected(monthIndex - 1);
                      setMonthIndex(monthIndex - 1);
                      break;
                  }
                }}>
                <WheelPicker
                  options={Dictionary.PickerCollections.Months}
                  selectedIndex={monthIndex}
                  onChange={index => handleMonthSelected(index)}
                  selectedIndicatorStyle={{
                    backgroundColor: 'white',
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderTopColor: '#BFC0C2',
                    borderBottomColor: '#BFC0C2',
                    borderRadius: 0,
                  }}
                  itemTextStyle={{
                    fontSize: 20,
                    fontFamily: Typography.FONT_FAMILY_REGULAR,
                  }}
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
                      handleDaySelected(dayIndex + 1);
                      setDayIndex(dayIndex + 1);

                      break;
                    case 'decrement':
                      handleDaySelected(dayIndex - 1);
                      setDayIndex(dayIndex - 1);
                      break;
                  }
                }}>
                <WheelPicker
                  options={
                    monthSelected === 'April' ||
                    monthSelected === 'June' ||
                    monthSelected === 'September' ||
                    monthSelected === 'November'
                      ? Dictionary.PickerCollections.days30
                      : monthSelected === 'January' ||
                        monthSelected === 'March' ||
                        monthSelected === 'May' ||
                        monthSelected === 'July' ||
                        monthSelected === 'August' ||
                        monthSelected === 'October' ||
                        monthSelected === 'December'
                      ? Dictionary.PickerCollections.days31
                      : monthSelected === 'February'
                      ? Dictionary.PickerCollections.days28
                      : Dictionary.PickerCollections.days31
                  }
                  selectedIndex={dayIndex}
                  onChange={index => handleDaySelected(index)}
                  selectedIndicatorStyle={{
                    backgroundColor: 'white',
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderTopColor: '#BFC0C2',
                    borderBottomColor: '#BFC0C2',
                    borderRadius: 0,
                  }}
                  itemTextStyle={{
                    fontSize: 20,
                    fontFamily: Typography.FONT_FAMILY_REGULAR,
                  }}
                />
              </View>

              <View
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
                      handleYearSelected(yearIndex + 1);
                      setYearIndex(yearIndex + 1);

                      break;
                    case 'decrement':
                      handleYearSelected(yearIndex - 1);
                      setYearIndex(yearIndex - 1);
                      break;
                  }
                }}>
                <WheelPicker
                  options={Dictionary.PickerCollections.years}
                  selectedIndex={yearIndex}
                  onChange={index => handleYearSelected(index)}
                  selectedIndicatorStyle={{
                    backgroundColor: 'white',
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderTopColor: '#BFC0C2',
                    borderBottomColor: '#BFC0C2',
                    borderRadius: 0,
                  }}
                  itemTextStyle={{
                    fontSize: 20,
                    fontFamily: Typography.FONT_FAMILY_REGULAR,
                  }}
                />
              </View>
            </>
          ) : (
            <>
              <WheelPicker
                options={' '}
                selectedIndex={0}
                onChange={index => ''}
                selectedIndicatorStyle={{
                  backgroundColor: 'white',
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderTopColor: '#BFC0C2',
                  borderBottomColor: '#BFC0C2',
                  borderRadius: 0,
                }}
                itemTextStyle={{
                  fontSize: 20,
                  fontFamily: Typography.FONT_FAMILY_REGULAR,
                }}
              />
              <View
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
                      handleHourSelected(hourIndex + 1);
                      setHourIndex(hourIndex + 1);

                      break;
                    case 'decrement':
                      handleHourSelected(hourIndex - 1);
                      setHourIndex(hourIndex - 1);
                      break;
                  }
                }}>
                <WheelPicker
                  options={
                    is24Hrs === true
                      ? Dictionary.PickerCollections.hours24
                      : Dictionary.PickerCollections.hours
                  }
                  selectedIndex={hourIndex}
                  onChange={index => handleHourSelected(index)}
                  selectedIndicatorStyle={{
                    backgroundColor: 'white',
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderTopColor: '#BFC0C2',
                    borderBottomColor: '#BFC0C2',
                    borderRadius: 0,
                  }}
                  itemTextStyle={{
                    fontSize: 20,
                    fontFamily: Typography.FONT_FAMILY_REGULAR,
                  }}
                />
              </View>

              <View
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
                      handleMinutesSelected(minutesIndex + 1);
                      setMinutesIndex(minutesIndex + 1);

                      break;
                    case 'decrement':
                      handleMinutesSelected(minutesIndex - 1);
                      setMinutesIndex(minutesIndex - 1);
                      break;
                  }
                }}>
                <WheelPicker
                  options={Dictionary.PickerCollections.minutes}
                  selectedIndex={minutesIndex}
                  onChange={index => handleMinutesSelected(index)}
                  selectedIndicatorStyle={{
                    backgroundColor: 'white',
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderTopColor: '#BFC0C2',
                    borderBottomColor: '#BFC0C2',
                    borderRadius: 0,
                  }}
                  itemTextStyle={{
                    fontSize: 20,
                    fontFamily: Typography.FONT_FAMILY_REGULAR,
                  }}
                />
              </View>

              {is24Hrs === false && (
                <View
                  accessible={true}
                  accessibilityLabel={`This is a Set Point Picker to select the time of the day (AM/PM).`}
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
                        handleAmOrPm(amOrPmIndex + 1);
                        setAmOrPmIndex(amOrPmIndex + 1);

                        break;
                      case 'decrement':
                        handleAmOrPm(amOrPmIndex - 1);
                        setAmOrPmIndex(amOrPmIndex - 1);
                        break;
                    }
                  }}>
                  <WheelPicker
                    options={Dictionary.PickerCollections.PMAM}
                    selectedIndex={amOrPmIndex}
                    onChange={index => handleAmOrPm(index)}
                    selectedIndicatorStyle={{
                      backgroundColor: 'white',
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                      borderTopColor: '#BFC0C2',
                      borderBottomColor: '#BFC0C2',
                      borderRadius: 0,
                    }}
                    itemTextStyle={{
                      fontSize: 20,
                      fontFamily: Typography.FONT_FAMILY_REGULAR,
                    }}
                  />
                </View>
              )}

              <WheelPicker
                options={' '}
                selectedIndex={0}
                onChange={index => ''}
                selectedIndicatorStyle={{
                  backgroundColor: 'white',
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderTopColor: '#BFC0C2',
                  borderBottomColor: '#BFC0C2',
                  borderRadius: 0,
                }}
                itemTextStyle={{
                  fontSize: 20,
                  fontFamily: Typography.FONT_FAMILY_REGULAR,
                }}
              />
            </>
          )}
        </View>
        <>
          <View style={styles.buttonView}>
            <Button
              text={'Confirm'}
              type={'primary'}
              onPress={() => setIsModalVisible(false)}
              disabled={
                type === 'Date'
                  ? monthSelected === '' ||
                    daySelected === '' ||
                    (yearSelected === '' && true)
                  : type === 'Time'
                  ? hourSelected === '' || (minutesSelected === '' && true)
                  : false
              }
            />
          </View>

          <View style={styles.buttonView2}>
            <Button
              text={'Cancel'}
              type={'secondary'}
              onPress={() => handleCancel()}
            />
          </View>
        </>
      </ModalComponent>
    </Pressable>
  );
};

const mapDispatchToProps = {
  saveDateBCC50Schedule,
  saveTimeBCC50Schedule,
};

export default connect(null, mapDispatchToProps)(CustomWheelPickerColums);

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 15,
  },
  inputView: {
    width: '100%',
    height: 56,
    borderBottomColor: 'black',
    borderBottomWidth: 1.5,
    backgroundColor: '#EEEEEE',
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textView: {
    marginLeft: 16,
  },
  icon: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
    marginRight: 16,
  },
  wheelPickersView: {
    flexDirection: 'row',
  },
  buttonView: {
    width: '100%',
    paddingHorizontal: 15,
  },
  buttonView2: {
    width: '100%',
    paddingHorizontal: 15,
  },
  textHiden: {
    color: '#EEEEEE',
  },
});
