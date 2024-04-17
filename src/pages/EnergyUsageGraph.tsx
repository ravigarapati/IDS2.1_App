import {TouchableOpacity} from 'react-native';

import React, {useState, useEffect} from 'react';

import {View, StyleSheet, ScrollView} from 'react-native';

import {ToggleButton, CustomText, InfoTooltip, BoschIcon} from '../components';

import {Dictionary} from '../utils/dictionary';

import {BarChart, XAxis} from 'react-native-svg-charts';

import {useSelector} from 'react-redux';

import {Colors, Typography} from '../styles';

import {Enum} from '../utils/enum';

import {Icons} from '../utils/icons';

import UserAnalytics from '../components/UserAnalytics';

export const EnergyUsageGraph = ({deviceData}) => {
  const [currentMonth, currentYear] = getPrevMonth(
    new Date().getMonth(),

    new Date().getFullYear(),
  );

  const [currentSelection, setCurrentSelection] = useState(0);

  const [dataShownForMonth, setDataShownForMonth] = useState('');

  const [dataChosenForMonth, setDataChosenForMonth] = useState('');

  const [monthInFocus, setMonthInFocus] = useState(currentMonth);

  const [yearInFocus, setYearInFocus] = useState(currentYear);

  const [comparitiveValue, setComparitiveValue] = useState(0);

  const [showNoDataView, setShowNoDataView] = useState(null);

  const fill = Colors.mediumGray;

  const userRole = useSelector(
    state => state.auth.user.attributes['custom:role'],
  );

  UserAnalytics('ids_energy_usage_graph');

  useEffect(() => {
    if (deviceData && deviceData.data && deviceData.data.length > 0) {
      getDeviceData();

      setShowNoDataView(false);
    } else {
      setShowNoDataView(true);
    }
  }, [deviceData]);

  const [chartData, setChartData] = useState({
    labels: ['', ''],

    data: [{}, {}],
  });

  /**

* @function getPrevMonth

* @description Get data for previous month

* @param {number} month value (0 to 11)

* @param {number} year value

* @returns {array} Array consisting of month and year

*/

  function getPrevMonth(month, year) {
    if (month === 0) {
      month = 11;

      year = year - 1;
    } else {
      month = month - 1;

      year = year;
    }

    return [month, year];
  }

  /**

* @function getNextMonth

* @description Get data for next month

* @param {number} month value (0 to 11)

* @param {number} year value

* @returns {array} Array consisting of month and year

*/

  function getNextMonth(month, year) {
    if (month === 11) {
      month = 0;

      year = year + 1;
    } else {
      month = month + 1;

      year = year;
    }

    return [month, year];
  }

  /**

* @function getDeviceData

* @description Set month and year to current month/year for when selected device is changed

*

*/

  function getDeviceData() {
    setMonthInFocus(currentMonth);

    setYearInFocus(currentYear);

    let month1Data = [currentMonth, currentYear];

    if (currentSelection === 1) {
      let month2Data = [currentMonth, currentYear - 1];

      getEnergyViewData(month1Data, month2Data);
    } else {
      let month2Data = getPrevMonth(currentMonth, currentYear);

      getEnergyViewData(month1Data, month2Data);
    }
  }

  /**

* @function getEnergyViewData

* @description Get energy usage data for currently selected device

* @param {number} month1Data Data for month1

* @param {number} month2Data Data for month2

*/

  function getEnergyViewData(month1Data, month2Data) {
    let newChartData = Object.assign(chartData);

    newChartData.data = [];

    if (deviceData.data !== undefined) {
      let deviceDataForTheYear = deviceData.data.find(
        data => data.year === month1Data[1].toString(),
      );

      if (month1Data[1] === month2Data[1]) {
        if (deviceDataForTheYear !== undefined) {
          if (deviceDataForTheYear.months[month2Data[0]]) {
            let obj = {value: deviceDataForTheYear.months[month2Data[0]]};

            newChartData.data.push(obj);
          } else {
            newChartData.data.push({});
          }

          if (deviceDataForTheYear.months[month1Data[0]]) {
            let obj = {value: deviceDataForTheYear.months[month1Data[0]]};

            newChartData.data.push(obj);
          } else {
            newChartData.data.push({});
          }
        } else {
          newChartData.data.push({});
        }
      } else {
        let deviceDataForTheYear1 = deviceData.data.find(
          data => data.year === month2Data[1].toString(),
        );

        if (deviceDataForTheYear1 !== undefined) {
          if (deviceDataForTheYear1.months[month2Data[0]]) {
            let obj = {value: deviceDataForTheYear1.months[month2Data[0]]};

            newChartData.data.push(obj);
          } else {
            newChartData.data.push({});
          }
        } else {
          newChartData.data.push({});
        }

        if (deviceDataForTheYear !== undefined) {
          if (deviceDataForTheYear.months[month1Data[0]]) {
            let obj = {value: deviceDataForTheYear.months[month1Data[0]]};

            newChartData.data.push(obj);
          } else {
            newChartData.data.push({});
          }
        } else {
          newChartData.data.push({});
        }
      }

      if (
        newChartData.data.length > 0 &&
        newChartData.data[0] &&
        newChartData.data[1] &&
        newChartData.data[0].value &&
        newChartData.data[1].value
      ) {
        let value =
          ((newChartData.data[1].value - newChartData.data[0].value) /
            newChartData.data[0].value) *
          100;

        setComparitiveValue(value);
      } else {
        setComparitiveValue(null);
      }

      newChartData.labels = [];

      newChartData.labels.push(
        Dictionary.homeOwnerUsage['month' + month2Data[0]] +
          ' ' +
          month2Data[1],
      );

      newChartData.labels.push(
        Dictionary.homeOwnerUsage['month' + month1Data[0]] +
          ' ' +
          month1Data[1],
      );

      setDataShownForMonth(
        Dictionary.homeOwnerUsage['month' + month1Data[0]] +
          ' ' +
          month1Data[1],
      );

      setDataChosenForMonth(month1Data[0]);
    } else {
      newChartData.data = [{}, {}];

      newChartData.labels = [];
    }

    setChartData(newChartData);
  }

  /**

* @function navigateLeft

* @description Move right on click of left arrow. Change data to previous two months.

*/

  function navigateLeft() {
    if (yearInFocus >= deviceData.data[0].year) {
      let month1Data = getPrevMonth(monthInFocus, yearInFocus); // Previous Month

      let month2Data = getPrevMonth(month1Data[0], month1Data[1]); // 2 Month`s Previous

      setMonthInFocus(month1Data[0]);

      setYearInFocus(month1Data[1]);

      getEnergyViewData(month1Data, month2Data);
    }
  }

  /**

* @function navigateRight

* @description Move right on click of right arrow. Change data to next two months.

*/

  function navigateRight() {
    let month1Data = getNextMonth(monthInFocus, yearInFocus); // Next Month

    let month2Data = [monthInFocus, yearInFocus];

    setMonthInFocus(month1Data[0]);

    setYearInFocus(month1Data[1]);

    getEnergyViewData(month1Data, month2Data);
  }

  /**

* @function navigateLeftYear

* @description Move left on click of left arrow. Change data to previous two years.

*/

  function navigateLeftYear() {
    if (yearInFocus >= deviceData.data[0].year) {
      if (yearInFocus === currentYear) {
        let month2Data = [monthInFocus, yearInFocus - 2];
        let month1Data = [monthInFocus, yearInFocus - 1];
        setMonthInFocus(month2Data[0]);
        setYearInFocus(month2Data[1]);
        getEnergyViewData(month1Data, month2Data);
      } else {
        let month2Data = [monthInFocus, yearInFocus - 1];
        let month1Data = [monthInFocus, yearInFocus];
        setMonthInFocus(month2Data[0]);
        setYearInFocus(month2Data[1]);
        getEnergyViewData(month1Data, month2Data);
      }
    }
  }

  /**

* @function navigateRightYear

* @description Move right on click of right arrow. Change data to next two years.

*/

  function navigateRightYear() {
    let month1Data = [monthInFocus, yearInFocus + 1];

    let month2Data = [monthInFocus, yearInFocus];

    setMonthInFocus(month1Data[0]);

    setYearInFocus(month1Data[1]);

    getEnergyViewData(month1Data, month2Data);
  }

  /**

* @function toggleFrequency

* @description Change graph values based on month/year

* @param {number} value 0 - month, 1 - year

*/

  function toggleFrequency(value) {
    //setMonthInFocus(currentMonth);

    setMonthInFocus(dataChosenForMonth);

    setYearInFocus(currentYear);

    if (value === 1) {
      let month1Data = [dataChosenForMonth, currentYear];

      let month2Data = [dataChosenForMonth, currentYear - 1];

      getEnergyViewData(month1Data, month2Data);
    } else {
      let month1Data = [dataChosenForMonth, currentYear];

      let month2Data = getPrevMonth(dataChosenForMonth, currentYear);

      getEnergyViewData(month1Data, month2Data);
    }
  }

  return (
    <View style={[styles.usageContainer]}>
      <ScrollView contentContainerStyle={[styles.contentContainer]}>
        {chartData.labels.length > 0 && !showNoDataView && (
          <View>
            <CustomText
              font="bold"
              align="center"
              style={[styles.marginTop5]}
              text={dataShownForMonth}
              newline={true}
            />

            <View style={[styles.flexRow, styles.alignCenter]}>
              <ToggleButton
                pressed={currentSelection}
                button1={Dictionary.homeOwnerUsage.month}
                button2={Dictionary.homeOwnerUsage.year}
                onChange={(value: any) => {
                  setCurrentSelection(value);

                  toggleFrequency(value);
                }}
                style={[styles.marginLeft30]}
              />

              <View>
                <InfoTooltip
                  positionHorizontal="right"
                  positionVertical="bottom"
                  text={Dictionary.homeOwnerUsage.energyUsagetooltip}
                />
              </View>
            </View>

            {comparitiveValue == null && (
              <View>
                <CustomText
                  color={Colors.darkBlue}
                  text={Dictionary.homeOwnerUsage.noValue}
                />
              </View>
            )}

            {comparitiveValue !== null && comparitiveValue > 0 && (
              <View style={[styles.usageText]}>
                <BoschIcon
                  name={Icons.arrowUp}
                  size={20}
                  color={Colors.darkRed}
                  style={{height: 20}}
                />

                <CustomText
                  color={Colors.darkRed}
                  text={
                    Math.round(comparitiveValue) +
                    Dictionary.homeOwnerUsage.moreUsage
                  }
                />
              </View>
            )}

            {comparitiveValue !== null && comparitiveValue <= 0 && (
              <View style={[styles.usageText]}>
                <BoschIcon
                  name={Icons.arrowDown}
                  size={20}
                  color={Colors.darkGreen}
                  style={{height: 20}}
                />

                <CustomText
                  color={Colors.darkGreen}
                  text={
                    Math.round(Math.abs(comparitiveValue)) +
                    Dictionary.homeOwnerUsage.lessUsage
                  }
                />
              </View>
            )}

            <View style={styles.container}>
              <View style={[styles.usageContainer]}>
                <TouchableOpacity
                  style={[styles.arrowPadding]}
                  onPress={() => {
                    currentSelection === 0
                      ? navigateLeft()
                      : navigateLeftYear();
                  }}>
                  <BoschIcon
                    name={Icons.backLeft}
                    size={20}
                    accessibilityLabel={'previous'}
                    style={{height: 20}}
                  />
                </TouchableOpacity>
              </View>

              <View style={[styles.flex3]}>
                <BarChart
                  style={[styles.barChart]}
                  data={chartData.data}
                  gridMin={0}
                  svg={{fill}}
                  spacingInner={0.4}
                  spacingOuter={0.4}
                  yAccessor={({item}) => item.value}
                  contentInset={{top: 30}}
                />

                {chartData.labels.length > 0 ? (
                  <XAxis
                    style={[styles.axis]}
                    data={chartData.labels}
                    yAccessor={({item}) => item}
                    formatLabel={(value, index) =>
                      chartData.labels[index] ? chartData.labels[index] : ''
                    }
                    contentInset={{top: 30, bottom: 30, left: 70, right: 70}}
                    svg={{
                      fontSize: 12,

                      fill: Colors.darkGray,

                      fontFamily: Typography.FONT_FAMILY_REGULAR,
                    }}
                  />
                ) : (
                  ''
                )}
              </View>

              <View style={[styles.usageContainer]}>
                {!(
                  (currentSelection === 1 && yearInFocus === currentYear) ||
                  (currentSelection === 0 &&
                    monthInFocus === currentMonth &&
                    yearInFocus === currentYear)
                ) && (
                  <TouchableOpacity
                    style={[styles.arrowPadding]}
                    onPress={() => {
                      currentSelection === 0
                        ? navigateRight()
                        : navigateRightYear();
                    }}>
                    <BoschIcon
                      name={Icons.backLeft}
                      size={20}
                      style={{transform: [{rotateY: '180deg'}], height: 20}}
                      accessibilityLabel={'next'}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {comparitiveValue == null || userRole !== Enum.roles.homeowner ? (
              <View />
            ) : (
              <>
                {comparitiveValue !== null && comparitiveValue <= 0 && (
                  <View style={[styles.infoTextContainer]}>
                    <CustomText
                      text={Dictionary.homeOwnerUsage.lessEnergyUsage}
                      align="left"
                      color={Colors.darkBlue}
                    />
                  </View>
                )}

                {comparitiveValue !== null && comparitiveValue > 0 && (
                  <View style={[styles.infoTextContainer]}>
                    <BoschIcon
                      name={Icons.lightBulb}
                      size={30}
                      color={Colors.mediumBlue}
                      accessibilityLabel={'tips'}
                      style={{height: 30}}
                    />

                    <View style={[styles.infoText]}>
                      <CustomText
                        align="left"
                        text={Dictionary.homeOwnerUsage.moreEnergyUsage.title}
                        color={Colors.mediumBlue}
                        newline={true}
                      />

                      <View>
                        <CustomText
                          align="left"
                          text={Dictionary.homeOwnerUsage.moreEnergyUsage.tips}
                          color={Colors.mediumBlue}
                          newline={true}
                        />
                      </View>
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {showNoDataView && (
          <View style={[styles.noDataView]}>
            <CustomText
              text={Dictionary.homeOwnerUsage.noData}
              size={20}
              color={Colors.darkRed}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  usageContainer: {
    flex: 1,

    backgroundColor: Colors.white,
  },

  contentContainer: {
    justifyContent: 'space-evenly',

    padding: 10,

    backgroundColor: Colors.white,
  },

  container: {
    backgroundColor: Colors.white,

    flexDirection: 'row',

    alignItems: 'center',

    flex: 1,
  },

  graphStyle: {
    color: Colors.darkRed,

    marginTop: 20,
  },

  flexRow: {
    flexDirection: 'row',
  },

  alignCenter: {
    alignItems: 'center',
  },

  infoTextContainer: {
    backgroundColor: Colors.lightBlue,

    padding: 15,

    flexDirection: 'row',

    margin: 20,
  },

  infoText: {
    paddingHorizontal: 10,

    flex: 1,
  },

  usageText: {
    marginTop: 5,

    flexDirection: 'row',

    justifyContent: 'center',

    flex: 1,
  },

  noDataView: {
    padding: 30,
  },

  arrowPadding: {
    padding: 24,
  },

  barChart: {
    height: 200,

    borderBottomWidth: 2,

    borderColor: Colors.mediumGray,
  },

  axis: {marginVertical: 10},

  flex3: {flex: 3},

  marginTop5: {marginTop: 5},

  marginLeft30: {marginLeft: 30},
});
