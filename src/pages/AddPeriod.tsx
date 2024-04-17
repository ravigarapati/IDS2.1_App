import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Platform,
  Pressable,
  Dimensions,
} from 'react-native';
import {BoschIcon, Button} from '../components';
import {Icons} from '../utils/icons';
import {connect} from 'react-redux';
import CustomWheelPicker from '../components/CustomWheelPicker';
import {CustomWheelPick} from '../components/CustomWheelPick';
import {
  addPeriod,
  editPeriod,
  saveSchedule,
} from '../store/actions/HomeOwnerActions';
import {Dictionary} from '../utils/dictionary';

import CLOCK from '../assets/images/clock.svg';
import THERMOMETER from '../assets/images/temperature1.svg';
const height = Dimensions.get('screen').height;
function AddPeriod({
  navigation,
  addPeriod,
  scheduleInfo,
  editPeriod,
  saveSchedule,
  selectedDevice,
  selectedSchedule,
  _24HrsFormatSelected,
  isOnboardingBcc101,
}) {
  const validateFarenheit = () => {
    if (navigation.getParam('isOnboarding') !== undefined) {
      return true;
    } else {
      return selectedDevice.isFahrenheit;
    }
  };

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [starting, setStarting] = useState('');
  const [heat, setHeat] = useState('');
  const [heatTemp, setHeatTemp] = useState(validateFarenheit() ? [25] : [14]);
  const [coolTemp, setCoolTemp] = useState(validateFarenheit() ? [24] : [16]);
  const [startingDef, setStartingDef] = useState(
    _24HrsFormatSelected ? [0, 0] : [0, 0, 0],
  );
  const [cool, setCool] = useState('');
  const [currentPeriod, setCurrentPeriod] = useState(0);
  const [edit, setEdit] = useState(false);
  const [informationLoaded, setInformationLoaded] = useState(true);
  const [tempValues, setTempValues] = useState(
    validateFarenheit()
      ? Array.from({length: 55}, (_, i) => `${i + 45}°`)
      : Array.from({length: 32}, (_, i) => `${i + 7}°`),
  );
  const [hourValues, setHourValues] = useState(
    Array.from({length: _24HrsFormatSelected ? 24 : 13}, (_, i) =>
      i < 10 ? `0${i}` : `${i}`,
    ),
  );
  const [minuteValues, setMinuteValues] = useState(
    Array.from({length: 4}, (_, i) => (i === 0 ? `00` : `${i * 15}`)),
  );
  const [hourIndicator, setHourIndicator] = useState(['AM', 'PM']);
  const [coolTemps, setCoolTemps] = useState(
    validateFarenheit()
      ? Array.from({length: 46}, (_, i) => `${i + 54}°`)
      : Array.from(
          {
            length:
              7 + parseInt(selectedDevice.deadband) <= 12
                ? 27
                : 27 - (parseInt(selectedDevice.deadband) - 7),
          },
          (_, i) =>
            `${
              i +
              (7 + parseInt(selectedDevice.deadband) <= 12
                ? 12
                : 7 + parseInt(selectedDevice.deadband))
            }°`,
        ),
  );

  const [heatTemps, setHeatTemps] = useState(
    validateFarenheit()
      ? Array.from({length: 46}, (_, i) => `${i + 45}°`)
      : Array.from(
          {
            length:
              38 - parseInt(selectedDevice.deadband) >= 33
                ? 27
                : 27 - (parseInt(selectedDevice.deadband) - 5),
          },
          (_, i) => `${i + 7}°`,
        ),
    //Array.from({length: 27}, (_, i) => `${i + 7}°`),
  );
  const [deadband, setDeadband] = useState(navigation.getParam('isOnboarding')!==undefined ? 5 :  parseInt(selectedDevice.deadband));

  const [minutes, setMinutes] = useState(
    Array.from({length: 60}, (_, x) => `${x < 10 ? '0' + x : x}`),
  );
  const [hours12, setHours12] = useState(
    Array.from({length: 12}, (_, x) => `${x < 9 ? '0' + (x + 1) : x + 1}`),
  );
  const [hours24, setHours24] = useState(
    Array.from({length: 24}, (_, x) => `${x < 10 ? '0' + x : x}`),
  );
  const [hourFormat, setHourFormat] = useState(['AM', 'PM']);

  const onBack = () => {
    navigation.goBack();
  };

  const getSelectedTime = () => {
    let finalHour;
    let hour;
    let minutes;
    if (_24HrsFormatSelected) {
      const result = starting.split(':');
      hour = parseInt(result[0]);
      minutes = parseInt(result[1]);
    } else {
      const result = starting.split(':');
      const subresults = result[1].split(' ');
      hour = parseInt(result[0]);
      minutes = parseInt(subresults[0]);
      if (hour != 12) {
        if (subresults[1] === 'PM') {
          hour += 12;
        }
      } else {
        if (subresults[1] === 'AM') {
          hour = 0;
        } else {
          hour = 12;
        }
      }
    }
    finalHour = hour * 60 + minutes;
    return finalHour.toString();
  };

  useEffect(() => {
    /*console.log(selectedDevice.deadband)
    console.log('Is Onboarding')
    console.log(navigation.getParam('isOnboarding')!==undefined)
    console.log('HEAT TEMPS')
    console.log(heatTemps)
    if(heatTemps.length==0)
    {
      console.log('entra')
      setHeatTemps(
        validateFarenheit()
      ? Array.from({length: 46}, (_, i) => `${i + 45}°`)
      : Array.from(
          {
            length:
              38 - parseInt(selectedDevice.deadband) >= 33
                ? 27
                : 27 - (parseInt(selectedDevice.deadband) - 5),
          },
          (_, i) => `${i + 7}°`,
        ),
      )
    }
    console.log(heatTemps)*/
    setCurrentPeriod(navigation.getParam('newPeriod'));
    setSelectedIndex(navigation.getParam('selectedDay'));
    setEdit(navigation.state.params.edit);
    setHourValues(
      !_24HrsFormatSelected
        ? hourValues.slice(1, hourValues.length)
        : hourValues,
    );
    if (navigation.state.params.edit) {
      let timeIndicator = 'AM';
      const schedule =
        scheduleInfo[`items${navigation.state.params.selectedDay}`][
          navigation.state.params.newPeriod - 1
        ];
      const temps = schedule.t.split('-');
      setCool(temps[0].split('.')[0] + '°');
      setHeat(temps[1].split('.')[0] + '°');

      let currentStarting = parseInt(schedule.h) / 60;
      let ccurrentMinutes = currentStarting - Math.floor(currentStarting);
      if (!_24HrsFormatSelected) {
        if (parseInt(schedule.h) > 720) {
          timeIndicator = 'PM';
          if (currentStarting > 12) {
            currentStarting -= 12;
          }
        }
        if (Math.floor(currentStarting) == 0) {
          currentStarting = 12;
        }
      }

      setStarting(
        `${Math.floor(currentStarting) < 10 ? '0' : ''}${Math.floor(
          currentStarting,
        )}:${60 * ccurrentMinutes === 0 ? '0' : ''}${60 * ccurrentMinutes} ${
          _24HrsFormatSelected ? '' : timeIndicator
        }`,
      );
    }
  }, []);

  useState(() => {
    if (navigation.state.params.edit && informationLoaded) {
      let bigger = false;
      const schedule =
        scheduleInfo[`items${navigation.state.params.selectedDay}`][
          navigation.state.params.newPeriod - 1
        ];
      const temps = schedule.t.split('-');
      let wasntAdded = false;
      let auxCool = temps[1].split('.')[0] + '°';
      let y = 0;
      let newCoolTemps = [];
      let newDeadband = deadband - 1;
      tempValues.forEach(t => {
        if (t.includes(auxCool)) {
          //setCoolTemp(y);

          newCoolTemps = [
            ...tempValues.slice(y + 1 + newDeadband, tempValues.length),
          ];
          if (validateFarenheit()) {
            if (parseInt([...tempValues.slice(0, y + 1)][y]) < 54) {
              if (
                parseInt([...tempValues.slice(0, y + 1)][y]) <
                54 - newDeadband
              ) {
                let newIndex = tempValues.indexOf('54°');
                newCoolTemps = [
                  ...tempValues.slice(newIndex, tempValues.length),
                ];
              }
            }
          } else {
            if (parseInt([...tempValues.slice(0, y + 1)][y]) < 12) {
              if (
                parseInt([...tempValues.slice(0, y + 1)][y]) <
                12 - newDeadband
              ) {
                let newIndex = tempValues.indexOf('12°');
                newHeatTemps = [
                  ...tempValues.slice(newIndex, tempValues.length),
                ];
              }
            }
          }
        }
        y++;
      });
      setCoolTemps(newCoolTemps);

      let i = 0;
      newCoolTemps.forEach(t => {
        if (t.includes(temps[0].split('.')[0] + '°')) {
          setCoolTemp(i);
          wasntAdded = true;
        }
        i++;
      });
      if (!wasntAdded) {
        setCoolTemp(0);
      }
    }
  }, [cool]);

  useState(() => {
    if (navigation.state.params.edit && informationLoaded) {
      setInformationLoaded(false);
      const schedule =
        scheduleInfo[`items${navigation.state.params.selectedDay}`][
          navigation.state.params.newPeriod - 1
        ];
      let wasntAdded = false;
      const temps = schedule.t.split('-');
      let i = 0;

      let y = 0;
      let newHeatTemps = [];
      let auxHeat = temps[0].split('.')[0] + '°';
      let newDeadband = deadband - 1;

      tempValues.forEach(t => {
        if (t.includes(auxHeat)) {
          //setHeatTemp(y);
          //setCoolTemp(y);
          newHeatTemps = [...tempValues.slice(0, y - newDeadband)];

          if (validateFarenheit()) {
            if (parseInt([...tempValues.slice(0, y + 1)][y]) > 90) {
              if (
                parseInt([...tempValues.slice(0, y + 1)][y]) >
                90 + newDeadband
              ) {
                let newIndex = tempValues.indexOf('90°');
                newHeatTemps = [...tempValues.slice(0, newIndex + 1)];
              }
            }
          } else {
            if (parseInt([...tempValues.slice(0, y + 1)][y]) > 33) {
              if (
                parseInt([...tempValues.slice(0, y + 1)][y]) >
                33 + newDeadband
              ) {
                let newIndex = tempValues.indexOf('33°');
                newCoolTemps = [...tempValues.slice(0, newIndex + 1)];
              }
            }
          }
        }
        y++;
      });
      setHeatTemps(newHeatTemps);

      newHeatTemps.forEach(t => {
        if (t.includes(temps[1].split('.')[0] + '°')) {
          setHeatTemp(i);
          wasntAdded = true;
        }
        i++;
      });
      if (!wasntAdded) {
        setHeatTemp(0);
      }
    }
  }, [heat]);

  useState(() => {
    if (navigation.state.params.edit) {
      let values = [0, 0, 0];
      const schedule =
        scheduleInfo[`items${navigation.state.params.selectedDay}`][
          navigation.state.params.newPeriod - 1
        ];
      let timeIndicator = 'AM';
      let currentStarting = parseInt(schedule.h) / 60;
      let currentMinutes = currentStarting - Math.floor(currentStarting);
      if (!_24HrsFormatSelected) {
        if (parseInt(schedule.h) > 720) {
          timeIndicator = 'PM';
          if (parseInt(schedule.h) > 720) {
            currentStarting -= 12;
          }
        }
        if (Math.floor(currentStarting) == 0) {
          currentStarting = 12;
        }
      }

      let hourIndex = hourValues.indexOf(
        `${Math.floor(currentStarting) < 10 ? '0' : ''}${Math.floor(
          currentStarting,
        )}`,
      );
      if (!_24HrsFormatSelected && hourIndex != -1) {
        hourIndex--;
      }

      let minuteIndex = minuteValues.indexOf(`${60 * currentMinutes}`);

      let indicatorIndex = hourIndicator.indexOf(timeIndicator);

      if (hourIndex != -1) values[0] = hourIndex;

      if (minuteIndex != -1) values[1] = minuteIndex;

      if (indicatorIndex != -1 && !_24HrsFormatSelected)
        values[2] = indicatorIndex;

      setStartingDef(values);
    }
  }, [starting]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <>
        <View style={styles.headerContainer}>
          <View style={styles.headerDivision}>
            <TouchableOpacity
              style={styles.headerBackButton}
              testID="goBack"
              onPress={() => {
                if (!isOnboardingBcc101) {
                  onBack();
                } else {
                  navigation.navigate('configureScheduleOnboarding',{
                    isOnboarding:true,
                    mode:navigation.getParam('mode')
                  });
                }
              }}>
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
              {`Period ${currentPeriod}`}
            </Text>
          </View>
        </View>
        <Image
          style={styles.headerRibbon}
          source={require('../assets/images/header_ribbon.png')}
        />
      </>
      <View
        style={{
          flexDirection: 'column',
          marginHorizontal: 16,
          marginTop: 16,
          height: height * 0.83,
          justifyContent: 'space-between',
        }}>
        <View>
          <CustomWheelPick
            type={'starting'}
            formatTime12Hrs={!_24HrsFormatSelected}
            placeholder={'Starting'}
            isSvgIcon={true}
            value={starting}
            icon={<CLOCK fill="#000" />}
            disabled={false}
            edit={starting !== ''}
            onConfirm={res => {
              console.log('res', res);

              //const dateLabel = new Date(date).toLocaleDateString('sv');
              let isAMPM = 0;
              let datetime = '';
              if (_24HrsFormatSelected) {
                datetime = hours24[res[0]] + ':' + minutes[res[1]];
                if (res[0] >= 12) {
                  isAMPM = 0;
                } else {
                  isAMPM = 1;
                }
              } else {
                isAMPM = res[2] !== undefined && res[2] === 0 ? 1 : 0;
                datetime =
                  hours12[res[0]] +
                  ':' +
                  minutes[res[1]] +
                  ' ' +
                  (isAMPM === 0 ? 'PM' : 'AM');
              }

              setStarting(datetime);
            }}
          />

          {/*<CustomWheelPicker
            accessibilityHintText={
              Dictionary.bccDashboard.schedule.startingLabel
            }
            edit={navigation.state.params.edit}
            pickerWidth={_24HrsFormatSelected ? '49%' : '33%'}
            placeholder={Dictionary.bccDashboard.schedule.starting}
            value={starting}
            isRequiredField={true}
            values={
              _24HrsFormatSelected
                ? [hourValues, minuteValues]
                : [hourValues, minuteValues, hourIndicator]
            }
            isSvgIcon={true}
            icon={<CLOCK fill="#000" />}
            defaultValue={startingDef}
            accessibilityWheelPickerValue={[
              'the hour',
              'minutes',
              'hour format',
            ]}
            defaultValueZero={true}
            onConfirm={selected => {
              console.log('selected', selected);
              console.log(
                'new starging',
                `${hourValues[selected['0']]}:${minuteValues[selected['1']]} ${
                  _24HrsFormatSelected ? '' : hourIndicator[selected['2']]
                }`,
              );
              setStarting(
                `${hourValues[selected['0']]}:${minuteValues[selected['1']]} ${
                  _24HrsFormatSelected ? '' : hourIndicator[selected['2']]
                }`,
              );
            }}
          />*/}
          <View style={{marginVertical: 16}}>
            <CustomWheelPick
              type={'picker'}
              formatTime12Hrs={true}
              placeholder={'Heat'}
              isSvgIcon={true}
              value={heat}
              icon={<THERMOMETER fill="#000" />}
              disabled={false}
              edit={heat !== ''}
              values={heatTemps}
              defaultValue={
                navigation.state.params.edit ? heat : heatTemps[heatTemp[0]]
              }
              defaultIndex={
                navigation.state.params.edit
                  ? heatTemps.indexOf(heat)
                  : heatTemp[0]
              }
              onConfirm={res => {
                setHeat(heatTemps[res && res['0'] != -1 ? res['0'] : heatTemp]);
                let newDeadband = deadband - 1;
                let newCoolTemps =
                  tempValues.indexOf(
                    heatTemps[res && res['0'] != -1 ? res['0'] : heatTemp],
                  ) + newDeadband;
                if (validateFarenheit()) {
                  if (
                    parseInt(
                      heatTemps[res && res['0'] != -1 ? res['0'] : heatTemp],
                    ) < 54
                  ) {
                    if (
                      parseInt(
                        heatTemps[res && res['0'] != -1 ? res['0'] : heatTemp],
                      ) <
                      54 - newDeadband
                    ) {
                      newCoolTemps = tempValues.indexOf('53°');
                    }
                  }
                } else {
                  if (
                    parseInt(
                      heatTemps[res && res['0'] != -1 ? res['0'] : heatTemp],
                    ) < 12
                  ) {
                    if (
                      parseInt(
                        heatTemps[res && res['0'] != -1 ? res['0'] : heatTemp],
                      ) <
                      12 - newDeadband
                    ) {
                      newCoolTemps = tempValues.indexOf('11°');
                    }
                  }
                }
                setHeatTemp(res && res['0'] != -1 ? [res['0']] : heatTemp);
                let aux = tempValues.slice(
                  newCoolTemps + 1 /*+ deadband - 1*/,
                  tempValues.length,
                );
                let index = aux.indexOf(coolTemps[coolTemp]);
                setCoolTemp(index !== -1 ? [index] : [0]);
                setCoolTemps(aux);
              }}
            />

            {/*<CustomWheelPicker
              testID={'heatConfirmButton'}
              accessibilityHintText={Dictionary.bccDashboard.schedule.heatLabel}
              edit={navigation.state.params.edit}
              pickerWidth={'100%'}
              placeholder={Dictionary.bccDashboard.schedule.heat}
              value={heat}
              isRequiredField={true}
              values={[heatTemps]}
              defaultValue={heatTemp}
              isSvgIcon={true}
              icon={<THERMOMETER fill="#000" />}
              accessibilityWheelPickerValue={['heating degrees']}
              defaultValueZero={false}
              onConfirm={selected => {
                console.log('selected', selected);
                setHeat(heatTemps[selected ? selected['0'] : heatTemp[0]]);
                let newDeadband = deadband - 1;
                let newCoolTemps =
                  tempValues.indexOf(
                    heatTemps[selected ? selected['0'] : heatTemp[0]],
                  ) + newDeadband;
                if (validateFarenheit()) {
                  if (
                    parseInt(
                      heatTemps[selected ? selected['0'] : heatTemp[0]],
                    ) < 54
                  ) {
                    if (
                      parseInt(
                        heatTemps[selected ? selected['0'] : heatTemp[0]],
                      ) <
                      54 - newDeadband
                    ) {
                      newCoolTemps = tempValues.indexOf('53°');
                    }
                  }
                } else {
                  if (
                    parseInt(
                      heatTemps[selected ? selected['0'] : heatTemp[0]],
                    ) < 12
                  ) {
                    if (
                      parseInt(
                        heatTemps[selected ? selected['0'] : heatTemp[0]],
                      ) <
                      12 - newDeadband
                    ) {
                      newCoolTemps = tempValues.indexOf('11°');
                    }
                  }
                }
                setHeatTemp(selected ? [selected['0']] : heatTemp);
                let aux = tempValues.slice(
                  newCoolTemps + 1 + deadband - 1,
                  tempValues.length,
                );
                let index = aux.indexOf(coolTemps[coolTemp[0]]);
                setCoolTemp(index !== -1 ? [index] : [0]);
                setCoolTemps(aux);
              }}
            />*/}
          </View>

          <CustomWheelPick
            type={'picker'}
            formatTime12Hrs={true}
            placeholder={'Cool'}
            isSvgIcon={true}
            value={cool}
            icon={<THERMOMETER fill="#000" />}
            disabled={false}
            edit={cool !== ''}
            values={coolTemps}
            defaultValue={coolTemps[coolTemp[0]]}
            defaultIndex={coolTemp[0]}
            onConfirm={res => {
              console.log('res', res);

              setCool(coolTemps[res && res['0'] != -1 ? res['0'] : coolTemp]);
              setCoolTemp(res && res['0'] != -1 ? [res['0']] : coolTemp);

              let newDeadband = deadband - 1;
              let newHeatTemps =
                tempValues.indexOf(
                  coolTemps[res && res['0'] != -1 ? res['0'] : coolTemp],
                ) - newDeadband;
              if (validateFarenheit()) {
                if (
                  parseInt(
                    coolTemps[res && res['0'] != -1 ? res['0'] : coolTemp],
                  ) > 90
                ) {
                  if (
                    parseInt(
                      coolTemps[res && res['0'] != -1 ? res['0'] : coolTemp],
                    ) >
                    90 + newDeadband
                  ) {
                    newHeatTemps = tempValues.indexOf('91°');
                  }
                }
              } else {
                if (
                  parseInt(
                    coolTemps[res && res['0'] != -1 ? res['0'] : coolTemp],
                  ) > 33
                ) {
                  if (
                    parseInt(
                      coolTemps[res && res['0'] != -1 ? res['0'] : coolTemp],
                    ) >
                    33 + newDeadband
                  ) {
                    newHeatTemps = tempValues.indexOf('34°');
                  }
                }
              }

              let aux = tempValues.slice(0, newHeatTemps);
              let index = aux.indexOf(heatTemps[heatTemp]);
              setHeatTemp(index !== -1 ? [index] : [0]);

              setHeatTemps(tempValues.slice(0, newHeatTemps));
            }}
          />

          {/*<CustomWheelPicker
            testID={'coolConfirmButton'}
            accessibilityHintText={Dictionary.bccDashboard.schedule.coolLabel}
            edit={navigation.state.params.edit}
            pickerWidth={'100%'}
            placeholder={Dictionary.bccDashboard.schedule.cool}
            value={cool}
            isRequiredField={true}
            values={[coolTemps]}
            isSvgIcon={true}
            icon={<THERMOMETER fill="#000" />}
            defaultValue={coolTemp}
            defaultValueZero={false}
            accessibilityWheelPickerValue={['cooling degrees']}
            onConfirm={selected => {
              //setHeat(heatValues[selectedIndex])
              setCool(coolTemps[selected ? selected['0'] : coolTemp[0]]);
              setCoolTemp(selected ? [selected['0']] : coolTemp);

              let newDeadband = deadband - 1;
              let newHeatTemps =
                tempValues.indexOf(
                  coolTemps[selected ? selected['0'] : coolTemp[0]],
                ) - newDeadband;
              if (validateFarenheit()) {
                if (
                  parseInt(coolTemps[selected ? selected['0'] : coolTemp[0]]) >
                  90
                ) {
                  if (
                    parseInt(
                      coolTemps[selected ? selected['0'] : coolTemp[0]],
                    ) >
                    90 + newDeadband
                  ) {
                    newHeatTemps = tempValues.indexOf('91°');
                  
                  }
                }
              } else {
                if (
                  parseInt(coolTemps[selected ? selected['0'] : coolTemp[0]]) >
                  33
                ) {
                  if (
                    parseInt(
                      coolTemps[selected ? selected['0'] : coolTemp[0]],
                    ) >
                    33 + newDeadband
                  ) {
                    newHeatTemps = tempValues.indexOf('34°');
                  }
                }
              }

              let aux = tempValues.slice(0, newHeatTemps);
              let index = aux.indexOf(heatTemps[heatTemp[0]]);
              setHeatTemp(index !== -1 ? [index] : [0]);
             
              setHeatTemps(tempValues.slice(0, newHeatTemps));
              //let auxCools = tempValues.indexOf(tempValues[selected['0']]);
              //setHeatTemps(tempValues.slice(0, auxCools));
            }}
          />*/}
        </View>
        <View>
          <Button
            disabled={starting === '' || heat === '' || cool === ''}
            accessibilityLabelText={`Done. ${
              starting === '' && heat === '' && cool === ''
                ? 'Currently disabled, you need to set the needed information before continue.'
                : ''
            }`}
            text={'Done'}
            type={'primary'}
            testID="submit"
            onPress={() => {
              if (edit) {
                let alreadyExisting = false;
                let newScheduleInfo = JSON.parse(JSON.stringify(scheduleInfo));

                if (
                  newScheduleInfo[`items${selectedIndex}`].filter(
                    t => t.h === getSelectedTime(),
                  ).length != 0
                ) {
                  let timeToUpdate =
                    newScheduleInfo[`items${selectedIndex}`][currentPeriod - 1]
                      .h;
                  let newArray = [];
                  alreadyExisting = true;
                  newScheduleInfo[`items${selectedIndex}`].forEach(e => {
                    if (e.h !== getSelectedTime()) {
                      newArray.push(e);
                    }
                  });

                  let currentIndex = newArray.findIndex(
                    e => e.h === timeToUpdate,
                  );
                  if (timeToUpdate != getSelectedTime()) {
                    newArray[currentIndex] = {
                      c: '0',
                      t: `${cool.replace('°', '')}.0-${heat.replace(
                        '°',
                        '',
                      )}.0`,
                      h: getSelectedTime(),
                    };
                  } else {
                    newArray.push({
                      c: '0',
                      t: `${cool.replace('°', '')}.0-${heat.replace(
                        '°',
                        '',
                      )}.0`,
                      h: getSelectedTime(),
                    });
                  }

                  newScheduleInfo[`items${selectedIndex}`] = newArray;
                } else {
                  newScheduleInfo[`items${selectedIndex}`][currentPeriod - 1] =
                    {
                      c: '0',
                      t: `${cool.replace('°', '')}.0-${heat.replace(
                        '°',
                        '',
                      )}.0`,
                      h: getSelectedTime(),
                    };
                }

                saveSchedule(
                  {
                    deviceId: selectedDevice.macId,
                    modelId: selectedDevice.schedules.filter(
                      s => s.model_id === selectedSchedule,
                    )[0].model_id,
                    mode: selectedDevice.mode,
                    state: selectedDevice.schedules.filter(
                      s => s.model_id === selectedSchedule,
                    )[0].state,
                    limit: selectedDevice.schedules.filter(
                      s => s.model_id === selectedSchedule,
                    )[0].limit,
                    name: selectedDevice.schedules.filter(
                      s => s.model_id === selectedSchedule,
                    )[0].name,
                    unit: validateFarenheit() ? 'F' : 'C',
                    data: newScheduleInfo,
                  },
                  () => {
                    editPeriod({
                      selected: selectedIndex,
                      periodNumber: currentPeriod - 1,
                      info: {
                        c: '0',
                        t: `${cool.replace('°', '')}.0-${heat.replace(
                          '°',
                          '',
                        )}.0`,
                        h: getSelectedTime(),
                      },
                      alreadyExisting: alreadyExisting,
                      scheduleInfo: newScheduleInfo,
                    });
                  },
                );
              } else {
                let alreadyExisting = false;
                let newScheduleInfo = JSON.parse(JSON.stringify(scheduleInfo));
                if (
                  newScheduleInfo[`items${selectedIndex}`].filter(
                    t => t.h === getSelectedTime(),
                  ).length != 0
                ) {
                  alreadyExisting = true;
                  newScheduleInfo[`items${selectedIndex}`].forEach(e => {
                    if (e.h === getSelectedTime()) {
                      e.t = `${cool.replace('°', '')}.0-${heat.replace(
                        '°',
                        '',
                      )}.0`;
                    }
                  });
                } else {
                  newScheduleInfo[`items${selectedIndex}`].push({
                    c: '0',
                    t: `${cool.replace('°', '')}.0-${heat.replace('°', '')}.0`,
                    h: getSelectedTime(),
                  });
                }

                saveSchedule(
                  {
                    deviceId: selectedDevice.macId,
                    modelId: selectedDevice.schedules.filter(
                      s => s.model_id === selectedSchedule,
                    )[0].model_id,
                    mode: selectedDevice.mode,
                    state: selectedDevice.schedules.filter(
                      s => s.model_id === selectedSchedule,
                    )[0].state,
                    limit: selectedDevice.schedules.filter(
                      s => s.model_id === selectedSchedule,
                    )[0].limit,
                    name: selectedDevice.schedules.filter(
                      s => s.model_id === selectedSchedule,
                    )[0].name,
                    unit: validateFarenheit() ? 'F' : 'C',
                    data: newScheduleInfo,
                  },
                  () => {
                    addPeriod({
                      selected: selectedIndex,
                      info: {
                        c: '0',
                        t: `${cool.replace('°', '')}.0-${heat.replace(
                          '°',
                          '',
                        )}.0`,
                        h: getSelectedTime(),
                      },
                      alreadyExisting: alreadyExisting,
                    });
                  },
                );
              }
              if (!isOnboardingBcc101) {
                navigation.navigate('ScheduleConfiguration');
              } else {
                navigation.navigate('configureScheduleOnboarding',{
                    isOnboarding:true,
                    mode:navigation.getParam('mode')
                  
                });
              }
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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

const mapStateToProps = state => {
  return {
    scheduleInfo: state.homeOwner.scheduleInfo,
    selectedDevice: state.homeOwner.selectedDevice,
    selectedSchedule: state.homeOwner.selectedSchedule,
    //true,
    _24HrsFormatSelected:
      state.homeOwner.selectedDevice.d_hour === '0' ? false : true,
    isOnboardingBcc101: state.homeOwner.isOnboardingBcc101,
  };
};

const mapDispatchToProps = {
  addPeriod,
  editPeriod,
  saveSchedule,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddPeriod);
