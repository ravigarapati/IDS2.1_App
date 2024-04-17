import React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import BoschIcon from './BoschIcon';
import {Colors, Typography} from '../styles';
import {Icons} from '../utils/icons';
type linkProps = {
  text: string;
  url?: string;
  size?: number;
  type?: 'link' | 'arrow';
  onPress?: any;
};

export default function Link({
  text,
  url = undefined,
  size,
  type = 'link',
  onPress = null,
}: linkProps) {
  let fontSize = {fontSize: size};
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    if (url) {
      Linking.openURL(url);
    }
  };
  return (
    <>
      {type === 'link' && (
        <Text
          onPress={() => {
            handlePress();
          }}
          style={[styles.link, fontSize]}
          accessible={true}
          accessibilityLabel={text}
          accessibilityRole={'link'}>
          {text}
        </Text>
      )}
      {type === 'arrow' && (
        <TouchableWithoutFeedback
          onPress={() => {
            handlePress();
          }}
          accessible={true}
          accessibilityLabel={text}
          accessibilityRole={'link'}>
          <View style={styles.arrowContainer}>
            <Text style={[styles.link, fontSize, styles.arrowText]}>
              {text}
            </Text>
            <BoschIcon
              name={Icons.forwardRight}
              size={size * 1.5}
              color={Colors.blueOnPress}
              style={{height: size * 1.5}}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}

Link.defaultProps = {
  size: 16,
};
const styles = StyleSheet.create({
  link: {
    color: Colors.blueOnPress,
    ...Typography.boschReg16,
    textAlignVertical: 'center',
  },
  arrowContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
  },
  arrowText: {
    // paddingVertical: 10,
    flexShrink: 1,
  },
});
