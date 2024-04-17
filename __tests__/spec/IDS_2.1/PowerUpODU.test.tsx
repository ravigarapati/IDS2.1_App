import 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import {fireEvent, render, screen, userEvent} from '@testing-library/react-native';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {Enum} from '../../../src/utils/enum';
import {Mock} from '../../../src/utils/Mock';
import {Dictionary} from '../../../src/utils/dictionary';
import {Linking} from 'react-native';
import {CheckBox} from '../../../src/components';

/* This Unit test case covers the Power Up outdoor unit screen in the Add new unit section */
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
  notification: {
    demoStatus: false,
  },
  contractor: {
    unitsList: Mock.deviceList,
    selectedUnit: {
      odu: {
        modelNumber: '123',
      },
    },
    mapMarkersList: '',
    adminUserAnalytics: '',
    contractorDetails: {
      isAdminRemoved: true,
      isAdmin: true,
      isTermsConditionsAccepted: false,
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

const props = {
  navigation: {
    state: {params: {tab: 'map'}},
    getParam: param => {
      if (param === 'tab') {
        return 'list';
      }
    },
    navigate: jest.fn(),
  },
};

let component;

describe('PowerUpODU screen', () => {
  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <PowerUpODU {...props} />
      </Provider>,
    );
  });

  it('Render PowerUpODU screen', () => {
    expect(component).toBeDefined();
  });

  it('Next button click', () => {
    const nextButton = screen.getByText(Dictionary.button.next);
    fireEvent.press(nextButton);
    expect(props.navigation.navigate).toBeCalled();
  });

  it('doNotShowAgain Check Box click', () => {
    const doNotShowAgainButton = screen.getByText(
      Dictionary.addUnit.doNotShowAgain,
    );
    fireEvent(doNotShowAgainButton, 'change', true);
    expect(doNotShowAgainButton).toBeDefined();
  });

  it('installationManual manual link click', () => {
    const installationManual = screen.getByText(
      Dictionary.addUnit.installationManual,
    );
    fireEvent(installationManual, 'click');
    expect(Linking.openURL).toBeCalled();
  });
});