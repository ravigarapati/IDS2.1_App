import React, {useState} from 'react';
import {View, StyleSheet, Text, ScrollView, Image} from 'react-native';
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

import ElectricImage from '../../assets/images/electric.svg';
import SunIceImage from '../../assets/images/sun-ice.svg';
import {
  updateUnitConfiguration,
  updateUnitConfigurationNoOnboarding,
} from '../../store/actions/HomeOwnerActions';
import {connect, useDispatch} from 'react-redux';

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

const HeatPump2 = ({
  navigation,
  infoUnitConfiguration,
  isOnboardingBcc50,
  infoUnitConfigurationNoOnboarding,
}) => {
  const [ElectricToggleButton, setElectricToggleButton] = useState(
    isOnboardingBcc50
      ? parseInt(infoUnitConfiguration.heatStages)
      : parseInt(infoUnitConfigurationNoOnboarding.heatStage),
  );
  const [HeatPumpToggleButton, setHeatPumpToggleButton] = useState(
    isOnboardingBcc50
      ? parseInt(infoUnitConfiguration.coolStages)
      : parseInt(infoUnitConfigurationNoOnboarding.coolStage),
  );
  const dispatch = useDispatch();

  const clickHandlerElectricTogleButton = value => {
    if (value == 0) {
      setElectricToggleButton(0);
      dispatch(updateUnitConfiguration({name: 'heatStages', value: 0}));
      dispatch(
        updateUnitConfigurationNoOnboarding({name: 'heatStage', value: '0'}),
      );
    } else if (value == 1) {
      setElectricToggleButton(1);
      dispatch(updateUnitConfiguration({name: 'heatStages', value: 1}));
      dispatch(
        updateUnitConfigurationNoOnboarding({name: 'heatStage', value: '1'}),
      );
    }
  };

  const clickHandlerHeatPumpTogleButton = value => {
    if (value == 0) {
      setHeatPumpToggleButton(1);
      dispatch(updateUnitConfiguration({name: 'coolStages', value: 1}));
      dispatch(
        updateUnitConfigurationNoOnboarding({name: 'coolStage', value: '1'}),
      );
    } else if (value == 1) {
      setHeatPumpToggleButton(2);
      dispatch(updateUnitConfiguration({name: 'coolStages', value: 2}));
      dispatch(
        updateUnitConfigurationNoOnboarding({name: 'coolStage', value: '2'}),
      );
    }
  };

  const navigateToHeatPump2 = () => {
    //return navigation.navigate('HeatPump2')
    return navigation.navigate('DateAndTime');
  };

  const navigateToHeatPump3 = () => {
    //return navigation.navigate('HeatPump2')
    return navigation.navigate('HeatPump3');
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
              currentStep={2}
              phoneNoVerified={false}
              bcc
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={styles.phaseTitleView}>
                <Text style={{color: Colors.dotBlue}}>{'Heat Type'}</Text>
              </View>
              <View style={styles.phaseTitleView}>
                <Text
                  accessible={true}
                  accessibilityLabel="Current step: stages."
                  style={{color: Colors.dotBlue}}>
                  {'Stages'}
                </Text>
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
                <View style={{marginRight: 15}}>
                  <ElectricImage width={20} height={20} fill="#000" />
                </View>
                <View>
                  <CustomText
                    allowFontScaling={true}
                    color={Colors.black}
                    font={'bold'}
                    text={'Electric Stage(s)'}
                    align={'left'}
                    size={16}
                  />
                </View>
              </View>
              <View style={styles.ToggleButtonView}>
                <ToggleButton
                  testIDPrimary="ElectricStageToggleButton1"
                  testIDSecondary="ElectricStageToggleButton2"
                  type="text"
                  button1={'0'}
                  button1AccessibilityHint={
                    'Activate to select 0 electric stage.'
                  }
                  button2={'1'}
                  button2AccessibilityHint="Activate to select 1 electric stages."
                  isvisible={true}
                  pressed={ElectricToggleButton}
                  onChange={(value: any) =>
                    clickHandlerElectricTogleButton(value)
                  }
                />
              </View>
            </View>
            <View style={{paddingVertical: 20}}>
              <View style={{marginBottom: 10, flexDirection: 'row'}}>
                <View style={{marginRight: 15}}>
                  <SunIceImage width={20} height={20} fill="#000" />
                </View>
                <View>
                  <CustomText
                    allowFontScaling={true}
                    color={Colors.black}
                    font={'bold'}
                    text={'Heat Pump Stage(s)'}
                    align={'left'}
                    size={16}
                  />
                </View>
              </View>
              <View style={styles.ToggleButtonView}>
                <ToggleButton
                  testIDPrimary="HeatPumpStageToggleButton1"
                  testIDSecondary="HeatPumpStageToggleButton2"
                  type="text"
                  button1={'1'}
                  button1AccessibilityHint={
                    'Activate to select 1 heat pump stage.'
                  }
                  button2={'2'}
                  button2AccessibilityHint="Activate to select 2 heat pump stages."
                  isvisible={true}
                  pressed={HeatPumpToggleButton - 1}
                  onChange={(value: any) =>
                    clickHandlerHeatPumpTogleButton(value)
                  }
                />
              </View>
            </View>
            <View style={{marginBottom: 5}}>
              <CustomText
                allowFontScaling={true}
                accessibilityLabelText={`Current selections for stage configuration: ${ElectricToggleButton} stage(s) for heat, ${HeatPumpToggleButton} stage(s) for cool.`}
                color={Colors.black}
                font={'regular'}
                text={
                  'Stage Configuration: ' +
                  ElectricToggleButton +
                  ' Heat, ' +
                  HeatPumpToggleButton +
                  ' Cool'
                }
                align={'left'}
                size={16}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonView}>
        <Button
          type="primary"
          text={Dictionary.button.next}
          style={{marginHorizontal: 15}}
          onPress={navigateToHeatPump3}
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
    paddingLeft: 35,
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

export default connect(mapStateToProps)(HeatPump2);
