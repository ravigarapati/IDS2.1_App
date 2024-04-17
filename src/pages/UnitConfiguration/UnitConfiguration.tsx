import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Image, ScrollView} from 'react-native';
import Option from '../../components/Option';
import {BoschIcon, CustomText, Button} from '../../components';
import {Icons} from '../../utils/icons';
import {Colors} from '../../styles';
import {Dictionary} from '../../utils/dictionary';
import {NavigationActions} from 'react-navigation';
import {connect, useDispatch} from 'react-redux';

import FireImage from '../../assets/images/fire.svg';
import SunIceImage from '../../assets/images/sun-ice.svg';
import DualFuelImage from '../../assets/images/dualFuel.svg';
import ElectricImage from '../../assets/images/electric.svg';
import NoHeatingImage from '../../assets/images/noHeating.svg';
import {
  resetScheduleOnboarding,
  resetUnitConfiguration,
  updateUnitConfiguration,
  setUnitConfigurationNoOnboarding,
  getAdvancedSettings,
  updateUnitConfigurationNoOnboarding,
} from '../../store/actions/HomeOwnerActions';
import {schedules} from '../../utils/Schedules';

const modes = [
  {
    id: 1,
    name: 'Fossil Fuel',
    description: 'Fossil Fuel',
  },
  {
    id: 2,
    name: 'Heat Pump',
    description: 'Heat Pump',
  },
  {
    id: 3,
    name: 'Dual Fuel',
    description: 'Dual Fuel',
  },
  {
    id: 4,
    name: 'Electric',
    description: 'Electric',
  },
  {
    id: 5,
    name: 'No Heating',
    description: 'No Heating',
  },
];

const UnitConfiguration = ({
  navigation,
  locationOnboarding,
  nameDeviceOnboarding,
  isOnboardingBcc50,
  selectedDevice,
  infoUnitConfigurationNoOnboarding,
}) => {
  const [currentSelected, setCurrentSelected] = useState(1);
  const [wasChanged, setWasChanged] = useState(false);
  const dispatch = useDispatch();

  const renderIcon = config => {
    switch (config) {
      case 'Fossil Fuel':
        return <FireImage width={24} height={24} fill="#000" />;
      case 'Heat Pump':
        return <SunIceImage width={24} height={24} fill="#000" />;
      case 'Dual Fuel':
        return <DualFuelImage width={24} height={24} fill="#000" />;
      case 'Electric':
        return <ElectricImage width={24} height={24} fill="#000" />;
      case 'No Heating':
        return <NoHeatingImage width={24} height={24} fill="#000" />;
    }
  };

  const navigateToConfig = () => {
    if (isOnboardingBcc50) {
      switch (currentSelected) {
        case 1:
          navigateToScreen(0, 'FossilFuel1');
          return;

        case 2:
          navigateToScreen(2, 'HeatPump1');
          return;

        case 3:
          navigateToScreen(4, 'DualFuel1');
          return;

        case 4:
          navigateToScreen(1, 'Electric1');
          return;

        case 5:
          navigateToScreen(3, 'NoHeating1');
          return;
      }
    } else {
      switch (parseInt(infoUnitConfigurationNoOnboarding.heatType)) {
        case 0:
          navigateToScreen(0, 'FossilFuel1');
          return;

        case 2:
          navigateToScreen(2, 'HeatPump1');
          return;

        case 4:
          navigateToScreen(4, 'DualFuel1');
          return;

        case 1:
          navigateToScreen(1, 'Electric1');
          return;

        case 3:
          navigateToScreen(3, 'NoHeating1');
          return;
      }
    }
  };

  const navigateToScreen = (value, screen) => {
    dispatch(resetScheduleOnboarding(schedules));
    dispatch(resetUnitConfiguration());
    dispatch(updateUnitConfiguration({name: 'type', value}));
    navigation.navigate(screen);
  };

  useEffect(() => {
    if (!isOnboardingBcc50) {
      loadValues();
    }
  }, []);

  function loadValues() {
    return new Promise<void>((resolve, reject) => {
      /* istanbul ignore next */ dispatch(
        getAdvancedSettings(selectedDevice.macId, response => {
          let obj = {
            heatType: response.heatType,
            fanControl: response.fanControl,
            reverse: response.reverse,
            emHeat: response.emHeat,
            balPoint: response.balPoint,
            changeOver: response.changeOver,
            heatStage: response.heatStage,
            coolStage: response.coolStage,
            humiType: response.humiType,
            humidifer: response.humidifer,
            dehumidifer: response.dehumidifer,
          };
          dispatch(setUnitConfigurationNoOnboarding(obj));

          resolve();
        }),
      );
    });
  }

  const handleOptionControl = value => {
    setCurrentSelected(value);
    if (!isOnboardingBcc50) {
      switch (value) {
        case 1:
          dispatch(
            updateUnitConfigurationNoOnboarding({name: 'heatType', value: '0'}),
          );
          return;
        case 2:
          dispatch(
            updateUnitConfigurationNoOnboarding({name: 'heatType', value: '2'}),
          );
          return;
        case 3:
          dispatch(
            updateUnitConfigurationNoOnboarding({name: 'heatType', value: '4'}),
          );
          return;
        case 4:
          dispatch(
            updateUnitConfigurationNoOnboarding({name: 'heatType', value: '1'}),
          );
          return;
        case 5:
          dispatch(
            updateUnitConfigurationNoOnboarding({name: 'heatType', value: '3'}),
          );
          return;
      }
    }
  };

  const selectedOption = () => {
    if (isOnboardingBcc50) {
      return currentSelected;
    } else {
      switch (infoUnitConfigurationNoOnboarding.heatType) {
        case '0':
          return 1;
        case '1':
          return 4;
        case '2':
          return 2;
        case '3':
          return 5;
        case '4':
          return 3;
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
        source={require('./../../assets/images/header_ribbon.png')}
      />
      <ScrollView testID="ScrollView">
        {modes.map(c => {
          return (
            <Option
              key={c.name}
              option={c}
              setWasChanged={setWasChanged}
              setCurrent={handleOptionControl}
              renderIcon={() => renderIcon(c.description)}
              currentSelected={selectedOption()}
              disable={false}
              enableHint=""
              disableHint={`Activate it to enable ${
                c.name
              } as the unit configuration. Currently selected: ${modes.find(
                m => m.id === currentSelected,
              )}.`}
            />
          );
        })}
        <View testID="tipSection" style={styles.tipSection}>
          <BoschIcon
            size={20}
            name={Icons.infoTooltip}
            color={Colors.mediumBlue}
            accessibilityLabel={'Info'}
          />
          <CustomText
            allowFontScaling={true}
            accessibilityLabelText={
              'Please check your heating and cooling system manual or contact the service if you are unsure of which option to select.'
            }
            size={12}
            align="left"
            newline={true}
            text={
              'Please check your heating and cooling system manual or contact the service if you are unsure of which option to select.'
            }
            style={[styles.flexShrink1, styles.paddingLeft5]}
          />
        </View>
      </ScrollView>
      <View style={styles.buttonView}>
        <Button
          testID="ButtonNext"
          type="primary"
          text={Dictionary.button.next}
          style={{marginHorizontal: 20}}
          onPress={navigateToConfig}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tipSection: {
    flexDirection: 'row',
    marginTop: 33,
    marginHorizontal: 16,
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
    locationOnboarding: state.homeOwner.locationOnboarding,
    nameDeviceOnboarding: state.homeOwner.nameDeviceOnboarding,
    isOnboardingBcc50: state.homeOwner.isOnboardingBcc50,
    selectedDevice: state.homeOwner.selectedDevice,
    infoUnitConfigurationNoOnboarding:
      state.homeOwner.infoUnitConfigurationNoOnboarding,
  };
};

export default connect(mapStateToProps)(UnitConfiguration);
