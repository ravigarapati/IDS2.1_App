import 'react-native';
import React, { useState as useStateMock } from 'react';
import renderer from 'react-test-renderer';
import UnitConfiguration from '../../src/pages/UnitConfiguration/UnitConfiguration';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render, cleanup, fireEvent, act } from 'react-native-testing-library';
import thunk from 'redux-thunk'
import FossilFuel1 from '../../src/pages/UnitConfiguration/FossilFuel1';

const middlewares = [thunk]

const mockStore = configureMockStore(middlewares);
const store = mockStore({
  homeOwner: {
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

describe('FossilFuel1 screen', () => {

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <FossilFuel1 navigation={fakeNavigation} />
      </Provider>
    )
  })

  it('Render FossilFuel1 screen', () => {
    expect(component).toBeDefined();
  });
  
});
