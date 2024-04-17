/**
 * @file HomeOwnerUsage is the Home Page for the HomeOwner.
 * An energy visualization graphic is displayed on the tab "Energy Usage"
 * Power usage graph will update on a monthly basis and show an average consumption
 * @author Aarthi Govardhanan
 *
 */

import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import * as homeOwnerActions from '../store/actions/HomeOwnerActions';
import {EnergyUsageGraph} from './EnergyUsageGraph';
import {useDispatch} from 'react-redux';
import {View, Linking, Platform, Pressable} from 'react-native';
import {getLatestVersion} from '../store/actions/AuthActions';
import DeviceInfo from 'react-native-device-info';
import {withNavigationFocus} from 'react-navigation';
import {
  BoschIcon,
  Button,
  ConfirmationDialog,
  CustomText,
  ModalComponent,
} from '../components';
import {Dictionary} from '../utils/dictionary';
import {removeDeviceToken} from '../store/actions/NotificationActions';
import EnergySavingsBanner from './../components/EnergySavingsBanner';

function HomeOwnerUsage(props) {
  const dispatch = useDispatch();
  const energyUsage = useSelector(state => state.homeOwner.energyData);
  const devices = useSelector(state => state.homeOwner.deviceList2);
  const prevSelectedDevice = useSelector(
    state => state.homeOwner.prevSelectedDevice,
  );
  const selectedDevice = useSelector(state => state.homeOwner.selectedDevice);
  const gateWayId =
    selectedDevice &&
    prevSelectedDevice &&
    selectedDevice.gatewayId &&
    prevSelectedDevice.gatewayId &&
    selectedDevice.gatewayId !== prevSelectedDevice.gatewayId
      ? prevSelectedDevice.gatewayId
      : selectedDevice.gatewayId;
  const [versionChange, setVersionChange] = useState(false);
  const localVersion = Dictionary.common.appVersion;
  const deviceData =
    props.navigation.state.params !== undefined
      ? props.navigation.state.params.deviceData
      : selectedDevice.deviceType;
  const deviceId =
    props.navigation.state.params !== undefined
      ? props.navigation.state.params.deviceId
      : selectedDevice.macId;
  const macId =
    props.navigation.state.params !== undefined
      ? props.navigation.state.params.deviceId
      : selectedDevice.macId;
  const energyUsageEvent = useSelector(
    state => state.homeOwner.idsEnergyUsageEvent,
  );

  // const [versionChange, setVersionChange] = useState(false);
  // const localVersion = Dictionary.common.appVersion;

  // useEffect(() => {
  //   dispatch(
  //     getLatestVersion((successCallback) => {
  //       let globalVersion =
  //         Platform.OS === 'ios'
  //           ? successCallback.iosLatestVersion
  //           : successCallback.andriodLatestVersion;
  //       if (globalVersion !== localVersion) {
  //         setVersionChange(true);
  //       } else {
  //         setVersionChange(false);
  //       }
  //     }),
  //   );
  // }, []);

  const handleIDSPremium = () => {
    if (selectedDevice !== undefined && selectedDevice.gatewayId) {
      dispatch(homeOwnerActions.getUsageGraphByDeviceId(deviceId));
    }
  };

  useEffect(() => {
    //setTimeout(() => {
    dispatch(homeOwnerActions.updateIdsSelectedDevice(deviceId));
    dispatch(homeOwnerActions.updateIdsSelectedDeviceType(deviceData));
    //}, 2000);
  });

  const handleIDSArtic = () => {
    dispatch(homeOwnerActions.getUsageGraphByDeviceId2(deviceId));
  };

  useEffect(() => {
    if (props.isFocused) {
      //endEventBanner
      dispatch(
        homeOwnerActions.getResourceStatus({
          gatewayId: macId,
        }),
      );
    }
  }, [props.isFocused]);

  useEffect(() => {
    if (props.isFocused) {
      deviceData === 'IDS Premium Connected'
        ? handleIDSPremium()
        : handleIDSArtic();
    }
  }, [selectedDevice]);

  return (
    <>
      <EnergyUsageGraph deviceData={energyUsage} />
      {/* {versionChange && (
        <View>
          <ConfirmationDialog
            visible={versionChange}
            title={Dictionary.common.newVersion}
            text={Dictionary.common.version}
            textAlign={'center'}
            textColor={'#43464A'}
            primaryButton={'Update'}
            primaryButtonOnPress={() => {
              Linking.openURL(
                Platform.OS === 'ios'
                  ? Dictionary.common.appStoreUrl
                  : Dictionary.common.playStoreUrl,
              );
              dispatch(removeDeviceToken(props.navigation));
            }}
          />
        </View>
      )} */}
    </>
  );
}

export default withNavigationFocus(HomeOwnerUsage);
