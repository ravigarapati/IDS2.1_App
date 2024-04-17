import React, {useState} from 'react';
import {StyleSheet, View, ScrollView, Image} from 'react-native';
import {Button, CustomText, InfoTooltip} from '../components';
import {Dictionary} from '../utils/dictionary';
import {Colors} from '../styles';
import * as HomeOwnerActions from '../store/actions/HomeOwnerActions';
import {useDispatch} from 'react-redux';
import {Icons} from '../utils/icons';

export default function HomeOwnerRemoteAccess(props: any) {
  const dispatch = useDispatch();
  const [showConfirm, setShowConfirm] = useState(false);
  const address = props.navigation.getParam('address');
  const username = props.navigation.getParam('username');
  const gatewayId = props.navigation.getParam('gatewayId');
  const navigateTo = props.navigation.getParam('navigateTo');
  const updateState = props.navigation.getParam('updateState');

  const goToMyApplicance = () => {
    props.navigation.navigate(navigateTo);
  };
  const onAccept = () => {
    let data = {
      data: {
        gatewayId: gatewayId,
        contractorMonitoringStatus: true,
      },
      updateState: updateState,
    };
    dispatch(HomeOwnerActions.updateMonitoringStatus(data, goToMyApplicance));
  };

  const onDeny = () => {
    let data = {
      data: {
        gatewayId: gatewayId,
        contractorMonitoringStatus: false,
      },
      updateState: updateState,
    };
    dispatch(HomeOwnerActions.updateMonitoringStatus(data, goToMyApplicance));
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!showConfirm && (
        <View>
          <Image style={styles.icon} source={Icons.handshake} />
          <CustomText
            newline={true}
            size={21}
            font="medium"
            text={Dictionary.createProfile.welcomeUser + username + '!'}
          />
          <CustomText
            newline={true}
            text={Dictionary.myAppliance.allowAccess}
          />
          <CustomText text={Dictionary.myAppliance.locatedAt} />
          <CustomText newline={true} text={address} />
          <View style={styles.flexRow}>
            <CustomText text={Dictionary.myAppliance.clickAccept} />
            <InfoTooltip text={Dictionary.myAppliance.clickAcceptInfo} />
          </View>
          <View style={styles.paddingVertical20}>
            <Button
              style={styles.marginBottom15}
              type="primary"
              text={Dictionary.button.accept}
              onPress={() => onAccept()}
            />
            <Button
              type="secondary"
              text={Dictionary.button.deny}
              onPress={() => setShowConfirm(true)}
            />
          </View>
        </View>
      )}
      {showConfirm && (
        <View>
          <Image
            style={styles.icon}
            source={require('../assets/images/question_mark.png')}
          />
          <CustomText
            newline={true}
            size={21}
            font="medium"
            text={Dictionary.myAppliance.denyHeading}
          />
          <CustomText
            newline={true}
            text={Dictionary.myAppliance.confirmDeny}
          />
          <View style={styles.paddingVertical20}>
            <Button
              style={styles.marginBottom15}
              type="primary"
              text={Dictionary.button.no}
              onPress={() => setShowConfirm(false)}
            />
            <Button
              type="secondary"
              text={Dictionary.button.yes}
              onPress={() => onDeny()}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Colors.white,
  },
  icon: {
    marginVertical: 30,
    alignSelf: 'center',
    height: 120,
    width: 120,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  paddingVertical20: {
    paddingVertical: 20,
  },
  marginBottom15: {
    marginBottom: 15,
  },
});