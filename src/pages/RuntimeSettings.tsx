import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import {BoschIcon, CustomText, Button, ModalComponent} from '../components';
import {Icons} from '../utils/icons';
import {Colors} from '../styles';
import {Dictionary} from '../utils/dictionary';

import RuntimeImage from './../assets/images/runtimeColor.svg';
import SunImage from './../assets/images/sun.svg';
import IceImage from './../assets/images/ice.svg';
import AirFilterImage from './../assets/images/airFilter.svg';
import RuntimeOption from '../components/RuntimeOption';
import CustomWheelPicker from '../components/CustomWheelPicker';
import {
  getRuntimeSettings,
  resetRunTime,
  setupRunTime,
} from '../store/actions/HomeOwnerActions';
import {connect, useDispatch} from 'react-redux';
import moment from 'moment/moment';
import { CustomWheelPick } from '../components/CustomWheelPick';
const TIME_ICON = require('./../assets/images/Clock.png');

const RuntimeSettings = ({navigation, selectedDevice}) => {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [heatDate, setHeatDate] = useState('');
  const [coolDate, setCoolDate] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const [heatTime, setHeatTime] = useState('');
  const [coolTime, setCoolTime] = useState('');
  const [filterTime, setFilterTime] = useState('');

  const [days, setDays] = useState('');

  const dispatch = useDispatch();

  const [daysValues, setDaysValues] = useState(
    Array.from({length: (120 - 15) / 15 + 1}, (_, i) => `${15 + i * 15} days`),
  );

  const openModal = () => {
    setModalIsVisible(true);
  };

  const closeModal = () => {
    setModalIsVisible(false);
  };

  const OnPressResetHeatingTime = async () => {
    await resetRunTimeFunction('1');
    DelayLoadValues();
  };

  const OnPressResetCoolingTime = async () => {
    await resetRunTimeFunction('2');
    DelayLoadValues();
  };

  const OnPressResetAirFilterTime = async () => {
    await resetRunTimeFunction('3');
    DelayLoadValues();
  };

  function toHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return {hours, minutes};
  }

  function resetRunTimeFunction(value) {
    return new Promise((resolve, reject) => {
      /* istanbul ignore next */ dispatch(
        resetRunTime(selectedDevice.macId, value, response => {
          resolve();
        }),
      );
    });
  }

  function loadRunTimeValues() {
    return new Promise((resolve, reject) => {
      /* istanbul ignore next */ dispatch(
        getRuntimeSettings(selectedDevice.macId, response => {
          let heatingDate = response.heat;
          heatingDate = moment()
            .add(heatingDate, 'minutes')
            .format('DD-MMM-YYYY');
          heatingDate = heatingDate.replace('-', ' ');
          heatingDate = heatingDate.replace('-', ' ');
          let heatTime = toHoursAndMinutes(response.heat);
          setHeatTime(heatTime.hours + ' Hrs ' + heatTime.minutes + ' Mins');
          setHeatDate(heatingDate);

          let coolingDate = response.cool;
          coolingDate = moment()
            .add(coolingDate, 'minutes')
            .format('DD-MMM-YYYY');
          coolingDate = coolingDate.replace('-', ' ');
          coolingDate = coolingDate.replace('-', ' ');
          let coolTime = toHoursAndMinutes(response.cool);
          setCoolTime(coolTime.hours + ' Hrs ' + coolTime.minutes + ' Mins');
          setCoolDate(coolingDate);

          let filterDate = response.filter;
          filterDate = moment()
            .add(filterDate, 'minutes')
            .format('DD-MMM-YYYY');
          filterDate = filterDate.replace('-', ' ');
          filterDate = filterDate.replace('-', ' ');
          let filterTime = toHoursAndMinutes(response.filter);
          setFilterTime(
            filterTime.hours + ' Hrs ' + filterTime.minutes + ' Mins',
          );
          setFilterDate(filterDate);

          setDays(response.filterday?response.filterday:'' + ' days');

          resolve();
        }),
      );
    });
  }

  const saveSetup = async () => {
    closeModal();
    await setupRunTimeFunction();
    DelayLoadValues();
  };

  function setupRunTimeFunction() {
    return new Promise((resolve, reject) => {
      let replacementTimePeriod = days.split(' ');
      let replacementTime = replacementTimePeriod[0];
      /* istanbul ignore next */ dispatch(
        setupRunTime(selectedDevice.macId, replacementTime, response => {
          resolve();
        }),
      );
    });
  }

  function DelayLoadValues() {
    dispatch({
      type: 'SHOW_LOADING',
      data: true,
    });
    setTimeout(() => {
      /* istanbul ignore next */ loadRunTimeValues();
    }, 1000);
  }

  useEffect(() => {
    loadRunTimeValues();
    let interval = setInterval(() => {
      loadRunTimeValues();
    }, 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'space-between',
      }}>
      <>
        <View style={styles.headerContainer}>
          <View style={styles.headerDivision}>
            <TouchableOpacity
              style={styles.headerBackButton}
              onPress={() => navigation.goBack()}>
              <BoschIcon
                name={Icons.backLeft}
                size={24}
                style={styles.marginHorizontal10}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.headerTitle}>
            <CustomText
              text={'Run Time'}
              size={21}
              allowFontScaling={true}
              font="medium"
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
      <ModalComponent
        testID="ModalSetup"
        modalVisible={modalIsVisible}
        closeModal={closeModal}
        blur={true}>
        <View style={{width: '100%'}}>
          <View
            style={{
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              marginBottom: 15,
            }}>
            <Pressable onPress={closeModal}>
              <BoschIcon name={Icons.close} size={30} />
            </Pressable>
          </View>
          <View>
            <View>
              <CustomWheelPick
                type={'picker'}
                testID="ReplacementTimePeriodWheel"
                blur={true}
                accessibilityHintText={'Replacement Time Period'}
                pickerWidth={'100%'}
                placeholder={'Replacement Time Period'}
                value={days}
                edit={true}
                isRequiredField={true}
                values={daysValues}
                defaultIndex={0}
                defaultValue={daysValues[0]}
                icon={TIME_ICON}
                onConfirm={selected => {
                  setDays(daysValues[selected ? selected['0'] : 0]);
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
                allowFontScaling={true}
                accessibilityLabelText={
                  'Air Filter in your system should be changed periodically.'
                }
                size={12}
                align="left"
                newline={true}
                text={
                  'Air Filter in your system should be changed periodically.'
                }
                style={[styles.flexShrink1, styles.paddingLeft5]}
              />
            </View>
          </View>
          <View>
            <Button
              testID="SaveSetupButton"
              type="primary"
              text={Dictionary.button.save}
              onPress={saveSetup}
            />
          </View>
          <View>
            <Button
              testID="CloseModalButton"
              type="secondary"
              text={Dictionary.button.close}
              onPress={closeModal}
            />
          </View>
        </View>
      </ModalComponent>
      <ScrollView>
        <View>
          <View style={{paddingHorizontal: 15}}>
            <View
              style={[
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 25,
                },
              ]}>
              <View style={{marginBottom: 15}}>
                <RuntimeImage width={75} height={75} fill="#000" />
              </View>
              <View style={{paddingHorizontal: 60}}>
                <CustomText
                  allowFontScaling={true}
                  color={Colors.black}
                  font={'regular'}
                  text={'View system run time and configure reminders'}
                  align={'center'}
                />
              </View>
            </View>
            <View>
              <RuntimeOption
                testIDReset="ResetHeatButton"
                Icon={SunImage}
                name={'Heating Time'}
                date={heatDate}
                time={heatTime}
                onPressButtonPrimary={OnPressResetHeatingTime}
              />
            </View>
            <View>
              <RuntimeOption
                testIDReset="ResetCoolButton"
                Icon={IceImage}
                name={'Cooling Time'}
                date={coolDate}
                time={coolTime}
                onPressButtonPrimary={OnPressResetCoolingTime}
              />
            </View>
            <View>
              <RuntimeOption
                testIDSetup="OpenSetup"
                testIDReset="ResetAirFilterButton"
                Icon={AirFilterImage}
                name={'Air Filter'}
                date={filterDate}
                time={filterTime}
                setup={true}
                onPressButtonSecondary={openModal}
                onPressButtonPrimary={OnPressResetAirFilterTime}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    selectedDevice: state.homeOwner.selectedDevice,
  };
};

export default connect(mapStateToProps)(RuntimeSettings);

const styles = StyleSheet.create({
  optionContainer: {
    borderBottomWidth: 1,
    borderColor: '#BFC0C2',
    paddingVertical: 25,
  },
  tipSection: {
    flexDirection: 'row',
    marginTop: 33,
  },
  flexShrink1: {
    flexShrink: 1,
  },
  paddingLeft5: {
    paddingLeft: 12,
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
