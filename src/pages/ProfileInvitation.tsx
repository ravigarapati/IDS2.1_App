import React, {useState} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {BoschIcon, Button, ConfirmationDialog, CustomText} from '../components';
import {Colors} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {Icons} from '../utils/icons';
import {useDispatch, useSelector} from 'react-redux';
import * as ContractorActions from '../store/actions/ContractorActions';
import * as NotificationAction from '../store/actions/NotificationActions';

export default function ProfileInvitation({
  visible,
  setVisible,
  inviteDetails,
  refresh,
}) {
  const accepted = 'ACCEPTED';
  const denied = 'DENIED';
  const dispatch = useDispatch();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showInviteContainer, setShowInviteContainer] = useState(
    Object.keys(inviteDetails).length !== 0 ? true : false,
  );
  const issueDate = useSelector(
    state => state.notification.activeNotificationIssueDate,
  );
  const notifications = useSelector(state => state.notification.activeCopy);
  function clearIssueDate() {
    dispatch(NotificationAction.setIssueDate(''));
  }
  function respondToCompanyInvite(status) {
    let requestbody = {
      companyId: inviteDetails.companyId,
      acceptanceStatus: status,
    };
    setShowInviteContainer(false);
    setShowConfirmation(false);
    const notification = notifications.find(
      element => element.notification == 'companyInvite',
    );
    dispatch(
      ContractorActions.respondToCompanyInvite(
        requestbody,
        () => {
          setVisible(false);
          dispatch(
            NotificationAction.moveNotificationToArchive(
              notification.issueDate,
              () => {
                dispatch(NotificationAction.getArchiveNotificationList({}));
              },
            ),
          );
          setTimeout(clearIssueDate, 1000);
          refresh(true);
        },
        () => {
          setVisible(false);
        },
      ),
    );
  }

  function cancel() {}

  return (
    <View style={{flex: 1}}>
      <ConfirmationDialog
        visible={showConfirmation}
        primaryButton={Dictionary.button.confirm}
        secondaryButton={Dictionary.button.cancel}
        primaryButtonOnPress={() => respondToCompanyInvite(denied)}
        secondaryButtonOnPress={() => setShowConfirmation(false)}
        text={Dictionary.profile.declineInvite}
      />
      {showInviteContainer && (
        <View style={styles.inviteContractorContainer}>
          <View style={styles.modalContainer}>
            <CustomText
              text={Dictionary.profile.inviteContractor}
              align="center"
              newline={true}
            />
            <CustomText
              text={inviteDetails.companyName}
              align="center"
              size={14}
            />
            <CustomText
              text={inviteDetails.address.address1}
              align="center"
              size={14}
            />
            {inviteDetails.address !== undefined &&
              inviteDetails.address.address2 !== undefined &&
              inviteDetails.address.address2 !== '' && (
                <CustomText
                  text={inviteDetails.address.address2}
                  align="center"
                  size={14}
                />
              )}
            <CustomText
              text={inviteDetails.address.city}
              align="center"
              size={14}
            />
            <CustomText
              text={
                inviteDetails.address.state +
                ' ' +
                inviteDetails.address.zipCode
              }
              align="center"
              size={14}
            />
            <CustomText
              text={inviteDetails.phoneNumber}
              align="center"
              size={14}
              newline={true}
            />
            <View style={[styles.flexRow, styles.padding10]}>
              <BoschIcon
                size={24}
                name={Icons.infoFrame}
                style={[styles.paddingTop5]}
              />

              <CustomText
                text={Dictionary.profile.info}
                align="left"
                size={12}
                style={styles.paddingLeft10}
              />
            </View>
            <View>
              <Button
                type="primary"
                text={Dictionary.button.accept}
                onPress={() => respondToCompanyInvite(accepted)}
              />
              <Button
                type="secondary"
                text={Dictionary.button.decline}
                onPress={() => setShowConfirmation(true)}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  modalContainer: {
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
    height: '100%',
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
  paddingTop20: {
    paddingTop: 20,
  },
  paddingTop5: {
    paddingTop: 15,
  },
  paddingLeft10: {
    paddingLeft: 10,
  },
});
