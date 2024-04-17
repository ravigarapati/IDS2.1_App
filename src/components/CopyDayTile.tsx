import React from 'react';
import {View, Pressable} from 'react-native';
import CustomText from './CustomText';

type CopyDayTile = {
  text: string;
  onSelect: any;
  selected: any;
  accessibilityLabelText?: string;
  accessibilityHintText?: string;
};

function CopyDayTile({
  text,
  onSelect,
  selected,
  accessibilityLabelText = undefined,
  accessibilityHintText = undefined,
}: CopyDayTile) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabelText}
      accessibilityHint={accessibilityHintText}
      onPress={() => onSelect()}
      style={{
        borderWidth: selected ? 0 : 1,
        borderRadius: 50,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 1.5,
        backgroundColor: selected ? '#004975' : 'white',
        borderColor: selected ? 'white' : '#BFC0C2',
      }}>
      <CustomText text={text} color={selected ? 'white' : 'black'} />
    </Pressable>
  );
}

export default CopyDayTile;
