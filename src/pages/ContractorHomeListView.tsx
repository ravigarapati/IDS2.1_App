import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Linking,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  BoschIcon,
  Button,
  CheckBox,
  ConfirmationDialog,
  CustomText,
  SearchBar,
} from '../components';
import {Dictionary} from '../utils/dictionary';
import {Enum} from '../utils/enum';
import {Colors} from '../styles';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {Icons} from '../utils/icons';
import * as ContractorActions from '../store/actions/ContractorActions';
import {showToast} from '../components/CustomToast';
import { Mock } from '../utils/Mock';

const Item = ({label, data}) => (
  <View style={styles.flexRow}>
    <CustomText style={styles.flex1} text={label} align="left" size={12} />
    {label === Dictionary.home.phone ? (
      <TouchableOpacity
        style={styles.flex1}
        onPress={() => Linking.openURL('tel:' + data)}>
        <CustomText text={data} align="left" size={12} />
      </TouchableOpacity>
    ) : (
      <CustomText style={styles.flex1} text={data} align="left" size={12} />
    )}
  </View>
);

const ListItem = ({
  data,
  goToDashboard,
  deleteMode,
  listToDelete,
  setListToDelete,
  showDeleteFor,
}) => {
  var title =
    data.systemStatus.toLowerCase() === Enum.status.pending
      ? Dictionary.common.actionRequired
      : data.homeOwnerDetails.firstName + ' ' + data.homeOwnerDetails.lastName;
  var bgColor =
    data.systemStatus.toLowerCase() === Enum.status.pending
      ? Colors.lightYellow
      : Colors.lightGray;

  var showDelete;
  if (data.systemStatus.toLowerCase() === Enum.status.pending) {
    showDelete = true;
  } else {
    showDelete = showDeleteFor === 'all';
  }

  const [checkboxAccessibility, setCheckboxAccessibility] = useState();

  function addToListToDelete(id, isChecked) {
    setCheckboxAccessibility(isChecked);
    if (isChecked) {
      let newDeleteList = [...listToDelete];
      newDeleteList.push(id);
      setListToDelete(newDeleteList);
    } else {
      let newDeleteList = [...listToDelete];
      let index = newDeleteList.indexOf(id);
      if (index !== -1) {
        newDeleteList.splice(index, 1);
      }
      setListToDelete(newDeleteList);
    }
  }

  var titleColor = Colors.blueOnPress;
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (deleteMode) {
            if (showDelete) {
              addToListToDelete(
                data.gateway.gatewayId,
                !listToDelete.includes(data.gateway.gatewayId),
              );
            }
          } else {
            goToDashboard(data);
          }
        }}
        style={[styles.listItemTitle, {backgroundColor: bgColor}]}>
        <BoschIcon
          name={Enum.mapPins[data.systemStatus.toLowerCase()].icon}
          size={26}
          color={Enum.mapPins[data.systemStatus.toLowerCase()].color}
          accessibilityLabel={data.systemStatus + 'unit'}
          style={{height: 26}}
        />
        <CustomText
          text={title}
          align="left"
          style={styles.padLeft5}
          color={titleColor}
        />
        {deleteMode && showDelete && (
          <View
            style={[styles.alignRight, styles.flex1]}
            accessibilityLabel={
              checkboxAccessibility === true ? 'checked' : 'unchecked'
            }>
            <CheckBox
              style={styles.checkbox}
              checked={listToDelete.includes(data.gateway.gatewayId)}
              onChange={(checked: boolean) => {
                addToListToDelete(data.gateway.gatewayId, checked);
              }}
            />
          </View>
        )}
      </TouchableOpacity>
      {data.systemStatus.toLowerCase() === Enum.status.pending ? (
        <TouchableWithoutFeedback>
          <View style={styles.listItem}>
            <Item
              label={Dictionary.home.modelName}
              data={data.odu.modelNumber}
            />
            <Item
              label={Dictionary.home.oduSerialNumber}
              data={
                data.odu.serialNumber.substring(0, 16) +
                '\n' +
                data.odu.serialNumber.substring(16, 26)
              }
            />
            <Item
              label={Dictionary.home.serviceStartDate}
              data={
                data.odu.serviceStartDate
                  ? moment(data.odu.serviceStartDate).format('MM/DD/YYYY')
                  : ''
              }
            />
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback>
          <View style={styles.listItem}>
            <Item
              label={Dictionary.home.address}
              data={data.odu.installedAddress.address}
            />
            <Item
              label={Dictionary.home.phone}
              data={data.homeOwnerDetails.phoneNumber}
            />
            <Item
              label={Dictionary.home.modelName}
              data={data.odu.modelNumber}
            />
            <Item
              label={Dictionary.home.serviceStartDate}
              data={
                data.odu.serviceStartDate
                  ? moment(data.odu.serviceStartDate).format('MM/DD/YYYY')
                  : ''
              }
            />
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

export default function ContractorHomeListView({
  unitsList,
  refresh,
  goToDashboard,
  listDeleted,
}) {
  const [search, setSearch] = useState('');
  const [listView, setListView] = useState(unitsList);
  const [deleteMode, setDeleteMode] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [listToDelete, setListToDelete] = useState([]);
  const userRole = useSelector(
    state => state.auth.user.attributes['custom:role'],
  );
  const contractorDetails = useSelector(
    state => state.contractor.contractorDetails,
  );
  const demoMode = useSelector(state => state.notification.demoStatus);
  useEffect(() => {
    setListView(unitsList);
    setSearch('');
  }, [unitsList]);
  const handleSearch = text => {
    setSearch(text);
    if (text === '') {
      setListView(unitsList);
    } else {
      const query = text.toLowerCase();
      const data = unitsList.filter(item => {
        return (
          item.homeOwnerDetails &&
          (item.homeOwnerDetails.firstName.toLowerCase().startsWith(query) ||
            item.homeOwnerDetails.lastName.toLowerCase().startsWith(query) ||
            (
              item.homeOwnerDetails.firstName +
              ' ' +
              item.homeOwnerDetails.lastName
            )
              .toLowerCase()
              .startsWith(query))
        );
      });
      setListView(data);
    }
  };

  const dispatch = useDispatch();

  const renderItem = ({item}) => (
    <ListItem
      data={item}
      goToDashboard={goToDashboard}
      deleteMode={deleteMode}
      listToDelete={listToDelete}
      setListToDelete={setListToDelete}
      showDeleteFor={
        !contractorDetails.companyId || contractorDetails.isAdmin
          ? 'all'
          : 'pending'
      }
    />
  );

  return (
    <View style={[styles.flex1, styles.justifyCenter]}>
      <View style={styles.searchView}>
        <SearchBar
          onChange={text => handleSearch(text)}
          value={search}
          placeholder={Dictionary.home.search}
          style={styles.flex1}
        />
        <TouchableOpacity
          hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
          onPress={() => {
            if (deleteMode) {
              // if (listToDelete.length !== 0) {
              //   setShowDeleteConfirmation(true);
              // }
              setDeleteMode(false);
              setListToDelete([]);
            } else {
              demoMode
                ? showToast(Dictionary.demoMode.functionNotAvailable)
                : setDeleteMode(true);
            }
          }}>
          <BoschIcon
            size={25}
            name={Icons.delete}
            color={deleteMode ? Colors.darkGray : Colors.darkBlue}
            accessibilityLabel={'Delete'}
            style={{height: 25}}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        ListEmptyComponent={
          <CustomText
            size={12}
            text={Dictionary.home.noResultsFound}
            color={Colors.mediumGray}
          />
        }
        onRefresh={() => refresh()}
        refreshing={false}
        keyExtractor={item => item.gateway.gatewayId}
        data={listView}
        renderItem={renderItem}
      />
      {deleteMode && (
        <View style={[styles.buttonContainer]}>
          <Button
            text={Dictionary.button.delete}
            type="primary"
            disabled={listToDelete.length === 0}
            onPress={() => {
              setShowDeleteConfirmation(true);
            }}
          />
          <Button
            text={Dictionary.button.cancel}
            type="secondary"
            onPress={() => {
              setDeleteMode(false);
              setListToDelete([]);
            }}
          />
        </View>
      )}

      <ConfirmationDialog
        visible={showDeleteConfirmation}
        text={
          userRole === Enum.roles.contractorPowerUser
            ? Dictionary.home.deleteConfirmationAdmin
            : Dictionary.home.deleteConfirmation
        }
        primaryButton={Dictionary.button.yes}
        secondaryButton={Dictionary.button.no}
        primaryButtonOnPress={() => {
          setShowDeleteConfirmation(false);
          dispatch(
            ContractorActions.deleteUnits(listToDelete, () => {
              setDeleteMode(false);
              setListToDelete([]);
            }),
          );
          setTimeout(() => {
            listDeleted();
          }, 100);
        }}
        secondaryButtonOnPress={() => {
          setShowDeleteConfirmation(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  padding20: {
    padding: 20,
  },
  flex1: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  listItemTitle: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItem: {
    paddingHorizontal: 45,
    paddingTop: 10,
    paddingBottom: 15,
  },
  searchView: {
    flexDirection: 'row',
    marginHorizontal: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  padLeft5: {
    paddingLeft: 5,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  buttonContainer: {
    padding: 20,
    borderColor: Colors.mediumGray,
    borderWidth: 0.5,
  },
  checkbox: {
    marginVertical: 0,
  },
  alignRight: {
    flexDirection: 'row-reverse',
    marginRight: 10,
  },
});
