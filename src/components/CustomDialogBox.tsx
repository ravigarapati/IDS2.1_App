import React, { useState } from 'react';
import { Modal, StyleSheet, View, Text } from 'react-native';
import Button from './Button';
import { Colors } from '../styles';
import { Link, CustomText, CheckBox } from '../components';
import { Dictionary } from '../utils/dictionary';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CustomDialogProps = {
    visible: boolean;
    text: string;
    textLink: string;
    storageName: string;
    buttonText: string;
    callbackFunc?: () => void;
};

export default function CustomDialogBox({
    visible,
    text,
    textLink,
    buttonText,
    storageName,
    callbackFunc,
}: CustomDialogProps) {

    const [doNotShow, setDoNotShow] = useState(false);

    return (
        <Modal animationType="none" transparent={true} visible={visible}>
            <View style={styles.modalContainer}>
                <View style={styles.contentContainer}>
                    <Text style={styles.star}>
                        {'* '}
                        <CustomText text={text} align="left" color={Colors.black} />
                    </Text>
                    <Link
                        text={textLink}
                        url={textLink}
                    />
                    <View style={[styles.paddingVertical10]}>
                        <Button
                            type="primary"
                            text={buttonText}
                            onPress={() => {
                            if (doNotShow) {
                                AsyncStorage.setItem(storageName, 'hide');
                            }
                                callbackFunc()
                            }}
                        />
                        <CheckBox
                            checked={doNotShow}
                            onChange={setDoNotShow}
                            text={Dictionary.addUnit.doNotShowAgain}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    contentContainer: {
        width: '90%',
        borderWidth: 0.5,
        borderColor: Colors.mediumGray,
        backgroundColor: Colors.white,
        padding: 20,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    paddingVertical10: {
        paddingVertical: 10,
    },
    marginBottom: {
        marginBottom: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.blur,
    },
    star: {
        color: Colors.darkRed,
    },
});
