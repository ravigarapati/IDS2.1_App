import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {Colors} from '../styles';
import {useSelector} from 'react-redux';

export default function Loader() {
  const loading = useSelector((state) => state.common.showLoading);

  return (
    <>
      {loading && (
        <View style={[styles.loader]}>
          <ActivityIndicator size="large" color={Colors.darkBlue} />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blur,
  },
});
