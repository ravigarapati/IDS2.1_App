import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
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

import FossilFuelImage from '../../assets/images/fossilFuelStage.svg';
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

const DualFuel3 = ({
  navigation,
  infoUnitConfiguration,
  isOnboardingBcc50,
  infoUnitConfigurationNoOnboarding,
}) => {
  const [HeatPumpToggleButton, setHeatPumpToggleButton] = useState(
    isOnboardingBcc50
      ? parseInt(infoUnitConfiguration.coolStages)
      : parseInt(infoUnitConfigurationNoOnboarding.coolStage),
  );
  const dispatch = useDispatch();

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
  const navigateToDualFuel4 = () => {
    dispatch(updateUnitConfiguration({name: 'heatStages', value: 1}));
    dispatch(
      updateUnitConfigurationNoOnboarding({name: 'heatStage', value: '1'}),
    );
    return navigation.navigate('DualFuel4');
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
                  <FossilFuelImage width={20} height={20} fill="#000" />
                </View>
                <View>
                  <CustomText
                    allowFontScaling={true}
                    color={Colors.black}
                    font={'bold'}
                    text={'Fossil Fuel Stage(s)'}
                    align={'left'}
                    size={16}
                  />
                </View>
              </View>
              <View style={styles.ToggleButtonView}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginVertical: 5,
                    flex: 1,
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                      paddingVertical: 15,
                      flex: 1,
                      borderColor: Colors.darkBlue,
                      borderWidth: 1,
                      backgroundColor: Colors.darkBlue,
                    }}>
                    <CustomText
                      allowFontScaling={true}
                      text={'1'}
                      color={Colors.white}
                    />
                  </TouchableOpacity>
                </View>
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
                  button1AccessibilityHint="Activate to select 1 stage for heat pump stages."
                  button2={'2'}
                  button2AccessibilityHint="Activate to select 2 stages for heat pump stages."
                  pressed={HeatPumpToggleButton - 1}
                  isvisible={true}
                  onChange={(value: any) =>
                    clickHandlerHeatPumpTogleButton(value)
                  }
                />
              </View>
            </View>
            <View style={{marginBottom: 5}}>
              <CustomText
                allowFontScaling={true}
                color={Colors.black}
                font={'regular'}
                text={'Stage Configuration:'}
                align={'left'}
                size={16}
              />
              <CustomText
                allowFontScaling={true}
                color={Colors.black}
                font={'regular'}
                text={'Fossil Fuel: 1 Heat'}
                align={'left'}
                size={16}
              />
              <CustomText
                allowFontScaling={true}
                color={Colors.black}
                font={'regular'}
                text={'Heat Pump: ' + HeatPumpToggleButton + ' Cool'}
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
          onPress={navigateToDualFuel4}
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

export default connect(mapStateToProps)(DualFuel3);
