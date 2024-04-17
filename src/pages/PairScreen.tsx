import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import {BoschIcon, Button, CustomText} from '../components';
import {Dictionary} from '../utils/dictionary';
import {Icons} from '../utils/icons';
import {MenuButton} from '../navigations/NavConfig';
import IDS from '../assets/images/Heat-Pump.svg';
import BCC100 from '../assets/images/BCC100.svg';
import {connect} from 'react-redux';
import Radiobutton from '../components/Radiobutton';
import {Colors} from '../styles';
import PairedDevice from './PairedDevice';
import {getDeviceList2, pairDevices} from '../store/actions/HomeOwnerActions';
import {showToast} from '../components/CustomToast';

const DeviceToShow = ({
  name,
  serialNumber,
  isLast,
  checked,
  handleCheck,
  isBCC,
}) => {
  return (
    <Pressable
      onPress={() => {
        handleCheck(serialNumber);
      }}
      style={{
        flexDirection: 'row',
        paddingVertical: 22,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: Colors.lightGray,
      }}>
      <View style={{width: '20%', alignItems: 'center'}}>
        {isBCC ? <IDS fill="#000" /> : <BCC100 fill="#000" />}
      </View>

      <View style={{width: '70%'}}>
        <CustomText
          align="left"
          text={name}
          size={18}
          font="medium"
          style={{marginBottom: 12}}
        />
        <CustomText align="left" text={`SN: ${serialNumber}`} size={12} />
      </View>
      <View>
        <Radiobutton
          accessibilityLabelText={Dictionary.addDevice.addBcc.unitedStates}
          accessibilityHintText={
            Dictionary.addDevice.addBcc.unitedStatesAccessibility
          }
          checked={checked}
          handleCheck={() => {
            handleCheck(serialNumber);
          }}
          text={''}
          style={{marginRight: 30}}
        />
      </View>
    </Pressable>
  );
};

const PairScreen = ({
  navigation,
  deviceList,
  deviceInfo,
  pairDevices,
  getDeviceList2,
  user,
}) => {
  const [devices, setDevices] = useState([]);
  const [deviceType, setDeviceType] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const onBack = () => {
    if (!deviceInfo.newDevice) {
      navigation.navigate('Home');
    } else {
      navigation.navigate('Add', {addAnother: true, showBackButton: true});
    }
  };

  useEffect(() => {
    setDeviceType(deviceInfo.deviceType);
  }, [deviceInfo]);

  useEffect(() => {
    setDevices(getListOfDevices());
  }, [deviceType]);

  const handleCheck = i => {
    let newListOfDevices = [...devices];
    newListOfDevices.forEach(d => (d.isChecked = false));
    newListOfDevices[i].isChecked = true;
    setDevices(newListOfDevices);
  };

  const getListOfDevices = () => {
    let listOfDevices = [];
    if (deviceType === 'BCC101') {
      deviceList.map(d => {
        if (d.deviceType.includes('IDS Arctic') && !d.paired) {
          d.isChecked = false;
          listOfDevices.push(d);
        }
      });
    } else {
      deviceList.map(d => {
        if (d.deviceType.includes('BCC10') && !d.paired) {
          d.isChecked = false;
          listOfDevices.push(d);
        }
      });
    }
    return listOfDevices;
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <>
        <View style={styles.headerContainer}>
          <View style={styles.headerDivision}>
            <TouchableOpacity
              style={styles.headerBackButton}
              onPress={() => onBack()}>
              <BoschIcon
                name={Icons.backLeft}
                size={24}
                style={styles.marginHorizontal10}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.headerTitle}>
            <CustomText
              text={`Pair ${deviceType === 'BCC101' ? 'Device' : 'Unit'}`}
              size={21}
              style={{
                marginVertical: 8,
              }}
            />
          </View>
        </View>
        <Image
          style={styles.headerRibbon}
          source={require('../assets/images/header_ribbon.png')}
        />
      </>
      {currentStep === 0 && (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
          }}>
          <View
            style={{marginTop: 30, flex: 1, justifyContent: 'space-between'}}>
            <View>
              <CustomText
                text={
                  deviceType === 'BCC101'
                    ? `Do you want to pair your BCC101\nthermostat MAC ID: ${deviceInfo.macId} to your\nIDS Arctic Heat Pump?`
                    : 'Do you want to pair your\nIDS Arctic Heat Pump to your\nBCC100 thermostat?'
                }
              />

              {devices.map((d, i) => (
                <DeviceToShow
                  isBCC={deviceType === 'BCC101'}
                  key={`${d.deviceName} - ${d.macId}`}
                  name={d.deviceName}
                  checked={d.isChecked}
                  serialNumber={d.macId}
                  isLast={i === devices.length - 1}
                  handleCheck={_ => {
                    handleCheck(i);
                  }}
                />
              ))}
            </View>

            <View style={{marginHorizontal: 16}}>
              <Button
                disabled={devices.filter(d => d.isChecked).length === 0}
                text={'Pair'}
                type="primary"
                onPress={() => {
                  if (deviceType === 'BCC101') {
                    pairDevices(
                      {
                        device_id: deviceInfo.macId,
                        gatewayId: devices.filter(d => d.isChecked)[0].macId,
                      },
                      response => {
                        let list = [...devices];
                        list.forEach(d => (d.isChecked = false));
                        setDevices(list);
                        if (response.bccidsparingdone) {
                          getDeviceList2({userId: user.attributes.sub});
                          navigation.navigate('PairedDevice', {
                            deviceType: deviceInfo.deviceType,
                            newDevice: deviceInfo.newDevice,
                          });
                        } else {
                          showToast('There was a problem.', 'error');
                        }
                      },
                    );
                  } else {
                    pairDevices(
                      {
                        device_id: devices.filter(d => d.isChecked)[0].macId,
                        gatewayId: deviceInfo.macId,
                      },
                      response => {
                        let list = [...devices];
                        list.forEach(d => (d.isChecked = false));
                        setDevices(list);
                        if (response.bccidsparingdone) {
                          getDeviceList2({userId: user.attributes.sub});
                          navigation.navigate('PairedDevice', {
                            deviceType: deviceInfo.deviceType,
                            newDevice: deviceInfo.newDevice,
                          });
                        } else {
                          showToast('There was a problem.', 'error');
                        }
                      },
                    );
                  }
                }}
              />
              <Button
                text={deviceInfo.newDevice ? 'Skip' : 'Cancel'}
                type="secondary"
                onPress={() => {
                  if (deviceInfo.newDevice) {
                    navigation.navigate('addAnotherDevice');
                  } else {
                    navigation.navigate('Home');
                  }
                }}
              />
            </View>
          </View>
        </ScrollView>
      )}
      {currentStep === 1 && null}
    </View>
  );
};

const styles = StyleSheet.create({
  marginHorizontal10: {marginHorizontal: 10},
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
});

const mapStateToProps = state => {
  return {
    deviceList: state.homeOwner.deviceList2,
    deviceInfo: state.homeOwner.newDeviceInfo,
    user: state.auth.user,
  };
};

const mapDispatchToProps = {
  pairDevices,
  getDeviceList2,
};

export default connect(mapStateToProps, mapDispatchToProps)(PairScreen);
