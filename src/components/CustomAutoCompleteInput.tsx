import React, {useState, useEffect, useRef} from 'react';
import {
  FlatList,
  Keyboard,
  TextInput,
  View,
  TouchableHighlight,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Colors, Typography} from '../styles';
import CustomText from './CustomText';

const defaultDropDownImage = require('./../assets/images/search.png');
const width = Dimensions.get('screen').width;

const CustomAutoCompleteInput = props => {
  const {
    data,
    onSelect,
    value,
    setValue,
    placeholder,
    placeholderColor = defaultAccentColor,
    editable = true,
    dropDownIconColor = defaultAccentColor,
    dropDownImage = defaultDropDownImage,
    accessibilityLabelText = undefined,
    accessibilityHintText = undefined,
    enableButton,
    additionalFunction,
    showOptions,
    testID,
    hideOptions,
  } = props;
  const newRef = useRef();

  const [filteredData, setFilteredData] = useState([]);
  const [mData, setMData] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedItem, setSelectedItem] = useState(value);
  const [selectedName, setSelectedName] = useState('');
  const [show, setShow] = useState(false);

  const toggleDropdown = (): void => {
    showSuggestions ? setShowSuggestions(false) : openDropdown();
    if (selectedItem) {
      setSelectedItem(undefined);
    }
  };

  const openDropdown = (): void => {
    setShowSuggestions(true);
  };

  const closeDropdown = (): void => {
    setShowSuggestions(false);
  };

  const filterData = str => {
    if (additionalFunction != undefined) {
      additionalFunction(str);
    }

    const fData = data.filter(e => e.toLowerCase().includes(str.toLowerCase()));
    setFilteredData(fData);
  };

  useEffect(() => {
    if (data && data.length > 0 && data[0] !== filterData[0]) {
      data.length > 0 && setFilteredData(data);
    }
  }, [data]);

  useEffect(() => {
    if (!value || (Object.keys(value).length !== 0 && value !== selectedItem)) {
      setSelectedItem(value);
    }
  }, [value]);

  useEffect(() => {
    filteredData && filteredData.length > 0 && setMData(filteredData);
  }, [filteredData]);

  const handleSelection = item => {
    setShowSuggestions(false);
    Keyboard.dismiss();
    setSelectedItem(item);
    setValue(item);
    setTimeout(() => {
      onSelect && onSelect(item ? item : {});
    }, 0);
    setMData(data);
  };

  return (
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'row'}}>
        <TextInput
          autoCorrect={false}
          spellCheck={false}
          testID={testID}
          style={[
            styles.textField,
            {
              color: !editable ? '#6c6c6c' : 'black',
              borderBottomColor: !editable ? '#6c6c6c' : '#BFC0C2',
              borderBottomWidth: 1,
            },
          ]}
          accessible={true}
          accessibilityLabel={
            accessibilityLabelText ? accessibilityLabelText : undefined
          }
          accessibilityHint={
            accessibilityHintText ? accessibilityHintText : undefined
          }
          onSubmitEditing={() => {
            if (hideOptions != undefined) {
              console.log('asdf');
              setShow(false);
              hideOptions();
            }

            toggleDropdown();
          }}
          placeholder={placeholder}
          value={
            selectedItem ? (selectedItem ? selectedItem : undefined) : undefined
          }
          ref={newRef}
          onChangeText={data => {
            setShow(true);
            filterData(data);
          }}
          onFocus={toggleDropdown}
        />
        <Image
          tintColor={dropDownIconColor}
          style={{
            marginLeft: '-6%',
            alignSelf: 'center',
          }}
          source={dropDownImage}
        />
      </View>
      {showOptions && data.length > 0 && show ? (
        <View
          style={[
            styles.overlay,
            {
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            },
          ]}>
          <ScrollView horizontal={true}>
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              keyboardShouldPersistTaps="always"
              initialNumToRender={4}
              onEndReachedThreshold={0.5}
              data={mData}
              renderItem={({item}) => (
                <TouchableHighlight
                  style={{width: width - 25, marginLeft: -10}}
                  onPressIn={() => {
                    setSelectedName(item);
                  }}
                  onPressOut={() => {
                    setSelectedName('');
                  }}
                  onPress={() => handleSelection(item)}>
                  <View style={[styles.suggestionElementView]}>
                    <CustomText
                      allowFontScaling={true}
                      style={[
                        styles.flatListElements,
                        selectedName !== '' && selectedName === item
                          ? {
                              backgroundColor: 'rgba(0, 73, 117, 1)',
                              color: 'white',
                            }
                          : {},
                      ]}
                      text={item}
                      align="left"
                    />
                  </View>
                </TouchableHighlight>
              )}
            />
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
    textField: {
      width: '100%',
      paddingRight: 12,
      paddingLeft: 12,
      borderBottomWidth: Platform.OS === 'ios' ? 1.5 : 0,
      marginTop: Platform.OS === 'ios' ? '3%' : 0,
      fontSize: 16,
      paddingBottom: 14,
      fontFamily: Typography.FONT_FAMILY_REGULAR,
    },
    flatListElements: {
      paddingLeft: 7,
      paddingRight: 7,
      paddingTop: 14,
      paddingBottom: 14,
    },
    suggestionElementView: {
      width: '100%',
      paddingLeft: 8,
    },
    overlay: {
      width: '100%',
    },
  }),
  defaultAccentColor = '#034EA2';

export default CustomAutoCompleteInput;
