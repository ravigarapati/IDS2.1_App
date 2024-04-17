import {PermissionsAndroid} from 'react-native';
import {Enum} from '../utils/enum';
import {Dictionary} from '../utils/dictionary';

export async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: Dictionary.bleCommunicator.locationPermission,
        message: Dictionary.bleCommunicator.permissionDescription,
        buttonNeutral: Dictionary.button.askLater,
        buttonNegative: Dictionary.button.cancel,
        buttonPositive: Dictionary.button.ok,
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

/* Convert base64 data to hex string.
 *   txt : Base64 string.
 *   sep : Hex separator, e.g. '-' for '1a-2b-3c'.  Default empty.
 */
export const base64ToHex = (() => {
  // Lookup tables
  const values = [],
    output = [];

  // Main converter
  return function base64ToHex(txt, sep = ' ') {
    if (output.length <= 0) {
      populateLookups();
    }
    const result = [];
    let v1, v2, v3, v4;
    for (let i = 0, len = txt.length; i < len; i += 4) {
      // Map four chars to values.
      v1 = values[txt.charCodeAt(i)];
      v2 = values[txt.charCodeAt(i + 1)];
      v3 = values[txt.charCodeAt(i + 2)];
      v4 = values[txt.charCodeAt(i + 3)];
      // Split and merge bits, then map and push to output.
      result.push(
        output[(v1 << 2) | (v2 >> 4)],
        output[((v2 & 15) << 4) | (v3 >> 2)],
        output[((v3 & 3) << 6) | v4],
      );
    }
    // Trim result if the last values are '='.
    if (v4 === 64) {
      result.splice(v3 === 64 ? -2 : -1);
    }
    //  return result.join(sep);
    return result;
  };

  function populateLookups() {
    const keys =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    for (let i = 0; i < 256; i++) {
      output.push(('0' + i.toString(16)).slice(-2));
      values.push(0);
    }
    for (let i = 0; i < 65; i++) {
      values[keys.charCodeAt(i)] = i;
    }
  }
})();

function getRandomIntInclusive(min, max) {
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  let randomNumber = randomBuffer[0] / (0xffffffff + 1);
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(randomNumber * (max - min + 1)) + min;
}

export const getRandomString = length => {
  var randomChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(getRandomIntInclusive(0, randomChars.length));
  }
  return result;
};

function hexToDec(hexString) {
  return parseInt(hexString, 16);
}

/** Maps BLE Data to Modbus Address */
export function bleDataMapper(packet) {
  let mappedObj = {};
  let specialModbusAddress = Enum.specialModbusAddress;
  try {
    let byteArray = base64ToHex(packet);
    let seqPacket = Enum.bleDataMapping[hexToDec(byteArray[0])];
    if (seqPacket) {
      for (let key in seqPacket) {
        for (let h = 0; h < seqPacket[key].length; h++) {
          let value = byteArray[seqPacket[key][h] - 1];
          if (mappedObj[key]) {
            value = mappedObj[key] + value;
          }
          mappedObj[key] = value;
          if (h === seqPacket[key].length - 1) {
            if (specialModbusAddress.includes(parseInt(key))) {
              if (key === '30024') {
                mappedObj[key] = hexToDec(mappedObj[key]) / 2;
              } else {
                let byte1 = hexToDec(mappedObj[key].slice(0, 2));
                let byte2 = hexToDec(mappedObj[key].slice(2, 4));
                mappedObj[key] = handleSpecialCases(key, byte1, byte2);
              }
            } else {
              mappedObj[key] = hexToDec(mappedObj[key]);
            }
          }
        }
      }
    }
  } catch (e) {}
  return mappedObj;
}

export function handleSpecialCases(key, byte1, byte2) {
  if (isNaN(byte1) || isNaN(byte2)) {
    return !isNaN(byte1) ? byte1 : byte2;
  } else {
    switch (key) {
      case '30004':
      case '30005':
      case '30007':
      case '30013':
        return byte1 === 1 ? -1 * byte2 : byte2;
      case '30037':
      case '30039':
      case '30040':
      case '30041':
      case '30042':
      case '30043':
      case '30044':
      case '30045':
      case '30046':
      case '30047': {
        if (Enum.faultDecoder[byte1] && Enum.faultDecoder[byte2]) {
          return Enum.faultDecoder[byte1] + Enum.faultDecoder[byte2];
        } else {
          let fault = '';
          if (Enum.faultDecoder[byte2] === 0) {
            fault = Enum.faultDecoder[byte1] + '0';
          }
          return fault;
        }
      }
      case '30036': {
        if (Enum.faultDecoder[byte1] && Enum.faultDecoder[byte2]) {
          return Enum.faultDecoder[byte1] + Enum.faultDecoder[byte2];
        } else {
          return '';
        }
      }
      case '30029':
        return (byte1 * 256 + byte2) / 60;
      case '30032':
        return byte1 * 10 + byte2;
      default:
        return byte1 * 256 + byte2;
    }
  }
}

export async function requestStoragePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: Dictionary.bleCommunicator.externalStoragePermission,
        message:
          Dictionary.bleCommunicator.externalStoragePermissionDescription,
        buttonNeutral: Dictionary.button.askLater,
        buttonNegative: Dictionary.button.cancel,
        buttonPositive: Dictionary.button.ok,
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}
