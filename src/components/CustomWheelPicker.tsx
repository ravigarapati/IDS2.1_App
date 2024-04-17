import React, {useEffect, useState} from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  AccessibilityActionEvent,
  Image,
} from 'react-native';
import WheelPicker from 'react-native-wheely';
import {Colors, Typography} from '../styles';
import Button from './Button';
import CustomText from './CustomText';
import ModalComponent from './ModalComponent';

type CustomWheelPickerProps = {
  value: any;
  placeholder: string;
  isRequiredField: any;
  icon?: any;
  iconStyle?: any;
  values: any;
  onConfirm: any;
  pickerWidth: any;
  defaultValue: any;
  edit?: any;
  accessibilityLabelText?: string;
  accessibilityHintText?: string;
  accessibilityWheelPickerValue?: any;
  indexToCompare?: number;
  comparison?: number;
  isSvgIcon?: boolean;
  blur?: boolean;
  defaultValueZero?: boolean;
  testID?: string;
};

const CustomWheelPicker = ({
  value,
  placeholder,
  isRequiredField,
  icon,
  iconStyle,
  values,
  onConfirm,
  pickerWidth,
  defaultValue,
  edit,
  accessibilityLabelText = undefined,
  accessibilityHintText = undefined,
  accessibilityWheelPickerValue = [],
  indexToCompare = undefined,
  comparison = undefined,
  isSvgIcon = false,
  blur,
  defaultValueZero,
  testID = '',
}: CustomWheelPickerProps) => {
  const [isFocused, setIsFocused] = useState(edit);
  const [selectedIndex, setSelectedIndex] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [wasChanged, setWasChanged] = useState(false);
  const [auxIndex, setAuxIndex] = useState([]);
  const [beingLoaded, setBeingLoaded] = useState(true);

  useEffect(() => {
    if (Array.isArray(defaultValue)) {
      let values = [];
      defaultValue.forEach(d => {
        values.push(d);
      });
      setSelectedIndex([...values]);
      setAuxIndex([...values]);
    } else {
      setSelectedIndex(new Array(values.length).fill(defaultValue));
      setAuxIndex(new Array(values.length).fill(defaultValue));
    }
    if (defaultValueZero) {
      setSelectedIndex(new Array(values.length).fill(0));
    }
  }, []);

  useEffect(() => {
    if (!defaultValueZero) {
      if (Array.isArray(defaultValue)) {
        let values = [];
        defaultValue.forEach(d => {
          values.push(d);
        });
        setSelectedIndex([...values]);
        setAuxIndex([...values]);
      } else {
        setSelectedIndex(new Array(values.length).fill(defaultValue));
        setAuxIndex(new Array(values.length).fill(defaultValue));
      }
    }
  }, [defaultValue]);

  useEffect(() => {
    if (beingLoaded) {
      setBeingLoaded(false);
      if (defaultValueZero) {
        setSelectedIndex(new Array(values.length).fill(0));
      }
    }
  });

  const updateValueByAccessibility = (operation, i, length) => {
    let currentValues = [...selectedIndex];
    setWasChanged(true);
    if (operation === 'increment') {
      if (currentValues[i] <= length - 2) {
        currentValues[i] = currentValues[i] + 1;
      }
    } else {
      if (currentValues[i] >= 1) {
        currentValues[i] = currentValues[i] - 1;
      }
    }
    setSelectedIndex(currentValues);
  };

  useEffect(() => {}, [selectedIndex]);

  return (
    <View style={{width: '100%'}}>
      <Pressable
        testID={testID}
        accessibilityLabel={accessibilityLabelText}
        accessibilityHint={accessibilityHintText}
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
            <CustomText text={value} align={'left'} allowFontScaling={true} />
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
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            {values.map((w, i) => {
              return (
                <View
                  key={`${placeholder}-${i}`}
                  style={{width: pickerWidth}}
                  accessible={true}
                  accessibilityLabel={`This is a wheel picker to select ${
                    accessibilityWheelPickerValue[i]
                  }. Current Value: ${values[i][selectedIndex[i]]}`}
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
                        updateValueByAccessibility('increment', i, w.length);
                        break;
                      case 'decrement':
                        updateValueByAccessibility('decrement', i, w.length);
                        break;
                    }
                  }}>
                  <WheelPicker
                    key={`${i}`}
                    containerStyle={{
                      marginHorizontal: 0,
                      paddingHorizontal: 0,
                      marginTop: 20,
                    }}
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
                    selectedIndex={selectedIndex[i]}
                    options={w}
                    onChange={index => {
                      let currentSelected = [...selectedIndex];

                      setWasChanged(true);
                      currentSelected[i] = index;
                      setSelectedIndex(currentSelected);
                    }}
                  />
                </View>
              );
            })}
          </View>

          <View style={{marginTop: 80}}>
            <Button
              type={'primary'}
              text={'Confirm'}
              onPress={() => {
                let wasChangedAux = wasChanged;
                let createDefaultArray = [];
                setBeingLoaded(true);
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
                setIsFocused(true);
                setShowModal(false);
                onConfirm(wasChangedAux ? selectedIndex : createDefaultArray);
              }}
            />
            <Button
              type={'secondary'}
              text={'Cancel'}
              testID="wheelPickerCancel"
              onPress={() => {
                setSelectedIndex(auxIndex);
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

export default CustomWheelPicker;
