/**
 * @file Add new unit. Lets Contractor add a new unit.
 * @author Krishna Priya Elango
 *
 */

import React, {useEffect} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {Colors} from '../../styles';
import {CustomText, Button, BoschIcon} from '../../components';
import {Dictionary} from '../../utils/dictionary';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icons} from '../../utils/icons';
import UserAnalytics from '../../components/UserAnalytics';

export default function AddUnitSuccess(props: any) {
  const odu = useSelector(state => state.contractor.selectedUnit.odu);
  const screenType = props.navigation.state.routeName;
  const mountAntennaHideStatus = useSelector(
    state => state.contractor.mountAntennaHideStatus,
  );
  const powerUpOduHideStatus = useSelector(
    state => state.contractor.powerUpOduHideStatus,
  );

  useEffect(() => {
    if (mountAntennaHideStatus) {
      AsyncStorage.setItem('MountAntenna', 'hide');
    } else {
      AsyncStorage.setItem('MountAntenna', '');
    }
    if (powerUpOduHideStatus) {
      AsyncStorage.setItem('PowerUpODU', 'hide');
    } else {
      AsyncStorage.setItem('PowerUpODU', '');
    }
  }, []);

  UserAnalytics('ids_add_unit_success');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <CustomText
          text={
            (screenType === 'ReplaceUnitSuccess'
              ? Dictionary.addUnit.successfullyReplaced
              : Dictionary.addUnit.successfullyAdded) + odu.modelNumber
          }
          font="medium"
          size={20}
          newline={true}
        />
        <BoschIcon
          name={Icons.checkmarkFrame}
          size={120}
          color={Colors.success}
          style={[styles.icon, {height: 120}]}
          accessibilityLabel={'success'}
        />
      </View>
      <View style={styles.alignEnd}>
        <CustomText
          text={
            screenType === 'ReplaceUnitSuccess'
              ? Dictionary.addUnit.goToDashboardAfterReplace
              : Dictionary.addUnit.goToDashboard
          }
          newline={true}
        />
        <Button
          text={Dictionary.common.unitDashboard}
          type="primary"
          onPress={() => {
            if (screenType === 'ReplaceUnitSuccess') {
              props.navigation.goBack();
            } else {
              props.navigation.replace('Installation');
            }
          }}
        />
        <Button
          text={Dictionary.common.home}
          type="secondary"
          onPress={() =>
            props.navigation.navigate('ContractorHome', {tab: 'list'})
          }
        />

        <CustomText
          size={14}
          text={Dictionary.addUnit.afterTwoYearsOfService}
          newline={true}
          align="left"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 20,
    flexGrow: 1,
  },
  icon: {
    margin: 20,
    alignSelf: 'center',
  },
  alignEnd: {
    justifyContent: 'flex-end',
    flex: 1,
  },
});
