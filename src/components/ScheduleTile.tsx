import React, {useState} from 'react';
import {Image, View, TouchableHighlight, StyleSheet, Text} from 'react-native';
import CustomText from './CustomText';
import Dropdown from './Dropdown';
import {Dictionary} from '../utils/dictionary';
const THREE_DOTS_IMAGE = require('./../assets/images/options.png');

import CLOCK from '../assets/images/schedule_clock.svg';
import HEAT from '../assets/images/schedule_heat.svg';
import COOL from '../assets/images/schedule_cool.svg';
import {showToast} from './CustomToast';
import {connect} from 'react-redux';

function ScheduleTile({
  number,
  hour,
  heating,
  cooling,
  removePeriod,
  navigation,
  selectedDay,
  showDelete,
  isOnboardingBcc101,
  mode
}) {
  const [editColor, setEditColor] = useState('black');
  const [deleteColor, setDeleteColor] = useState('black');
  const [opened, setOpened] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [opened1, setOpened1] = useState(false);
  const [editBackgroundColor, setEditBackgroundcolor] = useState(
    'rgba(0, 73, 117, 1)',
  );
  const [deleteBackgroundColor, setDeleteBackgroundColor] = useState(
    'rgba(0, 73, 117, 1)',
  );
  return (
    <View style={{backgroundColor: 'white', marginBottom: 8}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <CustomText
          allowFontScaling={true}
          style={{marginVertical: 17, marginLeft: 16}}
          text={`Period ${number}`}
        />
        <Dropdown
          accessibilityLabelText={Dictionary.tile.openEditDeleteMenuLabel}
          accessibilityHintText={Dictionary.tile.openEditDeleteMenuHint}
          onPressDown={() => {}}
          opened={opened1}
          setOpened={setOpened1}
          dropdownStyle={styles.dropdownStyle}
          overlayStyle={styles.overlayStyle}
          options={[
            <TouchableHighlight
              key={'Edit'}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={
                Dictionary.bccDashboard.schedule.editButtonPeriodLabel
              }
              accessibilityHint={
                Dictionary.bccDashboard.schedule.editButtonPeriodHint
              }
              underlayColor={editBackgroundColor}
              style={styles.optionStyle}
              onPressIn={() => {
                setEditColor('white');
                setEditBackgroundcolor('white');
              }}
              onPressOut={() => {
                setOpened(false);
                setOpened1(false);
                setEditColor('black');
                let heatingValues = heating.split('°');
                let coolingValues = cooling.split('°');
                if (heatingValues[1] === 'C' && coolingValues[1] === 'C') {
                  if (
                    parseInt(heatingValues[0]) > 38 ||
                    parseInt(coolingValues[0]) > 38 ||
                    parseInt(heatingValues[0]) < 7 ||
                    parseInt(coolingValues[0]) < 7
                  ) {
                    showToast(
                      "There was a problem getting the period's information.",
                      'error',
                    );
                  } else {
                    if (!isOnboardingBcc101) {
                      navigation.navigate('AddPeriod', {
                        newPeriod: number,
                        selectedDay: selectedDay,
                        edit: true,
                      });
                    } else {
                      navigation.navigate('AddPeriodOnBoardingBCC101', {
                        newPeriod: number,
                        selectedDay: selectedDay,
                        edit: true,
                        isOnboarding:true,
                        mode:mode
                      });
                    }
                  }
                } else if (
                  heatingValues[1] === 'F' &&
                  coolingValues[1] === 'F'
                ) {
                  if (
                    parseInt(heatingValues[0]) < 45 ||
                    parseInt(coolingValues[0]) < 45 ||
                    parseInt(heatingValues[0]) > 99 ||
                    parseInt(coolingValues[0]) > 99
                  ) {
                    showToast(
                      "There was a problem getting the period's information.",
                      'error',
                    );
                  } else {
                    if (!isOnboardingBcc101) {
                      navigation.navigate('AddPeriod', {
                        newPeriod: number,
                        selectedDay: selectedDay,
                        edit: true,
                      });
                    } else {
                      navigation.navigate('AddPeriodOnBoardingBCC101', {
                        newPeriod: number,
                        selectedDay: selectedDay,
                        edit: true,
                        isOnboarding:true,
                        mode:mode
                      });
                    }
                  }
                } else {
                  showToast(
                    "There was a problem getting the period's information.",
                    'error',
                  );
                }
                /*navigation.navigate('AddPeriod', {
                  newPeriod: number,
                  selectedDay: selectedDay,
                  edit: true,
                });*/
                //setSelectedSchedule(modelId);
                //navigation.navigate('ScheduleConfiguration');
                setEditBackgroundcolor('rgba(0, 73, 117, 1)');
              }}>
              <Text
                style={[
                  styles.optionWrapper,
                  {
                    color: editColor,
                  },
                ]}>
                {Dictionary.tile.edit}
              </Text>
            </TouchableHighlight>,
            showDelete ? (
              <TouchableHighlight
                key={'Delete'}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={Dictionary.tile.deleteButtonLabel}
                accessibilityHint={Dictionary.tile.deleteButtonHint}
                underlayColor={deleteBackgroundColor}
                style={styles.optionStyle}
                onPressIn={() => {
                  setDeleteColor('white');
                  setDeleteBackgroundColor('white');
                }}
                onPressOut={() => {
                  setOpened(false);
                  setOpened1(false);
                  setDeleteColor('black');
                  removePeriod();
                  setDeleteBackgroundColor('rgba(0, 73, 117, 1)');
                  setDeleteModal(true);
                }}>
                <Text
                  style={[
                    styles.optionWrapper,
                    {
                      color: deleteColor,
                    },
                  ]}>
                  {Dictionary.tile.delete}
                </Text>
              </TouchableHighlight>
            ) : null,
          ]}>
          <View style={styles.threeDotsStyle}>
            <Image
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={Dictionary.tile.threeDotsLabel}
              accessibilityHint={Dictionary.tile.threeDotsHint}
              style={{resizeMode: 'contain'}}
              source={THREE_DOTS_IMAGE}
            />
          </View>
        </Dropdown>
      </View>
      <View
        accessible={true}
        accessibilityLabel={`Starting at: ${hour} hours. Heating setpoint at: ${heating}. Cooling setpoint at: ${cooling}`}
        style={{
          flexDirection: 'row',
          borderTopWidth: 1,
          borderTopColor: '#BFC0C2',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: '5%',
          }}>
          <View style={{marginRight: 10}}>
            <CLOCK fill="#000" />
          </View>
          <CustomText
            allowFontScaling={true}
            size={12}
            font={'medium'}
            style={{marginVertical: 9}}
            text={hour}
          />
        </View>
        <View
          style={{
            flex: 0,
            height: '50%',
            width: 1,
            borderRightWidth: 1,
            borderRightColor: '#BFC0C2',
            alignSelf: 'stretch',
            marginVertical: 8,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: '5%',
          }}>
          <View style={{marginRight: 10}}>
            <HEAT fill="#000" />
          </View>
          <CustomText
            size={12}
            style={{marginVertical: 9}}
            allowFontScaling={true}
            text={heating}
          />
        </View>
        <View
          style={{
            flex: 0,
            height: '50%',
            width: 1,
            borderRightWidth: 1,
            borderRightColor: '#BFC0C2',
            alignSelf: 'stretch',
            marginVertical: 8,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: '5%',
          }}>
          <View style={{marginRight: 10}}>
            <COOL fill="#000" />
          </View>
          <CustomText
            size={12}
            style={{marginVertical: 9}}
            allowFontScaling={true}
            text={cooling}
          />
        </View>
      </View>
    </View>
  );
}

const mapStateToProps = state => {
  return {
    isOnboardingBcc101: state.homeOwner.isOnboardingBcc101,
  };
};

export default connect(mapStateToProps)(ScheduleTile);

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
