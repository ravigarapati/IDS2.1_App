import React, {useMemo, useState} from 'react';
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
import {WithLocalSvg} from 'react-native-svg';

import HumidifierImage from '../../assets/images/humidifier.svg';
import DehumidifierImage from '../../assets/images/dehumidifier.svg';
import NoneHumidifierImage from '../../assets/images/noneHumidifier.svg';
import {
  setUnitConfigurationEndPoint,
  updateUnitConfiguration,
  updateUnitConfigurationNoOnboarding,
} from '../../store/actions/HomeOwnerActions';
import {connect, useDispatch} from 'react-redux';

const modes = [
  {
    id: 1,
    name: 'Humidifier',
    description: '',
  },
  {
    id: 2,
    name: 'Dehumidifier',
    description: '',
  },
  {
    id: 3,
    name: 'None',
    description: '',
  },
];

const NoHeating2 = ({
  navigation,
  infoUnitConfiguration,
  isOnboardingBcc50,
  infoUnitConfigurationNoOnboarding,
  selectedDevice,
}) => {
  const dispatch = useDispatch();
  const [currentSelected, setCurrentSelected] = useState(
    isOnboardingBcc50
      ? parseInt(infoUnitConfiguration.humidityConf)
      : parseInt(infoUnitConfigurationNoOnboarding.humiType),
  );
  const [wasChanged, setWasChanged] = useState(false);

  const [HumidifierToggleButton, setHumidifierToggleButton] = useState(
    isOnboardingBcc50
      ? parseInt(infoUnitConfiguration.humidType)
      : parseInt(infoUnitConfigurationNoOnboarding.humidifer),
  );
  const HumidifierEvaporativeText =
    'Humidifier activated only during active heating.';
  const HumidifierSteamText =
    'Humidifier activated regardless of heating calls.';

  const [DehumidifierSwitchButton, setDehumidifierSwitchButton] = useState(
    isOnboardingBcc50
      ? parseInt(infoUnitConfiguration.dehumidType)
      : parseInt(infoUnitConfigurationNoOnboarding.dehumidifer),
  );
  const DeumidifyText = `Disable this function to use dehumidifying accessories such as Hot Gas Reheat. Please consult the owner's manuals for further information.`;

  const renderIcon = name => {
    switch (name) {
      case 'Humidifier':
        return <HumidifierImage width={20} height={20} fill="#000" />;
      case 'Dehumidifier':
        return <DehumidifierImage width={20} height={20} fill="#000" />;
      case 'None':
        return <NoneHumidifierImage width={20} height={20} fill="#000" />;
    }
  };

  const renderChildren = name => {
    switch (name) {
      case 'Humidifier':
        return HumidifierComponent;
      case 'Dehumidifier':
        return DehumidifierComponent;
    }
  };

  const clickHandlerHumidifierToggleButton = value => {
    if (value == 0) {
      setHumidifierToggleButton(1);
      dispatch(updateUnitConfiguration({name: 'humidType', value: 1}));
      dispatch(
        updateUnitConfigurationNoOnboarding({name: 'humidifer', value: '1'}),
      );
    } else if (value == 1) {
      setHumidifierToggleButton(0);
      dispatch(updateUnitConfiguration({name: 'humidType', value: 0}));
      dispatch(
        updateUnitConfigurationNoOnboarding({name: 'humidifer', value: '0'}),
      );
    }
  };

  const FinishSaveUnitConfiguration = async () => {
    await setUnitConfigurationFunction();
    navigation.navigate('ScreenAdvancedSettings2');
  };

  function setUnitConfigurationFunction() {
    /* istanbul ignore next */ return new Promise<void>((resolve, reject) => {
      dispatch(
        setUnitConfigurationEndPoint(
          selectedDevice.macId,
          infoUnitConfigurationNoOnboarding,
          response => {
            resolve();
          },
        ),
      );
    });
  }

  const HumidifierComponent = useMemo(() => {
    return (
      <View testID="HumidifierChildren" style={{width: '100%'}}>
        <View style={styles.ToggleButtonView}>
          <ToggleButton
            type="text"
            button1={'Evaporative'}
            button1AccessibilityHint="Activate to select evaporative as the humidifier option."
            button2={'Steam'}
            button2AccessibilityHint="Activate to select steam as the humidifier option."
            isvisible={true}
            onChange={(value: any) => clickHandlerHumidifierToggleButton(value)}
            pressed={HumidifierToggleButton == 1 ? 0 : 1}
            testIDPrimary="HumidifierToggleButton1"
            testIDSecondary="HumidifierToggleButton2"
          />
        </View>
        <View style={styles.tipSection}>
          <BoschIcon
            size={20}
            name={Icons.infoTooltip}
            color={Colors.mediumBlue}
            accessibilityLabel={'Info'}
          />
          <CustomText
            accessibilityLabelText={
              HumidifierToggleButton == 'Evaporative'
                ? HumidifierEvaporativeText
                : HumidifierSteamText
            }
            size={12}
            align="left"
            newline={true}
            text={
              HumidifierToggleButton == 'Evaporative'
                ? HumidifierEvaporativeText
                : HumidifierSteamText
            }
            style={[styles.flexShrink1, styles.paddingLeft5]}
          />
        </View>
      </View>
    );
  }, [HumidifierToggleButton]);

  const DehumidifierComponent = useMemo(() => {
    const switchOn = value => {
      setDehumidifierSwitchButton(value);
      dispatch(
        updateUnitConfiguration({name: 'dehumidType', value: value ? 1 : 0}),
      );
      dispatch(
        updateUnitConfigurationNoOnboarding({
          name: 'dehumidifer',
          value: value ? '1' : '0',
        }),
      );
    };

    return (
      <View>
        <View style={{marginBottom: 10}}>
          <SwitchContent
            testID="coolToDehumidifySwitch"
            accesoryOn={DehumidifierSwitchButton == 0 ? false : true}
            initialText={'Cool to Dehumidify'}
            switchStatus={value => switchOn(value)}
            marginTop={0}
            paddingHorizontal={5}
            marginHorizontal={-5}
            borderBottomColor={'transparent'}
            initialEventOff={true}
            accessibilityLabelText="Cool to dehumidify."
            accessibilityHintText={`Activate to ${
              DehumidifierSwitchButton == 0 ? 'enable' : 'disable'
            } cool.`}
          />
        </View>
        <View>
          <CustomText
            allowFontScaling={true}
            color={Colors.black}
            font={'regular'}
            text={
              'Runs the appliance in cooling mode to meet humidity set point.'
            }
            align={'left'}
            size={16}
          />
        </View>
        <View testID="tipSectionHumidifier" style={styles.tipSection}>
          <BoschIcon
            size={20}
            name={Icons.infoTooltip}
            color={Colors.mediumBlue}
            accessibilityLabel={'Info'}
          />
          <CustomText
            allowFontScaling={true}
            accessibilityLabelText={DeumidifyText}
            size={12}
            align="left"
            newline={true}
            text={DeumidifyText}
            style={[styles.flexShrink1, styles.paddingLeft5]}
          />
        </View>
      </View>
    );
  }, [DehumidifierSwitchButton]);

  const NavigateToFinish = () => {
    if (isOnboardingBcc50) {
      navigation.navigate('DateAndTime');
    } else {
      FinishSaveUnitConfiguration();
    }
  };

  const handleCurrentSelected = value => {
    setCurrentSelected(value - 1);
    dispatch(updateUnitConfiguration({name: 'humidityConf', value: value - 1}));
    dispatch(
      updateUnitConfigurationNoOnboarding({
        name: 'humiType',
        value: (value - 1).toString(),
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
              steps={2}
              currentStep={2}
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
            {modes.map(item => {
              return (
                <OptionText
                  key={item.name}
                  option={item}
                  setWasChanged={setWasChanged}
                  setCurrent={handleCurrentSelected}
                  renderIcon={() => renderIcon(item.name)}
                  showIcon={true}
                  currentSelected={currentSelected + 1}
                  disable={false}
                  enableHint=""
                  disableHint={`Activate it to enable ${
                    item.name
                  }. Current selected: ${
                    modes.find(m => m.id === currentSelected)?.name
                  }`}
                  showChildren={currentSelected + 1 == item.id ? true : false}
                  renderChildren={() => renderChildren(item.name)}
                />
              );
            })}
          </View>
          {currentSelected == 3 ? (
            <View style={{paddingHorizontal: 15}}>
              <View style={styles.tipSection}>
                <BoschIcon
                  size={20}
                  name={Icons.infoTooltip}
                  color={Colors.mediumBlue}
                  accessibilityLabel={'Info'}
                />
                <CustomText
                  accessibilityLabelText={DeumidifyText}
                  size={12}
                  align="left"
                  newline={true}
                  text={DeumidifyText}
                  style={[styles.flexShrink1, styles.paddingLeft5]}
                />
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
      <View>
        <Button
          type="primary"
          text={Dictionary.button.next}
          style={{marginHorizontal: 15}}
          onPress={NavigateToFinish}
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
    height: 65,
    paddingHorizontal: 30,
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

export default connect(mapStateToProps)(NoHeating2);
