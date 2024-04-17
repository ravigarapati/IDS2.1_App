import 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import {render} from 'react-native-testing-library';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Help from '../../src/pages/Help';
import {Enum} from '../../src/utils/enum';

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
    faqList: {
      data: [{answerList: ''}],
    },
  },
});

const navigation = {
  addListener: jest.fn(),
};

let component;

describe('Help screen', () => {
  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <Help navigation={navigation} />
      </Provider>,
    );
  });

  it('Render Help screen', () => {
    expect(component).toBeDefined();
  });
});
