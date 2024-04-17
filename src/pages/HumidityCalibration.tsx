import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Image} from 'react-native';
import OptionText from '../components/OptionText';
import { BoschIcon, CustomText, Button, ProgressIndicator, SwitchContent, CustomWheelPicker } from '../components';
import { Icons } from '../utils/icons';
import { Colors } from '../styles';
import { Dictionary } from '../utils/dictionary';
import { getAdvancedSettings, getDeviceInformation, lockScreen, setAdccessSettings } from '../store/actions/HomeOwnerActions';
import { connect, useDispatch } from 'react-redux';
import { CustomWheelPick } from '../components/CustomWheelPick';
const DROP_ICON = require('../assets/images/drop.png');


function HumidityCalibrationScreen({
    navigation,
    getDeviceInformation,
    deviceInformation,
    selectedDevice
}) {
    const dispatch = useDispatch()
    const [Offset, setOffset] = useState(0)
    const [hc_adjustedReading, setHC_adjustedReading] = useState(0)
    const [hc_currentReading, setHC_currentReading] = useState(0)
    const [OffsetValues, setOffset_Values] = useState(
        Array.from({ length: (5 - (-5)) / 1 + 1 }, (_, i) => `${(-5) + i * 1} %`)
    )

    const [values, setValues]= useState({})


    useEffect(() => {
        loadRunTimeValues()
    }, []);

    function loadRunTimeValues() {
        return new Promise<void>((resolve, reject) => {
            /* istanbul ignore next */dispatch(getAdvancedSettings(selectedDevice.macId,(response=>{

                const fanDelay = response.fanDelay
                const fanOnDelay = response.fanOnDelay
                const fanOffDelay = response.fanOffDelay
                const minRunTime = response.minRunTime
                const antiShortTime = response.antiShortTime
                const cycleTime = response.cycleTime
                const heatDeadBand = response.heatDeadBand
                const coolDeadBand = response.coolDeadBand

                const db = response.db
                const hc = parseInt(response.hc)
                const hc_adjustedReading = response.hc_adjustedReading
                const hsd = response.hsd
                const humidity = parseInt(response.humidity)
                const latching = response.latching
                const room_temp = response.room_temp
                const sc = response.sc
                const sc_adjustedReading = response.sc_adjustedReading
                const ss = response.ss
                const stageDelay = response.stageDelay
                const stageTemp = response.stageTemp

                setValues({
                    db,
                    hc,
                    hsd,
                    latching,
                    sc,
                    ss,
                    stageDelay,
                    stageTemp,
                })

                setOffset(hc)
                setHC_adjustedReading(humidity)
                setHC_currentReading((humidity - hc))

                resolve()
            })))
        })
    }
    function setAdvancedSettings(value) {
        /* istanbul ignore next */return new Promise<void>((resolve, reject) => {
            dispatch(setAdccessSettings(
                selectedDevice.macId,
                value,
                response=>{
                    resolve()
            }))
        })
    }

     const setHandlerOffset = async(selected) =>{
        let replacementArray = OffsetValues[selected ? selected['0'] : 0].split(' ');
        let replacement = replacementArray[0]
        setOffset((replacement).toString())

        setValues({...values,hc:replacement})
        await setAdvancedSettings({...values,hc:(replacement).toString()})
        dispatch({
            type: 'SHOW_LOADING',
            data: true,
          });
        setTimeout(() => {
            loadRunTimeValues()
        }, 3000);
    }
    
    return (
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'space-between' }}>
             <Image
                style={{ height: 8, width: '100%' }}
                source={require('../assets/images/header_ribbon.png')}
            />
            <ScrollView>
                <View>
                    <View style={{ padding: 15 }}>
                        <View style={styles.optionContainer}>
                            <View pointerEvents='none'>
                                <CustomWheelPick
                                    type={'picker'}
                                    blur={true}
                                    edit={true}
                                    accessibilityHintText={'Current Reading'}
                                    pickerWidth={'100%'}
                                    placeholder={'Current Reading'}
                                    value={(hc_currentReading +'%')}
                                    isRequiredField={true}
                                    values={OffsetValues}
                                    defaultIndex={0}
                                    defaultValue={OffsetValues[0]}
                                    
                                />
                            </View>
                        </View>
                        <View style={styles.optionContainer}>
                            <CustomWheelPick
                                type={'picker'}
                                testID='OffsetWheel'
                                blur={true}
                                edit={true}
                                accessibilityHintText={'Offset'}
                                pickerWidth={'100%'}
                                placeholder={'Offset'}
                                value={(Offset +'%')}
                                isRequiredField={true}
                                values={OffsetValues}
                                defaultIndex={0}
                                defaultValue={OffsetValues[0]}
                                onConfirm={(selected) => {
                                    setHandlerOffset(selected)
                                }}
                                
                            />
                        </View>
                        <View style={styles.optionContainer}>
                            <View pointerEvents='none'>
                                <CustomWheelPick
                                    type={'picker'}
                                    blur={true}
                                    edit={true}
                                    accessibilityHintText={'Adjusted Reading'}
                                    pickerWidth={'100%'}
                                    placeholder={'Adjusted Reading'}
                                    value={(hc_adjustedReading +'%')}
                                    isRequiredField={true}
                                    values={OffsetValues}
                                    defaultIndex={0}
                                    defaultValue={OffsetValues[0]}
                                    
                                />
                            </View>
                        </View>
                        <View style={styles.tipSection}>
                            <BoschIcon
                                size={20}
                                name={Icons.infoTooltip}
                                color={Colors.mediumBlue}
                                accessibilityLabel={'Info'}
                            />
                            <CustomText
                                accessibilityLabelText={'Adjust inaccurate Humidity reading from extended use (+/-). Offset is measured by substracting current reading from adjusted reading'}
                                size={12}
                                align="left"
                                newline={true}
                                text={'Adjust inaccurate Humidity reading from extended use (+/-). Offset is measured by substracting current reading from adjusted reading'}
                                style={[styles.flexShrink1, styles.paddingLeft5]}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const mapStateToProps = (state) => {
    return {
        deviceStatus: state.homeOwner.deviceInformation,
        selectedDevice: state.homeOwner.selectedDevice,
    };
};

const mapDispatchToProps = {
    getDeviceInformation,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(HumidityCalibrationScreen);


const styles = StyleSheet.create({
    optionContainer: {
        borderBottomWidth: 1,
        borderColor: '#BFC0C2',
        marginBottom:20
    },
    
    tipSection: {
        flexDirection: 'row',
        marginTop: 33,
    },
    flexShrink1: {
        flexShrink: 1,
    },
    paddingLeft5: {
        paddingLeft: 12,
    },
});

