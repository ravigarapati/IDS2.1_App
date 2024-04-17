import 'react-native-gesture-handler/jestSetup';
import 'react-native-get-random-values';

import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';
jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter.js', () => {
  const {EventEmitter} = require('events');
  return EventEmitter;
});

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
//jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

jest.mock('react-native-tcp-socket', () => jest.fn());

jest.mock('react-native-splash-screen', () => {
  return {
    hide: jest.fn(),
    show: jest.fn(),
  };
});

jest.mock('react-navigation-hooks', () => {
  return {
    useFocusEffect: jest.fn(),
  };
});

//import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';
//jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

import mockPermissions from 'react-native-permissions/mock';
jest.mock('react-native-permissions', () => mockPermissions);

jest.mock('react-native-qrcode-scanner', () => jest.fn());

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

jest.mock('react-native-bluetooth-state-manager', () => jest.fn());
jest.mock('react-native-tcp-socket', () => jest.fn());

jest.mock('react-native-ble-plx', () => jest.fn());
jest.mock('../src/pages/InstallationLiveData.tsx', () => jest.fn());
jest.mock('../src/pages/InstallationSystemData.tsx', () => jest.fn());

const mockLog = jest.fn();
const mockRecordError = jest.fn();

jest.mock('@react-native-firebase/crashlytics', () =>
  jest.fn().mockImplementation(() => ({
    log: mockLog,
    recordError: mockRecordError,
  })),
);

jest.mock('@react-native-firebase/app/lib/internal/registry/nativeModule', () =>
  jest.fn(),
);

jest.mock('@react-native-clipboard/clipboard/dist/Clipboard', () => jest.fn());

jest.mock('jail-monkey', () => jest.fn());

jest.useFakeTimers();

jest.mock('aws-amplify', () => ({
  redirect: jest.fn(),
}));
