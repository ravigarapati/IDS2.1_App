import React, {Component} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Button, CustomText} from '../components';
import {connect} from 'react-redux';
import {userFirstLogin} from '../store/actions/HomeOwnerActions';

class AddAnotherDevice extends Component {
  addAnotherDevice = () => {
    this.props.navigation.navigate('Add', {
      addAnother: true,
    });
  };

  cancel = () => {
    this.props.navigation.navigate('HomeTabs');
    //this.props.userFirstLogin(false);
  };

  render() {
    return (
      <View style={[styles.flex1, styles.padding10]}>
        <View style={[styles.flex1, styles.container]}>
          <Image source={require('./../assets/images/addanotherdevice.png')} />
          <CustomText
            allowFontScaling={true}
            font={'medium'}
            text={'Would you like to add\nanother Appliance?'}
            size={21}
          />
        </View>
        <View style={[styles.flex1, styles.buttonSection]}>
          <Button
            type="primary"
            text={'Yes'}
            onPress={this.addAnotherDevice}
            testID="submit"
          />
          <Button
            type="secondary"
            text={'No'}
            onPress={this.cancel}
            testID="cancel"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex1: {
    backgroundColor: 'white',
    flex: 1,
  },
  padding10: {
    padding: 10,
  },
  container: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginHorizontal: 40,
  },
  buttonSection: {
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
});

const mapDispatchToProps = {
  userFirstLogin,
};

export default connect(null, mapDispatchToProps)(AddAnotherDevice);
