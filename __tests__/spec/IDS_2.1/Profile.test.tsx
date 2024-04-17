import 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react-native';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Profile from '../../../src/pages/Profile';
import {Enum} from '../../../src/utils/enum';

/* This Unit test case covers the Profile screen in main menu*/
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
        phone_number: '1234567890',
      },
    },
  },
  contractor: {
    adminUserAnalytics: '',
    contractorDetails: {
      company: {
        address: '',
        companyName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipCode: '',
        companyPhoneNumber: '',
        adminName: '',
      },
    },
  },
});
const fakeNavigation = {
  navigate: jest.fn(),
};

let component;

jest.mock('react-native-secure-storage', () => {
  return {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve('{ "foo": 1 }')),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  };
});

describe('Profile screen', () => {
  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <Profile />
      </Provider>,
    );
  });

  it('Render Profile screen', () => {
    expect(component).toBeDefined();
  });
});
