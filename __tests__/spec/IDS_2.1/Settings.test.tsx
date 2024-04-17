import 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react-native';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Settings from '../../../src/pages/Settings';
import {Enum} from '../../../src/utils/enum';

/* This Unit test case covers the Settings screen in the main menu */
const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);
const store = mockStore({
  homeOwner: {
    hoUserAnalytics: '',
  },
  auth: {
    user: {
      attributes: {
        'custom:role': Enum.roles.homeowner,
      },
    },
  },
  notification: {
    demoStatus: 'Pending',
  },
});

const navigation = {
  addListener: jest.fn(),
};

jest.mock('react-native/Libraries/AppState/AppState', () => {
  return {
    addEventListener: jest.fn(),
  };
});

let component;

describe('Settings screen', () => {
  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <Settings navigation={navigation} />
      </Provider>,
    );
  });

  it('Render Settings screen', () => {
    expect(component).toBeDefined();
  });
});
