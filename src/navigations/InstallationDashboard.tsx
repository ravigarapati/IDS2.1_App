import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {MaterialTopTabBar} from 'react-navigation-tabs';
import {Colors, Typography} from '../styles';
import {CustomText, InfoTooltip, Link} from '../components';
import {Dictionary} from '../utils/dictionary';
import {useSelector, useDispatch} from 'react-redux';
import {Icons} from '../utils/icons';
import moment from 'moment';
import * as Notification from '../store/actions/NotificationActions';
import {showToast} from '../components/CustomToast';
export const InstallationDashboard = props => {
  const selectedUnit = useSelector(state => state.contractor.selectedUnit);
  const demoMode = useSelector(state => state.notification.demoStatus);

  let activeNotificationList = useSelector(state => state.notification.active);
  const [closeTooltip, setCloseTooltip] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    props.navigation.addListener('didFocus', () => {
      setCloseTooltip(false);
      unitNotificationCount();
    });
  }, []);

  const unitNotificationCount = () => {
    dispatch(
      Notification.getActiveNotificationList(() => {
        const {odu} = selectedUnit;
        const {serialNumber} = odu;
        let searchText = serialNumber;
        let tempList = [];
        tempList = activeNotificationList;
        if (searchText.length !== 0) {
          let titleList = [];
          let tempSearchText = searchText;
          tempSearchText = tempSearchText.trim().split(/ +/).join(' ');
          for (let i = 0; i < tempList.length; i++) {
            if (
              tempList[i].hasOwnProperty('ODUSerialNumber') &&
              tempList[i].hasOwnProperty('unread') &&
              tempList[i].unread === 'true' &&
              tempList[i].ODUSerialNumber.toLocaleLowerCase().includes(
                tempSearchText.toLocaleLowerCase(),
              )
            ) {
              titleList.push(tempList[i]);
            }
          }
          dispatch(Notification.updateNotificationsCount(titleList.length));
        }
      }),
    );
  };
  const tooltipText =
    Dictionary.common.oduSerialNumber +
    selectedUnit.odu.serialNumber +
    Dictionary.common.gatewaySerialNumber +
    selectedUnit.gateway.gatewayId +
    Dictionary.common.gatewayVersion +
    selectedUnit.gateway.firmwareVersion +
    Dictionary.common.serviceDate +
    moment(selectedUnit.odu.serviceStartDate).format('MM/DD/YYYY') +
    '\n \n';
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <CustomText
          font="medium"
          align="left"
          size={12}
          text={Dictionary.installationDashboard.unitModelNumber + ':'}
        />
        <View style={styles.flexRow}>
          <CustomText
            font="bold"
            align="left"
            text={selectedUnit.odu.modelNumber}
            style={styles.padBottom5}
          />
          <InfoTooltip
            icon={Icons.options}
            positionVertical="bottom"
            closeTooltip={closeTooltip}>
            {/* For the purpose of link along with text within a tooltip, <Text> tag is used below */}
            <View style={styles.flexColumn}>
              <Text style={styles.tooltipText}>{tooltipText}</Text>
              <Link
                text={Dictionary.addUnit.replaceGateway}
                onPress={() => {
                  if (!demoMode) {
                    setCloseTooltip(true);
                    props.navigation.navigate('ReplaceGateway');
                  } else {
                    showToast(Dictionary.demoMode.functionNotAvailable, 'info');
                  }
                }}
              />
            </View>
          </InfoTooltip>
        </View>
      </View>
      <MaterialTopTabBar {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    backgroundColor: Colors.white,
  },
  flexColumn: {
    flexDirection: 'column',
  },
  tooltipText: {
    ...Typography.boschReg12,
    textAlign: 'left',
    flexShrink: 1,
  },
  textContainer: {
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.mediumGray,
  },
  padBottom5: {
    paddingBottom: 5,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
