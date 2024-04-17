import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors, Typography} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {Icons} from '../utils/icons';
import BoschIcon from './BoschIcon';
import Button from './Button';

const IconInCircle = ({name, accessibilityLabel}) => (
  <View style={styles.circle}>
    <BoschIcon
      name={name}
      size={30}
      color={Colors.blueOnPress}
      accessibilityLabel={accessibilityLabel}
      style={{height: 30}}
    />
  </View>
);
export default function CreateProfileWalkthrough() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('showTooltipWalkthrough').then(value => {
      if (value !== 'false') {
        setVisible(true);
      } else {
        setVisible(false);
      }
    });
  }, []);

  return (
    <Modal transparent visible={visible}>
      <SafeAreaView style={[styles.container]}>
        <View style={styles.opacity}>
          <Text style={styles.headerText}>Create Profile</Text>

          <Image
            style={styles.image}
            source={require('../assets/images/header_ribbon.png')}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.text}>
              {Dictionary.walkthrough.infoTooltip}
            </Text>
            <BoschIcon
              name={Icons.arrowDown}
              size={30}
              color={Colors.blueOnPress}
              accessibilityLabel={'Down arrow'}
              style={{height: 30}}
            />
          </View>
          <TouchableOpacity onPress={() => setShowTooltip(true)}>
            <IconInCircle
              name={Icons.infoTooltip}
              accessibilityLabel={'info'}
            />
          </TouchableOpacity>

          {showTooltip && (
            <View style={styles.infoContainer}>
              <View style={styles.flex9}>
                <Text style={styles.tooltipText}>
                  {Dictionary.walkthrough.tooltipContent}
                </Text>
              </View>
              <View style={styles.flex1}>
                <TouchableOpacity
                  style={[styles.close]}
                  onPress={() => {
                    setShowTooltip(false);
                  }}>
                  <BoschIcon
                    name={Icons.close}
                    size={22}
                    style={{height: 22}}
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.triangleCommon, styles.triangleGray]} />
              <View style={[styles.triangleCommon, styles.triangleWhite]} />
            </View>
          )}
          <View style={styles.opacity}>
            <Button type="secondary" text={Dictionary.userRole.homeowner} />
            <Button type="secondary" text={Dictionary.userRole.contractor} />
            <Button
              type="secondary"
              text={Dictionary.userRole.adminContractor}
            />
          </View>
        </View>

        <View style={styles.pad20}>
          <Button
            type="primary"
            text={Dictionary.button.next}
            onPress={() => {
              if (!showTooltip) {
                setShowTooltip(true);
              } else {
                AsyncStorage.setItem('showTooltipWalkthrough', 'false');
                setVisible(false);
              }
            }}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  opacity: {
    opacity: 0.2,
  },
  content: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    height: 8,
    width: '100%',
  },
  headerText: {
    padding: 20,
    fontFamily: Typography.FONT_FAMILY_MEDIUM,
    fontSize: 18,
  },
  pad20: {
    padding: 20,
  },
  text: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: 16,
    flexWrap: 'wrap',
    alignSelf: 'flex-end',
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.blueOnPress,
    borderWidth: 1,
    marginRight: 10,
    marginVertical: 10,
    alignSelf: 'flex-end',
  },
  paddingVertical: {
    paddingVertical: 20,
  },
  triangleCommon: {
    width: 10,
    height: 10,
    position: 'absolute',
    borderLeftWidth: 10,
    borderLeftColor: Colors.transparent,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderRightColor: Colors.transparent,
    right: 10,
  },
  triangleGray: {
    top: -10,
    borderBottomColor: Colors.mediumGray,
  },
  triangleWhite: {
    top: -8.5,
    borderBottomColor: Colors.white,
  },
  infoContainer: {
    flexDirection: 'row',
    borderColor: Colors.mediumGray,
    borderWidth: 1,
    backgroundColor: Colors.white,
    width: '92%',
    alignSelf: 'center',
    padding: 15,
  },
  tooltipText: {
    fontFamily: Typography.FONT_FAMILY_REGULAR_ITALIC,
    fontSize: 16,
  },
  close: {
    alignSelf: 'flex-start',
    paddingLeft: 5,
  },
  flex9: {
    flex: 0.9,
  },
  flex1: {
    flex: 0.1,
  },
});
