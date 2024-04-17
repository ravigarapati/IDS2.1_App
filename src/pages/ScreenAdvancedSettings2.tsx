import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import OptionText from '../components/OptionText';
import {
  BoschIcon,
  CustomText,
  Button,
  ProgressIndicator,
  SwitchContent,
  ModalComponent,
  CustomInputText,
  CustomWheelPicker,
} from '../components';
import {Icons} from '../utils/icons';
import {Colors} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {connect, useDispatch} from 'react-redux';
import {validateInputField} from '../utils/Validator';

import System from '../assets/images/core-data.svg';
import Installer from '../assets/images/Temperature.svg';

import CLOCK from '../assets/images/clock.svg';
import THERMOMETER from '../assets/images/temperature1.svg';

import InfoIcon from '../assets/images/info-i-frame.svg';
import LockIcon from '../assets/images/Lock-screen.svg';
import {
  getAdvancedSettings,
  setAdvancedSettings,
  setisOnboardingBcc50,
} from '../store/actions/HomeOwnerActions';
import { CustomWheelPick } from '../components/CustomWheelPick';

const ScreenAdvancedSettings2 = ({
  navigation,
  selectedDevice,
  setisOnboardingBcc50,
}) => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(0);

  const [On, setOn] = useState('');
  const [OnValues, setOnValues] = useState(
    Array.from({length: (120 - 0) / 5 + 1}, (_, i) => `${0 + i * 5} s`),
  );

  const [OnElec, setOnElec] = useState('');
  const [OnElecValues, setOnElecValues] = useState(
    Array.from({length: (5 - 0) / 1 + 1}, (_, i) => `${0 + i * 1} s`),
  );

  const [Off, setOff] = useState('');
  const [OffValues, setOffValues] = useState(
    Array.from({length: (120 - 30) / 10 + 1}, (_, i) => `${30 + i * 10} s`),
  );

  const [MinRunTime, setMinRunTime] = useState('');
  const [MinRunTimeValues, setMinRunTimeValues] = useState(
    Array.from({length: (10 - 3) / 1 + 1}, (_, i) => `${3 + i * 1} min`),
  );

  const [AntiShortCycle, setAntiShortCycle] = useState('');
  const [AntiShortCycleValues, setAntiShortCycleValues] = useState(
    Array.from({length: (5 - 0) / 1 + 1}, (_, i) => `${0 + i * 1} min`),
  );

  const [CycleTime, setCycleTime] = useState('');
  const [CycleTimeValues, setCycleTimeValues] = useState(
    Array.from({length: (5 - 0) / 1 + 1}, (_, i) => `${0 + i * 1} min`),
  );

  const [Heating, setHeating] = useState('');
  const [HeatingValues, setHeatingValues] = useState(
    selectedDevice.isFahrenheit
      ? Array.from(
          {length: (2 - 0.5) / 0.5 + 1},
          (_, i) => `${0.5 + i * 0.5} °F`,
        )
      : Array.from(
          {length: (0.9 - 0.3) / 0.2 + 1},
          (_, i) => `${0.3 + i * 0.2} °C`,
        ),
  );

  const [Cooling, setCooling] = useState('');
  const [CoolingValues, setCoolingValues] = useState(
    selectedDevice.isFahrenheit
      ? Array.from(
          {length: (2 - 0.5) / 0.5 + 1},
          (_, i) => `${0.5 + i * 0.5} °F`,
        )
      : Array.from(
          {length: (0.9 - 0.3) / 0.2 + 1},
          (_, i) => `${0.3 + i * 0.2} °C`,
        ),
  );

  const [values, setValues] = useState({});

  const INFORMATION = [
    {
      header: 'DB ',
      description: 'for Deadband',
      sequence: '1.',
    },
    {
      header: 'HSD ',
      description: 'for Relative Humidity Hysteresis',
      sequence: '2.',
    },
    {
      header: 'SS ',
      description: 'For Sensivity Level',
      sequence: '3.',
    },
    {
      header: 'ST ',
      description: 'for Staging',
      sequence: '4.',
    },
    {
      header: 'UC ',
      description: 'for Unit Configuration',
      sequence: '5.',
    },
  ];

  const actionCodePattern = {
    minlength: 2,
    maxlength: 3,
    required: true,
    pattern: 'DB|HSD|SS|ST|UC|HC|SC',
  };

  const [manualEntryError, setManualEntryError] = useState({
    accessCode: '',
  });
  const [manualEntry, setManualEntry] = useState({
    accessCode: '',
  });

  const timeout = React.useRef(null);

  const onChangeHandler = value => {
    value = value.replace(/[^a-zA-Z ]/g, '').toUpperCase();
    changeHandlerManualEntry('accessCode', value, actionCodePattern);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      switch (value) {
        case 'DB':
          setManualEntry({accessCode: ''});
          navigation.navigate('DeadBandScreen');
          break;
        case 'HSD':
          setManualEntry({accessCode: ''});
          navigation.navigate('RelativeHumidityHysteresisScreen');
          break;
        case 'SS':
          setManualEntry({accessCode: ''});
          navigation.navigate('SensivityLevelScreen');
          break;
        case 'ST':
          setManualEntry({accessCode: ''});
          navigation.navigate('StagingScreen');
          break;
        case 'UC':
          setManualEntry({accessCode: ''});
          setisOnboardingBcc50(false);
          navigation.navigate('UnitConfiguration');
          break;
        case 'HC':
          setManualEntry({accessCode: ''});
          navigation.navigate('HumidityCalibration');
          break;
        case 'SC':
          setManualEntry({accessCode: ''});
          navigation.navigate('SensorCalibration');
          break;
      }
    }, 100);
  };

  const setMaualEntryValue = (field, value) => {
    setManualEntry(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const changeHandlerManualEntry = (field, value, pattern) => {
    setMaualEntryValue(field, value);
    let validation = validateInputField(value, pattern);
    setManualEntryErrorValue(field, validation.errorText);
  };

  const setManualEntryErrorValue = (field, value) => {
    setManualEntryError(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const TipsList = () => (
    <View
      accessible={true}
      style={{
        backgroundColor: '#D1E4FF',
        paddingTop: 19,
        paddingBottom: 11,
      }}>
      <View style={{flexDirection: 'row', marginBottom: 20}}>
        <View style={{width: '18%'}}>
          <InfoIcon
            fill="#000"
            width={30}
            height={30}
            style={{alignSelf: 'center'}}
          />
        </View>
        <View style={{width: '82%'}}>
          <CustomText
            allowFontScaling={true}
            style={{marginBottom: 5}}
            align={'left'}
            color={'#00629A'}
            text={'Information'}
            accessibilityLabelText="Information."
          />
        </View>
      </View>
      <View>
        {INFORMATION.map((t, i) => (
          <TipSection
            key={t.header}
            header={t.header}
            sequence={t.sequence}
            description={t.description}
          />
        ))}
      </View>
    </View>
  );

  const TipSection = ({
    header,
    description,
    sequence,
    icon = null,
    style = undefined,
  }) => {
    return (
      <View style={style ? style : {flexDirection: 'row', marginBottom: 20}}>
        <View style={{width: '18%'}}>
          <CustomText
            allowFontScaling={true}
            align={'center'}
            text={sequence}
            color={'#00629A'}
            accessibilityLabelText={`${description}.`}
          />
        </View>

        <View style={{width: '70%'}}>
          <View>
            <CustomText
              allowFontScaling={true}
              align={'left'}
              color={'#00629A'}
              text={header}
              font={'bold'}
              accessibilityLabelText={`${header}.`}>
              <CustomText
                allowFontScaling={true}
                align={'left'}
                text={description}
                color={'#00629A'}
                accessibilityLabelText={`${description}.`}
              />
            </CustomText>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    loadRunTimeValues();
  }, []);

  function loadRunTimeValues() {
    /* istanbul ignore next */ return new Promise((resolve, reject) => {
      dispatch(
        getAdvancedSettings(selectedDevice.macId, response => {
          const fanDelay = response.fanDelay;

          setOn(fanDelay);

          const fanOnDelay = response.fanOnDelay;

          setOnElec(fanOnDelay);

          const fanOffDelay = response.fanOffDelay;

          setOff(fanOffDelay);

          const minRunTime = response.minRunTime;

          setMinRunTime(minRunTime);

          const antiShortTime = response.antiShortTime;

          setAntiShortCycle(antiShortTime);

          const cycleTime = response.cycleTime;

          setCycleTime(cycleTime);

          const heatDeadBand = response.heatDeadBand;

          setHeating(heatDeadBand);

          const coolDeadBand = response.coolDeadBand;

          setCooling(coolDeadBand);

          setValues({
            fanDelay,

            fanOnDelay,

            fanOffDelay,

            minRunTime,

            antiShortTime,

            cycleTime,

            heatDeadBand,

            coolDeadBand,
          });

          resolve();
        }),
      );
    });
  }

  function setAdvancedSettingsFunction(value) {
    /* istanbul ignore next */ return new Promise((resolve, reject) => {
      dispatch(
        setAdvancedSettings(
          selectedDevice.macId,

          value,

          response => {
            resolve();
          },
        ),
      );
    });
  }

  const setFanDelay = async selected => {
    let replacementArray = OnValues[selected ? selected['0'] : 0].split(' ');

    let replacement = replacementArray[0];

    setOn(replacement);

    setValues({...values, fanDelay: replacement});

    await setAdvancedSettingsFunction({...values, fanDelay: replacement});

    /* istanbul ignore next */ DelayLoadValues();
  };

  const setFanOnDelay = async selected => {
    let replacementArray =
      OnElecValues[selected ? selected['0'] : 0].split(' ');

    let replacement = replacementArray[0];

    setOnElec(replacement);

    setValues({...values, fanOnDelay: replacement});

    await setAdvancedSettingsFunction({...values, fanOnDelay: replacement});

    /* istanbul ignore next */ DelayLoadValues();
  };

  const setFanOffDelay = async selected => {
    let replacementArray = OffValues[selected ? selected['0'] : 0].split(' ');

    let replacement = replacementArray[0];

    setOff(replacement);

    setValues({...values, fanOffDelay: replacement});

    await setAdvancedSettingsFunction({...values, fanOffDelay: replacement});

    /* istanbul ignore next */ DelayLoadValues();
  };

  const setMinRun = async selected => {
    let replacementArray =
      MinRunTimeValues[selected ? selected['0'] : 0].split(' ');

    let replacement = replacementArray[0];

    setMinRunTime((replacement * 60).toString());

    setValues({...values, minRunTime: replacement});

    await setAdvancedSettingsFunction({
      ...values,
      minRunTime: (replacement * 60).toString(),
    });

    /* istanbul ignore next */ DelayLoadValues();
  };

  const setAntiShortTime = async selected => {
    let replacementArray =
      AntiShortCycleValues[selected ? selected['0'] : 0].split(' ');

    let replacement = replacementArray[0];

    setMinRunTime((replacement * 60).toString());

    setValues({...values, antiShortTime: replacement});

    await setAdvancedSettingsFunction({
      ...values,
      antiShortTime: (replacement * 60).toString(),
    });

    /* istanbul ignore next */ DelayLoadValues();
  };

  const setCyTime = async selected => {
    let replacementArray =
      CycleTimeValues[selected ? selected['0'] : 0].split(' ');

    let replacement = replacementArray[0];

    setMinRunTime((replacement * 60).toString());

    setValues({...values, cycleTime: replacement});

    await setAdvancedSettingsFunction({
      ...values,
      cycleTime: (replacement * 60).toString(),
    });

    /* istanbul ignore next */ DelayLoadValues();
  };

  const setHeat = async selected => {
    let replacementArray =
      HeatingValues[selected ? selected['0'] : 0].split(' ');

    let replacement = replacementArray[0];

    setMinRunTime((replacement * 10).toString());

    setValues({...values, heatDeadBand: replacement});

    await setAdvancedSettingsFunction({
      ...values,
      heatDeadBand: (replacement * 10).toString(),
    });

    /* istanbul ignore next */ DelayLoadValues();
  };

  const setCool = async selected => {
    let replacementArray =
      CoolingValues[selected ? selected['0'] : 0].split(' ');

    let replacement = replacementArray[0];

    setMinRunTime((replacement * 10).toString());

    setValues({...values, coolDeadBand: replacement});

    await setAdvancedSettingsFunction({
      ...values,
      coolDeadBand: (replacement * 10).toString(),
    });

    /* istanbul ignore next */ DelayLoadValues();
  };

  function DelayLoadValues() {
    dispatch({
      type: 'SHOW_LOADING',

      data: true,
    });

    setTimeout(() => {
      loadRunTimeValues();
    }, 2000);
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'space-between',
      }}>
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
              text={'Advanced Settings'}
              size={21}
              allowFontScaling={true}
              font="medium"
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

      <View style={styles.tabContainer}>
        <Pressable
          testID="TabSystem"
          style={[
            styles.tabElement,

            {
              borderBottomWidth: currentTab == 0 ? 2 : 0,

              borderBottomColor: currentTab == 0 ? Colors.darkBlue : '',
            },
          ]}
          onPress={() => setCurrentTab(0)}>
          <View style={styles.alignSelfCenter}>
            <System fill={currentTab == 0 ? '#004975' : '#000'} />
          </View>

          <CustomText
            allowFontScaling={true}
            text={'System'}
            size={16}
            color={currentTab == 0 ? Colors.darkBlue : Colors.black}
          />
        </Pressable>

        <Pressable
          testID="TabInstaller"
          accessible={true}
          accessibilityLabel={'Installer tab'}
          accessibilityRole={'menuitem'}
          accessibilityHint={'Activate it to navigate to installer tab.'}
          style={[
            styles.tabElement,

            {
              borderBottomWidth: currentTab == 1 ? 2 : 0,

              borderBottomColor: currentTab == 1 ? Colors.darkBlue : '',
            },
          ]}
          onPress={() => setCurrentTab(1)}>
          <View style={styles.alignSelfCenter}>
            <Installer fill={currentTab == 1 ? '#004975' : '#000'} />
          </View>

          <CustomText
            allowFontScaling={true}
            text={'Installer'}
            size={16}
            color={currentTab == 1 ? Colors.darkBlue : Colors.black}
          />
        </Pressable>
      </View>
      {currentTab === 0 && (
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'space-between',
          }}>
          <ScrollView>
            <View>
              <View style={{paddingHorizontal: 15}}>
                <View style={{marginVertical: 10, paddingTop: 8}}>
                  <CustomText
                    allowFontScaling={true}
                    color={Colors.black}
                    font={'bold'}
                    text={'Advanced System Settings'}
                    align={'center'}
                    size={16}
                  />

                  <CustomText
                    allowFontScaling={true}
                    style={{marginTop: 10, paddingHorizontal: 20}}
                    color={Colors.black}
                    font={'medium'}
                    text={'Click the system values to modify their settings'}
                    align={'center'}
                    size={16}
                  />
                </View>
                <View style={{marginTop: 20}}>
                  <View>
                    <CustomText
                      allowFontScaling={true}
                      color={Colors.black}
                      font={'bold'}
                      text={'Fan Delay'}
                      align={'left'}
                      size={18}
                    />
                  </View>
                </View>

                <View style={{marginBottom: 10}}>
                  <CustomWheelPick
                    type={'picker'}
                    testID="On"
                    edit={true}
                    blur={true}
                    accessibilityHintText={'On'}
                    pickerWidth={'100%'}
                    placeholder={'On'}
                    value={On + ' s'}
                    isRequiredField={true}
                    values={OnValues}
                    defaultIndex={0}
                    defaultValue={OnValues[0]}
                    isSvgIcon={true}
                    icon={<CLOCK fill="#000" />}
                    onConfirm={selected => setFanDelay(selected)}
                    accessibilityWheelPickerValue={['The on delay time.']}
                  />
                </View>

                <View style={{marginBottom: 10}}>
                  <CustomWheelPick
                    type={'picker'}
                    testID="OnElec"
                    edit={true}
                    blur={true}
                    accessibilityHintText={'On Elec'}
                    pickerWidth={'100%'}
                    placeholder={'On Elec'}
                    value={OnElec + ' s'}
                    isRequiredField={true}
                    values={OnElecValues}
                    defaultIndex={0}
                    defaultValue={OnElecValues[0]}
                    isSvgIcon={true}
                    icon={<CLOCK fill="#000" />}
                    onConfirm={selected => setFanOnDelay(selected)}
                    accessibilityWheelPickerValue={['The on elec delay time.']}
                  />
                </View>

                <View style={{marginBottom: 10}}>
                  <CustomWheelPick
                    type={'picker'}
                    testID="Off"
                    edit={true}
                    blur={true}
                    accessibilityHintText={'Off'}
                    pickerWidth={'100%'}
                    placeholder={'Off'}
                    value={Off + ' s'}
                    isRequiredField={true}
                    values={OffValues}
                    defaultIndex={0}
                    defaultValue={OffValues[0]}
                    isSvgIcon={true}
                    icon={<CLOCK fill="#000" />}
                    onConfirm={selected => setFanOffDelay(selected)}
                    accessibilityWheelPickerValue={['The off delay time.']}
                  />
                </View>

                <View style={{marginTop: 20}}>
                  <View>
                    <CustomText
                      allowFontScaling={true}
                      color={Colors.black}
                      font={'bold'}
                      text={'Min. Run Time'}
                      align={'left'}
                      size={18}
                    />
                  </View>
                </View>

                <View style={{marginBottom: 10}}>
                  <CustomWheelPick
                    type={'picker'}
                    testID="MinRunTime"
                    edit={true}
                    blur={true}
                    accessibilityHintText={'Min. Run Time'}
                    pickerWidth={'100%'}
                    placeholder={'Min. Run Time'}
                    value={parseInt(MinRunTime / 60) + ' min'}
                    isRequiredField={true}
                    values={MinRunTimeValues}
                    defaultIndex={0}
                    defaultValue={MinRunTimeValues[0]}
                    isSvgIcon={true}
                    icon={<CLOCK fill="#000" />}
                    onConfirm={selected => setMinRun(selected)}
                    accessibilityWheelPickerValue={['the minimum run time.']}
                  />
                </View>

                <View style={{marginTop: 15}}>
                  <View>
                    <CustomText
                      allowFontScaling={true}
                      color={Colors.black}
                      font={'bold'}
                      text={'Anti Short Cycle'}
                      align={'left'}
                      size={18}
                    />
                  </View>
                </View>

                <View style={{marginBottom: 10}}>
                  <CustomWheelPick
                    type={'picker'}
                    testID="AntiShortCycle"
                    edit={true}
                    blur={true}
                    accessibilityHintText={'Anti Short Cycle'}
                    pickerWidth={'100%'}
                    placeholder={'Anti Short Cycle'}
                    value={parseInt(AntiShortCycle / 60) + ' min'}
                    isRequiredField={true}
                    values={AntiShortCycleValues}
                    defaultIndex={0}
                    defaultValue={AntiShortCycleValues[0]}
                    isSvgIcon={true}
                    icon={<CLOCK fill="#000" />}
                    onConfirm={selected => setAntiShortTime(selected)}
                    accessibilityWheelPickerValue={[
                      'the anti short cycle time.',
                    ]}
                  />
                </View>

                <View style={{marginTop: 15}}>
                  <View>
                    <CustomText
                      allowFontScaling={true}
                      color={Colors.black}
                      font={'bold'}
                      text={'Cycle Time'}
                      align={'left'}
                      size={18}
                    />
                  </View>
                </View>

                <View style={{marginBottom: 10}}>
                  <CustomWheelPick
                    type={'picker'}
                    testID="CycleTime"
                    edit={true}
                    blur={true}
                    accessibilityHintText={'Cycle Time'}
                    pickerWidth={'100%'}
                    placeholder={'Cycle Time'}
                    value={parseInt(CycleTime / 60) + ' min'}
                    isRequiredField={true}
                    values={CycleTimeValues}
                    defaultIndex={0}
                    defaultValue={CycleTimeValues[0]}
                    isSvgIcon={true}
                    icon={<CLOCK fill="#000" />}
                    onConfirm={selected => setCyTime(selected)}
                    accessibilityWheelPickerValue={['the cycle time.']}
                  />
                </View>

                <View style={{marginTop: 15}}>
                  <View>
                    <CustomText
                      allowFontScaling={true}
                      color={Colors.black}
                      font={'bold'}
                      text={'Zero Energy Band'}
                      align={'left'}
                      size={18}
                    />
                  </View>
                </View>

                <View style={{marginBottom: 10}}>
                  <CustomWheelPick
                    type={'picker'}
                    testID="Heating"
                    edit={true}
                    blur={true}
                    accessibilityHintText={'Heating'}
                    pickerWidth={'100%'}
                    placeholder={'Heating'}
                    value={
                      Heating / 10 +
                      (selectedDevice.isFahrenheit ? ' °F' : ' °C')
                    }
                    isRequiredField={true}
                    values={HeatingValues}
                    defaultIndex={0}
                    defaultValue={HeatingValues[0]}
                    isSvgIcon={true}
                    icon={<THERMOMETER fill="#000" />}
                    onConfirm={selected => setHeat(selected)}
                    accessibilityWheelPickerValue={[
                      'the heating zero energy band.',
                    ]}
                  />
                </View>

                <View style={{marginBottom: 10}}>
                  <CustomWheelPick
                    type={'picker'}
                    testID="Cooling"
                    edit={true}
                    blur={true}
                    accessibilityHintText={'Cooling'}
                    pickerWidth={'100%'}
                    placeholder={'Cooling'}
                    value={
                      Cooling / 10 +
                      (selectedDevice.isFahrenheit ? ' °F' : ' °C')
                    }
                    isRequiredField={true}
                    values={CoolingValues}
                    defaultIndex={0}
                    defaultValue={CoolingValues[0]}
                    isSvgIcon={true}
                    icon={<THERMOMETER fill="#000" />}
                    onConfirm={selected => setCool(selected)}
                    accessibilityWheelPickerValue={[
                      'the cooling zero energy band.',
                    ]}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )}

      {currentTab === 1 && (
        <View
          testID="InstallerView"
          style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'space-between',
          }}>
          <ScrollView>
            <View>
              <View style={{paddingHorizontal: 15}}>
                <View style={{marginVertical: 10}}>
                  <CustomText
                    allowFontScaling={true}
                    color={Colors.black}
                    font={'bold'}
                    text={'Installer Access'}
                    align={'center'}
                    size={18}
                  />

                  <CustomText
                    allowFontScaling={true}
                    style={{marginTop: 10, paddingHorizontal: 20}}
                    color={Colors.black}
                    font={'medium'}
                    text={
                      'Enter one of the Action Codes below to access advanced settings options'
                    }
                    align={'center'}
                    size={16}
                  />
                </View>

                <View>
                  <CustomInputText
                    accessibilityLabelText="Access Code"
                    accessibilityHintText="Enter the access code to navigate to the different configuration screens."
                    testID="CodeTextInput"
                    placeholder={
                      Dictionary.bccDashboard.settings.advanced_settingsScreen
                        .accessCode
                    }
                    keyboardType={'default'}
                    value={manualEntry.accessCode}
                    maxLength={3}
                    isRequiredField={true}
                    onChange={val => {
                      onChangeHandler(val);
                    }}
                    errorText={
                      manualEntryError.accessCode
                        ? Dictionary.bccDashboard.settings
                            .advanced_settingsScreen.accessCode
                        : ''
                    }
                    Icon={LockIcon}
                    isSvgIcon={true}
                    autoCapitalize={'characters'}
                  />
                </View>
                <View style={{marginTop: 32}}>
                  <TipsList />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    borderBottomWidth: 1,

    borderColor: '#BFC0C2',

    paddingVertical: 25,
  },

  tabContainer: {
    flexDirection: 'row',

    borderBottomWidth: 1,

    borderBottomColor: '#A8ADB2',

    justifyContent: 'space-between',

    height: 63,

    marginHorizontal: 16,
  },

  tabElement: {
    paddingHorizontal: 20,

    justifyContent: 'center',

    marginHorizontal: 5,

    flex: 0.5,
  },

  alignSelfCenter: {alignSelf: 'center'},

  tipSection: {
    flexDirection: 'row',

    marginTop: 20,
  },

  flexShrink1: {
    flexShrink: 1,
  },

  paddingLeft5: {
    paddingLeft: 12,
  },

  buttonView: {
    paddingBottom: 30,
  },
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
    selectedDevice: state.homeOwner.selectedDevice,
  };
};

const mapDispatchToProps = {
  setisOnboardingBcc50,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScreenAdvancedSettings2);
