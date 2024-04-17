import React from 'react';
import {StyleSheet, Modal, View, Text} from 'react-native';
import Button from './Button';
import {BlurView} from '@react-native-community/blur';

type ModalComponentProps = {
  modalVisible: boolean;
  closeModal: any;
  children: any;
  style?: any;
  blur?: boolean;
  testID?: string;
};

const ModalComponent = ({
  modalVisible,
  closeModal,
  children,
  style,
  blur,
  testID
}: ModalComponentProps) => {
  return (
    <Modal
      testID={testID}
      animationType="slide"
      transparent={blur ? true : false}
      visible={modalVisible}
      onRequestClose={() => {
        closeModal();
      }}>
      <View style={[styles.centeredView]}>
        {blur ? <BlurView style={styles.Blur} blurType="xlight" /> : null}
        <View style={[styles.modalView, style]}>
          <View style={styles.container}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    paddingTop: 16,
    paddingBottom: 35,
    paddingHorizontal: 10,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  Blur: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default ModalComponent;
