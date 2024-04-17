import React, {Component, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {MenuButton} from './../navigations/NavConfig';
import {Button} from '../components';
import {CustomText, BoschIcon, Dropdown, DevicesModal} from '../components';
import {Icons} from '../utils/icons';
import {Dictionary} from '../utils/dictionary';
import {Colors} from '../styles';
import {connect, useSelector, useDispatch} from 'react-redux';
import {prCleanInfo} from '../store/actions/ContractorActions';
import ModalComponent from '../components/ModalComponent';
import Question from './../assets/images/question-frame.svg';
import BOSCH_LOGO from '../assets/images/BoschLogo.svg';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const defaultThermostatInformation = [
  {
    name: Dictionary.addDevice.bcc100,
    image: '',
    checked: false,
  },
  {
    name: Dictionary.addDevice.bcc50,
    image: '',
    checked: false,
  },
];

const defaultHeatpumpInformation = [
  {
    name: 'IDS Premium Connected',
    image: '',
    checked: false,
  },
  {
    name: 'IDS Arctic',
    image: '',
    checked: false,
  },
];

class AddUnitHomeowner extends Component {
  state = {
    selectedDevice: '',
    isFocused: false,
    modalVisible: false,
    enableButton: true,
    enableSubmitButton: false,
    blurScreen: false,
    heatpumpColor: 'black',
    heatpumpBackground: 'rgba(0, 73, 117, 1)',
    thermostatColor: 'black',
    thermostatBackground: 'rgba(0, 73, 117, 1)',
    opened: false,
    opened1: false,
    isFirstOpened: true,
    thermostats: JSON.parse(JSON.stringify(defaultThermostatInformation)),
    auxThermostats: JSON.parse(JSON.stringify(defaultThermostatInformation)),
    heatPumps: JSON.parse(JSON.stringify(defaultHeatpumpInformation)),
    auxHeatPumps: JSON.parse(JSON.stringify(defaultHeatpumpInformation)),
    selected: undefined,
    selectedHeatpump: undefined,
  };

  checkRadioButton = name => {
    const auxThermostats = [...this.state.auxThermostats];
    auxThermostats.map(t => {
      t.checked = false;
      if (name === t.name) {
        t.checked = true;
      }
    });
    this.setState({
      auxThermostats: auxThermostats,
      enableButton: false,
    });
  };

  checkRadioButtonHeatpump = name => {
    const auxHeatpumps = [...this.state.auxHeatPumps];
    auxHeatpumps.map(t => {
      t.checked = false;
      if (name === t.name) {
        t.checked = true;
      }
    });
    this.setState({
      auxHeatpumps: auxHeatpumps,
      enableButton: false,
    });
  };

  questionBCC50 = false;

  sendCheckDevice = () => {
    this.setState(
      {
        modalVisible: false,
        thermostats: [...this.state.auxThermostats],
        blurScreen: false,
      },
      () => {
        this.setState({
          enableButton: true,
          enableSubmitButton:
            this.state.thermostats.filter(t => t.checked).length !== 0,
          auxThermostats: JSON.parse(
            JSON.stringify(defaultThermostatInformation),
          ),
        });
      },
    );
    if (this.state.auxThermostats[1].checked) {
      this.questionBCC50 = true;
    }
  };

  sendCheckHeatpump = () => {
    this.setState(
      {
        modalVisible: false,
        heatPumps: [...this.state.auxHeatPumps],
        blurScreen: false,
      },
      () => {
        this.setState({
          enableButton: true,
          enableSubmitButton:
            this.state.heatPumps.filter(t => t.checked).length !== 0,
          auxHeatPumps: JSON.parse(JSON.stringify(defaultHeatpumpInformation)),
        });
      },
    );
  };

  cancelModal = () => {
    this.setState({
      modalVisible: false,
      enableButton: true,
      blurScreen: false,
      auxThermostats: JSON.parse(JSON.stringify(defaultThermostatInformation)),
    });
  };

  submit = () => {
    this.setState({
      selectedDevice: '',
      isFocused: false,
      isFirstOpened: true,
      enableSubmitButton: false,
      thermostats: JSON.parse(JSON.stringify(defaultThermostatInformation)),
      auxThermostats: JSON.parse(JSON.stringify(defaultThermostatInformation)),
    });
    if (this.state.selectedDevice == Dictionary.addDevice.heatPump) {
      let selectedIds =
        this.state.selectedDevice === Dictionary.addDevice.heatPump &&
        this.state.heatPumps.filter(t => t.checked).length !== 0;
      let isIdsSelected = selectedIds
        ? this.state.heatPumps.filter(t => t.checked)[0].name ===
          Dictionary.addDevice.IDSPremiumConnected
        : null;
      this.props.navigation.navigate('addIds', {is30: !isIdsSelected});
    } else {
      const selectedDevice = this.state.thermostats.filter(t => t.checked)[0];
      this.props.navigation.navigate('addBcc', {device: selectedDevice.name});
    }
  };

  submitSkip = () => {
    this.questionBCC50 = false;
    this.setState({
      selectedDevice: '',
      isFocused: false,
      isFirstOpened: true,
      enableSubmitButton: false,
      thermostats: JSON.parse(JSON.stringify(defaultThermostatInformation)),
      auxThermostats: JSON.parse(JSON.stringify(defaultThermostatInformation)),
    });

    const selectedDevice = this.state.thermostats.filter(t => t.checked)[0];
    this.props.navigation.navigate('SkipSetupBCC50', {
      device: selectedDevice.name,
    });
  };
  cancel = () => {
    this.setState({
      selectedDevice: '',
      isFocused: false,
      isFirstOpened: true,
      enableSubmitButton: false,
      thermostats: JSON.parse(JSON.stringify(defaultThermostatInformation)),
      auxThermostats: JSON.parse(JSON.stringify(defaultThermostatInformation)),
      heatPumps: JSON.parse(JSON.stringify(defaultHeatpumpInformation)),
      auxHeatPumps: JSON.parse(JSON.stringify(defaultHeatpumpInformation)),
    });
    this.props.navigation.navigate('Home');
  };

  enableConfirmButton = () => {
    return (
      this.state.thermostats.filter(t => t.checked).length !== 0 ||
      this.state.heatPumps.filter(t => t.checked).length !== 0
    );
  };

  displaySelectedDevice = () => {
    let selectedIds =
      this.state.selectedDevice === Dictionary.addDevice.heatPump &&
      this.state.heatPumps.filter(t => t.checked).length !== 0;
    let isIdsSelected = selectedIds
      ? this.state.heatPumps.filter(t => t.checked)[0].name ===
        Dictionary.addDevice.IDSPremiumConnected
      : null;
    let isThermostatSelected =
      this.state.thermostats.filter(t => t.checked).length !== 0;
    let isBccSelected = isThermostatSelected
      ? this.state.thermostats.filter(t => t.checked)[0].name ===
        Dictionary.addDevice.bcc100
      : null;

    return (
      <View accessible={true} style={[styles.flex2]}>
        <View style={[styles.alignCenter]}>
          {selectedIds || isThermostatSelected ? (
            <Image
              resizeMode="stretch"
              style={[
                styles.deviceImage,
                !selectedIds
                  ? {height: 101, width: 168}
                  : !isIdsSelected
                  ? {
                      height: deviceHeight * 0.22,
                      width: deviceWidth * 0.4,
                    }
                  : {},
              ]}
              source={
                selectedIds
                  ? isIdsSelected
                    ? require('./../assets/images/idsicon.png')
                    : require('./../assets/images/IDSArctic.png')
                  : isThermostatSelected
                  ? isBccSelected
                    ? require('./../assets/images/BCC100.png')
                    : require('./../assets/images/BCC50.png')
                  : null
              }
            />
          ) : null}
          <Text style={[styles.deviceTypeName]}>
            {selectedIds
              ? isIdsSelected
                ? Dictionary.addDevice.IDSPremiumConnected
                : Dictionary.addDevice.IDSArctic
              : isThermostatSelected
              ? isBccSelected
                ? Dictionary.addDevice.bcc100 + '/BCC110'
                : Dictionary.addDevice.bcc50
              : null}
          </Text>
          <Text style={styles.deviceTypeSubname}>
            {selectedIds
              ? Dictionary.addDevice.heatPump
              : isThermostatSelected
              ? Dictionary.addDevice.thermostat
              : null}
          </Text>
        </View>
      </View>
    );
  };

  onBack = () => {
    this.cancel();
    this.props.navigation.navigate('Home');
  };

  setSelected = item => {
    this.setState({
      selected: item,
      isFocused: true,
      selectedDevice: item,
    });
  };

  setOpened = opened => {
    this.setState({
      opened1: opened,
    });
  };

  onPressDropdown = () => {
    this.setState({isFocused: true});
  };

  disablingModal = () => {
    this.questionBCC50 = false;
  };
  MenuButton = (props: any) => {
    const dispatch = useDispatch();
    return (
      <TouchableOpacity
        testID="menuButton"
        style={padding}
        onPress={() => {
          dispatch(prCleanInfo());
          props.navigation.openDrawer();
        }}>
        <BoschIcon
          name={Icons.listViewMobile}
          size={34}
          accessibilityLabel={'Menu'}
          style={{height: 34}}
        />
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <View style={styles.flex1}>
        <>
          <View style={styles.headerContainer}>
            <View style={styles.headerDivision}>
              {!this.props.navigation.getParam('showBackButton') ? (
                <MenuButton navigation={this.props.navigation} />
              ) : (
                <TouchableOpacity
                  style={styles.headerBackButton}
                  onPress={() => this.onBack()}>
                  <BoschIcon
                    name={Icons.backLeft}
                    size={24}
                    style={styles.marginHorizontal10}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.headerTitle}>
              <CustomText
                allowFontScaling={true}
                text={Dictionary.addDevice.addAppliance}
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
        <View style={[styles.flex1, styles.container]}>
          <View style={styles.flex1}>
            <View>
              <View style={[styles.marginTop47, {alignItems: 'center'}]}>
                <BOSCH_LOGO fill="#000" />
              </View>

              <CustomText
                allowFontScaling={true}
                style={[
                  styles.marginTop15,
                  {marginBottom: deviceHeight * 0.06},
                ]}
                text={Dictionary.addDevice.selectDevice}
              />

              <Dropdown
                accessibilityLabelText={`${
                  Dictionary.addDevice.selectAUnitOrDevice
                } ${
                  this.state.selectedDevice
                    ? `${Dictionary.addDevice.currentSelected} ${this.state.selectedDevice}`
                    : ''
                }`}
                accessibilityHintText={
                  Dictionary.addDevice.selectBetweenHeatpumpAndThermostat
                }
                onPressDropdown={this.onPressDropdown}
                opened={this.state.opened1}
                isFirstOpened={this.state.isFirstOpened}
                setOpened={this.setOpened}
                options={[
                  <TouchableHighlight
                    key={Dictionary.addDevice.heatPump}
                    underlayColor={this.state.heatpumpBackground}
                    style={{
                      height: '100%',
                      width: '100%',
                      flex: 1,
                    }}
                    onPressIn={() => {
                      this.setState({
                        heatpumpColor: 'white',
                        heapumpBackground: 'white',
                      });
                    }}
                    onPressOut={() => {
                      let newHeatpump = [...this.state.heatPumps];
                      newHeatpump[0].checked = true;
                      this.setState({
                        opened: false,
                        opened1: false,
                        isFirstOpened: false,
                        heatpumpColor: 'black',
                        heatpumpBackground: 'rgba(0, 73, 117, 1)',
                        selectedDevice: Dictionary.addDevice.heatPump,
                        enableSubmitButton: true,
                        thermostats: JSON.parse(
                          JSON.stringify(defaultThermostatInformation),
                        ),
                        auxThermostats: JSON.parse(
                          JSON.stringify(defaultThermostatInformation),
                        ),
                        heatPumps: JSON.parse(JSON.stringify(newHeatpump)),
                        auxHeatPumps: JSON.parse(
                          JSON.stringify(defaultHeatpumpInformation),
                        ),
                      });
                    }}>
                    <Text
                      style={[
                        styles.optionWrapper,
                        {
                          color: this.state.heatpumpColor,
                        },
                      ]}>
                      {Dictionary.addDevice.heatPump}
                    </Text>
                  </TouchableHighlight>,
                  <TouchableHighlight
                    key={Dictionary.addDevice.thermostat}
                    underlayColor={this.state.thermostatBackground}
                    style={{
                      height: '100%',
                      width: '100%',
                      flex: 1,
                    }}
                    onPressIn={() => {
                      this.setState({
                        thermostatColor: 'white',
                        thermostatBackground: 'white',
                      });
                    }}
                    onPressOut={() => {
                      this.setState({
                        opened: false,
                        opened1: false,
                        isFirstOpened: false,
                        thermostatColor: 'black',
                        thermostatBackground: 'rgba(0, 73, 117, 1)',
                        selectedDevice: Dictionary.addDevice.thermostat,
                        enableSubmitButton: false,
                        thermostats: JSON.parse(
                          JSON.stringify(defaultThermostatInformation),
                        ),
                        auxThermostats: JSON.parse(
                          JSON.stringify(defaultThermostatInformation),
                        ),
                        heatPumps: JSON.parse(
                          JSON.stringify(defaultHeatpumpInformation),
                        ),
                        auxHeatPumps: JSON.parse(
                          JSON.stringify(defaultHeatpumpInformation),
                        ),
                      });
                    }}>
                    <Text
                      style={[
                        styles.optionWrapper,
                        {
                          color: this.state.thermostatColor,
                        },
                      ]}>
                      {Dictionary.addDevice.thermostat}
                    </Text>
                  </TouchableHighlight>,
                ]}>
                {this.state.isFocused && (
                  <>
                    <Text
                      style={[styles.deviceTypePlaceholder, styles.fontSize12]}
                      align="left">
                      {Dictionary.addDevice.appliance}
                    </Text>
                  </>
                )}

                <View style={[styles.dropdown, {width: '100%'}]}>
                  {this.state.selectedDevice === '' && !this.state.isFocused ? (
                    <Text style={[styles.fontsize16, styles.fontBlackColor]}>
                      {Dictionary.addDevice.appliance}
                      <Text style={{color: Colors.darkRed}}>*</Text>
                    </Text>
                  ) : this.state.selectedDevice === '' ? (
                    <Text style={[styles.fontsize16, styles.fontGrayColor]}>
                      Select Appliance
                    </Text>
                  ) : (
                    <Text style={[styles.fontsize16, styles.fontBlackColor]}>
                      {this.state.selectedDevice}
                    </Text>
                  )}
                  <Image
                    style={styles.arrowIcon}
                    source={require('./../assets/images/arrow_down.png')}
                  />
                </View>
              </Dropdown>

              {this.state.selectedDevice ===
                Dictionary.addDevice.thermostat && (
                <Pressable
                  accessibilityLabel={Dictionary.addDevice.selectYourThermostat}
                  accessibilityHint={Dictionary.addDevice.opensAModalForBcc}
                  style={{marginTop: 10}}
                  onPress={() =>
                    this.setState({
                      modalVisible: true,
                      blurScreen: true,
                    })
                  }>
                  <View style={styles.dropdown}>
                    <Text style={styles.fontsize16}>
                      {this.state.thermostats.filter(t => t.checked).length ===
                      1
                        ? this.state.thermostats.filter(t => t.checked)[0].name
                        : Dictionary.addDevice.selectYourDevice}
                      {this.state.thermostats.filter(t => t.checked).length ===
                      1 ? null : (
                        <Text style={{color: Colors.darkRed}}>*</Text>
                      )}
                    </Text>
                    <Image
                      style={styles.arrowIcon}
                      source={require('./../assets/images/arrow_down.png')}
                    />
                  </View>
                </Pressable>
              )}
              <ModalComponent
                modalVisible={this.questionBCC50}
                closeModal={() => console.log('CloseModal')}
                blur>
                <View style={{width: '98%'}}>
                  <View accessible={true}>
                    <View style={{alignItems: 'center', marginBottom: 30}}>
                      <Question fill="#000" />
                    </View>
                    <CustomText
                      allowFontScaling={true}
                      accessibilityLabelText={`${Dictionary.addDevice.addBcc.newOnboardingBCC50QuestionADA}.`}
                      text={
                        Dictionary.addDevice.addBcc.newOnboardingBCC50Question
                      }
                      font={'bold'}
                      color={Colors.darkGray}
                      size={16}
                      style={{marginBottom: 30}}
                    />
                    <View style={{flexDirection: 'row'}}>
                      <BoschIcon
                        size={20}
                        name={Icons.infoTooltip}
                        color={Colors.mediumBlue}
                        accessibilityLabel={'Info'}
                      />
                      <CustomText
                        allowFontScaling={true}
                        text={
                          Dictionary.addDevice.addBcc.newOnboadingBCC50FirstTime
                        }
                        accessibilityLabelText={
                          Dictionary.addDevice.addBcc
                            .newOnboadingBCC50FirstTimeADA
                        }
                        style={{
                          marginBottom: 20,
                          marginLeft: 15,
                          fontSize: 12,
                          textAlign: 'left',
                        }}
                      />
                    </View>
                  </View>
                  <Button
                    disabled={false}
                    type="primary"
                    text={
                      Dictionary.addDevice.addBcc.newOnboardingQuestionConfirm
                    }
                    onPress={() => {
                      this.questionBCC50 = false;
                      this.submit();
                    }}
                  />
                  <Button
                    testID="CloseModalHelpFindQr"
                    type="secondary"
                    text={Dictionary.addDevice.addBcc.newOnboardingQuestionSkip}
                    onPress={() => {
                      this.submitSkip();
                    }}
                  />
                </View>
              </ModalComponent>
              <DevicesModal
                modalVisible={this.state.modalVisible}
                isThermostatSelected={
                  this.state.selectedDevice === Dictionary.addDevice.thermostat
                }
                closeModal={() => {
                  this.setState({
                    modalVisible: false,
                  });
                }}
                thermostats={
                  this.state.selectedDevice === Dictionary.addDevice.thermostat
                    ? this.state.auxThermostats
                    : this.state.auxHeatPumps
                }
                checkRadioButton={
                  this.state.selectedDevice === Dictionary.addDevice.thermostat
                    ? this.checkRadioButton
                    : this.checkRadioButtonHeatpump
                }
                sendCheckDevice={
                  this.state.selectedDevice === Dictionary.addDevice.thermostat
                    ? this.sendCheckDevice
                    : this.sendCheckHeatpump
                }
                enableButton={this.state.enableButton}
                cancel={this.cancelModal}
                title={
                  this.state.selectedDevice === Dictionary.addDevice.thermostat
                    ? Dictionary.addDevice.selectTheThermostat
                    : 'Select Your Unit'
                }
              />
            </View>
            {this.displaySelectedDevice()}
            <View style={styles.buttonContainer}>
              <Button
                disabled={!this.state.enableSubmitButton}
                type="primary"
                text={Dictionary.button.next}
                onPress={this.submit}
              />
              {this.props.navigation.getParam('addAnother') && (
                <Button
                  type="secondary"
                  text={'Cancel'}
                  onPress={() => {
                    this.cancel();
                  }}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

AddUnitHomeowner.defaultProps = {
  addAnother: false,
  showBackButton: false,
};

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  deviceTypeName: {
    fontSize: 18,
    marginTop: 10,
  },
  deviceTypeSubname: {
    color: 'rgba(201, 206, 210, 1)',
    fontSize: 16,
    marginTop: 8,
  },
  optionWrapper: {
    fontSize: 16,
    padding: 15,
    flex: 1,
    height: '100%',
    width: '100%',
  },
  alignCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeader: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  deviceTypePlaceholder: {
    color: 'black',
    paddingVertical: 3,
    fontSize: 10,
  },
  pageDescription: {
    marginTop: 60,
  },
  marginHorizontal10: {marginHorizontal: 10},
  dropdown: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    padding: 35,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fontsize16: {
    fontSize: 16,
  },
  fontGrayColor: {
    color: 'rgba(223,223,223,1)',
  },
  fontBlackColor: {
    color: 'black',
  },
  arrowIcon: {
    height: 20,
    width: 20,
  },
  deviceImage: {
    marginTop: 0,
  },
  fontSize12: {
    fontSize: 12,
  },
  marginTop47: {
    marginTop: deviceHeight * 0.05,
  },
  marginTop40: {
    marginTop: 40,
  },
  marginTop15: {
    marginTop: 15,
  },
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
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, null)(AddUnitHomeowner);
