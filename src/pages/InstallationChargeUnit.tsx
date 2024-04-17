/**
 * @file Charge Unit is a tab in the installation dashboard for Constractor.
 * @author Krishna Priya Elango
 *
 */
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Image,
  View,
  TextInput,
  Platform,
  TouchableNativeFeedback,
} from 'react-native';
import {
  Banner,
  Button,
  CustomPicker,
  CustomText,
  InfoTooltip,
} from '../components';
import {Colors} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {Icons} from '../utils/icons';
import {chargeUnitRange} from '../utils/enum';
import {pressureLookup} from '../utils/tables';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import * as ContractorActions from '../store/actions/ContractorActions';
import {showToast} from '../components/CustomToast';

export default function InstallationChargeUnit(props: any) {
  const demoMode = useSelector(state => state.notification.demoStatus);
  const enterValue = Dictionary.installationDashboard.enterValue;
  const chargeUnitMethods = [
    {method: '1', title: Dictionary.installationDashboard.chargeUnitMethod1},
    {method: '2', title: Dictionary.installationDashboard.chargeUnitMethod2},
  ];
  const capacity = [
    {capacity: '2 Ton', j2: 2},
    {capacity: '3 Ton', j2: 3},
    {capacity: '4 Ton', j2: 4},
    {capacity: '5 Ton', j2: 5},
  ];
  const [selectedMethod, setSelectedMethod] = useState(chargeUnitMethods[0]);
  const [dischargePressure, setDischargePressure] = useState('');
  const [dischargeSatTemp, setDischargeSatTemp] = useState('');
  const [dischargeTemp, setDischargeTemp] = useState('');
  const [suctionPressure, setSuctionPressure] = useState('');
  const [suctionSatTemp, setSuctionSatTemp] = useState('');
  const [suctionTemp, setSuctionTemp] = useState('');
  const [subcoolCalc, setSubcoolCalc] = useState('');
  const [superheatCalc, setSuperheatCalc] = useState('');
  const [subcoolInput, setSubcoolInput] = useState('');
  const [superheatInput, setSuperheatInput] = useState('');
  const [addedCharge, setAddedCharge] = useState('');
  const [lineset, setLineset] = useState('');
  const [validatorCalc, setValidatorCalc] = useState(null);
  const [validatorInput, setValidatorInput] = useState(null);
  const [errorList, setErrorList] = useState([]);
  const [selectedCapacity, setSelectedCapacity] = useState(capacity[0]);
  const [j2, setJ2] = useState(selectedCapacity.j2);
  const tabs = [
    {id: 0, title: Dictionary.installationDashboard.calculateValues},
    {id: 1, title: Dictionary.installationDashboard.inputValues},
  ];
  const [currentTab, setCurrentTab] = useState(0);
  const [image, setImage] = useState();
  const rippleEffect = TouchableNativeFeedback.Ripple(
    Colors.mediumGray,
    true,
    70,
  );
  const dispatch = useDispatch();
  const gatewayId = useSelector(
    state => state.contractor.selectedUnit.gateway.gatewayId,
  );
  const savedValueSubcool = useSelector(
    state => state.contractor.selectedUnit.chargeUnit.method1,
  );
  const savedValueWeighIn = useSelector(
    state => state.contractor.selectedUnit.chargeUnit.method2,
  );
  const modelNumber = useSelector(
    state => state.contractor.selectedUnit.odu.modelNumber,
  );

  useEffect(() => {
    if (modelNumber.includes('BOVB-36') || modelNumber.includes('BOVC-36')) {
      setImage(require('../assets/images/chargeunit3t.png'));
    }
    if (modelNumber.includes('BOVB-60') || modelNumber.includes('BOVC-60')) {
      setImage(require('../assets/images/chargeunit5t.png'));
    }
  }, [modelNumber]);

  useEffect(() => {
    if (!demoMode) {
      dispatch(ContractorActions.getChargeUnitValue(gatewayId));
    }
    const unsubscribe = props.navigation.addListener('willFocus', () => {
      clearForm();
    });
    return () => {
      unsubscribe.remove();
    };
  }, []);

  useEffect(() => {
    setJ2(selectedCapacity.j2);
  }, [selectedCapacity]);

  useEffect(() => {
    setSubcoolCalc('');
    if (Number(dischargePressure) >= 48 && Number(dischargePressure) <= 580) {
      setErrorList(oldList =>
        oldList.filter(item => item !== 'dischargePressure'),
      );
      setDischargeSatTemp(lookup(dischargePressure));
    } else {
      setDischargeSatTemp('');
      setErrorList(oldList => [...oldList, 'dischargePressure']);
    }
  }, [dischargePressure]);

  useEffect(() => {
    setSuperheatCalc('');
    if (Number(suctionPressure) >= 48 && Number(suctionPressure) <= 580) {
      setErrorList(oldList =>
        oldList.filter(item => item !== 'suctionPressure'),
      );
      setSuctionSatTemp(lookup(suctionPressure));
    } else {
      setSuctionSatTemp('');
      setErrorList(oldList => [...oldList, 'suctionPressure']);
    }
  }, [suctionPressure]);

  useEffect(() => {
    setSuperheatCalc('');
    function calculateSuperHeat() {
      let value =
        suctionSatTemp !== '' && suctionTemp !== ''
          ? Math.round(Number(suctionTemp) - Number(suctionSatTemp)).toString()
          : '';
      setSuperheatCalc(value);
    }
    if (Number(suctionTemp) >= 0 && Number(suctionTemp) <= 146) {
      calculateSuperHeat();
      setErrorList(oldList => oldList.filter(item => item !== 'suctionTemp'));
    } else {
      setErrorList(oldList => [...oldList, 'suctionTemp']);
    }
  }, [suctionSatTemp, suctionTemp]);

  useEffect(() => {
    setSubcoolCalc('');
    function calculateSubcool() {
      let value =
        dischargeSatTemp !== '' && dischargeTemp !== ''
          ? Math.round(
              Number(dischargeSatTemp) - Number(dischargeTemp),
            ).toString()
          : '';
      setSubcoolCalc(value);
    }
    if (Number(dischargeTemp) >= 0 && Number(dischargeTemp) <= 146) {
      calculateSubcool();
      setErrorList(oldList => oldList.filter(item => item !== 'dischargeTemp'));
    } else {
      setErrorList(oldList => [...oldList, 'dischargeTemp']);
    }
  }, [dischargeSatTemp, dischargeTemp]);

  useEffect(() => {
    function calculateAddedCharge() {
      let value =
        Number(lineset) >= 15
          ? Math.round((Number(lineset) - 15) * 0.6).toString() + ' oz'
          : '';
      setAddedCharge(value);
      if (Number(lineset) >= 15) {
        setErrorList(oldList => oldList.filter(item => item !== 'lineset'));
      } else {
        setErrorList(oldList => [...oldList, 'lineset']);
      }
    }
    calculateAddedCharge();
  }, [lineset]);

  const lookup = (pressure: string) => {
    let intVal = Number(pressure);
    let prev: number, next: number;
    prev = intVal - 1;
    next = intVal + 1;
    if (pressureLookup[intVal] !== undefined) {
      return pressureLookup[intVal];
    } else {
      return (Number(pressureLookup[prev]) + Number(pressureLookup[next])) / 2;
    }
  };

  useEffect(() => {
    const range = chargeUnitRange;
    const banner = {
      success: {
        iconName: Icons.checkmarkFrame,
        iconColor: Colors.darkGreen,
        background: Colors.lightGreen,
      },
      alert: {
        iconName: Icons.alertError,
        iconColor: Colors.darkRed,
        background: Colors.lightRed,
      },
    };

    function checkSuperheatRange(LB, UB, superheatVal) {
      if (
        superheatVal >= range[j2].SH[LB] &&
        superheatVal <= range[j2].SH[UB]
      ) {
        return {
          superheat: true,
          message: Dictionary.installationDashboard.chargedCorrectly,
        };
      } else if (superheatVal > range[j2].SH[UB]) {
        return {
          superheat: false,
          message: Dictionary.installationDashboard.superheatHigh,
        };
      } else if (superheatVal < range[j2].SH[LB]) {
        return {
          superheat: false,
          message: Dictionary.installationDashboard.superheatLow,
        };
      }
    }
    function checkSubcoolRange(LB, UB, subcoolVal, superheatVal) {
      let subcoolCheck = {};
      let superheatCheck = {};
      if (subcoolVal >= range[j2].SC[LB] && subcoolVal <= range[j2].SC[UB]) {
        subcoolCheck = {
          subcool: true,
          message: Dictionary.installationDashboard.chargedCorrectly,
        };
        superheatCheck = checkSuperheatRange(LB, UB, superheatVal);
      } else if (subcoolVal < range[j2].SC[LB]) {
        subcoolCheck = {
          subcool: false,
          message: Dictionary.installationDashboard.subcoolLow,
        };
        superheatCheck = checkSuperheatRange(LB, UB, superheatVal);
      } else if (subcoolVal > range[j2].SC[UB]) {
        subcoolCheck = {
          subcool: false,
          message: Dictionary.installationDashboard.subcoolHigh,
        };
        superheatCheck = checkSuperheatRange(LB, UB, superheatVal);
      }
      return {subcoolCheck, superheatCheck};
    }
    function rangeCheck(subcool, superheat) {
      const subcoolVal = subcool;
      const superheatVal = superheat;
      var check1 = null;
      var check2 = null;
      check1 = checkSubcoolRange('LB', 'UB', subcoolVal, superheatVal);
      check2 = checkSubcoolRange('LB2', 'UB2', subcoolVal, superheatVal);
      if (
        (check1.subcoolCheck.subcool && check1.superheatCheck.superheat) ||
        (check2.subcoolCheck.subcool && check2.superheatCheck.superheat)
      ) {
        return {
          subcool: true,
          superheat: true,
          banner: {
            ...banner.success,
            text: Dictionary.installationDashboard.chargedCorrectly,
          },
        };
      } else if (
        (check1.subcoolCheck.subcool && !check1.superheatCheck.superheat) ||
        (check2.subcoolCheck.subcool && !check2.superheatCheck.superheat)
      ) {
        return {
          subcool: true,
          superheat: false,
          banner: {
            ...banner.alert,
            text: !check1.superheatCheck.superheat
              ? check1.superheatCheck.message
              : check2.superheatCheck.message,
          },
        };
      } else if (!check1.subcoolCheck.subcool || !check2.subcoolCheck.subcool) {
        return {
          subcool: false,
          superheat:
            check1.superheatCheck.superheat || check2.superheatCheck.superheat,
          banner: {
            ...banner.alert,
            text: !check1.subcoolCheck.subcool
              ? check1.subcoolCheck.message
              : check2.subcoolCheck.message,
          },
        };
      }
    }
    if (subcoolCalc !== '' && superheatCalc !== '') {
      setValidatorCalc(rangeCheck(subcoolCalc, superheatCalc));
    } else {
      setValidatorCalc(null);
    }

    if (subcoolInput !== '' && superheatInput !== '') {
      setValidatorInput(rangeCheck(subcoolInput, superheatInput));
    } else {
      setValidatorInput(null);
    }
  }, [j2, subcoolCalc, superheatCalc, superheatInput, subcoolInput]);

  const clearForm = () => {
    setSubcoolInput('');
    setSuperheatInput('');
    setSubcoolCalc('');
    setSuperheatCalc('');
    setSuctionPressure('');
    setSuctionTemp('');
    setDischargePressure('');
    setDischargeTemp('');
    setLineset('');
  };

  const saveSuccess = () => {
    clearForm();
    showToast(Dictionary.common.saveSuccess, 'success');
  };

  const save = () => {
    let date = new Date().getTime();
    if (selectedMethod.method === '1') {
      let subcool, superheat;
      if (currentTab === 0) {
        subcool = subcoolCalc;
        superheat = superheatCalc;
      }
      if (currentTab === 1) {
        subcool = subcoolInput;
        superheat = superheatInput;
      }
      if (demoMode) {
        dispatch(
          ContractorActions.setChargeUnitDemoValues(
            {
              method1: {
                // contractorId: 'bb8ad21d-b783-4e60-8134-c5a0e2378cfe',
                lastSavedDate: date,
                subcool: subcool + Dictionary.installationDashboard.tempUnit,
                superheat:
                  superheat + Dictionary.installationDashboard.tempUnit,
              },
            },
            saveSuccess,
          ),
        );
      } else {
        dispatch(
          ContractorActions.setChargeUnitValue(
            {
              methodType: 'method1',
              subcool: subcool + Dictionary.installationDashboard.tempUnit,
              superheat: superheat + Dictionary.installationDashboard.tempUnit,
              lastSavedDate: date,
              gatewayId: gatewayId,
            },
            saveSuccess,
          ),
        );
      }
    }
    if (selectedMethod.method === '2') {
      if (demoMode) {
        dispatch(
          ContractorActions.setChargeUnitDemoValues(
            {
              method2: {
                // contractorId: 'bb8ad21d-b783-4e60-8134-c5a0e2378cfe',
                addedCharge: addedCharge,
                lastSavedDate: date,
              },
            },
            saveSuccess,
          ),
        );
      } else {
        dispatch(
          ContractorActions.setChargeUnitValue(
            {
              methodType: 'method2',
              addedCharge: addedCharge,
              lastSavedDate: date,
              gatewayId: gatewayId,
            },
            saveSuccess,
          ),
        );
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <CustomPicker
          placeholder={Dictionary.createProfile.pleaseSelect + 'Charge unit'}
          value={selectedMethod.title}
          onChange={(
            val: React.SetStateAction<{method: string; title: string}>,
          ) => {
            return setSelectedMethod(val);
          }}
          style={styles.pickerStyle}
          options={chargeUnitMethods}
          iteratorKey="method"
          iteratorLabel="title"
        />
        {selectedMethod.method === '1' && (
          <View style={styles.marginTop10}>
            <View style={styles.paddingHorizontal20}>
              {savedValueSubcool && (
                <View
                  style={[
                    styles.grayContainer,
                    styles.row,
                    styles.marginBot20,
                  ]}>
                  <CustomText
                    size={12}
                    font="light-italic"
                    text={
                      Dictionary.installationDashboard.subcool +
                      ': ' +
                      savedValueSubcool.subcool +
                      '\n' +
                      Dictionary.installationDashboard.superheat +
                      ': ' +
                      savedValueSubcool.superheat
                    }
                    align="left"
                  />
                  <CustomText
                    size={12}
                    font="light-italic"
                    text={
                      'Last values saved on: ' +
                      moment(savedValueSubcool.lastSavedDate).format(
                        'MM/DD/YYYY',
                      )
                    }
                    align="left"
                    style={styles.marginLeft20}
                  />
                </View>
              )}
              <CustomText
                text={Dictionary.installationDashboard.chargeUnitSubcool}
                align="left"
                newline={true}
                size={12}
              />
              <Image source={image} style={styles.chargeUnitImage} />
              <CustomText
                text={Dictionary.installationDashboard.chargeUnitForceMode}
                align="left"
                newline={true}
                size={12}
              />
              <View style={[styles.row]}>
                <CustomText
                  font="bold"
                  align="left"
                  text={Dictionary.installationDashboard.systemCapacity}
                  style={styles.width60}
                />
                <CustomPicker
                  placeholder={
                    Dictionary.createProfile.pleaseSelect + 'Capacity'
                  }
                  value={selectedCapacity.capacity}
                  onChange={(
                    val: React.SetStateAction<{capacity: string; j2: number}>,
                  ) => {
                    return setSelectedCapacity(val);
                  }}
                  style={[styles.width40, styles.pickerStyle]}
                  options={capacity}
                  iteratorKey="j2"
                  iteratorLabel="capacity"
                />
              </View>
              <CustomText
                font="bold"
                align="left"
                text={Dictionary.installationDashboard.determineValues}
                style={[styles.paddingVertical10, styles.marginTop20]}
              />
            </View>
            <View style={[styles.tabView]}>
              {tabs.map(tab => (
                <TouchableNativeFeedback
                  background={rippleEffect}
                  key={tab.id}
                  onPress={() => setCurrentTab(tab.id)}>
                  <View>
                    <CustomText
                      text={tab.title}
                      size={16}
                      style={styles.tabPadding}
                      color={
                        currentTab === tab.id ? Colors.darkBlue : Colors.black
                      }
                      key={tab.id}
                    />
                    {currentTab === tab.id && (
                      <View style={styles.tabUnderline} />
                    )}
                  </View>
                </TouchableNativeFeedback>
              ))}
            </View>
            {currentTab === 0 && (
              <View style={styles.paddingHorizontal20}>
                <CustomText
                  text={Dictionary.installationDashboard.calculateSubcool}
                  align="left"
                  font="bold"
                />
                <View style={styles.marginBot30}>
                  <View style={styles.row}>
                    <CustomText
                      text={Dictionary.installationDashboard.dischargePressure}
                      align="left"
                      style={styles.width60}
                    />
                    <View style={styles.width40}>
                      <TextInput
                        placeholder={enterValue}
                        keyboardType="number-pad"
                        value={dischargePressure}
                        onChangeText={(text: any) =>
                          setDischargePressure(text.replace(/[^0-9]/, ''))
                        }
                        style={[
                          styles.textInput,
                          Platform.OS === 'ios' && styles.paddingVertical10,
                        ]}
                        maxLength={3}
                      />
                      {errorList.includes('dischargePressure') &&
                        dischargePressure !== '' && (
                          <CustomText
                            align="left"
                            size={10}
                            color={Colors.darkRed}
                            text={
                              Dictionary.installationDashboard.pressureRange
                            }
                          />
                        )}
                    </View>
                  </View>
                  <View style={styles.row}>
                    <CustomText
                      text={
                        Dictionary.installationDashboard.dischargeTemperature
                      }
                      align="left"
                      style={styles.width60}
                    />
                    <View style={styles.width40}>
                      <TextInput
                        placeholder={enterValue}
                        keyboardType="number-pad"
                        value={dischargeTemp}
                        onChangeText={(text: any) =>
                          setDischargeTemp(text.replace(/[^0-9]/, ''))
                        }
                        style={[
                          styles.textInput,
                          Platform.OS === 'ios' && styles.paddingVertical10,
                        ]}
                        maxLength={3}
                      />
                      {errorList.includes('dischargeTemp') && (
                        <CustomText
                          align="left"
                          size={10}
                          color={Colors.darkRed}
                          text={Dictionary.installationDashboard.tempRange}
                        />
                      )}
                    </View>
                  </View>
                </View>
                <CustomText
                  text={Dictionary.installationDashboard.calculateSuperheat}
                  align="left"
                  font="bold"
                />
                <View style={styles.marginBot30}>
                  <View style={styles.row}>
                    <CustomText
                      text={Dictionary.installationDashboard.suctionPressure}
                      align="left"
                      style={styles.width60}
                    />
                    <View style={styles.width40}>
                      <TextInput
                        placeholder={enterValue}
                        keyboardType="number-pad"
                        value={suctionPressure}
                        onChangeText={(text: any) =>
                          setSuctionPressure(text.replace(/[^0-9]/, ''))
                        }
                        style={[
                          styles.textInput,
                          Platform.OS === 'ios' && styles.paddingVertical10,
                        ]}
                        maxLength={3}
                      />
                      {errorList.includes('suctionPressure') &&
                        suctionPressure !== '' && (
                          <CustomText
                            align="left"
                            size={10}
                            color={Colors.darkRed}
                            text={
                              Dictionary.installationDashboard.pressureRange
                            }
                          />
                        )}
                    </View>
                  </View>
                  <View style={styles.row}>
                    <CustomText
                      text={Dictionary.installationDashboard.suctionTemperature}
                      align="left"
                      style={styles.width60}
                    />
                    <View style={styles.width40}>
                      <TextInput
                        placeholder={enterValue}
                        keyboardType="number-pad"
                        value={suctionTemp}
                        onChangeText={(text: any) =>
                          setSuctionTemp(text.replace(/[^0-9]/, ''))
                        }
                        style={[
                          styles.textInput,
                          Platform.OS === 'ios' && styles.paddingVertical10,
                        ]}
                        maxLength={3}
                      />
                      {errorList.includes('suctionTemp') && (
                        <CustomText
                          align="left"
                          size={10}
                          color={Colors.darkRed}
                          text={Dictionary.installationDashboard.tempRange}
                        />
                      )}
                    </View>
                  </View>
                </View>
                <View style={[styles.row, styles.grayContainer]}>
                  <View style={styles.flex1}>
                    <CustomText
                      text={Dictionary.installationDashboard.subcool}
                      size={14}
                      font="bold"
                      style={styles.paddingVertical10}
                    />
                    <View style={[styles.row, styles.paddingHorizontal20]}>
                      {validatorCalc && (
                        <Image
                          source={
                            validatorCalc.subcool
                              ? Icons.checkmarkFilledImage
                              : Icons.abortFilledImage
                          }
                        />
                      )}
                      <CustomText
                        align="left"
                        text={
                          subcoolCalc +
                          ' ' +
                          Dictionary.installationDashboard.tempUnit
                        }
                      />
                    </View>
                  </View>
                  <View style={styles.flex1}>
                    <CustomText
                      text={Dictionary.installationDashboard.superheat}
                      size={14}
                      font="bold"
                      style={styles.paddingVertical10}
                    />
                    <View style={[styles.row, styles.paddingHorizontal20]}>
                      {validatorCalc && (
                        <Image
                          source={
                            validatorCalc.superheat
                              ? Icons.checkmarkFilledImage
                              : Icons.abortFilledImage
                          }
                        />
                      )}
                      <CustomText
                        align="left"
                        text={
                          superheatCalc +
                          ' ' +
                          Dictionary.installationDashboard.tempUnit
                        }
                      />
                    </View>
                  </View>
                  <View style={styles.tooltip}>
                    <InfoTooltip positionVertical="top">
                      <Image
                        style={[styles.chargeUnitImage]}
                        source={require('../assets/images/chargeunit_table.png')}
                      />
                    </InfoTooltip>
                  </View>
                </View>
                {validatorCalc && <Banner data={validatorCalc.banner} />}
                <Button
                  style={styles.paddingVertical10}
                  type="primary"
                  disabled={
                    !(
                      validatorCalc &&
                      validatorCalc.subcool &&
                      validatorCalc.superheat
                    )
                  }
                  text={Dictionary.button.save}
                  onPress={() => save()}
                />
              </View>
            )}
            {currentTab === 1 && (
              <View style={[styles.paddingHorizontal20]}>
                <View style={[styles.row, styles.grayContainer]}>
                  <View style={styles.flex1}>
                    <CustomText
                      text={Dictionary.installationDashboard.subcool}
                      size={14}
                      font="bold"
                      style={styles.paddingVertical10}
                    />
                    <View style={[styles.row, styles.paddingHorizontal20]}>
                      {validatorInput && (
                        <Image
                          source={
                            validatorInput.subcool
                              ? Icons.checkmarkFilledImage
                              : Icons.abortFilledImage
                          }
                        />
                      )}
                      <TextInput
                        placeholder={enterValue}
                        keyboardType="number-pad"
                        value={subcoolInput}
                        onChangeText={(text: any) => {
                          setSubcoolInput(text.replace(/[^0-9]/, ''));
                        }}
                        style={[
                          styles.textInput,
                          Platform.OS === 'ios' && styles.paddingVertical10,
                          validatorInput
                            ? validatorInput.subcool
                              ? styles.valid
                              : styles.invalid
                            : {},
                        ]}
                        maxLength={2}
                      />
                      <CustomText
                        align="left"
                        text={Dictionary.installationDashboard.tempUnit}
                      />
                    </View>
                  </View>
                  <View style={styles.flex1}>
                    <CustomText
                      text={Dictionary.installationDashboard.superheat}
                      size={14}
                      font="bold"
                      style={styles.paddingVertical10}
                    />
                    <View style={[styles.row, styles.paddingHorizontal20]}>
                      {validatorInput && (
                        <Image
                          source={
                            validatorInput.superheat
                              ? Icons.checkmarkFilledImage
                              : Icons.abortFilledImage
                          }
                        />
                      )}
                      <TextInput
                        placeholder={enterValue}
                        keyboardType="number-pad"
                        value={superheatInput}
                        onChangeText={(text: any) => {
                          setSuperheatInput(text.replace(/[^0-9]/, ''));
                        }}
                        style={[
                          styles.textInput,
                          Platform.OS === 'ios' && styles.paddingVertical10,
                          validatorInput
                            ? validatorInput.superheat
                              ? styles.valid
                              : styles.invalid
                            : {},
                        ]}
                        maxLength={2}
                      />
                      <CustomText
                        align="left"
                        text={Dictionary.installationDashboard.tempUnit}
                      />
                    </View>
                  </View>
                  <View style={styles.tooltip}>
                    <InfoTooltip positionVertical="top">
                      <Image
                        style={[styles.chargeUnitImage]}
                        source={require('../assets/images/chargeunit_table.png')}
                      />
                    </InfoTooltip>
                  </View>
                </View>
                {validatorInput && <Banner data={validatorInput.banner} />}
                <Button
                  style={styles.paddingVertical10}
                  type="primary"
                  disabled={
                    !(
                      validatorInput &&
                      validatorInput.subcool &&
                      validatorInput.superheat
                    )
                  }
                  text={Dictionary.button.save}
                  onPress={() => save()}
                />
              </View>
            )}
          </View>
        )}
        {selectedMethod.method === '2' && (
          <View style={[styles.paddingHorizontal20, styles.marginTop10]}>
            {savedValueWeighIn && (
              <View
                style={[styles.grayContainer, styles.row, styles.marginBot30]}>
                <CustomText
                  size={12}
                  font="light-italic"
                  text={
                    Dictionary.installationDashboard.addedCharge +
                    ': ' +
                    savedValueWeighIn.addedCharge
                  }
                  align="left"
                />

                <CustomText
                  size={12}
                  font="light-italic"
                  text={
                    'Last values saved on: ' +
                    moment(savedValueWeighIn.lastSavedDate).format('MM/DD/YYYY')
                  }
                  align="left"
                  style={styles.marginLeft20}
                />
              </View>
            )}
            <CustomText
              text={Dictionary.installationDashboard.chargeUnitWeighIn}
              align="left"
              newline={true}
              size={12}
            />
            <View style={styles.marginBot30}>
              <View style={[styles.row, styles.marginBot30]}>
                <CustomText
                  text={Dictionary.installationDashboard.linesetLength}
                  align="left"
                  style={styles.width60}
                />
                <View style={styles.width40}>
                  <TextInput
                    style={[
                      styles.textInput,
                      Platform.OS === 'ios' && styles.paddingVertical10,
                    ]}
                    keyboardType="number-pad"
                    placeholder={enterValue}
                    value={lineset}
                    onChangeText={text =>
                      setLineset(text.replace(/[^0-9]/, ''))
                    }
                    maxLength={5}
                  />
                  {errorList.includes('lineset') && lineset !== '' && (
                    <CustomText
                      align="left"
                      size={10}
                      color={Colors.darkRed}
                      text={Dictionary.installationDashboard.linesetRange}
                    />
                  )}
                </View>
              </View>
              <View style={styles.row}>
                <CustomText
                  text={Dictionary.installationDashboard.recommendedCharge}
                  align="left"
                  style={styles.width60}
                />
                <View style={styles.width40}>
                  <CustomText text={addedCharge} align="center" />
                </View>
              </View>
            </View>
            <Button
              style={styles.paddingVertical10}
              type="primary"
              disabled={addedCharge === ''}
              text={Dictionary.button.save}
              onPress={() => save()}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 20,
    flexGrow: 1,
  },
  flex1: {
    flex: 1,
  },
  pickerStyle: {
    marginBottom: 0,
    marginHorizontal: 20,
  },
  chargeUnitImage: {
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  grayContainer: {
    backgroundColor: Colors.lightGray,
    padding: 15,
  },
  textInput: {
    borderBottomColor: Colors.mediumGray,
    borderBottomWidth: 1,
    flex: 1,
    textAlign: 'center',
    color: Colors.black,
  },
  valid: {
    marginLeft: 10,
    borderBottomColor: Colors.darkGreen,
  },
  invalid: {
    marginLeft: 10,
    borderBottomColor: Colors.darkRed,
  },
  width60: {
    width: '60%',
  },
  width40: {
    width: '40%',
  },
  tooltip: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  marginTop10: {
    marginTop: 10,
  },
  marginTop20: {
    marginTop: 20,
  },
  marginBot20: {
    marginBottom: 20,
  },
  marginBot30: {
    marginBottom: 30,
  },
  pad15: {
    padding: 15,
  },
  paddingVertical10: {
    paddingVertical: 10,
  },
  paddingHorizontal20: {
    paddingHorizontal: 20,
  },
  marginLeft20: {
    marginLeft: 20,
  },
  tabUnderline: {
    borderBottomColor: Colors.darkBlue,
    borderBottomWidth: 2,
  },
  tabView: {
    borderBottomColor: Colors.mediumGray,
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 1,
    marginBottom: 20,
  },
  tabPadding: {
    paddingVertical: 10,
  },
});
