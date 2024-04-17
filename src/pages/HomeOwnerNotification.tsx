import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  Linking,
  Image,
} from 'react-native';
import {BoschIcon, Button, CustomText} from '../components';
import {Dictionary} from '../utils/dictionary';
import {Icons} from '../utils/icons';
import {Enum} from '../utils/enum';
import {Colors} from '../styles/colors';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import * as homeOwnerActions from '../store/actions/HomeOwnerActions';
import {
  clearNotificationsCount,
  setNotificationRead,
} from '../store/actions/NotificationActions';
import UserAnalytics from '../components/UserAnalytics';
import {showToast} from '../components/CustomToast';

export default function HomeOwnerNotification(props) {
  let EditAppliancelist = [];
  const deviceList = useSelector(state => state.homeOwner.deviceList2);
  var deviceNames = deviceList.map(function (item) {
    EditAppliancelist = item;
    return item.ODUName;
  });

  UserAnalytics('ids_homeowner_notification');

  const applianceDetails = gatewayId => {
    const selectedList = deviceList.filter(
      value => value && value.macId === gatewayId,
    );
    if (selectedList && selectedList.length > 0) {
      const deviceName = selectedList[0].deviceName;
      props.navigation.navigate('EditAppliance', {
        data: selectedList[0],
        namesList: deviceName,
      });
    } else {
      showToast('This unit is no longer associated to you', 'error');
    }
  };

  const dispatch = useDispatch();
  const notificationList = useSelector(
    state => state.homeOwner.notificationList,
  );
  const userId = useSelector(state => state.auth.user).attributes.sub;
  const lastKey = useSelector(state => state.homeOwner.lastKey);
  const [expandedItem, setExpandedItem] = useState('');

  useEffect(() => {
    dispatch(homeOwnerActions.getDeviceList2({userId: userId}));
    dispatch(homeOwnerActions.notifications({}));
    dispatch(homeOwnerActions.unreadHomeownerNotificationCount());
  }, []);

  function loadMoreDetails(lastEvalKey) {
    const input = {
      LastEvaluatedKey: lastEvalKey,
    };
    dispatch(homeOwnerActions.loadMore(input));
  }
  const renderEmptyContainer = () => {
    return (
      <View style={styles.noRecord}>
        <CustomText
          text={Dictionary.notification.noResultFound}
          size={16}
          color={Colors.black}
        />
      </View>
    );
  };
  const loadMore = () => {
    return (
      <>
        {lastKey && lastKey.issueDate && (
          <Button
            type="tertiary"
            icon={Icons.refresh}
            text={Dictionary.notification.loadMore}
            onPress={() => loadMoreDetails(lastKey)}
          />
        )}
      </>
    );
  };

  function handleAccordion(index, uniqueKey, issueDate) {
    expandedItem === uniqueKey
      ? setExpandedItem('')
      : setExpandedItem(uniqueKey);
    if (notificationList[index].unread) {
      notificationList[index].unread = false;
      dispatch(homeOwnerActions.markNotificationRead(index));
      dispatch(setNotificationRead(issueDate));
    }
  }

  function navigateOnPress(notification, data, index, issueDate, gatewayId) {
    if (notificationList[index].unread) {
      notificationList[index].unread = false;
      dispatch(setNotificationRead(issueDate));
    }
    switch (notification) {
      case 'gatewayLostConnectionPermission': {
        applianceDetails(gatewayId);
        break;
      }
      case 'heatPumpErrorPermissions': {
        applianceDetails(gatewayId);
        break;
      }
      case 'faultCodeDelayedErrorPermissions': {
        applianceDetails(gatewayId);
        break;
      }
      case 'energyUsageUpdate': {
        if (deviceList) {
          let device = deviceList.find(data => data.macId === gatewayId);
          if (device !== undefined) {
            dispatch(homeOwnerActions.updateSelectedUnitName(device));
            dispatch(homeOwnerActions.setSelectedDevice(device));
            dispatch(homeOwnerActions.setPrevSelectedDevice(device));
            dispatch(homeOwnerActions.getUsageGraphByDeviceId(device.macId));
            dispatch(homeOwnerActions.setUnitNameIds(device.deviceName));
            props.navigation.navigate('Usage', {
              deviceData: device.deviceType,
              deviceId: device.macId,
            });
          } else {
            showToast('This unit is not in your account.', 'error');
          }
        }

        break;
      }
      case 'contractorMonitoringRequest': {
        applianceDetails(gatewayId);
        break;
      }
      case 'addNewHeatPump': {
        console.log('');
        props.navigation.navigate('addIds', {
          addAnother: true,
          showBackButton: true,
        });
        break;
      }
      case 'reminderannual': {
        Linking.openURL('tel:' + data);
        break;
      }
      case 'updateFailed': {
        props.navigation.navigate('AddBccUpdate');
        break;
      }
    }
  }

  const parseHourFormat = hour => {
    return hour % 12 || 12;
  };

  const notificationRenderItem = ({index, item}) => {
    let itemInfo =
      Enum.HomeOwnerNotification[
        item.notification ? item.notification : item.data.notification
      ];
    let utilityEnergyText = '';
    if (item.notification === 'optout') {
      let notificationDate = new Date(item.data.start_time);
      let currentDate = new Date();
      if (
        notificationDate.getDate() === currentDate.getDate() &&
        notificationDate.getMonth() === currentDate.getMonth() &&
        notificationDate.getFullYear() === currentDate.getFullYear()
      ) {
        if (currentDate < notificationDate) {
          utilityEnergyText = `Utility Energy Savings will be in effect at ${
            parseHourFormat(notificationDate.getHours()) < 10
              ? `0${parseHourFormat(notificationDate.getHours())}`
              : parseHourFormat(notificationDate.getHours())
          }:${
            notificationDate.getMinutes() < 10
              ? `0${notificationDate.getMinutes()}`
              : notificationDate.getMinutes()
          } ${notificationDate.getHours() <= 11 ? 'AM' : 'PM'} ${
            item.data && item.data.timezone_abbreviation
              ? item.data.timezone_abbreviation
              : ''
          }`;
        } else {
          utilityEnergyText = 'Utility Energy Savings is in effect';
        }
      } else if (notificationDate > currentDate) {
        utilityEnergyText = `Utility Enery Savings will be in effect on ${
          notificationDate.getMonth() + 1
        }/${notificationDate.getDate()}/${notificationDate.getFullYear()} at ${
          parseHourFormat(notificationDate.getHours()) < 10
            ? `0${parseHourFormat(notificationDate.getHours())}`
            : parseHourFormat(notificationDate.getHours())
        }:${
          notificationDate.getMinutes() < 10
            ? `0${notificationDate.getMinutes()}`
            : notificationDate.getMinutes()
        } ${notificationDate.getHours() <= 11 ? 'AM' : 'PM'} ${
          item.data && item.data.timezone_abbreviation
            ? item.data.timezone_abbreviation
            : ''
        }`;
      } else {
        utilityEnergyText = 'Utility Energy Savings is in effect';
      }
    }
    return (
      <>
        {itemInfo && (
          <View
            style={[
              styles.subContainer,
              item.unread && styles.unreadNotification,
            ]}>
            <View style={[styles.flex1, styles.flexRow]}>
              <View style={[styles.flexCol1, {alignItems: 'center'}]}>
                {itemInfo.icon === 'energyUsage' ? (
                  <Image
                    source={require('./../assets/images/UtilitySavings-GreenNotificationscreen.png')}
                  />
                ) : (
                  <BoschIcon
                    name={itemInfo && Icons[itemInfo.icon]}
                    color={itemInfo && Colors[itemInfo.iconColor]}
                    size={28}
                    style={styles.tabIcon}
                  />
                )}
              </View>
              <View style={[styles.flexCol2]}>
                <CustomText
                  text={
                    itemInfo && item.data && item.data.deviceName
                      ? item.data.deviceName + ' Thermostat'
                      : Dictionary.homeownernotification[itemInfo.title]
                  }
                  font="bold"
                  align="left"
                />
                {item.ODUName && (
                  <CustomText text={item.ODUName} align="left" />
                )}
                {item.notificationType !== undefined &&
                  (item.notificationType === 'updateSuccess' ||
                    item.notificationType === 'updateFailed') && (
                    <CustomText
                      text={
                        item.notificationType === 'updateSuccess'
                          ? 'Update Success'
                          : 'Update Failed'
                      }
                      align="left"
                    />
                  )}

                <CustomText
                  text={moment(Number(item.issueDate)).format(
                    'hh:mm A  MM/DD/YYYY',
                  )}
                  align="left"
                  font="light-italic"
                  size={12}
                />
                {expandedItem === item.uniqueKey &&
                  item.data &&
                  (item.data.ODUSerialNumber || item.data.macId) && (
                    <CustomText
                      text={
                        item.data.ODUSerialNumber
                          ? item.data.ODUSerialNumber
                          : 'MAC ID: ' + item.data.macId
                      }
                      font="bold"
                      align="left"
                    />
                  )}

                {expandedItem === item.uniqueKey && (
                  <CustomText
                    text={
                      itemInfo
                        ? itemInfo.message ===
                            'contractorMonitoringRequestmessage' ||
                          itemInfo.message === 'addNewHeatPumpmessage'
                          ? (item.data === undefined ||
                            item.data ===
                              null /*if company is null or undefine we need to show 'your contractor' which handle in frontend*/
                              ? 'Your Contractor'
                              : item.data) +
                            Dictionary.homeownernotification[itemInfo.message]
                          : itemInfo.message === 'energyUsageUpdatemessage'
                          ? Number(item.data) > 0
                            ? Dictionary.homeownernotification[
                                itemInfo.message
                              ] +
                              ' up by ' +
                              Math.abs(item.data) +
                              '% since last month'
                            : Dictionary.homeownernotification[
                                itemInfo.message
                              ] +
                              ' down by ' +
                              item.data +
                              ' since last month'
                          : itemInfo.message === 'eneryUsageInEffectMessage'
                          ? `${utilityEnergyText}. This help to prevent power outages in the community when demand exceeds supply.`
                          : Dictionary.homeownernotification[itemInfo.message]
                        : ''
                    }
                    align="left"
                  />
                )}
                <View style={[styles.flexCol2]}>
                  {itemInfo.buttonText !== 'na' ? (
                    <View style={[styles.customButton]}>
                      <Button
                        type="tertiary"
                        text={
                          itemInfo.buttonText
                            ? Dictionary.homeownernotification[
                                itemInfo.buttonText
                              ]
                            : ''
                        }
                        onPress={() => {
                          item.notification === 'optout'
                            ? dispatch(
                                homeOwnerActions.updateUtilityEnergySavings({
                                  macId: item.data.gateway_id,
                                }),
                              )
                            : item.notification === 'reminderannual'
                            ? navigateOnPress(
                                item.notification,
                                item.data,
                                index,
                                item.issueDate,
                                item.gatewayId,
                              )
                            : navigateOnPress(
                                item.notification,
                                '',
                                index,
                                item.issueDate,
                                item.gatewayId,
                              );
                        }}
                        textStyle={{color: Colors.mediumBlue}}
                      />
                    </View>
                  ) : null}
                </View>
              </View>
              <View
                style={([styles.flexCol1], {flexDirection: 'column-reverse'})}>
                <TouchableWithoutFeedback
                  hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
                  onPress={() =>
                    handleAccordion(index, item.uniqueKey, item.issueDate)
                  }>
                  <BoschIcon
                    name={
                      expandedItem === item.uniqueKey ? Icons.up : Icons.down
                    }
                    size={30}
                    style={styles.tabIcon}
                    color={Colors.mediumBlue}
                  />
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        )}
      </>
    );
  };

  return (
    <View>
      {props.navigation.state.params &&
        props.navigation.state.params.showLabel !== undefined && (
          <Image
            style={{height: 8, width: '100%'}}
            source={require('../assets/images/header_ribbon.png')}
          />
        )}
      <View style={styles.container}>
        <FlatList
          data={notificationList}
          refreshing={false}
          onRefresh={() => dispatch(homeOwnerActions.notifications({}))}
          renderItem={notificationRenderItem}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => {
            return <View style={[styles.grayUnderline]} />;
          }}
          ListEmptyComponent={renderEmptyContainer()}
          ListFooterComponent={loadMore}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 5,
    backgroundColor: Colors.white,
    height: '100%',
  },
  grayUnderline: {
    borderBottomColor: Colors.mediumGray,
    borderBottomWidth: 0.8,
  },
  flex1: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexCol1: {
    flex: 0.15,
  },
  flexCol2: {
    flex: 0.9,
  },
  padding10: {
    padding: 10,
  },
  paddingBottom10: {
    paddingBottom: 10,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  alignCenter: {
    alignItems: 'center',
  },
  tabIcon: {
    padding: 10,
  },
  subContainer: {
    marginVertical: 10,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    paddingTop: 0,
    backgroundColor: Colors.white,
  },
  flatListContainer: {
    flexGrow: 1,
  },
  noRecord: {
    marginTop: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  unreadNotification: {
    borderLeftColor: Colors.mediumBlue,
    borderLeftWidth: 5,
    marginLeft: 5,
  },
  padding20: {
    padding: 20,
  },
  filterView: {
    right: 10,
    position: 'absolute',
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  customButton: {
    width: '55%',
    borderWidth: 1,
    marginTop: 15,
    borderColor: Colors.mediumBlue,
  },
});
