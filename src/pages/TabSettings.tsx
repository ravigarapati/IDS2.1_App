import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {
  BoschIcon,
  CustomInputText,
  CustomSettingsInput,
  InfoTooltip,
  SectionHeading,
} from '../components';
import {Dictionary} from '../utils/dictionary';
import {Colors} from '../styles';
import {connect} from 'react-redux';
import {
  getHeatPumpInfo,
  handleNoReloadHeatPumpInfo,
} from '../store/actions/HomeOwnerActions';
import {Icons} from '../utils/icons';
import {CustomText} from '../components';
import {showToast} from '../components/CustomToast';

const TabSettings = ({
  navigation,
  heatPumpInfo,
  contractorPermission,
  reloadHeatPumpInfo,
  getHeatPumpInfo,
  handleNoReloadHeatPumpInfo,
  selectedDevice,
  idsSelectedDevice,
  unitNameIds
}) => {
  const [data, setData] = useState<any>([]);
  const [apiManager, setApiManager] = useState(true);
  const [firstTime, setFirstTime] = useState(true);
  const [updateInfo, setUpdateInfo] = useState(true);

  useEffect(() => {
    if (heatPumpInfo.contractorMonitoringStatus !== undefined) {
      setData(heatPumpInfo);
    }
  }, [heatPumpInfo]);

  useEffect(() => {
    setFirstTime(false);
    if (idsSelectedDevice) {
      getHeatPumpInfo(idsSelectedDevice);
    }
  }, [idsSelectedDevice]);

  /*useEffect(() => {
    if (selectedDevice.gatewayId) {
      apiManager === true && getHeatPumpInfo(selectedDevice.gatewayId);
      reloadHeatPumpInfo === true && getHeatPumpInfo(selectedDevice.gatewayId);
    }

    handleNoReloadHeatPumpInfo();
    setApiManager(false);
  }, [heatPumpInfo]);*/

  return (
    <ScrollView
      style={styles.mainContainer}
      showsVerticalScrollIndicator={false}>
      <SectionHeading title={Dictionary.settingTab.unitDetails} />

      <View pointerEvents="none" style={styles.inputsView}>
        <CustomInputText
          placeholder={Dictionary.settingTab.unitName}
          value={unitNameIds}
        />
        {/*<View style={styles.lastInput}>
          <CustomInputText
            placeholder={Dictionary.settingTab.serviceStartDate}
            value="01/12/2018"
          />
        </View>*/}
      </View>

      <SectionHeading
        title={Dictionary.settingTab.installationAddress}
        navigation={() => {
          navigation.navigate('InstallationAddress');
        }}
      />

      <View pointerEvents="none" style={styles.inputsView}>
        <CustomInputText
          placeholder={Dictionary.settingTab.address1}
          value={data.address1}
        />
        <CustomInputText
          placeholder={Dictionary.settingTab.address2}
          value={data.address2}
        />
        <CustomInputText
          placeholder={Dictionary.settingTab.city}
          value={data.city}
        />
        <CustomInputText
          placeholder={Dictionary.settingTab.state}
          value={data.state}
        />
        <View style={styles.lastInput}>
          <CustomInputText
            placeholder={Dictionary.settingTab.zipCode}
            value={data.zipcode}
          />
        </View>
      </View>

      <SectionHeading
        title={Dictionary.settingTab.contractorMonitoringStatus}
        navigation={() => {
          navigation.navigate('ContractorMonitoringStatus');
        }}
      />

      <View style={styles.contractor}>
        <View style={styles.extra}>
          <View style={styles.iconAndTextContractor}>
            <Image
              style={styles.image}
              source={
                data.contractorMonitoringStatus
                  ? Icons.checkmarkFilledImage
                  : Icons.abortFilledImage
              }
            />
            <CustomText
              font="regular"
              size={16}
              align="left"
              text={
                data.contractorMonitoringStatus
                  ? Dictionary.settingTab.permissionGranted
                  : Dictionary.settingTab.permissionDenied
              }
            />
          </View>
          <View style={styles.tooltip}>
            <InfoTooltip text={Dictionary.settingTab.tooltipText} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const mapStateToProps = state => {
  return {
    heatPumpInfo: state.homeOwner.heatPumpInfo,
    contractorPermission: state.homeOwner.contractorMonitoringStatus,
    reloadHeatPumpInfo: state.homeOwner.reloadHeatPumpInfo,
    selectedDevice: state.homeOwner.selectedDevice,
    idsSelectedDevice: state.homeOwner.idsSelectedDevice,
    idsSelectedDeviceAccess: state.homeOwner.idsSelectedDeviceAccess,
    unitNameIds:state.homeOwner.unitNameIds
  };
};

const mapDispatchToProps = {
  getHeatPumpInfo,
  handleNoReloadHeatPumpInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(TabSettings);

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.white,
  },
  inputsView: {
    paddingHorizontal: 16,
  },
  lastInput: {
    paddingBottom: 25,
  },
  contractor: {
    justifyContent: 'flex-start',
  },
  extra: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 16,
  },
  iconAndTextContractor: {
    flexDirection: 'row',
    paddingLeft: 16,
    alignItems: 'center',
  },
  tooltip: {
    paddingRight: 20,
    alignItems: 'center',
  },
  image: {
    height: 24,
    width: 24,
    marginRight: 18,
  },
});
