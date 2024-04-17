import React, {useEffect, useState} from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  AccessibilityActionEvent,
  Image,
} from 'react-native';

import {Colors, Typography} from '../styles';
import Button from './Button';
import CustomText from './CustomText';
import ModalComponent from './ModalComponent';
import {DatePicker, Picker} from 'react-native-wheel-pick';

export const CustomWheelPick = ({
  type,
  placeholder,
  value,
  icon,
  values,
  onConfirm,
  edit,
  accessibilityLabelText = undefined,
  accessibilityHintText = undefined,
  isSvgIcon = false,
  blur,
  testID = '',
  formatTime12Hrs = true,
  disabled = false,
  defaultValue = '',
  defaultIndex = 0,
}) => {
  const [isFocused, setIsFocused] = useState(value !== '' || edit);
  const [showModal, setShowModal] = useState(false);
  const [beingLoaded, setBeingLoaded] = useState(true);
  const [pickerInfo, setPickerInfo] = useState([
    'item1',
    'item2',
    'item3',
    'item4',
    'item5',
    'item6',
    'item7',
  ]);
  const [minutes, setMinutes] = useState(
    Array.from({length: 60}, (_, x) => `${x < 10 ? '0' + x : x}`),
  );
  const [minutesStarting, setMinutesStarting] = useState([
    '00',
    '15',
    '30',
    '45',
  ]);
  const [hours12, setHours12] = useState(
    Array.from({length: 12}, (_, x) => `${x < 9 ? '0' + (x + 1) : x + 1}`),
  );
  const [hours24, setHours24] = useState(
    Array.from({length: 24}, (_, x) => `${x < 10 ? '0' + x : x}`),
  );
  const [hourFormat, setHourFormat] = useState(['AM', 'PM']);

  const [selectedValue, setSelectedValue] = useState(
    values !== undefined ? values[defaultIndex] : '',
  );
  const [selectedHour24, setSelectedHour24] = useState(['00', '00']);
  const [selectedHour12, setSelectedHour12] = useState(['01', '00', 'AM']);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    setIsFocused(edit);
  }, [value]);

  const displayStartingPickers = () => {
    return (
      <View style={{flex: 1, width: '100%'}}>
        {formatTime12Hrs ? (
          <View style={{flexDirection: 'row'}}>
            <Picker
              style={{
                backgroundColor: 'white',
                width: '33%',
              }}
              pickerData={hours12}
              onValueChange={(value, i) => {
                let currentHour = [...selectedHour12];
                currentHour[0] = value;
                setSelectedHour12(currentHour);
              }}
            />
            <Picker
              style={{backgroundColor: 'white', width: '33%'}}
              pickerData={minutesStarting}
              onValueChange={value => {
                console.log(value);
                let currentHour = [...selectedHour12];
                currentHour[1] = value;
                setSelectedHour12(currentHour);
              }}
            />
            <Picker
              style={{backgroundColor: 'white', width: '33%'}}
              pickerData={hourFormat}
              onValueChange={value => {
                console.log(value);
                let currentHour = [...selectedHour12];
                currentHour[2] = value;
                setSelectedHour12(currentHour);
              }}
            />
          </View>
        ) : (
          <View style={{flexDirection: 'row'}}>
            <Picker
              style={{backgroundColor: 'white', width: '50%'}}
              pickerData={hours24}
              onValueChange={value => {
                console.log(value);
                let currentHour = [...selectedHour24];
                currentHour[0] = value;
                setSelectedHour24(currentHour);
              }}
            />
            <Picker
              style={{backgroundColor: 'white', width: '50%'}}
              pickerData={minutesStarting}
              onValueChange={value => {
                console.log(value);
                let currentHour = [...selectedHour24];
                currentHour[1] = value;
                setSelectedHour24(currentHour);
              }}
            />
          </View>
        )}
      </View>
    );
  };

  const displayHourPickers = () => {
    return (
      <View style={{flex: 1, width: '100%'}}>
        {formatTime12Hrs ? (
          <View style={{flexDirection: 'row'}}>
            <Picker
              style={{
                backgroundColor: 'white',
                width: '33%',
              }}
              pickerData={hours12}
              onValueChange={(value, i) => {
                let currentHour = [...selectedHour12];
                currentHour[0] = value;
                setSelectedHour12(currentHour);
              }}
            />
            <Picker
              style={{backgroundColor: 'white', width: '33%'}}
              pickerData={minutes}
              onValueChange={value => {
                console.log(value);
                let currentHour = [...selectedHour12];
                currentHour[1] = value;
                setSelectedHour12(currentHour);
              }}
            />
            <Picker
              style={{backgroundColor: 'white', width: '33%'}}
              pickerData={hourFormat}
              onValueChange={value => {
                console.log(value);
                let currentHour = [...selectedHour12];
                currentHour[2] = value;
                setSelectedHour12(currentHour);
              }}
            />
          </View>
        ) : (
          <View style={{flexDirection: 'row'}}>
            <Picker
              style={{backgroundColor: 'white', width: '50%'}}
              pickerData={hours24}
              onValueChange={value => {
                console.log(value);
                let currentHour = [...selectedHour24];
                currentHour[0] = value;
                setSelectedHour24(currentHour);
              }}
            />
            <Picker
              style={{backgroundColor: 'white', width: '50%'}}
              pickerData={minutes}
              onValueChange={value => {
                console.log(value);
                let currentHour = [...selectedHour24];
                currentHour[1] = value;
                setSelectedHour24(currentHour);
              }}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{width: '100%'}}>
      <Pressable
        testID={testID}
        accessibilityLabel={accessibilityLabelText}
        accessibilityHint={accessibilityHintText}
        disabled={disabled}
        style={[
          {
            borderBottomWidth: 1,
            width: '100%',
            height: 56,
            alignItems: 'center',
            paddingLeft: 10,
            paddingRight: 16,
          },
          isFocused ? {backgroundColor: Colors.lightGray} : {},
          {flexDirection: 'row', justifyContent: 'space-between'},
        ]}
        onPress={() => {
          setShowModal(true);
        }}>
        <View>
          {isFocused && (
            <CustomText
              text={placeholder}
              size={12}
              align={'left'}
              allowFontScaling={true}
            />
          )}
          {!isFocused ? (
            <CustomText
              text={placeholder}
              align={'left'}
              allowFontScaling={true}
            />
          ) : (
            <CustomText
              text={value}
              font="regular"
              size={16}
              align={'left'}
              allowFontScaling={true}
            />
          )}
        </View>
        {isSvgIcon ? icon : <Image source={icon} />}
      </Pressable>
      <ModalComponent
        modalVisible={showModal}
        style={{height: 510}}
        closeModal={() => setShowModal(false)}
        blur={blur}>
        <View style={styles.width97Percent}>
          <CustomText
            text={placeholder}
            allowFontScaling={true}
            font={'bold'}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            {type === 'picker' ? (
              <Picker
                style={{backgroundColor: 'white', width: 300, height: 215}}
                selectedValue={defaultValue !== '' ? defaultValue : value}
                pickerData={values}
                onValueChange={value => {
                  console.log(value);
                  setSelectedValue(value);
                }}
              />
            ) : type === 'date' ? (
              <DatePicker
                date={
                  selectedDate === '' ? new Date(value) : new Date(selectedDate)
                }
                textSize={22}
                style={{backgroundColor: 'white'}}
                onDateChange={date => {
                  console.log(date);
                  setSelectedDate(date);
                }}
                minimumDate={new Date('2000-01-02')}
              />
            ) : type === 'hour' ? (
              displayHourPickers()
            ) : (
              type === 'starting' && displayStartingPickers()
            )}
            {/*type === 'date' && (
              <DatePicker
                style={{backgroundColor: 'white', width: 370, height: 240}}
                onDateChange={date => {
                  console.log(date);
                }}
              />
            )*/}
          </View>

          <View style={{marginTop: 50}}>
            <Button
              type={'primary'}
              text={'Confirm'}
              onPress={() => {
                //let wasChangedAux = wasChanged;
                //let createDefaultArray = [];
                /*setBeingLoaded(true);
                if (defaultValueZero) {
                  selectedIndex.forEach(d => {
                    createDefaultArray.push(0);
                  });
                } else {
                  selectedIndex.forEach(d => {
                    createDefaultArray.push(defaultValue);
                  });
                }
            

                setWasChanged(false);
                setIsFocused(true);*/
                let result = [];
                switch (type) {
                  case 'starting':
                    if (formatTime12Hrs) {
                      console.log('selected', selectedHour12);
                      result[0] = hours12.indexOf(selectedHour12[0]);
                      result[1] = minutes.indexOf(selectedHour12[1]);
                      result[2] = hourFormat.indexOf(selectedHour12[2]);
                      setSelectedHour12(['01', '00', 'AM']);
                    } else {
                      console.log('selected', selectedHour24);
                      result[0] = hours24.indexOf(selectedHour24[0]);
                      result[1] = minutes.indexOf(selectedHour24[1]);
                      setSelectedHour24(['00', '00']);
                    }
                    break;
                  case 'picker':
                    console.log('selected', selectedValue);
                    result[0] = values.indexOf(selectedValue);
                    break;
                  case 'date':
                    console.log('selected', selectedDate);
                    onConfirm(selectedDate);
                    setShowModal(false);
                    return;
                    break;
                  case 'hour':
                    if (formatTime12Hrs) {
                      console.log('selected', selectedHour12);
                      result[0] = hours12.indexOf(selectedHour12[0]);
                      result[1] = minutes.indexOf(selectedHour12[1]);
                      result[2] = hourFormat.indexOf(selectedHour12[2]);
                      setSelectedHour12(['01', '00', 'AM']);
                    } else {
                      console.log('selected', selectedHour24);
                      result[0] = hours24.indexOf(selectedHour24[0]);
                      result[1] = minutes.indexOf(selectedHour24[1]);
                      setSelectedHour24(['00', '00']);
                    }

                    break;
                }

                setShowModal(false);
                //onConfirm(wasChangedAux ? selectedIndex : createDefaultArray);
                console.log(result);
                setIsFocused(true);
                setSelectedValue(defaultValue !== '' ? defaultValue : value);
                onConfirm(result);
              }}
            />
            <Button
              type={'secondary'}
              text={'Cancel'}
              testID="wheelPickerCancel"
              onPress={() => {
                //setSelectedIndex(auxIndex);
                setShowModal(false);
                setBeingLoaded(true);
              }}
            />
          </View>
        </View>
      </ModalComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  width97Percent: {width: '97%'},
});
