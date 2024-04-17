import 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import {fireEvent, render, screen} from '@testing-library/react-native';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import AddUnitSuccess from '../../../src/pages/AddUnit/AddUnitSuccess';
import {Enum} from '../../../src/utils/enum';
import {Dictionary} from '../../../src/utils/dictionary';

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
    selectedUnit: {
      odu: {
        modelNumber: '123',
      },
    },
    powerUpOduHideStatus: true,
    mountAntennaHideStatus: true,
  },
});

const ReplaceUnitSuccessProps = {
  navigation: {
    state: {routeName: 'ReplaceUnitSuccess'},
    navigate: jest.fn(),
    goBack: jest.fn(),
  },
};

const InstallationProps = {
  navigation: {
    state: {routeName: 'Installation'},
    navigate: jest.fn(),
    replace: jest.fn(),
  },
};

let component;

describe('AddUnitSuccess screen with route ReplaceUnitSuccess', () => {
  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <AddUnitSuccess {...ReplaceUnitSuccessProps} />
      </Provider>,
    );
  });

  it('Render AddUnitSuccess screen', () => {
    expect(component).toBeDefined();
  });

  it('Unit Dashboard button click', () => {
    const unitDashboardButton = screen.getByText(
      Dictionary.common.unitDashboard,
    );
    fireEvent.press(unitDashboardButton);
    expect(ReplaceUnitSuccessProps.navigation.goBack).toBeCalled();
  });

  it('Home button click', () => {
    const homeButton = screen.getByText(Dictionary.common.home);
    fireEvent.press(homeButton);
    expect(ReplaceUnitSuccessProps.navigation.navigate).toBeCalledWith(
      'ContractorHome',
      {
        tab: 'list',
      },
    );
  });
});

describe('AddUnitSuccess screen with route Installation', () => {
  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <AddUnitSuccess {...InstallationProps} />
      </Provider>,
    );
  });

  it('Render AddUnitSuccess screen', () => {
    expect(component).toBeDefined();
  });

  it('Unit Dashboard button click', () => {
    const unitDashboardButton = screen.getByText(
      Dictionary.common.unitDashboard,
    );
    fireEvent.press(unitDashboardButton);
    expect(InstallationProps.navigation.replace).toBeCalledWith('Installation');
  });
});