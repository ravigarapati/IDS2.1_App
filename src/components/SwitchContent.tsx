import {View, StyleSheet, AccessibilityActionEvent} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CustomText} from '../components';
import {Colors} from '../styles';
import SwitchToggle from 'react-native-switch-toggle';
import {Dictionary} from '../utils/dictionary';

type SwitchContentProps = {
  initialText: any;
  accesoryOn: boolean;
  children: any;
  switchStatus: any;
  idAccesory: any;
  marginTop?: any;
  paddingHorizontal?: any;
  marginHorizontal?: any;
  borderBottomColor?: any;
  initialEventOff?: boolean;
  testID?: string;
  accessibilityLabelText?: string;
  accessibilityHintText?: string;
  titleFontSize?: number;
};

function SwitchContent({
  initialText,
  accesoryOn,
  children,
  switchStatus,
  idAccesory,
  marginTop,
  paddingHorizontal,
  marginHorizontal,
  borderBottomColor,
  initialEventOff,
  testID,
  titleFontSize,
  accessibilityLabelText = undefined,
  accessibilityHintText = undefined,
}: SwitchContentProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  /*
  useEffect(() => {
    if (accesoryOn !== undefined) {
      setIsEnabled(accesoryOn);
    }
    switchStatus(accesoryOn, idAccesory);
  }, []);*/

  useEffect(() => {
    if (accesoryOn !== undefined) {
      setIsEnabled(accesoryOn);
    }
    if (!initialEventOff) {
      switchStatus(accesoryOn, idAccesory);
    }
  }, [accesoryOn]);

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    switchStatus(!isEnabled, idAccesory, true);
  };

  return (
    <View>
      <View
        style={[
          styles.AccesoryContainer,
          {
            paddingHorizontal:
              paddingHorizontal != null ? paddingHorizontal : 16,
            borderBottomColor:
              borderBottomColor != null ? borderBottomColor : 16,
          },
        ]}
        accessible={true}
        accessibilityLabel={`${
          accessibilityLabelText
            ? accessibilityLabelText
            : isEnabled
            ? Dictionary.Accesories.disabledAccesory + initialText
            : Dictionary.Accesories.enableAccesory + initialText
        }`}
        accessibilityHint={
          accessibilityHintText
            ? accessibilityHintText
            : Dictionary.Accesories.AccesoryHint
        }
        accessibilityRole={'button'}
        accessibilityActions={[{name: 'activate'}]}
        /* onAccessibilityAction={(event: AccessibilityActionEvent) => {
          switch (event.nativeEvent.actionName) {
            case 'activate':
              toggleSwitch();
              break;
          }
        }}*/
        onAccessibilityAction={() => {
          toggleSwitch();
        }}>
        <CustomText
          allowFontScaling={true}
          color={Colors.black}
          font={'medium'}
          text={initialText}
          align={'left'}
          size={titleFontSize ? titleFontSize : 18}
        />
        <SwitchToggle
          testID={testID}
          switchOn={isEnabled}
          onPress={() => toggleSwitch()}
          circleColorOff="#FFFFFF"
          circleColorOn="#FFFFFF"
          backgroundColorOn="#00629A"
          backgroundColorOff="#71767C"
          containerStyle={{
            marginTop: marginTop != null ? marginTop : 16,
            width: 48,
            height: 24,
            borderRadius: 25,
            padding: 5,
            marginHorizontal: marginHorizontal != null ? marginHorizontal : 1,
          }}
          circleStyle={{
            width: 12,
            height: 12,
            borderRadius: 20,
          }}
        />
      </View>
      {isEnabled ? <View>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  AccesoryContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#BFC0C2',
    height: 64,
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  setPointContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#0A0A0A',
    height: 56,
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    backgroundColor: '#EEEEEE',
  },
  width97Percent: {width: '97%'},
  marginTop49: {marginTop: 49},
  justifyContentCenter: {justifyContent: 'center'},
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  modalView: {
    margin: 20,
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
});
export default SwitchContent;
