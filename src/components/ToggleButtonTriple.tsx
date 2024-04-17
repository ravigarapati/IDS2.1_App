import React, {useEffect, useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import BoschIcon from './BoschIcon';
import {Colors} from '../styles';
import CustomText from './CustomText';
type ToggleButton = {
  button1?: string;
  button2?: string;
  button3?: string;
  pressed?: number;
  onChange?: any;
  style?: any;
  type?: string;
  isvisible?: boolean;
  testIDPrimary?: string;
  testIDSecondary?: string;
  testIDThird?: string;
  button1AccessibilityHint?: string;
  button2AccessibilityHint?: string;
  button3AccessibilityHint?: string;
};

export default function ToggleButtonTriple({
  button1 = 'Button1',
  button2 = 'Button2',
  button3 = 'Button3',
  pressed = 0,
  isvisible = true,
  onChange,
  style,
  type = 'text',
  testIDPrimary,
  testIDSecondary,
  testIDThird,
  button1AccessibilityHint = undefined,
  button2AccessibilityHint = undefined,
  button3AccessibilityHint = undefined,
}: ToggleButton) {
  const [selected, setSelected] = useState(pressed);
  const [visible, setVisible] = useState(isvisible);
  const [button1Type, setButton1Type] = useState('');
  const [button2Type, setButton2Type] = useState('');
  const [button3Type, setButton3Type] = useState('');

  useEffect(() => {
    if (isvisible === true) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [visible]);
  useEffect(() => {
    switch (selected) {
      case 0:
        setButton1Type('primary');
        setButton2Type('secondary');
        setButton3Type('secondary');
        break;

      case 1:
        setButton1Type('secondary');
        setButton2Type('primary');
        setButton3Type('secondary');
        break;

      case 2:
        setButton1Type('secondary');
        setButton2Type('secondary');
        setButton3Type('primary');
        break;
    }
  }, [selected]);

  function changeColor(button) {
    switch (button) {
      case 0:
        setSelected(0);
        onChange(0);
        break;

      case 1:
        setSelected(1);
        onChange(1);
        break;

      case 2:
        setSelected(2);
        onChange(2);
        break;
    }
  }

  return (
    <>
      {visible && (
        <View style={[style, styles.container]}>
          <TouchableOpacity
            testID={testIDPrimary}
            accessible={true}
            accessibilityLabel={`${button1} option`}
            accessibilityRole="button"
            accessibilityHint={
              button1AccessibilityHint
                ? button1AccessibilityHint
                : `Press it to choose ${button1}`
            }
            activeOpacity={0.7}
            style={[
              styles.button,
              button1Type === 'primary' ? styles.primary : styles.secondary,
            ]}
            onPress={() => changeColor(0)}>
            {type === 'text' ? (
              <CustomText
                text={button1}
                color={
                  button1Type === 'primary' ? Colors.white : Colors.darkBlue
                }
              />
            ) : (
              <BoschIcon
                size={24}
                name={button1}
                color={
                  button1Type === 'primary' ? Colors.white : Colors.darkBlue
                }
                style={{alignSelf: 'center'}}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            testID={testIDSecondary}
            accessible={true}
            accessibilityLabel={`${button2} option`}
            accessibilityRole="button"
            accessibilityHint={
              button2AccessibilityHint
                ? button2AccessibilityHint
                : `Press it to choose ${button2}`
            }
            activeOpacity={0.7}
            style={[
              styles.button,
              button2Type === 'primary' ? styles.primary : styles.secondary,
            ]}
            onPress={() => changeColor(1)}>
            {type === 'text' ? (
              <CustomText
                text={button2}
                color={
                  button2Type === 'primary' ? Colors.white : Colors.darkBlue
                }
              />
            ) : (
              <BoschIcon
                size={24}
                name={button2}
                color={
                  button2Type === 'primary' ? Colors.white : Colors.darkBlue
                }
                style={{alignSelf: 'center'}}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            testID={testIDThird}
            accessible={true}
            accessibilityLabel={`${button3} option`}
            accessibilityRole="button"
            accessibilityHint={
              button3AccessibilityHint
                ? button3AccessibilityHint
                : `Press it to choose ${button3}`
            }
            activeOpacity={0.7}
            style={[
              styles.button,
              button3Type === 'primary' ? styles.primary : styles.secondary,
            ]}
            onPress={() => changeColor(2)}>
            {type === 'text' ? (
              <CustomText
                text={button3}
                color={
                  button3Type === 'primary' ? Colors.white : Colors.darkBlue
                }
              />
            ) : (
              <BoschIcon
                size={24}
                name={button3}
                color={
                  button3Type === 'primary' ? Colors.white : Colors.darkBlue
                }
                style={{alignSelf: 'center'}}
              />
            )}
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
    flex: 1,
  },
  button: {
    paddingVertical: 15,
    flex: 1,
    borderColor: Colors.darkBlue,
    borderWidth: 1,
  },
  primary: {
    backgroundColor: Colors.darkBlue,
  },
  secondary: {
    backgroundColor: Colors.white,
  },
});
