import React from 'react';
import {View, Pressable, Dimensions} from 'react-native';
import CustomText from './CustomText';

const width = Dimensions.get('window').width;

type DayTileProps = {
  selected: any;
  setSelected: any;
  text: string;
  number: any;
  accessibilityLabelText?: string;
  accessibilityHintText?: string;
};

function DayTile({
  selected,
  setSelected,
  text,
  number,
  accessibilityLabelText = undefined,
  accessibilityHintText = undefined,
}: DayTileProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabelText}
      accessibilityHint={accessibilityHintText}
      style={{
        width: width * 0.12,
        height: width * 0.12,
        paddingVertical: 11,
        paddingHorizontal: 6,
        backgroundColor: selected === number ? '#004975' : 'white',
      }}
      onPress={() => {
        setSelected(number);
      }}>
      <CustomText
        allowFontScaling={true}
        style={{
          color: selected === number ? 'white' : 'black',
        }}
        text={text}
      />
    </Pressable>
  );
}

export default DayTile;
