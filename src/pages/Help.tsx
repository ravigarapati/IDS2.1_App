import React, {useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Linking,
  Pressable,
  PixelRatio,
  Image,
} from 'react-native';
import {Colors, Typography} from '../styles';
import {BoschIcon, Link, CustomText} from '../components';
import {Dictionary} from '../utils/dictionary';
import {Icons} from '../utils/icons';
import {useSelector} from 'react-redux';
import {Enum} from '../utils/enum';
import UserAnalytics from '../components/UserAnalytics';
import {connect} from 'react-redux';
import {getFaqList} from '../store/actions/ContractorActions';

function Help(props) {
  const userRole = useSelector(state =>
    state.auth.user.attributes['custom:role'] === Enum.roles.homeowner
      ? 'homeowner'
      : 'admin/contractor',
  );
  const listVal = useSelector(state => state.contractor.faqList.data);
  const ref = React.useRef();

  UserAnalytics('ids_help');

  useEffect(() => {
    if (listVal === undefined) {
      let ratio = PixelRatio.get();
      const input = {
        role: 'homeowner',
        imageSize:
          ratio >= 1 && ratio < 2
            ? 'image1x'
            : ratio >= 2 && ratio < 3
            ? 'image2x'
            : 'image3x',
      };
      props.getFaqList(input);
    }
  }, []);

  return (
    <View style={{flex: 1}}>
      <ScrollView style={[styles.container]} ref={ref}>
        <View style={styles.body}>
          <Pressable
            style={{
              borderBottomWidth: 1,
              paddingVertical: 15,
              marginBottom: 29,
              marginTop: 50,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            accessible={true}
            accessibilityRole={'button'}
            accessibilityHint={
              'Press it to navigate to FAQ screen and find information about the application.'
            }
            onPress={() => props.navigation.navigate('Faq')}>
            <CustomText text={'Frequently Asked Questions'} align="left" />
            <Image source={require('./../assets/images/nextarrow.png')} />
          </Pressable>

          <View style={[styles.marginTop10]}>
            <View
              accessible={true}
              onAccessibilityTap={() => {
                Linking.openURL(Dictionary.help.websiteLink);
              }}
              accessibilityLabel={`${Dictionary.help.visit1} website ${
                Dictionary.help.visit2
              }: ${Dictionary.help.info1}. ${Dictionary.help.info2}. ${
                userRole === 'homeowner'
                  ? Dictionary.help.info3
                  : Dictionary.help.info4
              }.`}
              accessibilityHint={Dictionary.faq.openWebsite}>
              <Text style={styles.bottomText}>
                {Dictionary.help.visit1}
                <Link text={' website '} url={Dictionary.help.websiteLink} />
                {Dictionary.help.visit2}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={styles.connectedFan}></View>
                <Text
                  accessibilityLabel={Dictionary.help.info1 + '.'}
                  style={styles.bottomText}>
                  {Dictionary.help.info1}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={styles.connectedFan}></View>
                <Text
                  accessibilityLabel={Dictionary.help.info2 + '.'}
                  style={styles.bottomText}>
                  {Dictionary.help.info2}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={styles.connectedFan}></View>
                <Text
                  accessibilityLabel={
                    userRole === 'homeowner'
                      ? Dictionary.help.info3
                      : Dictionary.help.info4 + '.'
                  }
                  style={styles.bottomText}>
                  {userRole === 'homeowner'
                    ? Dictionary.help.info3
                    : Dictionary.help.info3}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={styles.connectedFan}></View>
                <Text
                  accessibilityLabel={'View Product Registration info.'}
                  style={styles.bottomText}>
                  View Product Registration Info
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={styles.connectedFan}></View>
                <Text
                  accessibilityLabel={'Rebate & Tax Credit Info'}
                  style={styles.bottomText}>
                  Rebate & Tax Credit Info
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={styles.connectedFan}></View>
                <Text
                  accessibilityLabel={'Find spare parts'}
                  style={styles.bottomText}>
                  Find spare parts
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={styles.connectedFan}></View>
                <Text
                  accessibilityLabel={'View Product Warranty'}
                  style={styles.bottomText}>
                  View Product Warranty
                </Text>
              </View>
            </View>

            <View style={[styles.borderTop]} accessible={true}>
              <Text
                style={[styles.contact, styles.marginTop10, styles.marginBot10]}
                accessibilityLabel={Dictionary.help.customerSupport + ':'}>
                {Dictionary.help.customerSupportFaq}
              </Text>
              <Text
                style={[
                  styles.contact,
                  styles.marginBot10,
                  styles.colorBlueOnPress,
                ]}
                accessibilityLabel={Dictionary.help.phone + '.'}
                onPress={() => Linking.openURL('tel:' + Dictionary.help.phone)}>
                {Dictionary.help.phone}
              </Text>
              <Text
                accessibilityLabel="Or."
                style={[styles.contact, styles.marginBot10]}>
                {'Or'}
              </Text>
              <Text
                style={[
                  styles.contact,
                  styles.marginBot10,
                  styles.colorBlueOnPress,
                ]}
                accessibilityLabel={Dictionary.help.email + '.'}
                onPress={() =>
                  Linking.openURL('mailto:' + Dictionary.help.email)
                }>
                {Dictionary.help.email}
              </Text>
              <Text style={styles.contact}>
                {Dictionary.help.customerService1}
              </Text>
              <Text style={styles.contact}>
                {Dictionary.help.customerService2}
              </Text>
              <Text style={[styles.contact, styles.marginBot10]}>
                {Dictionary.help.customerService3}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flexGrow: 1,
  },
  body: {
    marginHorizontal: 20,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 33,
    marginBottom: 17,
  },
  border: {
    borderWidth: 1,
    borderColor: Colors.borderGray,
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: Colors.borderGray,
  },
  bottomText: {
    paddingBottom: 3,
    fontSize: 15,
    flexDirection: 'row',
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  marginTop10: {
    marginTop: 10,
  },
  paddingHorizontal5: {paddingHorizontal: 5},
  marginBot10: {
    marginBottom: 10,
  },
  contact: {
    textAlign: 'center',
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  connectedFan: {
    borderRadius: 50,
    height: 6,
    width: 6,
    backgroundColor: 'black',
    marginLeft: 15,
    marginRight: 15,
  },
  colorBlueOnPress: {
    color: Colors.blueOnPress,
  },
});

const mapDispatchToProps = {
  getFaqList,
};

export default connect(null, mapDispatchToProps)(Help);
