import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {authStack} from './AuthNavigator';
import {homeOwnerDrawerNavigator} from './HomeOwnerNavigator';
import {
  contractorDrawerNavigator,
  powerUserDrawerNavigator,
  contractorDemoModeDrawerNavigator
} from './ContractorNavigator';

const switchNav = createSwitchNavigator({
  Auth: authStack,
  HomeOwner: homeOwnerDrawerNavigator,
  Contractor: {screen: contractorDrawerNavigator},
  ContractorPowerUser: {screen: powerUserDrawerNavigator},
  ContractorDemoMode: {screen: contractorDemoModeDrawerNavigator}
});

const App = createAppContainer(switchNav);

export default App;
