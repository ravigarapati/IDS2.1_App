import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
  Linking,
} from 'react-native';
import BoschIcon from './BoschIcon';
import {Colors} from '../styles';
import CustomText from './CustomText';
import {Dictionary} from '../utils/dictionary';
import {ConfirmationDialog} from '../components';
import messaging from '@react-native-firebase/messaging';

type ToggleButton = {
  button1?: string;
  button2?: string;
  pressed?: number;
  onChange?: any;
  style?: any;
  type?: string;
  isvisible?: boolean;
  settingCheck?: boolean;
  testIDPrimary?: string;
  testIDSecondary?: string;
  button1AccessibilityHint?: string;
  button2AccessibilityHint?: string;
  disabled?: boolean;
};

export default function ToggleButton({
  button1 = 'Button1',
  button2 = 'Button2',
  pressed = 0,
  isvisible = true,
  onChange,
  style,
  type = 'text',
  settingCheck = true,
  testIDPrimary,
  testIDSecondary,
  button1AccessibilityHint = undefined,
  button2AccessibilityHint = undefined,
  disabled = false,
}: ToggleButton) {
  const [selected, setSelected] = useState(pressed);
  const [visible, setVisible] = useState(isvisible);
  const [button1Type, setButton1Type] = useState('');
  const [button2Type, setButton2Type] = useState('');
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    if (isvisible === true) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [visible]);
  useEffect(() => {
    if (selected === 0) {
      setButton1Type('primary');
      setButton2Type('secondary');
    } else if (selected === 2) {
      setButton1Type('secondary');
      setButton2Type('secondary');
    } else {
      setButton2Type('primary');
      setButton1Type('secondary');
    }
  }, [selected]);

  const openMobileSettings = () => {
    Alert.alert(
      Dictionary.settings.notificationNotAuthorized,
      Dictionary.addUnit.changeSettings,
      [
        {
          text: Dictionary.button.cancel,
          style: 'cancel',
        },
        {
          text: Dictionary.button.change,
          onPress: () => Linking.openSettings(),
          style: 'default',
        },
      ],
    );
  };

  const requestNotifPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();

        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
        } else {
          openMobileSettings();
        }
      } else {
        const notificationStatus = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        if (notificationStatus === 'never_ask_again') {
          openMobileSettings();
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  function changeColor(button) {
    if (button === 0) {
      setSelected(0);
      onChange(0);
    } else {
      if (!settingCheck) {
        //setShowNotif(true);
        requestNotifPermission();
      } else {
        setSelected(1);
        onChange(1);
      }
    }
  }

  return (
    <>
      {visible && (
        <View style={[style, styles.container]}>
          <TouchableOpacity
            testID={testIDPrimary}
            accessible={true}
            accessibilityLabel={`${button1} option`}
            accessibilityRole="button"
            accessibilityHint={
              button1AccessibilityHint
                ? button1AccessibilityHint
                : `Press it to choose ${button1}`
            }
            activeOpacity={0.7}
            style={[
              styles.button,
              button1Type === 'primary' ? styles.primary : styles.secondary,
            ]}
            onPress={() => (!disabled ? changeColor(0) : null)}>
            {type === 'text' ? (
              <CustomText
                text={button1}
                allowFontScaling={true}
                color={
                  button1Type === 'primary' ? Colors.white : Colors.darkBlue
                }
              />
            ) : (
              <BoschIcon
                size={24}
                name={button1}
                color={
                  button1Type === 'primary' ? Colors.white : Colors.darkBlue
                }
                style={{alignSelf: 'center', height: 24}}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            testID={testIDSecondary}
            accessible={true}
            accessibilityLabel={`${button2} option`}
            accessibilityRole="button"
            accessibilityHint={
              button2AccessibilityHint
                ? button2AccessibilityHint
                : `Press it to choose ${button2}`
            }
            activeOpacity={0.7}
            style={[
              styles.button,
              button2Type === 'primary' ? styles.primary : styles.secondary,
            ]}
            onPress={() => (!disabled ? changeColor(1) : null)}>
            {type === 'text' ? (
              <CustomText
                allowFontScaling={true}
                text={button2}
                color={
                  button2Type === 'primary' ? Colors.white : Colors.darkBlue
                }
              />
            ) : (
              <BoschIcon
                size={24}
                name={button2}
                color={
                  button2Type === 'primary' ? Colors.white : Colors.darkBlue
                }
                style={{alignSelf: 'center', height: 24}}
              />
            )}
          </TouchableOpacity>
        </View>
      )}
      {showNotif && (
        <View>
          <ConfirmationDialog
            visible={showNotif}
            text={
              Platform.OS === 'ios'
                ? Dictionary.settings.notificationIos
                : Dictionary.settings.notificationAndroid
            }
            textAlign={'center'}
            textColor={'#43464A'}
            primaryButton={'Close'}
            primaryButtonOnPress={() => {
              setShowNotif(false);
            }}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
    flex: 1,
  },
  button: {
    paddingVertical: 15,
    flex: 1,
    borderColor: Colors.darkBlue,
    borderWidth: 1,
  },
  primary: {
    backgroundColor: Colors.darkBlue,
  },
  secondary: {
    backgroundColor: Colors.white,
  },
});
