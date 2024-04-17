import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, ScrollView, Image} from 'react-native';
import OptionText from '../components/OptionText';
import {
  BoschIcon,
  CustomText,
  Button,
  ProgressIndicator,
  SwitchContent,
  CustomWheelPicker,
} from '../components';
import {Icons} from '../utils/icons';
import {Colors} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {
  getAdvancedSettings,
  getDeviceInformation,
  lockScreen,
  setAdccessSettings,
} from '../store/actions/HomeOwnerActions';
import {connect, useDispatch} from 'react-redux';
import THERMOMETER from '../assets/images/temperature1.svg';
import { CustomWheelPick } from '../components/CustomWheelPick';

function DeadBandScreen({
  navigation,
  getDeviceInformation,
  deviceInformation,
  selectedDevice,
}) {
  const dispatch = useDispatch();
  const [deadband, setDeadband] = useState('');
  const [deadbandValues, setDeadbandValues] = useState(
    selectedDevice.isFahrenheit
      ? Array.from({length: (9 - 2) / 1 + 1}, (_, i) => `${2 + i * 1} °F`)
      : Array.from({length: (5 - 1) / 1 + 1}, (_, i) => `${1 + i * 1} °C`),
  );

  const [values, setValues] = useState({});

  useEffect(() => {
    loadRunTimeValues();
  }, []);

  function loadRunTimeValues() {
    return new Promise<void>((resolve, reject) => {
      dispatch(
        getAdvancedSettings(selectedDevice.macId, response => {
          const db = response.db;
          const hc = response.hc;
          const hsd = response.hsd;
          const latching = response.latching;
          const sc = response.sc;
          const ss = response.ss;
          const stageDelay = response.stageDelay;
          const stageTemp = response.stageTemp;

          setValues({
            db,
            hc,
            hsd,
            latching,
            sc,
            ss,
            stageDelay,
            stageTemp,
          });

          setDeadband(db);

          resolve();
        }),
      );
    });
  }
  function setAdvancedSettings(value) {
    return new Promise<void>((resolve, reject) => {
      dispatch(
        setAdccessSettings(selectedDevice.macId, value, response => {
          resolve();
        }),
      );
    });
  }

  const setDb = async selected => {
    let replacementArray =
      deadbandValues[selected ? selected['0'] : 0].split(' ');
    let replacement = replacementArray[0];
    setDeadband((replacement * 10).toString());
    setValues({...values, db: replacement});
    await setAdvancedSettings({...values, db: (replacement * 10).toString()});
    dispatch({
      type: 'SHOW_LOADING',
      data: true,
    });
    setTimeout(() => {
      loadRunTimeValues();
    }, 2000);
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
        source={require('../assets/images/header_ribbon.png')}
      />
      <ScrollView>
        <View>
          <View style={{padding: 15}}>
            <View>
              <CustomWheelPick
                type={'picker'}
                testID={'setDeadBand'}
                edit={true}
                blur={true}
                accessibilityHintText={
                  'Activate to open the modal to select the deadband.'
                }
                pickerWidth={'100%'}
                placeholder={'Set to'}
                value={
                  deadband / 10 + (selectedDevice.isFahrenheit ? ' °F' : ' °C')
                }
                isRequiredField={true}
                values={deadbandValues}
                isSvgIcon={true}
                icon={<THERMOMETER fill="#000" />}
                onConfirm={selected => {
                  setDb(selected);
                }}
                accessibilityWheelPickerValue={[
                  ' the amount of degrees for deadband.',
                ]}
                defaultIndex={0}
                defaultValue={deadbandValues[0]}
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
                allowFontScaling={true}
                accessibilityLabelText={
                  'Use the deadband to adjust the minimum value allowed between the heating & cooling set points in Auto mode.'
                }
                size={12}
                align="left"
                newline={true}
                text={
                  'Use the deadband to adjust the minimum value allowed between the heating & cooling set points in Auto mode.'
                }
                style={[styles.flexShrink1, styles.paddingLeft5]}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const mapStateToProps = state => {
  return {
    deviceStatus: state.homeOwner.deviceInformation,
    selectedDevice: state.homeOwner.selectedDevice,
  };
};

const mapDispatchToProps = {
  getDeviceInformation,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeadBandScreen);

const styles = StyleSheet.create({
  optionContainer: {
    borderBottomWidth: 1,
    borderColor: '#BFC0C2',
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
});
