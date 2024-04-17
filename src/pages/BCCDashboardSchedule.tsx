import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {CustomInputText, CustomText} from '../components';
import {Dictionary} from '../utils/dictionary';
import ScheduleOption from '../components/ScheduleOption';
import {Button} from '../components';
import {Icons} from '../utils/icons';
import {connect} from 'react-redux';
import {saveScheduleOnStore} from '../store/actions/HomeOwnerActions';
import {ModalComponent} from '../components';
import {
  saveSchedule,
  setSelectedSchedule,
  updateSchedule,
  deleteSchedule,
  selectNoSchedule,
  getDeviceStatus,
  getDeviceStatusSchedule,
  deleteScheduleOnStore,
  selectNoScheduleOnStore,
  updateScheduleOnStore,
  //setSchedulName,
} from '../store/actions/HomeOwnerActions';
import {showToast} from '../components/CustomToast';

const height = Dimensions.get('window').height;

function BCCDashboardSchedule({
  isFahrenheit,
  selectedDevice,
  schedules,
  saveSchedule,
  navigation,
  setSelectedSchedule,
  updateSchedule,
  saveScheduleOnStore,
  scheduleInfo,
  deleteSchedule,
  selectNoSchedule,
  getDeviceStatus,
  selectedSchedule,
  getDeviceStatusSchedule,
  createStatusInterval,
  setUpdateInfo,
  isOnboardingBcc101,
  isOnboardingBcc50,
  isOnSchedule,
  setIsOnSchedule,
  stopStatus,
  setSchedules,
  deleteScheduleOnStore,
  selectNoScheduleOnStore,
  setGetStatusAfterChanged,
  updateScheduleOnStore,
}) {
  const [selected, setSelected] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [newSchedule, setNewSchedule] = useState('');
  const [scheduleWasAdded, setScheduleWasAdded] = useState(false);
  const [updateSchedule1, setUpdateSchedule1] = useState(false);
  const [newScheduleAdded, setNewScheduleAdded] = useState(false);

  useEffect(() => {
    if (updateSchedule1) {
      setTimeout(() => {
        setUpdateSchedule1(false);
        getDeviceStatusSchedule({
          deviceId: selectedDevice.macId,
        });
      }, 5000);
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
        });
      }
    }
  }, [selectedDevice]);

  useEffect(() => {
    if (!isOnboardingBcc50) {
      if (!schedules) {
        showToast(
          'Schedule information is not available at this time.',
          'error',
        );
      }
    }
  }, []);

  const addNewSchedule = async () => {
    stopStatus();
    createStatusInterval();
    /*setTimeout(() => {
      createStatusInterval();
    }, 3000);*/
    const modelIds = ['1', '2', '3', '4'];
    const existingIds = [];
    const existingSchedule = schedules.filter(s => s.name === newSchedule);
    if (existingSchedule.length != 0) {
      setShowAdd(false);
      showToast('Schedule already exists.', 'error');
      return;
    }
    schedules.map(s => {
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
        mode: selectedDevice.mode,
        state: '0',
        limit: '71-82',
        name: newSchedule,
        unit: isFahrenheit ? 'F' : 'C',
        data: isFahrenheit
          ? {
              //unit: `${selectedDevice.isFahrenheit ? 'F' : 'C'}`,
              items1: [{t: '78.0-70.0', c: '0', h: '0'}],
              items2: [{t: '78.0-70.0', c: '0', h: '0'}],
              items3: [{t: '78.0-70.0', c: '0', h: '0'}],
              items4: [{t: '78.0-70.0', c: '0', h: '0'}],
              items5: [{t: '78.0-70.0', c: '0', h: '0'}],
              items6: [{t: '78.0-70.0', c: '0', h: '0'}],
              items7: [{t: '78.0-70.0', c: '0', h: '0'}],
            }
          : {
              //unit: `${selectedDevice.isFahrenheit ? 'F' : 'C'}`,
              items1: [{t: '25.5-21.0', c: '0', h: '0'}],
              items2: [{t: '25.5-21.0', c: '0', h: '0'}],
              items3: [{t: '25.5-21.0', c: '0', h: '0'}],
              items4: [{t: '25.5-21.0', c: '0', h: '0'}],
              items5: [{t: '25.5-21.0', c: '0', h: '0'}],
              items6: [{t: '25.5-21.0', c: '0', h: '0'}],
              items7: [{t: '25.5-21.0', c: '0', h: '0'}],
            },
      },
      () => {
        setNewScheduleAdded(true);
        let newSchedules = [...schedules];
        newSchedules.push({
          limit: '72-81',
          mode: selectedDevice.mode,
          model_id: `${max}`,
          name: newSchedule,
          state: '0',
        });
        setSchedules(newSchedules);
        saveScheduleOnStore({
          deviceId: selectedDevice.macId,
          modelId: `${max}`,
          mode: selectedDevice.mode,
          state: '0',
          limit: '71-82',
          name: newSchedule,
          unit: selectedDevice.isFahrenheit ? 'F' : 'C',
          data: isFahrenheit
            ? {
                //unit: `${selectedDevice.isFahrenheit ? 'F' : 'C'}`,
                items1: [{t: '78.0-70.0', c: '0', h: '0'}],
                items2: [{t: '78.0-70.0', c: '0', h: '0'}],
                items3: [{t: '78.0-70.0', c: '0', h: '0'}],
                items4: [{t: '78.0-70.0', c: '0', h: '0'}],
                items5: [{t: '78.0-70.0', c: '0', h: '0'}],
                items6: [{t: '78.0-70.0', c: '0', h: '0'}],
                items7: [{t: '78.0-70.0', c: '0', h: '0'}],
              }
            : {
                //unit: `${selectedDevice.isFahrenheit ? 'F' : 'C'}`,
                items1: [{t: '25.5-21.0', c: '0', h: '0'}],
                items2: [{t: '25.5-21.0', c: '0', h: '0'}],
                items3: [{t: '25.5-21.0', c: '0', h: '0'}],
                items4: [{t: '25.5-21.0', c: '0', h: '0'}],
                items5: [{t: '25.5-21.0', c: '0', h: '0'}],
                items6: [{t: '25.5-21.0', c: '0', h: '0'}],
                items7: [{t: '25.5-21.0', c: '0', h: '0'}],
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
    createStatusInterval();
    /*setTimeout(() => {
      createStatusInterval();
    }, 3000);*/
    stopStatus();
    let newSchedules = [...schedules];
    newSchedules.map(e => {
      if (e.name === s.name) {
        e.state = '1';
      } else {
        e.state = '0';
      }
    });
    setSchedules(schedules);
    setUpdateInfo(false);
    createStatusInterval();
    /*setTimeout(() => {
      createStatusInterval();
    }, 3000);*/
    updateSchedule(
      {
        deviceId: selectedDevice.macId,
        modelId: s.model_id,
        unit: selectedDevice.isFahrenheit ? 'F' : 'C',
        name: s.name,
        updatedState: '1',
      },
      () => {
        setTimeout(() => {
          setGetStatusAfterChanged(true);
          updateScheduleOnStore({
            deviceId: selectedDevice.macId,
            modelId: s.model_id,
            name: s.name,
          });
        }, 1000);
      },
    );
    setSelected(1);
    setIsOnSchedule(true);
    setUpdateSchedule1(true);
  };

  return (
    <View style={[styles.container]}>
      {schedules ? (
        <View style={styles.alignItemsCenter}>
          <ScheduleOption
            accessibilityHintText={
              Dictionary.bccDashboard.schedule.noScheduleMode
            }
            selected={!isOnSchedule}
            testID="noSchedule"
            setSelected={() => {
              selectNoSchedule(
                {
                  deviceId: selectedDevice.macId,
                  mode: selectedDevice.mode.toString(),
                  distr: '1',
                },
                () => {
                  createStatusInterval();
                  /*setTimeout(() => {
                    createStatusInterval();
                  }, 3000);*/
                  stopStatus();
                  setSelected(0);
                  setIsOnSchedule(false);
                  setUpdateInfo(false);
                  selectNoScheduleOnStore();
                },
              );
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

          {schedules.map((s, i) => {
            return (
              <ScheduleOption
                testID={`scheduleOption${i}`}
                key={'schedule' + i}
                accessibilityLabelText={`${s.name} schedule.`}
                accessibilityHintText={`Activate to set ${s.name} schedule on the device.`}
                selected={s.state === '1' && isOnSchedule}
                setSelected={() => updateScheduleAction(s)}
                navigation={navigation}
                scheduleName={s.name}
                modelId={s.model_id}
                onDelete={() => {
                  deleteSchedule(
                    {
                      deviceId: selectedDevice.macId,
                      modelId: s.model_id,
                    },
                    () => {
                      createStatusInterval();
                      /*setTimeout(() => {
                        createStatusInterval();
                      }, 3000);*/
                      stopStatus();
                      if (s.state === '1') {
                        setIsOnSchedule(false);
                      }

                      setSchedules(
                        schedules.filter(e => e.model_id !== s.model_id),
                      );
                      deleteScheduleOnStore({
                        deviceId: selectedDevice.macId,
                        modelId: s.model_id,
                      });
                    },
                  );
                }}
                setSelectedSchedule={setSelectedSchedule}
              />
            );
          })}
        </View>
      ) : (
        <View></View>
      )}
      <View style={styles.marginHorizontal15}>
        <Button
          testID="addFrame"
          accessibilityLabelText={`Add Schedule. ${
            schedules && schedules.length === 4
              ? Dictionary.bccDashboard.schedule.maxScheduleList
              : ''
          }`}
          disabled={!schedules || (schedules && schedules.length === 4)}
          icon={Icons.addFrame}
          type="primary"
          text={Dictionary.bccDashboard.schedule.addSchedule}
          onPress={() => setShowAdd(true)}
        />
      </View>
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
  updateSchedule,
  saveScheduleOnStore,
  deleteSchedule,
  selectNoSchedule,
  getDeviceStatus,
  getDeviceStatusSchedule,
  deleteScheduleOnStore,
  selectNoScheduleOnStore,
  updateScheduleOnStore,
  //setSchedulName,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BCCDashboardSchedule);
