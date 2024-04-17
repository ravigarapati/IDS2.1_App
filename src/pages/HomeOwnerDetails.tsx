/**
 * @file HomeOwnerDetails is a tab in the Home Page for the HomeOwner.
 * Contractor contact information, installation date, warranty information and many other details pertaining to a unit are displayed in this page.
 * @author Krishna Priya  Elango
 *
 */

import React, {useEffect, useState} from 'react';
import {
  SectionList,
  StyleSheet,
  View,
  Text,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {CustomText, SectionHeading} from '../components';
import {Colors, Typography} from '../styles';
import {Dictionary} from '../utils/dictionary';
import * as homeOwnerActions from '../store/actions/HomeOwnerActions';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import moment from 'moment';

export default function HomeOwnerDetails() {
  const dispatch = useDispatch();
  const deviceDetails = useSelector(state => state.homeOwner.deviceDetails);
  const prevSelectedDevice = useSelector(
    state => state.homeOwner.prevSelectedDevice,
  );
  const selectedDevice = useSelector(state => state.homeOwner.selectedDevice);
  const macId = useSelector(state => state.homeOwner.idsSelectedDeviceAccess);
  const deviceData =
    selectedDevice &&
    prevSelectedDevice &&
    selectedDevice.gatewayId &&
    prevSelectedDevice.gatewayId &&
    selectedDevice.gatewayId !== prevSelectedDevice.gatewayId
      ? prevSelectedDevice
      : selectedDevice;
  const [details, setDetails] = useState([]);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const deviceId = useSelector(state => state.homeOwner.idsSelectedDevice);
  const serviceStartDate = useSelector(
    state => state.homeOwner.serviceStartDate,
  );
  useEffect(() => {
    console.log(selectedDevice)
    if (deviceData !== undefined && Object.keys(deviceData).length !== 0) {
      dispatch(homeOwnerActions.getDetailsByDeviceId(macId));
    }
  }, [deviceData, dispatch]);

  useEffect(() => {
    setShowDisclaimer(false);
    if (
      deviceDetails !== undefined &&
      Object.keys(deviceDetails).length !== 0
    ) {
      let itemsList = [];
      if (
        deviceDetails.contractor &&
        Object.keys(deviceDetails.contractor).length !== 0
      ) {
        let contractorDetails = {
          sectionTitle: Dictionary.deviceDetails.contractortitle,
          data: [
            {
              title: Dictionary.deviceDetails.contractor,
              value: deviceDetails.contractor.name,
            },

            {
              title: Dictionary.deviceDetails.phone,
              value: deviceDetails.contractor.phone,
            },
          ],
        };
        itemsList.push(contractorDetails);
      }

      if (deviceDetails.odu) {
        if (deviceDetails.odu.installationDate) {
          setShowDisclaimer(true);
        }
        let data: any[] = [];
        Object.keys(deviceDetails.odu).forEach(key => {
          data.push({
            title:
              Dictionary.common[key] === Dictionary.common.gatewaySerialNumberHO
                ? Dictionary.common[key]
                : Dictionary.common[key] ===
                  Dictionary.common.gatewayWarrantyPeriod
                ? Dictionary.common[key]
                : Dictionary.common[key] === Dictionary.common.serviceDateHO
                ? Dictionary.common[key]
                : Dictionary.common.outdoorUnit + Dictionary.common[key],
            value:
              key === 'gatewaySerialNumberHO'
                ? deviceId
                : key === 'gatewayWarrantyPeriod'
                ?  selectedDevice.gatewayWarrantyPeriod
                : key === 'serviceDateHO'
                ? moment(selectedDevice.serviceStartDate).format('MM/DD/YYYY')
                : deviceDetails.odu[key],
          });
        });
        let oduDetails = {
          sectionTitle: Dictionary.common.outdoorUnit,
          data: data,
        };
        itemsList.push(oduDetails);
      }
      if (deviceDetails.components && deviceDetails.components.length > 0) {
        setShowDisclaimer(true);
        let data: any = [];
        deviceDetails.components.forEach(item => {
          data.push({
            title: item.componentType + Dictionary.common.modelNumber,
            value: item.modelNumber,
          });
          data.push({
            title: item.componentType + Dictionary.common.serialNumber,
            value: deviceId,
          });

          data.push({
            title: item.componentType + Dictionary.common.warrantyPeriod,
            value: selectedDevice.gatewayWarrantyPeriod,
          });
          data.push({
            title: item.componentType + Dictionary.common.installationDate,
            value: moment(selectedDevice.serviceStartDate).format('MM/DD/YYYY')
          });
        });
        let iduDetails = {
          sectionTitle: Dictionary.deviceDetails.indoorUnitTitle,
          data: data,
        };

        itemsList.push(iduDetails);
      }
      setDetails(itemsList);
    }
  }, [deviceDetails]);

  const Item = ({item}) => (
    <View style={styles.listItem}>
      {item.title.includes('Installation') ? (
        <Text style={styles.boschReg12}>
          {item.title}
          <Text style={styles.star}> * </Text>
        </Text>
      ) : (
        <CustomText text={item.title} font="regular" size={12} align="left" />
      )}
      {item.title === Dictionary.deviceDetails.phone ? (
        <TouchableOpacity
          style={styles.itemValue}
          onPress={() => Linking.openURL('tel:' + item.value)}>
          <CustomText
            text={item.value ? item.value : ''}
            align="left"
            font="regular"
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.itemValue}>
          <CustomText
            text={item.value ? item.value : ''}
            align="left"
            font="regular"
          />
        </View>
      )}
    </View>
  );
  return (
    <SectionList
      ListFooterComponent={() => {
        return (
          <>
            {showDisclaimer && (
              <Text style={[styles.star, styles.footerPadding]}>
                {'* '}
                <Text style={[styles.installationDateInfo]}>
                  {Dictionary.installationDashboard.installationDateInfo}
                </Text>
              </Text>
            )}
          </>
        );
      }}
      contentContainerStyle={styles.container}
      sections={details}
      keyExtractor={item => item.title}
      renderItem={({item}) => <Item item={item} />}
      renderSectionHeader={({section: {sectionTitle}}) => (
        <SectionHeading title={sectionTitle} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flexGrow: 1,
  },
  listItem: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  itemValue: {
    borderBottomColor: Colors.mediumGray,
    borderBottomWidth: 0.5,
    marginBottom: 15,
    paddingVertical: 5,
  },
  star: {
    color: Colors.darkRed,
  },
  boschReg12: {
    ...Typography.boschReg12,
  },
  installationDateInfo: {
    ...Typography.boschMedium12,
    color: Colors.black,
  },
  footerPadding: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
