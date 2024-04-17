import 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import {fireEvent, render, screen} from '@testing-library/react-native';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import AddGateway from '../../../src/pages/AddUnit/AddGateway';
import {Enum} from '../../../src/utils/enum';
import {Mock} from '../../../src/utils/Mock';
import {Dictionary} from '../../../src/utils/dictionary';

/* This test case covers the Add Gateway screen in the Add Unit section */

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

describe('AddGateway screen', () => {
  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <AddGateway {...props} />
      </Provider>,
    );
  });

  it('Render AddGateway screen', () => {
    expect(component).toBeDefined();
  });

  it('bluetoothId change event', () => {
    const bluetoothIdInput = screen.getByPlaceholderText(
      Dictionary.addUnit.bluetoothId,
    );
    fireEvent.changeText(bluetoothIdInput, 'BOSCH_HP_A1B2C3');
    expect(bluetoothIdInput.props.value).toBe('BOSCH_HP_A1B2C3');
  });

  it('bluetoothId change event with invalid value', () => {
    const bluetoothIdInput = screen.getByPlaceholderText(
      Dictionary.addUnit.bluetoothId,
    );
    fireEvent.changeText(bluetoothIdInput, 'inavlid_bluetooth_id');
    expect(Dictionary.error.bluetoothIdError).toBeDefined();
  });

  it('bluetoothPassword change event', () => {
    const bluetoothPasswordInput = screen.getByPlaceholderText(
      Dictionary.addUnit.bluetoothPassword,
    );
    fireEvent.changeText(bluetoothPasswordInput, '123456');
    expect(bluetoothPasswordInput.props.value).toBe('123456');
  });

  it('bluetoothPassword change event with invalid value', () => {
    const bluetoothPasswordInput = screen.getByPlaceholderText(
      Dictionary.addUnit.bluetoothPassword,
    );
    fireEvent.changeText(bluetoothPasswordInput, 'invalidbluetoothPassword');
    expect(Dictionary.error.patternError).toBeDefined();
  });

  it('gatewayId change event', () => {
    const gatewayIdInput = screen.getByPlaceholderText(
      Dictionary.addUnit.gatewayId,
    );
    fireEvent.changeText(gatewayIdInput, '399A-123-123456-1234567890');
    expect(gatewayIdInput.props.value).toBe('399A-123-123456-1234567890');
  });

  it('gatewayId change event with invalid value', () => {
    const gatewayIdInput = screen.getByPlaceholderText(
      Dictionary.addUnit.gatewayId,
    );
    fireEvent.changeText(gatewayIdInput, 'invalid_gateway_id');
    expect(Dictionary.error.serialNumberError).toBeDefined();
  });

  it('submit button click', () => {
    const bluetoothIdInput = screen.getByPlaceholderText(
      Dictionary.addUnit.bluetoothId,
    );
    fireEvent.changeText(bluetoothIdInput, 'BOSCH_HP_A1B2C3');

    const bluetoothPasswordInput = screen.getByPlaceholderText(
      Dictionary.addUnit.bluetoothPassword,
    );
    fireEvent.changeText(bluetoothPasswordInput, '123456');

    const gatewayIdInput = screen.getByPlaceholderText(
      Dictionary.addUnit.gatewayId,
    );
    fireEvent.changeText(gatewayIdInput, '399A-123-123456-1234567890');

    const submitButton = screen.getByText(Dictionary.button.submit);
    fireEvent.press(submitButton);
  });
});

describe('Scanner test suite', () => {
  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <AddGateway {...props} />
      </Provider>,
    );
  });

  it('scanQrcode button click', () => {
    const scanQrcodeButton = screen.getByText(Dictionary.button.scanQrcode);
    fireEvent.press(scanQrcodeButton);
  });
});
