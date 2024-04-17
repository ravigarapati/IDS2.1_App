import React, {useState, useEffect} from 'react';
import {
  View,
  Dimensions,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import {Button, CustomText} from '../../components';
import DayTile from '../../components/DayTile';
import ScheduleTile from '../../components/ScheduleTile';
import {
  getScheduleFullInformation,
  removePeriod,
  removePeriodOnBoarding,
  saveSchedule,
  setScheduleInfo,
} from '../../store/actions/HomeOwnerActions';
import {ModalComponent} from '../../components';
import {Dictionary} from '../../utils/dictionary';
import CopyDayTile from '../../components/CopyDayTile';

import ADD from '../../assets/images/schedule_add.svg';
import ScheduleTileOnBoarding from '../../components/ScheduleTileOnBoarding';

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

const ScheduleConfigurationOnBoarding = ({
  navigation,
  selectedDevice,
  selectedSchedule,
  getScheduleFullInformation,
  removePeriod,
  saveSchedule,
  schedulesOnBoarding,
  infoUnitConfiguration,
}) => {
  const [selected, setSelected] = useState(
    new Date().getDay() === 0 ? 7 : new Date().getDay(),
  );
  const is24Hours = infoUnitConfiguration.hours1224 == 1 ? true : false;
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [indexToRemove, setIndexToRemove] = useState(0);
  const [copyModal, setCopyModal] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [informationGathered, setInformationGathered] = useState(false);
  const [scheduleName, setScheduleName] = useState('');
  const [scheduleInfo, setScheduleInfo] = useState(
    schedulesOnBoarding.filter(s => s.model_id === selectedSchedule)[0].data,
  );
  useEffect(() => {
    console.log(scheduleInfo);
    setScheduleName(
      schedulesOnBoarding.filter(s => s.model_id === selectedSchedule)[0].name,
    );
    if (navigation.state.params.new) {
    } else if (
      !navigation.state.params.new &&
      !informationGathered &&
      !scheduleInfo.hasOwnProperty('items1')
    ) {
      setInformationGathered(true);
      /*getScheduleFullInformation({
        deviceId: selectedDevice.macId,
        modelId: selectedSchedule,
        unit: isFahrenheit ? 'F' : 'C',
      });*/
    } else if (
      !navigation.state.params.new &&
      !informationGathered &&
      scheduleInfo.hasOwnProperty('items1')
    ) {
      setInformationGathered(true);
      /*getScheduleFullInformation({
        deviceId: selectedDevice.macId,
        modelId: selectedSchedule,
        unit: isFahrenheit ? 'F' : 'C',
      });*/
    }
  }, [scheduleInfo]);

  useState(() => {
    return () => {
      setInformationGathered(false);
    };
  }, []);

  const parseHour = hour => {
    const numberOfMinutes = parseInt(hour);
    let hourNumberAux = numberOfMinutes / 60;
    let hourInNumber = Math.floor(hourNumberAux);
    let minutes = (hourNumberAux - hourInNumber) * 60;
    const hourIndicator = numberOfMinutes < 720 ? 'AM' : 'PM';
    hourInNumber =
      numberOfMinutes > 720 && !is24Hours ? hourInNumber - 12 : hourInNumber;
    hourInNumber = !is24Hours && hourInNumber === 0 ? 12 : hourInNumber;
    return `${hourInNumber < 10 ? `0${hourInNumber}` : `${hourInNumber}`}:${
      minutes === 0 ? '00' : minutes
    }${is24Hours ? '' : hourIndicator}`;
  };

  const parseTemp = (temp, index) =>
    `${parseInt(temp.split('-')[index]).toFixed(0)}°${'F'}`;

  const getScheduleName = () => {
    if (scheduleInfo.hasOwnProperty('items1')) {
      return schedulesOnBoarding.filter(s => s.model_id === selectedSchedule)[0]
        .name;
    }
  };

  const deletePeriod = index => {
    dispatch(
      removePeriodOnBoarding({
        selectedSchedule,
        selected: selected,
        index,
      }),
    );
    //scheduleInfo[`items${selected}`].splice(index, 1);
  };

  //const selectCurrentDay

  return (
    <View style={{flex: 1}}>
      <Image
        style={{height: 8, width: '100%'}}
        source={require('./../../assets/images/header_ribbon.png')}
      />
      <View style={{flex: 1, paddingTop: 22, marginHorizontal: 15}}>
        <CustomText
          text={`${scheduleName}`}
          font={'bold'}
          allowFontScaling={true}
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
                  <ScheduleTileOnBoarding
                    testID={'DropDown' + i}
                    testIDEditButton={'EditButton' + i}
                    testIDDeleteButton={'DeleteButton' + i}
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
                      scheduleInfo[`items${selected}`].length <= 2
                        ? false
                        : true
                    }
                  />
                );
              })}
            {scheduleInfo.hasOwnProperty('items1') &&
              scheduleInfo[`items${selected}`].length < 8 && (
                <Pressable
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
                    navigation.navigate('AddPeriodOnBoarding', {
                      newPeriod: scheduleInfo[`items${selected}`].length + 1,
                      selectedDay: selected,
                      edit: false,
                    });
                  }}>
                  <CustomText text={'Add Period'} allowFontScaling={true} />
                  <ADD />
                </Pressable>
              )}
          </View>
          <View style={{marginTop: 16}}>
            <Button
              testID="FinishButton"
              text={'Finish'}
              type={'primary'}
              onPress={() => navigation.goBack()}
            />
            <Button
              testID="CopyButton"
              accessibilityHintText={
                'Activate to open a modal and select the days to copy the current day periods to.'
              }
              text={'Copy Schedule'}
              type={'secondary'}
              onPress={() => {
                setCopyModal(true);
              }}
            />
          </View>
        </ScrollView>
        <ModalComponent
          testID="ModalCopy"
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
                testID="SaveCopy"
                text={'Save'}
                type={'primary'}
                onPress={() => {
                  let scheduleToCopy = scheduleInfo[`items${selected}`];
                  selectedDays.forEach(d => {
                    let numberDay = days.filter(day => day.name === d)[0]
                      .number;
                    scheduleInfo[`items${numberDay}`] = [...scheduleToCopy];
                  });

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
                  unit: isFahrenheit ? 'F' : 'C',
                  data: scheduleInfo,
                });*/

                  setCopyModal(false);
                  setSelectedDays([]);
                }}
              />
              <Button
                text={'Cancel'}
                type={'secondary'}
                onPress={() => {
                  setCopyModal(false);
                  setSelectedDays([]);
                }}
              />
            </View>
          </View>
        </ModalComponent>
        <ModalComponent
          testID="ModalDelete"
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
                testID="DeleteButton"
                accessibilityLabelText={Dictionary.tile.yes}
                accessibilityHintText={Dictionary.tile.yesButtonHint}
                type="primary"
                text={Dictionary.button.yes}
                onPress={() => {
                  //deleteFunction();
                  deletePeriod(indexToRemove);
                  setDeleteModal(false);
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
                  unit: isFahrenheit ? 'F' : 'C',
                  data: scheduleInfo,
                });*/
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
});

const mapStateToProps = state => {
  return {
    selectedDevice: state.homeOwner.selectedDevice,
    selectedSchedule: state.homeOwner.selectedSchedule,
    schedulesOnBoarding: state.homeOwner.schedulesOnBoarding,
    infoUnitConfiguration: state.homeOwner.infoUnitConfiguration,
  };
};

const mapDispathToProps = {
  getScheduleFullInformation,
  removePeriod,
  saveSchedule,
  setScheduleInfo,
};

export default connect(
  mapStateToProps,
  mapDispathToProps,
)(ScheduleConfigurationOnBoarding);
