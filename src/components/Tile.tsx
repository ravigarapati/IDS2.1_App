import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  Pressable,
} from 'react-native';
import {connect} from 'react-redux';
import {BoschIcon, Button, CustomText} from './../components';
import Dropdown from './Dropdown';
import ModalComponent from './ModalComponent';
import {
  setSelectedDevice,
  getDeviceStatus,
  updateThermostatSelected,
  updateSelectedDevice,
  updateIdsSelectedDeviceAccess,
  selectBcc,
  newDeviceInfo,
  pairDevices,
  updateSelectedIdsOdu,
  unpairDevices,
  getDeviceList2,
  updateIdsSelectedDevice,
  cleanSelectedDevice,
  setUnitNameIds,
} from '../store/actions/HomeOwnerActions';
import {Dictionary} from '../utils/dictionary';
import {Colors} from '../styles';
import BCC100 from '../assets/images/BCC100.svg';
import BCC50 from '../assets/images/BCC50.svg';
import OPTIONS_BUTTON from '../assets/images/options.svg';
import IDS from '../assets/images/Heat-Pump.svg';
import IDS3 from '../assets/images/Heat-Pump-3.svg';
import {Icons} from '../utils/icons';

const OFFLINE_STATUS = require('./../assets/images/offline-device.png');
const ANALYSIS = require('./../assets/images/analysis.png');
const ENERGY_SAVINGS = require('./../assets/images/utilityEnergy.png');
const ALERT_ICON = require('./../assets/images/alert-warning.png');
const OFF_THERMOSTAT = require('./../assets/images/Power-off.png');

const COOLING_IMAGE = require('./../assets/images/cooling-mode.png');
const HEATING_IMAGE = require('./..//assets/images/heat.png');
const AUTO_IMAGE = require('./../assets/images/auto.png');
const EM_HEAT_IMAGE = require('./../assets/images/em-heat.png');

type TileProps = {
  deviceName: string;
  deviceType: string;
  isThermostat: boolean;
  isOn: boolean;
  isMonitoring?: boolean;
  setPoint?: number;
  current?: number;
  mode?: number;
  tileFunction: any;
  deleteFunction: any;
  isFahrenheit: boolean;
  macId: string;
  navigation: any;
  setSelectedDevice: any;
  heatingSetpoint: number;
  coolingSetpoint: number;
  selectedDevice: any;
  getDeviceStatus: any;
  updateThermostatSelected: any;
  isThermostatSelected: any;
  energySaveMode?: boolean;
  updateIdsSelectedDeviceAccess?: any;
  selectBcc?: any;
  paired?: boolean;
  pairedDevice?: any;
  newDeviceInfo?: any;
  updateSelectedIdsOdu?: any;
  setUnitNameIds?:any;
  oduModelNumber?: string;
  unpairDevices?: any;
  pairFunctionality?: boolean;
  getDeviceList2?: any;
  user?: any;
  contractorMonitoringStatus?: boolean;
  oduInstallationAddress?: any;
  createStatusInterval: any;
  clearStatusInterval: any;
  previousBcc?: any;
  cleanSelectedDevice: any;
  serviceStartDate?: string;
};

const Tile = ({
  contractorMonitoringStatus = undefined,
  oduInstallationAddress = undefined,
  deviceName,
  deviceType,
  isThermostat,
  isOn,
  isMonitoring,
  setPoint,
  current,
  mode,
  deleteFunction,
  tileFunction,
  isFahrenheit,
  macId,
  navigation,
  setSelectedDevice,
  coolingSetpoint,
  heatingSetpoint,
  selectedDevice,
  getDeviceStatus,
  updateThermostatSelected,
  isThermostatSelected,
  energySaveMode,
  updateIdsSelectedDeviceAccess,
  selectBcc,
  paired,
  pairedDevice,
  newDeviceInfo,
  updateSelectedIdsOdu,
  setUnitNameIds,
  oduModelNumber,
  unpairDevices,
  pairFunctionality,
  getDeviceList2,
  createStatusInterval,
  clearStatusInterval,
  user,
  serviceStartDate,
  previousBcc,
  cleanSelectedDevice,
}: TileProps) => {
  const [editColor, setEditColor] = useState('black');
  const [deleteColor, setDeleteColor] = useState('black');
  const [opened, setOpened] = useState(false);
  const [opened1, setOpened1] = useState(false);
  const [editBackgroundColor, setEditBackgroundcolor] = useState(
    'rgba(0, 73, 117, 1)',
  );
  const [notAvailableModal, setNotAvailableModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteBackgroundColor, setDeleteBackgroundColor] = useState(
    'rgba(0, 73, 117, 1)',
  );
  const [updatedSelectedDevice, setUpdatedSelectedDevice] = useState(false);
  const [alreadyGotStatus, setAlreadyGotStatus] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [pressedButton, setPressedButton] = useState(false);
  const [unpair, setUnpair] = useState(false);

  useEffect(() => {
    if (updatedSelectedDevice && selectedDevice.roomTemp != undefined) {
      if (isThermostatSelected && pressedButton) {
        setPressedButton(false);
        setFirstTime(false);
        updateThermostatSelected({data: false});
        navigation.navigate('BCCDashboard', {selectedDevice: selectedDevice});
      }
    } else if (
      updatedSelectedDevice &&
      selectedDevice.roomTemp == undefined &&
      pressedButton
    ) {
      if (alreadyGotStatus) {
        /*getDeviceStatus(
          {
            deviceId: macId,
          },
          response => {
            if (response.message && response.message === 'Device is offline') {
              setNotAvailableModal(true);
            }
          },
        );*/
      }
    }
  }, [selectedDevice]);

  const renderMode = () => {
    let modeName = '';
    switch (mode) {
      case 0:
        modeName = 'Off';
        break;
      case 1:
        modeName = 'Cooling';
        break;
      case 2:
        modeName = 'Heating';
        break;
      case 3:
        modeName = 'Auto';
        break;
      case 4:
        modeName = 'Em Heat';
        break;
    }
    return (
      <CustomText
        allowFontScaling={true}
        accessibilityLabelText={`${modeName}.`}
        text={` ${modeName}`}
        font={'medium'}
        size={12}
        color={'#494949'}
      />
    );
  };

  const currentTemperatureMode = () => {
    return isFahrenheit ? 'Fahrenheit' : 'Celcius';
  };

  const renderThermostatIcon = () => {
    switch (mode) {
      case 1:
        return <Image source={COOLING_IMAGE} />;
      case 2:
        return <Image source={HEATING_IMAGE} />;
      case 4:
        return <Image style={Styles.emHeatIcon} source={EM_HEAT_IMAGE} />;
      case 3:
        return <Image source={AUTO_IMAGE} />;
      case 0:
        return (
          <Image
            style={Styles.offThermostatIcon}
            resizeMode="stretch"
            source={OFF_THERMOSTAT}
          />
        );
      default:
    }
  };

  const renderModeDisplay = () => {
    if (isThermostat) {
      if (mode != -1) {
        if (!isOn) {
          return (
            <View accessible={true} style={Styles.statusTileContainer}>
              <View style={Styles.tileThermostatOffStatus}>
                <Image
                  style={Styles.marginHorizontal4}
                  source={OFFLINE_STATUS}
                />
                <CustomText
                  allowFontScaling={true}
                  style={Styles.marginVertical7}
                  text={Dictionary.tile.status}
                  font={'medium'}
                  size={12}
                />
                <CustomText
                  allowFontScaling={true}
                  text={Dictionary.tile.offlineDevice}
                  font={'medium'}
                  size={12}
                  color={'#494949'}
                />
              </View>
            </View>
          );
        } else {
          return (
            <View accessible={true} style={Styles.statusTileContainer}>
              <View style={Styles.tilethermostatOnStatus}>
                <View style={Styles.marginRight10}>
                  {renderThermostatIcon()}
                </View>

                <CustomText
                  allowFontScaling={true}
                  style={Styles.marginVertical7}
                  text={Dictionary.tile.status}
                  font={'medium'}
                  size={12}
                />
                {renderMode()}
              </View>
              {mode !== 0 ? <View style={Styles.thermostatOnDivider} /> : null}

              <View style={Styles.thermostatOnSubStatus}>
                <View style={Styles.flexDirectionRow}>
                  {mode === 0 ? null : (
                    <CustomText
                      allowFontScaling={true}
                      text={Dictionary.tile.setpoint}
                      size={12}
                    />
                  )}
                  {mode === 1 || mode === 4 || mode === 2 ? (
                    <CustomText
                      allowFontScaling={true}
                      accessibilityLabelText={`${
                        mode === 1 ? coolingSetpoint : heatingSetpoint
                      }${currentTemperatureMode()}°.`}
                      text={`${
                        mode === 1 ? coolingSetpoint : heatingSetpoint
                      }°`}
                      //allowFontScaling={true}
                      size={12}
                      font={'bold'}
                      color={mode === 1 ? Colors.mediumBlue : Colors.mediumRed}
                    />
                  ) : mode === 3 ? (
                    <View style={{flexDirection: 'row'}}>
                      <CustomText
                        allowFontScaling={true}
                        //allowFontScaling={true}
                        accessibilityLabelText={`${heatingSetpoint}${currentTemperatureMode()}°`}
                        text={`${heatingSetpoint}° `}
                        size={12}
                        font={'bold'}
                        color={Colors.mediumRed}
                      />
                      <CustomText
                        allowFontScaling={true}
                        //allowFontScaling={true}
                        accessibilityLabelText={`${coolingSetpoint}${currentTemperatureMode()}°.`}
                        text={`${coolingSetpoint}°`}
                        size={12}
                        font={'bold'}
                        color={Colors.mediumBlue}
                      />
                    </View>
                  ) : null}
                </View>
                <CustomText
                  allowFontScaling={true}
                  //allowFontScaling={true}
                  accessibilityLabelText={`${
                    Dictionary.tile.currentTemperature
                  } ${current}${currentTemperatureMode()}°`}
                  text={`${current}°`}
                  size={20}
                  color={'#42464A'}
                />
              </View>
            </View>
          );
        }
      }
    } else {
      return (
        <View accessible={true} style={Styles.statusTileContainer}>
          <View style={Styles.heatpumpStatus}>
            <Image
              style={[
                Styles.heatpumpImage,
                energySaveMode ? {marginHorizontal: 13} : {},
              ]}
              source={
                isOn
                  ? energySaveMode
                    ? ENERGY_SAVINGS
                    : ANALYSIS
                  : OFFLINE_STATUS
              }
            />

            <CustomText
              allowFontScaling={true}
              style={{marginVertical: 7}}
              text={Dictionary.tile.status}
              font={'medium'}
              size={12}
            />
            <CustomText
              allowFontScaling={true}
              text={
                isOn
                  ? isMonitoring
                    ? energySaveMode
                      ? ' Utility Energy Savings On'
                      : Dictionary.tile.monitoringOn
                    : Dictionary.tile.monitoringOff
                  : Dictionary.tile.unitOffline
              }
              font={'medium'}
              size={12}
              color={Colors.gray}
            />
          </View>
        </View>
      );
    }
  };

  const goToDashboard = () => {
    if (isThermostat) {
      setAlreadyGotStatus(true);
      selectBcc(macId);
      setUpdatedSelectedDevice(true);
      setPressedButton(true);
      navigation.navigate('BCCDashboard', {
        selectedDevice: selectedDevice,
        currentMacId: macId,
        deviceName: deviceName,
        deviceMode: mode,
        deviceType: deviceType,
      });
    } else {
    }
  };

  return (
    <View>
      <Pressable
        accessible={false}
        testID="GoToDashboard"
        onPress={
          isOn && isThermostat === true
            ? () => goToDashboard()
            : deviceType === 'IDS Premium Connected' ||
              deviceType === 'IDS Arctic'
            ? () => {
                updateIdsSelectedDevice(macId, serviceStartDate);
                updateIdsSelectedDeviceAccess(macId, serviceStartDate);
                updateSelectedIdsOdu(oduModelNumber);
                setUnitNameIds(deviceName)
                navigation.navigate('Usage', {
                  deviceData: deviceType,
                  deviceId: macId,
                });
              }
            : () => setNotAvailableModal(true)
        }
        style={Styles.tileContainer}>
        <View style={[Styles.tileInfoContainer, Styles.alignItemsCenter]}>
          <View style={[Styles.imageContainer, {justifyContent: 'center'}]}>
            {isThermostat ? (
              deviceType === 'BCC50' ? (
                <BCC50 fill="#000" />
              ) : (
                <BCC100 fill="#000" />
              )
            ) : deviceType === 'IDS Premium Connected' ? (
              <IDS fill="#000" />
            ) : (
              <IDS3 fill="#000" />
            )}
          </View>

          <View style={[Styles.tileDeviceInfoContainer]}>
            <View accessible={true} style={[Styles.InfoContainer]}>
              <CustomText
                allowFontScaling={true}
                accessibilityLabelText={`${deviceName}.`}
                text={deviceName}
                font={'medium'}
                align={'left'}
                noOfLines={1}
              />
              <CustomText
                allowFontScaling={true}
                style={Styles.marginTopMinus2}
                text={deviceType}
                accessibilityLabelText={`Device type: ${deviceType}. Button. Activate to navigate to the device dashboard screen.`}
                font={'medium'}
                size={12}
                align={'left'}
                color={'#71767C'}
              />
            </View>
            <View style={Styles.justifyContentCenter}>
              <Dropdown
                accessibilityLabelText={Dictionary.tile.openEditDeleteMenuLabel}
                accessibilityHintText={Dictionary.tile.openEditDeleteMenuHint}
                onPressDown={() => {}}
                opened={opened1}
                setOpened={setOpened1}
                dropdownStyle={Styles.dropdownStyle}
                overlayStyle={Styles.overlayStyle}
                options={[
                  <TouchableHighlight
                    testID="Edit"
                    key={'Edit'}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={Dictionary.tile.editButtonLabel}
                    accessibilityHint={Dictionary.tile.editButtonHint}
                    underlayColor={editBackgroundColor}
                    style={Styles.optionStyle}
                    onPressIn={() => {
                      setEditColor('white');
                      setEditBackgroundcolor('white');
                    }}
                    onPressOut={() => {
                      setOpened(false);
                      setOpened1(false);
                      setEditColor('black');
                      clearStatusInterval();
                      setEditBackgroundcolor('rgba(0, 73, 117, 1)');
                      navigation.navigate('EditDevice', {
                        isThermostat: isThermostat,
                        description: deviceName,
                        macId: macId,
                        installationAddress: oduInstallationAddress,
                        contractorMonitoringStatus: contractorMonitoringStatus,
                        createStatusInterval: createStatusInterval,
                        deviceType: deviceType,
                      });
                    }}>
                    <Text
                      style={[
                        Styles.optionWrapper,
                        {
                          color: editColor,
                        },
                      ]}>
                      {Dictionary.tile.edit}
                    </Text>
                  </TouchableHighlight>,
                  <TouchableHighlight
                    testID="Delete"
                    key={'Delete'}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={Dictionary.tile.deleteButtonLabel}
                    accessibilityHint={Dictionary.tile.deleteButtonHint}
                    underlayColor={deleteBackgroundColor}
                    style={Styles.optionStyle}
                    onPressIn={() => {
                      setDeleteColor('white');
                      setDeleteBackgroundColor('white');
                    }}
                    onPressOut={() => {
                      setOpened(false);
                      setOpened1(false);
                      setDeleteColor('black');

                      setDeleteBackgroundColor('rgba(0, 73, 117, 1)');
                      setDeleteModal(true);
                    }}>
                    <Text
                      style={[
                        Styles.optionWrapper,
                        {
                          color: deleteColor,
                        },
                      ]}>
                      {Dictionary.tile.delete}
                    </Text>
                  </TouchableHighlight>,
                ]}>
                <View
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={Dictionary.tile.threeDotsLabel}
                  accessibilityHint={Dictionary.tile.threeDotsHint}
                  style={Styles.threeDotsStyle}>
                  <OPTIONS_BUTTON fill="#000" />
                </View>
              </Dropdown>
            </View>
          </View>
        </View>
        {renderModeDisplay()}
      </Pressable>
      <ModalComponent
        modalVisible={notAvailableModal}
        closeModal={() => setNotAvailableModal(false)}>
        <View style={[Styles.width97Percent, Styles.justifyContentCenter]}>
          <Image style={Styles.checkWifiImage} source={ALERT_ICON} />
          <CustomText
            allowFontScaling={true}
            style={Styles.marginTop37}
            align="left"
            text={Dictionary.tile.checkWifi}
          />
          <Button
            style={Styles.marginTop49}
            type="primary"
            text={'Close'}
            onPress={() => {
              setNotAvailableModal(false);
              if (deviceType === 'BCC50') {
                goToDashboard();
              }
            }}
          />
        </View>
      </ModalComponent>
      <ModalComponent
        modalVisible={deleteModal}
        closeModal={() => setDeleteModal(false)}>
        <View style={Styles.width97Percent}>
          <CustomText
            allowFontScaling={true}
            style={Styles.marginBottom56}
            accessibilityLabelText={Dictionary.tile.deleteConfirmationLabel}
            align="left"
            text={Dictionary.tile.deleteConfirmationHint}
          />
          <View style={Styles.marginBottom10}>
            <Button
              accessibilityLabelText={Dictionary.tile.yes}
              accessibilityHintText={Dictionary.tile.yesButtonHint}
              type="primary"
              text={Dictionary.button.yes}
              onPress={() => {
                deleteFunction();
                setDeleteModal(false);
              }}
            />
          </View>

          <Button
            accessibilityLabelText={Dictionary.tile.no}
            accessibilityHintText={Dictionary.tile.noButtonHint}
            type="secondary"
            text={Dictionary.button.no}
            onPress={() => setDeleteModal(false)}
          />
        </View>
      </ModalComponent>
      <ModalComponent modalVisible={unpair} closeModal={() => setUnpair(false)}>
        <View style={Styles.width97Percent}>
          <View style={Styles.icon}>
            <BoschIcon color="#8B2284" name={Icons.questionFrame} size={76} />
          </View>
          <CustomText
            allowFontScaling={true}
            align="center"
            size={22}
            font="medium"
            text={'Are you sure?'}
            style={{marginBottom: 20}}
          />
          <CustomText
            allowFontScaling={true}
            style={Styles.marginBottom56}
            accessibilityLabelText={Dictionary.tile.deleteConfirmationLabel}
            align="center"
            text={`Do you want to unpair your thermostat\nMAC ID: ${
              deviceType.includes('BCC1') ? macId : pairedDevice.macId
            } from heat pump\nSN: ${
              deviceType.includes('BCC1') ? pairedDevice.macId : macId
            }`}
          />
          <View style={Styles.marginBottom10}>
            <Button
              testID="closeUnpair"
              accessibilityLabelText={Dictionary.tile.no}
              accessibilityHintText={Dictionary.tile.noButtonHint}
              type="primary"
              text={Dictionary.button.no}
              onPress={() => {
                setUnpair(false);
              }}
            />
          </View>

          <Button
            accessibilityLabelText={Dictionary.tile.yes}
            accessibilityHintText={Dictionary.tile.yesButtonHint}
            type="secondary"
            text={Dictionary.button.yes}
            onPress={() => {
              setUnpair(false);
              if (deviceType === 'IDS Arctic') {
                unpairDevices(
                  {
                    device_id: pairedDevice.macId,
                    gatewayId: macId,
                  },
                  () => {
                    getDeviceList2({userId: user.attributes.sub});
                  },
                );
              } else if (deviceType.includes('BCC10')) {
                unpairDevices(
                  {
                    device_id: macId,
                    gatewayId: pairedDevice.macId,
                  },
                  () => {
                    getDeviceList2({userId: user.attributes.sub});
                  },
                );
              }
            }}
          />
        </View>
      </ModalComponent>
    </View>
  );
};

const Styles = StyleSheet.create({
  tileContainer: {
    flexDirection: 'column',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 5,
    flex: 0,
  },
  tileInfoContainer: {
    flexDirection: 'row',
    padding: 15.3,
    paddingRight: 0,
  },
  tileDeviceInfoContainer: {
    flexDirection: 'row',
    marginLeft: 15,
    flex: 1,
    justifyContent: 'space-between',
  },
  InfoContainer: {
    flexDirection: 'column',
    width: '85%',
  },
  deviceName: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  deviceType: {
    fontSize: 10,
  },
  threeDots: {},
  statusTileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#BFC0C2',
  },
  statusText: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  tileThermostatOffStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tilethermostatOnStatus: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 17,
    alignItems: 'center',
    width: '45%',
  },
  thermostatOnDivider: {
    flex: 0,
    height: '50%',
    width: 1,
    borderRightWidth: 1,
    borderRightColor: '#BFC0C2',
    alignSelf: 'stretch',
    marginVertical: 8,
  },
  thermostatOnSubStatus: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 14,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  heatpumpStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heatpumpOffImage: {
    marginHorizontal: 4,
  },
  heatpumpImage: {
    marginHorizontal: 11,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  marginTop5: {
    marginTop: 5,
  },
  imageContainer: {
    height: 32,
    width: 40,
    alignItems: 'center',
  },
  optionsContainer: {
    width: 95,
    marginTop: -72,
  },
  optionWrapper: {
    fontSize: 16,
    padding: 15,
    flex: 1,
    height: '100%',
    width: '100%',
  },
  emHeatIcon: {
    marginHorizontal: 3,
  },
  offThermostatIcon: {
    height: 18,
    width: 18,
    marginHorizontal: 3,
  },
  marginHorizontal4: {marginHorizontal: 4},
  marginVertical7: {marginVertical: 7},
  marginRight10: {marginRight: 10},
  marginTopMinus2: {marginTop: -2},
  justifyContentCenter: {justifyContent: 'center'},
  dropdownStyle: {
    marginHorizontal: 0,
    width: '22%',
    marginLeft: '70%',
  },
  overlayStyle: {
    width: '70%',
    height: '100%',
  },
  optionStyle: {
    height: '100%',
    width: '100%',
    flex: 1,
  },
  threeDotsStyle: {
    paddingHorizontal: 15.3,
    paddingVertical: 10,
  },
  marginTop37: {marginTop: 37},
  marginTop49: {marginTop: 49},
  marginBottom56: {marginBottom: 56},
  marginBottom10: {marginBottom: 10},
  width97Percent: {width: '100%'},
  checkWifiImage: {alignSelf: 'center', marginTop: 12},
  icon: {
    alignSelf: 'center',
  },
});

const mapStateToProps = state => {
  return {
    isFahrenheit: state.homeOwner.actualWeatherOnFahrenheit,
    selectedDevice: state.homeOwner.selectedDevice,
    isThermostatSelected: state.homeOwner.isThermostatSelected,
    user: state.auth.user,
    previousBcc: state.homeOwner.previousBcc,
  };
};

const mapDispatchToProps = {
  setSelectedDevice,
  getDeviceStatus,
  updateThermostatSelected,
  updateSelectedDevice,
  updateIdsSelectedDeviceAccess,
  selectBcc,
  newDeviceInfo,
  updateSelectedIdsOdu,
  unpairDevices,
  getDeviceList2,
  updateIdsSelectedDevice,
  cleanSelectedDevice,
  setUnitNameIds
};

export default connect(mapStateToProps, mapDispatchToProps)(Tile);
