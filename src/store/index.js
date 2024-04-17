import {createStore, combineReducers, applyMiddleware} from 'redux';
import AuthReducer from './reducers/AuthReducer';
import HomeOwnerReducer from './reducers/HomeOwnerReducer';
import ContractorReducer from './reducers/ContractorReducer';
import CommonReducer from './reducers/CommonReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
import NotificationReducer from './reducers/NotificationReducer';
import {LOGOUT} from './labels/AuthLabels';

const appReducer = combineReducers({
  auth: AuthReducer,
  homeOwner: HomeOwnerReducer,
  contractor: ContractorReducer,
  common: CommonReducer,
  notification: NotificationReducer,
});

const initialState = appReducer({}, {});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    state = initialState;
  }

  return appReducer(state, action);
};

const persistConfig = {
  key: 'root',
  // Storage Method (React Native)
  storage: AsyncStorage,
  // Blacklist (Don't Save Specific Reducers)
  blacklist: ['auth', 'contractor', 'common', 'homeOwner', 'notification'],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);
// Exports
export {store, persistor};
