import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {Colors} from '../styles/colors';
import {BoschIcon, CustomText} from '../components';
import {Icons} from '../utils/icons';

const height = Dimensions.get('window').height;

const ToastDesign = ({text, type}) => {
  var toastStyle = {
    textColor: null,
    style: null,
    icon: null,
  };
  switch (type) {
    case 'error':
      toastStyle = {
        textColor: Colors.darkRed,
        style: styles.errorContainer,
        icon: Icons.alertError,
      };
      break;
    case 'info':
      toastStyle = {
        textColor: Colors.darkBlue,
        style: styles.infoContainer,
        icon: Icons.infoFrame,
      };
      break;
    case 'success':
      toastStyle = {
        textColor: Colors.darkGreen,
        style: styles.successContainer,
        icon: Icons.checkmarkFrame,
      };
      break;
  }
  return (
    <View
      style={[toastStyle.style, styles.container]}
      accessible={true}
      accessibilityLabel={text}>
      <View style={styles.flexRow}>
        <BoschIcon
          name={toastStyle.icon}
          size={26}
          color={toastStyle.textColor}
          style={{height: 26}}
        />
        <CustomText
          align="left"
          text={text}
          style={styles.padLeft10}
          color={toastStyle.textColor}
        />
      </View>
      <TouchableOpacity
        style={styles.close}
        onPress={() => {
          Toast.hide();
        }}>
        <BoschIcon
          size={20}
          name={Icons.close}
          color={Colors.black}
          style={{height: 20}}
        />
      </TouchableOpacity>
    </View>
  );
};
const toastConfig = {
  error: ({text1, props, ...rest}) => <ToastDesign text={text1} type="error" />,
  info: ({text1, props, ...rest}) => <ToastDesign text={text1} type="info" />,
  success: ({text1, props, ...rest}) => (
    <ToastDesign text={text1} type="success" />
  ),
};

export function showToast(text, type?, topOffset?) {
  let topMargin = Platform.OS === 'ios' ? height * 0.11 : 60;
  Toast.show({
    text1: text ? text : '',
    type: type ? type : 'info',
    position: 'top',
    visibilityTime: 5000,
    autoHide: true,
    topOffset: topOffset ? topOffset : topMargin,
    bottomOffset: 40,
    onShow: () => {},
    onHide: () => {},
    onPress: () => {
      Toast.hide();
    },
  });
}
export default function CustomToast() {
  return <Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />;
}

const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: Colors.lightRed,
  },
  infoContainer: {
    backgroundColor: Colors.lightBlue,
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  successContainer: {
    backgroundColor: Colors.lightGreen,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  padLeft10: {
    paddingLeft: 10,
  },
  close: {
    padding: 5,
  },
});
