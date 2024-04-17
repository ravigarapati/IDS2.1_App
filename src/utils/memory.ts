const MYSTORAGE_KEY_PREFIX = '@IDSMemory:';
let dataMemory = {};
import SecureStorage from 'react-native-secure-storage';

/** @class */
class IDSSecureStorage {
  static syncPromise = null;
  /**
   * This is used to set a specific item in storage
   */
  static setItem(key, value) {
    SecureStorage.setItem(MYSTORAGE_KEY_PREFIX + key, value);
    dataMemory[key] = value;
    return dataMemory[key];
  }

  /**
   * This is used to get a specific key from storage
   */
  static getItem(key) {
    return Object.prototype.hasOwnProperty.call(dataMemory, key)
      ? dataMemory[key]
      : undefined;
  }

  /**
   * This is used to remove an item from storage
   */
  static removeItem(key) {
    SecureStorage.removeItem(MYSTORAGE_KEY_PREFIX + key);
    return delete dataMemory[key];
  }

  /**
   * This is used to clear the storage
   */
  static clear() {
    dataMemory = {};
    return dataMemory;
  }

  static async multiGet(memoryKeys: any): Promise<any> {
    return new Promise((res) => {
      memoryKeys.forEach(async (key, index) => {
        let value = await SecureStorage.getItem(key);
        let keyNoPrefix = key.replace(MYSTORAGE_KEY_PREFIX, '');
        dataMemory[keyNoPrefix] = value;
        if (index === memoryKeys.length - 1) {
          res(dataMemory);
        }
      });
    });
  }
  /**
   * Will sync the IDSSecureStorage data from react-native-secure-storage
   */
  static sync() {
    if (!IDSSecureStorage.syncPromise) {
      IDSSecureStorage.syncPromise = new Promise((res) => {
        SecureStorage.getAllKeys().then(async (keys) => {
          const memoryKeys = keys.filter((key) =>
            key.startsWith(MYSTORAGE_KEY_PREFIX),
          );
          if (memoryKeys.length > 0) {
            await IDSSecureStorage.multiGet(memoryKeys).then((memoryobj) => {
              dataMemory = memoryobj;
            });
          }
          res();
        });
      });
    }
    return IDSSecureStorage.syncPromise;
  }
}
export default IDSSecureStorage;
