import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
  AccessibilityActionEvent,
  Text,
} from 'react-native';

import {Colors} from '../styles';
import {
  CustomText,
  Button,
  ModalComponent,
  SwitchContent,
  BoschIcon,
} from '../components';
import {Dictionary} from '../utils/dictionary';
import {connect} from 'react-redux';
import WheelPicker from 'react-native-wheely';
import {
  editDevice,
  updateAccesoryValues,
  getDeviceStatus,
} from '../store/actions/HomeOwnerActions';
import SwitchToggle from 'react-native-switch-toggle';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Icons} from '../utils/icons';
import {Picker} from 'react-native-wheel-pick';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function Accesories({
  navigation,
  devices,
  editDevice,
  updateAccesoryValues,
  selectD,
  getDeviceStatus,
  route,
}) {
  const [currentMode, setCurrentMode] = useState('');
  const [switchOnOff, setSwitchOnOff] = useState();
  const [switchAccesoryId, setSwitchAccesoryId] = useState();
  const [wheelyValues, setWheelyValues] = useState(['']);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [wasChanged, setWasChanged] = useState(false);
  const [firstTime, setFirstTime] = useState(true);

  const [notAvailableModal, setNotAvailableModal] = useState(false);
  const [deviceDetails, setDeviceDetails] = useState({
    setpoint: 0,
    isAccesories: true,
    accesories: [],
    macId: '',
  });
  const [onChange, setOnChange] = useState(true);
  const selectedDevice = selectD;

  const [updateDevice, setUpdateDevice] = useState({
    updateAccesoryDevice: selectD.macId,
    updateAccesoryAdded: selectD.isAccessoryAdded,
    updateAccesoryEnable: selectD.isAccesoryEnabled,
    updateAccesoryHumidity: selectD.HumiditySetpoint,
  });

  useEffect(() => {
    if (onChange) {
      setUpdateDevice({
        updateAccesoryDevice: selectD.macId,
        updateAccesoryAdded: selectD.isAccessoryAdded,
        updateAccesoryEnable: selectD.isAccesoryEnabled,
        updateAccesoryHumidity: selectD.HumiditySetpoint,
      });
    }
  }, [selectD]);

  const onBack = () => {
    navigation.state.params.createStatusInterval();
    navigation.navigate('BCCDashboard');
  };

  const switchOn = (status: any /*, id: any, disabled: any*/) => {
    setUpdateDevice({
      ...updateDevice,
      updateAccesoryEnable: status,
    });
  };

  const saveData = () => {
    editDevice({
      idAccesory: switchAccesoryId,
      isAccesoryOn: switchOnOff,
      macId: deviceDetails.macId,
    });

    navigation.navigate('BCCDashboard');
  };

  const setValuesetPoint = index => {
    setUpdateDevice({
      ...updateDevice,
      updateAccesoryHumidity: selectedIndex + 30,
    });
    setNotAvailableModal(false);
    //setUpdateDevice;
  };

  const updateDeviceValues = () => {
    const t_humidity_local =
      updateDevice.updateAccesoryAdded +
      '-' +
      (updateDevice.updateAccesoryEnable ? 1 : 0) +
      '-' +
      updateDevice.updateAccesoryHumidity;
    navigation.state.params.setUpdateInfo(false);
    navigation.state.params.createStatusInterval();
    /*setTimeout(() => {
      navigation.state.params.createStatusInterval();
    }, 3000);*/

    updateAccesoryValues(
      {
        deviceId: updateDevice.updateAccesoryDevice,
        t_humidity: t_humidity_local,
      },
      () => {
        navigation.navigate('BCCDashboard');
      },
    );
  };

  //get devices dommie Values
  useEffect(() => {
    devices.map(device => {
      if (device.macId.toString() === selectD.macId.toString()) {
        setDeviceDetails({
          ...deviceDetails,
          setpoint: device.setPoint,
          isAccesories: device.isAccesories,
          macId: device.macId,
          accesories: device.accesories,
        });
      }
    });
  }, [notAvailableModal]);

  //charging WheelyPicker percent  and selected values

  useEffect(() => {
    let numbers = [''];
    let count = 1;
    for (let i = 30; i < 91; i++) {
      numbers.push(i.toString() + '%');
      //setting the value of setpoint into wheelyPicker

      if (i.toString() === updateDevice.updateAccesoryHumidity.toString()) {
        setSelectedIndex(count - 1);
      }
      count++;
    }

    numbers.splice(0, 1);

    setWheelyValues(numbers);
    //if (deviceDetails.setpoint === 0) {
    //  setSelectedIndex(21);
    //}
  }, [notAvailableModal]);

  const setValuePicker = operation => {
    clearInterval(navigation.state.params.statusInterval);
    setOnChange(false);
    if (operation === 'increment') {
      setSelectedIndex(selectedIndex + 1);
    } else {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <>
        <View style={styles.headerContainer}>
          <View style={styles.headerDivision}>
            <TouchableOpacity
              testID="goBackArrow"
              style={styles.headerBackButton}
              accessible={true}
              accessibilityLabel="back."
              accessibilityHint="Activate to go back to the BCC Dashboard screen."
              accessibilityRole="button"
              onPress={() => onBack()}>
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
              Accessory
            </Text>
          </View>
        </View>
        <Image
          style={styles.headerRibbon}
          source={require('../assets/images/header_ribbon.png')}
        />
      </>
      <View style={{flex: 1}}>
        {selectD.isAccessoryAdded !== '2' ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF',
            }}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderBottomColor: '#BFC0C2',
                  height: 64,
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  justifyContent: 'space-between',
                }}
                accessible={true}
                accessibilityLabel={`${
                  updateDevice.updateAccesoryEnable
                    ? Dictionary.Accesories.disabledAccesory +
                        selectD.isAccessoryAdded ===
                      '0'
                      ? 'Humidifier'
                      : 'Dehumidifier'
                    : Dictionary.Accesories.enableAccesory +
                        selectD.isAccessoryAdded ===
                      '0'
                    ? 'Humidifier'
                    : 'Dehumidifier'
                }`}
                accessibilityHint={Dictionary.Accesories.AccesoryHint}
                accessibilityRole={'button'}
                accessibilityActions={[{name: 'activate'}]}
                /* onAccessibilityAction={(event: AccessibilityActionEvent) => {
          switch (event.nativeEvent.actionName) {
            case 'activate':
              toggleSwitch();
              break;
          }
        }}*/
                onAccessibilityAction={() => {
                  clearInterval(navigation.state.params.statusInterval);
                  setOnChange(false);
                  setWasChanged(true);
                  switchOn(!updateDevice.updateAccesoryEnable);
                }}>
                <CustomText
                  allowFontScaling={true}
                  text={
                    selectD.isAccessoryAdded === '0'
                      ? 'Humidifier'
                      : 'Dehumidifier'
                  }
                  size={18}
                  font={'medium'}
                />
                <View style={{height: 55}}>
                  <SwitchToggle
                    switchOn={updateDevice.updateAccesoryEnable}
                    onPress={() => {
                      clearInterval(navigation.state.params.statusInterval);
                      setOnChange(false);
                      setWasChanged(true);
                      switchOn(!updateDevice.updateAccesoryEnable);
                    }}
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
                    testID="SwitchToogle"
                  />
                </View>
              </View>
              {updateDevice.updateAccesoryEnable && (
                <View>
                  <View style={[styles.AccesoryContainer]} accessible={true}>
                    <CustomText
                      allowFontScaling={true}
                      accessibilityLabelText="Actual humidity: "
                      color={Colors.black}
                      font={'medium'}
                      text={'Actual Humidity'}
                      align={'left'}
                      size={18}
                    />

                    <CustomText
                      allowFontScaling={true}
                      accessibilityLabelText={`${selectD.humidity}%.`}
                      color={Colors.black}
                      font={'medium'}
                      text={`${selectD.humidity}%`}
                      align={'left'}
                      size={18}
                    />
                  </View>
                  <View
                    style={[styles.AccesoryContainer, {borderBottomWidth: 0}]}>
                    <CustomText
                      allowFontScaling={true}
                      color={Colors.black}
                      font={'medium'}
                      text={'Humidity Set Point'}
                      align={'left'}
                      size={18}
                    />
                  </View>
                  <Pressable
                    testID="activateModal"
                    onPress={() => {
                      setNotAvailableModal(true);
                      setWasChanged(true);
                    }}>
                    <View
                      style={styles.setPointContainer}
                      accessible={true}
                      accessibilityLabel={
                        Dictionary.Accesories.changeSetPointAccesory +
                        '. Current setpoint selected: ' +
                        updateDevice.updateAccesoryHumidity +
                        '%'
                      }
                      accessibilityRole={'button'}
                      accessibilityActions={[{name: 'activate'}]}
                      onAccessibilityAction={(
                        event: AccessibilityActionEvent,
                      ) => {
                        switch (event.nativeEvent.actionName) {
                          case 'activate':
                            setNotAvailableModal(true);
                            setWasChanged(true);
                            break;
                        }
                      }}>
                      <View>
                        <CustomText
                          allowFontScaling={true}
                          color={Colors.black}
                          font={'medium'}
                          text={'Set Point'}
                          align={'left'}
                          size={12}
                        />
                        <CustomText
                          allowFontScaling={true}
                          color={Colors.black}
                          font={'medium'}
                          text={updateDevice.updateAccesoryHumidity + '%'}
                          align={'left'}
                          size={16}
                        />
                      </View>
                      <View>
                        <Image
                          source={require('./../assets/images/arrow_down.png')}
                          style={{width: 12.8, height: 18}}
                        />
                      </View>
                    </View>
                  </Pressable>
                </View>
              )}
            </View>
            <View
              style={{
                marginHorizontal: 16,
              }}>
              <Button
                accessibilityHintText={
                  !wasChanged
                    ? Dictionary.modeSelection.submitDisabledButton
                    : `${Dictionary.Accesories.saveChangesAccesory} ${currentMode}.`
                }
                disabled={!wasChanged}
                text={'Submit'}
                type={'primary'}
                onPress={() => {
                  updateDeviceValues();
                }}
                testID="Submit"
              />
              <Button
                text={'Cancel'}
                type={'secondary'}
                onPress={() => {
                  navigation.state.params.createStatusInterval();
                  navigation.navigate('BCCDashboard');
                }}
                testID="Cancel"
              />
            </View>
          </View>
        ) : (
          <View style={styles.notAccesoryContainer}>
            <CustomText
              allowFontScaling={true}
              color={Colors.black}
              font={'bold'}
              text={'Accessory Option Not Selected'}
              align={'center'}
              size={16}
              style={{paddingTop: 43}}
            />
            <CustomText
              allowFontScaling={true}
              color={Colors.black}
              font={'regular'}
              text={
                'Select an accessory option from the Unit\nConfiguration in the System Settings on\nthe thermostat.'
              }
              align={'center'}
              size={16}
              style={{
                paddingBottom: 33,
                paddingTop: 13,

                alignSelf: 'center',
              }}
            />
          </View>
        )}
      </View>

      <ModalComponent
        modalVisible={notAvailableModal}
        closeModal={() => setNotAvailableModal(false)}>
        <View
          style={{
            width: '100%',
            height: 442,
          }}>
          <View
            accessible={true}
            accessibilityLabel={`This is a Set Point Picker to select the humidity setpoint.`}
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
                  setValuePicker('increment');
                  break;
                case 'decrement':
                  setValuePicker('decrement');
                  break;
              }
            }}>
            <CustomText
              allowFontScaling={true}
              color={Colors.black}
              font={'bold'}
              text={'Set Point'}
              align={'center'}
              size={16}
              style={{paddingBottom: 33, paddingTop: 20}}
            />
            {/*<WheelPicker
              selectedIndex={selectedIndex}
              options={wheelyValues}
              onChange={index => {
                clearInterval(navigation.state.params.statusInterval);
                setOnChange(false);
                setSelectedIndex(index);
              }}
              selectedIndicatorStyle={{
                borderBottomWidth: 1,
                borderTopWidth: 1,
                backgroundColor: '#FFFFFF',
                borderColor: '#e0e0eb',
                height: 48,
              }}
              itemTextStyle={{fontSize: 20}}
              containerStyle={{marginHorizontal: 16}}
            />*/}
            <Picker
              style={{backgroundColor: 'white', width: '100%', height: 215}}
              selectedValue={wheelyValues[selectedIndex]}
              pickerData={wheelyValues}
              onValueChange={value => {
                console.log(value);
                clearInterval(navigation.state.params.statusInterval);
                setOnChange(false);
                setSelectedIndex(
                  wheelyValues.indexOf(value) !== -1
                    ? wheelyValues.indexOf(value)
                    : 0,
                );
                //setSelectedValue(value);
              }}
            />
          </View>
          <View style={{marginHorizontal: 16, marginTop: 35}}>
            <Button
              text={'Confirm'}
              type={'primary'}
              onPress={() => {
                setWasChanged(true);
                setValuesetPoint(selectedIndex);
              }}
              accessibilityHintText={
                !wasChanged
                  ? Dictionary.modeSelection.submitDisabledButton
                  : `${Dictionary.Accesories.changesSetPointConfirm} ${currentMode}.`
              }
              testID="ConfirmModal"
            />
            <Button
              text={'Cancel'}
              type={'secondary'}
              onPress={() => {
                navigation.state.params.createStatusInterval();
                //navigation.state.params.setUpdateInfo(false);
                setNotAvailableModal(false);
              }}
              testID="CancelModal"
            />
          </View>
        </View>
      </ModalComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  notAccesoryContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    height: '100%',
  },
  AccesoryContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#BFC0C2',
    height: 64,
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  setPointContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#0A0A0A',
    height: 56,
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    backgroundColor: '#EEEEEE',
    marginHorizontal: 16,
  },
  width97Percent: {width: '97%'},
  marginTop49: {marginTop: 49},
  justifyContentCenter: {justifyContent: 'center'},
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
});

const mapStateToProps = state => {
  return {
    devices: state.homeOwner.deviceList2,
    selectD: state.homeOwner.selectedDevice,
  };
};

const mapDispatchToProps = {
  editDevice,
  updateAccesoryValues,
  getDeviceStatus,
};
export default connect(mapStateToProps, mapDispatchToProps)(Accesories);

/*
<SwitchContent
              key={'Accessory./'}
              initialText={
                selectD.isAccessoryAdded === '0' ? 'Humidifier' : 'Dehumidifier'
              }
              accesoryOn={selectD.isAccesoryEnabled}
              switchStatus={switchOn}
              idAccesory={selectD.isAccessoryAdded === '0' ? 0 : 1}>
              <View style={[styles.AccesoryContainer]}>
                <CustomText
                  color={Colors.black}
                  font={'medium'}
                  text={'Actual Humidity'}
                  align={'left'}
                  size={18}
                />
                <CustomText
                  color={Colors.black}
                  font={'medium'}
                  text={`${selectD.humidity}%`}
                  align={'left'}
                  size={18}
                />
              </View>
              <View style={[styles.AccesoryContainer, {borderBottomWidth: 0}]}>
                <CustomText
                  color={Colors.black}
                  font={'medium'}
                  text={'Humidity Set Point'}
                  align={'left'}
                  size={18}
                />
              </View>
              <Pressable
                onPress={() => {
                  setNotAvailableModal(true);
                  setWasChanged(true);
                }}>
                <View
                  style={styles.setPointContainer}
                  accessible={true}
                  accessibilityLabel={
                    Dictionary.Accesories.changeSetPointAccesory
                  }
                  accessibilityRole={'button'}
                  accessibilityActions={[{name: 'activate'}]}
                  onAccessibilityAction={(event: AccessibilityActionEvent) => {
                    switch (event.nativeEvent.actionName) {
                      case 'activate':
                        setNotAvailableModal(true);
                        setWasChanged(true);
                        break;
                    }
                  }}>
                  <View>
                    <CustomText
                      color={Colors.black}
                      font={'medium'}
                      text={'Set Point'}
                      align={'left'}
                      size={12}
                    />
                    <CustomText
                      color={Colors.black}
                      font={'medium'}
                      text={updateDevice.updateAccesoryHumidity + '%'}
                      align={'left'}
                      size={16}
                    />
                  </View>
                  <View>
                    <Image
                      source={require('./../assets/images/arrow_down.png')}
                      style={{width: 12.8, height: 18}}
                    />
                  </View>
                </View>
              </Pressable>
            </SwitchContent>

 */
