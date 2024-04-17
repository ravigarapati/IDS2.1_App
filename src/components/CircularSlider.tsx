import {
  PanResponder,
  View,
  TouchableHighlight,
  Touchable,
  Image,
  AccessibilityActionEvent,
  Dimensions,
} from 'react-native';
import Svg, {Path, Circle, G, Text, Rect} from 'react-native-svg';
import React, {Component} from 'react';
import {connect} from 'react-redux';

const height = Dimensions.get('screen').height;

class CircularSlider extends Component {
  constructor(props) {
    super(props);
    this.handlePanResponderMoveHeating =
      this.handlePanResponderMoveHeating.bind(this);
    this.handlePanResponderMoveCooling =
      this.handlePanResponderMoveCooling.bind(this);
    this.handlePanResponderMoveAuxCooling =
      this.handlePanResponderMoveAuxCooling.bind(this);
    this.handlePanResponderMoveAuxHeating =
      this.handlePanResponderMoveAuxHeating.bind(this);
    this.cartesianToPolar = this.cartesianToPolar.bind(this);
    this.polarToCartesian = this.polarToCartesian.bind(this);
    const {width, height, layoutWidth} = props;
    const smallestSide = Math.min(width, height);
    this.state = {
      cx: layoutWidth / 2,
      cy: (height + 80) / 2.3,
      r: (smallestSide / 2) * 0.85,
      clickedHeatSlider: false,
      clickedCoolSlider: false,
      heatSelected: false,
      coolSelected: false,
      temperatureLimits: this.props.selectedDevice.isFahrenheit
        ? {min: 45, max: 99.1}
        : {min: 7, max: 38.1},
      divisor: this.props.selectedDevice.isFahrenheit ? 5.57 : 9.62,
      plus: this.props.selectedDevice.isFahrenheit ? 45 : 7,
      dashArray: this.props.selectedDevice.isFahrenheit
        ? `${height * 0.01} ${height * 0.032}`
        : `${height * 0.01} ${height * 0.063}`,
    };

    this._panResponderHeating = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this.handlePanResponderMoveHeating,
      onPanResponderStart: () => {
        this.setState({
          clickedHeatSlider: true,
        });
        if (this.props.mode === 'Auto') {
          if (this.props.coolTimer !== null) {
            this.props.clearCoolTimer();
            this.props.setCoolSelected(false);
          }
          this.props.setHeatSelected(true);
          this.props.initializeTimerHeat();
        }
      },
      onPanResponderEnd: () => {
        this.setState({
          clickedHeatSlider: false,
        });
        this.props.onHeatingRelease();
      },
    });

    this._panResponderAuxHeating = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this.handlePanResponderMoveAuxHeating,
      onPanResponderStart: () => {
        this.props.setHoldingHeat(true);
        this.setState({
          clickedHeatSlider: true,
        });
        if (this.props.mode === 'Auto') {
          if (this.props.coolTimer !== null) {
            this.props.clearCoolTimer();
            this.props.setCoolSelected(false);
          }
          this.props.setHeatSelected(true);
          this.props.initializeTimerHeat();
        }
      },
      onPanResponderEnd: () => {
        this.props.setHoldingHeat(false);
        this.setState({
          clickedHeatSlider: false,
        });
        this.props.onHeatingRelease();
      },
    });

    this._panResponderCooling = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this.handlePanResponderMoveCooling,
      onPanResponderStart: () => {
        this.setState({
          clickedCoolSlider: true,
        });
        if (this.props.mode === 'Auto') {
          if (this.props.heatTimer !== null) {
            this.props.clearHeatTimer();
            this.props.setHeatSelected(false);
          }
          this.props.setCoolSelected(true);
          this.props.initializeTimerCool();
        }
      },
      onPanResponderEnd: () => {
        this.setState({
          clickedCoolSlider: false,
        });
        this.props.onCoolingRelease();
      },
    });

    this._panResponderAuxCooling = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this.handlePanResponderMoveAuxCooling,
      onPanResponderStart: () => {
        this.props.setHoldingCool(true);
        this.setState({
          clickedCoolSlider: true,
        });
        if (this.props.mode === 'Auto') {
          if (this.props.heatTimer !== null) {
            this.props.clearHeatTimer();
            this.props.setHeatSelected(false);
          }
          this.props.setCoolSelected(true);
          this.props.initializeTimerCool();
        }
      },
      onPanResponderEnd: () => {
        this.props.setHoldingCool(false);
        this.setState({
          clickedCoolSlider: false,
        });
        this.props.onCoolingRelease();
      },
    });
  }

  accessibilityActions(event: AccessibilityActionEvent) {
    switch (event.nativeEvent.actionName) {
      case 'activate':
        if (this.props.coolTimer === null && this.props.heatTimer === null) {
          this.props.setHeatSelected(true);
          this.props.initializeTimerHeat();
        } else if (
          this.props.coolTimer === null &&
          this.props.heatTimer !== null
        ) {
          this.props.clearHeatTimer();
          this.props.setHeatSelected(false);

          this.props.setCoolSelected(true);
          this.props.initializeTimerCool();
        } else if (
          this.props.coolTimer !== null &&
          this.props.heatTimer === null
        ) {
          this.props.clearCoolTimer();
          this.props.setCoolSelected(false);

          this.props.setHeatSelected(true);
          this.props.initializeTimerHeat();
        }
        break;
      case 'increment':
        this.props.updateTemperature('add');

        break;
      case 'decrement':
        this.props.updateTemperature('substract');

        break;
    }
  }

  selectTemperatureSymbol() {
    return this.props.selectedDevice.isFahrenheit ? 'F' : 'C';
  }

  polarToCartesian(angle) {
    const {cx, cy, r} = this.state,
      a = ((angle - 270) * Math.PI) / 180.0,
      x = cx + r * Math.cos(a),
      y = cy + r * Math.sin(a);
    return {x, y};
  }
  cartesianToPolar(x, y) {
    const {cx, cy} = this.state;
    return Math.round(
      Math.atan((y - cy) / (x - cx)) / (Math.PI / 180) + (x > cx ? 270 : 90),
    );
  }
  handlePanResponderMoveHeating({nativeEvent: {locationX, locationY}}) {
    const number = this.props.selectedDevice.isFahrenheit ? 5.57 : 9.62;
    const plus = this.props.selectedDevice.isFahrenheit ? 45 : 7;
    const limit = this.props.selectedDevice.isFahrenheit ? 99 : 38;
    const result = this.cartesianToPolar(locationX, locationY);
    const auxResultInDegrees = (result - 30) / number + plus;
    const resultInDegrees = Math.floor((result - 30) / number + plus);
    if (
      auxResultInDegrees >= this.state.temperatureLimits.min &&
      auxResultInDegrees <= this.state.temperatureLimits.max
    ) {
      const coolingInDegrees = Math.floor(
        (this.props.cooling - 30) / number + plus,
      );
      //if (this.props.mode === 'Auto') {
      //  const aux = coolingInDegrees - resultInDegrees;
      //  if (coolingInDegrees <= limit) {
      //    if (aux <= 2) {
      //      if (coolingInDegrees <= limit) {
      //        this.props.onCoolingChange(this.props.cooling + number);
      //        if (coolingInDegrees === limit && aux === 3) {
      //          this.props.onHeatingChange(result);
      //        }
      //      }
      //    } else {
      //      if (aux >= 2) {
      //        this.props.onHeatingChange(result);
      //      }
      //    }
      //  }
      //} else {
      this.props.onHeatingChange(result);
      //}
    }
  }

  handlePanResponderMoveAuxHeating({nativeEvent: {locationX, locationY}}) {
    const number = this.props.selectedDevice.isFahrenheit ? 5.57 : 9.62;
    const plus = this.props.selectedDevice.isFahrenheit ? 45 : 7;
    const limit = this.props.selectedDevice.isFahrenheit ? 99 : 38;
    const result = this.cartesianToPolar(locationX, locationY);
    const auxResultInDegrees = (result - 30) / number + plus;
    const resultInDegrees = Math.floor((result - 30) / number + plus);
    //if (
    //  auxResultInDegrees >= this.state.temperatureLimits.min &&
    //  auxResultInDegrees <= this.state.temperatureLimits.max
    //) {
    const coolingInDegrees = Math.floor(
      (this.props.cooling - 30) / number + plus,
    );
    //if (this.props.mode === 'Auto') {
    //  const aux = coolingInDegrees - resultInDegrees;
    //  if (coolingInDegrees <= limit) {
    //    if (aux <= 2) {
    //      if (coolingInDegrees <= limit) {
    //        this.props.onCoolingChange(this.props.cooling + number);
    //        if (coolingInDegrees === limit && aux === 3) {
    //          this.props.onAuxHeatingChange(result);
    //        }
    //      }
    //    } else {
    //      if (aux >= 2) {
    //        this.props.onAuxHeatingChange(result);
    //      }
    //    }
    //  }
    //} else {
    this.props.onAuxHeatingChange(result);
    //}
    //}
  }

  defineSetpointLine(value1, value2) {
    return value1 - value2 <= 180
      ? value1 - value2 > 179.7
        ? 1
        : 0
      : value1 - value2 < 180.2
      ? 0
      : 1;
  }

  handlePanResponderMoveCooling({nativeEvent: {locationX, locationY}}) {
    const number = this.props.selectedDevice.isFahrenheit ? 5.57 : 9.62;
    const plus = this.props.selectedDevice.isFahrenheit ? 45 : 7;
    const limit = this.props.selectedDevice.isFahrenheit ? 45 : 7;
    const result = this.cartesianToPolar(locationX, locationY);
    const resultInDegrees = Math.floor((result - 30) / number + plus);
    const auxResultInDegrees = (result - 30) / number + plus;
    if (
      auxResultInDegrees >= this.state.temperatureLimits.min &&
      auxResultInDegrees <= this.state.temperatureLimits.max
    ) {
      const heatingInDegrees = Math.floor(
        (this.props.heating - 30) / number + plus,
      );
      //if (this.props.mode === 'Auto') {
      //  const aux = resultInDegrees - heatingInDegrees;
      //  if (aux <= 2) {
      //    if (heatingInDegrees >= limit) {
      //      this.props.onHeatingChange(this.props.heating - number);
      //      if (heatingInDegrees === limit && aux === 3) {
      //        this.props.onCoolingChange(result);
      //      }
      //    }
      //  } else {
      //    if (aux >= 2) {
      //      this.props.onCoolingChange(result);
      //    }
      //  }
      //} else {
      this.props.onCoolingChange(result);
      //}
    }
  }

  handlePanResponderMoveAuxCooling({nativeEvent: {locationX, locationY}}) {
    const number = this.props.selectedDevice.isFahrenheit ? 5.57 : 9.62;
    const plus = this.props.selectedDevice.isFahrenheit ? 45 : 7;
    const limit = this.props.selectedDevice.isFahrenheit ? 45 : 7;
    const result = this.cartesianToPolar(locationX, locationY);
    const resultInDegrees = Math.floor((result - 30) / number + plus);
    const auxResultInDegrees = (result - 30) / number + plus;
    //if (
    //  auxResultInDegrees >= this.state.temperatureLimits.min &&
    //  auxResultInDegrees <= this.state.temperatureLimits.max
    //) {
    const heatingInDegrees = Math.floor(
      (this.props.heating - 30) / number + plus,
    );
    //if (this.props.mode === 'Auto') {
    //  const aux = resultInDegrees - heatingInDegrees;
    //  if (aux <= 2) {
    //    if (heatingInDegrees >= limit) {
    //      this.props.onHeatingChange(this.props.heating - number);
    //      if (heatingInDegrees === limit && aux === 3) {
    //        this.props.onAuxCoolingChange(result);
    //      }
    //    }
    //  } else {
    //    if (aux >= 2) {
    //      this.props.onAuxCoolingChange(result);
    //    }
    //  }
    //} else {
    this.props.onAuxCoolingChange(result);
    //}
    //}
  }

  render() {
    const auxiliar = {
      45: [0, 0, 0],
      46: [0, 0, -2],
      47: [0, 0, 1.3],
      48: [0, 0, 1.3],
      49: [0, 0, 1.3],
      50: [0, 0, 1.5],
      51: [0, 0.5, 1.6],
      52: [0, 0.5, 1.7],
      53: [0, 0.5, 1.8],
      54: [1, 0, 1],
      55: [1, 0, 1],
      56: [1, 0, 1.2],
      57: [1, 0, 1.3],
      58: [1, 0, 1.5],
      59: [1, 0, 1.5],
      60: [1, 0, 1.5],
      61: [1, 0, 1.8],
      62: [1, 0, 1.8],
      63: [1.3, 0, 1.3],
      64: [1.5, 0, 1.3],
      65: [1.7, 0, 1.3],
      66: [1.7, 0, 1.3],
      67: [3, -1, 0.5],
      68: [3, -1, 0.5],
      69: [3, -1, 0.5],
      70: [3, -0.5, 0.5],
      71: [3, -1, 0],
      72: [3.5, -1, 0],
      73: [4, -1, 0],
      74: [4, -1, 0],
      75: [3.5, -0.5, 0.3],
      76: [3.5, -0.6, 0.3],
      77: [4, -1, 0],
      78: [4, -1, 0],
      79: [4, -1, 0.5],
      80: [5, -2, -0.4],
      81: [5, -2, -0.3],
      82: [5, -2, -0.3],
      83: [5, -2, -0.2],
      84: [5, -2, 0],
      85: [5, -1.5, 0],
      86: [5, -1.5, 0],
      87: [5, -1.5, 0],
      88: [5, -1.5, 0],
      89: [5.5, -1.5, -0.2],
      90: [5.5, -1.5, 0],
      91: [5.5, -1.5, 0],
      92: [5.5, -1.5, 0],
      93: [5.5, -1.5, 0],
      94: [5.5, -1.5, 0.2],
      95: [5.5, -1.5, 0.5],
      96: [5.5, -1, 0.5],
      97: [5.5, -1, 0.5],
      98: [5.5, -1, 0.5],
      99: [5.5, 0, 0.5],
    };

    const auxiliarC = {
      7: [0, 0, 0],
      8: [0, 0, 0.5],
      9: [0, 0.5, 1.8],
      10: [0.5, 0, 1.8],
      11: [0.5, 0, 1.8],
      12: [0.5, 0.5, 1.8],
      13: [0.8, 0.5, 1.8],
      14: [1, 0.5, 1.8],
      15: [1.2, 0.5, 1.8],
      16: [1.5, 0.5, 1.8],
      17: [1.9, 0.2, 1.8],
      18: [2.2, 0, 1.5],
      19: [2.4, 0.2, 1.5],
      20: [2.9, 0, 1.5],
      21: [4.2, -0.7, 0],
      22: [4.6, -0.9, 0],
      23: [4.8, -1, 0],
      24: [4.8, -1, 0.3],
      25: [5, -1, 0.3],
      26: [5.2, -1, 0.3],
      27: [5.4, -1, 0.3],
      28: [5.8, -1, 0.2],
      29: [6, -1, 0.2],
      30: [6.4, -1, 0],
      31: [6.8, -1, 0],
      32: [7.2, -1.2, 0],
      33: [7.6, -1.2, 0],
      34: [8, -1.4, -0.4],
      35: [8.4, -1.6, -0.4],
      36: [8.8, -1.8, -0.4],
      37: [8.8, -1, -0.2],
      38: [8.8, 0, 0],
    };

    const auxValuesF = {
      45: 27,
      46: 33,
      47: 38,
      48: 44,
      49: 50,
      50: 55,
      51: 61,
      52: 67,
      53: 72,
      54: 78,
      55: 84,
      56: 89,
      57: 95,
      58: 101,
      59: 106,
      60: 112,
      61: 117,
      62: 123,
      63: 129,
      64: 135,
      65: 141,
      66: 146,
      67: 152,
      68: 158,
      69: 164,
      70: 170,
      71: 175,
      72: 181,
      73: 187,
      74: 192,
      75: 198,
      76: 204,
      77: 210,
      78: 216,
      79: 221,
      80: 227,
      81: 233,
      82: 239,
      83: 244,
      84: 250,
      85: 256,
      86: 261,
      87: 267,
      88: 273,
      89: 278,
      90: 284,
      91: 290,
      92: 295,
      93: 301,
      94: 306,
      95: 312,
      96: 318,
      97: 323,
      98: 329,
      99: 335,
    };

    const auxValuesC = {
      7: 27,
      8: 37,
      9: 47,
      10: 56,
      11: 66,
      12: 76,
      13: 86,
      14: 96,
      15: 106,
      16: 116,
      17: 126,
      18: 136,
      19: 146,
      20: 156,
      21: 166,
      22: 176,
      23: 186,
      24: 196,
      25: 206,
      26: 216,
      27: 226,
      28: 236,
      29: 246,
      30: 256,
      31: 265,
      32: 275,
      33: 285,
      34: 295,
      35: 305,
      36: 314,
      37: 324,
      38: 334,
    };

    const returnAuxValue = value => {
      let newValue = 0;
      if (this.props.fahrenheit) {
        newValue = auxValuesF[value];
      } else {
        newValue = auxValuesC[value];
      }

      return newValue;
    };

    const selectStartPointCooling = value => {
      let newValue;
      if (this.props.fahrenheit) {
        if (value === 45) {
          newValue = 27;
        } else if (value === 46) {
          newValue = 33.2;
        } else if (value === 47) {
          newValue = 39.5;
        } else if (value === 48) {
          newValue = 45.5;
        } else if (value === 49) {
          newValue = 50.8;
        } else if (value === 50) {
          newValue = 56.5;
        } else if (value === 51) {
          newValue = 62.2;
        } else if (value === 52) {
          newValue = 68;
        } else if (value === 53) {
          newValue = 73.8;
        } else if (value === 54) {
          newValue = 79.2;
        } else if (value === 55) {
          newValue = 85;
        } else if (value === 56) {
          newValue = 90.8;
        } else if (value === 57) {
          newValue = 96.2;
        } else if (value === 58) {
          newValue = 102;
        } else if (value === 59) {
          newValue = 107.8;
        } else if (value === 60) {
          newValue = 113.5;
        } else if (value === 61) {
          newValue = 119;
        } else if (value === 62) {
          newValue = 124.8;
        } else if (value === 63) {
          newValue = 130.5;
        } else if (value === 64) {
          newValue = 136;
        } else if (value === 65) {
          newValue = 141.8;
        } else if (value === 66) {
          newValue = 147.5;
        } else if (value === 67) {
          newValue = 153;
        } else if (value === 68) {
          newValue = 158.5;
        } else if (value === 69) {
          newValue = 164.5;
        } else if (value === 70) {
          newValue = 170;
        } else if (value === 71) {
          newValue = 175.5;
        } else if (value === 72) {
          newValue = 181.5;
        } else if (value === 73) {
          newValue = 187;
        } else if (value === 74) {
          newValue = 192.8;
        } else if (value === 75) {
          newValue = 198.5;
        } else if (value === 76) {
          newValue = 204;
        } else if (value === 77) {
          newValue = 209.8;
        } else if (value === 78) {
          newValue = 215.5;
        } else if (value === 79) {
          newValue = 221;
        } else if (value === 80) {
          newValue = 226.5;
        } else if (value === 81) {
          newValue = 232.5;
        } else if (value === 82) {
          newValue = 238;
        } else if (value === 83) {
          newValue = 243.5;
        } else if (value === 84) {
          newValue = 249.5;
        } else if (value === 85) {
          newValue = 255;
        } else if (value === 86) {
          newValue = 260.8;
        } else if (value === 87) {
          newValue = 266.5;
        } else if (value === 88) {
          newValue = 272;
        } else if (value === 89) {
          newValue = 277.5;
        } else if (value === 90) {
          newValue = 283.5;
        } else if (value === 91) {
          newValue = 289;
        } else if (value === 92) {
          newValue = 294.8;
        } else if (value === 93) {
          newValue = 300.5;
        } else if (value === 94) {
          newValue = 306;
        } else if (value === 95) {
          newValue = 311.5;
        } else if (value === 96) {
          newValue = 317.5;
        } else if (value === 97) {
          newValue = 323;
        } else if (value === 98) {
          newValue = 329;
        } else if (value === 99) {
          newValue = 334.5;
        }
      } else {
        if (value === 7) {
          newValue = 28;
        } else if (value === 8) {
          newValue = 38.5;
        } else if (value === 9) {
          newValue = 48;
        } else if (value === 10) {
          newValue = 58;
        } else if (value === 11) {
          newValue = 68;
        } else if (value === 12) {
          newValue = 77.5;
        } else if (value === 13) {
          newValue = 87.5;
        } else if (value === 14) {
          newValue = 97.2;
        } else if (value === 15) {
          newValue = 107;
        } else if (value === 16) {
          newValue = 117;
        } else if (value === 17) {
          newValue = 126.8;
        } else if (value === 18) {
          newValue = 136.5;
        } else if (value === 19) {
          newValue = 146.5;
        } else if (value === 20) {
          newValue = 156.5;
        } else if (value === 21) {
          newValue = 166;
        } else if (value === 22) {
          newValue = 176;
        } else if (value === 23) {
          newValue = 186;
        } else if (value === 24) {
          newValue = 196;
        } else if (value === 25) {
          newValue = 205.5;
        } else if (value === 26) {
          newValue = 215.5;
        } else if (value === 27) {
          newValue = 225;
        } else if (value === 28) {
          newValue = 235;
        } else if (value === 29) {
          newValue = 245;
        } else if (value === 30) {
          newValue = 255;
        } else if (value === 31) {
          newValue = 264.5;
        } else if (value === 32) {
          newValue = 274.5;
        } else if (value === 33) {
          newValue = 284.5;
        } else if (value === 34) {
          newValue = 294.5;
        } else if (value === 35) {
          newValue = 304;
        } else if (value === 36) {
          newValue = 314;
        } else if (value === 37) {
          newValue = 324;
        } else if (value === 38) {
          newValue = 334;
        }
      }
      return newValue;
    };
    /*
    const startPointHeating = {
      45:30,46:35.5,47:41.5,48:47,49:52.5,50:58.5,51:64,52:69.5,53:75.5,54:81,55:86.5,56:92.5,57:98,58:103.5,59:109.5,60:115,
      61:120.5,62:126.5,63:132,64:137.5,65) {
        newValue = 143.5;
      } else if (value === 66) {
        newValue = 149;
      } else if (value === 67) {
        newValue = 154.5;
      } else if (value === 68) {
        newValue = 160.5;
      } else if (value === 69) {
        newValue = 166;
      } else if (value === 70) {
        newValue = 172;
      } else if (value === 71) {
        newValue = 177.5;
      } else if (value === 72) {
        newValue = 183;
      } else if (value === 73) {
        newValue = 188.5;
      } else if (value === 74) {
        newValue = 194.5;
      } else if (value === 75) {
        newValue = 200;
      } else if (value === 76) {
        newValue = 205.5;
      } else if (value === 77) {
        newValue = 211.5;
      } else if (value === 78) {
        newValue = 217;
      } else if (value === 79) {
        newValue = 222.5;
      } else if (value === 80) {
        newValue = 228.5;
      } else if (value === 81) {
        newValue = 234;
      } else if (value === 82) {
        newValue = 239.5;
      } else if (value === 83) {
        newValue = 245.5;
      } else if (value === 84) {
        newValue = 251;
      } else if (value === 85) {
        newValue = 257;
      } else if (value === 86) {
        newValue = 262.5;
      } else if (value === 87) {
        newValue = 268;
      } else if (value === 88) {
        newValue = 274;
      } else if (value === 89) {
        newValue = 279.5;
      } else if (value === 90) {
        newValue = 285;
      } else if (value === 91) {
        newValue = 291;
      } else if (value === 92) {
        newValue = 296.5;
      } else if (value === 93) {
        newValue = 302;
      } else if (value === 94) {
        newValue = 308;
      } else if (value === 95) {
        newValue = 313.5;
      } else if (value === 96) {
        newValue = 319;
      } else if (value === 97) {
        newValue = 325;
      } else if (value === 98) {
        newValue = 330.5;
      } else if (value === 99) {
        newValue = 337.5;
      }
    }
*/
    const selectStartPointHeating = value => {
      let newValue;
      if (this.props.fahrenheit) {
        if (value === 45) {
          newValue = 27;
        } else if (value === 46) {
          newValue = 32.5;
        } else if (value === 47) {
          newValue = 38.2;
        } else if (value === 48) {
          newValue = 44.1;
        } else if (value === 49) {
          newValue = 49.8;
        } else if (value === 50) {
          newValue = 55.2;
        } else if (value === 51) {
          newValue = 61;
        } else if (value === 52) {
          newValue = 66.8;
        } else if (value === 53) {
          newValue = 72.3;
        } else if (value === 54) {
          newValue = 78;
        } else if (value === 55) {
          newValue = 83.9;
        } else if (value === 56) {
          newValue = 89.2;
        } else if (value === 57) {
          newValue = 94.8;
        } else if (value === 58) {
          newValue = 101;
        } else if (value === 59) {
          newValue = 106.2;
        } else if (value === 60) {
          newValue = 112;
        } else if (value === 61) {
          newValue = 117.6;
        } else if (value === 62) {
          newValue = 123.5;
        } else if (value === 63) {
          newValue = 129;
        } else if (value === 64) {
          newValue = 134.5;
        } else if (value === 65) {
          newValue = 140.5;
        } else if (value === 66) {
          newValue = 146;
        } else if (value === 67) {
          newValue = 151.5;
        } else if (value === 68) {
          newValue = 157.5;
        } else if (value === 69) {
          newValue = 163;
        } else if (value === 70) {
          newValue = 168.7;
        } else if (value === 71) {
          newValue = 174.5;
        } else if (value === 72) {
          newValue = 180;
        } else if (value === 73) {
          newValue = 185.5;
        } else if (value === 74) {
          newValue = 191.5;
        } else if (value === 75) {
          newValue = 197;
        } else if (value === 76) {
          newValue = 202.5;
        } else if (value === 77) {
          newValue = 208.5;
        } else if (value === 78) {
          newValue = 214;
        } else if (value === 79) {
          newValue = 219.5;
        } else if (value === 80) {
          newValue = 225.5;
        } else if (value === 81) {
          newValue = 231;
        } else if (value === 82) {
          newValue = 236.6;
        } else if (value === 83) {
          newValue = 242.5;
        } else if (value === 84) {
          newValue = 248;
        } else if (value === 85) {
          newValue = 253.8;
        } else if (value === 86) {
          newValue = 259.5;
        } else if (value === 87) {
          newValue = 265;
        } else if (value === 88) {
          newValue = 270.8;
        } else if (value === 89) {
          newValue = 276.5;
        } else if (value === 90) {
          newValue = 282;
        } else if (value === 91) {
          newValue = 287.8;
        } else if (value === 92) {
          newValue = 293.5;
        } else if (value === 93) {
          newValue = 299;
        } else if (value === 94) {
          newValue = 305;
        } else if (value === 95) {
          newValue = 310.5;
        } else if (value === 96) {
          newValue = 316;
        } else if (value === 97) {
          newValue = 322;
        } else if (value === 98) {
          newValue = 327.5;
        } else if (value === 99) {
          newValue = 334.5;
        }
      } else {
        if (value === 7) {
          newValue = 27;
        } else if (value === 8) {
          newValue = 37;
        } else if (value === 9) {
          newValue = 46.8;
        } else if (value === 10) {
          newValue = 56.5;
        } else if (value === 11) {
          newValue = 66.5;
        } else if (value === 12) {
          newValue = 76.2;
        } else if (value === 13) {
          newValue = 86;
        } else if (value === 14) {
          newValue = 96;
        } else if (value === 15) {
          newValue = 106;
        } else if (value === 16) {
          newValue = 115.5;
        } else if (value === 17) {
          newValue = 125.5;
        } else if (value === 18) {
          newValue = 135.5;
        } else if (value === 19) {
          newValue = 145.2;
        } else if (value === 20) {
          newValue = 155;
        } else if (value === 21) {
          newValue = 165;
        } else if (value === 22) {
          newValue = 175;
        } else if (value === 23) {
          newValue = 184.5;
        } else if (value === 24) {
          newValue = 194.5;
        } else if (value === 25) {
          newValue = 204;
        } else if (value === 26) {
          newValue = 214;
        } else if (value === 27) {
          newValue = 224;
        } else if (value === 28) {
          newValue = 234;
        } else if (value === 29) {
          newValue = 244;
        } else if (value === 30) {
          newValue = 253.5;
        } else if (value === 31) {
          newValue = 263.5;
        } else if (value === 32) {
          newValue = 273.5;
        } else if (value === 33) {
          newValue = 283;
        } else if (value === 34) {
          newValue = 293;
        } else if (value === 35) {
          newValue = 303;
        } else if (value === 36) {
          newValue = 312.5;
        } else if (value === 37) {
          newValue = 323;
        } else if (value === 38) {
          newValue = 334;
        }
      }
      return newValue;
    };

    const {
        height,
        heating,
        heatingTemp,
        coolingTemp,
        textColorInnerCircle,
        cooling,
        layoutWidth,
        currentTemp,
      } = this.props,
      {cx, cy, r} = this.state,
      heatingInDegrees = (heating - 30) / this.state.divisor + this.state.plus,
      heatingAux = heatingTemp
        ? heating //+
        : null,
      heatingAuxInDegrees =
        (heatingAux - 30) / this.state.divisor + this.state.plus,
      coolingInDegrees = (cooling - 30) / this.state.divisor + this.state.plus,
      coolingAux = coolingTemp
        ? cooling //+
        : null,
      coolingAuxInDegrees =
        (coolingAux - 30) / this.state.divisor + this.state.plus,
      startDashboard = this.polarToCartesian(27),
      currentTemperature =
        currentTemp && this.props.selectedDevice.isFahrenheit !== undefined
          ? this.polarToCartesian(returnAuxValue(currentTemp))
          : 0,
      currentValue =
        currentTemp && this.props.selectedDevice.isFahrenheit !== undefined
          ? returnAuxValue(currentTemp)
          : 0,
      startCoordHeating =
        this.props.mode !== 'Off'
          ? this.polarToCartesian(
              //heating
              selectStartPointHeating(currentTemp), //currentValue, //+
            )
          : 0,
      startCoordCooling =
        this.props.mode !== 'Off'
          ? this.polarToCartesian(selectStartPointCooling(currentTemp))
          : 0,
      auxEndCoordHeating =
        (heatingAuxInDegrees - this.state.plus) * this.state.divisor + 30,
      heatingSetpoint = this.props.heating
        ? this.polarToCartesian(auxEndCoordHeating)
        : null,
      auxEndCoordCooling =
        (coolingAuxInDegrees - this.state.plus) * this.state.divisor + 30,
      endCoord1 = this.props.cooling
        ? this.polarToCartesian(auxEndCoordCooling)
        : null,
      coolingSetpoint = this.props.cooling
        ? this.polarToCartesian(auxEndCoordCooling)
        : this.polarToCartesian(cooling),
      endDashboard = this.polarToCartesian(335);

    return (
      <View
        accessible={true}
        accessibilityRole={'adjustable'}
        accessibilityLabel={`Thermostat under ${this.props.mode} mode. ${
          this.props.mode === 'Auto'
            ? this.props.heatSelected
              ? 'Heating currently selected.'
              : this.props.coolSelected
              ? 'Cooling currently selected.'
              : ''
            : ' '
        } Current indoor temperature: ${
          this.props.currentTemp
        }° ${this.selectTemperatureSymbol()}. ${
          this.props.heating
            ? 'Heating: ' +
              this.props.heatingTemp +
              '°' +
              this.selectTemperatureSymbol() +
              '.'
            : ''
        } ${
          this.props.cooling
            ? 'Cooling: ' +
              this.props.coolingTemp +
              '°' +
              this.selectTemperatureSymbol() +
              '.'
            : ''
        } Current humidity: ${this.props.humidity}%`}
        accessibilityHint={`${
          this.props.mode === 'Auto'
            ? `Double tap to switch  between heating and cooling. Swipe up your finger to increase ${
                this.props.heatSelected ? 'Heating' : 'Cooling'
              } temperature. Swipe down your finger to decrease ${
                this.props.heatSelected ? 'Heating' : 'Cooling'
              } temperature.`
            : ''
        }`}
        accessibilityActions={[
          {name: 'increment'},
          {name: 'decrement'},
          {name: 'activate'},
        ]}
        onAccessibilityAction={(event: AccessibilityActionEvent) => {
          this.accessibilityActions(event);
        }}>
        <Svg
          onLayout={this.onLayout}
          width={layoutWidth}
          height={height}
          style={{transform: [{rotate: '0deg'}]}}>
          <Path
            d={`M ${startDashboard.x} ${startDashboard.y} A ${r} ${r} 139 1 1 ${endDashboard.x} ${endDashboard.y}`}
            stroke={'#D1D1D1'}
            strokeWidth={20}
            strokeLinejoin="round"
            strokeDasharray={
              this.props.selectedDevice.isFahrenheit
                ? `${height * 0.01} ${height * 0.032}`
                : `${height * 0.01} ${height * 0.063}`
            }
          />

          {this.props.heating && heatingAux >= currentValue && (
            <Path
              stroke={'#D02B26'}
              strokeWidth={20}
              strokeLinejoin="round"
              strokeDasharray={
                this.props.selectedDevice.isFahrenheit
                  ? `${height * 0.01} ${height * 0.032}`
                  : `${height * 0.01} ${height * 0.063}`
              }
              fill="none"
              d={`M${startCoordHeating.x} ${
                startCoordHeating.y
              } A ${r} ${r} 0 ${this.defineSetpointLine(
                heatingAux,
                currentValue,
              )} 1 ${heatingSetpoint.x} ${heatingSetpoint.y}`}
            />
          )}
          {this.props.cooling && coolingAux <= currentValue && (
            <Path
              stroke={'#00629A'}
              strokeWidth={20}
              strokeLinejoin="bevel"
              strokeDasharray={
                this.props.selectedDevice.isFahrenheit
                  ? `${height * 0.01} ${height * 0.032}`
                  : `${height * 0.01} ${height * 0.063}`
              }
              fill="none"
              d={`M${startCoordCooling.x} ${
                startCoordCooling.y
              } A ${r} ${r} 0 ${this.defineSetpointLine(
                currentValue,
                coolingAux,
              )} 0 ${coolingSetpoint.x} ${coolingSetpoint.y}`}
            />
          )}

          <G
            x={
              (currentTemp &&
              this.props.selectedDevice.isFahrenheit !== undefined
                ? this.polarToCartesian(returnAuxValue(currentTemp))
                : 0
              ).x - 7.5
            }
            y={
              (currentTemp &&
              this.props.selectedDevice.isFahrenheit !== undefined
                ? this.polarToCartesian(returnAuxValue(currentTemp))
                : 0
              ).y - 7.5
            }>
            <Rect
              width={30}
              height={6}
              fill={'#494949'}
              strokeWidth="1"
              stroke="rgb(255,255,255)"
              rx={4}
              transform={`translate(-7.5,3) rotate(${
                currentValue - 90
              }, 15, 2.5)`}
            />
          </G>

          {this.props.heating != undefined && (
            <G x={heatingSetpoint.x - 7.5} y={heatingSetpoint.y - 7.5}>
              {this.props.heatSelected ||
                (this.props.holdingHeat && (
                  <Rect
                    width={35}
                    height={15}
                    fill={'#FFF'}
                    strokeWidth="1"
                    stroke="#D02B26"
                    rx={8}
                    transform={`translate(-10,-2.5) rotate(${
                      heatingAux - 90
                    }, 17.5, 7.5)`}
                    {...this._panResponderHeating.panHandlers}
                  />
                ))}

              <Rect
                width={30}
                height={10}
                fill={'#D02B26'}
                strokeWidth="1"
                stroke="rgb(255,255,255)"
                rx={5}
                transform={`translate(-7.5,0) rotate(${
                  heatingAux - 90
                }, 15, 5)`}
                {...this._panResponderHeating.panHandlers}
              />
            </G>
          )}

          {this.props.heating != undefined && (
            <G x={heatingSetpoint.x - 7.5} y={heatingSetpoint.y - 7.5}>
              {this.props.heatSelected && (
                <Rect
                  width={35}
                  height={15}
                  fill={'#FFF'}
                  strokeWidth="1"
                  stroke="#D02B26"
                  rx={8}
                  transform={`translate(-10,-2.5) rotate(${
                    heatingAux - 90
                  }, 17.5, 7.5)`}
                  {...this._panResponderAuxHeating.panHandlers}
                />
              )}

              <Rect
                width={30}
                height={10}
                fill={'#D02B26'}
                strokeWidth="1"
                stroke="rgb(255,255,255)"
                rx={5}
                transform={`translate(-7.5,0) rotate(${
                  heatingAux - 90
                }, 15, 5)`}
                {...this._panResponderAuxHeating.panHandlers}
              />
              <Rect
                width={50}
                height={20}
                rx={5}
                transform={`translate(-16, -5) rotate(${
                  heatingAux - 90
                }, 25, 10)`}
                {...this._panResponderAuxHeating.panHandlers}
              />
            </G>
          )}

          {this.props.cooling !== undefined && (
            <G x={endCoord1.x - 7.5} y={endCoord1.y - 7.5}>
              {this.props.coolSelected ||
                (this.props.holdingCool && (
                  <Rect
                    width={35}
                    height={15}
                    fill={'#FFF'}
                    strokeWidth="1"
                    stroke="#00629A"
                    rx={8}
                    transform={`translate(-10,-2.5) rotate(${
                      coolingAux - 90
                    }, 17.5, 7.5)`}
                    {...this._panResponderCooling.panHandlers}
                  />
                ))}

              <Rect
                width={30}
                height={10}
                fill={'#00629A'}
                rx={5}
                transform={`translate(-7.5,0) rotate(${
                  coolingAux - 90
                }, 15, 5)`}
                {...this._panResponderCooling.panHandlers}
              />
            </G>
          )}

          {this.props.cooling !== undefined && (
            <G x={endCoord1.x - 7.5} y={endCoord1.y - 7.5}>
              {this.props.coolSelected && (
                <Rect
                  width={35}
                  height={15}
                  fill={'#FFF'}
                  strokeWidth="1"
                  stroke="#00629A"
                  rx={8}
                  transform={`translate(-10, -2.5) rotate(${
                    coolingAux - 90
                  }, 17.5, 7.5)`}
                  {...this._panResponderAuxCooling.panHandlers}
                />
              )}

              <Rect
                width={30}
                height={10}
                fill={'#00629A'}
                rx={5}
                transform={`translate(-7.5,0) rotate(${
                  coolingAux - 90
                }, 15, 5)`}
                {...this._panResponderAuxCooling.panHandlers}
              />
              <Rect
                width={50}
                height={20}
                rx={5}
                transform={`translate(-16, -5) rotate(${
                  coolingAux - 90
                }, 25, 10)`}
                {...this._panResponderAuxCooling.panHandlers}
              />
            </G>
          )}
        </Svg>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedDevice: state.homeOwner.selectedDevice,
  };
};

export default connect(mapStateToProps, null)(CircularSlider);
