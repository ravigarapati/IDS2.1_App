import 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import {fireEvent, render, screen} from '@testing-library/react-native';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Help from '../../../src/pages/Help';
import {Enum} from '../../../src/utils/enum';
import {Linking} from 'react-native';
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
      },
    },
  },
  contractor: {
    faqList: {
      data: [
        {
          answerList: [
            {
              answer: 'First Answer',
              id: 11,
              image:
                'https://kl01zk6g58.execute-api.us-east-1.amazonaws.com/development/ids-helper/help/2x/Help-1-1_2x.png',
            },
            {
              answer: 'Second Answer',
              id: 12,
              image:
                'https://kl01zk6g58.execute-api.us-east-1.amazonaws.com/development/ids-helper/help/2x/Help-1-2_2x.png',
            },
          ],
          question:
            'How can I learn more about information displayed on various screens of the app?',
        },
        {
          answerList: [
            {
              answer:
                'Click on the <bosch-ic-info-i> to learn more about the information displayed on the screen.',
              id: 11,
              image:
                'https://kl01zk6g58.execute-api.us-east-1.amazonaws.com/development/ids-helper/help/2x/Help-1-1_2x.png',
            },
            {
              answer:
                'Upon interacting with the icon, a pop up with additional information would appear. You can close the pop up by pressing the ‘x’ icon.',
              id: 12,
              image:
                'https://kl01zk6g58.execute-api.us-east-1.amazonaws.com/development/ids-helper/help/2x/Help-1-2_2x.png',
            },
          ],
          question: 'How do I add a unit that I’ve installed ?',
        },
      ],
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

  it('websiteLink click', () => {
    const websiteLink = screen.getByText(' website ');
    fireEvent(websiteLink, 'press');
    expect(Linking.openURL).toBeCalledWith(Dictionary.help.websiteLink);
  });

  it('phoneLink click', () => {
    const phoneLink = screen.getByText(Dictionary.help.phone);
    fireEvent(phoneLink, 'press');
    expect(Linking.openURL).toBeCalledWith('tel:' + Dictionary.help.phone);
  });

  it('emailLink click', () => {
    const emailLink = screen.getByText(Dictionary.help.email);
    fireEvent(emailLink, 'press');
    expect(Linking.openURL).toBeCalledWith('mailto:' + Dictionary.help.email);
  });

  it('question answer click', async () => {
    const questionButton = screen.getByTestId(
      'How can I learn more about information displayed on various screens of the app?',
    );
    fireEvent(questionButton, 'press');
    expect(screen.getByText('First Answer')).toBeDefined();

    const rightArrow = screen.getByTestId('rightArrow');

    fireEvent(rightArrow, 'press');
    expect(screen.getByText('Second Answer')).toBeDefined();

    const leftArrow = screen.getByTestId('leftArrow');

    fireEvent(leftArrow, 'press');
    expect(screen.getByText('First Answer')).toBeDefined();
  });
});