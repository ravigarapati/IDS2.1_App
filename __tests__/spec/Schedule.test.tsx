import 'react-native';
import React, { useState as useStateMock } from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render, cleanup, fireEvent, act } from 'react-native-testing-library';
import thunk from 'redux-thunk'
import Schedule from '../../src/pages/UnitConfiguration/Schedule';

const middlewares = [thunk]

const mockStore = configureMockStore(middlewares);
const store = mockStore({
  homeOwner: {
    dateBCC50: 'August 29 2023',
    timeBCC50: '10:36 PM',
    schedulesOnBoarding:[],
    infoUnitConfiguration:{
        type: 0,
        fossilFuel: 0,
        hpEnergized: 0,
        hpEmHeat: 0,
        dualFBSetpoint: 400,
        dualFCOvertime: 45,
        heatStages: 1,
        coolStages: 1,
        humidityConf: 1,
        humidType: 0,
        dehumidType: 0,
        hours1224: 0,
        dateTime: {
          anio: 0,
          month: 0,
          day: 0,
          hour: 0,
          minute: 0,
          second: 0,
        },
        schedule: 2,
    }
  },
});
const fakeNavigation = {
  navigate: jest.fn(),
};

let component;

describe('Schedule screen', () => {

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <Schedule navigation={fakeNavigation} />
      </Provider>
    )
  })

  it('Render Schedule screen', () => {
    expect(component).toBeDefined();
  });

});
