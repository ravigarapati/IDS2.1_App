/**
 * @file Legal is a page in the hamburger menu for HomeOwner.
 * Legal, Terms and conditions and Privacy details are displayed here.
 * @author Krishna Priya Elango
 *
 * Modified by @author Deepthi Murali
 */
import React from 'react';
import {Linking, ScrollView, StyleSheet, View} from 'react-native';
import {CustomText, SectionHeading, Link} from '../components';
import {Colors} from '../styles';
import {Dictionary} from '../utils/dictionary';
import UserAnalytics from '../components/UserAnalytics';

export default function Legal() {
  UserAnalytics('ids_legal');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SectionHeading title={Dictionary.legal.termsAndConditionTitle} />
      <View style={styles.padding}>
        <Link
          text={Dictionary.legal.termsAndConditionLink}
          onPress={() =>
            Linking.openURL(
              'https://issuu.com/boschthermotechnology/docs/ids_2.1_terms_of_conditions?fr=sZWY1YTM0ODk1MzU',
            )
          }
        />
      </View>

      <SectionHeading title={Dictionary.legal.privacyPolicyTitle} />
      <View style={styles.padding}>
        <Link
          text={Dictionary.legal.privacyPolicyLink}
          onPress={() =>
            Linking.openURL(
              'https://issuu.com/boschthermotechnology/docs/ids_2.1_privacy_policy?fr=sNzI2MjM0ODk1MzU',
            )
          }
        />
      </View>

      <SectionHeading title={Dictionary.legal.ossTitle} />
      <View style={styles.padding}>
        <CustomText text={Dictionary.legal.ossDetails} align="left" />
        <Link
          text={Dictionary.legal.ossAttributes}
          onPress={() =>
            Linking.openURL(
              'https://issuu.com/boschthermotechnology/docs/ids_2.1_oss_attribution?fr=sN2U2YTM0ODk1MzU',
            )
          }
        />
      </View>
      <CustomText
        style={styles.copyrightsFooter}
        text={Dictionary.legal.legalCopyrights}
        align="center"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingTop: 20,
    flexGrow: 1,
  },
  padding: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  copyrightsFooter: {
    left: 0,
    right: 0,
    bottom: 0,
  },
});
