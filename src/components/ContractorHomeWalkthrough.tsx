import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Image,
  Text,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {Line, Svg} from 'react-native-svg';
import {Colors, Typography} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {Icons} from '../utils/icons';
import BoschIcon from './BoschIcon';
import Button from './Button';

import {CustomText} from '../components';

const IconInCircle = ({name, accessibilityLabel}) => (
  <View style={styles.circle}>
    <BoschIcon
      name={name}
      size={35}
      accessibilityLabel={accessibilityLabel}
      style={{height: 35}}
    />
  </View>
);

const IconInCircle1 = ({name, accessibilityLabel}) => (
  <View style={styles.circle1}>
    <BoschIcon
      name={name}
      size={35}
      accessibilityLabel={accessibilityLabel}
      style={{height: 35, color: Colors.black}}
    />
  </View>
);

const WalkthroughText = ({text}) => (
  <Text allowFontScaling={false} style={styles.text}>
    {text}
  </Text>
);
const WalkthroughText1 = ({text}) => (
  <Text allowFontScaling={false} style={[styles.text, {color: Colors.white}]}>
    {text}
  </Text>
);
const ArrowView = ({height, left, width, text}) => (
  <View style={[styles.paddingVertical, {right: 20}]}>
    <View style={[styles.flexRow, styles.absolute, {left: left, width: width}]}>
      <BoschIcon name={Icons.up1} size={25} style={styles.iconUp} />
      <Svg height={height} width="30">
        <Line
          x1="20"
          y1="0"
          x2="20"
          y2={height}
          stroke={Colors.blueOnPress}
          strokeWidth="1"
        />
      </Svg>
      <WalkthroughText text={text} />
    </View>
  </View>
);

const ArrowView1 = ({height, left, width, text}) => (
  <View style={[styles.paddingVertical, {right: 20}]}>
    <View style={[styles.flexRow, styles.absolute, {left: left, width: width}]}>
      <BoschIcon
        name={Icons.up}
        size={25}
        style={{color: Colors.white, left: 32, bottom: 10, height: 25}}
      />
      <Svg height={height} width="30">
        <Line
          x1="20"
          y1="0"
          x2="20"
          y2={height}
          stroke={Colors.white}
          strokeWidth="1"
        />
      </Svg>
      <WalkthroughText1 text={text} />
    </View>
  </View>
);

const ArrowView2 = ({height, left, width, text}) => (
  <View style={[styles.paddingVertical, {right: 20}]}>
    <View style={[styles.flexRow, styles.absolute, {left: left, width: width}]}>
      <WalkthroughText1 text={text} />
      <BoschIcon
        name={Icons.up}
        size={25}
        style={{color: Colors.white, left: 32, bottom: 10, height: 25}}
      />
      <Svg height={height} width="30">
        <Line
          x1="20"
          y1="0"
          x2="20"
          y2={height}
          stroke={Colors.white}
          strokeWidth="1"
        />
      </Svg>
    </View>
  </View>
);

const ArrowView3 = ({height, left, width, text}) => (
  <View style={[styles.paddingVertical]}>
    <View style={[styles.flexRow, styles.absolute, {left: left, width: width}]}>
      <Svg height={height} width="30">
        <Line
          x1="20"
          y1="0"
          x2="20"
          y2={height}
          stroke={Colors.white}
          strokeWidth="1"
        />
      </Svg>

      <WalkthroughText1 text={text} />
    </View>
    <BoschIcon
      name={Icons.down}
      size={25}
      style={{color: Colors.white, left: 37, top: 65, height: 25}}
    />
  </View>
);

export default function ContractorHomeWalkthrough() {
  const [visible, setVisible] = useState(true);
  const [isScreen1, setIsScreen1] = useState(true);
  const [isScreen2, setIsScreen2] = useState(false);
  const [isScreen3, setIsScreen3] = useState(false);
  const [isScreen4, setIsScreen4] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem('showHomeWalkthrough').then(value => {
      if (value !== 'false') {
        setVisible(true);
        setTrue();
      } else {
        setVisible(false);
      }
    });
  }, []);

  const onScreen1Press = () => {
    setIsScreen1(false);
    setIsScreen2(true);
  };

  const onScreen2Press = () => {
    setIsScreen2(false);
    setIsScreen3(true);
  };

  const onScreen3Press = () => {
    setIsScreen3(false);
    setIsScreen4(true);
  };

  const onScreen4Press = () => {
    setIsScreen3(false);
    setIsScreen4(false);
    setVisible(false);
    AsyncStorage.setItem('showHomeWalkthrough', 'false');
  };

  const [secondModalTrue, setSecondModalTrue] = useState(false);
  const [thirdModalTrue, setThirdModalTrue] = useState(false);

  const setTrue = () => {
    setSecondModalTrue(true);
    setTimeout(() => {
      setThirdModalTrue(true);
    }, 100);
  };

  return (
    <Modal transparent visible={visible}>
      <SafeAreaView style={[styles.container]}>
        <View style={[styles.header, {flex: 0.1}]}>
          <IconInCircle
            name={Icons.listViewMobile}
            accessibilityLabel={'Menu'}
          />
          <Text style={styles.headerText}>Home</Text>
        </View>
        <View style={{flex: 0.05}}>
          <Image
            style={styles.image}
            source={require('../assets/images/header_ribbon.png')}
          />
        </View>
        <View style={{flex: 0.05}}>
          <CustomText
            noOfLines={1}
            style={[styles.welcomeText]}
            text={Dictionary.createProfile.welcomeUser}
          />
        </View>

        <View
          style={[
            styles.flexRow,
            {borderBottomWidth: 0.5, flex: 0.05, paddingVertical: 15},
          ]}>
          <View style={{flex: 0.15, flexDirection: 'column'}}>
            <IconInCircle name={Icons.map} accessibilityLabel={'Map view'} />
          </View>
          <View style={{flex: 0.15}}>
            <IconInCircle
              name={Icons.listView}
              accessibilityLabel={'List view'}
            />
          </View>
          <View style={{flex: 0.15}}>
            <IconInCircle name={Icons.filter} accessibilityLabel={'Filter'} />
          </View>
          <View style={{flex: 0.1}} />
          <View style={{flex: 0.45}}>
            <Button
              type="tertiary"
              text={Dictionary.button.addNewUnit}
              icon={Icons.addFrame}
              textStyle={{fontSize: 18}}
            />
          </View>
        </View>
        <View style={{flex: 0.6}}>
          <ImageBackground
            style={{
              padding: 20,
              flex: 1,
              justifyContent: 'center',
              marginBottom: 30,
            }}
            source={require('../assets/images/nounit_mapview.png')}
          />
        </View>
        <View style={{flex: 0.15, backgroundColor: '#ffff',justifyContent:'center',alignItems:'center'}}>
            <Button style={{width:'90%'}} type="primary" text="Register My Product" />
        </View>
      </SafeAreaView>

      <Modal transparent visible={secondModalTrue}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(11, 11, 12, 0.8)', // Change the opacity and color as needed
            backdropFilter: 'blur(18px)',
          }}
        />
        <Modal transparent visible={thirdModalTrue}>
          <SafeAreaView style={{flex: 1}}>
            <View style={[styles.header, {flex: 0.1}]}>
              {isScreen1 && (
                <IconInCircle1
                  name={Icons.listViewMobile}
                  accessibilityLabel={'Menu'}
                />
              )}
            </View>
            {isScreen1 && (
              <View
                style={{
                  flex: 0.1,
                  justifyContent: 'center',
                  alignContent: 'center',
                  left: 20,
                }}>
                <ArrowView1
                  left={0}
                  height={60}
                  width={Dimensions.get('window').width - 50}
                  text={Dictionary.walkthrough.menu}
                />
              </View>
            )}
            {isScreen1 && (
              <View style={{top: 20, left: 20}}>
                <Button
                  type="tertiary"
                  style={{
                    backgroundColor: '#fff',
                    height: 70,
                    width: 70,
                    color: '#000',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                  }}
                  text="Next"
                  onPress={onScreen1Press}
                />
              </View>
            )}

            <View style={{flex: 0.05}}></View>
            <View style={{flex: 0.05}}></View>

            {(isScreen2 || isScreen3) && (
              <View
                style={[
                  styles.flexRow,
                  {borderBottomWidth: 0.5, flex: 0.05, paddingVertical: 15},
                ]}>
                <View style={{flex: 0.15, flexDirection: 'column'}}>
                  {isScreen2 && (
                    <IconInCircle1
                      name={Icons.map}
                      accessibilityLabel={'Map view'}
                    />
                  )}
                </View>
                <View style={{flex: 0.15}}>
                  {isScreen2 && (
                    <IconInCircle1
                      name={Icons.listView}
                      accessibilityLabel={'List view'}
                    />
                  )}
                </View>
                <View style={{flex: 0.15}}>
                  {isScreen2 && (
                    <IconInCircle1
                      name={Icons.filter}
                      accessibilityLabel={'Filter'}
                    />
                  )}
                </View>

                <View style={{flex: 0.1}} />
                {isScreen3 && (
                  <View
                    style={{
                      flex: 0.45,
                      backgroundColor: '#ffff',
                      marginHorizontal: 10,
                      justifyContent:'center',
                      alignItems:'center'
                    }}>
                    <Button
                      type="tertiary"
                      text={Dictionary.button.addNewUnit}
                      style={{backgroudColor: '#ffff'}}
                      icon={Icons.addFrame}
                      textStyle={{fontSize: 18}}
                    />
                  </View>
                )}
              </View>
            )}
            {isScreen4 && <View style={{flex: 0.05}}></View>}
            <View style={{flex: 0.6, flexDirection: 'row'}}>
              {isScreen3 && (
                <ArrowView2
                  left={50}
                  height={100}
                  width={Dimensions.get('window').width - 100}
                  text={Dictionary.walkthrough.addunit}
                />
              )}

              {isScreen2 && (
                <>
                  <ArrowView1
                    left={0}
                    height={250}
                    width={Dimensions.get('window').width - 100}
                    text={Dictionary.walkthrough.map}
                  />
                  <ArrowView1
                    left={60}
                    height={150}
                    width={Dimensions.get('window').width - 150}
                    text={Dictionary.walkthrough.list}
                  />
                  <ArrowView1
                    left={120}
                    height={50}
                    width={Dimensions.get('window').width - 200}
                    text={Dictionary.walkthrough.filter}
                  />
                </>
              )}
              {isScreen4 && (
                <View style={{flexDirection: 'column-reverse', top: 70}}>
                  <ArrowView3
                    left={30}
                    height={100}
                    width={Dimensions.get('window').width - 200}
                    text={Dictionary.walkthrough.register}
                  />
                  <View style={{flex: 0.1, left: 290, bottom: 90}}>
                    <Button
                      type="tertiary"
                      style={{
                        backgroundColor: '#ffff',
                        height: 70,
                        width: 70,
                        color: '#000',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignContent: 'center',
                      }}
                      text="Done"
                      onPress={onScreen4Press}
                    />
                  </View>
                </View>
              )}
            </View>

            {isScreen2 && (
              <View style={{flex: 0.1, left: 10, bottom: 50}}>
                <Button
                  type="tertiary"
                  style={{
                    backgroundColor: '#ffff',
                    height: 70,
                    width: 70,
                    color: '#000',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                  }}
                  text="Next"
                  onPress={onScreen2Press}
                />
              </View>
            )}
            {isScreen3 && (
              <View style={{flex: 0.1, bottom: 260, left: 30}}>
                <Button
                  type="tertiary"
                  style={{
                    backgroundColor: '#ffff',
                    height: 70,
                    width: 70,
                    color: '#000',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                  }}
                  text="Next"
                  onPress={onScreen3Press}
                />
              </View>
            )}

            {isScreen4 && (
              <View style={{flex: 0.15, backgroundColor: '#ffff',justifyContent:'center',alignItems:'center'}}>
                  <Button style={{width:'90%'}} type="primary" text="Register My Product" />
              </View>
            )}
          </SafeAreaView>
        </Modal>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  textPadding: {
    paddingVertical: 10,
    paddingLeft: 10,
  },
  flexRow: {
    flexDirection: 'row',
  },
  image: {
    height: 8,
    width: '100%',
    opacity: 0.2,
  },
  header: {
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    padding: 20,
    opacity: 0.2,
    fontFamily: Typography.FONT_FAMILY_MEDIUM,
    fontSize: 18,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
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
    // borderWidth: 1,
    marginRight: 10,
  },
  circle1: {
    width: 50,
    height: 50,
    borderRadius: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.white,
    borderWidth: 1,
    marginRight: 10,
  },
  padding20: {
    padding: 20,
  },
  welcomeText: {
    ...Typography.boschMedium21,
  },

  paddingVertical: {
    paddingVertical: 20,
  },
  absolute: {
    position: 'absolute',
  },
  button: {
    backgroundColor: Colors.white,
    padding: 20,
  },
  iconUp: {left: 32, bottom: 10, color: Colors.blueOnPress, height: 25},
});
