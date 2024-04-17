import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, ImageBackground} from 'react-native';
import {BoschIcon, CustomText, SearchBar} from '../components';
import {Dictionary} from '../utils/dictionary';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {Enum} from '../utils/enum';
import {Colors, Typography} from '../styles';
import {Icons} from '../utils/icons';
import crashlytics from '@react-native-firebase/crashlytics';

const Legend = ({state}) => {
  return (
    <View style={styles.flexRow}>
      <BoschIcon
        name={Enum.mapPins[state].icon}
        size={25}
        color={Enum.mapPins[state].color}
        accessibilityLabel={state + 'pin'}
        style={{height: 25}}
      />
      <CustomText size={12} text={Enum.mapPins[state].label} />
    </View>
  );
};
const MapMarkers = ({markers, showNames, goToDashboard}) => {
  return markers.map(marker => (
    <View key={marker.gateway.gatewayId}>
      {marker.odu.installedAddress.latitude &&
        marker.odu.installedAddress.longitude && (
          <Marker
            onPress={() => {
              goToDashboard(marker);
            }}
            coordinate={{
              latitude: marker.odu.installedAddress.latitude,
              longitude: marker.odu.installedAddress.longitude,
            }}
            accessibilityLabel={'pins'}>
            <ImageBackground
              resizeMode="center"
              resizeMethod="resize"
              style={showNames ? {} : styles.pinSize}
              source={Enum.mapPins[marker.systemStatus.toLowerCase()].image}>
              {showNames && (
                <Text style={styles.pinText} key={marker.gateway.gatewayId}>
                  {marker.homeOwnerDetails.firstName +
                    ' ' +
                    marker.homeOwnerDetails.lastName}
                </Text>
              )}
            </ImageBackground>
          </Marker>
        )}
    </View>
  ));
};

export default function ContractorHomeMapView({
  mapMarkersList,
  companyDetails,
  goToDashboard,
}) {
  const [showNames, setShowNames] = useState(false);
  const [markersList, setMarkersList] = useState(mapMarkersList);
  const [search, setSearch] = useState('');

  useEffect(() => {
    crashlytics().log('Map View Mounted');
    setMarkersList(mapMarkersList);
    setSearch('');
  }, [mapMarkersList]);

  const handleSearch = text => {
    crashlytics().log('handleSearch ' + text);
    setSearch(text);
    if (text === '') {
      setMarkersList(mapMarkersList);
    } else {
      const query = text.toLowerCase();
      const data = mapMarkersList.filter(item => {
        return (
          item.homeOwnerDetails &&
          (item.homeOwnerDetails.firstName.toLowerCase().startsWith(query) ||
            item.homeOwnerDetails.lastName.toLowerCase().startsWith(query) ||
            (
              item.homeOwnerDetails.firstName +
              ' ' +
              item.homeOwnerDetails.lastName
            )
              .toLowerCase()
              .startsWith(query))
        );
      });
      setMarkersList(data);
    }
  };

  const zoomChange = region => {
    if (region.latitudeDelta < 2) {
      setShowNames(true);
    } else {
      setShowNames(false);
    }
  };

  return (
    <View style={styles.mapView}>
      <View style={styles.searchView}>
        <SearchBar
          onChange={text => handleSearch(text)}
          value={search}
          placeholder={Dictionary.home.search}
          style={styles.flex1}
        />
      </View>
      <MapView
        style={[styles.flex1]}
        provider={PROVIDER_GOOGLE}
        customMapStyle={Enum.mapStyle}
        toolbarEnabled={false}
        onRegionChange={region => zoomChange(region)}
        initialRegion={{
          latitude: companyDetails.latitude,
          longitude: companyDetails.longitude,
          latitudeDelta: 1,
          longitudeDelta: 0,
        }}>
        <MapMarkers
          markers={markersList}
          showNames={showNames}
          goToDashboard={goToDashboard}
        />
        <Marker
          coordinate={{
            latitude: companyDetails.latitude,
            longitude: companyDetails.longitude,
          }}>
          <ImageBackground
            resizeMode="center"
            resizeMethod="resize"
            style={showNames ? {} : styles.pinSize}
            source={Icons.homePin}>
            {showNames && (
              <Text style={styles.pinText}>{companyDetails.name}</Text>
            )}
          </ImageBackground>
        </Marker>
      </MapView>
      <View style={[styles.flexRow, styles.legendView]}>
        <Legend state={Enum.status.alert} />
        <Legend state={Enum.status.offline} />
        <Legend state={Enum.status.normal} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  padding20: {
    padding: 20,
  },
  mapView: {
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  flex1: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  legendView: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchView: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  padLeft5: {
    paddingLeft: 5,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  alignCenter: {
    alignItems: 'center',
  },
  mapDetails: {
    position: 'absolute',
    flex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    paddingBottom: 5,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  padding10: {
    padding: 10,
  },
  pinSize: {
    width: 40,
    height: 40,
  },
  pinText: {
    ...Typography.boschReg12,
    marginTop: 40,
  },
});
