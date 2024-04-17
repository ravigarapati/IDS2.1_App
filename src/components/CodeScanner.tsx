import React from 'react';
import {Dimensions, StyleSheet, View, Text} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import {Colors} from '../styles';
import Button from './Button';
import {Dictionary} from '../utils/dictionary';
// import {RNCamera} from 'react-native-camera';
type scannerProps = {
  onClose: any;
  data: any;
  onCancel?: any;
  textToDisplay?: string;
  height?: any;
  testID?:string;
};

export default function CodeScanner({
  onClose,
  data,
  onCancel,
  textToDisplay,
  height = undefined,
  testID,
}: scannerProps) {
  return (
    <View testID={testID} style={{flex: 1}}>
      {textToDisplay && (
        <Text
          style={{
            position: 'absolute',
            alignSelf: 'center',
            bottom: '25%',
            opacity: 0.7,
            zIndex: 100,
          }}>
          {textToDisplay}
        </Text>
      )}
      <QRCodeScanner
        reactivate={true}
        reactivateTimeout={2000}
        onRead={value => {
          data(value.data);
          onClose(false);
        }}
        checkAndroid6Permissions={true}
        cameraStyle={
          height ? {height: height} : {height: Dimensions.get('window').height}
        }
        // flashMode={RNCamera.Constants.FlashMode.torch}
        showMarker={true}
        markerStyle={styles.QRstyle}
      />
      <BarcodeMask
        edgeColor={Colors.white}
        showAnimatedLine
        backgroundColor={Colors.lightGray}
        edgeBorderWidth={3}
      />

      <Button
        type="secondary"
        onPress={() => (onCancel ? onCancel(false) : onClose(false))}
        style={styles.closeButton}
        text={Dictionary.button.cancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    backgroundColor: Colors.white,
    padding: 20,
  },
  QRstyle: {
    borderWidth: 0,
  },
});
