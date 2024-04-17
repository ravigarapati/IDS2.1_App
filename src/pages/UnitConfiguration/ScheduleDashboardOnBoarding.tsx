import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {BoschIcon, CustomInputText, CustomText} from '../../components';
import {Dictionary} from '../../utils/dictionary';
import ScheduleOption from '../../components/ScheduleOption';
import {Button} from '../../components';
import {Icons} from '../../utils/icons';
import {connect} from 'react-redux';
import {ModalComponent} from '../../components';
import {
  setSelectedSchedule,
  selectNoScheduleOnboarding,
  deleteScheduleOnBoarding,
  updateScheduleOnBoarding,
  addScheduleOnboarding,
  updateUnitConfiguration,
  saveBCC50,
} from '../../store/actions/HomeOwnerActions';
import {showToast} from '../../components/CustomToast';
import {JS, container} from 'aws-amplify';
import {Colors} from '../../styles';
import {useDispatch} from 'react-redux';
import {SELECTED_DEVICE} from '../../store/labels/HomeOwnerLabels';
import ScheduleOptionOnBoarding from '../../components/ScheduleOptionOnBoarding';

const height = Dimensions.get('window').height;

function ScheduleDashboardOnBoarding({
  schedules,
  navigation,
  setSelectedSchedule,
  isReusable,
  schedulesOnBoarding,
  skipUnitConfigurationOnboarding,
  infoUnitConfiguration,
  selectedSchedule,
  locationOnboarding,
  nameDeviceOnboarding,
  user,
  BCC50macID,
}) {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [newSchedule, setNewSchedule] = useState('');
  const [isOnSchedule, setIsOnSchedule] = useState(true);
  const [updateSchedule1, setUpdateSchedule1] = useState(false);

  const addNewSchedule = async () => {
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
    dispatch(selectNoScheduleOnboarding());
    setSelectedSchedule(max);
    if (isOnSchedule) {
      setIsOnSchedule(false);
    }
    dispatch(
      addScheduleOnboarding({
        model_id: `${max}`,
        mode: '3',
        state: '1',
        limit: '71-82',
        unit: 'F',
        name: newSchedule,
        data: {
          items1: [
            {t: '78.0-70.0', h: '0', c: '0'},
            {t: '78.0-70.0', h: '0', c: '0'},
          ],
          items2: [
            {t: '78.0-70.0', h: '0', c: '0'},
            {t: '78.0-70.0', h: '0', c: '0'},
          ],
          items3: [
            {t: '78.0-70.0', h: '0', c: '0'},
            {t: '78.0-70.0', h: '0', c: '0'},
          ],
          items4: [
            {t: '78.0-70.0', h: '0', c: '0'},
            {t: '78.0-70.0', h: '0', c: '0'},
          ],
          items5: [
            {t: '78.0-70.0', h: '0', c: '0'},
            {t: '78.0-70.0', h: '0', c: '0'},
          ],
          items6: [
            {t: '78.0-70.0', h: '0', c: '0'},
            {t: '78.0-70.0', h: '0', c: '0'},
          ],
          items7: [
            {t: '78.0-70.0', h: '0', c: '0'},
            {t: '78.0-70.0', h: '0', c: '0'},
          ],
        },
      }),
    );
    navigation.navigate('ScheduleConfigurationOnBoarding', {
      new: true,
      schedules,
    });
    setShowAdd(false);
    setNewSchedule('');
  };

  const updateScheduleAction = s => {
    if (s.model_id == '1') {
      dispatch(updateUnitConfiguration({name: 'schedule', value: 0}));
    } else if (s.model_id == '2') {
      dispatch(updateUnitConfiguration({name: 'schedule', value: 1}));
    } else {
      dispatch(updateUnitConfiguration({name: 'schedule', value: 2}));
    }
    dispatch(updateScheduleOnBoarding(s.model_id));
    setSelected(1);
    setSelectedSchedule(s.model_id);
    setIsOnSchedule(false);
    setUpdateSchedule1(true);
  };

  useEffect(() => {
    let newArray = [...schedules];
    newArray.forEach(item2 => {
      item2.state = '0';
    });
    dispatch(updateUnitConfiguration({name: 'schedule', value: 2}));
    setSelected(0);
    setSelectedSchedule('0');
    setIsOnSchedule(true);
    dispatch(selectNoScheduleOnboarding());
  }, []);

  const handleChangeNoSchedule = value => {
    let newArray = [...schedules];
    newArray.forEach(item2 => {
      item2.state = '0';
    });
    dispatch(updateUnitConfiguration({name: 'schedule', value: 2}));
    setSelected(0);
    setSelectedSchedule('0');
    setIsOnSchedule(true);
    dispatch(selectNoScheduleOnboarding());
  };

  const nextButton = () => {
    if (skipUnitConfigurationOnboarding) {
      sendData();
    } else {
      navigation.navigate('ReviewAddUnit');
    }
  };

  const parseTemp = (temp, index) =>
    parseInt(temp.split('-')[index]).toFixed(0);

  const sendData = async () => {
    let sch = {
      exist: false,
      schl: {},
    };

    schedulesOnBoarding.forEach(item => {
      delete item.data.unit;
    });
    // getInitConf(infoUnitConfiguration);
    if (selectedSchedule != '0') {
      let schedule = {};
      schedulesOnBoarding.forEach(item => {
        if (item.model_id == selectedSchedule) {
          schedule.scheduleName = item.name;
          schedule.mode = 3;
          let schN = [];
          Object.keys(item.data).forEach(key => {
            let day = {};
            day.numberProg = item.data[key].length;
            let programs = [];
            item.data[key].forEach(s => {
              let program = {
                heat: parseTemp(s.t, 0) * 10,
                cool: parseTemp(s.t, 1) * 10,
                time: parseInt(s.h),
              };
              programs.push(program);
            });
            day.programs = programs;
            schN.push(day);
          });
          schedule.schN = schN;
        }
      });
      sch.exist = true;
      sch.schl = schedule;
      //setSchedule(schedule);
    }

    let schedules = [];
    schedulesOnBoarding.forEach(item => {
      let schedule = {};
      schedule.scheduleName = item.name;
      schedule.mode = 3;
      let schN = [];
      Object.keys(item.data).forEach(key => {
        let day = {};
        day.numberProg = item.data[key].length;
        let programs = [];
        item.data[key].forEach(s => {
          let program = {
            heat: parseTemp(s.t, 0) * 10,
            cool: parseTemp(s.t, 1) * 10,
            time: parseInt(s.h),
          };
          programs.push(program);
        });
        day.programs = programs;
        schN.push(day);
      });
      schedule.schN = schN;
      schedules.push(schedule);
    });

   let objToEndPoint = {}

    schedulesOnBoarding.forEach(item => {
      item.data.unit = 'F';
    });

    if(Object.keys(locationOnboarding.placeid).length === 0){
      objToEndPoint = {
        deviceId: BCC50macID,
        userId: user.attributes.sub,
        city: locationOnboarding.city,
        state: locationOnboarding.state,
        zipcode: locationOnboarding.zipcode,
        country: locationOnboarding.country,
        deviceName: nameDeviceOnboarding,
        schedules: schedulesOnBoarding,
      };
    }
    else{
      objToEndPoint = {
        deviceId: BCC50macID,
        userId: user.attributes.sub,
        city: locationOnboarding.city,
        state: locationOnboarding.placeid.TimeZoneData.Region,
        zipcode: locationOnboarding.zipcode,
        country: locationOnboarding.country,
        placeId: locationOnboarding.placeid.TimeZoneData,
        deviceName: nameDeviceOnboarding,
        schedules: schedulesOnBoarding,
      };
      objToEndPoint.placeId.zone = locationOnboarding.placeid.zone;
      objToEndPoint.placeId.location = locationOnboarding.placeid.location;
    }

    dispatch(
      saveBCC50(objToEndPoint, res => {
        if (res) {
          navigation.navigate('BCCOnboardingAdded');
        }
      }),
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.alignItemsCenter}>
        {isReusable === false && (
          <>
            <ScheduleOptionOnBoarding
              testID="NoScheduleOption"
              accessibilityHintText={
                Dictionary.bccDashboard.schedule.noScheduleMode
              }
              selected={isOnSchedule}
              setSelected={value => handleChangeNoSchedule(value)}
              name={'No Schedule'}
            />
          </>
        )}

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

        {isReusable === false && (
          <>
            {schedules.map((s, i) => {
              return (
                <ScheduleOptionOnBoarding
                  testID={s.name}
                  key={'schedule' + i}
                  accessibilityLabelText={`${s.name} schedule.`}
                  accessibilityHintText={`Activate to set ${s.name} schedule on the device.`}
                  selected={s.state === '1'}
                  setSelected={() => updateScheduleAction(s)}
                  navigation={navigation}
                  name={s.name}
                  modelId={s.model_id}
                  onDelete={() => {
                    dispatch(deleteScheduleOnBoarding(s.model_id));
                  }}
                  setSelectedSchedule={setSelectedSchedule}
                />
              );
            })}
          </>
        )}
        <View style={styles.addScheduleView}>
          <Pressable
            testID="AddScheduleButton"
            style={styles.addSchedulePressable}
            onPress={() => (schedules.length === 4 ? '' : setShowAdd(true))}
            accessibilityHint={
              schedules.length === 4
                ? Dictionary.bccDashboard.schedule.hintScheduleLimitReached
                : Dictionary.bccDashboard.schedule.hintAddNewSchedule
            }>
            <View style={styles.textAndIconView}>
              <CustomText
                allowFontScaling={true}
                text={Dictionary.bccDashboard.schedule.addSchedule}
                font="medium"
                color={
                  schedules.length === 4 ? Colors.grayDisabled : Colors.black
                }
                align="left"
              />
              <BoschIcon size={20} name={Icons.addFrame} color={'#004975'} />
            </View>
          </Pressable>
        </View>
      </View>

      <View style={styles.buttonView}>
        <Button
          testID="buttonNext"
          accessibilityLabelText="Next button"
          type="primary"
          text={
            skipUnitConfigurationOnboarding
              ? Dictionary.button.submit
              : Dictionary.button.next
          }
          style={styles.button}
          onPress={nextButton}
        />
      </View>

      <ModalComponent blur={true} modalVisible={showAdd} closeModal={() => {}}>
        <View style={styles.width97Percent}>
          <CustomText
            allowFontScaling={true}
            text={Dictionary.bccDashboard.schedule.addNewSchedule}
            font={'bold'}
            style={{marginBottom: 45, marginTop: 10}}
          />
          <CustomInputText
            allowFontScaling={true}
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
              testID="SaveNewSchedule"
              disabled={newSchedule.length === 0}
              accessibilityLabelText={Dictionary.button.save}
              accessibilityHintText={Dictionary.tile.yesButtonHint} //update
              type="primary"
              text={Dictionary.button.save}
              onPress={() => addNewSchedule()}
            />
          </View>

          <Button
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
  container: {flex: 1, justifyContent: 'space-between'},
  alignItemsCenter: {},
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
  addScheduleView: {},
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
  buttonView: {
    flexDirection: 'column-reverse',
    paddingHorizontal: 15,
  },
  button: {
    width: '100%',
    marginBottom: 30,
  },
});

const mapStateToProps = state => {
  return {
    schedulesOnBoarding: state.homeOwner.schedulesOnBoarding,
    skipUnitConfigurationOnboarding:
      state.homeOwner.skipUnitConfigurationOnboarding,
    infoUnitConfiguration: state.homeOwner.infoUnitConfiguration,
    selectedSchedule: state.homeOwner.selectedSchedule,
    locationOnboarding: state.homeOwner.locationOnboarding,
    nameDeviceOnboarding: state.homeOwner.nameDeviceOnboarding,
    user: state.auth.user,
    BCC50macID: state.homeOwner.BCC50macID,
  };
};

const mapDispatchToProps = {
  setSelectedSchedule,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScheduleDashboardOnBoarding);
