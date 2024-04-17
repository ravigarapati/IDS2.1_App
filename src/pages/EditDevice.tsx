import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {BoschIcon, Button, CustomInputText} from '../components';
import {Dictionary} from '../utils/dictionary';
import {connect} from 'react-redux';
import {
  editDevice,
  getDeviceList2,
  getDeviceListEditDevice,
  updateDeviceList,
} from '../store/actions/HomeOwnerActions';
import {showToast} from '../components/CustomToast';
import {ScrollView} from 'react-native-gesture-handler';
import {Icons} from '../utils/icons';
import {Text} from 'react-native';

function EditDevice(props) {
  const [newDescriptionValue, setNewDescriptionValue] = useState(
    props.navigation.getParam('description'),
  );
  const [isChanged, setIsChanged] = useState(true);
  const isThermostat = props.navigation.getParam('isThermostat');

  useEffect(() => {
    let newDescription = props.navigation.getParam('description');
    let pos = 0;
    let result = [];
    if (newDescription.includes(' Thermostat')) {
      while (newDescription.indexOf(' Thermostat', pos) != -1) {
        result.push(newDescription.indexOf(' Thermostat', pos));
        pos = newDescription.indexOf(' Thermostat', pos) + 1;
      }
      setNewDescriptionValue(
        newDescription.substring(0, result[result.length - 1]),
      );
    }
  }, []);

  const save = () => {
    let deviceType = '';
    props.navigation.state.params.createStatusInterval();
    /*setTimeout(() => {
      props.navigation.state.params.createStatusInterval();
    }, 3000);*/
    if (props.navigation.getParam('deviceType').includes('IDS')) {
      if (props.navigation.getParam('deviceType') === 'IDS Premium Connected') {
        deviceType = 'IDS2.1';
      } else {
        deviceType = 'IDS3.0';
      }
    } else {
      deviceType = props.navigation.getParam('deviceType');
    }
    props.editDevice({
      deviceName: newDescriptionValue,
      deviceId: props.navigation.getParam('macId'),
      isThermostat: isThermostat,
      //idsBody: {
      //  gatewayId: props.navigation.getParam('macId'),
      //  ODUName: newDescriptionValue,
      //  ODUInstalledAddress: props.navigation.getParam('installationAddress'),
      //  contractorMonitoringStatus: props.navigation.getParam(
      //    'contractorMonitoringStatus',
      //  ),
      //  addressChanged: false,
      //},
      deviceType: deviceType,
    });
    props.navigation.navigate('HomeTabs');
  };

  const cancel = () => {
    props.navigation.state.params.createStatusInterval();

    props.navigation.navigate('HomeTabs');
  };

  const onBack = () => {
    cancel();
  };

  return (
    <View style={{flex: 1}}>
      <>
        <View style={styles.headerContainer}>
          <View style={styles.headerDivision}>
            <TouchableOpacity
              testID="backButton"
              style={styles.headerBackButton}
              onPress={() => onBack()}>
              <BoschIcon
                name={Icons.backLeft}
                size={24}
                style={styles.marginHorizontal10}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.headerTitle}>
            <Text
              style={{
                fontSize: 21,
                marginVertical: 10,
              }}>
              {'Edit Device'}
            </Text>
          </View>
        </View>
        <Image
          style={styles.headerRibbon}
          source={require('../assets/images/header_ribbon.png')}
        />
      </>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <View>
            <CustomInputText
              allowFontScaling={true}
              testID="newName"
              value={newDescriptionValue}
              placeholder={
                isThermostat
                  ? Dictionary.addDevice.addBcc.deviceLocation
                  : Dictionary.myAppliance.unitName
              }
              maxLength={15}
              onChange={text => {
                setNewDescriptionValue(text.replace(/[^a-zA-Z 0-9]/g, ''));
                setIsChanged(false);
              }}
              tooltip={
                isThermostat ? Dictionary.addDevice.addBcc.tooltipMessage : ''
              }
            />
            <CustomInputText
              allowFontScaling={true}
              value={props.navigation.getParam('macId')}
              placeholder={
                isThermostat
                  ? Dictionary.addDevice.addBcc.macId
                  : Dictionary.addDevice.addBcc.serialNumber
              }
              disabled={true}
            />
          </View>
          <View>
            <Button
              testID="submit"
              disabled={newDescriptionValue === '' || isChanged}
              text={Dictionary.button.save}
              onPress={save}
              type="primary"
            />
            <Button
              testID="cancel"
              text={Dictionary.button.cancel}
              onPress={cancel}
              type="secondary"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  headerContainer: {
    backgroundColor: '#ffff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerDivision: {
    flexDirection: 'column',
    flex: 0.15,
    backgroundColor: '#ffff',
    justifyContent: 'center',
  },
  headerBackButton: {
    justifyContent: 'center',
    flex: 1,
  },
  headerTitle: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 24,
  },
  headerRibbon: {height: 8, width: '100%'},
  confirmationPageContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  marginHorizontal10: {marginHorizontal: 10},
});

const mapDispatchToProps = {
  editDevice,
  getDeviceList2,
  getDeviceListEditDevice,
  updateDeviceList,
};

export default connect(null, mapDispatchToProps)(EditDevice);
