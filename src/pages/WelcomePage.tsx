import React from 'react';
import {CustomText, Button, BoschIcon} from '../components';
import {Typography} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {Colors} from '../styles';
import {ScrollView} from 'react-native-gesture-handler';
import {Enum} from '../utils/enum';
import {Icons} from '../utils/icons';

export default function WelcomePage(props) {
  const userData = useSelector((state) => state.auth.currentUser);
  const onClickNext = () => {
    if (userData.role === Enum.roles.homeowner) {
      /*let addressCommaSeparated = [
        userData.address.address1,
        ...(userData.address.address2 !== ''
          ? [userData.address.address2]
          : []),
        userData.address.city,
        userData.address.state,
        userData.address.zipCode,
      ].join(', ');*/
      //props.navigation.replace('HomeOwnerRemoteAccess', {
      //  address: addressCommaSeparated,
      //  username: userData.firstName,
      //  gatewayId: userData.gatewayId,
      //  navigateTo: 'HomeOwner',
      //  updateState: false,
      //});
      props.navigation.navigate('Add');
    } else if (userData.role === Enum.roles.contractor) {
      props.navigation.navigate('Contractor');
    } else if (userData.role === Enum.roles.contractorPowerUser) {
      props.navigation.navigate('ContractorPowerUser');
    }
  };
  return (
    <View style={[styles.flex1, styles.spaceEvenly, styles.paddingTop10]}>
      <ScrollView>
        <View style={[styles.spaceEvenly]}>
          <CustomText
            style={{...Typography.boschMedium21}}
            newline={true}
            text={
              Dictionary.createProfile.welcomeUser +
              userData.firstName +
              ' ' +
              userData.lastName +
              ' !'
            }
          />
          <View style={styles.alignCenter}>
            <BoschIcon
              size={120}
              name={Icons.checkmarkFrame}
              color={Colors.success}
              accessibilityLabel={'success'}
              style={{height: 120}}
            />
          </View>

          <CustomText
            style={{...Typography.boschReg16}}
            newline={true}
            text={Dictionary.createProfile.profileCreationSuccess}
          />
        </View>
      </ScrollView>

      <View style={[styles.buttonContainer]}>
        <CustomText
          newline={true}
          style={{...Typography.boschReg16}}
          text={Dictionary.createProfile.pressNext}
        />
        <Button
          type="primary"
          text={Dictionary.button.next}
          onPress={() => onClickNext()}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  spaceEvenly: {
    justifyContent: 'space-evenly',
  },
  flexRow: {
    flexDirection: 'row',
  },
  alignCenter: {
    alignItems: 'center',
    marginVertical: 20,
  },
  paddingTop10: {
    paddingTop: 10,
    marginTop: 10,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
  },
});
