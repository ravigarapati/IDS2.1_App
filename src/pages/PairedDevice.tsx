import React from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import CustomText from './../components/CustomText';
import Button from './../components/Button';

import SUCCESS from '../assets/images/success.svg';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {BoschIcon} from '../components';
import {Icons} from '../utils/icons';

type PairedDeviceProps = {
  header?: string;
  description?: string;
  submit: any;
  deviceType?: string;
  navigation: any;
};

const deviceHeight = Dimensions.get('window').height;

const PairedDevice = ({navigation}: PairedDeviceProps) => {
  const onBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.flex1}>
      <>
        <View style={styles.headerContainer}>
          <View style={styles.headerDivision}>
            <TouchableOpacity
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
            <CustomText
              text={`Pair ${
                navigation.getParam('deviceType').includes('BCC10')
                  ? 'Device'
                  : 'Unit'
              }`}
              size={21}
              style={{
                marginVertical: 8,
              }}
            />
          </View>
        </View>
        <Image
          style={styles.headerRibbon}
          source={require('../assets/images/header_ribbon.png')}
        />
      </>
      <View style={styles.container}>
        <View>
          <CustomText
            style={{
              marginTop: deviceHeight * 0.05,
            }}
            text={'Pairing Successful'}
            size={21}
            font={'medium'}
          />
        </View>
        <View
          style={{
            marginTop: deviceHeight * 0.07,
          }}>
          <SUCCESS />
        </View>
        <View>
          <CustomText
            style={{marginTop: deviceHeight * 0.03}}
            font={'regular'}
            text={`${
              navigation.getParam('deviceType').includes('BCC10')
                ? 'Thermostat'
                : 'Heat pump'
            } successfully paired\nto the ${
              !navigation.getParam('deviceType').includes('BCC10')
                ? 'Thermostat'
                : 'Heat pump'
            }`}
            size={16}
          />
        </View>
      </View>
      <View style={styles.buttonSection}>
        <Button
          type="primary"
          text={'Done'}
          onPress={() => {
            if (navigation.getParam('newDevice')) {
              navigation.navigate('addAnotherDevice');
            } else {
              navigation.navigate('Home');
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    //justifyContent: 'space-evenly',
    alignItems: 'center',
    marginHorizontal: 40,
  },
  buttonSection: {
    justifyContent: 'flex-end',
    marginBottom: 20,
    marginHorizontal: 16,
  },
  marginHorizontal10: {marginHorizontal: 10},
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
  },
  headerTitle: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 24,
  },
  headerRibbon: {height: 8, width: '100%'},
});

export default PairedDevice;
