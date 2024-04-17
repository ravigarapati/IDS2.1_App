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
import IceImage from '../../assets/images/ice.svg';
import ToggleButtonTriple from '../../components/ToggleButtonTriple';
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

const Electric1 = ({
  navigation,
  isOnboardingBcc50,
  infoUnitConfigurationNoOnboarding,
}) => {
  const [ElectricToggleButton, setElectricToggleButton] = useState(
    isOnboardingBcc50
      ? 1
      : parseInt(infoUnitConfigurationNoOnboarding.heatStage),
  );
  const [AirConditionerToggleButton, setAirConditionerToggleButton] = useState(
    isOnboardingBcc50
      ? 1
      : parseInt(infoUnitConfigurationNoOnboarding.coolStage),
  );
  const dispatch = useDispatch();

  const clickHandlerElectricTogleButton = value => {
    if (value == 0) {
      setElectricToggleButton(1);
      dispatch(updateUnitConfiguration({name: 'heatStages', value: 1}));
      dispatch(
        updateUnitConfigurationNoOnboarding({name: 'heatStage', value: '1'}),
      );
    } else if (value == 1) {
      setElectricToggleButton(2);
      dispatch(updateUnitConfiguration({name: 'heatStages', value: 2}));
      dispatch(
        updateUnitConfigurationNoOnboarding({name: 'heatStage', value: '2'}),
      );
    }
  };

  const clickHandlerAirConditionerTogleButton = value => {
    if (value == 0) {
      setAirConditionerToggleButton(0);
      dispatch(updateUnitConfiguration({name: 'coolStages', value: 0}));
      dispatch(
        updateUnitConfigurationNoOnboarding({name: 'coolStage', value: '0'}),
      );
    } else if (value == 1) {
      setAirConditionerToggleButton(1);
      dispatch(updateUnitConfiguration({name: 'coolStages', value: 1}));
      dispatch(
        updateUnitConfigurationNoOnboarding({name: 'coolStage', value: '1'}),
      );
    } else if (value == 2) {
      setAirConditionerToggleButton(2);
      dispatch(updateUnitConfiguration({name: 'coolStages', value: 2}));
      dispatch(
        updateUnitConfigurationNoOnboarding({name: 'coolStage', value: '2'}),
      );
    }
  };
  const navigateToElectric2 = () => {
    return navigation.navigate('Electric2');
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
              steps={2}
              currentStep={1}
              phoneNoVerified={false}
              bcc
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
                  button1={'1'}
                  button1AccessibilityHint="Activate to select 1 stage for electric stages."
                  button2={'2'}
                  button2AccessibilityHint="Activate to select 2 stages for electric stages."
                  isvisible={true}
                  onChange={(value: any) =>
                    clickHandlerElectricTogleButton(value)
                  }
                  pressed={ElectricToggleButton - 1}
                />
              </View>
            </View>
            <View style={{paddingVertical: 20}}>
              <View style={{marginBottom: 10, flexDirection: 'row'}}>
                <View style={{marginRight: 15}}>
                  <IceImage width={20} height={20} fill="#000" />
                </View>
                <View>
                  <CustomText
                    allowFontScaling={true}
                    color={Colors.black}
                    font={'bold'}
                    text={'Air Conditioner Stage(s)'}
                    align={'left'}
                    size={16}
                  />
                </View>
              </View>
              <View style={styles.ToggleButtonView}>
                <ToggleButtonTriple
                  testIDPrimary="AirConditionerStageToggleButton1"
                  testIDSecondary="AirConditionerStageToggleButton2"
                  testIDThird="AirConditionerStageToggleButton3"
                  type="text"
                  button1={'0'}
                  button1AccessibilityHint="Activate to select 0 stage for air conditioner stages."
                  button2={'1'}
                  button2AccessibilityHint="Activate to select 1 stages for air conditioner stages."
                  button3={'2'}
                  button3AccessibilityHint="Activate to select 2 stages for air conditioner stages."
                  isvisible={true}
                  onChange={(value: any) =>
                    clickHandlerAirConditionerTogleButton(value)
                  }
                  pressed={AirConditionerToggleButton}
                />
              </View>
            </View>
            <View style={{marginBottom: 5}}>
              <CustomText
                allowFontScaling={true}
                accessibilityLabelText={`Current stage configuration: ${ElectricToggleButton} stage(s) for heat. ${AirConditionerToggleButton} stage(s) for cooling.`}
                color={Colors.black}
                font={'regular'}
                text={
                  'Stage Configuration: ' +
                  ElectricToggleButton +
                  ' Heat, ' +
                  AirConditionerToggleButton +
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
          testID="buttonNext"
          type="primary"
          text={Dictionary.button.next}
          style={{marginHorizontal: 15}}
          onPress={navigateToElectric2}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  phaseTitleView: {
    flex: 0.5,
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

export default connect(mapStateToProps)(Electric1);
