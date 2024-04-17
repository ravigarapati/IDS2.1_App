import React, {useEffect, useState} from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import {Button, CustomText, ModalComponent, RadioButton} from '../components';
import {connect} from 'react-redux';
import {
  pairDevices,
  getDeviceList2,
  pairSelectedDevice,
  unpairDevices,
  getDeviceListPairUnpair,
} from '../store/actions/HomeOwnerActions';

import IDS3 from '../assets/images/Heat-Pump-3.svg';
import BCC100 from '../assets/images/BCC100.svg';
import SUCCESS from '../assets/images/successPair.svg';
import {Colors} from '../styles';
import {ScrollView} from 'react-native-gesture-handler';
import SCREEN_IMAGE from '../assets/images/link-connected.svg';
import QUESTION from '../assets/images/question-frame-pairing.svg';
import {showToast} from '../components/CustomToast';

type DeviceToPairTileProps = {
  deviceName: string;
  macId: string;
  isThermostat: boolean;
  index?: number;
  select?: any;
  selected?: boolean;
  showRadio?: boolean;
};

const DeviceToPairTile = ({
  deviceName,
  macId,
  isThermostat,
  index,
  select,
  selected,
  showRadio = true,
}: DeviceToPairTileProps) => {
  const imageToShow = () => {
    if (isThermostat) {
      return <IDS3 fill="#000" />;
    } else {
      return <BCC100 fill="#000" />;
    }
  };

  return (
    <Pressable
      style={{
        flexDirection: 'row',
        borderWidth: 1,
        paddingTop: 13,
        paddingBottom: 16,
        borderColor: Colors.greyInputDisabled,
        marginBottom: 16,

        justifyContent: 'space-between',
      }}
      onPress={() => {
        if (showRadio) {
          select(index);
        }
      }}>
      <View style={{flexDirection: 'row'}}>
        <View
          style={
            isThermostat
              ? {alignItems: 'center', paddingHorizontal: 5}
              : {alignItems: 'center', paddingHorizontal: 15}
          }>
          {imageToShow()}
        </View>
        <View>
          <CustomText text={deviceName} align="left" font={'medium'} />
          <CustomText
            text={isThermostat ? 'IDS Arctic' : 'BCC 100'}
            align="left"
            size={12}
            color={Colors.mediumGray}
          />
          <CustomText
            text={`SN: ${macId.toUpperCase()}`}
            align="left"
            size={12}
            color={Colors.mediumGray}
          />
        </View>
      </View>

      {showRadio && (
        <View style={{marginRight: 8}}>
          <RadioButton
            accessibilityLabelText={''}
            accessibilityHintText={''}
            containerStyle={{marginVertical: 20}}
            disabled={false}
            key={`radio`}
            checked={selected}
            handleCheck={value => {
              //setWasChanged(true);
              select(index);
              //setCurrent(option.id);
            }}
            text={``}
          />
        </View>
      )}
    </Pressable>
  );
};

const AppliancePairing = ({
  selectedDevice,
  devices,
  navigation,
  pairDevices,
  getDeviceList2,
  pairSelectedDevice,
  unpairDevices,
  user,
  getDeviceListPairUnpair,
  idsSelectedDevice,
}) => {
  const [listAvailable, setListAvailable] = useState([]);
  const [successfullyPaired, setSuccessfullyPaired] = useState(false);
  const [pairDifferent, setPairDifferent] = useState(false);
  const [unpair, setUnpair] = useState(false);
  const [selectedDeviceAux, setSelectedDeviceAux] = useState(undefined);
  const [pairDifferentModal, setPairDifferentModal] = useState(false);
  const [updateList, setUpdateList] = useState(true);

  const selectAppliance = id => {
    let newList = [...listAvailable];
    newList.forEach((d, i) => {
      if (d.selected) {
        d.selected = false;
      }
      if (id === i) {
        d.selected = true;
      }
    });

    setListAvailable(newList);
  };

  useEffect(() => {
    if (navigation.state.params.isThermostat) {
      setSelectedDeviceAux(
        devices.filter(d => d.macId === selectedDevice.macId)[0],
      );
    } else {
      setSelectedDeviceAux(
        devices.filter(d => d.macId === idsSelectedDevice)[0],
      );
    }

    if (updateList) {
      setListAvailable(returnListToPair());
    }
  }, []);

  useEffect(() => {
    if (navigation.state.params.isThermostat) {
      setSelectedDeviceAux(
        devices.filter(d => d.macId === selectedDevice.macId)[0],
      );
    } else {
      setSelectedDeviceAux(
        devices.filter(d => d.macId === idsSelectedDevice)[0],
      );
    }
    if (updateList) {
      setUpdateList(false);
      setListAvailable(returnListToPair());
    }
  }, [devices]);

  const returnListToPair = () => {
    let deviceList = devices.filter(
      d =>
        d.deviceType.includes(
          navigation.state.params.isThermostat ? 'IDS Arctic' : 'BCC10',
        ) && !d.paired,
    );
    deviceList.forEach(d => {
      d.selected = false;
    });
    return deviceList;
  };

  const returnAvailableList = () => {
    let deviceList = devices.filter(
      d =>
        d.deviceType.includes(
          navigation.state.params.isThermostat ? 'IDS Arctic' : 'BCC10',
        ) && !d.paired,
    );
    return deviceList;
  };

  const getPairedDeviceName = macId => {
    return devices.filter(d => d.macId === macId)[0].deviceName;
  };

  const showInformation = () => {
    if (listAvailable.length === 0 && !selectedDeviceAux.paired) {
      return (
        <CustomText
          text={
            'There are no elegible appliances that\nyour device can be paired to'
          }
          font="bold"
        />
      );
    } else {
      if (selectedDeviceAux.paired && !pairDifferent) {
        return (
          <View
            style={{
              flex: 1,
              marginHorizontal: 16,
              justifyContent: 'space-between',
            }}>
            <View>
              <CustomText
                text={`Your ${
                  navigation.state.params.isThermostat ? 'device' : 'unit'
                } is currently paired to:`}
                align="left"
                style={{marginBottom: 24}}
              />
              <DeviceToPairTile
                isThermostat={navigation.state.params.isThermostat}
                deviceName={getPairedDeviceName(
                  selectedDeviceAux.pairedDevice.macId
                    ? selectedDeviceAux.pairedDevice.macId
                    : '',
                )}
                macId={
                  selectedDeviceAux.pairedDevice.macId
                    ? selectedDeviceAux.pairedDevice.macId
                    : ''
                }
                showRadio={false}
              />
            </View>
            <View>
              <Button
                disabled={returnAvailableList().length === 0}
                text={'Paired To A Different Appliance'}
                type="primary"
                style={{
                  marginBottom: 8,
                }}
                onPress={() => {
                  setPairDifferent(true);
                  //setPairDifferentModal(true);
                }}
              />
              <Button
                text={'Unpair'}
                type="secondary"
                onPress={() => {
                  setUnpair(true);
                }}
              />
            </View>
          </View>
        );
      } else if (!selectedDeviceAux.paired || pairDifferent) {
        return (
          <View style={{flex: 1, marginHorizontal: 16}}>
            <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
              {listAvailable.map((d, i) => {
                return (
                  <DeviceToPairTile
                    key={d.macId}
                    isThermostat={navigation.state.params.isThermostat}
                    deviceName={d.deviceName}
                    macId={d.macId}
                    index={i}
                    select={selectAppliance}
                    selected={d.selected}
                  />
                );
              })}
            </ScrollView>
            <Button
              disabled={listAvailable.filter(d => d.selected).length === 0}
              text={'Pair'}
              testID="pairButton"
              type="primary"
              onPress={() => {
                setUpdateList(true);
                if (pairDifferent) {
                  setPairDifferentModal(true);
                } else {
                  let macIdToSend =
                    listAvailable.filter(d => d.selected).length === 1
                      ? listAvailable.filter(d => d.selected)[0].macId
                      : '';
                  let jsonToSend = navigation.state.params.isThermostat
                    ? {
                        device_id: selectedDeviceAux.macId,
                        gatewayId: macIdToSend,
                      }
                    : {
                        device_id: macIdToSend,
                        gatewayId: selectedDeviceAux.macId,
                      };
                  pairDevices(jsonToSend, response => {
                    if (response.bccidsparingdone) {
                      setSuccessfullyPaired(true);
                      setPairDifferent(false);
                      getDeviceListPairUnpair({
                        userId: user.attributes.sub,
                      });
                      let newList = [...listAvailable];
                      newList.forEach(d => {
                        d.selected = false;
                      });
                      setListAvailable(newList);
                    } else {
                      showToast('Unable to Pair', 'error');
                      //setPairingUnsuccessful(true);
                    }
                  });
                }
              }}
            />
          </View>
        );
      }
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Image
        style={{height: 8, width: '100%'}}
        source={require('../assets/images/header_ribbon.png')}
      />
      <View
        style={{
          alignItems: 'center',
          marginTop: 24,
          marginBottom: 29,
        }}>
        <SCREEN_IMAGE />
      </View>

      <CustomText
        text={
          'To perform pairing, please select the\nappliance you want to pair'
        }
        style={{marginBottom: 22}}
      />
      {selectedDeviceAux ? showInformation() : null}
      {selectedDeviceAux && (
        <View>
          <ModalComponent
            modalVisible={successfullyPaired}
            closeModal={() => setSuccessfullyPaired(false)}>
            <View style={{width: '97%', alignItems: 'center'}}>
              <SUCCESS />
              <CustomText
                text={'Pairing Successful'}
                size={21}
                font="medium"
                style={{marginBottom: 16, marginTop: 16}}
              />
              <CustomText
                text={'Thermostat successfully paired to\nthe heat pump'}
                style={{marginBottom: 32}}
              />
              <Button
                type="primary"
                text={'Close'}
                style={{width: '100%'}}
                testID="closeModal"
                onPress={() => {
                  setSuccessfullyPaired(false);
                }}
              />
            </View>
          </ModalComponent>

          <ModalComponent
            modalVisible={pairDifferentModal}
            closeModal={() => setPairDifferentModal(false)}>
            <View style={{width: '97%', alignItems: 'center'}}>
              <CustomText
                text={`This IDS Arctic heat pump with\nSN: ${
                  selectedDeviceAux.pairedDevice.macId
                    ? selectedDeviceAux.pairedDevice.macId
                    : ''
                }\nis already paired. Pairing it with this\nunit will unpair it from its existing\nappliance. Are you sure you want\nto proceed?`}
                style={{marginBottom: 30}}
              />
              <Button
                style={{width: '100%'}}
                text={'Unpair & Connect'}
                type="primary"
                testID="unpairAndConnect"
                onPress={() => {
                  setUpdateList(true);

                  setPairDifferentModal(false);
                  let jsonToSendUnpair = navigation.state.params.isThermostat
                    ? {
                        device_id: selectedDeviceAux.macId,
                        gatewayId: selectedDeviceAux.pairedDevice.macId
                          ? selectedDeviceAux.pairedDevice.macId
                          : '',
                      }
                    : {
                        device_id: selectedDeviceAux.pairedDevice.macId
                          ? selectedDeviceAux.pairedDevice.macId
                          : '',
                        gatewayId: selectedDeviceAux.macId,
                      };
                  unpairDevices(jsonToSendUnpair, _ => {
                    let jsonToSendPair = navigation.state.params.isThermostat
                      ? {
                          device_id: selectedDeviceAux.macId,
                          gatewayId: listAvailable.filter(d => d.selected)[0]
                            .macId,
                        }
                      : {
                          device_id: listAvailable.filter(d => d.selected)[0]
                            .macId,
                          gatewayId: selectedDeviceAux.macId,
                        };
                    pairDevices(jsonToSendPair, response => {
                      setPairDifferent(false);
                      if (response.bccidsparingdone) {
                        let newList = [...listAvailable];
                        newList.forEach(d => {
                          d.selected = false;
                        });
                        setListAvailable(newList);
                        getDeviceListPairUnpair({
                          userId: user.attributes.sub,
                        });
                      } else {
                        showToast('Unable to Pair', 'error');
                      }
                    });
                  });
                }}
              />
              <Button
                style={{width: '100%'}}
                text={'Cancel'}
                testID="cancelUnpairAndConnect"
                type="secondary"
                onPress={() => setPairDifferentModal(false)}
              />
            </View>
          </ModalComponent>

          <ModalComponent
            modalVisible={unpair}
            closeModal={() => setUnpair(false)}>
            <View style={{width: '97%', alignItems: 'center'}}>
              <QUESTION />
              <CustomText
                text={'Are you sure?'}
                size={21}
                font="medium"
                style={{marginBottom: 16, marginTop: 16}}
              />

              <CustomText
                text={'Are you sure you want to unpair\nyour device?'}
                style={{marginBottom: 32}}
              />
              <Button
                type="primary"
                text={'No'}
                style={{width: '100%', marginBottom: 8}}
                onPress={() => setUnpair(false)}
              />
              <Button
                type="secondary"
                text={'Yes'}
                style={{width: '100%'}}
                onPress={() => {
                  setUnpair(false);
                  let jsonToSendUnpair = navigation.state.params.isThermostat
                    ? {
                        device_id: selectedDeviceAux.macId,
                        gatewayId: selectedDeviceAux.pairedDevice.macId
                          ? selectedDeviceAux.pairedDevice.macId
                          : '',
                      }
                    : {
                        device_id: selectedDeviceAux.pairedDevice.macId
                          ? selectedDeviceAux.pairedDevice.macId
                          : '',
                        gatewayId: selectedDeviceAux.macId,
                      };
                  unpairDevices(jsonToSendUnpair, response => {
                    getDeviceListPairUnpair({
                      userId: user.attributes.sub,
                    });
                    setUpdateList(true);
                    let newList = returnListToPair();
                    newList.forEach(d => {
                      d.selected = false;
                    });
                    setListAvailable(newList);
                  });
                }}
              />
            </View>
          </ModalComponent>
        </View>
      )}
    </View>
  );
};

const mapDispatchToProps = {
  pairDevices,
  getDeviceList2,
  pairSelectedDevice,
  unpairDevices,
  getDeviceListPairUnpair,
};

const mapStateToProps = state => {
  return {
    selectedDevice: state.homeOwner.selectedDevice,
    devices: state.homeOwner.deviceList2,
    user: state.auth.user,
    idsSelectedDevice: state.homeOwner.idsSelectedDevice,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppliancePairing);
