import React, {useEffect, useState} from 'react';
import {View, ScrollView, Image, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {
  getHeatPumpInfo,
  handleNoReloadHeatPumpInfo,
  updateHeatPumpInfo,
  handleReloadHeatPumpInfo,
} from '../store/actions/HomeOwnerActions';
import {
  BoschIcon,
  Button,
  CustomInputText,
  CustomPicker,
  CustomSettingsInput,
  CustomText,
  InfoTooltip,
  SectionHeading,
} from '../components';
import {Dictionary} from '../utils/dictionary';
import {Colors} from '../styles';
import {Icons} from '../utils/icons';
import {Enum} from '../utils/enum';

const ApplianceInformation = ({
  navigation,
  heatPumpInfo,
  contractorPermission,
  reloadHeatPumpInfo,
  getHeatPumpInfo,
  handleNoReloadHeatPumpInfo,
  updateHeatPumpInfo,
  handleReloadHeatPumpInfo,
  selectedDevice,
  idsSelectedDevice,
}) => {
  const [data, setData] = useState<any>([]);
  const [apiManager, setApiManager] = useState(true);
  const [editAddress, setEditAddress] = useState('none');
  const [updatedData, setDataUpdated] = useState({
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipcode: '',
  });

  useEffect(() => {
    if (heatPumpInfo.address1) {
      setData(heatPumpInfo);
    }
  }, [heatPumpInfo]);

  useEffect(() => {
    if (idsSelectedDevice) {
      apiManager === true && getHeatPumpInfo(idsSelectedDevice);
      reloadHeatPumpInfo === true && getHeatPumpInfo(idsSelectedDevice);
    }

    handleNoReloadHeatPumpInfo();
    setApiManager(false);
  }, [heatPumpInfo]);

  return (
    <ScrollView
      style={styles.mainContainer}
      showsVerticalScrollIndicator={false}>
      <SectionHeading title={Dictionary.settingTab.unitDetails} />

      <View pointerEvents="none" style={styles.inputsView}>
        <CustomInputText
          placeholder={Dictionary.settingTab.unitName}
          value="Heat Pump"
        />
        <View style={styles.lastInput}>
          <CustomInputText
            placeholder={Dictionary.settingTab.serviceStartDate}
            value={data.startDate}
          />
        </View>
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
          onChange={val => {
            setData(prevState => ({
              ...prevState,
              address1: val,
            }));
          }}
        />
        <CustomInputText
          placeholder={Dictionary.settingTab.address2}
          value={data.address2}
          onChange={val => {
            setData(prevState => ({
              ...prevState,
              address2: val,
            }));
          }}
        />
        <CustomInputText
          placeholder={Dictionary.settingTab.city}
          value={data.city}
          onChange={val => {
            setData(prevState => ({
              ...prevState,
              city: val,
            }));
          }}
        />
        <CustomPicker
          placeholder={Dictionary.installationAddress.state}
          value={data.state}
          onChange={(text: any) => {
            setData(prevState => ({
              ...prevState,
              state: text.value,
            }));
          }}
          options={Enum.stateList}
          iteratorKey="key"
          iteratorLabel="label"
          isRequiredField={true}
          showFieldLabel={true}
        />
        <View style={styles.lastInput}>
          <CustomInputText
            placeholder={Dictionary.settingTab.zipCode}
            value={data.zipcode}
            maxLength={5}
            onChange={val => {
              setData(prevState => ({
                ...prevState,
                zipcode: val,
              }));
            }}
          />
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
  };
};

const mapDispatchToProps = {
  getHeatPumpInfo,
  handleNoReloadHeatPumpInfo,
  updateHeatPumpInfo,
  handleReloadHeatPumpInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ApplianceInformation);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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

/*

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
                contractorPermission
                  ? Icons.checkmarkFilledImage
                  : Icons.abortFilledImage
              }
            />
            <CustomText
              font="regular"
              size={16}
              align="left"
              text={
                contractorPermission
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

*/
