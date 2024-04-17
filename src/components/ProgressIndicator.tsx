import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors, Typography} from '../styles';
import BoschIcons from './BoschIcon';
import CustomText from './CustomText';
import {Icons} from '../utils/icons';
type ProgressIndicator = {
  steps: number;
  currentStep: number;
  phoneNoVerified?: boolean;
  style?: {};
  stepTitles?: any[];
  bcc?: boolean;
};
export default function ProgressIndicator({
  steps,
  currentStep,
  phoneNoVerified,
  style,
  stepTitles,
  bcc,
}: ProgressIndicator) {
  var output: any[] = [];
  for (let i = 1; i <= steps; i++) {
    var progressItems = (
      <View key={i} style={styles.nodeContainer}>
        {((i > currentStep && !stepTitles) ||
          (i > currentStep + 1 && stepTitles)) &&
          i !== currentStep /* Not selected */ && (
            <View>
              <View style={[styles.notComplete, styles.node]}>
                <CustomText color={Colors.darkGray} text={i.toString()} />
              </View>
              {i !== steps && (
                <View style={[styles.grayLine, styles.width100]} />
              )}
            </View>
          )}
        {i > currentStep + 1 &&
          stepTitles &&
          i !== currentStep /* Not selected subtitle*/ && (
            <View>
              {stepTitles && (
                <View>
                  <CustomText
                    color={Colors.black}
                    text={
                      stepTitles.length != 0 &&
                      stepTitles[i - 1] !== undefined &&
                      stepTitles[i - 1].name !== undefined
                        ? stepTitles[i - 1].name
                        : ''
                    }
                    size={10}
                    font="medium"
                  />
                </View>
              )}
            </View>
          )}
        {(i < currentStep || (stepTitles && i === currentStep)) && (
          <View>
            <View style={[styles.completed, styles.node]}>
              <BoschIcons
                name={Icons.checkmark}
                size={20}
                color={Colors.white}
                style={{height: 20}}
              />
            </View>
            {i !== steps && <View style={[styles.blueLine, styles.width100]} />}
          </View>
        )}
        {(i < currentStep || (stepTitles && i === currentStep)) && (
          /* Checkmark subtitle */ <View>
            {stepTitles && (
              <CustomText
                color={Colors.black}
                text={
                  stepTitles.length != 0 &&
                  stepTitles[i - 1] !== undefined &&
                  stepTitles[i - 1].name !== undefined
                    ? stepTitles[i - 1].name
                    : ''
                }
                size={10}
                font="medium"
              />
            )}
          </View>
        )}
        {((i === (bcc ? currentStep : currentStep + 1) &&
          phoneNoVerified === false) ||
          (i === currentStep + 1 &&
            stepTitles &&
            phoneNoVerified === false)) && (
          <View>
            <View style={[styles.current, styles.node]}>
              <CustomText color={Colors.white} text={i.toString()} />
            </View>
            {i !== steps && !stepTitles && (
              <View style={[styles.blueLine, styles.width70]} />
            )}
            {i !== steps && <View style={[styles.grayLine, styles.width100]} />}
          </View>
        )}
        {((i === (bcc ? currentStep : currentStep + 1) &&
          phoneNoVerified === false) ||
          (i === currentStep + 1 &&
            stepTitles &&
            phoneNoVerified === false)) && (
          /* Completed subtitle */ <View>
            {stepTitles && (
              <CustomText
                color={Colors.black}
                text={
                  stepTitles.length != 0 &&
                  stepTitles[i - 1] !== undefined &&
                  stepTitles[i - 1].name !== undefined
                    ? stepTitles[i - 1].name
                    : ''
                }
                size={10}
                font="medium"
              />
            )}
          </View>
        )}
        {i === currentStep + 1 && phoneNoVerified === true && (
          <View>
            <View style={[styles.completed, styles.node]}>
              <BoschIcons
                name={Icons.checkmark}
                size={20}
                color={Colors.white}
                style={{height: 20}}
              />
            </View>
            {i !== steps && <View style={[styles.blueLine, styles.width100]} />}
          </View>
        )}
        {i === currentStep + 1 && phoneNoVerified === true && (
          /* Checkmark subtitle */ <View>
            {stepTitles && (
              <CustomText
                color={Colors.black}
                text={
                  stepTitles.length != 0 &&
                  stepTitles[i - 1] !== undefined &&
                  stepTitles[i - 1].name !== undefined
                    ? stepTitles[i - 1].name
                    : ''
                }
                size={10}
                font="medium"
              />
            )}
          </View>
        )}
      </View>
    );
    output[i] = progressItems;
  }

  return <View style={[styles.container, style]}>{output}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 20,
  },
  nodeContainer: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
  },
  node: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    zIndex: 20,
  },
  completed: {
    backgroundColor: Colors.darkBlue,
    borderColor: Colors.darkBlue,
  },
  notComplete: {
    backgroundColor: Colors.white,
    borderColor: Colors.darkGray,
  },
  current: {
    backgroundColor: Colors.darkBlue,
    borderColor: Colors.darkBlue,
  },
  grayLine: {
    height: 1,
    backgroundColor: Colors.darkGray,
    position: 'absolute',
    top: 18,
    zIndex: 10,
  },
  blueLine: {
    height: 2,
    backgroundColor: Colors.darkBlue,
    position: 'absolute',
    top: 18,
    zIndex: 15,
  },
  width100: {
    width: '100%',
  },
  width70: {
    width: '70%',
  },
  flex1: {
    flex: 1,
  },
});
