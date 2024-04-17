import React, {useEffect, useRef, useState} from 'react';
import {Image, View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {BoschIcon, CustomText, ToggleButton} from '../components';
import {Colors, Typography} from '../styles';
import SwitchToggle from 'react-native-switch-toggle';
import CustomWheelPicker from '../components/CustomWheelPicker';
import {ScrollView} from 'react-native-gesture-handler';
const THERMOMETER_ICON = require('./../assets/images/thermometer.png');
import {connect} from 'react-redux';
import THERMOMETER from '../assets/images/temperature1.svg';
import TEMPERATURE_SETTINGS from '../assets/images/TemperatureSettings.svg';
import {
  updateTemperatureSetting,
  updateTemperatureUnit,
  getDeviceStatus,
  updateSelected,
  updateTemperatureUnitWithStatus,
  deviceStatusWithTemperature,
} from '../store/actions/HomeOwnerActions';
import {Dictionary} from '../utils/dictionary';
import {Icons} from '../utils/icons';
import {CustomWheelPick} from '../components/CustomWheelPick';

function AlertOption({
  enabled,
  setEnabled,
  containerStyle,
  title,
  description,
  descriptionText,
  testID = '',
}) {
  return (
    <View
      style={containerStyle}
      accessible={true}
      accessibilityLabel={title}
      accessibilityHint={descriptionText}
      accessibilityActions={[{name: 'activate'}]}
      onAccessibilityAction={() => {
        setEnabled(!enabled);
      }}>
      <View style={styles.alertOptionContainer}>
        <CustomText font={'medium'} text={title} allowFontScaling={true} />
        <View
          style={{
            marginTop: -16,
          }}>
          <SwitchToggle
            testID={testID}
            switchOn={enabled}
            onPress={() => setEnabled(!enabled)}
            circleColorOff="#FFFFFF"
            circleColorOn="#FFFFFF"
            backgroundColorOn="#00629A"
            backgroundColorOff="#71767C"
            containerStyle={{
              marginTop: 16,
              width: 48,
              height: 24,
              borderRadius: 25,
              padding: 5,
              marginHorizontal: 1,
            }}
            circleStyle={{
              width: 12,
              height: 12,
              borderRadius: 20,
            }}
          />
        </View>
      </View>
      <CustomText
        font={'regular'}
        align="left"
        allowFontScaling={true}
        text={description}
      />
    </View>
  );
}

function TemperatureDeviceSettings({
  selectedDevice,
  updateTemperatureSetting,
  updateTemperatureUnit,
  getDeviceStatus,
  updateSelected,
  navigation,
  updateTemperatureUnitWithStatus,
  deviceStatusWithTemperature,
}) {
  const [unit, setUnit] = useState(selectedDevice.isFahrenheit ? 0 : 1);
  const [autoOnEnabled, setAutoOnEnabled] = useState(selectedDevice.autoOn);
  const [alertMessageEnabled, setAlertMessageEnabled] = useState(
    selectedDevice.alertMessage,
  );
  const [lowValue, setLowValue] = useState('');
  const [lowDef, setLowDef] = useState([-1]);
  const [highValue, setHighValue] = useState('');
  const [highDef, setHighDef] = useState([-1]);
  const [temperatureValues, setTemperatureValues] = useState(
    selectedDevice.isFahrenheit
      ? Array.from({length: 55}, (_, i) => `${i + 45}°F`)
      : Array.from({length: 32}, (_, i) => `${i + 7}°C`),
  );
  const [minValues, setMinValues] = useState(
    selectedDevice.isFahrenheit
      ? Array.from({length: 26}, (_, i) => `${i + 45}°F`)
      : Array.from({length: 15}, (_, i) => `${i + 7}°C`),
  );
  const [maxValues, setMaxValues] = useState(
    selectedDevice.isFahrenheit
      ? Array.from({length: 29}, (_, i) => `${i + 71}°F`)
      : Array.from({length: 16}, (_, i) => `${i + 22}°C`),
  );
  const [defaultValues, setDefaultValues] = useState({
    lowDef: [0],
    highDef: [0],
  });
  const [onChange, setOnChange] = useState(true);
  const timeoutRef = useRef(null);

  let stopStatus = () => {
    clearTimeout(timeoutRef.current);
    setOnChange(false);
    timeoutRef.current = setTimeout(() => {
      setOnChange(true);
    }, 14000);
  };

  let stopStatusTempUnit = () => {
    clearTimeout(timeoutRef.current);
    setOnChange(false);
    timeoutRef.current = setTimeout(() => {
      setOnChange(true);
    }, 5500);
  };

  //useEffect(() => {
  //  setLowValue(
  //    selectedDevice.alarmLow + `${selectedDevice.isFahrenheit ? '°F' : '°C'}`,
  //  );
  //  setHighValue(
  //    selectedDevice.alarmHigh + `${selectedDevice.isFahrenheit ? '°F' : '°C'}`,
  //  );
  //}, []);

  useEffect(() => {
    if (onChange) {
      console.log(
        'values updated----------------------------------------------------------------------------------',
      );
      setLowValue(
        selectedDevice.alarmLow +
          `${selectedDevice.isFahrenheit ? '°F' : '°C'}`,
      );
      setHighValue(
        selectedDevice.alarmHigh +
          `${selectedDevice.isFahrenheit ? '°F' : '°C'}`,
      );
      setAutoOnEnabled(selectedDevice.autoOn);
      setAlertMessageEnabled(selectedDevice.alertMessage);
      setMinValues(
        selectedDevice.isFahrenheit
          ? Array.from({length: 26}, (_, i) => `${i + 45}°F`)
          : Array.from({length: 15}, (_, i) => `${i + 7}°C`),
      );
      setMaxValues(
        selectedDevice.isFahrenheit
          ? Array.from({length: 29}, (_, i) => `${i + 71}°F`)
          : Array.from({length: 16}, (_, i) => `${i + 22}°C`),
      );
    }
  }, [selectedDevice]);

  useEffect(() => {}, [lowValue]);

  useEffect(() => {
    let ldef = [0];
    let hdef = [0];
    if (temperatureValues.length != 1 && lowValue != '') {
      let finalLowValue = lowValue;
      const lowDefault = minValues.indexOf(finalLowValue);
      if (lowDefault != -1) {
        ldef[0] = lowDefault;
        setLowDef(ldef);
      }
    }

    if (temperatureValues.length != 1 && highValue != '') {
      let finalHighValue = highValue;
      const highDefault = maxValues.indexOf(finalHighValue);
      if (highDefault != -1) {
        hdef[0] = highDefault;
        setHighDef(hdef);
      }
    }
    setDefaultValues({
      lowDef: ldef,
      highDef: hdef,
    });
  }, [highValue]);

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
            text={'Temperature'}
            size={21}
            allowFontScaling={true}
            font="medium"
          />
        </View>
      </View>
      <Image
        style={{height: 8, width: '100%'}}
        source={require('../assets/images/header_ribbon.png')}
      />
      <ScrollView
        contentContainerStyle={{flexGrow: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1, marginBottom: 20}}>
          <View style={{alignItems: 'center', marginTop: 24}}>
            <TEMPERATURE_SETTINGS fill="#000" />
          </View>

          <CustomText
            allowFontScaling={true}
            accessibilityLabelText={
              Dictionary.bccDashboard.settings.temperatureScreen.header
            }
            style={{marginTop: 16, marginBottom: 22}}
            text={Dictionary.bccDashboard.settings.temperatureScreen.header}
            font="regular"
          />
          <View style={styles.toggleButtonContainer}>
            <View style={{flex: 1, height: 65}}>
              <ToggleButton
                button1="°F"
                button1AccessibilityHint="Activate to set the thermostat on fahrenheit mode."
                button2AccessibilityHint="Activate to set the thermostat on celcius mode."
                button2="°C"
                pressed={unit}
                onChange={value => {
                  navigation.state.params.createStatusInterval();
                  /*setTimeout(() => {
                    navigation.state.params.createStatusInterval();
                  }, 3000);*/
                  navigation.state.params.setAuxHold(false);
                  navigation.state.params.setUpdateInfo(false);
                  stopStatusTempUnit();
                  //clearInterval(navigation.state.params.interval);
                  setUnit(unit === 0 ? 1 : 0);
                  updateTemperatureUnitWithStatus({
                    device_id: selectedDevice.macId,
                    unit: unit === 0 ? 'C' : 'F',
                  });
                  setTimeout(() => {
                    updateTemperatureUnitWithStatus({
                      device_id: selectedDevice.macId,
                      unit: unit === 0 ? 'C' : 'F',
                    });
                  }, 2000);
                  setTimeout(() => {
                    deviceStatusWithTemperature(
                      {
                        device_id: selectedDevice.macId,
                      },
                      (response: any) => {
                        updateSelected({...response});
                      },
                    );
                  }, 6000);
                }}
              />
            </View>
          </View>

          <AlertOption
            testID={'autoOption'}
            enabled={autoOnEnabled}
            setEnabled={newValue => {
              navigation.state.params.setUpdateInfo(false);
              navigation.state.params.createStatusInterval();
              /*setTimeout(() => {
                navigation.state.params.createStatusInterval();
              }, 3000);*/
              navigation.state.params.setAuxHold(false);
              stopStatus();
              //clearInterval(navigation.state.params.interval);
              setAutoOnEnabled(newValue);
              updateTemperatureSetting({
                device_id: selectedDevice.macId,
                low: lowValue.split('°')[0],
                high: highValue.split('°')[0],
                t_limit: alertMessageEnabled ? '1' : '0',
                t_auto: newValue ? '1' : '0',
              });
            }}
            containerStyle={{
              borderBottomWidth: 1,
              marginHorizontal: 16,
              paddingBottom: 19,
              borderBottomColor: '#BFC0C2',
            }}
            title={'Auto-On'}
            description={
              Dictionary.bccDashboard.settings.temperatureScreen.autoOnLabel
            }
            descriptionText={
              Dictionary.bccDashboard.settings.temperatureScreen.autoOnText
            }
          />
          <AlertOption
            testID={'alertOption'}
            enabled={alertMessageEnabled}
            setEnabled={newValue => {
              navigation.state.params.setUpdateInfo(false);
              navigation.state.params.createStatusInterval();
              /*setTimeout(() => {
                navigation.state.params.createStatusInterval();
              }, 3000);*/
              navigation.state.params.setAuxHold(false);
              stopStatus();
              //clearInterval(navigation.state.params.interval);
              updateTemperatureSetting({
                device_id: selectedDevice.macId,
                low: lowValue.split('°')[0],
                high: highValue.split('°')[0],
                t_limit: newValue ? '1' : '0',
                t_auto: autoOnEnabled ? '1' : '0',
              });
              setAlertMessageEnabled(newValue);
            }}
            containerStyle={{
              marginHorizontal: 16,
              paddingBottom: 19,
              marginTop: 16,
            }}
            title={'Alert Message'}
            description={
              Dictionary.bccDashboard.settings.temperatureScreen
                .alerMessageLabel
            }
            descriptionText={
              Dictionary.bccDashboard.settings.temperatureScreen
                .alertMessageText
            }
          />
          <View style={{marginHorizontal: 16}}>
            <CustomText
              allowFontScaling={true}
              text={'Temperature'}
              align={'left'}
              font={'medium'}
              style={{marginBottom: 18}}
            />
            {defaultValues.lowDef[0] != -1 && lowValue !== '' && (
              <View style={{marginBottom: 16}}>
                {/*<CustomWheelPicker
                  testID="lowTemp"
                  accessibilityHintText={
                    Dictionary.bccDashboard.settings.temperatureScreen.lowLabel
                  }
                  edit={true}
                  pickerWidth={'100%'}
                  placeholder={'Low'}
                  value={`${lowValue}`}
                  isRequiredField={true}
                  values={[minValues]}
                  isSvgIcon={true}
                  icon={<THERMOMETER fill="#000" />}
                  defaultValue={defaultValues.lowDef}
                  defaultValueZero={true}
                  accessibilityWheelPickerValue={[
                    Dictionary.bccDashboard.settings.temperatureScreen.lowTitle,
                  ]}
                  onConfirm={selected => {
                    navigation.state.params.setUpdateInfo(false);
                    navigation.state.params.createStatusInterval();
                    /*setTimeout(() => {
                      navigation.state.params.createStatusInterval();
                    }, 3000);
                    //clearInterval(navigation.state.params.interval);
                    navigation.state.params.setAuxHold(false);
                    stopStatus();
                    updateTemperatureSetting({
                      device_id: selectedDevice.macId,
                      low: minValues[selected ? selected['0'] : 0].split(
                        '°',
                      )[0],
                      high: highValue.split('°')[0],
                      t_limit: alertMessageEnabled ? '1' : '0',
                      t_auto: autoOnEnabled ? '1' : '0',
                    });
                    setLowValue(minValues[selected ? selected['0'] : 0]);
                  }}
                  indexToCompare={minValues.indexOf(highValue)}
                  comparison={1}
                />*/}
                <CustomWheelPick
                  type={'picker'}
                  testID="lowTemp"
                  accessibilityHintText={
                    Dictionary.bccDashboard.settings.temperatureScreen.lowLabel
                  }
                  edit={true}
                  pickerWidth={'100%'}
                  placeholder={'Low'}
                  value={`${lowValue}`}
                  values={minValues}
                  defaultIndex={
                    minValues.indexOf(lowValue) !== -1
                      ? minValues.indexOf(lowValue)
                      : 0
                  }
                  isSvgIcon={true}
                  blur={true}
                  icon={<THERMOMETER fill="#000" />}
                  onConfirm={selected => {
                    navigation.state.params.setUpdateInfo(false);
                    navigation.state.params.createStatusInterval();
                    /*setTimeout(() => {
                        navigation.state.params.createStatusInterval();
                      }, 3000);*/
                    //clearInterval(navigation.state.params.interval);
                    navigation.state.params.setAuxHold(false);
                    stopStatus();
                    updateTemperatureSetting({
                      device_id: selectedDevice.macId,
                      low: minValues[selected ? selected['0'] : 0].split(
                        '°',
                      )[0],
                      high: highValue.split('°')[0],
                      t_limit: alertMessageEnabled ? '1' : '0',
                      t_auto: autoOnEnabled ? '1' : '0',
                    });
                    setLowValue(minValues[selected ? selected['0'] : 0]);
                  }}
                />
              </View>
            )}

            {defaultValues.highDef[0] != -1 && highValue !== '' && (
              /*<CustomWheelPicker
                testID="highTemp"
                accessibilityHintText={
                  Dictionary.bccDashboard.settings.temperatureScreen.highLabel
                }
                edit={true}
                pickerWidth={'100%'}
                placeholder={'High'}
                value={`${highValue}`}
                isRequiredField={true}
                values={[maxValues]}
                isSvgIcon={true}
                icon={<THERMOMETER fill="#000" />}
                defaultValueZero={true}
                defaultValue={defaultValues.highDef}
                accessibilityWheelPickerValue={[
                  Dictionary.bccDashboard.settings.temperatureScreen.highTitle,
                ]}
                onConfirm={selected => {
                  navigation.state.params.setUpdateInfo(false);
                  navigation.state.params.createStatusInterval();
                  /*setTimeout(() => {
                    navigation.state.params.createStatusInterval();
                  }, 3000);
                  navigation.state.params.setAuxHold(false);
                  stopStatus();
                  //clearInterval(navigation.state.params.interval);
                  updateTemperatureSetting({
                    device_id: selectedDevice.macId,
                    low: lowValue.split('°')[0],
                    high: maxValues[selected ? selected['0'] : 0].split('°')[0],
                    t_limit: alertMessageEnabled ? '1' : '0',
                    t_auto: autoOnEnabled ? '1' : '0',
                  });
                  setHighValue(maxValues[selected ? selected['0'] : 0]);
                }}
                indexToCompare={temperatureValues.indexOf(lowValue)}
              />*/

              <CustomWheelPick
                type={'picker'}
                testID="highTemp"
                accessibilityHintText={
                  Dictionary.bccDashboard.settings.temperatureScreen.highLabel
                }
                edit={true}
                pickerWidth={'100%'}
                placeholder={'High'}
                value={`${highValue}`}
                values={maxValues}
                defaultIndex={
                  maxValues.indexOf(highValue) !== -1
                    ? maxValues.indexOf(highValue)
                    : 0
                }
                isSvgIcon={true}
                blur={true}
                icon={<THERMOMETER fill="#000" />}
                onConfirm={selected => {
                  navigation.state.params.setUpdateInfo(false);
                  navigation.state.params.createStatusInterval();
                  /*setTimeout(() => {
                  navigation.state.params.createStatusInterval();
                }, 3000);*/
                  navigation.state.params.setAuxHold(false);
                  stopStatus();
                  //clearInterval(navigation.state.params.interval);
                  updateTemperatureSetting({
                    device_id: selectedDevice.macId,
                    low: lowValue.split('°')[0],
                    high: maxValues[selected ? selected['0'] : 0].split('°')[0],
                    t_limit: alertMessageEnabled ? '1' : '0',
                    t_auto: autoOnEnabled ? '1' : '0',
                  });
                  setHighValue(maxValues[selected ? selected['0'] : 0]);
                }}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  alertOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  toggleButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 56,
    paddingVertical: 10,
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

const mapStateToProps = state => {
  return {
    selectedDevice: state.homeOwner.selectedDevice,
  };
};

const mapDispatchToProps = {
  updateTemperatureSetting,
  updateTemperatureUnit,
  getDeviceStatus,
  updateSelected,
  updateTemperatureUnitWithStatus,
  deviceStatusWithTemperature,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TemperatureDeviceSettings);
