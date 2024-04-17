import React, {useState} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import {DrawerItems} from 'react-navigation-drawer';
import {BoschIcon, ConfirmationDialog, CustomText} from '../components';
import {Dictionary} from '../utils/dictionary';
import {useSelector, useDispatch} from 'react-redux';
import {Icons} from '../utils/icons';
import {removeDeviceToken} from '../store/actions/NotificationActions';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import Amplify, {Auth, Hub} from 'aws-amplify';
import awsconfig from '../../aws-exports';
import {prCleanInfo} from '../store/actions/ContractorActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationActions, StackActions} from 'react-navigation';
import { Enum } from '../utils/enum';

export const CustomDrawer = (props: any) => {
  const dispatch = useDispatch();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  let auxProps = {...props};
  auxProps.descriptors = [props.descriptors.Logout];
  auxProps.items = [props.items.filter(i => i.key === 'Logout')[0]];
  const idpIdToken = useSelector(
    state => state.auth.user.attributes['custom:id_token'],
  );

  // Logout Android --->
  async function callurl(url, redirectUrl) {
    await InAppBrowser.isAvailable();
    const {type, url: newUrl} = await InAppBrowser.openAuth(
      `https://stage.singlekey-id.com/auth/connect/endsession?&id_token_hint=${idpIdToken}&state=STATE`,
      `idsmobileapp://`,
      {
        showTitle: false,
        enableUrlBarHiding: true,
        enableDefaultShare: false,
        showInRecents: true,
        ephemeralWebSession: true,
      },
    );
    if (type === 'success') {
      //Linking.openURL(newUrl);
    } else {
      Hub.dispatch('browserClosed', {
        event: 'cancel',
        data: 'User clicked close button',
      });
      InAppBrowser.close();
    }
  }
  Platform.OS !== 'ios' &&
    Amplify.configure({
      ...awsconfig,
      oauth: {
        ...awsconfig.oauth,
        callurl,
      },
    });
  // Logout Android Ends --->

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.close}
        onPress={() => {
          props.navigation.closeDrawer();
        }}>
        <BoschIcon name={Icons.close} size={30} style={{height: 30}} />
      </TouchableOpacity>
      <CustomText
        style={styles.title}
        text={Dictionary.common.appName}
        align="left"
        size={21}
      />
      <ConfirmationDialog
        visible={showLogoutConfirmation}
        title={Dictionary.common.logoutConfirmation}
        text={Dictionary.common.wanttologout}
        primaryButton={Dictionary.button.logout}
        secondaryButton={Dictionary.button.cancel}
        primaryButtonOnPress={() => {
          //cleaning up bcc auto info
          AsyncStorage.setItem('lastDeviceName', '');
          AsyncStorage.setItem('lastDeviceType', '');
          AsyncStorage.setItem('lastMode', '');
          AsyncStorage.setItem('lastMacIdOpened', '');
          AsyncStorage.setItem('lastMacIdOpenedTimestamp', '');
          setShowLogoutConfirmation(false);
          if (Platform.OS !== 'ios') {
            callurl();
          }
          dispatch(removeDeviceToken(props.navigation));
        }}
        secondaryButtonOnPress={() => {
          setShowLogoutConfirmation(false);
        }}
      />

      <View>
        <DrawerItems
          {...props}
          onItemPress={route => {
            if (route.route.routeName !== 'Logout') {
              if (route.route.routeName === 'ProductRegistration') {
                dispatch(prCleanInfo());
              }
              Auth.currentAuthenticatedUser().then(userData => {
                if (userData.attributes['custom:role'] === Enum.roles.homeowner && route.route.routeName === 'Home') {
                  props.navigation.navigate('HomeTabs');
                }
                else{
                  const notResetRoute = props.navigation.state.routes.find(
                    x => x.index > 0,
                  ); // Check for stack not positioned at the first screen
                  if (notResetRoute) {
                    const resetAction = StackActions.reset({
                    // We reset the stack (cf. documentation)
                    index: 0,
                    actions: [
                      NavigationActions.navigate({
                        routeName: notResetRoute.routes[0].routeName,
                        }),
                      ],
                    });
                    props.navigation.dispatch(resetAction);
                  } else {
                  props.onItemPress(route);
                }
                props.navigation.closeDrawer(); // Finally we open the drawer
                }
              })
              .catch(err => {

              });
              return;
            } else {
              setShowLogoutConfirmation(true);
              return;
            }
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  close: {
    padding: 18,
    alignSelf: 'flex-start',
  },
  title: {
    marginVertical: 30,
    marginLeft: 20,
  },
});
