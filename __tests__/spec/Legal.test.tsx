import 'react-native';
import React, { useState as useStateMock } from 'react';
import renderer from 'react-test-renderer';
import UnitConfiguration from '../../src/pages/Legal';
import { Provider } from 'react-redux';
import { render, cleanup, fireEvent, act } from 'react-native-testing-library';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import Legal from '../../src/pages/Legal';
import { Enum } from '../../src/utils/enum';


const middlewares = [thunk]

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
  contractor: {
    adminUserAnalytics: '',
  },
});
const fakeNavigation = {
  navigate: jest.fn(),
};

let component;

describe('Legal screen', () => {

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <Legal />
      </Provider>
    )
  })

  it('Render Legal screen', () => {
    expect(component).toBeDefined();
  });


});
