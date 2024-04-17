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
import {BoschIcon, Button} from '../../components';
import {Icons} from '../../utils/icons';
import {connect, useDispatch} from 'react-redux';
import CustomWheelPicker from '../../components/CustomWheelPicker';
import {
  addPeriod,
  addPeriodOnBoarding,
  editPeriod,
  editPeriodOnBoarding,
  saveSchedule,
} from '../../store/actions/HomeOwnerActions';
import {Dictionary} from '../../utils/dictionary';

import CLOCK from '../../assets/images/clock.svg';
import THERMOMETER from '../../assets/images/temperature1.svg';
import { CustomWheelPick } from '../../components/CustomWheelPick';
const height = Dimensions.get('screen').height;
function AddPeriodOnBoarding({
  navigation,
  addPeriod,
  editPeriod,
  saveSchedule,
  selectedDevice,
  selectedSchedule,
  isFahrenheit,
  schedulesOnBoarding,
  infoUnitConfiguration,
}) {
  const is24Hours = infoUnitConfiguration.hours1224 == 1 ? true : false;
  const dispatch = useDispatch();
  const [scheduleInfo, setScheduleInfo] = useState(
    schedulesOnBoarding.filter(s => s.model_id === selectedSchedule)[0].data,
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [starting, setStarting] = useState('');
  const [heat, setHeat] = useState('');
  const [heatTemp, setHeatTemp] = useState([25]);
  const [coolTemp, setCoolTemp] = useState([24]);
  const [startingDef, setStartingDef] = useState(
    is24Hours ? [0, 0] : [0, 0, 0],
  );
  const [cool, setCool] = useState('');
  const [currentPeriod, setCurrentPeriod] = useState(0);
  const [edit, setEdit] = useState(false);
  const [tempValues, setTempValues] = useState(
    Array.from({length: 55}, (_, i) => `${i + 45}°`)
  );
  const [hourValues, setHourValues] = useState(
    Array.from({length: is24Hours ? 24 : 13}, (_, i) =>
      i < 10 ? `0${i}` : `${i}`,
    ),
  );
  const [minuteValues, setMinuteValues] = useState(
    Array.from({length: 4}, (_, i) => (i === 0 ? `00` : `${i * 15}`)),
  );
  const [hourIndicator, setHourIndicator] = useState(['AM', 'PM']);
  const [coolTemps, setCoolTemps] = useState(
      Array.from({length: 46}, (_, i) => `${i + 54}°`));

  const [heatTemps, setHeatTemps] = useState(
      Array.from({length: 46}, (_, i) => `${i + 45}°`)
  );
  const [deadband, setDeadband] = useState(5);

  const [minutes, setMinutes] = useState(
    Array.from({length: 60}, (_, x) => `${x < 10 ? '0' + x : x}`),
  );
  const [hours12, setHours12] = useState(
    Array.from({length: 12}, (_, x) => `${x < 9 ? '0' + (x + 1) : x + 1}`),
  );
  const [hours24, setHours24] = useState(
    Array.from({length: 24}, (_, x) => `${x < 10 ? '0' + x : x}`),
  );

  const onBack = () => {
    navigation.goBack();
  };

  const getSelectedTime = () => {
    const result = starting.split(':');
    const subresults = result[1].split(' ');
    let hour = parseInt(result[0]);
    let minutes = parseInt(subresults[0]);
    if (subresults[1] === 'PM') {
      hour += 12;
    }
    let finalHour = hour * 60 + minutes;
    return finalHour.toString();
  };

  useEffect(() => {
    console.log(hourValues);
    setCurrentPeriod(navigation.getParam('newPeriod'));
    setSelectedIndex(navigation.getParam('selectedDay'));
    setEdit(navigation.state.params.edit);
    setHourValues(
      !is24Hours ? hourValues.slice(1, hourValues.length) : hourValues,
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
      if (!is24Hours) {
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
          is24Hours ? '' : timeIndicator
        }`,
      );
    }
  }, []);

  useState(() => {
    if (navigation.state.params.edit) {
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
    if (navigation.state.params.edit) {
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
  
              if (parseInt([...tempValues.slice(0, y + 1)][y]) > 90) {
                if (
                  parseInt([...tempValues.slice(0, y + 1)][y]) >
                  90 + newDeadband
                ) {
                  let newIndex = tempValues.indexOf('90°');
                  newHeatTemps = [...tempValues.slice(0, newIndex + 1)];
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
      if (!is24Hours) {
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
      if (!is24Hours && hourIndex != -1) {
        hourIndex--;
      }

      let minuteIndex = minuteValues.indexOf(`${60 * currentMinutes}`);

      let indicatorIndex = hourIndicator.indexOf(timeIndicator);

      if (hourIndex != -1) values[0] = hourIndex;

      if (minuteIndex != -1) values[1] = minuteIndex;

      if (indicatorIndex != -1 && !is24Hours) values[2] = indicatorIndex;

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
              {`Period ${currentPeriod}`}
            </Text>
          </View>
        </View>
        <Image
          style={styles.headerRibbon}
          source={require('../../assets/images/header_ribbon.png')}
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
            formatTime12Hrs={!is24Hours}
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
              if (is24Hours) {
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
            testID="StartingButton"
            accessibilityHintText={
              Dictionary.bccDashboard.schedule.startingLabel
            }
            edit={navigation.state.params.edit}
            pickerWidth={is24Hours ? '49%' : '33%'}
            placeholder={Dictionary.bccDashboard.schedule.starting}
            value={starting}
            isRequiredField={true}
            values={
              is24Hours
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
              setStarting(
                `${hourValues[selected['0']]}:${minuteValues[selected['1']]} ${
                  is24Hours ? '' : hourIndicator[selected['2']]
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
                  newDeadband;
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
              testID="heatConfirmButton"
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
                setHeat(heatTemps[selected ? selected['0'] : heatTemp[0]]);
                let newDeadband = deadband - 1;
                let newCoolTemps =
                  tempValues.indexOf(
                    heatTemps[selected ? selected['0'] : heatTemp[0]],
                  ) + newDeadband;
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

              let aux = tempValues.slice(0, newHeatTemps);
              let index = aux.indexOf(heatTemps[heatTemp]);
              setHeatTemp(index !== -1 ? [index] : [0]);

              setHeatTemps(tempValues.slice(0, newHeatTemps));
            }}
          />

          {/*<CustomWheelPicker
            testID="CoolConfirmButton"
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
            onPress={() => {
              if (edit) {
                dispatch(
                  editPeriodOnBoarding({
                    selectedSchedule,
                    selected: selectedIndex,
                    periodNumber: currentPeriod - 1,
                    info: {
                      t: `${cool.replace('°', '')}.0-${heat.replace(
                        '°',
                        '',
                      )}.0`,
                      h: getSelectedTime(),
                      c: '0',
                    },
                  }),
                );

                /*saveSchedule({
                  deviceId: selectedDevice.macId,
                  modelId: schedulesOnBoarding.filter(
                    (s) => s.model_id === selectedSchedule,
                  )[0].model_id,
                  mode: selectedDevice.mode,
                  state: schedulesOnBoarding.filter(
                    (s) => s.model_id === selectedSchedule,
                  )[0].state,
                  limit: schedulesOnBoarding.filter(
                    (s) => s.model_id === selectedSchedule,
                  )[0].limit,
                  name: schedulesOnBoarding.filter(
                    (s) => s.model_id === selectedSchedule,
                  )[0].name,
                  unit: selectedDevice.isFahrenheit ? 'F' : 'C',
                  data: scheduleInfo,
                });*/
              } else {
                dispatch(
                  addPeriodOnBoarding({
                    selectedSchedule,
                    selected: selectedIndex,
                    info: {
                      t: `${cool.replace('°', '')}.0-${heat.replace(
                        '°',
                        '',
                      )}.0`,
                      h: getSelectedTime(),
                      c: '0',
                    },
                  }),
                );
                /* saveSchedule({
                  deviceId: selectedDevice.macId,
                  modelId: schedulesOnBoarding.filter(
                    (s) => s.model_id === selectedSchedule,
                  )[0].model_id,
                  mode: selectedDevice.mode,
                  state: schedulesOnBoarding.filter(
                    (s) => s.model_id === selectedSchedule,
                  )[0].state,
                  limit: schedulesOnBoarding.filter(
                    (s) => s.model_id === selectedSchedule,
                  )[0].limit,
                  name: schedulesOnBoarding.filter(
                    (s) => s.model_id === selectedSchedule,
                  )[0].name,
                  unit: selectedDevice.isFahrenheit ? 'F' : 'C',
                  data: scheduleInfo,
                });*/
              }

              navigation.goBack();
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
    isFahrenheit: state.homeOwner.actualWeatherOnFahrenheit,
    selectedDevice: state.homeOwner.selectedDevice,
    selectedSchedule: state.homeOwner.selectedSchedule,
    schedulesOnBoarding: state.homeOwner.schedulesOnBoarding,
    infoUnitConfiguration: state.homeOwner.infoUnitConfiguration,
  };
};

const mapDispatchToProps = {
  addPeriod,
  editPeriod,
  saveSchedule,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddPeriodOnBoarding);
