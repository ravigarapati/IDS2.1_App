/**
 * @file Add Product Information. Lets Contractor add product information for registrations.
 * @author Joel Macias
 *
 */

import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableOpacity,
  Text,
  PixelRatio,
  TouchableWithoutFeedback,
} from 'react-native';
import {Colors, Typography} from '../../styles';
import {
  CustomText,
  Button,
  CustomInputText,
  CodeScanner,
  BoschIcon,
  SectionHeading,
  ToggleButton,
  CustomPicker,
  InfoTooltip,
} from '../../components';
import {Dictionary} from '../../utils/dictionary';
import {Enum} from '../../utils/enum';
import {NavigationActions, StackActions} from 'react-navigation';
import {showToast} from '../../components/CustomToast';
import {useDispatch, useSelector} from 'react-redux';
import * as ContractorActions from '../../store/actions/ContractorActions';
import {validateInputField} from '../../utils/Validator';
import {Icons} from '../../utils/icons';
import moment from 'moment';
import UserAnalytics from '../../components/UserAnalytics';
import {scanButton} from '../../utils/ScanPermissions';
import DateTimePicker from '@react-native-community/datetimepicker';
import {padding} from '../../styles/mixins';
import {printDeleteLine} from 'jest-diff/build/printDiffs';
import {tooltip} from 'aws-amplify';

export default function SerialNumberLocator(props) {
  const dispatch = useDispatch();
  const [product, setProduct] = useState('');
  const [productType, setProductType] = useState('');
  const productsList = useSelector(
    state => state.contractor.snlProductInfo.productsList,
  );
  const productsTypeList = useSelector(
    state => state.contractor.snlProductInfo.productsTypeList,
  );
  const productImages = useSelector(
    state => state.contractor.snlProductInfo.productImages,
  );

  const [images, setImages] = useState(
    [{image: 'test'}],
    //productImages && productImages[0] && productImages[0].images,
  );
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentImage, setCurrentImage] = useState();

  useEffect(() => {
    setCurrentPosition(0);
    //setCurrentImage(images[currentPosition]);
  }, [images]);

  useEffect(() => {
    setCurrentImage(images[currentPosition]);
  }, [currentPosition]);

  const arrowRightClick = () => {
    /*currentPosition !== images.length - 1
      ? setCurrentPosition(currentPosition + 1)
      : setCurrentPosition(0);*/
  };

  const arrowLeftClick = () => {
    /*currentPosition !== 0
      ? setCurrentPosition(currentPosition - 1)
      : setCurrentPosition(images.length - 1);
      */
  };

  UserAnalytics('ids_add_pr_productInfo');

  function getProductInfo(value) {
    let data = {
      serialNumber: value,
    };
    dispatch(ContractorActions.verifyPRSerialNumber(data)).then(() => {});
  }

  function setCurrentStepValue(stepNumber) {
    dispatch(ContractorActions.setCurrentStep(stepNumber));
  }

  function getProductsList() {
    let ratio = PixelRatio.get();
    let data = {
      imageSize:
        ratio >= 1 && ratio < 2
          ? 'image1x'
          : ratio >= 2 && ratio < 3
          ? 'image2x'
          : 'image3x',
    };
    dispatch(ContractorActions.serialNumberLocatorGetProducts(data));
  }

  function getProductTypesList(index) {
    /*let data = {
      productName: value,
    };*/
    dispatch(ContractorActions.serialNumberLocatorGetProductTypes(index));
    setImages([]);
  }

  function getProductImages(index) {
    dispatch(ContractorActions.serialNumberLocatorGetProductImages(index));
  }

  function changeProduct(value, index) {
    //setFormValue(field, value);
    setProduct(value);
    setProductType('');
    getProductTypesList(index);
  }

  function changeProductType(value, index) {
    //setFormValue(field, value);
    setProductType(value);
    setCurrentPosition(0);
    getProductImages(index);
  }

  useEffect(() => {
    getProductsList();
  }, []);

  useEffect(() => {
    if (productImages && productImages[0]) {
      setImages(productImages);
    }
  }, [productImages]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <View style={{paddingHorizontal: 15}}>
            <CustomText
              newline={false}
              text={Dictionary.productRegistration.serialNumberLocatorVerbiage}
              size={15}
              align={'left'}
              font={'medium'}
              style={{paddingVertical: 10}}
            />
            <CustomPicker
              placeholder={
                Dictionary.productRegistration.serialNumberLocatorProduct
              }
              value={product}
              onChange={(name: any) => changeProduct(name.value, name.index)}
              options={productsList}
              iteratorKey="index"
              iteratorLabel="label"
              isRequiredField={true}
              showFieldLabel={true}
            />
            <CustomPicker
              placeholder={
                Dictionary.productRegistration.serialNumberLocatorProductType
              }
              value={productType}
              onChange={(type: any) =>
                changeProductType(type.value, type.index)
              }
              options={productsTypeList}
              iteratorKey="index"
              iteratorLabel="label"
              isRequiredField={true}
              showFieldLabel={true}
              disabled={!productsTypeList}
            />

            {productImages && images[0] && (
              <View style={styles.collapsible}>
                <View style={[styles.flexRow]}>
                  {currentPosition > 0 && (
                    <TouchableOpacity
                      onPress={() => setCurrentPosition(currentPosition - 1)}
                      style={{
                        flexBasis: '10%',
                        paddingVertical: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <BoschIcon
                        size={24}
                        name={Icons.backLeft}
                        //style={styles.paddingTop5}
                      />
                    </TouchableOpacity>
                  )}
                  <View style={{flexBasis: '5%'}}></View>
                  <Image
                    source={
                      images.length === 1
                        ? {uri: images[0].image}
                        : {uri: images[currentPosition].image}
                    }
                    resizeMode="contain"
                    //source={{uri: 'https://ids-help-dev.s3.amazonaws.com/productregistration/3x/Air_Handler_3x.png'}}
                    style={[
                      styles.image,
                      styles.border,
                      {
                        flexBasis: '80%',
                        height: (Dimensions.get('screen').height * 3) / 7,
                        width: (Dimensions.get('screen').width * 2) / 3,
                      },
                    ]}
                  />
                  <View style={{flexBasis: '5%'}}></View>
                  {images.length > currentPosition + 1 && (
                    <TouchableOpacity
                      onPress={() => setCurrentPosition(currentPosition + 1)}
                      style={{
                        flexBasis: '10%',
                        paddingVertical: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <BoschIcon
                        size={24}
                        name={Icons.forwardRight}
                        //style={styles.paddingTop5}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {images.length >= 2 && (
                  <View
                    style={[
                      styles.flexRow,
                      {paddingTop: 0},
                      {paddingHorizontal: 10},
                    ]}>
                    {images.map((prop, key) => {
                      return (
                        <View key={key} style={[{paddingHorizontal: 2}]}>
                          <View
                            key={key}
                            style={
                              key === currentPosition
                                ? [styles.completed, styles.node]
                                : [styles.notComplete, styles.node]
                            }></View>
                        </View>
                      );
                    })}
                  </View>
                )}

                <View
                  style={[
                    styles.flexRow,
                    {paddingVertical: 10},
                    {paddingHorizontal: 10},
                  ]}>
                  <BoschIcon
                    size={24}
                    name={Icons.infoTooltip}
                    //style={styles.paddingTop5}
                  />

                  <CustomText
                    text={
                      Dictionary.productRegistration.serialNumberLocatorTooltip
                    }
                    align="left"
                    size={12}
                    style={styles.paddingLeft10}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    // marginHorizontal: 20,
    flexGrow: 1,
  },
  graycontainer: {
    backgroundColor: Colors.lightGray,
    // marginHorizontal: 20,
    padding: 10,
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  barcodeTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleText: {
    alignSelf: 'center',
    flex: 1,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  padVertical10: {
    paddingTop: 10,
  },
  padVertical15: {
    paddingVertical: 15,
  },
  padTop30: {
    paddingTop: 30,
  },
  padding20: {
    padding: 20,
  },
  image: {
    margin: 0,
    //alignSelf: 'center',
    //width: 210,
    //height: 260 ,
    resizeMode: 'center',
    flexBasis: '80%',
  },
  collapsible: {
    paddingTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  border: {
    borderWidth: 0,
    borderColor: Colors.borderGray,
  },
  flexRow: {
    flexDirection: 'row',
  },
  sliderParent: {
    justifyContent: 'center',
    flex: 0.15,
    alignItems: 'center',
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
  paddingHorizontal20: {
    paddingHorizontal: 20,
  },
  padding10: {
    padding: 10,
  },
  selected: {
    backgroundColor: Colors.darkBlue,
    padding: 10,
  },
  paddingTop20: {
    paddingTop: 20,
  },
  paddingTop5: {
    paddingTop: 15,
  },
  paddingLeft10: {
    paddingLeft: 10,
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: Colors.borderGray,
  },
  paddingVertical20: {
    paddingVertical: 20,
  },
  tooltipText: {
    ...Typography.boschReg12,
    textAlign: 'left',
    flexShrink: 1,
  },
  node: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 10,
    height: 10,
    borderRadius: 10,
    borderWidth: 1,
    zIndex: 20,
  },
  completed: {
    backgroundColor: Colors.darkBlue,
    borderColor: Colors.darkBlue,
  },
  notComplete: {
    backgroundColor: Colors.white,
    borderColor: Colors.darkBlue,
  },
});
