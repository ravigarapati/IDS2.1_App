import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  AccessibilityActionEvent,
} from 'react-native';
import {BoschIcon, Button, CustomText, RadioButton} from '../components';

import {connect} from 'react-redux';
import {
  setSelectedDevice,
  updateThermostatMode,
} from '../store/actions/HomeOwnerActions';
import {Colors} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {Enum} from '../utils/enum';
import Option from '../components/Option';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Icons} from '../utils/icons';

import HEAT from './../assets/images/heat.svg';
import EMHEAT from './../assets/images/emheat.svg';
import COOL from './../assets/images/cool.svg';
import OFF from './../assets/images/off.svg';
import AUTO from './../assets/images/auto.svg';
import {showToast} from '../components/CustomToast';

const modes = [
  {
    id: 2,
    name: 'Heating',
    description: 'Heat',
    show: ['0', '1', '2', '3', '4'],
    display: true,
    enable: true,
  },
  {
    id: 1,
    name: 'Cooling',
    description: 'Cool',
    show: ['0', '1', '2', '3', '4'],
    display: true,
    enable: true,
  },
  {
    id: 4,
    name: 'Em Heat',
    description: 'Em Heat',
    show: ['2', '4'],
    disabled: [],
    display: false,
    enable: true,
  },
  {
    id: 3,
    name: 'Auto',
    description: 'Auto',
    show: ['0', '1', '2', '3', '4'],
    display: true,
    enable: true,
  },
  {
    id: 0,
    name: 'Off',
    description: 'Off',
    show: ['0', '1', '2', '3', '4'],
    display: true,
    enable: true,
  },
];

function ModeSelection({
  selectedDevice,
  setSelectedDevice,
  navigation,
  updateThermostatMode,
}) {
  const [currentMode, setCurrentMode] = useState(
    selectedDevice.power !== '4' ? selectedDevice.mode : 0,
  );
  const [wasChanged, setWasChanged] = useState(false);
  const [systemConfiguration, setSystemConfiguration] = useState('4');
  const [fuel, setFuel] = useState('');

  useEffect(() => {
    clearInterval(navigation.state.params.statusInterval);
    setFuel(selectedDevice.heatType.split('-')[0]);
    if (navigation.state.params && navigation.state.params.heatType) {
      let values = navigation.state.params.heatType.split('-');
      if (
        values[0] === '4' ||
        (values[0] === '2' && (values[1] === '1' || values[1] === '3'))
      ) {
        modes[2].display = true;
      }
      if (values[0] === '2' && (values[1] === '0' || values[2] === '2')) {
        modes[2].display = true;
        modes[2].enable = false;
      }
    }
    /*if (
      selectedDevice.heatType.split('-')[0] === '2' &&
      selectedDevice.heatType.split('-')[3] != undefined
    ) {
      if (selectedDevice.heatType.split('-')[3] === '0') {
        modes[2].disabled?.push('2');
      }
    }*/
  }, []);

  const renderThermostatIcon = mode => {
    switch (mode.description) {
      case 'Cool':
        return (
          <View style={styles.modeIcon}>
            <COOL />
          </View>
        );
      case 'Heat':
        return (
          <View style={styles.modeIcon}>
            <HEAT fill="#000" />
          </View>
        );
      case 'Em Heat':
        return (
          <View
            key={Dictionary.modeSelection.emHeatImageKey}
            style={[
              styles.emHeatIcon,
              {
                opacity:
                  mode.disabled.find(n => n === systemConfiguration) !==
                  undefined
                    ? 0.5
                    : 1,
              },
            ]}>
            <EMHEAT fill="#000" />
          </View>
        );
      case 'Auto':
        return (
          <View style={styles.modeIcon}>
            <AUTO fill="#000" />
          </View>
        );
      case 'Off':
        return (
          <View style={styles.offThermostatIcon}>
            <OFF fill="#000" />
          </View>
        );
    }
  };

  const onBack = () => {
    navigation.state.params.createStatusInterval();
    navigation.navigate('BCCDashboard');
  };

  return (
    <View style={styles.container}>
      <View>
        <View>
          <View style={styles.headerContainer}>
            <View style={styles.headerDivision}>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel="back."
                accessibilityHint="Activate to go back to the BCC Dashboard screen."
                accessibilityRole="button"
                testID="backButton"
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
              <Text
                style={{
                  fontSize: 21,
                  marginVertical: 10,
                }}>
                System
              </Text>
            </View>
          </View>
          <Image
            style={styles.headerRibbon}
            source={require('../assets/images/header_ribbon.png')}
          />
        </View>
        {modes.map(mode => {
          if (mode.display) {
            return (
              <Option
                key={mode.name}
                option={mode}
                setWasChanged={setWasChanged}
                setCurrent={setCurrentMode}
                renderIcon={() => renderThermostatIcon(mode)}
                currentSelected={currentMode}
                disable={!mode.enable}
                enableHint={Dictionary.modeSelection.disabledMode}
                disableHint={`${Dictionary.modeSelection.activate1} ${
                  mode.name
                } ${Dictionary.modeSelection.activate2} ${
                  modes.find(m => m.id == currentMode) &&
                  modes.find(m => m.id == currentMode).length != 0
                    ? modes.find(m => m.id == currentMode).name
                    : ' '
                }`}
              />
            );
          }
        })}
      </View>
      <View style={{marginHorizontal: 20}}>
        <Button
          testID="submitModeSelection"
          accessibilityHintText={
            !wasChanged
              ? Dictionary.modeSelection.submitDisabledButton
              : `${Dictionary.modeSelection.submitEnabledButton} ${
                  modes.find(m => m.id == currentMode) &&
                  modes.find(m => m.id == currentMode).length != 0
                    ? modes.find(m => m.id == currentMode).name
                    : ' '
                }.`
          }
          disabled={!wasChanged}
          text={'Submit'}
          type={'primary'}
          onPress={() => {
            navigation.state.params.stopStatus();
            navigation.state.params.setAuxHold(false);
            navigation.state.params.setUpdateInfo(false);
            navigation.state.params.createStatusInterval();
            /*setTimeout(() => {
              navigation.state.params.createStatusInterval();
            }, 3000);*/
            navigation.state.params.setMode(currentMode);
            setSelectedDevice({
              ...selectedDevice,
              mode: currentMode,
              power:
                currentMode == 1 ||
                currentMode == 2 ||
                currentMode == 4 ||
                currentMode == 3
                  ? '2'
                  : '4',
            });
            if (currentMode != 0) {
              navigation.state.params.turnOnDevice(currentMode);
            }
            updateThermostatMode(
              {
                device_id: selectedDevice.macId,
                //model_id: '0',
                mode: currentMode.toString(),
                distr: selectedDevice.isOnSchedule ? '0' : '1',
              },
              response => {
                console.log('petition completed');
                if (response.message !== 'Operation succeed') {
                  showToast('There was a problem updating mode.', 'error');
                }
              },
            );
            setTimeout(() => {
              navigation.state.params.createStatusInterval();
            }, 100);
            /*setTimeout(() => {
              updateThermostatMode(
                {
                  device_id: selectedDevice.macId,
                  //model_id: '0',
                  mode: currentMode.toString(),
                  distr: selectedDevice.isOnSchedule ? '0' : '1',
                },
                response => {
                  if (response.message !== 'Operation succeed') {
                    showToast('There was a problem updating mode.', 'error');
                  }
                },
              );
            }, 2000);*/
            navigation.navigate('BCCDashboard');
          }}
        />
        <Button
          testID="cancelButton"
          text={'Cancel'}
          type={'secondary'}
          onPress={() => {
            navigation.state.params.createStatusInterval();
            navigation.navigate('BCCDashboard');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'space-between',
  },
  emHeatIcon: {
    marginHorizontal: 4,
    resizeMode: 'stretch',
    height: 24,
  },
  offThermostatIcon: {
    height: 20,
    width: 20,
    marginHorizontal: 3,
  },
  optionContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#BFC0C2',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modeIcon: {
    resizeMode: 'stretch',
    width: 24,
    height: 24,
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
  setSelectedDevice,
  updateThermostatMode,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModeSelection);
