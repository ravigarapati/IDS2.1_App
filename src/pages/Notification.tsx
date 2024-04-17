import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Colors} from '../styles/colors';
import {
  Alert,
  FlatList,
  Linking,
  Platform,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  BoschIcon,
  Button,
  ConfirmationDialog,
  CustomInputText,
  CustomText,
} from '../components';
import {Dictionary} from '../utils/dictionary';
import {Icons} from '../utils/icons';
import {Enum} from '../utils/enum';
import * as ContractorActions from '../store/actions/ContractorActions';
import {
  getActiveNotificationList,
  moveNotificationToArchive,
  getArchiveNotificationList,
  searchArchiveNotification,
  setIssueDate,
  setNotificationRead,
  updateActiveNotification,
  removeDeviceToken,
} from '../store/actions/NotificationActions';
import moment from 'moment';
import UserAnalytics from '../components/UserAnalytics';
import {showToast} from '../components/CustomToast';
import {Mock} from '../utils/Mock';
import variables from '../utils/HomeIdsValue';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import Amplify, {Hub} from 'aws-amplify';
import awsconfig from '../../aws-exports';

export default function Notification(props) {
  const dispatch = useDispatch();
  const notificationMap = Enum.notification;
  const tabs = [0, 1];
  const [searchText, setSearchText] = useState('');
  const [expandedItem, setExpandedItem] = useState('');
  const [archiveListExpandedItem, setArchiveListExpandedItem] = useState('');
  const faultCases = ['GatewayFault', 'HeatPumpFault'];
  const [showFilter, setShowFilter] = useState(false);
  const [appliedFilter, setAppliedFilter] = useState('All');
  const unitsList = useSelector(state => state.contractor.unitsList);
  const archiveKey = useSelector(state => state.notification.archiveKey);
  const demoMode = useSelector(state => state.notification.demoStatus);
  const filterOptions = [
    'All',
    'gatewayFault',
    'heatPumpFault',
    'remoteAccess',
    'companyAccess',
  ];
  const filterLable = {
    All: 'All',
    gatewayFault: 'Gateway',
    heatPumpFault: 'Fault',
    remoteAccess: 'Remote Access',
    companyAccess: 'Company Access',
  };

  let activeNotificationList = demoMode
    ? Mock.notifications
    : useSelector(state => state.notification.active);
  const archiveNotificationList = useSelector(
    state => state.notification.archive,
  );
  let activeNotificationListCopy = demoMode
    ? Mock.notifications
    : useSelector(state => state.notification.activeCopy);

  const selectedUnit = useSelector(state => state.contractor.selectedUnit);
  const [currentTab, setCurrentTab] = useState(0);
  const [requestClicked, setRequestClicked] = useState(false);
  const rippleEffect = TouchableNativeFeedback.Ripple(
    Colors.mediumGray,
    true,
    70,
  );

  function sendInvite(selectedContractorId) {
    dispatch(
      ContractorActions.sendInvite(
        {contractorId: selectedContractorId},
        sendInviteSuccessResponse,
      ),
    );
  }

  function sendInviteSuccessResponse() {
    setRequestClicked(true);
  }

  useEffect(() => {
    dispatch(getArchiveNotificationList({}));
    dispatch(
      getActiveNotificationList(res => {
        verifyNotificationLogOut(res);
      }),
    );

    if (demoMode) {
      showToast(Dictionary.demoMode.notificationScreenLimitations);
    }
  }, []);

  UserAnalytics('ids_notification');

  useEffect(() => {
    setShowFilter(false);
    setAppliedFilter('All');
    setSearchText('');
    dispatch(
      updateActiveNotification(
        demoMode ? Mock.notifications : activeNotificationList,
      ),
    );
    if (!demoMode) {
      dispatch(getArchiveNotificationList({}));
    }
  }, [currentTab]);
  useEffect(() => {
    if (props.navigation.state.params.isSearch) {
      setSearchText(selectedUnit.odu.serialNumber);
    }
  }, []);
  useEffect(() => {
    if (currentTab === 0) {
      if (appliedFilter !== 'All') {
        let filterData = demoMode ? Mock.notifications : activeNotificationList;
        filterData = filterData.filter(function (item) {
          return (
            item.notificationType.replace(/ /g, '').toLocaleLowerCase() ===
            appliedFilter.replace(/ /g, '').toLocaleLowerCase()
          );
        });

        dispatch(updateActiveNotification(filterData));
        let tempList = [];
        tempList = filterData;
        let tempSearchText = searchText;
        tempSearchText = tempSearchText.trim().split(/ +/).join(' ');
        if (searchText.length !== 0) {
          let titleList = [];
          for (let i = 0; i < tempList.length; i++) {
            let itemInfo = notificationMap[tempList[i].notification];

            if (
              Dictionary.notification[itemInfo.title]
                .toLocaleLowerCase()
                .includes(tempSearchText.toLocaleLowerCase())
            ) {
              titleList.push(tempList[i]);
            } else if (
              tempList[i].hasOwnProperty('ODUSerialNumber') &&
              tempList[i].ODUSerialNumber.toLocaleLowerCase().includes(
                tempSearchText.toLocaleLowerCase(),
              )
            ) {
              titleList.push(tempList[i]);
            } else if (
              Dictionary.notification[itemInfo.message]
                .toLocaleLowerCase()
                .includes(tempSearchText.toLocaleLowerCase())
            ) {
              titleList.push(tempList[i]);
            } else if (
              // itemInfo.hasOwnProperty('homeOwnerName') &&
              // Dictionary.notification[itemInfo.homeOwnerName]
              tempList[i].hasOwnProperty('homeOwnerName') &&
              tempList[i].homeOwnerName
                .toLocaleLowerCase()
                .includes(tempSearchText.toLocaleLowerCase())
            ) {
              titleList.push(tempList[i]);
            } else if (
              moment(Number(tempList[i].issueDate))
                .format('hh:mm A  MM/DD/YYYY')
                .toLocaleLowerCase()
                .includes(tempSearchText.toLocaleLowerCase())
            ) {
              titleList.push(tempList[i]);
            }
          }

          dispatch(updateActiveNotification(titleList));
        }
      } else {
        dispatch(
          updateActiveNotification(
            demoMode ? Mock.notifications : activeNotificationList,
          ),
        );
        let tempList = [];
        tempList = demoMode ? Mock.notifications : activeNotificationList;
        if (searchText.length !== 0) {
          let titleList = [];
          let tempSearchText = searchText;
          tempSearchText = tempSearchText.trim().split(/ +/).join(' ');
          for (let i = 0; i < tempList.length; i++) {
            let itemInfo = notificationMap[tempList[i].notification];
            if (
              Dictionary.notification[itemInfo.title]
                .toLocaleLowerCase()
                .includes(tempSearchText.toLocaleLowerCase())
            ) {
              titleList.push(tempList[i]);
            } else if (
              tempList[i].hasOwnProperty('ODUSerialNumber') &&
              tempList[i].ODUSerialNumber.toLocaleLowerCase().includes(
                tempSearchText.toLocaleLowerCase(),
              )
            ) {
              titleList.push(tempList[i]);
            } else if (
              Dictionary.notification[itemInfo.message]
                .toLocaleLowerCase()
                .includes(tempSearchText.toLocaleLowerCase())
            ) {
              titleList.push(tempList[i]);
            } else if (
              tempList[i].hasOwnProperty('homeOwnerName') &&
              tempList[i].homeOwnerName
                .toLocaleLowerCase()
                .includes(tempSearchText.toLocaleLowerCase())

              // itemInfo.hasOwnProperty('homeOwnerName') &&
              // Dictionary.notification[itemInfo.homeOwnerName]
              //   .toLocaleLowerCase()
              //   .includes(tempSearchText.toLocaleLowerCase())
            ) {
              titleList.push(tempList[i]);
            } else if (
              moment(Number(tempList[i].issueDate))
                .format('hh:mm A  MM/DD/YYYY')
                .toLocaleLowerCase()
                .includes(tempSearchText.toLocaleLowerCase())
            ) {
              titleList.push(tempList[i]);
            }
          }

          dispatch(
            updateActiveNotification(demoMode ? Mock.notifications : titleList),
          );
        }
      }
    } else if (currentTab === 1) {
      if (appliedFilter !== 'All') {
        if (searchText.length === 0) {
          let input = {
            filter: appliedFilter,
          };
          if (!demoMode) {
            dispatch(searchArchiveNotification(input));
          }
        }
      } else if (appliedFilter === 'All') {
        if (searchText.length === 0) {
          dispatch(getArchiveNotificationList({}));
        }
      }
    }
  }, [appliedFilter, searchText]);

  function setGatewayDetails(gatewayId, routeName) {
    let selectedUnit = unitsList.filter(
      item => item.gateway.gatewayId === gatewayId,
    );
    if(selectedUnit && selectedUnit.length > 0){
      if (selectedUnit[0]) {
        if (!demoMode) {
          dispatch(ContractorActions.setSelectedUnit(selectedUnit[0])).then(
            () => {
              routeHandler(routeName);
            },
          );
        }
      }
    } else {
      showToast('This unit is no longer associated to you', 'error');
    }    
  }
    
  function routeHandler(routeName) {
    props.navigation.navigate(routeName);
  }

  function routeHandlerWithParam(routeName, params) {
    props.navigation.navigate(routeName, {
      ...params,
    });
  }

  function routeHandlerWithProps(routeName, issueDate) {
    dispatch(setIssueDate(issueDate));
    props.navigation.navigate('Profile');
  }

  function navigateOnPress(
    notification,
    gatewayId,
    index,
    uniqueKey,
    issueDate,
  ) {
    if (activeNotificationListCopy[index].unread) {
      activeNotificationListCopy[index].unread = false;
      if (!demoMode) {
        dispatch(setNotificationRead(issueDate));
      }
    }

    switch (notification) {
      case 'gatewayLostConnection': {
        routeHandler('Help');
        break;
      }
      case 'remoteAccessGranted': {
        setGatewayDetails(gatewayId, 'Installation');
        break;
      }
      case 'remoteAccessRevoked': {
        setGatewayDetails(gatewayId, 'Installation');
        break;
      }
      case 'remoteAccess': {
        setGatewayDetails(gatewayId, 'RemoteAccess');
        break;
      }
      case 'companyInvite': {
        routeHandlerWithProps('Profile', issueDate);
        break;
      }
      case 'permissionChanged': {
        variables.tab='list'
        routeHandler('ContractorHome');
        break;
      }
      case 'faultCodeWarning': {
        setGatewayDetails(gatewayId, 'Service');
        break;
      }
      case 'faultCodeError': {
        setGatewayDetails(gatewayId, 'Service');
        break;
      }
      case 'faultCodeErrorH5': {
        setGatewayDetails(gatewayId, 'Service');
        break;
      }
      case 'companyInviteAccept': {
        routeHandler('companyContractor');
        break;
      }
      case 'companyInviteReject': {
        routeHandler('requests');
        break;
      }
      default: {
      }
    }
  }

  function handleAccordion(index, uniqueKey, issueDate) {
    if (currentTab === 0) {
      expandedItem === uniqueKey
        ? setExpandedItem('')
        : setExpandedItem(uniqueKey);
      if (activeNotificationListCopy[index].unread) {
        activeNotificationListCopy[index].unread = false;
        if (!demoMode) {
          dispatch(setNotificationRead(issueDate));
        }
      }
    } else {
      archiveListExpandedItem === uniqueKey
        ? setArchiveListExpandedItem('')
        : setArchiveListExpandedItem(uniqueKey);
    }
  }

  function moveToArchive(issueDate) {
    if (!demoMode) {
      dispatch(
        moveNotificationToArchive(issueDate, () => {
          dispatch(getArchiveNotificationList({}));
        }),
      );
    }
  }

  const activeRenderItem = ({index, item}) => {
    let itemInfo = notificationMap[item.notification];
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          setShowFilter(false);
        }}>
        <View
          style={[
            styles.marginVer20,
            item.unread && styles.unreadNotification,
          ]}>
          <View style={[styles.flex1, styles.flexRow]}>
            <View style={[styles.flexCol1]}>
              <BoschIcon
                name={itemInfo ? Icons[itemInfo.icon] : ''}
                color={itemInfo ? Colors[itemInfo.iconColor] : ''}
                size={28}
                style={styles.tabIcon}
              />
            </View>
            <View style={[styles.flexCol2]}>
              <CustomText
                text={itemInfo ? Dictionary.notification[itemInfo.title] : ''}
                font="bold"
                align="left"
              />
              {item.homeOwnerName && (
                <CustomText text={item.homeOwnerName} align="left" />
              )}
              <CustomText
                text={moment(Number(item.issueDate)).format(
                  'hh:mm A  MM/DD/YYYY',
                )}
                align="left"
                font="light-italic"
                size={12}
              />
              {expandedItem === item.uniqueKey && item.ODUSerialNumber && (
                <CustomText
                  text={item.ODUSerialNumber}
                  font="bold"
                  align="left"
                />
              )}
              {expandedItem === item.uniqueKey && (
                <CustomText
                  text={
                    itemInfo && itemInfo.message === 'companyInviteMessage'
                      ? `${Dictionary.notification.companyInviteMessage1} ${
                          /*if company is null or undefine we need to show 'a company' which handle in frontend*/
                          (item && item.data !== undefined) ||
                          (item && item.data !== null)
                            ? item.data
                            : 'a company'
                        }. ${Dictionary.notification.companyInviteMessage2}`
                      : itemInfo &&
                        itemInfo.message === 'companyInviteAcceptMessage'
                      ? `${
                          (item && item.data !== undefined) ||
                          (item && item.data !== null)
                            ? item.data.contractorName
                            : 'Contractor'
                        } ${Dictionary.notification.companyInviteAcceptMessage}`
                      : itemInfo &&
                        itemInfo.message === 'companyInviteRejectMessage'
                      ? `${
                          (item && item.data !== undefined) ||
                          (item && item.data !== null)
                            ? item.data.contractorName
                            : 'Contractor'
                        } ${Dictionary.notification.companyInviteRejectMessage}`
                      : itemInfo && Dictionary.notification[itemInfo.message]
                  }
                  align="left"
                />
              )}
              <View style={styles.customButton}>
                <Button
                  type="tertiary"
                  text={
                    itemInfo ? Dictionary.notification[itemInfo.buttonText] : ''
                  }
                  onPress={() => {
                    demoMode
                      ? showToast(Dictionary.demoMode.functionNotAvailable)
                      : item.notification === 'companyInviteAccept'
                      ? routeHandlerWithParam('ContractorUnitAccess', {
                          contractorId: item.data.contractorId,
                          firstName:
                            item.data.contractorName?.split(' ')?.length >= 1
                              ? item.data.contractorName?.split(' ')[0]
                              : '',
                          lastName:
                            item.data.contractorName?.split(' ')?.length >= 1
                              ? item.data.contractorName?.split(' ')[1]
                              : '',
                        })
                      : item.notification === 'companyInviteReject'
                      ? sendInvite(item.data.contractorId)
                      : navigateOnPress(
                          item.notification,
                          item.gatewayId,
                          index,
                          item.uniqueKey,
                          item.issueDate,
                        );
                  }}
                  textStyle={{color: Colors.mediumBlue}}
                />
              </View>
            </View>
            <View style={[styles.flexCol1]}>
              <TouchableWithoutFeedback
                hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
                onPress={() =>
                  !demoMode ? moveToArchive(item.issueDate) : ''
                }>
                <BoschIcon
                  name={Icons.close}
                  size={24}
                  style={styles.tabIcon}
                />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
                onPress={() =>
                  handleAccordion(index, item.uniqueKey, item.issueDate)
                }>
                <BoschIcon
                  name={expandedItem === item.uniqueKey ? Icons.up : Icons.down}
                  size={30}
                  style={styles.tabIcon}
                  color={Colors.mediumBlue}
                />
              </TouchableWithoutFeedback>
              {/* <BoschIcon name={Icons.down} size={28} style={styles.tabIcon} />  */}
            </View>
          </View>
          <View style={[styles.flex1, styles.flexRow]}>
            <View style={[styles.flexCol1]} />
            <View style={[styles.flexCol2]} />
            <View style={[styles.flexCol1]} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const archiveRenderItem = ({index, item}) => {
    let itemInfo = notificationMap[item.notification];
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          setShowFilter(false);
        }}>
        <View style={[styles.flex1, styles.marginVer10]}>
          <View style={[styles.flexRow, styles.spaceBetween]}>
            <CustomText
              text={itemInfo ? Dictionary.notification[itemInfo.title] : ''}
              font="bold"
              align="left"
            />
          </View>
          <View style={[styles.flexRow, styles.spaceBetween]}>
            <View style={[styles.flexCol2]}>
              {item.homeOwnerName && (
                <CustomText text={item.homeOwnerName} align="left" />
              )}
              {item &&
                (item.data !== undefined || item.data !== null) &&
                (itemInfo.message === 'companyInviteRejectMessage' ||
                  itemInfo.message === 'companyInviteAcceptMessage') && (
                  <CustomText text={item.data.contractorName} align="left" />
                )}
            </View>
            <View style={[styles.flexCol1]}>
              <TouchableWithoutFeedback
                hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
                onPress={() =>
                  handleAccordion(index, item.uniqueKey, item.issueDate)
                }>
                <BoschIcon
                  name={
                    archiveListExpandedItem === item.uniqueKey
                      ? Icons.up
                      : Icons.down
                  }
                  size={28}
                  color={Colors.mediumBlue}
                />
              </TouchableWithoutFeedback>
            </View>
          </View>
          {archiveListExpandedItem === item.uniqueKey &&
            item.ODUSerialNumber && (
              <CustomText
                text={item.ODUSerialNumber}
                font="bold"
                align="left"
              />
            )}
          {archiveListExpandedItem === item.uniqueKey && (
            <CustomText
              text={
                itemInfo && itemInfo.message === 'companyInviteMessage'
                  ? `${Dictionary.notification.companyInviteMessage1} ${
                      /*if company is null or undefine we need to show 'a company' which handle in frontend*/
                      (item && item.data !== undefined) ||
                      (item && item.data !== null)
                        ? item.data.contractorName
                        : 'a company'
                    }.${Dictionary.notification.companyInviteMessage2}`
                  : itemInfo &&
                    (itemInfo.message === 'companyInviteRejectMessage' ||
                      itemInfo.message === 'companyInviteAcceptMessage')
                  ? `${
                      /*if company is null or undefine we need to show 'a company' which handle in frontend*/
                      (item && item.data !== undefined) ||
                      (item && item.data !== null)
                        ? item.data.contractorName
                        : 'a company'
                    } ${Dictionary.notification[itemInfo.message]}`
                  : itemInfo && Dictionary.notification[itemInfo.message]
              }
              align="left"
            />
          )}
          <View style={[styles.flexRow, styles.spaceBetween]}>
            <CustomText
              text={Dictionary.notification.issueDate + ' '}
              align="left"
            />
            <CustomText
              text={
                item.issueDate
                  ? moment(Number(item.issueDate)).format(
                      'MM/DD/YYYY   hh:mm A',
                    )
                  : ''
              }
              align="left"
            />
          </View>
          <View style={[styles.flexRow, styles.spaceBetween]}>
            <CustomText
              text={Dictionary.notification.resolvedDate + ' '}
              align="left"
            />
            <CustomText
              text={
                item.resolvedDate
                  ? moment(Number(item.resolvedDate)).format(
                      'MM/DD/YYYY   hh:mm A',
                    )
                  : ''
              }
              align="left"
            />
          </View>
          {faultCases.includes(item.type) ? (
            item.resolvedDate ? (
              <View style={[styles.flexRow, styles.spaceBetween]}>
                <CustomText
                  text={Dictionary.notification.resolvedDate + ' '}
                  align="left"
                />
                <CustomText
                  text={
                    item.resolvedDate
                      ? moment(item.resolvedDate).format('MM/DD/YYYY hh:mm A')
                      : Dictionary.notification.notResolved
                  }
                  align="left"
                />
              </View>
            ) : (
              <CustomText
                text={Dictionary.notification.notResolved}
                align="left"
                color={Colors.darkRed}
              />
            )
          ) : (
            <View />
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const FilterDropdown = ({list}) => {
    return (
      <View style={styles.filterView}>
        {list.map(filter => (
          <TouchableOpacity
            onPress={() => {
              setShowFilter(false);
              setAppliedFilter(filter);
            }}
            key={filter}
            style={[
              styles.filterItem,
              {
                backgroundColor:
                  filter === appliedFilter ? Colors.darkBlue : Colors.white,
              },
            ]}>
            <CustomText
              align="left"
              text={filterLable[filter]}
              color={filter === appliedFilter ? Colors.white : Colors.black}
              key={filter}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const onArchiveSearch = searchInput => {
    if (searchInput.length !== 0 && searchInput.length < 27) {
      if (appliedFilter === 'All') {
        let input = {
          param: searchInput,
        };
        if (!demoMode) {
          dispatch(searchArchiveNotification(input));
        }
      } else if (appliedFilter !== 'All') {
        let input = {
          param: searchInput,
          filter: appliedFilter,
        };
        if (!demoMode) {
          dispatch(searchArchiveNotification(input));
        }
      }
    }
  };
  const renderEmptyContainer = notifType => {
    return (
      <View style={styles.noRecord}>
        <CustomText
          text={
            notifType === 'active'
              ? Dictionary.notification.noActiveNotifications
              : Dictionary.notification.noArchivedNotifications
          }
          size={17}
          color={Colors.black}
        />
      </View>
    );
  };
  const loadMore = () => {
    const input = {
      LastEvaluatedKey: archiveKey,
    };
    return (
      <>
        {archiveKey && archiveKey.issueDate && (
          <Button
            type="tertiary"
            icon={Icons.refresh}
            text={Dictionary.notification.loadMore}
            onPress={() => {
              if (!demoMode) {
                dispatch(getArchiveNotificationList(input));
              }
            }}
          />
        )}
      </>
    );
  };
  const onArchiveRefresh = () => {
    if (appliedFilter !== 'All') {
      if (searchText.length === 0) {
        let input = {
          filter: appliedFilter,
        };
        if (!demoMode) {
          dispatch(searchArchiveNotification(input));
        }
      }
    } else if (appliedFilter === 'All') {
      if (searchText.length === 0) {
        dispatch(getArchiveNotificationList({}));
      }
    }
  };
  const onActiveRefresh = () => {
    dispatch(
      getActiveNotificationList(res => {
        verifyNotificationLogOut(res);
        if (appliedFilter !== 'All') {
          let filterData = demoMode
            ? Mock.notifications
            : activeNotificationList;
          filterData = filterData.filter(function (item) {
            return (
              item.notificationType.replace(/ /g, '').toLocaleLowerCase() ===
              appliedFilter.replace(/ /g, '').toLocaleLowerCase()
            );
          });
          dispatch(
            updateActiveNotification(
              demoMode ? Mock.notifications : filterData,
            ),
          );
          let tempList = [];
          tempList = filterData;
          let tempSearchText = searchText;
          tempSearchText = tempSearchText.trim().split(/ +/).join(' ');
          if (searchText.length !== 0) {
            let titleList = [];
            for (let i = 0; i < tempList.length; i++) {
              let itemInfo = notificationMap[tempList[i].notification];

              if (
                Dictionary.notification[itemInfo.title]
                  .toLocaleLowerCase()
                  .includes(tempSearchText.toLocaleLowerCase())
              ) {
                titleList.push(tempList[i]);
              } else if (
                tempList[i].hasOwnProperty('ODUSerialNumber') &&
                tempList[i].ODUSerialNumber.toLocaleLowerCase().includes(
                  tempSearchText.toLocaleLowerCase(),
                )
              ) {
                titleList.push(tempList[i]);
              } else if (
                Dictionary.notification[itemInfo.message]
                  .toLocaleLowerCase()
                  .includes(tempSearchText.toLocaleLowerCase())
              ) {
                titleList.push(tempList[i]);
              } else if (
                // itemInfo.hasOwnProperty('homeOwnerName') &&
                // Dictionary.notification[itemInfo.homeOwnerName]
                tempList[i].hasOwnProperty('homeOwnerName') &&
                tempList[i].homeOwnerName
                  .toLocaleLowerCase()
                  .includes(tempSearchText.toLocaleLowerCase())
              ) {
                titleList.push(tempList[i]);
              } else if (
                moment(Number(tempList[i].issueDate))
                  .format('hh:mm A  MM/DD/YYYY')
                  .toLocaleLowerCase()
                  .includes(tempSearchText.toLocaleLowerCase())
              ) {
                titleList.push(tempList[i]);
              }
            }

            dispatch(
              updateActiveNotification(
                demoMode ? Mock.notifications : titleList,
              ),
            );
          }
        } else {
          dispatch(
            updateActiveNotification(
              demoMode ? Mock.notifications : activeNotificationList,
            ),
          );
          let tempList = [];
          tempList = demoMode ? Mock.notifications : activeNotificationList;
          if (searchText.length !== 0) {
            let titleList = [];
            let tempSearchText = searchText;
            tempSearchText = tempSearchText.trim().split(/ +/).join(' ');
            for (let i = 0; i < tempList.length; i++) {
              let itemInfo = notificationMap[tempList[i].notification];
              if (
                Dictionary.notification[itemInfo.title]
                  .toLocaleLowerCase()
                  .includes(tempSearchText.toLocaleLowerCase())
              ) {
                titleList.push(tempList[i]);
              } else if (
                tempList[i].hasOwnProperty('ODUSerialNumber') &&
                tempList[i].ODUSerialNumber.toLocaleLowerCase().includes(
                  tempSearchText.toLocaleLowerCase(),
                )
              ) {
                titleList.push(tempList[i]);
              } else if (
                Dictionary.notification[itemInfo.message]
                  .toLocaleLowerCase()
                  .includes(tempSearchText.toLocaleLowerCase())
              ) {
                titleList.push(tempList[i]);
              } else if (
                // itemInfo.hasOwnProperty('homeOwnerName') &&
                // Dictionary.notification[itemInfo.homeOwnerName]
                tempList[i].hasOwnProperty('homeOwnerName') &&
                tempList[i].homeOwnerName
                  .toLocaleLowerCase()
                  .includes(tempSearchText.toLocaleLowerCase())
              ) {
                titleList.push(tempList[i]);
              } else if (
                moment(Number(tempList[i].issueDate))
                  .format('hh:mm A  MM/DD/YYYY')
                  .toLocaleLowerCase()
                  .includes(tempSearchText.toLocaleLowerCase())
              ) {
                titleList.push(tempList[i]);
              }
            }

            dispatch(
              updateActiveNotification(
                demoMode ? Mock.notifications : titleList,
              ),
            );
          }
        }
      }),
    );
  };

  const verifyNotificationLogOut = res => {
    const arrayNotifications = res.data.Items;

    const exist = arrayNotifications.find(
      element => element.notificationType == 'userDeleted',
    );
    if (exist) {
      Alert.alert(
        'Bosch EasyAir App',
        Dictionary.common.userDeleted,
        [
          {
            text: 'Ok',
            onPress: () => {
              logout();
            },
          },
        ],
        {cancelable: true},
      );
    }
  };

  const idpIdToken = useSelector(
    state => state.auth.user.attributes['custom:id_token'],
  );

  // Logout Android --->
  async function callurlLogOut(url, redirectUrl) {
    await InAppBrowser.isAvailable();
    const {type, url: newUrl} = await InAppBrowser.openAuth(
      `https://stage.singlekey-id.com/auth/connect/endsession?&id_token_hint=${idpIdToken}&state=STATE`,
      `idsmobileapp://`,
      {
        showTitle: false,
        enableUrlBarHiding: true,
        enableDefaultShare: false,
        showInRecents: true,
        ephemeralWebSession: true,
      },
    );
    if (type === 'success') {
      //Linking.openURL(newUrl);
    } else {
      Hub.dispatch('browserClosed', {
        event: 'cancel',
        data: 'User clicked close button',
      });
      InAppBrowser.close();
    }
  }
  Platform.OS !== 'ios' &&
    Amplify.configure({
      ...awsconfig,
      oauth: {
        ...awsconfig.oauth,
        callurlLogOut,
      },
    });
  // Logout Android Ends --->

  const logout = () => {
    if (Platform.OS !== 'ios') {
      callurlLogOut();
    }
    dispatch(removeDeviceToken(props.navigation));
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setShowFilter(false);
      }}>
      <View style={styles.scrollContainer}>
        <View style={[styles.tabView]}>
          {tabs.map(tab => (
            <TouchableNativeFeedback
              background={rippleEffect}
              key={tab}
              onPress={() => {
                setCurrentTab(tab);
              }}>
              <View>
                <CustomText
                  text={
                    tab === 0
                      ? Dictionary.notification.active
                      : Dictionary.notification.archive
                  }
                  size={16}
                  style={styles.tabIcon}
                  color={currentTab === tab ? Colors.mediumBlue : Colors.black}
                  key={tab}
                />
                {currentTab === tab && <View style={styles.tabUnderline} />}
              </View>
            </TouchableNativeFeedback>
          ))}
        </View>
        <View style={[styles.flexRow, styles.alignCenter, styles.spaceBetween]}>
          <View style={[styles.flex1, styles.paddingHor20, styles.marginBot10]}>
            <CustomInputText
              placeholder={Dictionary.notification.search}
              value={searchText}
              disabled={demoMode ? true : false}
              onChange={text => setSearchText(text)}
            />
          </View>
          {currentTab === 1 &&
          searchText.length !== 0 &&
          searchText.length < 27 ? (
            <TouchableOpacity onPress={() => onArchiveSearch(searchText)}>
              <BoschIcon
                name={Icons.search}
                size={28}
                style={styles.tabIcon}
                color={Colors.darkBlue}
              />
            </TouchableOpacity>
          ) : (
            currentTab === 1 && (
              <BoschIcon
                name={Icons.search}
                size={28}
                style={styles.tabIcon}
                color={Colors.grayDisabled}
              />
            )
          )}
          <View>
            <TouchableOpacity
              onPress={() => setShowFilter(!showFilter)}
              disabled={demoMode ? true : false}>
              <BoschIcon
                name={
                  appliedFilter !== 'All' ? Icons.successFilter : Icons.filter
                }
                size={28}
                style={styles.tabIcon}
                color={Colors.darkBlue}
                accessibilityLabel={'Filter'}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.grayUnderline} />
        <View style={styles.flex1}>
          {currentTab === 0 ? (
            <FlatList
              refreshing={false}
              onRefresh={onActiveRefresh}
              //  onRefresh={() => dispatch(getActiveNotificationList())}
              contentContainerStyle={[
                styles.paddingBottom10,
                styles.marginHorizon20,
              ]}
              data={demoMode ? Mock.notifications : activeNotificationListCopy}
              renderItem={activeRenderItem}
              ListEmptyComponent={renderEmptyContainer('active')}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => {
                return <View style={[styles.grayUnderline]} />;
              }}
            />
          ) : (
            <FlatList
              refreshing={false}
              onRefresh={onArchiveRefresh}
              contentContainerStyle={[styles.paddingHor20]}
              // data={actual_archiveNotificationList}
              data={archiveNotificationList}
              renderItem={archiveRenderItem}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={renderEmptyContainer('archive')}
              ItemSeparatorComponent={() => {
                return <View style={[styles.grayUnderline]} />;
              }}
              ListFooterComponent={loadMore}
            />
          )}
          {showFilter && <FilterDropdown list={filterOptions} />}
        </View>
        <ConfirmationDialog
          visible={requestClicked}
          text={Dictionary.adminPortal.sendRequest}
          primaryButton={Dictionary.button.close}
          primaryButtonOnPress={() => {
            setRequestClicked(false);
            dispatch(ContractorActions.getInvitedContractorList());
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  listView: {padding: 20, paddingTop: 0},
  tabView: {
    borderBottomColor: Colors.mediumGray,
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingRight: 20,
    paddingTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 1,
  },
  tabIcon: {
    padding: 10,
  },
  posRel: {
    position: 'relative',
  },
  circle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Colors.darkRed,
    top: 5,
    right: 10,
    position: 'absolute',
  },
  tabUnderline: {
    borderBottomColor: Colors.mediumBlue,
    borderBottomWidth: 2,
  },
  searchView: {flex: 3, marginRight: 20},
  grayUnderline: {
    borderBottomColor: Colors.mediumGray,
    borderBottomWidth: 0.8,
  },
  container: {
    flexGrow: 1,
    padding: 10,
  },
  flex1: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexCol1: {
    flex: 0.17,
  },
  flexCol2: {
    flex: 0.75,
  },
  padding10: {
    padding: 10,
  },
  paddingHor20: {
    paddingHorizontal: 20,
  },
  marginBot10: {
    marginBottom: 10,
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
  paddingVer10: {
    paddingVertical: 10,
  },
  marginVer20: {
    marginVertical: 20,
  },
  marginVer10: {
    marginVertical: 10,
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
  noRecord: {
    marginTop: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  marginHorizon20: {
    marginHorizontal: 20,
  },
  customButton: {
    width: '75%',
    borderWidth: 1,
    marginTop: 15,
    borderColor: Colors.mediumBlue,
  },
});
