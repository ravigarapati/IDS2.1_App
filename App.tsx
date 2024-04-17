import './ignoreWarnings';
import React, {useEffect, useRef} from 'react';
import SplashScreen from 'react-native-splash-screen';
import AppNavigator from './src/navigations/AppNavigator';
import {Provider} from 'react-redux';
import {store, persistor} from './src/store';
import {PersistGate} from 'redux-persist/integration/react';
import {
  KeyboardAvoidingView,
  NativeEventEmitter,
  Platform,
  SafeAreaView,
} from 'react-native';
import CustomToast from './src/components/CustomToast';
import {Loader} from './src/components';
import {StatusBar, View, Text, AppState, TextInput} from 'react-native';
import JailMonkey from 'jail-monkey';
import {useState} from 'react';
import {isEmulator, getModel, getDeviceName} from 'react-native-device-info';
import {BlurView} from '@react-native-community/blur';

if (Text.defaultProps == null) {
  Text.defaultProps = {};
  Text.defaultProps.maxFontSizeMultiplier = 1;
}

if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
  TextInput.defaultProps.maxFontSizeMultiplier = 1;
}

const App = () => {
  const [isJailBroken, setIsJailBroken] = useState(false);
  const [checkIsEmulator, setCheckIsEmulator] = useState(false);

  const [blurView, setBlurVliew] = useState(false);

  useEffect(() => {
    SplashScreen.hide();
    StatusBar.setBarStyle('dark-content');
    if (Platform.OS === 'android') {
      const NativeEvent = new NativeEventEmitter();
      const handleActiveState = NativeEvent.addListener(
        'ActivityStateChange',
        e => {
          if (e.event === 'inactive') {
            setBlurVliew(true);
          } else {
            setBlurVliew(false);
          }
        },
      );
      return () => {
        handleActiveState.remove();
      };
    } else {
      const subscription = AppState.addEventListener('change', nextAppState => {
        if (nextAppState === 'inactive') {
          setBlurVliew(true);
        } else {
          setBlurVliew(false);
        }
      });

      return () => {
        subscription.remove();
      };
    }
  }, []);

  useEffect(() => {
    if (JailMonkey.isJailBroken()) {
      setIsJailBroken(true);
    }
    isEmulator().then(isEmulator => {
      setCheckIsEmulator(isEmulator);
    });
  }, []);

  const flex1 = {flex: 1};
  const alert = {flex: 1, alignItems: 'center', justifyContent: 'center'};

  return (
    <>
      {true ? (
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SafeAreaView style={flex1}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={flex1}>
                <AppNavigator />
                <Loader />
              </KeyboardAvoidingView>
              <CustomToast />
            </SafeAreaView>
          </PersistGate>
        </Provider>
      ) : (
        <View style={alert}>
          <Text>Cannot run app on this device. Try on a different device.</Text>
        </View>
      )}
      {blurView && (
        <BlurView
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
          blurType="xlight"
        />
      )}
    </>
  );
};

export default App;
