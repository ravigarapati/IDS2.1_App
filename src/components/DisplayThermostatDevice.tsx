import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import {Typography} from '../styles';
import {Dictionary} from '../utils/dictionary';
import CustomText from './CustomText';

class DisplayThermostatDevice extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    selected: false,
  };

  render() {
    return (
      <Pressable
        accessible={true}
        style={[styles.rowDirection1, styles.idsPaddingVertical]}
        onPress={() => {
          this.props.checkRadioButton(this.props.thermostat.name);
        }}>
        <View
          accessible={true}
          style={{
            width: '50%',
            alignItems: 'center',
          }}>
          <Image
            accessible={false}
            style={styles.idsImageDimensions}
            source={this.props.imagePath}
          />
        </View>
        <View style={{width: '50%'}}>
          <View
            accessible={true}
            accessibilityLabel={`${this.props.thermostat.name}. Device type: ${
              this.props.isThermostatSelected
                ? Dictionary.addDevice.thermostat
                : Dictionary.addDevice.heatPump
            }.`}
            style={[styles.columnDirection, {width: '60%', marginTop: 20}]}>
            <CustomText
              allowFontScaling={true}
              text={
                this.props.thermostat.name === 'BCC100'
                  ? this.props.thermostat.name + '\nBCC110'
                  : this.props.thermostat.name
              }
              size={14}
              font={'medium'}
              align={'left'}
            />
            <CustomText
              allowFontScaling={true}
              text={
                this.props.isThermostatSelected
                  ? Dictionary.addDevice.thermostat
                  : Dictionary.addDevice.heatPump
              }
              size={12}
              font={'medium'}
              color={'#C1C7CC'}
              align={'left'}
            />
          </View>
          <View style={{position: 'absolute', right: 5, top: true ? -5 : -20}}>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel={`Radio button to select ${
                this.props.thermostat.name
              }. ${this.props.thermostat.checked ? 'Already checked' : ''}`}
              accessibilityHint={`Press it to select ${this.props.thermostat.name} as the device to add.`}
              onPress={() => {
                this.props.checkRadioButton(this.props.thermostat.name);
              }}>
              <View
                style={[
                  styles.radioButton,
                  {
                    backgroundColor: this.props.thermostat.checked
                      ? 'rgba(0, 73, 117, 1)'
                      : 'rgba(164, 171, 179, 1)',
                  },
                ]}>
                {this.props.thermostat.checked ? (
                  <View style={styles.checkedRadioButton} />
                ) : null}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  bccPaddingVertical: {
    paddingVertical: 30,
  },
  idsPaddingVertical: {
    paddingVertical: 10,
  },
  rowDirection1: {
    flexDirection: 'row',
    borderColor: 'rgba(223,223,223,1)',
    borderWidth: 1,
    marginVertical: 5,
    paddingVertical: 30,
  },
  rowDirection: {
    flexDirection: 'row',
  },
  columnDirection: {
    flexDirection: 'column',
  },
  boldText: {
    fontWeight: 'bold',
  },
  deviceType: {
    fontSize: 12,
    color: 'gray',
  },
  radioButton: {
    height: 24,
    width: 24,
    marginLeft: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedRadioButton: {
    height: 15,
    width: 15,
    borderRadius: 12,
    borderColor: 'blue',
    backgroundColor: 'white',
  },
  bccImageDimensions: {
    height: 100,
    width: 200,
    resizeMode: 'contain',
  },
  idsImageDimensions: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
});

export default DisplayThermostatDevice;
