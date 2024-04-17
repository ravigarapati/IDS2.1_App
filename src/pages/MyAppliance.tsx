import React, {useState, useRef} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  BoschIcon,
  CustomText,
  InfoTooltip,
  SectionHeading,
  Button,
  CheckBox,
  ConfirmationDialog,
} from '../components';
import {useSelector, useDispatch} from 'react-redux';
import {Colors} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {Icons} from '../utils/icons';
import moment from 'moment';

import {color} from 'react-native-reanimated';
import * as HomeOwnerActions from '../store/actions/HomeOwnerActions';

export default function MyAppliance(props: any) {
  const deviceList = useSelector(state => state.homeOwner.deviceList);
  const dispatch = useDispatch();
  const [listToDelete, setListToDelete] = useState([]);
  const selectedDevice = useSelector(state => state.homeOwner.selectedDevice);
  const [isDeleteVisible, setDeleteVisible] = useState(false);
  const myApplianceRef = useRef();
  var deviceNames = deviceList.map(function (item) {
    return item.ODUName;
  });
  const openEditPage = item => {
    props.navigation.navigate('EditAppliance', {
      data: item,
      namesList: deviceNames,
    });
  };
  const openAddPage = () => {
    props.navigation.navigate('AddAppliance');
  };

  const checkAll = () => {
    let newDeleteList = [];
    if (listToDelete.length === 0) {
      deviceList.forEach(item => {
        newDeleteList.push(item.gatewayId);
      });
      setListToDelete(newDeleteList);
    } else {
      setListToDelete([]);
    }
  };

  const addToListToDelete = gatewayID => {
    // if (checkedStatus) {
    //   let newDeleteList = [...listToDelete];
    let newDeleteList = [];
    newDeleteList.push(gatewayID);
    setListToDelete(newDeleteList);

    // } else {    // All commented lines are related to mulitiple delete
    //   let newDeleteList = [...listToDelete];
    //   let index = newDeleteList.indexOf(gatewayID);
    //   if (index !== -1) {
    //     newDeleteList.splice(index, 1);
    //   }
    //   setListToDelete(newDeleteList);
    // }
  };

  const ApplianceInfo = ({item}) => {
    let address = item.ODUInstalledAddress;
    let gatewayId = item.gatewayId;
    let addressArray = [
      address.address1,
      ...(address.address2 !== '' ? [address.address2] : []),
      '\n' + address.city,
      '\n' + address.state,
      address.zipCode,
    ];

    return (
      <View style={styles.tile}>
        <View style={[styles.flexRow, styles.padRight10, styles.flex1]}>
          <View style={styles.flex1}>
            <CustomText
              font="medium"
              size={12}
              text={Dictionary.myAppliance.nameAndAddress}
              align="left"
              style={styles.padBot5}
            />
            <CustomText
              style={styles.padBot5}
              font="bold"
              text={item.ODUName}
              noOfLines={1}
              align="left"
            />
            <CustomText
              style={styles.padBot5}
              text={addressArray.join(', ')}
              align="left"
            />
            <View style={styles.flexRow}>
              <View>
                <CustomText
                  style={styles.padBot5}
                  text={Dictionary.myAppliance.serviceStartDate}
                  align="left"
                />
              </View>
              <View>
                <CustomText
                  style={styles.padBot5}
                  text={moment(item.serviceStartDate).format('MM/DD/YYYY')}
                  align="left"
                />
              </View>
            </View>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => openEditPage(item)}
              hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}>
              <BoschIcon
                name={Icons.edit}
                size={26}
                color={Colors.darkBlue}
                style={{height: 26}}
              />
            </TouchableOpacity>

            {/* {isDeleteVisible && <View>       // All commented lines are related to mulitiple delete
              <CheckBox
                checked={listToDelete.includes(gatewayId)}
                onChange={(checked: boolean) => {
                  addToListToDelete(gatewayId, checked);
                }}

              />

            </View>} */}

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                addToListToDelete(gatewayId);
                setDeleteVisible(!isDeleteVisible);
              }}>
              <BoschIcon
                name={Icons.delete}
                size={26}
                color={Colors.darkBlue}
                style={{height: 26}}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.monitoringRow}>
          <CustomText
            text={Dictionary.myAppliance.monitoringStatus}
            align="left"
            size={12}
            font="medium"
          />
          <InfoTooltip text={Dictionary.myAppliance.monitoringStatusInfo} />
        </View>
        <View style={styles.flexRow}>
          <Image
            style={styles.statusImage}
            source={
              item.contractorMonitoringStatus
                ? Icons.checkmarkFilledImage
                : Icons.abortFilledImage
            }
          />
          <CustomText
            text={
              item.contractorMonitoringStatus
                ? Dictionary.myAppliance.permissionGranted
                : Dictionary.myAppliance.permissionDenied
            }
            align="left"
          />
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.flex1, styles.whitebg]}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTitle}>
          <CustomText
            align="left"
            font="bold"
            text={Dictionary.myAppliance.heading}
          />
        </View>
      </View>
      {/* {isDeleteVisible && <View style={styles.selectAllContainer}>   // All commented lines are related to mulitiple delete
        <View style={styles.selectAllText}>
          <CustomText align="left" font="medium" text={Dictionary.myAppliance.selectall} />
        </View>
        <View style={styles.selectAllCheckBox}>

          <CheckBox
            checked={listToDelete.length !== 0 && true}
            onChange={(checked: boolean) => {
              checkAll();
            }}
          />
        </View>


      </View>} */}
      <FlatList
        ListFooterComponent={
          <View style={[styles.padding20]}>
            <Button
              type="primary"
              text={Dictionary.button.addNewUnit}
              icon={Icons.addFrame}
              onPress={() => openAddPage()}
            />
          </View>
        }
        ref={myApplianceRef}
        data={deviceList}
        renderItem={({item}) => <ApplianceInfo item={item} />}
        keyExtractor={item => item.gatewayId}
      />
      <ConfirmationDialog
        visible={isDeleteVisible}
        text={Dictionary.myAppliance.deleteConfirmation}
        primaryButton={Dictionary.button.yes}
        secondaryButton={Dictionary.button.no}
        primaryButtonOnPress={() => {
          dispatch(
            HomeOwnerActions.deleteAppliance(listToDelete, successCallback => {
              // let device = deviceList.find((temp) => temp.gatewayId === val.gatewayId);
              if (
                (listToDelete && listToDelete[0]) ===
                selectedDevice.gatewayId.toString()
              ) {
                // dispatch(
                //   HomeOwnerActions.setSelectedDevice(deviceList[1]),
                // );
                dispatch(
                  HomeOwnerActions.updateSelectedUnitName(deviceList[0]),
                );
                dispatch(HomeOwnerActions.setSelectedDevice(deviceList[0]));
                dispatch(HomeOwnerActions.setPrevSelectedDevice(deviceList[0]));
                dispatch(
                  HomeOwnerActions.getUsageGraphByDeviceId(
                    deviceList[0].gatewayId,
                  ),
                );
              }
            }),
          );
          setDeleteVisible(!isDeleteVisible);
          myApplianceRef.current.scrollToOffset({
            animated: true,
            offset: 0,
          });
        }}
        secondaryButtonOnPress={() => {
          setDeleteVisible(false);
          setListToDelete([]);
        }}
      />
      {/* {isDeleteVisible && (
        <View style={[styles.buttonContainer]}>
          <Button
            text={Dictionary.button.delete}
            type="primary"
            disabled={listToDelete.length === 0}
            onPress={() => {
              dispatch(
                HomeOwnerActions.deleteAppliance(
                  listToDelete,
                  (successCallback) => {
                    // let device = deviceList.find((temp) => temp.gatewayId === val.gatewayId);
                    if (
                      (listToDelete && listToDelete[0]) ===
                      selectedDevice.gatewayId.toString()
                    ) {
                      // dispatch(
                      //   HomeOwnerActions.setSelectedDevice(deviceList[1]),
                      // );
                      dispatch(
                        HomeOwnerActions.updateSelectedUnitName(deviceList[0]),
                      );
                      dispatch(
                        HomeOwnerActions.setSelectedDevice(deviceList[0]),
                      );
                      dispatch(
                        HomeOwnerActions.setPrevSelectedDevice(deviceList[0]),
                      );
                      dispatch(
                        HomeOwnerActions.getUsageGraphByDeviceId(
                          deviceList[0].gatewayId,
                        ),
                      );
                    }
                  },
                ),
              );
              setDeleteVisible(!isDeleteVisible);
              myApplianceRef.current.scrollToOffset({
                animated: true,
                offset: 0,
              });
            }}
          />
          <Button
            text={Dictionary.button.cancel}
            type="secondary"
            onPress={() => {
              setDeleteVisible(false);
              setListToDelete([]);
            }}
          />
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  whitebg: {
    backgroundColor: Colors.white,
  },
  flex1: {
    flex: 1,
  },
  headerContainer: {
    height: 50,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    paddingHorizontal: 15,
    flexDirection: 'row',
  },
  headerTitle: {
    flex: 0.9,
    justifyContent: 'center',
  },
  deleteButton: {
    flex: 0.1,
    justifyContent: 'center',
    top: 20,
  },
  selectAllText: {
    flex: 0.9,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  selectAllContainer: {
    height: 50,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  selectAllCheckBox: {
    flex: 0.1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  tile: {
    flex: 1,
    backgroundColor: Colors.white,
    borderBottomWidth: 5,
    borderBottomColor: Colors.lightGray,
    // marginHorizontal: 10,
    padding: 20,
    // shadowColor: Colors.black,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  flexRow: {
    flexDirection: 'row',
  },
  monitoringRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  padBot5: {
    paddingBottom: 5,
  },
  statusImage: {
    height: 24,
    width: 24,
    marginRight: 10,
  },
  padRight10: {
    paddingRight: 10,
  },
  padding20: {
    padding: 20,
  },
  buttonContainer: {
    padding: 20,
    borderColor: Colors.mediumGray,
    borderWidth: 0.5,
  },
});
