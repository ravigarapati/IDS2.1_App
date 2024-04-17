import React, {useState, useEffect} from 'react';
import {CustomText, Button, SearchBar, CheckBox} from '../components';
import {Colors} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {StyleSheet, View, FlatList, Image} from 'react-native';
import {Icons} from '../utils/icons';
import * as ContractorActions from '../store/actions/ContractorActions';
import {useDispatch, useSelector} from 'react-redux';

export default function ContractorUnitAccess(props: any) {
  const [searchText, setSearchText] = useState('');
  const [editView, setEditView] = useState(false);
  const [unitsListArray, setUnitListArray] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const contractorId = props.navigation.getParam('contractorId');
  const contractorDetails = useSelector(state =>
    state.contractor.contractorList.find(
      item => item.contractorId === contractorId,
    ),
  );

  const [fullAccess, setFullAccess] = useState(
    contractorDetails?.isFullAccess ? contractorDetails.isFullAccess : false,
  );

  const [accessibleUnits, setAccessibleUnits] = useState(
    contractorDetails?.accessibleUnits ? contractorDetails.accessibleUnits : [],
  );

  const dispatch = useDispatch();

  const [gatewayIdsList, setGatewayIdsList] = useState([]);

  const data = useSelector(state => state.contractor.unitsList);

  useEffect(() => {
    // Can be optimized to only refresh if the contractorDetails are missing
    refresh()
  }, []);

  useEffect(() => {
    setFullAccess(
      contractorDetails?.isFullAccess ? contractorDetails.isFullAccess : false,
    );
    setAccessibleUnits(
      contractorDetails?.accessibleUnits
        ? contractorDetails.accessibleUnits
        : [],
    );
  }, [contractorDetails]);

  useEffect(() => {
    var unitsList = data.filter(item => item.homeOwnerDetails !== null);
    unitsList = unitsList.reduce((a, c) => {
      a[c.homeOwnerDetails.email] = a[c.homeOwnerDetails.email] || {
        units: [],
        homeOwnerDetails: {
          name:
            c.homeOwnerDetails.firstName + ' ' + c.homeOwnerDetails.lastName,
          email: c.homeOwnerDetails.email,
          phoneNumber: c.homeOwnerDetails.phoneNumber,
        },
      };
      a[c.homeOwnerDetails.email].units.push({
        gatewayId: c.gateway.gatewayId,
        oduModelNumber: c.odu.modelNumber,
        installedAt: c.odu.installedAddress.address,
        contractorId: c.gateway.contractorId,
      });
      return a;
    }, Object.create(null));
    setUnitListArray(Object.values(unitsList));
    setFilteredList(Object.values(unitsList));
    let gatewayIds = [];
    Object.values(unitsList).forEach((item: any) => {
      item.units.forEach(unit => {
        gatewayIds.push(unit.gatewayId);
      });
    });
    setGatewayIdsList(gatewayIds);
  }, [data]);

  useEffect(() => {
    let searchResult = unitsListArray.filter(item =>
      item.homeOwnerDetails.name
        .toLowerCase()
        .includes(searchText.toLowerCase().trim()),
    );
    setFilteredList(searchResult);
  }, [searchText, unitsListArray]);

  useEffect(() => {
    if (fullAccess) {
      setAccessibleUnits(gatewayIdsList);
    }
  }, [fullAccess, gatewayIdsList]);

  const refresh = () => {
    dispatch(ContractorActions.getUnitsList());
    dispatch(ContractorActions.getContractorList());
  };
  const updateAccessibleList = (gatewayId, isChecked) => {
    if (isChecked) {
      let selectedUnits = [...accessibleUnits];
      selectedUnits.push(gatewayId);
      setAccessibleUnits(selectedUnits);
    } else {
      let selectedUnits = [...accessibleUnits];
      let index = selectedUnits.indexOf(gatewayId);
      if (index !== -1) {
        selectedUnits.splice(index, 1);
      }
      setAccessibleUnits(selectedUnits);
      setFullAccess(false);
    }
  };

  function saveChanges() {
    let requestBody = {
      isFullAccess: fullAccess,
      accessibleUnits: accessibleUnits,
      contractorId: contractorId,
    };
    dispatch(
      ContractorActions.adminEditUnitsAccess(requestBody, () => {
        setEditView(false);
      }),
    );
  }

  const renderItem = ({item}) => (
    <View>
      <View style={styles.title}>
        <CustomText
          noOfLines={1}
          text={item.homeOwnerDetails.name}
          align="left"
        />
        <CustomText
          text={
            Dictionary.common.phoneNumber + item.homeOwnerDetails.phoneNumber
          }
          align="left"
          size={12}
        />
      </View>

      {item.units.map((unit, index) => {
        return (
          <View key={unit.gatewayId}>
            <View style={[styles.listContent, styles.alignCenter]}>
              <CustomText
                size={12}
                style={styles.flex1}
                text={Dictionary.common.address + (index + 1) + ':'}
                align="left"
                key={index}
              />
              <CustomText
                size={12}
                style={styles.flex3}
                text={unit.installedAt}
                align="left"
                key={index}
              />
              {editView ? (
                <View style={[styles.flex1, styles.alignCenter]}>
                  <CheckBox
                    style={styles.marginVertical15}
                    checked={
                      accessibleUnits.includes(unit.gatewayId) || fullAccess
                    }
                    onChange={checked => {
                      updateAccessibleList(unit.gatewayId, checked);
                    }}
                    key={index}
                  />
                </View>
              ) : (
                <View
                  style={[
                    styles.flex1,
                    styles.alignCenter,
                    styles.marginVertical15,
                  ]}>
                  <Image
                    source={
                      accessibleUnits.includes(unit.gatewayId) || fullAccess
                        ? Icons.checkmarkFilledImage
                        : Icons.abortFilledImage
                    }
                    key={index}
                  />
                </View>
              )}
            </View>
            <View style={[styles.listContent, styles.alignCenter]}>
              <CustomText
                size={12}
                style={styles.flex1}
                text={Dictionary.common.unit}
                align="left"
                key={index}
              />
              <CustomText
                size={12}
                style={styles.flex3}
                text={unit.oduModelNumber}
                align="left"
                key={index}
              />
              <View style={styles.flex1} />
            </View>

            <View
              style={
                index !== item.units.length - 1
                  ? styles.divider
                  : styles.padVertical10
              }
            />
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={[styles.container]}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={[styles.flexRow, styles.alignCenter, styles.margin20]}>
              <View style={styles.flex1}>
                <SearchBar
                  placeholder={Dictionary.adminPortal.searchHomeowner}
                  onChange={setSearchText}
                  value={searchText}
                />
              </View>
            </View>

            {filteredList.length > 0 && (
              <View style={styles.fullAccess}>
                {editView ? (
                  <View style={[styles.flexRow, styles.alignCenter]}>
                    <CustomText
                      text={Dictionary.adminPortal.fullAccess}
                      size={12}
                    />
                    <CheckBox
                      style={styles.checkboxFullAccess}
                      checked={fullAccess}
                      onChange={setFullAccess}
                    />
                  </View>
                ) : (
                  <CustomText text={Dictionary.adminPortal.access} size={12} />
                )}
              </View>
            )}
          </>
        }
        keyExtractor={item => item.homeOwnerDetails.email}
        data={filteredList}
        renderItem={renderItem}
        ListEmptyComponent={
          <CustomText
            style={styles.padding20}
            size={16}
            text={Dictionary.home.noSearchResults}
            color={Colors.mediumGray}
          />
        }
        onRefresh={refresh}
        refreshing={false}
      />

      {filteredList.length > 0 && (
        <View style={[styles.padding20, styles.buttonContainer]}>
          {editView ? (
            <>
              <Button
                text={Dictionary.button.save}
                type="primary"
                disabled={
                  contractorDetails.accessibleUnits === accessibleUnits &&
                  contractorDetails.isFullAccess === fullAccess
                }
                onPress={saveChanges}
              />
              <Button
                text={Dictionary.button.cancel}
                type="secondary"
                onPress={() => {
                  setEditView(false);
                  setAccessibleUnits(contractorDetails.accessibleUnits);
                  setFullAccess(contractorDetails.isFullAccess);
                }}
              />
            </>
          ) : (
            <Button
              type="primary"
              text={Dictionary.button.editAccess}
              icon={Icons.edit}
              onPress={() => setEditView(true)}
            />
          )}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  margin20: {
    margin: 20,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  flex3: {
    flex: 3,
    paddingHorizontal: 10,
  },
  flexRow: {
    flexDirection: 'row',
  },
  buttonContainer: {
    borderColor: Colors.mediumGray,
    borderTopWidth: 0.5,
  },
  title: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
  },
  listContent: {
    flexDirection: 'row',
    paddingLeft: 20,
  },
  alignCenter: {
    alignItems: 'center',
  },
  padding20: {
    padding: 20,
  },
  fullAccess: {
    paddingHorizontal: 25,
    paddingBottom: 5,
    alignItems: 'flex-end',
    borderBottomColor: Colors.mediumGray,
    borderBottomWidth: 0.5,
  },
  checkboxFullAccess: {
    marginVertical: 0,
    marginLeft: 10,
  },
  marginVertical15: {
    marginVertical: 15,
  },
  divider: {
    borderWidth: 0.5,
    borderBottomColor: Colors.lightGray,
    marginTop: 20,
    marginHorizontal: 20,
  },
  padVertical10: {
    paddingVertical: 10,
  },
});
