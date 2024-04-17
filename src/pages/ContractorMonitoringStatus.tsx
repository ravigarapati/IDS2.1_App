import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {
  CustomText,
  InfoTooltip,
  ModalComponent,
  Button,
  BoschIcon,
} from '../components';
import {Dictionary} from '../utils/dictionary';
import {Colors, Typography} from '../styles';
import SwitchToggle from 'react-native-switch-toggle';
import {Icons} from '../utils/icons';
import {connect} from 'react-redux';
import {
  updateContractorPermissionAccept,
  updateContractorPermissionDenied,
  updateMonitoringStatus,
  getHeatPumpInfo,
} from '../store/actions/HomeOwnerActions';

const ContractorMonitoringStatus = ({
  navigaton,
  contractorPermission,
  updateContractorPermissionAccept,
  updateContractorPermissionDenied,
  updateMonitoringStatus,
  selectedDevice,
  idsSelectedDeviceAccess,
  heatPumpInfo,
  getHeatPumpInfo,
}) => {
  const [on, setOn] = useState(false);
  const [modal, setModal] = useState(false);
  const [manageModal, setManageModal] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    getHeatPumpInfo(idsSelectedDeviceAccess);
  }, []);

  useEffect(() => {
    setOn(heatPumpInfo.contractorMonitoringStatus);
  }, [heatPumpInfo]);

  useEffect(() => {
    if (isPressed) {
      //console.log('on', on);
      //on === false && manageModal === true ? setModal(true) : setModal(false);
      if (on === true) {
        updateMonitoringStatus(
          {
            data: {
              gatewayId: idsSelectedDeviceAccess,
              contractorMonitoringStatus: true,
            },
            updateState: true,
          },
          () => {},
        );
      }
    }
  }, [on]);

  const manageOnAndModal = () => {
    if (on) {
      setModal(true);
    } else {
      setOn(!on);
    }

    setManageModal(true);
  };

  const handleShowModal = () => {
    console.log('cambio');
    setOn(true);
    setModal(false);
  };

  const handleOn = () => {
    setOn(false);
    setModal(false);
  };

  return (
    <View style={styles.mainContainer}>
      <Image
        style={{alignSelf: 'center', marginBottom: 30}}
        source={require('./../assets/images/monitoring-status.png')}
      />
      <CustomText
        text={
          "Enabling monitoring will allow your\ncontractor to monitor the heat pump's\nhealth when not onsite"
        }
        style={{marginBottom: 30}}
      />
      <View style={styles.switchText}>
        <CustomText
          font="medium"
          size={18}
          text={Dictionary.contractorMonitoringStatus.monitoring}
        />
        <SwitchToggle
          switchOn={on}
          onPress={() => {
            setIsPressed(true);
            manageOnAndModal();
          }}
          circleColorOff="#FFFFFF"
          circleColorOn="#FFFFFF"
          backgroundColorOn="#00629A"
          backgroundColorOff="#71767C"
          containerStyle={{
            width: 48,
            height: 24,
            borderRadius: 50,
            padding: 6,
          }}
          circleStyle={{
            width: 12,
            height: 12,
            borderRadius: 25,
          }}
        />
      </View>

      <View style={styles.tipSection}>
        <BoschIcon
          size={20}
          name={Icons.infoTooltip}
          color={Colors.mediumBlue}
          accessibilityLabel={'Info'}
        />
        <CustomText
          accessibilityLabelText={
            'This data is used to remotely monitor your unit and alert you in case of a system malfunction.'
          }
          size={12}
          align="left"
          newline={true}
          text={
            'This data is used to remotely monitor your unit\nand alert you in case of a system malfunction.'
          }
          style={[styles.flexShrink1, styles.paddingLeft5]}
        />
      </View>
      <ModalComponent modalVisible={modal}>
        <View style={styles.modalCustomTextView}>
          <View style={styles.icon}>
            <BoschIcon color="#8B2284" name={Icons.questionFrame} size={76} />
          </View>

          <CustomText
            text={Dictionary.contractorMonitoringStatus.areYouSure}
            font="medium"
            size={21}
            style={styles.text}
          />

          <CustomText
            text={
              "If you deny your Contractor's access, they will be unable to ensure your Bosch Heat Pump System's Health."
            }
            font="regular"
            style={{marginBottom: 20}}
          />
          <CustomText
            text={"Are you sure your want to deny your Contractor's access?"}
            font="regular"
          />
        </View>
        <View style={styles.modalButtonsView}>
          <Button
            type="primary"
            onPress={() => setModal(false)}
            text={Dictionary.contractorMonitoringStatus.no}
            style={styles.primaryButton}
          />
          <Button
            type="secondary"
            onPress={() => {
              updateMonitoringStatus(
                {
                  data: {
                    gatewayId: idsSelectedDeviceAccess,
                    contractorMonitoringStatus: false,
                  },
                  updateState: true,
                },
                () => {
                  console.log('petition done');
                },
              );
              handleOn();
            }}
            text={Dictionary.contractorMonitoringStatus.yes}
          />
        </View>
      </ModalComponent>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    contractorPermission: state.homeOwner.contractorMonitoringStatus,
    selectedDevice: state.homeOwner.selectedDevice,
    idsSelectedDeviceAccess: state.homeOwner.idsSelectedDeviceAccess,
    heatPumpInfo: state.homeOwner.heatPumpInfo,
  };
};

const mapDispatchToProps = {
  updateContractorPermissionAccept,
  updateContractorPermissionDenied,
  updateMonitoringStatus,
  getHeatPumpInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContractorMonitoringStatus);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  switchText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 0,
  },
  tooltip: {
    height: 38,
    flexDirection: 'column-reverse',
  },
  customText: {
    width: '85%',
    height: 38,
  },
  modalCustomTextView: {
    paddingTop: 15,
    paddingBottom: 43,
  },
  icon: {
    alignSelf: 'center',
  },
  text: {
    paddingTop: 15,
    paddingBottom: 24,
  },
  primaryButton: {
    paddingBottom: 12,
  },
  modalButtonsView: {
    width: '100%',
  },
  tipSection: {
    flexDirection: 'row',
    marginTop: 28,
  },
  flexShrink1: {
    flexShrink: 1,
  },
  paddingLeft5: {
    paddingLeft: 5,
  },
});
