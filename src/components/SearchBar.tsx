import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardTypeOptions,
  Platform,
} from 'react-native';
import {Colors, Typography} from '../styles';
import {Icons} from '../utils/icons';
import BoschIcon from './BoschIcon';
type SearchBar = {
  value: string;
  onChange: any;
  placeholder?: string;
  style?: {};
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  delimiterType?: 'none' | 'phone';
};
export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search',
  style,
  keyboardType = 'default',
  maxLength = 50,
  delimiterType = 'none',
}: SearchBar) {
  const splitAt = (index) => (x) => [x.slice(0, index), x.slice(index)];

  function onHandleChange(text) {
    if (delimiterType === 'phone') {
      var delimeterIndexList = [3, 7];
      var delimiterChar = '-';
      var len = text.length;
      if (len > value.length) {
        text = text.replace(/-/g, '');
        delimeterIndexList.forEach((index) => {
          if (len >= index) {
            text = splitAt(index)(text).join(delimiterChar);
          }
        });
      }
      onChange(text);
    } else {
      onChange(text);
    }
  }
  return (
    <View style={[styles.searchView, style]}>
      <BoschIcon size={24} name={Icons.search} color={Colors.mediumGray} style={{height: 24}} />
      <TextInput
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(text) => onHandleChange(text)}
        value={value}
        placeholder={placeholder}
        style={[styles.search]}
        placeholderTextColor={Colors.mediumGray}
        maxLength={maxLength}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Colors.mediumGray,
    borderBottomWidth: 1,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
  },
  search: {
    ...Typography.boschReg16,
    flex: 1,
    paddingLeft: 5,
    color: Colors.black
  },
});
