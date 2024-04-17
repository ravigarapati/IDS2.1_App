import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {
  Button,
  CustomText,
  BoschIcon,
  CheckBox,
  ConfirmationDialog,
  SearchBar,
} from '../components';
import {Dictionary} from '../utils/dictionary';
import {Colors} from '../styles';
import {useSelector} from 'react-redux';
import * as ContractorActions from '../store/actions/ContractorActions';
import {useDispatch} from 'react-redux';
import {Icons} from '../utils/icons';
import UserAnalytics from '../components/UserAnalytics';

export default function AdminPortalContractors(props) {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);
  const [listToDelete, setListToDelete] = useState([]);
  const sortOptions = ['alphabetically', 'recent'];
  const [showSortView, setShowSortView] = useState(false);
  const [sortedBy, setSortedBy] = useState(1);
  const contractorList = useSelector(state => state.contractor.contractorList);
  const [filteredContractorList, setFilteredContractorList] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  UserAnalytics('ids_admin_portal');

  useEffect(() => {
    dispatch(ContractorActions.getContractorList());
    props.navigation.addListener('didBlur', () => {
      setDeleteMode(false);
    });
  }, []);

  useEffect(() => {
    props.navigation.addListener('didFocus', () => {
      dispatch(ContractorActions.getContractorList());
    });
  }, [props.navigation]);

  const refresh = () => {
    dispatch(ContractorActions.getContractorList());
  };

  useEffect(() => {
    sortContractorList(sortedBy);
    function sortContractorList(sortBy) {
      let contractors = contractorList.filter(item =>
        (
          item.firstName.toLowerCase() +
          ' ' +
          item.lastName.toLowerCase()
        ).includes(searchText.toLowerCase().trim()),
      );
      if (sortBy === 0) {
        contractors.sort((a, b) => (a.lastName > b.lastName ? 1 : -1));
        setFilteredContractorList(contractors);
      } else {
        contractors.sort((a, b) => {
          return b.requestAcceptDateTime - a.requestAcceptDateTime;
        });
        setFilteredContractorList(contractors);
      }
      setShowSortView(false);
    }
  }, [contractorList, searchText, sortedBy]);

  function addToListToDelete(id, isChecked) {
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

  function deleteContractorList() {
    setShowDeleteConfirmation(false);
    setDeleteMode(false);
    dispatch(
      ContractorActions.adminPortalDelete({
        contractorId: listToDelete,
        action: 'delete',
      }),
    );
    setListToDelete([]);
  }

  const Filter = ({options}) => {
    return (
      <View style={[styles.tooltip, styles.boxWithShadow]}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[sortedBy === index ? styles.selected : styles.padding10]}
            onPress={() => {
              setSortedBy(index);
            }}>
            <CustomText
              text={Dictionary.adminPortal[option]}
              align="left"
              color={sortedBy === index ? Colors.white : Colors.black}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderItem = ({item}) => (
    <View>
      <View style={[styles.listTitle]}>
        <TouchableOpacity
          style={styles.flex4}
          onPress={() => {
            props.navigation.navigate('ContractorUnitAccess', {
              ...item,
            });
          }}>
          <CustomText
            noOfLines={1}
            text={item.firstName + ' ' + item.lastName}
            align="left"
            color={Colors.blueOnPress}
          />
        </TouchableOpacity>
        {deleteMode && (
          <View style={[styles.alignRight, styles.flex1]}>
            <CheckBox
              style={styles.checkbox}
              checked={listToDelete.includes(item.contractorId)}
              onChange={(checked: boolean) =>
                addToListToDelete(item.contractorId, checked)
              }
            />
          </View>
        )}
      </View>
      <View style={styles.listContent}>
        <CustomText text={item.phoneNumber} align="left" size={12} />
        <CustomText text={item.email} align="left" size={12} />
      </View>
    </View>
  );
  return (
    <View style={styles.authScreen}>
      {contractorList && contractorList.length > 0 && (
        <View style={[styles.flexRow, {padding: 20}]}>
          <SearchBar
            style={styles.searchView}
            value={searchText}
            onChange={text => setSearchText(text)}
            placeholder={Dictionary.adminPortal.searchContractor}
          />
          <View style={[styles.flex1, styles.iconView]}>
            <TouchableOpacity
              hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
              onPress={() => {
                setShowSortView(!showSortView);
              }}>
              <BoschIcon
                size={25}
                name={Icons.sortAlphabetically}
                color={Colors.darkBlue}
                accessibilityLabel={'Sort Alphabetically'}
                style={{height: 25}}
              />
            </TouchableOpacity>
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
                  setDeleteMode(true);
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

          {showSortView && (
            <TouchableOpacity
              style={[
                styles.touchablecontainer,
                {backgroundColor: Colors.transparent},
              ]}
              activeOpacity={1}
              onPress={() => {
                setShowSortView(false);
              }}
            />
          )}
        </View>
      )}
      <View style={[styles.flex1, {zIndex: 1}]}>
        <FlatList
          ListEmptyComponent={
            <CustomText
              style={styles.padding20}
              size={16}
              text={
                contractorList.length > 0
                  ? Dictionary.home.noSearchResults
                  : Dictionary.adminPortal.contractorsListEmpty
              }
              color={Colors.mediumGray}
            />
          }
          data={filteredContractorList}
          renderItem={renderItem}
          keyExtractor={item => item.contractorId}
          onRefresh={refresh}
          refreshing={false}
        />
        {showSortView && <Filter options={sortOptions} />}
      </View>
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
        text={Dictionary.adminPortal.deleteConfirmation}
        primaryButton={Dictionary.button.yes}
        secondaryButton={Dictionary.button.no}
        primaryButtonOnPress={deleteContractorList}
        secondaryButtonOnPress={() => {
          setShowDeleteConfirmation(false);
        }}
      />

      {showSortView && (
        <TouchableOpacity
          style={[styles.touchablecontainer]}
          activeOpacity={1}
          onPress={() => {
            setShowSortView(false);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  authScreen: {
    flexGrow: 1,
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    paddingTop: 0,
    backgroundColor: Colors.white,
  },
  flex1: {
    flex: 1,
  },
  flex4: {
    flex: 4,
  },
  flexRow: {
    flexDirection: 'row',
  },
  iconView: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  searchView: {
    flex: 3,
    marginRight: 20,
  },
  alignRight: {
    flexDirection: 'row-reverse',
    marginRight: 10,
  },
  buttonContainer: {
    padding: 20,
    borderColor: Colors.mediumGray,
    borderWidth: 0.5,
  },
  tooltip: {
    position: 'absolute',
    // zIndex: 99,
    backgroundColor: Colors.white,
    top: -20,
    right: 15,
  },
  boxWithShadow: {
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selected: {
    backgroundColor: Colors.darkBlue,
    padding: 10,
  },
  padding10: {
    padding: 10,
  },
  touchablecontainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  checkbox: {
    marginVertical: 0,
  },
  listTitle: {
    backgroundColor: Colors.lightGray,
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  padding20: {
    padding: 20,
  },
});
