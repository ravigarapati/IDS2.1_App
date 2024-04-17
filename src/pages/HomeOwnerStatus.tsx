/**
 * @file HomeOwnerStatus is a tab in the Home Page for the HomeOwner.
 * Fault code if any for the unit(s) assigned to the homeowner can be viewed in this tab.
 * User can also view Contractor monitoring status int this page and navigate to my appliances page by clicking a hyperlinnk.
 * @author Aarthi Govardhanan
 *
 */

import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {BoschIcon, Button, CustomText, Loader} from '../components';
import {Dictionary} from '../utils/dictionary';
import {Colors} from '../styles';
import * as homeOwnerActions from '../store/actions/HomeOwnerActions';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Icons} from '../utils/icons';

/** Typedef for props */
type propsType = {
  navigation: any;
};

export default function HomeOwnerStatus(props: propsType) {
  const dispatch = useDispatch();
  const deviceStatus = useSelector((state) => state.homeOwner.deviceStatus);
  const deviceData = useSelector((state) => state.homeOwner.selectedDevice);
  const [showLoader, setShowLoader] = useState(false);

  /** To Fetch the Status of the given DeviceId */
  const initData = async (data) => {
    if (data) {
      dispatch(homeOwnerActions.getStatusByDeviceId(data.gatewayId));
    }
  };

  /** On Focus of the status tab, to Fetch the Status of the given DeviceId */
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('willFocus', () => {
      initData(deviceData);
    });
    return () => {
      unsubscribe.remove();
    };
  }, [deviceData]);

  /** To Fetch the Status of the given DeviceId on load of the component */
  useEffect(() => {
    if (deviceData !== undefined && Object.keys(deviceData).length !== 0) {
      setShowLoader(true);
      dispatch(homeOwnerActions.getStatusByDeviceId(deviceData.gatewayId));
    }
  }, [deviceData]);

  /** To hide the loader on success of the devicestatus API */
  useEffect(() => {
    setShowLoader(false);
  }, [deviceStatus]);

  const faultMessageAccepted =
    Dictionary.homeOwnerStatus.thereIs +
    deviceStatus.code +
    Dictionary.homeOwnerStatus.activeFaultInfoAccepted;
  const faultMessageDenied =
    Dictionary.homeOwnerStatus.thereIs +
    deviceStatus.code +
    Dictionary.homeOwnerStatus.activeFaultInfoDenied;
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <CustomText
          text={Dictionary.homeOwnerStatus.title}
          font="bold"
          align="left"
        />
      </View>
      {deviceStatus.healthy ? (
        <View style={[styles.statusContainer, styles.noFault]}>
          <BoschIcon
            name={Icons.alertSuccessFilled}
            size={30}
            color={Colors.darkGreen}
            style={{height: 30}}
          />
          <View style={styles.infoContainer}>
            <CustomText
              text={Dictionary.homeOwnerStatus.noActiveFaultInfo}
              font="regular"
              color={Colors.darkGreen}
              align="left"
            />
          </View>
        </View>
      ) : (
        <View style={[styles.statusContainer, styles.fault]}>
          <BoschIcon
            name={Icons.alertErrorFilled}
            size={30}
            color={Colors.darkRed}
            style={{height: 30}}
          />
          <View style={styles.infoContainer}>
            <CustomText
              text={
                deviceData && deviceData.contractorMonitoringStatus
                  ? faultMessageAccepted
                  : faultMessageDenied
              }
              font="regular"
              color={Colors.darkRed}
              align="left"
            />
          </View>
        </View>
      )}
      <View style={styles.separator} />
      <View style={styles.permissionsContainer}>
        <CustomText
          text={Dictionary.homeOwnerStatus.monitoringStatus}
          size={21}
          align="left"
          newline={true}
        />
        <View style={[styles.flexRow, styles.paddingBottom]}>
          <BoschIcon
            name={
              deviceData && deviceData.contractorMonitoringStatus
                ? Icons.alertSuccessFilled
                : Icons.abortFrame
            }
            size={30}
            color={Colors.darkGreen}
            style={[styles.permissionsIcon, {height: 30}]}
          />
          <View>
            <CustomText
              text={
                deviceData && deviceData.contractorMonitoringStatus
                  ? Dictionary.homeOwnerStatus.permissionGranted
                  : Dictionary.homeOwnerStatus.permissionDenied
              }
              align="left"
            />
          </View>
        </View>
        <View style={styles.flexRow}>
          <CustomText
            text={Dictionary.homeOwnerStatus.toChangePermission}
            size={12}
            align="left"
            newline={true}
          />
          <Button
            type="tertiary"
            text={Dictionary.homeOwnerStatus.here}
            style={styles.clickHereButton}
            textStyle={styles.clickHereText}
            onPress={() => props.navigation.navigate('MyAppliance')}
          />
        </View>
      </View>
      {/* {showLoader && <Loader />} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  statusContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: Colors.lightRed,
    flexDirection: 'row',
    borderBottomColor: Colors.mediumGray,
  },
  fault: {
    backgroundColor: Colors.lightRed,
  },
  noFault: {
    backgroundColor: Colors.lightGreen,
  },
  titleContainer: {
    backgroundColor: Colors.lightGray,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  infoContainer: {
    paddingHorizontal: 10,
    flex: 1,
  },
  separator: {
    borderBottomColor: Colors.black,
    borderBottomWidth: 1,
  },
  permissionsContainer: {
    padding: 20,
  },
  flexRow: {
    flexDirection: 'row',
  },
  permissionsIcon: {
    paddingRight: 15,
  },
  clickHereText: {
    fontSize: 12,
  },
  clickHereButton: {
    bottom: 22,
  },
  paddingBottom: {
    paddingBottom: 15,
  },
});
