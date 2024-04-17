import React, {useState} from 'react';
import {View, StyleSheet, Text, ScrollView, Image} from 'react-native';
import OptionText from '../../components/OptionText';
import {
  BoschIcon,
  CustomText,
  Button,
  ProgressIndicator,
} from '../../components';
import {Icons} from '../../utils/icons';
import {Colors} from '../../styles';
import {Dictionary} from '../../utils/dictionary';
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
      'Allow the appliance to control the fan. Use this option for boilers.',
  },
  {
    id: 2,
    name: 'Thermostat',
    description: 'Allow the thermostat to control the fan.',
  },
];

const DualFuel1 = ({
  navigation,
  infoUnitConfiguration,
  isOnboardingBcc50,
  infoUnitConfigurationNoOnboarding,
}) => {
  const [fanControl, setFanControl] = useState(
    parseInt(infoUnitConfiguration.fossilFuel),
  );
  const [wasChanged, setWasChanged] = useState(false);
  const dispatch = useDispatch();

  const navigateToDualFuel2 = () => {
    return navigation.navigate('DualFuel2');
  };

  const handleOptionControl = value => {
    setFanControl(value - 1);
    dispatch(updateUnitConfiguration({name: 'fossilFuel', value: value - 1}));
    if (!isOnboardingBcc50) {
      switch (value) {
        case 1:
          dispatch(
            updateUnitConfigurationNoOnboarding({
              name: 'fanControl',
              value: '1',
            }),
          );
          return;
        case 2:
          dispatch(
            updateUnitConfigurationNoOnboarding({
              name: 'fanControl',
              value: '0',
            }),
          );
          return;
      }
    }
  };

  const selectedOption = () => {
    if (isOnboardingBcc50) {
      return fanControl + 1;
    } else {
      switch (infoUnitConfigurationNoOnboarding.fanControl) {
        case '0':
          return 2;
        case '1':
          return 1;
      }
    }
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
                <Text>{'Stages'}</Text>
              </View>
              <View style={styles.phaseTitleView}>
                <Text>{'Accessory'}</Text>
              </View>
            </View>
          </View>
          <View style={{paddingHorizontal: 15}}>
            <View style={{marginBottom: 10}}>
              <CustomText
                allowFontScaling={true}
                color={Colors.black}
                font={'bold'}
                text={'Fan Control'}
                align={'left'}
                size={18}
              />
            </View>
            <View>
              {modes.map(item => {
                return (
                  <OptionText
                    key={item.name}
                    option={item}
                    setWasChanged={setWasChanged}
                    setCurrent={handleOptionControl}
                    renderIcon={() => null}
                    currentSelected={selectedOption()}
                    disable={false}
                    showDescription={true}
                    enableHint=""
                    disableHint={`${item.description}. Current selected: ${
                      modes.find(m => m.id === fanControl + 1)?.name
                    }`}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonView}>
        <Button
          type="primary"
          text={Dictionary.button.next}
          style={{marginHorizontal: 15}}
          onPress={navigateToDualFuel2}
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

export default connect(mapStateToProps)(DualFuel1);
