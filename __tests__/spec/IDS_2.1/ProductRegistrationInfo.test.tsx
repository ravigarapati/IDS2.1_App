import 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import {fireEvent, render, screen} from '@testing-library/react-native';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ProductRegistrationInfo from '../../../src/pages/ProductRegistrationInfo';
import {Enum} from '../../../src/utils/enum';
import {Dictionary} from '../../../src/utils/dictionary';
import {Linking} from 'react-native';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);
const storeValue = {
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
    currentStep: 0,
    contractorDetails: {
      contractorId: '1',
    },
    prProductInfo: {
      serialNumber: '',
      modelNumber: '',
      productDescription: '',
      installationDate: null,
      applicationType: 1,
    },
    ppAccountCreated: true,
    ppAccountCompleted: true,
    selectedUnit: {
      odu: {
        modelNumber: '123',
      },
    },
    prPopups: {
      showRegisteredPopup: false,
    },
    prTokenDetails: {
      prToken: '123',
    },
  },
  notification: {
    demoStatus: '',
  },
};
const store = mockStore(storeValue);

const storeStep2 = mockStore({
  ...storeValue,
  contractor: {...storeValue.contractor, currentStep: 1},
});

const storeAccountNotCreated = mockStore({
  ...storeValue,
  contractor: {
    ...storeValue.contractor,
    ppAccountCreated: false,
    ppAccountCompleted: false,
  },
});

const storeAccountNotCompleted = mockStore({
  ...storeValue,
  contractor: {
    ...storeValue.contractor,
    ppAccountCreated: true,
    ppAccountCompleted: false,
  },
});

const props = {
  navigation: {
    state: {routeName: 'ReplaceUnitSuccess'},
    navigate: jest.fn(),
    goBack: jest.fn(),
    openDrawer: jest.fn(),
  },
};

let component;

describe('ProductRegistrationInfo screen', () => {
  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <ProductRegistrationInfo {...props} />
      </Provider>,
    );
  });

  it('Render ProductRegistrationInfo screen', () => {
    expect(component).toBeDefined();
  });

  it('Move next from step 1', () => {
    const step1Button = screen.getByTestId('step-1');
    fireEvent(step1Button, 'press');
    expect(props.navigation.openDrawer).toBeCalled();
  });
});

describe('ProductRegistrationInfo screen Step 1', () => {
  beforeEach(() => {
    component = render(
      <Provider store={storeStep2}>
        <ProductRegistrationInfo {...props} />
      </Provider>,
    );
  });

  it('Render ProductRegistrationInfo screen', () => {
    expect(component).toBeDefined();
  });

  it('Move next from step 1', () => {
    const step1Button = screen.getByTestId('step-2');
    fireEvent(step1Button, 'press');
    expect(props.navigation.openDrawer).toBeCalled();
  });
});

describe('ProductRegistrationInfo screen - Show Signup', () => {
  beforeEach(() => {
    component = render(
      <Provider store={storeAccountNotCreated}>
        <ProductRegistrationInfo {...props} />
      </Provider>,
    );
  });

  it('Render ProductRegistrationInfo screen', () => {
    expect(component).toBeDefined();
  });

  it('privacyPolicyLink link click', () => {
    const privacyPolicyLink = screen.getByText(
      Dictionary.productRegistration.pPAccountNeededButton,
    );
    fireEvent(privacyPolicyLink, 'press');
    expect(Linking.openURL).toBeCalledWith(
      'https://bosch-us-home.thernovo-dev.com/profile',
    );
  });

  it('Cancel button click', () => {
    const cancelButton = screen.getByText(Dictionary.button.cancel);
    fireEvent(cancelButton, 'press');
    expect(props.navigation.navigate).toBeCalledWith('Home');
  });
});

describe('ProductRegistrationInfo screen - Show Signup Incomplete', () => {
  beforeEach(() => {
    component = render(
      <Provider store={storeAccountNotCompleted}>
        <ProductRegistrationInfo {...props} />
      </Provider>,
    );
  });

  it('Render ProductRegistrationInfo screen', () => {
    expect(component).toBeDefined();
  });

  it('privacyPolicyLink link click', () => {
    const privacyPolicyLink = screen.getByText(
      Dictionary.productRegistration.pPIncompleteAccountButton,
    );
    fireEvent(privacyPolicyLink, 'press');
    expect(Linking.openURL).toBeCalledWith(
      'https://bosch-us-home.thernovo-dev.com/profile',
    );
  });

  it('Cancel button click', () => {
    const cancelButton = screen.getByText(Dictionary.button.cancel);
    fireEvent(cancelButton, 'press');
    expect(props.navigation.navigate).toBeCalledWith('Home');
  });
});