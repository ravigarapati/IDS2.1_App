import React, {useEffect} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import ScheduleDashboardOnBoarding from './ScheduleDashboardOnBoarding';
import {connect} from 'react-redux';

const Schedule = ({navigation, selectedDevice, schedulesOnBoarding}) => {
  return (
    <View style={styles.mainContainer}>
      <Image
        style={{height: 8, width: '100%'}}
        source={require('./../../assets/images/header_ribbon.png')}
      />
      <ScheduleDashboardOnBoarding
        navigation={navigation}
        schedules={schedulesOnBoarding}
        isReusable={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
});

const mapStateToProps = state => {
  return {
    selectedDevice: state.homeOwner.selectedDevice,
    schedulesOnBoarding: state.homeOwner.schedulesOnBoarding,
  };
};

export default connect(mapStateToProps)(Schedule);
