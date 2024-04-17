import 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import {fireEvent, render, screen} from '@testing-library/react-native';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ContractorHome from '../../../src/pages/ContractorHome';
import {Enum} from '../../../src/utils/enum';
import {Mock} from '../../../src/utils/Mock';
import {Dictionary} from '../../../src/utils/dictionary';

/* This test case covers the Contractor landing page scenarios */

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

describe('ContractorHome screen', () => {
  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <ContractorHome {...props} />
      </Provider>,
    );
  });

  it('Render ContractorHome screen', () => {
    expect(component).toBeDefined();
  });

  it('Event tab click', () => {
    const mapTab = screen.getByTestId('list');
    fireEvent(mapTab, 'press');
  });

  it('Filter button click', () => {
    const filterButton = screen.getByTestId('Filter');
    fireEvent(filterButton, 'press');
  });

  it('Add new unit button click', () => {
    const addNewUnitButton = screen.getAllByText(Dictionary.button.addNewUnit);
    fireEvent(addNewUnitButton[1], 'press');
  });

  // it('Submit button click', () => {
  //   const submitButton = screen.getAllByText(Dictionary.button.submit);
  //   fireEvent(submitButton[1], 'press');
  // });
});
