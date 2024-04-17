import React, {useState, useEffect} from 'react';
import {
  View,
  Dimensions,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import {BoschIcon, Button, CustomText} from '../components';
import DayTile from '../components/DayTile';
import ScheduleTile from '../components/ScheduleTile';
import {
  getScheduleFullInformation,
  removePeriod,
  saveSchedule,
  setScheduleInfo,
  updatePeriodWhenCopy,
} from '../store/actions/HomeOwnerActions';
import {ModalComponent} from '../components';
import {Dictionary} from '../utils/dictionary';
import CopyDayTile from '../components/CopyDayTile';

import ADD from '../assets/images/schedule_add.svg';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Icons} from '../utils/icons';

const width = Dimensions.get('window').width;
const days = [
  {name: 'Sun', number: 7, accessibility: 'Sunday'},
  {name: 'Mon', number: 1, accessibility: 'Monday'},
  {name: 'Tue', number: 2, accessibility: 'Tuesday'},
  {name: 'Wed', number: 3, accessibility: 'Wednesday'},
  {name: 'Thu', number: 4, accessibility: 'Thursday'},
  {name: 'Fri', number: 5, accessibility: 'Friday'},
  {name: 'Sat', number: 6, accessibility: 'Saturday'},
];

const ScheduleConfiguration = ({
  navigation,
  isFahrenheit,
  selectedDevice,
  selectedSchedule,
  getScheduleFullInformation,
  scheduleInfo,
  removePeriod,
  saveSchedule,
  _24HrsFormatSelected,
  isOnboardingBcc101,
}) => {
  const [selected, setSelected] = useState(
    new Date().getDay() === 0 ? 7 : new Date().getDay(),
  );
  const [deleteModal, setDeleteModal] = useState(false);
  const [indexToRemove, setIndexToRemove] = useState(0);
  const [copyModal, setCopyModal] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [informationGathered, setInformationGathered] = useState(false);
  const [scheduleName, setScheduleName] = useState('');
  //'Information',informationGathered ,'ScheduleInfo:',scheduleInfo);

  const validateFarenheit = () => {
    if (navigation.getParam('isOnboarding') !== undefined) {
      return true;
    } else {
      return isFahrenheit;
    }
  };
  useEffect(() => {
    setScheduleName(
      selectedDevice.schedules.filter(s => s.model_id === selectedSchedule)[0]
        .name,
    );
    if (navigation.state.params.new) {
    } else if (
      !navigation.state.params.new &&
      !informationGathered &&
      !scheduleInfo.hasOwnProperty('items1')
    ) {
      setInformationGathered(true);
      getScheduleFullInformation({
        deviceId: selectedDevice.macId,
        modelId: selectedSchedule,
        unit: validateFarenheit() ? 'F' : 'C',
      });
    } else if (
      !navigation.state.params.new &&
      !informationGathered &&
      scheduleInfo.hasOwnProperty('items1')
    ) {
      setInformationGathered(true);
      getScheduleFullInformation({
        deviceId: selectedDevice.macId,
        modelId: selectedSchedule,
        unit: validateFarenheit() ? 'F' : 'C',
      });
    }
  }, [scheduleInfo]);

  useEffect(() => {
    getScheduleFullInformation({
      deviceId: selectedDevice.macId,
      modelId: selectedSchedule,
      unit: validateFarenheit() ? 'F' : 'C',
    });
    return () => {
      setInformationGathered(false);
      setScheduleInfo();
    };
  }, []);

  const parseHour = hour => {
    const numberOfMinutes = parseInt(hour);
    let hourNumberAux = numberOfMinutes / 60;
    let hourInNumber = Math.floor(hourNumberAux);
    let minutes = (hourNumberAux - hourInNumber) * 60;
    const hourIndicator = numberOfMinutes < 720 ? 'AM' : 'PM';
    hourInNumber =
      numberOfMinutes >= 720 && !_24HrsFormatSelected
        ? hourInNumber - 12
        : hourInNumber;
    hourInNumber =
      !_24HrsFormatSelected && hourInNumber === 0 ? 12 : hourInNumber;
    return `${hourInNumber < 10 ? `0${hourInNumber}` : `${hourInNumber}`}:${
      minutes === 0 ? '00' : minutes
    }${_24HrsFormatSelected ? '' : hourIndicator}`;
  };

  const parseTemp = (temp, index) =>
    `${parseInt(temp.split('-')[index]).toFixed(0)}°${
      validateFarenheit() ? 'F' : 'C'
    }`;

  const getScheduleName = () => {
    if (scheduleInfo.hasOwnProperty('items1')) {
      return selectedDevice.schedules.filter(
        s => s.model_id === selectedSchedule,
      )[0].name;
    }
  };

  const deletePeriod = index => {
    removePeriod({
      selected: selected,
      index: index,
    });
    //scheduleInfo[`items${selected}`].splice(index, 1);
  };

  //const selectCurrentDay

  return (
    <View style={{flex: 1}}>
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
              allowFontScaling={true}
              text={`Schedule`}
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
      <View style={{flex: 1, paddingTop: 22, marginHorizontal: 15}}>
        <CustomText
          text={`${scheduleName}`}
          allowFontScaling={true}
          font={'bold'}
        />
        <CustomText
          allowFontScaling={true}
          text={'Please configure up to eight periods\nby clicking add period.'}
          style={{marginTop: 5, marginBottom: 18}}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 21,
          }}>
          {days.map(d => {
            return (
              <DayTile
                accessibilityLabelText={`${d.accessibility}.`}
                accessibilityHintText={`Activate to manage ${d.accessibility} periods.`}
                key={d.name}
                selected={selected}
                setSelected={setSelected}
                text={d.name}
                number={d.number}
              />
            );
          })}
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{flex: 1}}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
          }}>
          <View>
            {scheduleInfo.hasOwnProperty('items1') &&
              scheduleInfo[`items${selected}`].map((s, i) => {
                return (
                  <ScheduleTile
                    key={`${selected}-${i + 1}`}
                    number={i + 1}
                    hour={parseHour(s.h)}
                    heating={parseTemp(s.t, 1)}
                    cooling={parseTemp(s.t, 0)}
                    removePeriod={() => {
                      setDeleteModal(true);
                      setIndexToRemove(i);
                    }}
                    navigation={navigation}
                    selectedDay={selected}
                    showDelete={
                      scheduleInfo[`items${selected}`].length <= 1
                        ? false
                        : true
                    }
                    mode={navigation.getParam('mode')}
                  />
                );
              })}
            {scheduleInfo.hasOwnProperty('items1') &&
              scheduleInfo[`items${selected}`].length < 8 && (
                <Pressable
                  testID="AddPeriod"
                  accessibilityHint={
                    'Activate to add a new period for current day.'
                  }
                  style={{
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    padding: 16,
                    justifyContent: 'space-between',
                    marginTop: 8,
                  }}
                  onPress={() => {
                    if (!isOnboardingBcc101) {
                      navigation.navigate('AddPeriod', {
                        newPeriod: scheduleInfo[`items${selected}`].length + 1,
                        selectedDay: selected,
                        edit: false,
                      });
                    } else {
                      navigation.navigate('AddPeriodOnBoardingBCC101', {
                        newPeriod: scheduleInfo[`items${selected}`].length + 1,
                        selectedDay: selected,
                        edit: false,
                        isOnboarding: true,
                        mode: navigation.getParam('mode'),
                      });
                    }
                  }}>
                  <CustomText text={'Add Period'} allowFontScaling={true} />
                  <ADD />
                </Pressable>
              )}
          </View>
          <View style={{marginTop: 16}}>
            <Button
              text={'Finish'}
              type={'primary'}
              onPress={() => navigation.goBack()}
              testID="goBackButton"
            />
            <Button
              accessibilityHintText={
                'Activate to open a modal and select the days to copy the current day periods to.'
              }
              text={'Copy Schedule'}
              type={'secondary'}
              onPress={() => {
                setCopyModal(true);
              }}
              testID="CopyButton"
            />
          </View>
        </ScrollView>
        <ModalComponent
          modalVisible={copyModal}
          closeModal={() => setCopyModal(false)}>
          <View style={styles.width97Percent}>
            <CustomText
              allowFontScaling={true}
              text={'Copy'}
              font={'bold'}
              style={{marginBottom: 21}}
            />
            <CustomText
              allowFontScaling={true}
              accessibilityLabelText={
                'Please select the days of the week you would like to copy the schedule to'
              }
              text={
                'Please select the days of the week\nyou would like to copy the\nschedule to'
              }
              style={{marginBottom: 22}}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 57,
              }}>
              {days.map(d => {
                return (
                  <CopyDayTile
                    accessibilityLabelText={`${d.accessibility}.`}
                    accessibilityHintText={`Activate to copy to ${d.accessibility} current day periods.`}
                    key={`CopyDay-${d.name}`}
                    onSelect={() => {
                      let foundDay = selectedDays.filter(day => day === d.name);
                      if (foundDay.length == 0) {
                        setSelectedDays([...selectedDays, d.name]);
                      } else {
                        let i = selectedDays.indexOf(d.name);
                        let newSelectedDays = [...selectedDays];
                        newSelectedDays.splice(i, 1);
                        setSelectedDays(newSelectedDays);
                      }
                    }}
                    text={d.name.charAt(0)}
                    selected={
                      selectedDays.filter(day => day === d.name).length != 0
                    }
                  />
                );
              })}
            </View>
            <View>
              <Button
                text={'Save'}
                type={'primary'}
                onPress={() => {
                  let scheduleToCopy = scheduleInfo[`items${selected}`];
                  selectedDays.forEach(d => {
                    let numberDay = days.filter(day => day.name === d)[0]
                      .number;
                    scheduleInfo[`items${numberDay}`] = [...scheduleToCopy];
                  });

                  saveSchedule(
                    {
                      deviceId: selectedDevice.macId,
                      modelId: selectedDevice.schedules.filter(
                        s => s.model_id === selectedSchedule,
                      )[0].model_id,
                      mode:
                        navigation.getParam('isOnboarding') !== undefined
                          ? navigation.getParam('mode')
                          : selectedDevice.mode,
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
                      data: scheduleInfo,
                    },
                    input => {
                      updatePeriodWhenCopy(input);
                    },
                  );

                  setCopyModal(false);
                  setSelectedDays([]);
                }}
                testID="SaveButton"
              />
              <Button
                text={'Cancel'}
                type={'secondary'}
                onPress={() => {
                  setCopyModal(false);
                  setSelectedDays([]);
                }}
                testID="CancelB"
              />
            </View>
          </View>
        </ModalComponent>
        <ModalComponent
          modalVisible={deleteModal}
          closeModal={() => setDeleteModal(false)}>
          <View style={styles.width97Percent}>
            <CustomText
              allowFontScaling={true}
              style={styles.marginBottom56}
              accessibilityLabelText={
                Dictionary.bccDashboard.schedule.deletePeriodConfirmation
              }
              align="left"
              text={Dictionary.bccDashboard.schedule.deletePeriodConfirmation}
            />
            <View style={styles.marginBottom10}>
              <Button
                testID="Delete"
                accessibilityLabelText={Dictionary.tile.yes}
                accessibilityHintText={Dictionary.tile.yesButtonHint}
                type="primary"
                text={Dictionary.button.yes}
                onPress={() => {
                  //deleteFunction();
                  //deletePeriod(indexToRemove);
                  setDeleteModal(false);
                  scheduleInfo['items' + selected].splice(indexToRemove, 1);
                  saveSchedule(
                    {
                      deviceId: selectedDevice.macId,
                      modelId: selectedDevice.schedules.filter(
                        s => s.model_id === selectedSchedule,
                      )[0].model_id,
                      mode:
                        navigation.getParam('isOnboarding') !== undefined
                          ? navigation.getParam('mode')
                          : selectedDevice.mode,
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
                      data: scheduleInfo,
                    },
                    () => {
                      //deletePeriod(indexToRemove);
                    },
                  );
                }}
              />
            </View>

            <Button
              accessibilityLabelText={Dictionary.tile.no}
              accessibilityHintText={Dictionary.tile.noButtonHint}
              type="secondary"
              text={Dictionary.button.no}
              onPress={() => setDeleteModal(false)}
            />
          </View>
        </ModalComponent>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownStyle: {
    marginHorizontal: 0,
    width: '22%',
    marginLeft: '70%',
  },
  overlayStyle: {
    width: '70%',
    height: '100%',
  },
  threeDotsStyle: {
    paddingHorizontal: 15.3,
    paddingVertical: 10,
  },
  threeDots: {},
  optionWrapper: {
    fontSize: 16,
    padding: 15,
    flex: 1,
    height: '100%',
    width: '100%',
  },
  optionStyle: {
    height: '100%',
    width: '100%',
    flex: 1,
  },
  width97Percent: {width: '97%'},
  marginBottom56: {marginBottom: 56},
  marginBottom10: {marginBottom: 10},
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

const mapStateToProps = state => {
  return {
    isFahrenheit: state.homeOwner.selectedDevice.isFahrenheit,
    selectedDevice: state.homeOwner.selectedDevice,
    selectedSchedule: state.homeOwner.selectedSchedule,
    scheduleInfo: state.homeOwner.scheduleInfo,
    _24HrsFormatSelected:
      state.homeOwner.selectedDevice.d_hour === '0' ? false : true,
    isOnboardingBcc101: state.homeOwner.isOnboardingBcc101,
  };
};

const mapDispathToProps = {
  getScheduleFullInformation,
  removePeriod,
  saveSchedule,
  setScheduleInfo,
  updatePeriodWhenCopy,
};

export default connect(
  mapStateToProps,
  mapDispathToProps,
)(ScheduleConfiguration);
