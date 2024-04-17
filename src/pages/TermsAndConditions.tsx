/**
 * @file Terms and Conditions is displayed when user opens app for the first time.
 * Displays terms and conditions.
 * User has to check "I agree" checkbox and click Accept to navigate to Login page.
 * @author Krishna Priya Elango
 *
 */
import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors, Typography} from '../styles';
import {useDispatch, useSelector} from 'react-redux';
import {Button, CheckBox, Link} from '../components';
import {Dictionary} from '../utils/dictionary';
import {
  getTermsandcondition,
  updateTermsAndConditions,
} from '../store/actions/AuthActions';
import {updateTermsAndConditionFlag} from '../store/actions/ContractorActions';
import {updateHomeOwnerTermsAndConditionFlag} from '../store/actions/HomeOwnerActions';
import {userRole} from '../utils/enum';
import {Image} from 'react-native';

type Props = {
  navigation: any;
};
const TermsAndConditions = (props: Props) => {
  const [listToCheck, setListTocheck] = useState([]);
  const [userType, setUserType] = useState('');
  const dispatch = useDispatch();
  const termsandconditions = useSelector(
    state => state.auth.termsandconditions,
  );
  let accessibilityText = [];
  const {navigation} = props;

  useEffect(() => {
    dispatch(getTermsandcondition());

    AsyncStorage.getItem('userRole').then(value => {
      if (value === null) {
        setUserType('');
      } else {
        setUserType(value);
      }
    });
  }, []);

  useEffect(() => {
    for (
      let i = 0;
      i < termsandconditions && termsandconditions.checkbox.length;
      i++
    ) {
      let tempCheckBox = termsandconditions.checkbox[i];
      let label = '';
      for (let j = 0; j < tempCheckBox.length; j++) {
        label = label + ' ' + tempCheckBox[j].text;
      }
      accessibilityText.push(label);
    }
  }, [termsandconditions]);

  const addToListToCheck = (id, isChecked) => {
    if (isChecked) {
      let newCheckList = [...listToCheck];
      newCheckList.push(id);
      setListTocheck(newCheckList);
    } else {
      let newCheckList = [...listToCheck];
      let index = newCheckList.indexOf(id);
      if (index !== -1) {
        newCheckList.splice(index, 1);
      }
      setListTocheck(newCheckList);
    }
  };

  const validateUserTerms = () => {
    if (userType === '') {
      AsyncStorage.setItem(
        'termsAcceptedVersion',
        termsandconditions.versionId.toString(),
      );
      AsyncStorage.setItem('isLoggedin', 'false').then(() => {
        navigation.replace('Login');
      });
    } else if (userType === 'HomeOwner') {
      let input = {
        versionId: termsandconditions.versionId.toString(),
        userGroup: 'HomeOwner',
      };
      dispatch(
        updateTermsAndConditions(input, () => {
          AsyncStorage.setItem(
            'termsAcceptedVersion',
            termsandconditions.versionId.toString(),
          );
          dispatch(
            updateHomeOwnerTermsAndConditionFlag(() => {
              AsyncStorage.setItem('isLoggedin', 'true');
              navigation.replace('HomeTabs');
            }),
          );
        }),
      );
    } else if (userType === 'Contractor') {
      let input = {
        versionId: termsandconditions.versionId.toString(),
        userGroup: 'Contractor',
      };
      dispatch(
        updateTermsAndConditions(input, () => {
          AsyncStorage.setItem(
            'termsAcceptedVersion',
            termsandconditions.versionId.toString(),
          );
          dispatch(
            updateTermsAndConditionFlag(() => {
              AsyncStorage.setItem('isLoggedin', 'true');
              navigation.replace('ContractorHome', {
                tab: 'map',
              });
            }),
          );
        }),
      );
    } else if (userType === 'ContractorPowerUser') {
      let input = {
        versionId: termsandconditions.versionId.toString(),
        userGroup: 'ContractorPowerUser',
      };
      dispatch(
        updateTermsAndConditions(input, () => {
          AsyncStorage.setItem(
            'termsAcceptedVersion',
            termsandconditions.versionId.toString(),
          );
          dispatch(
            updateTermsAndConditionFlag(() => {
              AsyncStorage.setItem('isLoggedin', 'true');
              navigation.replace('ContractorHome', {
                tab: 'map',
              });
            }),
          );
        }),
      );
    }
    AsyncStorage.setItem('termsAccepted', 'true');
  };
  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        {termsandconditions && termsandconditions.content && (
          <View>
            <Text style={styles.textJustify} key={'text1'}>
              {termsandconditions.content.map((item, index) => (
                <Text style={styles.row} key={index}>
                  {item.link === '' && (
                    <Text style={styles.text} key={index}>
                      {item.text}
                    </Text>
                  )}
                  {item.link !== '' && (
                    <Link
                      text={item.text}
                      size={15}
                      url={item.link}
                      key={index}
                    />
                  )}
                </Text>
              ))}
            </Text>
          </View>
        )}

        {termsandconditions && termsandconditions.checkbox && (
          <View>
            {termsandconditions.checkbox.map((item, index) => (
              <View style={styles.flexRow} key={index}>
                <View>
                  <CheckBox
                    checked={listToCheck.includes(index)}
                    onChange={(checked: boolean) =>
                      addToListToCheck(index, checked)
                    }
                    accessibilityLabel={accessibilityText[index]}
                    style={styles.checkboxStyle}
                    key={index}
                  />
                </View>
                <View style={styles.marginHorizontal10} key={index}>
                  <Text style={styles.textJustify} key={index}>
                    {termsandconditions.checkbox[index].map((res, index1) => (
                      <Text style={styles.row} key={index1}>
                        {res.link === '' && (
                          <Text style={styles.text} key={index1}>
                            {res.text}
                          </Text>
                        )}
                        {res.link !== '' && (
                          <Link text={res.text} url={res.link} key={index1} />
                        )}
                      </Text>
                    ))}
                  </Text>
                </View>
              </View>
            ))}
            <View style={styles.buttonStyle}>
              <Button
                text={Dictionary.button.proceed}
                type="primary"
                disabled={
                  listToCheck.length <
                  (termsandconditions && termsandconditions.checkbox.length)
                }
                onPress={validateUserTerms}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
  text: {
    ...Typography.boschReg16,
    paddingHorizontal: 10,
    textAlign: 'justify',
  },
  textJustify: {
    textAlign: 'justify',
  },
  marginBottom10: {
    marginBottom: 20,
  },
  marginHorizontal10: {
    marginHorizontal: 10,
    marginVertical: 15,
  },
  buttonStyle: {
    marginTop: 15,
  },
  checkboxStyle: {
    marginVertical: 15,
  },
  flexRow: {
    flexDirection: 'row',
  },
});

export default TermsAndConditions;
