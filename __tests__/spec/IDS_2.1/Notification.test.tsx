import 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import { fireEvent, render, screen,waitFor } from '@testing-library/react-native';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Notification from '../../../src/pages/Notification';
import {Enum} from '../../../src/utils/enum';
import {Mock} from '../../../src/utils/Mock';
import {Dictionary} from '../../../src/utils/dictionary';

/* This test case covers the Notification screen landing page */

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
  notification: {
    demoStatus: '',
    active: Mock.notifications,
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

const navigation = {
  addListener: jest.fn(),
  state: {
    params: {
      isSearch: false,
    },
  },
};

jest.mock('react-native/Libraries/AppState/AppState', () => {
  return {
    addEventListener: jest.fn(),
  };
});

let component;

describe('Notification screen', () => {
  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <Notification navigation={navigation} />
      </Provider>,
    );
  });

  it('Render Notification screen', () => {
    expect(component).toBeDefined();
  });

  it('tab click', () => {
    const tab = screen.getByTestId('1');
    fireEvent(tab, 'press');
    expect(screen.getByText(Dictionary.notification.archive)).toBeDefined();
  });

  it('show filter click', () => {
    const searchInput = screen.getByPlaceholderText(
      Dictionary.notification.search,
    );
    fireEvent.changeText(searchInput, 'test');
    expect(searchInput.props.value).toBe('test');

    const showFilter = screen.getByTestId('showFilter');
    fireEvent(showFilter, 'press');

    const filterType = screen.getByTestId('remoteAccess');
    fireEvent(filterType, 'press');
  });
});