import React, {useState} from 'react';
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
} from '../../components';
import {Icons} from '../../utils/icons';
import {Colors} from '../../styles';
import {Dictionary} from '../../utils/dictionary';
import {WithLocalSvg} from 'react-native-svg';

import FireImage from '../../assets/images/fire.svg';
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

const FossilFuel2 = ({
  navigation,
  infoUnitConfiguration,
  isOnboardingBcc50,
  infoUnitConfigurationNoOnboarding,
}) => {
  const [FossilFuelStage, setFossilFuelStage] = useState(
    isOnboardingBcc50
      ? parseInt(infoUnitConfiguration.heatStages)
      : parseInt(infoUnitConfigurationNoOnboarding.heatStage),
  );
  const [AirConditionerStage, setAirConditionerStage] = useState(
    isOnboardingBcc50
      ? parseInt(infoUnitConfiguration.coolStages)
      : parseInt(infoUnitConfigurationNoOnboarding.coolStage),
  );
  const dispatch = useDispatch();

  const navigateToFossilFuel3 = () => {
    navigation.navigate('FossilFuel3');
  };

  const clickHandlerFossilFuelStage = value => {
    if (value == 0) {
      setFossilFuelStage(1);
      dispatch(updateUnitConfiguration({name: 'heatStages', value: 1}));
      dispatch(
        updateUnitConfigurationNoOnboarding({name: 'heatStage', value: '1'}),
      );
    } else if (value == 1) {
      setFossilFuelStage(2);
      dispatch(updateUnitConfiguration({name: 'heatStages', value: 2}));
      dispatch(
        updateUnitConfigurationNoOnboarding({name: 'heatStage', value: '2'}),
      );
    }
  };

  const clickHandlerAirConditionerStage = value => {
    setAirConditionerStage(value);
    dispatch(updateUnitConfiguration({name: 'coolStages', value: value}));
    dispatch(
      updateUnitConfigurationNoOnboarding({
        name: 'coolStage',
        value: value.toString(),
      }),
    );
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
                  accessibilityLabel={'Current step: stages.'}
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
            <View style={{marginBottom: 50}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{marginRight: 20}}>
                  <FireImage width={20} height={20} fill="#000" />
                </View>
                <View style={{marginBottom: 5}}>
                  <CustomText
                    allowFontScaling={true}
                    color={Colors.black}
                    font={'bold'}
                    text={'Fossil Fuel Stage(s)'}
                    align={'left'}
                    size={18}
                  />
                </View>
              </View>
              <Pressable style={styles.ToggleButtonView}>
                <ToggleButton
                  type="text"
                  button1={'1'}
                  button2={'2'}
                  button1AccessibilityHint={
                    'Activate to select 1 Fossil fuel stage.'
                  }
                  button2AccessibilityHint={
                    'Activate to select 2 Fossil fuel stage.'
                  }
                  pressed={FossilFuelStage - 1}
                  isvisible={true}
                  onChange={(value: any) => clickHandlerFossilFuelStage(value)}
                  testIDPrimary="toggleButton1"
                  testIDSecondary="toggleButton2"
                />
              </Pressable>
            </View>
            <View style={{marginBottom: 20}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{marginRight: 20}}>
                  <IceImage width={20} height={20} fill="#000" />
                </View>
                <View style={{marginBottom: 5}}>
                  <CustomText
                    allowFontScaling={true}
                    color={Colors.black}
                    font={'bold'}
                    text={'Air Conditioner Stage(s)'}
                    align={'left'}
                    size={18}
                  />
                </View>
              </View>
              <View style={styles.ToggleButtonView}>
                <ToggleButtonTriple
                  type="text"
                  button1={'0'}
                  button1AccessibilityHint={
                    'Activate to select Air confitioner stages as 0.'
                  }
                  button2={'1'}
                  button2AccessibilityHint={
                    'Activate to select Air confitioner stages as 1.'
                  }
                  button3={'2'}
                  button3AccessibilityHint={
                    'Activate to select Air confitioner stages as 2.'
                  }
                  pressed={AirConditionerStage}
                  isvisible={true}
                  onChange={(value: any) =>
                    clickHandlerAirConditionerStage(value)
                  }
                  testIDPrimary="toggleButton3"
                  testIDSecondary="toggleButton4"
                  testIDThird="toggleButton5"
                />
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{marginBottom: 5}}>
                <CustomText
                  allowFontScaling={true}
                  accessibilityLabelText={`Current selections for stage configuration: ${FossilFuelStage} stage(s) for heat, ${AirConditionerStage} stage(s) for cool.`}
                  color={Colors.black}
                  font={'regular'}
                  text={
                    'Stage Configuration: ' +
                    FossilFuelStage +
                    ' Heat, ' +
                    AirConditionerStage +
                    ' Cool'
                  }
                  align={'left'}
                  size={16}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonView}>
        <Button
          type="primary"
          text={Dictionary.button.next}
          style={{marginHorizontal: 15}}
          onPress={navigateToFossilFuel3}
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
    paddingLeft: 40,
    height: 65,
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

export default connect(mapStateToProps)(FossilFuel2);
