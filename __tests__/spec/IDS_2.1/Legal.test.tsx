import 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import {render, fireEvent, screen} from '@testing-library/react-native';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Legal from '../../../src/pages/Legal';
import {Enum} from '../../../src/utils/enum';
import {Dictionary} from '../../../src/utils/dictionary';
import {Linking} from 'react-native';

/* This Unit test case covers the Legal screen in main menu */
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
  contractor: {
    adminUserAnalytics: '',
  },
});

let component;

describe('Legal screen', () => {
  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <Legal />
      </Provider>,
    );
  });

  it('Render Legal screen', () => {
    expect(component).toBeDefined();
  });

  it('termsAndConditionLink link click', () => {
    const termsAndConditionLink = screen.getByText(
      Dictionary.legal.termsAndConditionLink,
    );
    fireEvent(termsAndConditionLink, 'press');
    expect(Linking.openURL).toBeCalledWith(
      'https://issuu.com/boschthermotechnology/docs/ids_2.1_terms_of_conditions?fr=sZWY1YTM0ODk1MzU',
    );
  });

  it('privacyPolicyLink link click', () => {
    const privacyPolicyLink = screen.getByText(
      Dictionary.legal.privacyPolicyLink,
    );
    fireEvent(privacyPolicyLink, 'press');
    expect(Linking.openURL).toBeCalledWith(
      'https://issuu.com/boschthermotechnology/docs/ids_2.1_privacy_policy?fr=sNzI2MjM0ODk1MzU',
    );
  });

  it('ossAttributes link click', () => {
    const ossAttributes = screen.getByText(Dictionary.legal.ossAttributes);
    fireEvent(ossAttributes, 'press');
    expect(Linking.openURL).toBeCalledWith(
      'https://issuu.com/boschthermotechnology/docs/ids_2.1_oss_attribution?fr=sN2U2YTM0ODk1MzU',
    );
  });
});