import React, {useState} from 'react';
import {Image, Pressable, View} from 'react-native';
import CustomText from './CustomText';
import {StyleSheet} from 'react-native';
import BoschIcon from './BoschIcon';
import {Icons} from '../utils/icons';
import {Colors} from '../styles';
import Button from './Button';
import ModalComponent from './ModalComponent';
import {connect} from 'react-redux';
import UES from './../assets/images/UES.svg';
import {endEventBanner} from '../store/actions/HomeOwnerActions';

const EnergySavingsBanner = ({
  devices,
  selectedDevice,
  activate,
  idsEnergyUsateStartTime,
  idsEventStatus,
  idsEventAbbreviation,
  idsEventEndTime,
  endEventBanner,
  macId,
}) => {
  const [utilityEnergyModal, setUtilityEnergyModal] = useState(false);

  const checkIfSavingModeIsActivated = () => {
    let showBanner = false;
    devices.map(d => {
      if (d.macId === selectedDevice.gatewayId) {
        if (d.energySaveMode) {
          showBanner = true;
          return;
        }
      }
    });
    return showBanner;
  };

  const parseHourFormat = hour => {
    return hour % 12 || 12;
  };

  const showEndDate = () => {
    let message = '';
    let currentDate = new Date();
    let endDate = new Date(idsEventEndTime);
    if (
      endDate.getDate() === currentDate.getDate() &&
      endDate.getMonth() + 1 === currentDate.getMonth() + 1 &&
      endDate.getFullYear() === currentDate.getFullYear()
    ) {
      message = `To help prevent potential power outages in the community, Utility Energy Savings are now in effect due to high demand exceding supply.\nNormal operation will resume at ${
        parseHourFormat(endDate.getHours()) < 10
          ? `0${parseHourFormat(endDate.getHours())}`
          : parseHourFormat(endDate.getHours())
      }:${
        endDate.getMinutes() < 10
          ? `0${endDate.getMinutes()}`
          : endDate.getMinutes()
      } ${endDate.getHours() <= 11 ? 'AM' : 'PM'} ${idsEventAbbreviation}.`;
    } else {
      message = `To help prevent potential power outages in the community, Utility Energy Savings are now in effect due to high demand exceding supply.\nNormal operation will resume on ${
        endDate.getMonth() + 1
      }/${endDate.getDate()}/${endDate.getFullYear()} at ${
        parseHourFormat(endDate.getHours()) < 10
          ? `0${parseHourFormat(endDate.getHours())}`
          : parseHourFormat(endDate.getHours())
      }:${
        endDate.getMinutes() < 10
          ? `0${endDate.getMinutes()}`
          : endDate.getMinutes()
      } ${endDate.getHours() <= 11 ? 'AM' : 'PM'} ${idsEventAbbreviation}`;
    }
    return message;
  };

  const checkSavingModeState = () => {
    let message = '';
    if (activate) {
      switch (idsEventStatus) {
        case 'ACTIVE':
          message = 'Utility Energy Savings is in effect';
          break;
        case 'FAR':
          let notificationDate = new Date(idsEnergyUsateStartTime);
          let currentDate = new Date();
          if (
            notificationDate.getDate() === currentDate.getDate() &&
            notificationDate.getMonth() + 1 === currentDate.getMonth() + 1 &&
            notificationDate.getFullYear() === currentDate.getFullYear()
          ) {
            message = `Utility Energy Savings will be in effect at ${
              parseHourFormat(notificationDate.getHours()) < 10
                ? `0${parseHourFormat(notificationDate.getHours())}`
                : parseHourFormat(notificationDate.getHours())
            }:${
              notificationDate.getMinutes() < 10
                ? `0${notificationDate.getMinutes()}`
                : notificationDate.getMinutes()
            } ${
              notificationDate.getHours() <= 11 ? 'AM' : 'PM'
            } ${idsEventAbbreviation}`;
          } else {
            message = `Utility Enery Savings will be in effect on ${
              notificationDate.getMonth() + 1
            }/${notificationDate.getDate()}/${notificationDate.getFullYear()} at ${
              parseHourFormat(notificationDate.getHours()) < 10
                ? `0${parseHourFormat(notificationDate.getHours())}`
                : parseHourFormat(notificationDate.getHours())
            }:${
              notificationDate.getMinutes() < 10
                ? `0${notificationDate.getMinutes()}`
                : notificationDate.getMinutes()
            } ${
              notificationDate.getHours() <= 11 ? 'AM' : 'PM'
            } ${idsEventAbbreviation}`;
          }
          break;
        case 'COMPLETED':
          message = 'Event was completed';
          break;
        default: {
          message = '';
        }
      }
    }

    return message;
  };
  return (
    <>
      {activate && (
        <Pressable
          onPress={() => {
            setUtilityEnergyModal(true);
          }}
          style={styles.energySavingsContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <UES fill="#000" width={15} />
            <CustomText
              style={styles.marginLeft13}
              size={12}
              text={checkSavingModeState()}
              align={'left'}
            />
          </View>
          <Image
            style={styles.energySavingsArrow}
            source={require('./../assets/images/Arrow.png')}
          />
        </Pressable>
      )}
      <ModalComponent
        modalVisible={utilityEnergyModal}
        closeModal={() => setUtilityEnergyModal(false)}>
        <View style={{width: '97%'}}>
          <Image
            style={{alignSelf: 'center', marginBottom: 23, marginTop: 16}}
            source={require('./../assets/images/UtilityEnergy-Green.png')}
          />
          <CustomText
            text={'Utility Energy Savings'}
            size={21}
            font={'medium'}
            style={{marginBottom: 13}}
          />
          <CustomText
            text={
              'Thank you for your cooperation in keeping community powered during high demand preiods'
            }
            font={'regular'}
          />
          <View style={styles.tipSection}>
            <BoschIcon
              size={20}
              name={Icons.infoTooltip}
              color={Colors.mediumBlue}
              accessibilityLabel={'Info'}
            />
            <CustomText
              accessibilityLabelText={
                'To help prevent potential power outages in the community, Utility Energy Savings are now in effect due to high demand exceding supply.Normal operation will resume at 6:00 PM.'
              }
              size={12}
              align="left"
              newline={true}
              text={showEndDate()}
              style={[styles.flexShrink1, styles.paddingLeft5]}
            />
          </View>
          <Button
            type={'primary'}
            text={'Close'}
            onPress={() => {
              setUtilityEnergyModal(false);
            }}
          />
          <Button
            type={'secondary'}
            text={'End Event'}
            onPress={() => {
              setUtilityEnergyModal(false);
              endEventBanner({
                macId: macId,
              });
            }}
          />
        </View>
      </ModalComponent>
    </>
  );
};

const styles = StyleSheet.create({
  tipSection: {
    flexDirection: 'row',
    marginTop: 33,
  },
  flexShrink1: {
    flexShrink: 1,
  },
  paddingLeft5: {
    paddingLeft: 5,
  },
  energySavingsContainer: {
    backgroundColor: '#86D7A2',
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marginLeft13: {
    marginLeft: 13,
  },
  energySavingsArrow: {
    width: 16,
    height: 16,
  },
});

const mapDispatchToProps = {
  endEventBanner,
};

const mapStateToProps = state => {
  return {
    selectedDevice: state.homeOwner.selectedDevice,
    idsEnergyUsateStartTime: state.homeOwner.idsEnergyUsateStartTime,
    idsEventStatus: state.homeOwner.idsEventStatus,
    idsEventAbbreviation: state.homeOwner.idsEventAbbreviation,
    idsEventEndTime: state.homeOwner.idsEventEndTime,
    macId: state.homeOwner.idsSelectedDeviceAccess,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EnergySavingsBanner);
