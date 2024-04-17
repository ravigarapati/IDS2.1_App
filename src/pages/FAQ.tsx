import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Linking,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Colors, Typography} from '../styles';
import {Transition, Transitioning} from 'react-native-reanimated';
import FAQButton from '../components/FAQButton';
import {Dictionary} from '../utils/dictionary';
import {useSelector} from 'react-redux';
import {BoschIcon, Link, CustomText} from '../components';
import {Icons} from '../utils/icons';
import {Enum} from '../utils/enum';

export default function FAQ(props) {
  const [currentDevice, setCurrentDevice] = useState(
    Dictionary.addDevice.IDSPremiumConnected,
  );
  const listVal = useSelector(state => state.contractor.faqList.data);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [slides, setSlide] = useState(
    listVal && listVal[0] && listVal[0].answerList,
  );
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(slides[currentPosition]);
  const [iconValue, setIconValue] = useState(null);
  const [firstValue, setFirstValue] = useState(undefined);
  const [firstIndex, setFirstIndex] = useState(-1);
  const [lastValue, setLastValue] = useState(undefined);
  const userRole = useSelector(state =>
    state.auth.user.attributes['custom:role'] === Enum.roles.homeowner
      ? 'homeowner'
      : 'admin/contractor',
  );

  useEffect(() => {
    props.navigation.addListener('didFocus', () => {
      setCurrentIndex(null);
      setSlide(listVal && listVal[0] && listVal[0].answerList);
      //ref.current.scrollTo({offset: 0, animated: true});
    });
  }, [props.navigation]);

  useEffect(() => {
    setCurrentPosition(0);
    setCurrentSlide(slides[currentPosition]);
  }, [slides]);

  useEffect(() => {
    setCurrentSlide(slides[currentPosition]);
  }, [currentPosition]);

  useEffect(() => {
    setFirstValue(undefined);
    setLastValue(undefined);
    setIconValue(null);
    const duplicate =
      currentSlide && currentSlide.answer ? currentSlide.answer : '';
    const index = duplicate && duplicate.indexOf('<');
    setFirstIndex(index);

    if (index !== -1) {
      const lastIndex = duplicate.indexOf('>');
      const lastPosition = duplicate.lastIndexOf('');
      const iconName = duplicate.slice(index + 1, lastIndex);
      setFirstValue(duplicate.slice(0, index));
      setLastValue(duplicate.slice(lastIndex + 1, lastPosition));
      setIconValue(iconName);
    } else {
      setFirstValue(duplicate);
    }
  }, [currentSlide]);

  const transition = (
    <Transition.Together>
      <Transition.In type="fade" durationMs={200} />
      <Transition.Change />
      <Transition.Out type="fade" durationMs={200} />
    </Transition.Together>
  );
  const ActiveDot = ({val}) => {
    return (
      <View style={styles.dots}>
        {val &&
          val.length > 1 &&
          val.map((ele, index) => (
            <View
              style={[
                styles.normalDot,
                index === currentPosition
                  ? styles.activeDot
                  : styles.inactiveDot,
              ]}
              key={index}
            />
          ))}
      </View>
    );
  };
  const arrowLeftClick = () => {
    currentPosition !== 0
      ? setCurrentPosition(currentPosition - 1)
      : setCurrentPosition(slides.length - 1);
  };
  const arrowRightClick = () => {
    currentPosition !== slides.length - 1
      ? setCurrentPosition(currentPosition + 1)
      : setCurrentPosition(0);
  };
  const Carousel = ({quantity}) => {
    return (
      <View>
        <View style={styles.flexRow}>
          <View style={styles.sliderParent}>
            {currentPosition !== 0 && (
              <BoschIcon
                accessible={true}
                accessibilityLabel={Dictionary.button.leftButton}
                accessibilityHint={`${Dictionary.faq.previousImage} ${
                  currentPosition + 1
                } of ${quantity}`}
                size={20}
                name={Icons.backLeft}
                color={Colors.black}
                style={styles.sliderIcon}
                onPress={() => {
                  arrowLeftClick();
                }}
              />
            )}
          </View>
          <View style={styles.collapsible}>
            {currentSlide && currentSlide.image.length > 0 && (
              <Image
                accessible={true}
                accessibilityRole={'image'}
                accessibilityLabel={
                  currentSlide && currentSlide.answer.length > 0
                    ? firstValue + ' icon ' + lastValue
                    : firstValue
                }
                source={currentSlide.image ? {uri: currentSlide.image} : null}
                style={
                  currentSlide.image ? [styles.image, styles.border] : null
                }
              />
            )}
          </View>
          <View style={styles.sliderParent}>
            {currentPosition !== slides.length - 1 && (
              <BoschIcon
                accessible={true}
                accessibilityLabel={Dictionary.button.rightButton}
                accessibilityHint={`${Dictionary.faq.nextImage} ${
                  currentPosition + 1
                } of ${quantity}`}
                size={20}
                name={Icons.forwardRight}
                color={Colors.black}
                style={styles.sliderIcon}
                onPress={() => arrowRightClick()}
              />
            )}
          </View>
        </View>

        <View style={[styles.flexRow, styles.paddingHorizontal20]}>
          {currentSlide && currentSlide.answer.length > 0 ? (
            firstIndex !== -1 ? (
              <View>
                <Text style={styles.answerList}>
                  <Text>{firstValue}</Text>
                  <BoschIcon
                    name={iconValue}
                    color={Colors.black}
                    style={styles.iconStyle}
                  />
                  <Text>{lastValue}</Text>
                </Text>
              </View>
            ) : (
              <Text style={styles.answerList}>{firstValue}</Text>
            )
          ) : null}
        </View>
      </View>
    );
  };
  return (
    <View style={styles.flex1}>
      <ScrollView style={[styles.container]}>
        <View style={styles.body}>
          <Transitioning.View transition={transition}>
            <Text style={[styles.title]}>{Dictionary.help.innerTitle}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              {/*<<View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              FAQButton
                accessibilityHintText={`${Dictionary.faq.faqButton1} ${Dictionary.addDevice.bcc50} ${Dictionary.faq.faqButton2}`}
                accessibilityRoleText="button"
                text={Dictionary.addDevice.bcc50}
                isPressed={currentDevice === Dictionary.addDevice.bcc50}
                onPress={(value) => {
                  setCurrentDevice(value);
                }}
              />
              <FAQButton
                accessibilityHintText={`${Dictionary.faq.faqButton1} ${Dictionary.addDevice.bcc100} ${Dictionary.faq.faqButton2}`}
                accessibilityRoleText={'button'}
                text={Dictionary.addDevice.bcc100}
                isPressed={currentDevice === Dictionary.addDevice.bcc100}
                onPress={(value) => {
                  setCurrentDevice(value);
                }}
              />*/}
              <FAQButton
                accessibilityHintText={`${Dictionary.faq.faqButton1} ${Dictionary.addDevice.IDSPremiumConnected} ${Dictionary.faq.faqButton2}`}
                accessibilityRoleText={'button'}
                text={Dictionary.addDevice.IDSPremiumConnected}
                isPressed={
                  currentDevice === Dictionary.addDevice.IDSPremiumConnected
                }
                onPress={value => {
                  setCurrentDevice(value);
                }}
              />
            </View>

            {currentDevice === Dictionary.addDevice.IDSPremiumConnected &&
              listVal &&
              listVal.map(({question, answerList}, index) => {
                return (
                  <TouchableWithoutFeedback key={question} accessible={false}>
                    <View style={styles.border}>
                      <TouchableOpacity
                        style={styles.flexRow}
                        accessibilityLabel={question}
                        accessibilityRole={'button'}
                        accessibilityHint={`${Dictionary.faq.doubleTap} ${
                          index === currentIndex
                            ? Dictionary.faq.closeQuestion
                            : Dictionary.faq.expandQuestion
                        }.`}
                        onPress={() => {
                          // ref.current.animateNextTransition();
                          setSlide(answerList);
                          setCurrentIndex(
                            index === currentIndex ? null : index,
                          );
                        }}>
                        <View style={styles.titleWidth}>
                          <Text style={[styles.listTitle]}>{question}</Text>
                        </View>
                        <View style={styles.titleIcon}>
                          <BoschIcon
                            size={20}
                            name={
                              index === currentIndex ? Icons.up : Icons.down
                            }
                            color={Colors.black}
                            style={styles.sliderIcon}
                          />
                        </View>
                      </TouchableOpacity>
                      {index === currentIndex && (
                        <View
                          style={[styles.borderTop, styles.paddingVertical20]}>
                          <Carousel quantity={answerList.length} />
                          <ActiveDot val={answerList} />
                        </View>
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                );
              })}
          </Transitioning.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
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
  listTitle: {
    padding: 20,
    fontSize: 16,
    fontFamily: Typography.FONT_FAMILY_MEDIUM,
  },
  border: {
    borderWidth: 1,
    borderColor: Colors.borderGray,
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: Colors.borderGray,
  },
  collapsible: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.7,
  },
  answerList: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: Typography.FONT_FAMILY_MEDIUM,
  },
  flexRow: {
    flexDirection: 'row',
    flex: 1,
    flexGrow: 1,
  },
  marginVertical20: {
    marginVertical: 20,
  },
  paddingVertical20: {
    paddingVertical: 20,
  },
  paddingHorizontal20: {
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 350,
    resizeMode: 'center',
  },
  sliderParent: {
    justifyContent: 'center',
    flex: 0.15,
    alignItems: 'center',
  },
  titleWidth: {
    width: '88%',
  },
  titleIcon: {
    width: '12%',
    justifyContent: 'center',
  },
  sliderIcon: {
    color: Colors.darkBlue,
    textAlignVertical: 'center',
    textAlign: 'left',
    fontSize: 30,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  normalDot: {
    borderRadius: 50,
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.dotBlue,
    marginRight: 15,
  },
  inactiveDot: {
    backgroundColor: Colors.white,
  },
  activeDot: {
    backgroundColor: Colors.dotBlue,
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
  marginBot10: {
    marginBottom: 10,
  },
  contact: {
    textAlign: 'center',
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  iconStyle: {
    fontSize: 26,
    color: Colors.darkBlue,
    backgroundColor: Colors.lightGray,
  },
  headerContainer: {
    backgroundColor: '#ffff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerDivision: {
    flexDirection: 'column',
    flex: 0.15,
    backgroundColor: '#ffff',
    justifyContent: 'center',
  },
  headerBackButton: {
    justifyContent: 'center',
    flex: 1,
  },
  headerTitle: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 24,
  },
  connectedFan: {
    borderRadius: 50,
    height: 6,
    width: 6,
    backgroundColor: 'black',
    marginLeft: 15,
    marginRight: 15,
  },
  headerRibbon: {height: 8, width: '100%'},
  marginHorizontal10: {marginHorizontal: 10},
});
