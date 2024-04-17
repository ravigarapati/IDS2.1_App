import React, {useState, useEffect} from 'react';
import {View, Image, Text, Pressable} from 'react-native';
import {CustomText, Button} from '../components';
import {Dictionary} from '../utils/dictionary';
import {Typography, Colors} from '../styles';
import {getAccessToken} from '../store/actions/CommonActions';
import MINUSACTIVE from '../assets/images/MinusActive.svg';
import ADDACTIVE from '../assets/images/addActive.svg';

export default function BCCDashboardHome({
  styles,
  width,
  height,
  currentTemp,
  selectTemperature,
  selectedDevice,
  heatSelected,
  heating,
  coolSelected,
  cooling,
  divisor,
  plus,
  renderThermostatChart,
  updateTermperature,
  changedCooling,
  changedHeating,
  updatedSchedule,
  cancelScheduleChange,
  setUpdateSchedule,
  setChangedCooling,
  setChangedHeating,
  isFahrenheit,
  temperatureLimits,
  updateThermostatTemperature,
  currentCooling,
  currentHeating,
  setModeTemp,
  setHeating,
  setCooling,
  setCurrentHeating,
  setCurrentCooling,
  setHeatingTemp,
  setCoolingTemp,
  humidity,
  coolingTemp,
  heatingTemp,
  updateLockDevice,
  statusInterval,
  createStatusInterval,
  power,
  hold,
  setHold,
  pCool,
  pHeat,
  setAuxHold,
  setUpdateInfo,
  returnAuxValue,
  stopStatus,
  mode,
  lockedDevice,
  setLockCode,
  setLockedDevice,
  is24hrs,
  isOnSchedule,
}) {
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => {
    let accessToken = getAccessToken();
  }, []);

  let getHourString = () => {
    let hour = parseInt(selectedDevice.periodHour2);
    let finalHour = '';
    let hourFormat = 'AM';
    if (!is24hrs) {
      if (hour === 0) {
        hour = 12;
      }
      if (hour > 12) {
        hour -= 12;
        hourFormat = 'PM';
      }
      finalHour = hour < 10 ? '0' + hour.toString() : hour.toString();
    } else {
      finalHour = hour.toString();
    }

    let minute =
      selectedDevice.periodMinute2 === '0'
        ? `0${selectedDevice.periodMinute2}`
        : selectedDevice.periodMinute2;

    return `${finalHour}:${minute} ${!is24hrs ? hourFormat : ''}`;
  };

  return (
    <View>
      <View style={[styles.alignItemsCenter]}>
        {selectedDevice.isAccessoryAdded !== 2 ? (
          <>
            <CustomText
              allowFontScaling={true}
              style={{
                position: 'absolute',
                top: width * 0.22,
                left: width * 0.42,
              }}
              font={'bold'}
              size={18}
              color={'#94989C'}
              text={`${humidity ? humidity : ''}${humidity ? '%' : ''}`}
            />
            {humidity ? (
              <Image
                style={{
                  position: 'absolute',
                  left: width * 0.38,
                  top: width * 0.24,
                  resizeMode: 'stretch',
                  height: 13,
                  width: 10,
                }}
                source={require('./../assets/images/drop.png')}
              />
            ) : null}
          </>
        ) : null}
        {currentTemp ? (
          <View
            style={{
              position: 'absolute',
              top: width * 0.28,
              flexDirection: 'row',
            }}>
            <CustomText
              allowFontScaling={true}
              style={{position: 'relative'}}
              text={currentTemp}
              color={'#494949'}
              size={60}
            />
            <CustomText
              allowFontScaling={true}
              style={{position: 'relative', marginTop: 15}}
              font={'bold'}
              text={`°${selectTemperature()}`}
              color={'#494949'}
              size={18}
            />
          </View>
        ) : null}
        {lockedDevice && (
          <Pressable
            testID="unlockDevice"
            onPress={() => {
              //clearInterval(statusInterval);
              stopStatus();
              createStatusInterval();
              /*setTimeout(() => {
                createStatusInterval();
              }, 3000);*/
              updateLockDevice(
                {
                  deviceId: selectedDevice.macId,
                  lockDevice: false,
                  code: '',
                },
                () => {
                  setLockedDevice(false);
                  setLockCode('');
                  setUnlocked(true);
                },
              );

              setTimeout(() => {
                console.log(
                  '__________________________________________________________',
                );
                setUnlocked(false);
              }, 2000);
            }}
            style={{position: 'absolute', top: '8%', right: '5%', zIndex: 999}}>
            <Image source={require('./../assets/images/lock-closed.png')} />
          </Pressable>
        )}
        {unlocked && (
          <Pressable
            onPress={() => {}}
            style={{position: 'absolute', top: '8%', right: '5%', zIndex: 999}}>
            <Image source={require('./../assets/images/lock-opened.png')} />
          </Pressable>
        )}

        {mode === 3 && power ? (
          <Text style={{position: 'absolute', top: width * 0.5}}>
            <Text
              style={{
                fontSize: 21,
                fontFamily: Typography.FONT_FAMILY_BOLD,
                color: heatSelected ? '#C20B1E' : '#D1D1D1',
              }}>
              {heatingTemp}°
            </Text>
            <Text
              style={{
                fontSize: 21,
                fontFamily: Typography.FONT_FAMILY_BOLD,
                color: '#D1D1D1',
              }}>
              {' '}
              -{' '}
            </Text>
            <Text
              style={{
                fontSize: 21,
                fontFamily: Typography.FONT_FAMILY_BOLD,
                color: coolSelected ? '#00629A' : '#D1D1D1',
              }}>
              {coolingTemp}°
            </Text>
          </Text>
        ) : mode === 1 && power ? (
          <CustomText
            allowFontScaling={true}
            text={`${coolingTemp}°`}
            size={21}
            color={'#00629A'}
            font={'bold'}
            style={{position: 'absolute', top: width * 0.5}}
          />
        ) : (mode === 2 || mode === 4) && power ? (
          <CustomText
            allowFontScaling={true}
            text={`${heatingTemp}°`}
            size={21}
            color={'#C20B1E'}
            font={'bold'}
            style={{position: 'absolute', top: width * 0.5}}
          />
        ) : null}

        {renderThermostatChart()}

        {mode !== 0 && power && humidity ? (
          <View style={styles.controlsSection}>
            <Pressable
              testID="decreaseByMinusButton"
              accessible={true}
              accessibilityLabel={Dictionary.bccDashboard.decreaseTemperature}
              accessibilityHint={
                Dictionary.bccDashboard.increaseTemperatureButton
              }
              disabled={
                heatSelected === false && coolSelected === false && mode === 3
              }
              style={[
                styles.minusIconStyle,
                {
                  opacity:
                    heatSelected === false &&
                    coolSelected === false &&
                    mode === 3
                      ? 0.5
                      : 1,
                },
              ]}
              onPress={() => updateTermperature('substract')}>
              {/*<Image source={require('./../assets/images/minus.png')} />*/}
              <MINUSACTIVE fill={'#000'} />
            </Pressable>
            <Pressable
              testID="increaseByPlusButton"
              accessible={true}
              accessibilityLabel={
                Dictionary.bccDashboard.increaseTemperatureLabel
              }
              accessibilityHint={
                Dictionary.bccDashboard.increaseTemperatureHint
              }
              style={{
                opacity:
                  heatSelected === false && coolSelected === false && mode === 3
                    ? 0.5
                    : 1,
              }}
              disabled={
                heatSelected === false && coolSelected === false && mode === 3
              }
              onPress={() => updateTermperature('add')}>
              {/*<Image source={require('./../assets/images/add.png')} />*/}
              <ADDACTIVE fill={'#000'} />
            </Pressable>
          </View>
        ) : mode !== 0 && power && humidity ? (
          <View style={[styles.scheduleSection]}>
            <CustomText
              allowFontScaling={true}
              align="left"
              text={Dictionary.bccDashboard.systemIsOff}
              font={'medium'}
            />
          </View>
        ) : null}
        {isOnSchedule && mode !== 0 && power ? (
          changedCooling == false && changedHeating == false && hold === '0' ? (
            <View
              accessible={true}
              accessibilityLabel={`${Dictionary.bccDashboard.controlledBySchedule1} ${selectedDevice.modeName} ${Dictionary.bccDashboard.controlledBySchedule2}`}
              accessibilityHint={
                Dictionary.bccDashboard.controlledByScheduleHint
              }
              style={[
                styles.scheduleSection,
                {
                  flexDirection: 'row',
                  marginTop:
                    height <= 700
                      ? 17
                      : height > 700 && height <= 820
                      ? height * 0.04
                      : height > 820
                      ? height * 0.05
                      : 0,
                },
              ]}>
              <CustomText
                allowFontScaling={true}
                text={Dictionary.bccDashboard.controlledByScheduleText}
                font={'medium'}
              />
              <CustomText
                text={selectedDevice.modeName}
                allowFontScaling={true}
                font={'bold'}
              />
            </View>
          ) : updatedSchedule || hold === '2' ? (
            <View
              style={[
                styles.scheduleSection,
                {
                  alignItems: 'center',
                  marginTop:
                    height <= 700
                      ? 17
                      : height > 700 && height <= 820
                      ? height * 0.04
                      : height > 820
                      ? height * 0.05
                      : 0,
                },
              ]}>
              <View style={[styles.flexDirectionRow]} accessible={true}>
                <CustomText
                  allowFontScaling={true}
                  text={Dictionary.bccDashboard.holdAt}
                  font={'medium'}
                  align={'left'}
                />
                {mode === 2 || mode === 4 ? (
                  <CustomText
                    allowFontScaling={true}
                    accessibilityLabelText={`${heatingTemp}° ${
                      isFahrenheit ? 'F' : 'C'
                    }`}
                    color={Colors.metalicRed}
                    text={`${heatingTemp}° `}
                    font={'bold'}
                    align={'left'}
                  />
                ) : mode === 1 ? (
                  <CustomText
                    allowFontScaling={true}
                    color={Colors.mediumBlue}
                    text={`${coolingTemp}° `}
                    font={'bold'}
                    align={'left'}
                  />
                ) : (
                  <View style={{flexDirection: 'row'}}>
                    <CustomText
                      allowFontScaling={true}
                      color={Colors.metalicRed}
                      text={`${heatingTemp}° `}
                      font={'bold'}
                      align={'left'}
                    />
                    <CustomText
                      allowFontScaling={true}
                      color={Colors.mediumBlue}
                      text={`${coolingTemp}° `}
                      font={'bold'}
                      align={'left'}
                    />
                  </View>
                )}
              </View>

              <View>
                <Button
                  testID="cancelHold2"
                  type="secondary"
                  accessibilityHintText={Dictionary.bccDashboard.returnSetpoint}
                  commonStyle={{
                    paddingVertical: 5,
                    width: width * 0.2,
                  }}
                  text={Dictionary.button.cancel}
                  onPress={() => {
                    stopStatus();
                    setUpdateInfo(false);
                    cancelScheduleChange();
                    setUpdateSchedule(false);
                    setChangedCooling(false);
                    setChangedHeating(false);
                  }}
                />
              </View>
            </View>
          ) : (
            hold === '1' && (
              <View
                style={[
                  styles.scheduleChangeConfirmation,
                  {
                    flexDirection: 'column',
                    marginTop:
                      height <= 700
                        ? 17
                        : height > 700 && height <= 820
                        ? height * 0.04
                        : height > 820
                        ? height * 0.05
                        : 0,
                  },
                ]}>
                <View accessible={true} style={{flexDirection: 'row'}}>
                  {mode === 2 || mode === 4 ? (
                    <CustomText
                      allowFontScaling={true}
                      accessible={true}
                      accessibilityLabelText={`Heating: ${heatingTemp}°${
                        isFahrenheit ? 'F' : 'C'
                      }.`}
                      color={Colors.metalicRed}
                      text={`${heatingTemp}° `}
                      font={'bold'}
                      align={'left'}
                    />
                  ) : mode === 1 ? (
                    <CustomText
                      allowFontScaling={true}
                      accessible={true}
                      accessibilityLabelText={`Cooling: ${coolingTemp}°${
                        isFahrenheit ? 'F' : 'C'
                      }.`}
                      color={'#00629A'}
                      text={`${coolingTemp}° `}
                      font={'bold'}
                      align={'left'}
                    />
                  ) : (
                    <View style={{flexDirection: 'row'}}>
                      <CustomText
                        allowFontScaling={true}
                        accessible={true}
                        accessibilityLabelText={`Heating: ${heatingTemp}°${
                          isFahrenheit ? 'F' : 'C'
                        }.`}
                        color={Colors.metalicRed}
                        text={`${heatingTemp}° `}
                        font={'bold'}
                        align={'left'}
                      />
                      <CustomText
                        allowFontScaling={true}
                        accessible={true}
                        accessibilityLabelText={`Cooling: ${coolingTemp}°${
                          isFahrenheit ? 'F' : 'C'
                        }.`}
                        color={Colors.mediumBlue}
                        text={`${coolingTemp}° `}
                        font={'bold'}
                        align={'left'}
                      />
                    </View>
                  )}

                  <CustomText
                    allowFontScaling={true}
                    accessibilityLabelText={`${
                      Dictionary.bccDashboard.untilText
                    } ${selectedDevice.periodHour2}:${
                      selectedDevice.periodMinute2 === '0'
                        ? `0${selectedDevice.periodMinute2}`
                        : selectedDevice.periodMinute2
                    } hours.`}
                    text={`${
                      Dictionary.bccDashboard.untilText
                    } ${getHourString()}`}
                    font={'medium'}
                    align={'left'}
                  />
                </View>

                <View style={styles.flexDirectionRow}>
                  <Button
                    testID="holdButtonEqual1"
                    accessibilityHintText={Dictionary.bccDashboard.holdSetPoint}
                    type="primary"
                    style={{marginRight: 10}}
                    commonStyle={{
                      paddingVertical: 5,
                      width: width * 0.2,
                    }}
                    text={'Hold'}
                    onPress={() => {
                      stopStatus();
                      setUpdateInfo(false);
                      updateThermostatTemperature({
                        unit: selectedDevice.isFahrenheit ? 'F' : 'C',
                        deviceId: selectedDevice.macId,
                        temp:
                          mode === 2 || mode === 4
                            ? `${coolingTemp
                                .toFixed(1)
                                .toString()}-${Math.floor(
                                (heating - 30) / divisor + plus,
                              )
                                .toFixed(1)
                                .toString()}`
                            : mode === 1
                            ? `${Math.floor((cooling - 30) / divisor + plus)
                                .toFixed(1)
                                .toString()}-${heatingTemp
                                .toFixed(1)
                                .toString()}`
                            : `${Math.floor((cooling - 30) / divisor + plus)
                                .toFixed(1)
                                .toString()}-${Math.floor(
                                (heating - 30) / divisor + plus,
                              )
                                .toFixed(1)
                                .toString()}`,
                        hold: '2',
                      });
                      setUpdateSchedule(true);
                    }}
                  />
                  <Button
                    testID="cancelHold"
                    accessibilityHintText={
                      Dictionary.bccDashboard.returnSetpoint
                    }
                    type="secondary"
                    commonStyle={{
                      paddingVertical: 5,
                      width: width * 0.2,
                    }}
                    text={'Cancel'}
                    onPress={() => {
                      stopStatus();
                      setUpdateInfo(false);
                      switch (mode) {
                        case 2:
                        case 4:
                          setHeatingTemp(parseInt(pHeat));
                          setHeating(returnAuxValue(parseInt(pHeat)));
                          setCurrentHeating(-1);
                          setChangedHeating(false);
                          break;
                        case 1:
                          setCooling(returnAuxValue(parseInt(pCool)));
                          setCoolingTemp(parseInt(pCool));
                          setCurrentCooling(-1);
                          setChangedCooling(false);
                          break;
                        case 3:
                          setCooling(returnAuxValue(parseInt(pCool)));
                          setCoolingTemp(parseInt(pCool));
                          setChangedCooling(false);
                          setHeatingTemp(parseInt(pHeat));
                          setHeating(returnAuxValue(parseInt(pHeat)));
                          setChangedHeating(false);

                          break;
                      }

                      updateThermostatTemperature({
                        unit: selectedDevice.isFahrenheit ? 'F' : 'C',
                        deviceId: selectedDevice.macId,
                        temp:
                          mode === 2 || mode === 4
                            ? `${parseInt(selectedDevice.coolingTemp)
                                .toFixed(1)
                                .toString()}-${Math.floor(pHeat)
                                .toFixed(1)
                                .toString()}`
                            : mode === 1
                            ? `${Math.floor(pCool)
                                .toFixed(1)
                                .toString()}-${parseInt(
                                selectedDevice.heatingTemp,
                              )
                                .toFixed(1)
                                .toString()}`
                            : `${Math.floor(pCool)
                                .toFixed(1)
                                .toString()}-${Math.floor(pHeat)
                                .toFixed(1)
                                .toString()}`,
                        hold: '0',
                      });
                      setUpdateSchedule(false);
                      setHold('0');
                      setAuxHold(false);
                      setChangedCooling(false);
                      setChangedHeating(false);
                    }}
                  />
                </View>
              </View>
            )
          )
        ) : null}
      </View>
    </View>
  );
}
