import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, ScrollView, Image} from 'react-native';
import OptionText from '../../components/OptionText';
import {
  BoschIcon,
  CustomText,
  Button,
  ProgressIndicator,
  ToggleButton,
  SwitchContent,
  CustomPicker,
} from '../../components';
import {Icons} from '../../utils/icons';
import {Colors} from '../../styles';
import {Dictionary} from '../../utils/dictionary';

import CustomWheelPicker from '../../components/CustomWheelPicker';
import {
  updateUnitConfiguration,
  updateUnitConfigurationNoOnboarding,
} from '../../store/actions/HomeOwnerActions';
import {connect, useDispatch} from 'react-redux';
import { CustomWheelPick } from '../../components/CustomWheelPick';

const TIME_ICON = require('../../assets/images/Clock.png');

const modes = [
  {
    id: 1,
    name: 'Appliance',
    description:
      'Allow the appliance to control the fan. Use this option for boilers',
  },
  {
    id: 2,
    name: 'Thermostat',
    description: 'Allow the thermostat to control the fan',
  },
];
const DualFuel2 = ({
  navigation,
  infoUnitConfiguration,
  selectedDevice,
  isOnboardingBcc50,
  infoUnitConfigurationNoOnboarding,
}) => {
  const [ElectricToggleButton, setElectricToggleButton] = useState(
    isOnboardingBcc50
      ? parseInt(infoUnitConfiguration.hpEnergized)
      : parseInt(infoUnitConfigurationNoOnboarding.reverse),
  );
  const [temperature, setTemperature] = useState(
    isOnboardingBcc50
      ? parseFloat(infoUnitConfiguration.dualFBSetpoint)
      : parseFloat(infoUnitConfigurationNoOnboarding.balPoint),
  );
  const [seconds, setSeconds] = useState(
    isOnboardingBcc50
      ? parseInt(infoUnitConfiguration.dualFCOvertime)
      : parseInt(infoUnitConfigurationNoOnboarding.changeOver),
  );
  const dispatch = useDispatch();

  const [tempValues, setTempValues] = useState(
    isOnboardingBcc50
      ? Array.from({length: 56}, (_, i) => `${i + 5}°F`)
      : selectedDevice.isFahrenheit
      ? Array.from({length: 56}, (_, i) => `${i + 5}°F`)
      : Array.from(
          {length: (15.5 - -15) / 0.5 + 1},
          (_, i) => `${-15 + i * 0.5} °C`,
        ),
  );

  const [secondsValues, setSecondsValues] = useState(
    Array.from({length: (300 - 45) / 15 + 1}, (_, i) => `${45 + i * 15} sec`),
  );

  const clickHandlerElectricTogleButton = value => {
    if (value == 0) {
      setElectricToggleButton(0);
      dispatch(updateUnitConfiguration({name: 'hpEnergized', value: 0}));
      dispatch(
        updateUnitConfigurationNoOnboarding({name: 'reverse', value: '0'}),
      );
    } else if (value == 1) {
      setElectricToggleButton(1);
      dispatch(
        updateUnitConfigurationNoOnboarding({name: 'reverse', value: '1'}),
      );
    }
  };

  const navigateToDualFuel3 = () => {
    return navigation.navigate('DualFuel3');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'space-between',
      }}>
      <Image
        style={{height: 8, width: '100%'}}
        source={require('../../assets/images/header_ribbon.png')}
      />
      <ScrollView>
        <View>
          <View style={{marginBottom: 50}}>
            <ProgressIndicator
              steps={3}
              currentStep={1}
              phoneNoVerified={false}
              bcc
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={styles.phaseTitleView}>
                <Text style={{color: Colors.dotBlue}}>{'Heat Type'}</Text>
              </View>
              <View style={styles.phaseTitleView}>
                <Text style={{color: Colors.dotBlue}}>{'Stages'}</Text>
              </View>
              <View style={styles.phaseTitleView}>
                <Text>{'Accessory'}</Text>
              </View>
            </View>
          </View>
          <View style={{paddingHorizontal: 15}}>
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: '#BFC0C2',
                paddingVertical: 20,
              }}>
              <View style={{marginBottom: 10, flexDirection: 'row'}}>
                <View>
                  <CustomText
                    allowFontScaling={true}
                    color={Colors.black}
                    font={'bold'}
                    text={'Reversing Value Energized in'}
                    align={'left'}
                    size={16}
                  />
                </View>
              </View>
              <View style={styles.ToggleButtonView}>
                <ToggleButton
                  testIDPrimary="EnergizedToggleButton1"
                  testIDSecondary="EnergizedToggleButton2"
                  type="text"
                  pressed={ElectricToggleButton}
                  button1={'Cool'}
                  button1AccessibilityHint="Activate to select the reversing value energized in cool."
                  button2={'Heat'}
                  button2AccessibilityHint="Activate to select the reversing value energized in heat."
                  isvisible={true}
                  onChange={(value: any) =>
                    clickHandlerElectricTogleButton(value)
                  }
                />
              </View>
            </View>

            <View
              style={{
                borderBottomWidth: 1,
                borderColor: '#BFC0C2',
                paddingVertical: 20,
              }}>
              <View style={{marginBottom: 10, flexDirection: 'row'}}>
                <View>
                  <CustomText
                    allowFontScaling={true}
                    color={Colors.black}
                    font={'medium'}
                    text={'Balance Point'}
                    align={'left'}
                    size={18}
                  />
                </View>
                <Text style={{color: '#D02B26'}}>*</Text>
              </View>
              <View style={{marginBottom: 10}}>
                <CustomWheelPick
                  type={'picker'}
                  edit={true}
                  blur={true}
                  accessibilityHintText={
                    Dictionary.bccDashboard.settings.temperature
                  }
                  pickerWidth={'100%'}
                  placeholder={Dictionary.bccDashboard.settings.temperature}
                  value={
                    temperature / 10 +
                    (isOnboardingBcc50
                      ? ' °F'
                      : selectedDevice.isFahrenheit
                      ? ' °F'
                      : ' °C')
                  }
                  isRequiredField={true}
                  values={tempValues}
                  accessibilityWheelPickerValue={[
                    ' the balance point degrees.',
                  ]}
                  defaultIndex={0}
                  defaultValue={tempValues[0]}
                  onConfirm={selected => {
                    const tempSplit = tempValues[selected['0']].split('°');
                    const temperatureValue = parseFloat(tempSplit[0]);
                    setTemperature(temperatureValue * 10);
                    dispatch(
                      updateUnitConfiguration({
                        name: 'dualFBSetpoint',
                        value: temperatureValue * 10,
                      }),
                    );
                    dispatch(
                      updateUnitConfigurationNoOnboarding({
                        name: 'balPoint',
                        value: (temperatureValue * 10).toString(),
                      }),
                    );
                  }}
                />
              </View>
              <View style={{marginBottom: 10}}>
                <CustomText
                  allowFontScaling={true}
                  color={Colors.black}
                  font={'regular'}
                  text={
                    'Above this value your thermostat will use your heat pump to heat your home and below this value your thermostat will use your fossil fuel heating device.'
                  }
                  align={'left'}
                  size={12}
                />
              </View>
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: '#BFC0C2',
                paddingVertical: 20,
              }}>
              <View style={{marginBottom: 10, flexDirection: 'row'}}>
                <View>
                  <CustomText
                    allowFontScaling={true}
                    color={Colors.black}
                    font={'medium'}
                    text={'Changeover Delay'}
                    align={'left'}
                    size={18}
                  />
                </View>
                <Text style={{color: '#D02B26'}}>*</Text>
              </View>
              <View style={{marginBottom: 10}}>
                <CustomWheelPick
                  type={'picker'}
                  blur={true}
                  edit={true}
                  accessibilityHintText={'Time'}
                  pickerWidth={'100%'}
                  placeholder={'Time'}
                  value={seconds + ' sec'}
                  isRequiredField={true}
                  values={secondsValues}
                  defaultIndex={0}
                  defaultValue={secondsValues[0]}
                  accessibilityWheelPickerValue={[' the changeover delay.']}
                  icon={TIME_ICON}
                  onConfirm={selected => {
                    const secondsSplit =
                      secondsValues[selected['0']].split(' ');
                    const secondsValue = parseInt(secondsSplit[0]);
                    setSeconds(secondsValue);
                    dispatch(
                      updateUnitConfiguration({
                        name: 'dualFCOvertime',
                        value: secondsValue,
                      }),
                    );
                    dispatch(
                      updateUnitConfigurationNoOnboarding({
                        name: 'changeOver',
                        value: secondsValue.toString(),
                      }),
                    );
                  }}
                />
              </View>
              <View style={{marginBottom: 10}}>
                <CustomText
                  allowFontScaling={true}
                  color={Colors.black}
                  font={'regular'}
                  text={
                    'Allow for the coil to cool when switching between heating devices.'
                  }
                  align={'left'}
                  size={12}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonView}>
        <Button
          testID="buttonNext"
          type="primary"
          disabled={temperature == '' || seconds == ''}
          text={Dictionary.button.next}
          style={{marginHorizontal: 15}}
          onPress={navigateToDualFuel3}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  phaseTitleView: {
    flex: 0.33,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ToggleButtonView: {
    height: 65,
  },
  tipSection: {
    flexDirection: 'row',
    marginTop: 33,
  },
  flexShrink1: {
    flexShrink: 1,
  },
  paddingLeft5: {
    paddingLeft: 12,
  },
  buttonView: {
    paddingBottom: 30,
  },
});

const mapStateToProps = state => {
  return {
    selectedDevice: state.homeOwner.selectedDevice,
    infoUnitConfiguration: state.homeOwner.infoUnitConfiguration,
    isOnboardingBcc50: state.homeOwner.isOnboardingBcc50,
    infoUnitConfigurationNoOnboarding:
      state.homeOwner.infoUnitConfigurationNoOnboarding,
  };
};

export default connect(mapStateToProps)(DualFuel2);
