import React, {ReactElement, useState, useRef} from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from 'react-native';

interface Props {
  children: any;
  onPressDropdown?: any;
  options: any;
  opened: boolean;
  setOpened: any;
  isFirstOpened?: boolean;
  dropdownStyle: any;
  accessibilityLabelText?: string;
  accessibilityHintText?: string;
  testID?: string;
}

const Dropdown: FC<Props> = ({
  children,
  onPressDropdown,
  options,
  opened,
  setOpened,
  isFirstOpened,
  dropdownStyle,
  accessibilityLabelText = '',
  accessibilityHintText = '',
  testID
}) => {
  const DropdownButton = useRef();
  const [dropdownTop, setDropdownTop] = useState(0);

  const toggleDropdown = (): void => {
    opened ? setOpened(false) : openDropdown();
    if (onPressDropdown) {
      onPressDropdown();
    }
  };

  const openDropdown = (): void => {
    DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
      setDropdownTop(py + h);
    });
    setOpened(true);
  };

  const renderDropdown = (): ReactElement<any, any> => {
    return (
      <Modal
        accessible={false}
        visible={opened}
        transparent
        animationType="none">
        <TouchableOpacity
          accessible={false}
          style={styles.overlay}
          onPress={() => setOpened(false)}>
          <View
            style={[
              styles.dropdown,
              dropdownStyle ? dropdownStyle : null,
              {
                top: dropdownTop,
                marginTop: isFirstOpened ? 20 : 0,
              },
              Platform.OS === 'android' ? {elevation: 5} : {},
            ]}>
            {options}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <TouchableOpacity
      testID={testID}
      accessible={true}
      accessibilityRole="menu"
      accessibilityLabel={
        accessibilityLabelText ? accessibilityLabelText : undefined
      }
      accessibilityHint={
        accessibilityHintText ? accessibilityHintText : undefined
      }
      ref={DropdownButton}
      style={styles.button}
      onPress={toggleDropdown}>
      {renderDropdown()}
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    zIndex: 1,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    marginHorizontal: '5%',
    width: '90%',
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: {height: 4, width: 0},
    shadowOpacity: 0.5,
  },
  overlay: {
    width: '100%',
    height: '100%',
  },
});

export default Dropdown;
