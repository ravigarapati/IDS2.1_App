import React, {useState} from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Icons} from '../utils/icons';
import {BoschIcon, CustomText} from '.';
import {Colors} from '../styles';
type accordionProps = {
  title: string;
  disabled: boolean;
  children: any;
  index: number;
};
export default function Accordion({
  title,
  disabled,
  index,
  children,
}: accordionProps) {
  const [open, setOpen] = useState(false);
  const borderTop = index === 0 ? {borderTopWidth: 1} : {borderTopWidth: 0};
  return (
    <>
      <View>
        <View style={[styles.title, borderTop]}>
          <CustomText size={16} font="medium" text={title} />
          <TouchableWithoutFeedback
            hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
            onPress={() => (disabled ? {} : setOpen(!open))}
            accessibilityLabel={open ? (title + 'expanded') : (title + 'collapsed')}
            accessibilityState={{expanded: open}}>
            <BoschIcon
              color={disabled ? Colors.grayDisabled : Colors.darkBlue}
              name={open ? Icons.up : Icons.down}
              size={30}
              style={{height: 30}}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
      {open && <View style={styles.bodyBackground}>{children}</View>}
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.mediumGray,
    padding: 20,
    flex: 1,
  },
  bodyBackground: {
    backgroundColor: Colors.white,
    borderColor: Colors.mediumGray,
    padding: 20,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
});
