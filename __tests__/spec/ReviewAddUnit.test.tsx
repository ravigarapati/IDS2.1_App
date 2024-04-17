import 'react-native';
import React, { useState as useStateMock } from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render, cleanup, fireEvent, act } from 'react-native-testing-library';
import thunk from 'redux-thunk'
import ReviewAddUnit from '../../src/pages/UnitConfiguration/ReviewAddUnit';

const middlewares = [thunk]

const mockStore = configureMockStore(middlewares);
const store = mockStore({
    auth: {
        user: {
            attributes: {
                sub: 'be05cff1-4f2f-47a1-a194-31396d7ff19c'
            }
        }
    },
    homeOwner: {
        selectedSchedule:'2',
        dateBCC50: 'August 29 2023',
        timeBCC50: '10:36 PM',
        schedulesOnBoarding: [{
            model_id:'1',
            mode: '3',
            state:'0',
            limit: '71-82',
            unit: 'F',
            name: 'Home',
            data: {
              items1: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items2: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items3: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items4: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items5: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items6: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items7: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
            },
          },
          {
            model_id:'2',
            mode: '3',
            state:'0',
            limit: '71-82',
            unit: 'F',
            name: 'Vacation',
            data: {
              items1: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items2: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items3: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items4: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items5: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items6: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items7: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
            },
          }],
        infoUnitConfiguration: {
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
            schedule: 1,
        }
    },
});

const storeNoSchedule = mockStore({
    auth: {
        user: {
            attributes: {
                sub: 'be05cff1-4f2f-47a1-a194-31396d7ff19c'
            }
        }
    },
    homeOwner: {
        selectedSchedule:'0',
        dateBCC50: 'August 29 2023',
        timeBCC50: '10:36 PM',
        schedulesOnBoarding: [{
            model_id:'1',
            mode: '3',
            state:'0',
            limit: '71-82',
            unit: 'F',
            name: 'Home',
            data: {
              items1: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items2: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items3: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items4: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items5: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items6: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items7: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
            },
          },
          {
            model_id:'2',
            mode: '3',
            state:'0',
            limit: '71-82',
            unit: 'F',
            name: 'Vacation',
            data: {
              items1: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items2: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items3: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items4: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items5: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items6: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
              items7: [{ t: '78.0-70.0', h: '0' },{ t: '78.0-70.0', h: '0' }],
            },
          }],
        infoUnitConfiguration: {
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

describe('ReviewAddUnit screen', () => {

    it('Render ReviewAddUnit screen', () => {
        component = render(
            <Provider store={store}>
                <ReviewAddUnit navigation={fakeNavigation} />
            </Provider>
        )
        expect(component).toBeDefined();
    });

    it('Press complete button Vacation Schedule', () => {
        component = render(
            <Provider store={store}>
                <ReviewAddUnit navigation={fakeNavigation} />
            </Provider>
        )
        const button = component.getByTestId("completeButton")
        fireEvent(button, 'press')
        expect(store.getState().homeOwner.infoUnitConfiguration).toStrictEqual({
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
            schedule: 1,
        })
    });

    it('Press complete button No Schedule', () => {
        component = render(
            <Provider store={storeNoSchedule}>
                <ReviewAddUnit navigation={fakeNavigation} />
            </Provider>
        )
        const button = component.getByTestId("completeButton")
        fireEvent(button, 'press')
        expect(storeNoSchedule.getState().homeOwner.infoUnitConfiguration).toStrictEqual({
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
        })
    });

});
