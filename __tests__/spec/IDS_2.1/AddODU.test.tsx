import 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import {fireEvent, render, screen} from '@testing-library/react-native';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import AddODU from '../../../src/pages/AddUnit/AddODU';
import {Enum} from '../../../src/utils/enum';
import {Mock} from '../../../src/utils/Mock';
import {Dictionary} from '../../../src/utils/dictionary';

/* This Unit test case covers the Add outdoor unit screen in the Add new unit section */

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

describe('AddODU screen', () => {
  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <AddODU {...props} />
      </Provider>,
    );
  });

  it('Render AddODU screen', () => {
    expect(component).toBeDefined();
  });

  it('OduInputText change event', () => {
    const OduInputTextInput = screen.getByPlaceholderText(
      Dictionary.addUnit.oduInputText,
    );
    fireEvent.changeText(OduInputTextInput, 'hey');
    expect(OduInputTextInput.props.value).toBe('hey');
  });

  it('ScanBarcode button click', () => {
    const scanBarcodeButton = screen.getByText(Dictionary.button.scanBarcode);
    fireEvent.press(scanBarcodeButton);
  });
});
