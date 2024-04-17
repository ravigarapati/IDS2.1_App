import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {
  Button,
  CustomText,
  BoschIcon,
  CheckBox,
  InfoTooltip,
  ConfirmationDialog,
} from '../components';
import {Dictionary} from '../utils/dictionary';
import {Colors} from '../styles';
import {useSelector} from 'react-redux';
import * as ContractorActions from '../store/actions/ContractorActions';
import {useDispatch} from 'react-redux';
import {Icons} from '../utils/icons';
import InviteNewContractor from './InviteNewContractor';

export default function AdminPortalRequests(props) {
  const dispatch = useDispatch();
  const [deleteMode, setDeleteMode] = useState(false);
  const [listToDelete, setListToDelete] = useState([]);
  const contractorList = useSelector(
    (state) => state.contractor.invitedContractorList,
  );
  const [sortedContractorList, setSortedContractorList] = useState([]);
  const [showSortView, setShowSortView] = useState(false);
  const [sortedBy, setSortedBy] = useState(1);
  const sortOptions = ['alphabetically', 'recent'];
  const [inviteModalVisible, setInviteModalVisible] = useState(false);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  useEffect(() => {
    dispatch(ContractorActions.getInvitedContractorList());
    props.navigation.addListener('didBlur', () => {
      setDeleteMode(false);
    });
  }, []);

  useEffect(() => {
    props.navigation.addListener('didFocus', () => {
      dispatch(ContractorActions.getInvitedContractorList());
    });
  }, [props.navigation]);

  const refresh = () => {
    dispatch(ContractorActions.getInvitedContractorList());
  };

  useEffect(() => {
    if (sortedBy === 0) {
      contractorList.sort((a, b) => (a.lastName > b.lastName ? 1 : -1));
      setSortedContractorList(contractorList);
    } else {
      contractorList.sort((a, b) => {
        return b.updatedDate - a.updatedDate;
      });
      setSortedContractorList(contractorList);
    }
    setShowSortView(false);
  }, [contractorList, sortedBy]);

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

  function deleteRequestList() {
    setShowDeleteConfirmation(false);
    setDeleteMode(false);
    dispatch(
      ContractorActions.adminPortalDelete({
        contractorId: listToDelete,
        action: 'cancel',
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
    <View style={[styles.flex1, styles.flexRow]}>
      <View style={[styles.flex1]}>
        <View style={[styles.listTitle]}>
          <View style={styles.flex3}>
            <CustomText
              text={item.firstName + ' ' + item.lastName}
              align="left"
              noOfLines={1}
              color={Colors.blueOnPress}
            />
          </View>
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
          <CustomText text={item.phoneNumber} align="left" size={10} />
          <CustomText text={item.email} align="left" size={10} />
        </View>
      </View>
      <View />
    </View>
  );

  return (
    <View style={styles.authScreen}>
      <View
        style={[styles.flexRow, styles.inviteButtonView, styles.borderStyle]}>
        <Button
          icon={Icons.addFrame}
          type="tertiary"
          text={Dictionary.adminPortal.inviteContractor}
          onPress={() => {
            setInviteModalVisible(true);
          }}
        />
        <InfoTooltip
          positionVertical="bottom"
          text={Dictionary.adminPortal.newContractorTooltipInfo}
        />
      </View>
      {contractorList.length > 0 && (
        <View style={[styles.flexRow, styles.padding20, styles.borderStyle]}>
          <View style={styles.iconView}>
            <CustomText
              text={Dictionary.adminPortal.requestSent}
              font="bold"
              align="left"
            />
            <TouchableOpacity
              hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
              onPress={() => {
                setShowSortView(!showSortView);
              }}
              style={styles.paddingHortizontal10}>
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
              }}
              style={styles.paddingHortizontal10}>
              <BoschIcon
                size={25}
                name={Icons.delete}
                color={deleteMode ? Colors.darkGray : Colors.darkBlue}
                accessibilityLabel={'Delete'}
                style={{height: 25}}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={[styles.flex1, {zIndex: 1}]}>
        <FlatList
          ListEmptyComponent={
            <CustomText
              style={styles.padding20}
              size={16}
              text={Dictionary.adminPortal.requestsListEmpty}
              color={Colors.mediumGray}
            />
          }
          data={sortedContractorList}
          renderItem={renderItem}
          onRefresh={refresh}
          refreshing={false}
          keyExtractor={(item) => item.contractorId}
        />
        {showSortView && <Filter options={sortOptions} />}
      </View>
      {deleteMode && (
        <View style={[styles.padding20, styles.buttonContainer]}>
          <Button
            text={Dictionary.button.cancelInvite}
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

      <InviteNewContractor
        visible={inviteModalVisible}
        setVisible={setInviteModalVisible}
      />

      <ConfirmationDialog
        visible={showDeleteConfirmation}
        text={Dictionary.adminPortal.cancelConfirmation}
        primaryButton={Dictionary.button.yes}
        secondaryButton={Dictionary.button.no}
        primaryButtonOnPress={deleteRequestList}
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
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    backgroundColor: Colors.white,
  },
  flex1: {
    flex: 1,
  },
  flex3: {
    flex: 3,
  },
  flexRow: {
    flexDirection: 'row',
  },
  iconView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    height: '100%',
  },
  borderStyle: {
    borderBottomColor: Colors.mediumGray,
    borderBottomWidth: 1,
  },
  alignRight: {
    flexDirection: 'row-reverse',
    marginRight: 10,
  },
  paddingVertical10: {
    paddingVertical: 10,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  checkbox: {
    marginVertical: 0,
  },
  padding10: {
    padding: 10,
  },
  listTitle: {
    backgroundColor: Colors.lightGray,
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
  padding20: {padding: 20},
  paddingHortizontal20: {paddingHorizontal: 20},
  paddingHortizontal10: {paddingHorizontal: 10},
  tooltip: {
    position: 'absolute',
    backgroundColor: Colors.white,
    top: -10,
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
  unselected: {
    backgroundColor: Colors.transparent,
  },
  inviteModal: {
    borderWidth: 1,
    borderColor: Colors.black,
    backgroundColor: Colors.white,
    padding: 5,
  },
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchablecontainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  inviteButtonView: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    borderColor: Colors.mediumGray,
    borderWidth: 0.5,
  },
});
