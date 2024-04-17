import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import OptionText from '../../components/OptionText';
import {
  BoschIcon,
  CustomText,
  Button,
  ProgressIndicator,
  ToggleButton,
  SwitchContent,
} from '../../components';
import {Icons} from '../../utils/icons';
import {Colors} from '../../styles';
import {Dictionary} from '../../utils/dictionary';
import {connect, useDispatch} from 'react-redux';
import {
  updateUnitConfiguration,
  updateUnitConfigurationNoOnboarding,
} from '../../store/actions/HomeOwnerActions';

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

const HeatPump1 = ({
  navigation,
  infoUnitConfiguration,
  isOnboardingBcc50,
  infoUnitConfigurationNoOnboarding,
}) => {
  const [ReversingToggleButton, setReversingToggleButton] = useState(
    isOnboardingBcc50 ? 0 : parseInt(infoUnitConfigurationNoOnboarding.reverse),
  );
  const [EmergencyHeatSwitch, setEmergencyHeatSwitch] = useState(false);
  const [AuxiliaryHeatSwitch, setAuxiliaryHeatSwitch] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isOnboardingBcc50) {
      loadValues(parseInt(infoUnitConfigurationNoOnboarding.emHeat));
    }
  }, []);

  const loadValues = value => {
    switch (value) {
      case 0:
        setEmergencyHeatSwitch(false);
        setAuxiliaryHeatSwitch(false);
        return;

      case 1:
        setEmergencyHeatSwitch(true);
        setAuxiliaryHeatSwitch(false);
        return;

      case 2:
        setEmergencyHeatSwitch(false);
        setAuxiliaryHeatSwitch(true);
        return;

      case 3:
        setEmergencyHeatSwitch(true);
        setAuxiliaryHeatSwitch(true);
        return;
    }
  };

  const clickHandlerReversingTogleButton = value => {
    if (value == 0) {
      setReversingToggleButton(0);
      verifyValues(EmergencyHeatSwitch, AuxiliaryHeatSwitch, 0);
    } else if (value == 1) {
      setReversingToggleButton(1);
      verifyValues(EmergencyHeatSwitch, AuxiliaryHeatSwitch, 1);
    }
  };

  const switchOnEmergencySwitch = value => {
    setEmergencyHeatSwitch(value);
    verifyValues(value, AuxiliaryHeatSwitch, ReversingToggleButton);
  };

  const switchOnAuxiliarySwitch = value => {
    setAuxiliaryHeatSwitch(value);
    verifyValues(EmergencyHeatSwitch, value, ReversingToggleButton);
  };

  const verifyValues = (
    EmergencyHeatSwitch,
    AuxiliaryHeatSwitch,
    ReversingToggleButton,
  ) => {
    if (EmergencyHeatSwitch == false && AuxiliaryHeatSwitch == false) {
      dispatch(updateUnitConfiguration({name: 'hpEmHeat', value: 0}));
      dispatch(
        updateUnitConfigurationNoOnboarding({name: 'emHeat', value: '0'}),
      );
    } else if (EmergencyHeatSwitch == true && AuxiliaryHeatSwitch == false) {
      dispatch(updateUnitConfiguration({name: 'hpEmHeat', value: 1}));
      dispatch(
        updateUnitConfigurationNoOnboarding({name: 'emHeat', value: '1'}),
      );
    } else if (EmergencyHeatSwitch == false && AuxiliaryHeatSwitch == true) {
      dispatch(updateUnitConfiguration({name: 'hpEmHeat', value: 2}));
      dispatch(
        updateUnitConfigurationNoOnboarding({name: 'emHeat', value: '2'}),
      );
    } else if (EmergencyHeatSwitch == true && AuxiliaryHeatSwitch == true) {
      dispatch(updateUnitConfiguration({name: 'hpEmHeat', value: 3}));
      dispatch(
        updateUnitConfigurationNoOnboarding({name: 'emHeat', value: '3'}),
      );
    }
    dispatch(
      updateUnitConfiguration({
        name: 'hpEnergized',
        value: ReversingToggleButton,
      }),
    );
    dispatch(
      updateUnitConfigurationNoOnboarding({
        name: 'reverse',
        value: ReversingToggleButton.toString(),
      }),
    );
  };

  const navigateToHeatPump2 = () => {
    return navigation.navigate('HeatPump2');
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
                <Text
                  accessible={true}
                  accessibilityLabel={'Current step: Heat type.'}
                  style={{color: Colors.dotBlue}}>
                  {'Heat Type'}
                </Text>
              </View>
              <View style={styles.phaseTitleView}>
                <Text>{'Stages'}</Text>
              </View>
              <View style={styles.phaseTitleView}>
                <Text>{'Accessory'}</Text>
              </View>
            </View>
          </View>
          <View style={{paddingHorizontal: 15}}>
            <View style={{marginBottom: 30}}>
              <View style={{marginBottom: 10}}>
                <CustomText
                  allowFontScaling={true}
                  color={Colors.black}
                  font={'bold'}
                  text={'Reversing Valve Energized in'}
                  align={'left'}
                  size={16}
                />
              </View>
              <View style={styles.ToggleButtonView}>
                <ToggleButton
                  testIDPrimary="EnergizedToggleButton1"
                  testIDSecondary="EnergizedToggleButton2"
                  type="text"
                  button1={'Cool'}
                  button1AccessibilityHint={
                    'Activate to select reversing valve as cool.'
                  }
                  button2AccessibilityHint={
                    'Activate to select reversing valve as heat.'
                  }
                  button2={'Heat'}
                  isvisible={true}
                  onChange={(value: any) =>
                    clickHandlerReversingTogleButton(value)
                  }
                  pressed={ReversingToggleButton}
                />
              </View>
            </View>
            <Pressable
              accessible={true}
              accessibilityLabel={'Cool to dehumidify.'}
              accessibilityHint="Enables an additional heating stage used only in Emergency Heat mode."
              onPress={() => {
                switchOnEmergencySwitch(!EmergencyHeatSwitch);
              }}
              style={{
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: '#BFC0C2',
                paddingBottom: 20,
              }}>
              <View>
                <SwitchContent
                  testID="coolToDehumidifySwitch"
                  accessibilityLabelText=" "
                  accessibilityHintText=" "
                  accesoryOn={EmergencyHeatSwitch}
                  initialText={'Cool to Dehumidify'}
                  switchStatus={value => switchOnEmergencySwitch(value)}
                  marginTop={0}
                  paddingHorizontal={5}
                  marginHorizontal={-5}
                  borderBottomColor={'transparent'}
                  initialEventOff
                />
              </View>
              <View>
                <CustomText
                  allowFontScaling={true}
                  accessibilityLabelText=" "
                  accessibilityHintText=" "
                  color={Colors.black}
                  font={'regular'}
                  text={
                    'Enables an additional heating stage used only in Emergency Heat mode.'
                  }
                  align={'left'}
                  size={16}
                />
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                switchOnAuxiliarySwitch(!AuxiliaryHeatSwitch);
              }}
              accessible={true}
              accessibilityLabel="Auxiliary heating."
              accessibilityHint="Enables an additional heating stage if the compressor cannot satisfy the current heating set point."
              accessibilityActions={[{name: 'activate'}]}
              onAccessibilityAction={() => {
                switchOnAuxiliarySwitch(!AuxiliaryHeatSwitch);
              }}
              style={{
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: '#BFC0C2',
                paddingBottom: 20,
              }}>
              <View>
                <SwitchContent
                  testID="auxiliaryHeatingSwitch"
                  accessibilityLabelText=" "
                  accessibilityHintText=" "
                  accesoryOn={AuxiliaryHeatSwitch}
                  initialText={'Auxiliary Heating'}
                  switchStatus={value => switchOnAuxiliarySwitch(value)}
                  marginTop={0}
                  paddingHorizontal={5}
                  marginHorizontal={-5}
                  borderBottomColor={'transparent'}
                  initialEventOff
                />
              </View>
              <View>
                <CustomText
                  allowFontScaling={true}
                  accessibilityLabelText=" "
                  accessibilityHintText=" "
                  color={Colors.black}
                  font={'regular'}
                  text={
                    'Enables an additional heating stage if the compressor cannot satisfy the current heating set point.'
                  }
                  align={'left'}
                  size={16}
                />
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonView}>
        <Button
          type="primary"
          text={Dictionary.button.next}
          style={{marginHorizontal: 15}}
          onPress={navigateToHeatPump2}
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

export default connect(mapStateToProps)(HeatPump1);
