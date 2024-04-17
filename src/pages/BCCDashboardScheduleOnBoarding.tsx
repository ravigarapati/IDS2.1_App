import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, Pressable} from 'react-native';
import {BoschIcon, CustomInputText, CustomText} from '../components';
import {Dictionary} from '../utils/dictionary';
import ScheduleOption from '../components/ScheduleOption';
import {Button} from '../components';
import {Icons} from '../utils/icons';
import {connect, useDispatch} from 'react-redux';
import {saveScheduleOnStore} from '../store/actions/HomeOwnerActions';
import {ModalComponent} from '../components';
import {
  saveSchedule,
  setSelectedSchedule,
  updateScheduleOnBoardingBcc101,
  deleteScheduleOnboardingBcc101,
  selectNoScheduleOnboardingBcc101,
  getDeviceStatus,
  getDeviceStatusSchedule,
  //setSchedulName,
} from '../store/actions/HomeOwnerActions';
import {showToast} from '../components/CustomToast';
import {Colors} from '../styles';

const height = Dimensions.get('window').height;

function BCCDashboardScheduleOnBoarding({
  isFahrenheit,
  selectedDevice,
  schedules,
  saveSchedule,
  navigation,
  setSelectedSchedule,
  updateScheduleOnBoardingBcc101,
  saveScheduleOnStore,
  scheduleInfo,
  deleteScheduleOnboardingBcc101,
  selectNoScheduleOnboardingBcc101,
  getDeviceStatus,
  selectedSchedule,
  getDeviceStatusSchedule,
  createStatusInterval,
  setUpdateInfo,
  isOnboardingBcc50,
  isOnboardingBcc101,
}) {
  const [selected, setSelected] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [newSchedule, setNewSchedule] = useState('');
  const [scheduleWasAdded, setScheduleWasAdded] = useState(false);
  const [isOnSchedule, setIsOnSchedule] = useState(true);
  const [updateSchedule1, setUpdateSchedule1] = useState(false);
  const [newScheduleAdded, setNewScheduleAdded] = useState(false);
  const [schedulesMemo, setSchedulesMemo] = useState(schedules);
  const [mode, setMode] = useState(0);

  const dispatch = useDispatch();
  useEffect(() => {
    setSchedulesMemo(schedules);
    if (updateSchedule1) {
      setUpdateSchedule1(false);
      getDeviceStatusSchedule({
        deviceId: selectedDevice.macId,
      });
    }

    if (newScheduleAdded) {
      setNewScheduleAdded(false);
      if (!isOnboardingBcc101) {
        navigation.navigate('ScheduleConfiguration', {
          new: true,
        });
      } else {
        navigation.navigate('configureScheduleOnboarding', {
          new: true,
          isOnboarding:true,
          mode:mode
        });
      }
    }
    console.log(selectedDevice);

    if (selectedDevice.isOnSchedule) {
      setSelected(1);
    } else {
      setSelected(0);
    }
    let array = schedules;
    array?.forEach(item => {
      setMode(item.mode);
    });
  }, [selectedDevice, schedulesMemo]);

  useEffect(() => {
    if (!isOnboardingBcc50) {
      if (!schedulesMemo) {
        showToast(
          'Schedule information is not available at this time.',
          'error',
        );
      }
    }
  }, []);

  useEffect(() => {}, [schedulesMemo]);

  const addNewSchedule = async () => {
    const modelIds = ['1', '2', '3', '4'];
    const existingIds = [];
    const existingSchedule = schedulesMemo.filter(s => s.name === newSchedule);
    if (existingSchedule.length != 0) {
      setShowAdd(false);
      showToast('Schedule already exists.', 'error');
      return;
    }
    schedulesMemo.map(s => {
      existingIds.push(s.model_id);
    });
    let max = '0';
    for (let i = 0; i < 4; i++) {
      if (existingIds.indexOf(modelIds[i]) === -1) {
        max = modelIds[i];
        break;
      }
    }

    setSelectedSchedule(max);

    saveSchedule(
      {
        deviceId: selectedDevice.macId,
        modelId: '0',
        mode: mode,
        state: '0',
        limit: '71-82',
        name: newSchedule,
        unit: 'F',
        data: {
          //unit: `${selectedDevice.isFahrenheit ? 'F' : 'C'}`,
          items1: [{t: '78.0-70.0', c: '0', h: '0'}],
          items2: [{t: '78.0-70.0', c: '0', h: '0'}],
          items3: [{t: '78.0-70.0', c: '0', h: '0'}],
          items4: [{t: '78.0-70.0', c: '0', h: '0'}],
          items5: [{t: '78.0-70.0', c: '0', h: '0'}],
          items6: [{t: '78.0-70.0', c: '0', h: '0'}],
          items7: [{t: '78.0-70.0', c: '0', h: '0'}],
        },
      },
      () => {
        setNewScheduleAdded(true);
        saveScheduleOnStore({
          deviceId: selectedDevice.macId,
          modelId: `${max}`,
          mode: mode,
          state: '0',
          limit: '71-82',
          name: newSchedule,
          unit: 'F',
          data: {
            //unit: `${selectedDevice.isFahrenheit ? 'F' : 'C'}`,
            items1: [{t: '78.0-70.0', c: '0', h: '0'}],
            items2: [{t: '78.0-70.0', c: '0', h: '0'}],
            items3: [{t: '78.0-70.0', c: '0', h: '0'}],
            items4: [{t: '78.0-70.0', c: '0', h: '0'}],
            items5: [{t: '78.0-70.0', c: '0', h: '0'}],
            items6: [{t: '78.0-70.0', c: '0', h: '0'}],
            items7: [{t: '78.0-70.0', c: '0', h: '0'}],
          },
        });
      },
    );

    //navigation.navigate('ScheduleConfiguration', {
    //  new: true,
    //});

    setShowAdd(false);
    setNewSchedule('');
  };

  const updateScheduleAction = s => {
    setUpdateInfo(false);
    createStatusInterval();
    /*setTimeout(() => {
      createStatusInterval();
    }, 3000);*/

    let array = schedulesMemo;
    array.forEach(item => {
      item.state = 0;
    });
    array.forEach(item => {
      if (s.model_id === item.model_id) {
        item.state = '1';
      }
    });
    setSchedulesMemo(array);

    setSelected(1);
    setIsOnSchedule(true);
    setUpdateSchedule1(true);

    updateScheduleOnBoardingBcc101({
      deviceId: selectedDevice.macId,
      modelId: s.model_id,
      unit: 'F',
      name: s.name,
      updatedState: '1',
    });
  };

  return (
    <View style={[styles.container]}>
      {schedulesMemo ? (
        <View style={styles.alignItemsCenter}>
          <ScheduleOption
            accessibilityHintText={
              Dictionary.bccDashboard.schedule.noScheduleMode
            }
            selected={selected == 0}
            testID="noSchedule"
            setSelected={() => {
              let array = schedulesMemo;
              array.forEach(item => {
                item.state = 0;
              });
              setSchedulesMemo(array);
              setSelected(0);
              setIsOnSchedule(false);
              setUpdateInfo(false);
              createStatusInterval();
              /*setTimeout(() => {
                createStatusInterval();
              }, 3000);*/
              selectNoScheduleOnboardingBcc101({
                deviceId: selectedDevice.macId,
                mode: mode,
                distr: '1',
              });
            }}
            scheduleName={'No Schedule'}
          />
          <View style={styles.programmedScheduleTitle}>
            <CustomText
              allowFontScaling={true}
              accessibilityHintText={
                Dictionary.bccDashboard.schedule.scheduleList
              }
              text={Dictionary.bccDashboard.schedule.programmedSchedule}
              size={18}
              font={'bold'}
            />
          </View>

          {schedulesMemo.map((s, i) => {
            return (
              <ScheduleOption
                testID={`scheduleOption${i}`}
                key={'schedule' + i}
                accessibilityLabelText={`${s.name} schedule.`}
                accessibilityHintText={`Activate to set ${s.name} schedule on the device.`}
                selected={s.state === '1' && selected != 0}
                setSelected={() => updateScheduleAction(s)}
                navigation={navigation}
                scheduleName={s.name}
                modelId={s.model_id}
                onDelete={() => {
                  let newSchedules = [];
                  let currentToDelete = false;
                  let array = schedulesMemo;
                  array.map(item => {
                    if (item.model_id === s.model_id) {
                      if (item.state == '1') {
                        currentToDelete = true;
                      }
                    }
                  });
                  array.map(item => {
                    if (item.model_id !== s.model_id) {
                      newSchedules.push(item);
                    }
                  });
                  setSchedulesMemo(newSchedules);

                  deleteScheduleOnboardingBcc101({
                    deviceId: selectedDevice.macId,
                    modelId: s.model_id,
                  });
                }}
                setSelectedSchedule={setSelectedSchedule}
                mode={mode}
              />
            );
          })}
          {!schedulesMemo ||
          (schedulesMemo && schedulesMemo.length === 4) ? null : (
            <View style={styles.addScheduleView}>
              <Pressable
                disabled={
                  !schedulesMemo ||
                  (schedulesMemo && schedulesMemo.length === 4)
                }
                testID="AddScheduleButton"
                style={styles.addSchedulePressable}
                onPress={() => setShowAdd(true)}
                accessibilityHint={`Add Schedule. ${
                  schedulesMemo && schedulesMemo.length === 4
                    ? Dictionary.bccDashboard.schedule.maxScheduleList
                    : ''
                }`}>
                <View style={styles.textAndIconView}>
                  <CustomText
                    allowFontScaling={true}
                    text={Dictionary.bccDashboard.schedule.addSchedule}
                    font="medium"
                    color={
                      schedulesMemo.length === 4
                        ? Colors.grayDisabled
                        : Colors.black
                    }
                    align="left"
                  />
                  <BoschIcon
                    size={20}
                    name={Icons.addFrame}
                    color={'#004975'}
                  />
                </View>
              </Pressable>
            </View>
          )}
        </View>
      ) : null}
      <ModalComponent modalVisible={showAdd} closeModal={() => {}}>
        <View style={styles.width97Percent}>
          <CustomText
            allowFontScaling={true}
            text={Dictionary.bccDashboard.schedule.addNewSchedule}
            font={'bold'}
            style={{marginBottom: 45}}
          />
          <CustomInputText
            testID={'newSchedule'}
            placeholder={Dictionary.bccDashboard.schedule.scheduleName}
            value={newSchedule}
            maxLength={10}
            isRequiredField={true}
            onChange={val => {
              setNewSchedule(val.replace(/[^a-zA-Z ]/g, ''));
            }}
          />
          <View style={[styles.marginBottom10, styles.marginTop47]}>
            <Button
              testID="addNewSchedule"
              disabled={newSchedule.length === 0}
              accessibilityLabelText={Dictionary.button.save}
              accessibilityHintText={Dictionary.tile.yesButtonHint} //update
              type="primary"
              text={Dictionary.button.save}
              onPress={() => addNewSchedule()}
            />
          </View>

          <Button
            testID="cancelNewSchedule"
            accessibilityLabelText={Dictionary.button.cancel}
            accessibilityHintText={Dictionary.tile.noButtonHint} //update
            type="secondary"
            text={Dictionary.button.cancel}
            onPress={() => setShowAdd(false)}
          />
        </View>
      </ModalComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {height: height * 0.78, justifyContent: 'space-between'},
  alignItemsCenter: {alignItems: 'center'},
  marginBottom56: {marginBottom: 56},
  marginBottom10: {marginBottom: 10},
  width97Percent: {width: '97%'},
  programmedScheduleTitle: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#BFC0C2',
    paddingVertical: 20,
  },
  addScheduleView: {width: '100%'},
  addSchedulePressable: {
    borderBottomWidth: 1,
    borderBottomColor: '#BFC0C2',
    paddingBottom: 20,
    paddingTop: 20,
  },
  textAndIconView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    paddingRight: 12,
  },
  marginHorizontal15: {
    marginHorizontal: 15,
  },
  marginTop47: {
    marginTop: 47,
  },
});

const mapStateToProps = state => {
  return {
    scheduleInfo: state.homeOwner.scheduleInfo,
    selectedSchedule: state.homeOwner.selectedSchedule,
    isOnboardingBcc101: state.homeOwner.isOnboardingBcc101,
  };
};

const mapDispatchToProps = {
  saveSchedule,
  setSelectedSchedule,
  updateScheduleOnBoardingBcc101,
  saveScheduleOnStore,
  deleteScheduleOnboardingBcc101,
  selectNoScheduleOnboardingBcc101,
  getDeviceStatus,
  getDeviceStatusSchedule,
  //setSchedulName,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BCCDashboardScheduleOnBoarding);
