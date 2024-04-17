import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { connect } from 'react-redux';
import BCCDashboardSchedule from './BCCDashboardSchedule';
import { getDeviceStatus, getScheduleList, updateSelected } from '../store/actions/HomeOwnerActions';
import { Button } from '../components';
import { ScrollView } from 'react-native';
import { Dictionary } from '../utils/dictionary';

const BCC101OnboardingSchedule = ({
    navigation,
    selectedDevice,
    getDeviceStatus,
    getScheduleList,
}) => {

    const [updateInfo, setUpdateInfo] = useState(true);

    useEffect(() => {
        getScheduleList({
            deviceId: navigation.getParam('macId'),
            unit: `${selectedDevice.isFahrenheit ? 'F' : 'C'}`,
        });
        getDeviceStatus(
            {
                deviceId: navigation.getParam('macId'),
            },
            response => {
                setUpdateInfo(true);
                updateSelected({ ...response });
            },
        );

    }, []);

    return (
        <View style={styles.mainContainer}>
            <Image
                style={{ height: 8, width: '100%' }}
                source={require('../assets/images/header_ribbon.png')}
            />
            <ScrollView>
                <BCCDashboardSchedule
                    navigation={navigation}
                    isFahrenheit={selectedDevice.isFahrenheit}
                    selectedDevice={selectedDevice}
                    schedules={selectedDevice.schedules}
                    isReusable={false}
                    createStatusInterval={() => { }}
                    setUpdateInfo={setUpdateInfo}
                    isOnboardingBcc50={true}
                />
                <View style={{ marginHorizontal: 15 }}>
                    <Button
                        testID="NextSSIDandPassword"
                        onPress={() => { navigation.navigate('BCCOnboardingAdded') }}
                        type={'primary'}
                        text={Dictionary.button.proceed}
                    />
                </View>
            </ScrollView>
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
    };
};

const mapDispatchToProps = {
    getScheduleList,
    getDeviceStatus,
    updateSelected,
};

export default connect(mapStateToProps, mapDispatchToProps)(BCC101OnboardingSchedule);
