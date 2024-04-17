import {Platform} from 'react-native';
import {Dictionary} from './dictionary';
import {Alert, Linking} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';

export function scanButton(setShowScanner) {
  request(
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
  ).then(res => {
    if (res === 'blocked' || res === 'denied') {
      Alert.alert(
        Dictionary.addUnit.cameraNotAuthorized,
        Dictionary.addUnit.changeSettings,
        [
          {
            text: Dictionary.button.cancel,
            onPress: () => setShowScanner(false),
            style: 'cancel',
          },
          {
            text: Dictionary.button.change,
            onPress: () => Linking.openSettings(),
            style: 'default',
          },
        ],
      );
    } else {
      setShowScanner(true);
    }
  });
}
