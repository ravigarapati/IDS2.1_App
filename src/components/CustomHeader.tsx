import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {Header} from 'react-navigation-stack';

const CustomHeader = props => {
  return (
    <View>
      <Header {...props} />
      <Image
        style={styles.image}
        source={require('../assets/images/header_ribbon.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 8,
    width: '100%',
  },
});
export default CustomHeader;
