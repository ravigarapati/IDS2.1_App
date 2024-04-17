import 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import {fireEvent, render, screen, waitFor} from '@testing-library/react-native';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MountAntenna from '../../../src/pages/AddUnit/MountAntenna';
import {Enum} from '../../../src/utils/enum';
import {Mock} from '../../../src/utils/Mock';
import {Dictionary} from '../../../src/utils/dictionary';

/* This Unit test case covers the Mount Antenna screen in the Add new unit section */
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

jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    getItem: jest
      .fn()
      .mockResolvedValueOnce('hide')
      .mockResolvedValueOnce('show'),
  };
});

let component;

describe('MountAntenna screen', () => {
  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <MountAntenna {...props} />
      </Provider>,
    );
  });

  it('Render MountAntenna screen', () => {
    expect(component).toBeDefined();
  });

  it('Next button click to navigate to AddODU screen', async () => {
    const nextButton = screen.getByText(Dictionary.button.next);
    fireEvent.press(nextButton);
    await waitFor(() =>
      expect(props.navigation.navigate).toBeCalledWith('AddODU'),
    );
  });

  it('Next button click to navigate to PowerUpODU screen', async () => {
    const nextButton = screen.getByText(Dictionary.button.next);
    fireEvent.press(nextButton);
    await waitFor(() =>
      expect(props.navigation.navigate).toBeCalledWith('PowerUpODU'),
    );
  });

  it('doNotShowAgain Check Box click', () => {
    const doNotShowAgainButton = screen.getByText(
      Dictionary.addUnit.doNotShowAgain,
    );
    fireEvent.press(doNotShowAgainButton);
    expect(doNotShowAgainButton).toBeDefined();
  });
});