import React, {useState} from 'react';
import {
  View,
  TouchableHighlight,
  StyleSheet,
  Image,
  Text,
  Pressable,
} from 'react-native';
import RadioButton from './Radiobutton';
import Dropdown from './Dropdown';
import {Dictionary} from '../utils/dictionary';
import ModalComponent from './ModalComponent';
import Button from './Button';
import CustomText from './CustomText';
import { connect } from 'react-redux';

const THREE_DOTS_IMAGE = require('./../assets/images/options.png');

type ScheduleOptionProps = {
  scheduleName: string;
  selected: boolean;
  setSelected: any;
  navigation?: any;
  modelId?: any;
  setSelectedSchedule?: any;
  onDelete?: any;
  accessibilityLabelText?: string;
  accessibilityHintText?: string;
  testID?: string;
  isOnboardingBcc101?: false;
  mode?:any
};

 function ScheduleOption({
  scheduleName,
  selected,
  setSelected,
  navigation,
  modelId,
  setSelectedSchedule,
  onDelete,
  accessibilityLabelText = undefined,
  accessibilityHintText = undefined,
  testID = '',
  isOnboardingBcc101,
  mode
}: ScheduleOptionProps) {
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
    <View
      style={{
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#BFC0C2',
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Pressable
        style={{width: '85%'}}
        onPress={() => {
          setSelected();
        }}>
        <RadioButton
          testID={testID}
          accessibilityLabelText={accessibilityLabelText}
          accessibilityHintText={accessibilityHintText}
          containerStyle={{marginVertical: 20}}
          disabled={false}
          key={`radio`}
          checked={selected}
          handleCheck={value => {
            //setWasChanged(true);
            setSelected();
            //setCurrent(option.id);
          }}
          text={` ${scheduleName}`}
        />
      </Pressable>

      {scheduleName !== 'No Schedule' && (
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
                Dictionary.bccDashboard.schedule.editButtonLabel
              }
              accessibilityHint={
                Dictionary.bccDashboard.schedule.editButtonHint
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
                setSelectedSchedule(modelId);
                if(!isOnboardingBcc101)
                {
                  navigation.navigate('ScheduleConfiguration', {new: false});
                }
                else{
                  navigation.navigate('configureScheduleOnboarding', {new: false, isOnboarding: true, mode: mode});
                }
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
            scheduleName !== 'Home' && scheduleName !== 'Vacation' ? (
              <TouchableHighlight
                key={'Delete'}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={
                  Dictionary.bccDashboard.schedule.deleteButtonLabel
                }
                accessibilityHint={
                  Dictionary.bccDashboard.schedule.deleteButtonHint
                }
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
              source={THREE_DOTS_IMAGE}
              style={{resizeMode: 'contain'}}
            />
          </View>
        </Dropdown>
      )}

      <ModalComponent
        modalVisible={deleteModal}
        closeModal={() => setDeleteModal(false)}>
        <View style={styles.width97Percent}>
          <CustomText
          allowFontScaling={true}
            style={styles.marginBottom56}
            accessibilityLabelText={
              Dictionary.bccDashboard.schedule.deleteConfirmation
            }
            align="left"
            text={Dictionary.bccDashboard.schedule.deleteConfirmation}
          />
          <View style={styles.marginBottom10}>
            <Button
              accessibilityLabelText={Dictionary.tile.yes}
              accessibilityHintText={Dictionary.tile.yesButtonHint}
              type="primary"
              text={Dictionary.button.yes}
              onPress={() => {
                //deleteFunction();
                onDelete();
                setDeleteModal(false);
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
  );
}

const mapStateToProps = state => {
  return {
    isOnboardingBcc101: state.homeOwner.isOnboardingBcc101
  };
};

export default connect(
  mapStateToProps,
)(ScheduleOption);

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
