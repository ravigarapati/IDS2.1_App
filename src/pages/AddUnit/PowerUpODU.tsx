/**
 * @file Add new unit. Lets Contractor add a new unit.
 * @author Krishna Priya Elango
 *
 */

import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Image, ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import {Colors} from '../../styles';
import {CustomText, Button, CheckBox, Link} from '../../components';
import {Dictionary} from '../../utils/dictionary';
import * as ContractorActions from '../../store/actions/ContractorActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserAnalytics from '../../components/UserAnalytics';

export default function PowerUpODU(props: any) {
  const [doNotShow, setDoNotShow] = useState(false);
  const dispatch = useDispatch();

  UserAnalytics('ids_powerup_odu');

  useEffect(() => {
    dispatch(ContractorActions.setPowerUpOduHide(doNotShow));
  }, [doNotShow]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <CustomText
          text={Dictionary.addUnit.powerUpOdu}
          font="medium"
          size={21}
          newline={true}
        />
        <CustomText newline={true} text={Dictionary.addUnit.powerUpOduText} />
        <CustomText
          font="bold"
          newline={true}
          text={Dictionary.addUnit.powerUpOduTextBold}
        />
        <Image
          style={styles.image}
          source={require('../../assets/images/powerUpODUAll.gif')}
        />
      </View>

      <View style={styles.alignEnd}>
        <CustomText text={Dictionary.createProfile.pressNext} newline={true} />
        <Button
          text={Dictionary.button.next}
          type="primary"
          onPress={() => {
            props.navigation.navigate('AddODU');
          }}
        />
        <Link
          text={Dictionary.addUnit.installationManual}
          url="https://issuu.com/boschthermotechnology/docs/ids2.1_bovb20_iom_07.2022?fr=sMjY1ZjYwMzIwNjA"
          type="arrow"
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
