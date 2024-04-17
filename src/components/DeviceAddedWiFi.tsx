import React from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import CustomText from './CustomText';
import Button from './Button';
import FireImage from './../assets/images/deviceadded.svg';

import SUCCESS from '../assets/images/success.svg';

type DeviceAddedWiFiProps = {
  header?: string;
  description?: string;
  submit: any;
  deviceType?: string;
  cancelAction?: any;
};

const deviceHeight = Dimensions.get('window').height;

const DeviceAddedWiFi = ({
  header,
  description,
  submit,
  deviceType,
  cancelAction,
}: DeviceAddedWiFiProps) => {
  return (
    <View style={styles.flex1}>
      <View style={styles.container}>
        {header && (
          <View>
            <CustomText
              style={{
                marginTop: deviceHeight * 0.05,
              }}
              text={header}
              size={21}
              font={'medium'}
            />
          </View>
        )}
        <View
          style={{
            marginTop: deviceHeight * 0.07,
          }}>
          <SUCCESS />
        </View>
        {description && (
          <View>
            <CustomText
              style={{marginTop: deviceHeight * 0.03}}
              font={'regular'}
              text={description}
              size={16}
            />
          </View>
        )}
      </View>
      <View style={styles.buttonSection}>
        <Button
          testID="submitButton"
          type="primary"
          text={'Done'}
          onPress={submit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {
    //flex: 1,
    backgroundColor: 'white',
    height:'99%',
    justifyContent:'space-between',
  },
  container: {
    //flex: 1,
    //justifyContent: 'space-evenly',
    alignItems: 'center',
    marginHorizontal: 40,
  },
  buttonSection: {//flex: 1, 
    justifyContent: 'flex-end', marginBottom: 20},
});

export default DeviceAddedWiFi;
