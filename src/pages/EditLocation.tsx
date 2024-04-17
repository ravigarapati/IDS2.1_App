import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Platform, Image, Keyboard} from 'react-native';
import {
  Button,
  CustomAutoCompleteInput,
  CustomInputText,
  CustomText,
} from '../components';
import {Enum} from '../utils/enum';
import {connect} from 'react-redux';
import {
  updateLocation,
  getLocationSuggestions,
} from '../store/actions/HomeOwnerActions';
import {Dictionary} from '../utils/dictionary';
import {FlatList, TouchableHighlight} from 'react-native-gesture-handler';
import {Typography} from '../styles';

const EditLocation = ({
  navigation,
  currentLocation,
  updateLocation,
  getLocationSuggestions,
  locationSuggestions,
  weatherInfoLocation,
}) => {
  const [location, setLocation] = useState(currentLocation);
  const [isChanged, setIsChanged] = useState(true);
  const [location2, setLocation2] = useState(weatherInfoLocation.city);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const [mData, setMData] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState({});

  const save = () => {
    updateLocation(selectedSuggestion);
    navigation.navigate('HomeTabs');
  };

  const cancel = () => {
    navigation.navigate('HomeTabs');
  };

  const handleSelection = item => {
    setShowSuggestions(false);
    Keyboard.dismiss();
    setIsChanged(false);
    setSelectedSuggestion(item);
  };

  return (
    <View style={{flex: 1}}>
      <Image
        style={{height: 8, width: '100%'}}
        source={require('../assets/images/header_ribbon.png')}
      />
      <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <View style={{width: '100%'}}>
            <CustomInputText
              disableCache={false}
              testID="location"
              onChange={e => {
                getLocationSuggestions({location: e, countryCode: 'abc'});
                setLocation2(e);
                setShowSuggestions(true);
              }}
              value={location2}
            />
          </View>

          <Image
            //tintColor={dropDownIconColor}
            style={{
              marginLeft: '-6%',
              alignSelf: 'center',
            }}
            source={require('./../assets/images/search.png')}
          />
        </View>

        {showSuggestions && locationSuggestions.length != 0 && (
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
                marginTop: -10,
              },
            ]}>
            <View>
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                keyboardShouldPersistTaps="always"
                initialNumToRender={4}
                onEndReachedThreshold={0.5}
                data={locationSuggestions}
                renderItem={({item}) => (
                  <TouchableHighlight
                    testID="suggestion"
                    onPressIn={() => {
                      setLocation2(item.Label);
                      setSelectedName(item.Label);
                    }}
                    onPressOut={() => {
                      setSelectedName('');
                      setSelectedSuggestion(item);
                      setIsChanged(false);
                      setShowSuggestions(false);
                    }}
                    onPress={() => {
                      handleSelection(item);
                    }}>
                    <View style={[styles.suggestionElementView]}>
                      <CustomText
                        style={[
                          styles.flatListElements,
                          selectedName !== '' && selectedName === item.Label
                            ? {
                                backgroundColor: 'rgba(0, 73, 117, 1)',
                                color: 'white',
                              }
                            : {},
                        ]}
                        text={item.Label}
                        align="left"
                      />
                    </View>
                  </TouchableHighlight>
                )}
              />
            </View>
          </View>
        )}

        <View>
          <Button
            testID="submit"
            disabled={isChanged}
            text={Dictionary.button.save}
            type={'primary'}
            onPress={save}
          />
          <Button
            testID="cancel"
            text={Dictionary.button.cancel}
            type={'secondary'}
            onPress={cancel}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingTop: 20,
    justifyContent: 'space-between',
  },

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
    height: '70%',
  },
});

const mapStateToProps = state => {
  return {
    currentLocation: state.homeOwner.location,
    locationSuggestions: state.homeOwner.locationSuggestions,
    weatherInfoLocation: state.homeOwner.weatherInfoLocation,
  };
};

const mapDispatchToProps = {
  updateLocation,
  getLocationSuggestions,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditLocation);
