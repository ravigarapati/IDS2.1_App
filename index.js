/**
 * @format
 */

import {AppRegistry, Text, TextInput, View} from 'react-native';
import {CustomText, Tile} from './src/components';
import HomeOwnerLanding from './src/pages/HomeOwnerLanding';
import App from './App';
import {name as appName} from './app.json';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import 'react-native-get-random-values';

Text.defaultProps = {
  ...(Text.defaultProps || {}),
  allowFontScaling: false,
};
TextInput.defaultProps = {
  ...(TextInput.defaultProps || {}),
  allowFontScaling: false,
};

CustomText.defaultProps = {};
CustomText.defaultProps.allowFontScaling = false;

Tile.defaultProps = {};
Tile.defaultProps.allowFontScaling = false;

View.defaultProps = {};
View.defaultProps.allowFontScaling = false;

Tile.defaultProps = {};
Tile.defaultProps.allowFontScaling = false;

HomeOwnerLanding.defaultProps = {};
HomeOwnerLanding.defaultProps.allowFontScaling = false;

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
