import React from 'react';
import {Dictionary} from '../utils/dictionary';
import {StyleSheet, Modal, View, Text} from 'react-native';
import DisplayThermostatDevice from './DisplayThermostatDevice';
import Button from './Button';

const DevicesModal = props => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.modalVisible}
      onRequestClose={() => {
        props.closeModal();
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.container}>
            <Text style={styles.modalHeader}>{props.title}</Text>
          </View>
          {props.thermostats.map(t => {
            return (
              <DisplayThermostatDevice
                key={t.name}
                thermostat={t}
                isThermostatSelected={props.isThermostatSelected}
                checkRadioButton={props.checkRadioButton}
                imagePath={
                  props.isThermostatSelected
                    ? t.name == Dictionary.addDevice.bcc100
                      ? require('./../assets/images/BCC100.png')
                      : require('./../assets/images/BCC50.png')
                    : t.name === 'IDS Arctic'
                    ? require('./../assets/images/IDSArctic.png')
                    : require('./../assets/images/idsicon.png')
                }
              />
            );
          })}
          <Button
            testID={props.testID}
            disabled={props.enableButton}
            type="primary"
            text={Dictionary.button.next}
            onPress={props.sendCheckDevice}
          />
          <Button
            type="secondary"
            text={Dictionary.button.cancel}
            onPress={props.cancel}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalHeader: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  container: {
    alignItems: 'center',
    marginBottom: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    padding: 35,
    paddingHorizontal: 10,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default DevicesModal;
