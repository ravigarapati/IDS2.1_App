import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import Button from './Button';
import CustomText from './CustomText';
import { Colors } from '../styles';
import { BoschIcon } from '../components';
import { Icons } from '../utils/icons';

type ConfirmationDialogProps = {
  title?: string;
  text: string;
  textAlign?: any;
  textColor?: any;
  warningAlertText?: string;
  primaryButton?: string;
  secondaryButton?: string;
  primaryButtonOnPress?: () => void;
  secondaryButtonOnPress?: () => void;
  style?: any;
  visible: boolean;
};

export default function ConfirmationDialog({
  title,
  text,
  textAlign,
  textColor,
  warningAlertText,
  primaryButton,
  secondaryButton,
  primaryButtonOnPress,
  secondaryButtonOnPress,
  visible,
}: ConfirmationDialogProps) {
  return (
    <Modal animationType="none" transparent={true} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.contentContainer}>
          {title ? (
            <CustomText
              text={title}
              align="center"
              color={textColor ? textColor : Colors.black}
              style={styles.marginBottom}
            />
          ) : null}
          <CustomText text={text} align={textAlign ? textAlign : 'left'} color={textColor ? textColor : Colors.black} />
          {warningAlertText ? (
            <View style={styles.noteAlert}>
              <BoschIcon
                name={Icons.alertWarning}
                size={36}
                color="#725B00"
                style={styles.icon}
              />
              <CustomText
                text={warningAlertText}
                align="left"
                color="#725B00"
              />
            </View>
          ) : null}
          <View style={[styles.paddingVertical10]}>
            {primaryButton && (
              <Button
                type="primary"
                text={primaryButton}
                onPress={primaryButtonOnPress}
              />
            )}
            {secondaryButton && (
              <Button
                type="secondary"
                text={secondaryButton}
                onPress={secondaryButtonOnPress}
              />
            )}
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
  noteAlert: {
    flexDirection: 'row',
    backgroundColor: '#FFDF95',
    color: '#725B00',
    padding: 15,
    marginBottom: 50,
    marginTop: 5
  },
  icon: {
    marginRight: 15,
    marginTop: 5,
    height: 36,
  }
});
