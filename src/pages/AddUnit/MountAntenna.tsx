/**
 * @file Add new unit. Lets Contractor add a new unit.
 * @author Krishna Priya Elango
 *
 */

import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {StyleSheet, View, Image, ScrollView} from 'react-native';
import {Colors} from '../../styles';
import {CustomText, Button, CheckBox} from '../../components';
import {Dictionary} from '../../utils/dictionary';
import * as ContractorActions from '../../store/actions/ContractorActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserAnalytics from '../../components/UserAnalytics';

export default function MountAntenna(props: any) {
  const [doNotShow, setDoNotShow] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ContractorActions.setMountAntennaHide(doNotShow));
  }, [doNotShow]);

  UserAnalytics('ids_mount_antenna');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <CustomText
          text={Dictionary.addUnit.mountAntenna}
          font="medium"
          size={21}
          newline={true}
        />
        <CustomText newline={true} text={Dictionary.addUnit.antennaText} />
        <Image
          style={styles.image}
          source={require('../../assets/images/antenna.png')}
        />
      </View>
      <View style={styles.alignEnd}>
        <CustomText text={Dictionary.createProfile.pressNext} newline={true} />
        <Button
          text={Dictionary.button.next}
          type="primary"
          onPress={() => {
            AsyncStorage.getItem('PowerUpODU').then(value => {
              if (value === 'hide') {
                props.navigation.navigate('AddODU');
              } else {
                props.navigation.navigate('PowerUpODU');
              }
            });
          }}
        />
        <CheckBox
          checked={doNotShow}
          onChange={setDoNotShow}
          text={Dictionary.addUnit.doNotShowAgain}
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
  image: {
    margin: 20,
    alignSelf: 'center',
  },
  alignEnd: {
    justifyContent: 'flex-end',
    flex: 1,
  },
});
