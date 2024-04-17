import React, {useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {BoschIcon, CustomText} from '../components';
import SwitchToggle from 'react-native-switch-toggle';
import {Icons} from '../utils/icons';
import {Colors} from '../styles';
import {connect} from 'react-redux';
import {
  updateUtilityEnergySavings,
  getUtilityEnergySavings,
  updateUtilityEnergySavings2,
} from '../store/actions/HomeOwnerActions';

const UtilityEnergySavings = ({
  deviceList,
  selectedDevice,
  updateUtilityEnergySavings,
  heatPumpInfo,
  getUtilityEnergySavings,
  updateUtilityEnergySavings2,
  utilyEnergySaving,
  idsSelectedDevice,
  idsSelectedOdu,
}) => {
  // useEffect(() => {
  //   const device = deviceList.filter(
  //     (d) => d.macId === selectedDevice.gatewayId,
  //   );
  //   setEnable(device[0]?.energySaveMode);
  // }, []);

  const [isEnable, setIsEnable] = useState('');
  const [enable, setEnable] = useState<Boolean>();
  const [managerStatus, setManagerStatus] = useState('');
  const wasChanged = useRef(false);
  //const deviceId = '399A-000-001234-837668721'
  const deviceId = idsSelectedDevice;

  useEffect(() => {
    getUtilityEnergySavings(deviceId);
  }, []);

  useEffect(() => {
    setIsEnable(utilyEnergySaving);
    setEnable(utilyEnergySaving === 'on' ? true : false);
  }, [utilyEnergySaving]);

  useEffect(() => {
    if (wasChanged.current) {
      if (isEnable === 'on') {
        setEnable(true);
      } else if (isEnable === 'off') {
        setEnable(false);
      }
    }
  }, [isEnable]);

  useEffect(() => {
    if (wasChanged.current) {
      wasChanged.current = false;
      enable === true
        ? updateUtilityEnergySavings2(deviceId, 'on')
        : updateUtilityEnergySavings2(deviceId, 'off');
    }
  }, [enable]);

  /*useEffect(() => {
    if (wasChanged.current) {
      updateUtilityEnergySavings2(deviceId, managerStatus);
      wasChanged.current = false;
    }
  }, [managerStatus]);*/

  // useEffect(() => {
  //   const device = deviceList.filter(
  //    (d) => d.macId === selectedDevice.gatewayId,
  //   );
  //   setEnable(heatPumpInfo.contractorMonitoringStatus);
  // }, []);

  return (
    <View style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 16}}>
      <Image
        style={{alignSelf: 'center', marginTop: 23, marginBottom: 17}}
        source={require('./../assets/images/UtilityEnergy-Green.png')}
      />
      <CustomText
        text={
          'By enabling utility energy savings,\nyou can help your local utility manage\nthe electricity supply during peak\ndemand periods'
        }
        style={{marginBottom: 30}}
      />
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <CustomText text={'Utility Energy Savings'} size={18} font="medium" />
        <SwitchToggle
          switchOn={enable}
          onPress={() => {
            wasChanged.current = true;
            //setEnable(!enable);
            setIsEnable(enable ? 'off' : 'on');
            // updateUtilityEnergySavings({
            //   macId: deviceList.filter(
            //     (d) => d.macId === selectedDevice.gatewayId,
            //   )[0].macId,
            //   energySavingsMode: !enable,
            // });
            // setEnable(!enable);
          }}
          circleColorOff="#FFFFFF"
          circleColorOn="#FFFFFF"
          backgroundColorOn="#00629A"
          backgroundColorOff="#71767C"
          containerStyle={styles.containerStyle}
          circleStyle={styles.circleStyle}
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
            'This helps prevent power outages in the community\nwhen demand exceeds supply.'
          }
          size={12}
          align="left"
          newline={true}
          text={
            'This helps prevent power outages in the community\nwhen demand exceeds supply.'
          }
          style={[styles.flexShrink1, styles.paddingLeft5]}
        />
      </View>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    deviceList: state.homeOwner.deviceList2,
    selectedDevice: state.homeOwner.selectedDevice,
    heatPumpInfo: state.homeOwner.heatPumpInfo,
    utilyEnergySaving: state.homeOwner.utilyEnergySaving,
    idsSelectedDevice: state.homeOwner.idsSelectedDevice,
    idsSelectedOdu: state.homeOwner.idsSelectedOdu,
  };
};

const mapDispatchToProps = {
  updateUtilityEnergySavings,
  getUtilityEnergySavings,
  updateUtilityEnergySavings2,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UtilityEnergySavings);

const styles = StyleSheet.create({
  tipSection: {
    flexDirection: 'row',
    marginTop: 28,
  },
  flexShrink1: {
    flexShrink: 1,
  },
  paddingLeft5: {
    paddingLeft: 5,
  },
  containerStyle: {
    width: 48,
    height: 24,
    borderRadius: 50,
    padding: 6,
  },
  circleStyle: {
    width: 12,
    height: 12,
    borderRadius: 25,
  },
});
