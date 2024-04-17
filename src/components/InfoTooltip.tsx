import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Text,
  AppState,
} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import BoschIcon from './BoschIcon';
import {Colors, Typography} from '../styles';
import {Icons} from '../utils/icons';

type TooltipProps = {
  text?: string;
  positionHorizontal?: 'center' | 'left' | 'right';
  positionVertical?: 'top' | 'bottom';
  children?: any;
  icon?: string;
  closeTooltip?: boolean;
  showDefault?: boolean;
  accessiblityLabel?: string;
};
export default function InfoTooltip({
  text = 'Tooltip',
  positionHorizontal = 'left',
  positionVertical = 'top',
  children,
  icon = Icons.infoTooltip,
  closeTooltip = false,
  showDefault = false,
  accessiblityLabel = undefined,
}: TooltipProps) {
  var triangleDirection, triangle1, triangle2;
  const [showTooltip, setShowTooltip] = useState(showDefault);
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    if (closeTooltip) {
      setShowTooltip(false);
    }
  }, [closeTooltip]);

  useEffect(() => {
    AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setShowTooltip(false);
      }
      appState.current = nextAppState;
    });
  }, []);

  switch (positionVertical) {
    case 'top':
      triangle1 = {bottom: 45};
      triangle2 = {bottom: 46.5};
      triangleDirection = {borderTopWidth: 10};
      break;
    case 'bottom':
      triangle1 = {top: 45};
      triangle2 = {top: 46.5};
      triangleDirection = {borderBottomWidth: 10};
      break;
  }
  // To bold text within a sentence --wrapTags
  // Works for only one occurence in a sentence
  const wrapTags = txt => {
    const textArray = txt.toString().split(/(\*.*\*)/g);
    if (textArray && textArray.length > 0) {
      textArray.forEach((element, i) => {
        if (/\*.*\*/g.test(element)) {
          textArray[i] = (
            <Text key={i} style={styles.bold}>
              {element.replace(/\*/g, '')}
            </Text>
          );
        }
      });
    }
    return textArray;
  };
  text = wrapTags(text);
  return (
    <Tooltip
      accessible={false}
      isVisible={showTooltip}
      onClose={() => setShowTooltip(false)}
      closeOnContentInteraction={false}
      childContentSpacing={Platform.OS === 'ios' ? 1 : 4}
      disableShadow={true}
      content={
        <ScrollView accessible={false} contentContainerStyle={[styles.flex1]}>
          <View
            style={styles.flexRow}
            //onStartShouldSetResponder={() => true}
          >
            {children !== undefined ? (
              children
            ) : (
              <Text style={styles.tooltipText}>{text}</Text>
            )}
            <TouchableOpacity
              accessible={true}
              style={[styles.close]}
              onPress={() => {
                setShowTooltip(false);
              }}>
              <BoschIcon name={Icons.close} size={25} style={{height: 25}} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      }
      placement={positionVertical}
      backgroundColor={Colors.transparent}
      tooltipStyle={{}}
      arrowStyle={{borderTopColor: Colors.transparent}}
      contentStyle={styles.container}>
      <TouchableOpacity
        onPress={() => setShowTooltip(true)}
        accessibilityLabel={accessiblityLabel ? accessiblityLabel : undefined}
        style={[styles.padding10]}
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
        <BoschIcon
          name={icon}
          color={Colors.darkBlue}
          size={25}
          style={[
            icon === Icons.options ? styles.optionIcon : null,
            {height: 25},
          ]}
        />
      </TouchableOpacity>
      {showTooltip && (
        <View
          style={[
            styles.triangleCommon,
            styles.triangleGray,
            triangleDirection,
            triangle1,
          ]}
        />
      )}
      {showTooltip && (
        <View
          style={[
            styles.triangleCommon,
            styles.triangleWhite,
            triangleDirection,
            triangle2,
          ]}
        />
      )}
    </Tooltip>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  container: {
    borderWidth: 1,
    borderColor: Colors.mediumGray,
    borderRadius: 0,
  },
  tooltip: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    borderColor: Colors.mediumGray,
    borderWidth: 1,
    backgroundColor: Colors.white,
  },
  flex1: {
    flex: 1,
  },
  tooltipText: {
    ...Typography.boschReg12,
    textAlign: 'left',
    flexShrink: 1,
  },
  triangleCommon: {
    width: 10,
    height: 10,
    position: 'absolute',
    borderLeftWidth: 10,
    borderLeftColor: Colors.transparent,
    borderRightWidth: 10,
    borderRightColor: Colors.transparent,
    alignSelf: 'center',
  },
  triangleGray: {
    borderTopColor: Colors.mediumGray,
    borderBottomColor: Colors.mediumGray,
  },
  triangleWhite: {
    borderBottomColor: Colors.white,
    borderTopColor: Colors.white,
    zIndex: 100,
  },
  close: {
    alignSelf: 'flex-start',
    padding: 5,
  },
  padding10: {
    padding: 10,
  },
  bold: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
  },
  optionIcon: {
    transform: [{rotate: '90deg'}],
  },
});
