import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {Button, CustomText, SearchBar, ConfirmationDialog} from '../components';
import {Colors} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {Enum} from '../utils/enum';
import {useDispatch} from 'react-redux';
import * as ContractorActions from '../store/actions/ContractorActions';

export default function InviteNewContractor({visible, setVisible}) {
  const [searchText, setSearchText] = useState('');
  const [selectedContractorId, setSelectedContractorId] = useState('');
  const [filteredContractorList, setFilteredContractorList] = useState([]);
  const [errorMsg, setErrorMsg] = useState(
    Dictionary.adminPortal.searchPhoneError,
  );
  const [errorMsgColor, setErrorMsgColor] = useState(Colors.mediumGray);
  const dispatch = useDispatch();
  const [requestClicked, setRequestClicked] = useState(false);

  function onSearch(response) {
    setFilteredContractorList(response);
    if (response.length === 0) {
      setErrorMsg(Dictionary.adminPortal.notAssociatedContractorNumber);
      setErrorMsgColor(Colors.darkRed);
    }
  }
  useEffect(() => {
    let pattern = new RegExp(Enum.phoneNumberPattern.pattern);
    if (searchText.trim() !== '' && searchText.length === 12) {
      if (pattern.test(searchText)) {
        setErrorMsg('');
        dispatch(ContractorActions.searchContractor(searchText, onSearch));
      } else {
        setErrorMsg(Dictionary.adminPortal.searchPhoneError);
        setErrorMsgColor(Colors.darkRed);
      }
    } else {
      setFilteredContractorList([]);
      setErrorMsg(Dictionary.adminPortal.searchPhoneError);
      setErrorMsgColor(Colors.mediumGray);
    }
  }, [dispatch, searchText]);

  function resetInviteModal() {
    setVisible(false);
    setSearchText('');
    setSelectedContractorId('');
    setFilteredContractorList([]);
  }
  function sendInvite() {
    resetInviteModal();
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

  function cancel() {
    resetInviteModal();
  }

  const renderItem = ({item}) => {
    var color =
      item.contractorId === selectedContractorId ? Colors.white : Colors.black;
    return (
      <TouchableOpacity
        style={[
          styles.padding10,
          item.contractorId === selectedContractorId
            ? styles.selected
            : styles.unselected,
        ]}
        onPress={() => {
          setSelectedContractorId(item.contractorId);
        }}>
        <View>
          <CustomText
            text={item.firstName + ' ' + item.lastName}
            align="left"
            color={color}
          />
          <CustomText
            text={item.phoneNumber}
            align="left"
            size={10}
            color={color}
          />
          <CustomText text={item.email} align="left" size={10} color={color} />
        </View>
      </TouchableOpacity>
    );
  };
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;
  const separator = () => {
    return <View style={[styles.borderStyle]} />;
  };
  return (
    <>
      {visible && (
        <KeyboardAvoidingView
          behavior='height'
          keyboardVerticalOffset={keyboardVerticalOffset}
          style={styles.container}>
          <View style={styles.inviteContractorContainer}>
            <View style={styles.modalContainer}>
              <CustomText
                text={Dictionary.adminPortal.inviteContractor}
                align="center"
              />
              <View style={styles.paddingTop10}>
                <SearchBar
                  placeholder={Dictionary.adminPortal.searchPhoneNumber}
                  value={searchText}
                  onChange={setSearchText}
                  keyboardType="number-pad"
                  maxLength={12}
                  delimiterType="phone"
                />
              </View>

              <FlatList
                ListEmptyComponent={
                  <CustomText
                    style={styles.padding10}
                    text={errorMsg}
                    size={12}
                    color={errorMsgColor}
                    align={
                      errorMsg === Dictionary.adminPortal.searchPhoneError
                        ? 'center'
                        : 'left'
                    }
                  />
                }
                ItemSeparatorComponent={separator}
                persistentScrollbar
                style={styles.flex1}
                data={filteredContractorList}
                renderItem={renderItem}
                keyExtractor={item => item.contractorId}
              />

              <View style={styles.paddingTop10}>
                <Button
                  type="primary"
                  disabled={selectedContractorId === ''}
                  text={Dictionary.button.sendRequest}
                  onPress={sendInvite}
                />
                <Button
                  type="secondary"
                  text={Dictionary.button.cancel}
                  onPress={cancel}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
      <ConfirmationDialog
        visible={requestClicked}
        text={Dictionary.adminPortal.sendRequest}
        primaryButton={Dictionary.button.close}
        primaryButtonOnPress={() => {
          setRequestClicked(false);
          dispatch(ContractorActions.getInvitedContractorList());
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  modalContainer: {
    flexGrow: 1,
    maxHeight: '80%',
    overflow: 'hidden',
    width: '90%',
    borderWidth: 0.5,
    borderColor: Colors.mediumGray,
    backgroundColor: Colors.white,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inviteContractorContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blur,
  },
  borderStyle: {
    borderBottomColor: Colors.mediumGray,
    borderBottomWidth: 1,
  },
  padding10: {
    padding: 10,
  },
  selected: {
    backgroundColor: Colors.darkBlue,
    padding: 10,
  },
  unselected: {
    backgroundColor: Colors.transparent,
  },
  paddingTop10: {
    paddingTop: 10,
  },
});

