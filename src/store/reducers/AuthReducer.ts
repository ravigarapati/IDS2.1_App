import {
  CURRENT_USER,
  CURRENT_STEP,
  UPDATE_CURRENT_USER,
  LOGOUT,
  TERMS_AND_CONDITIONS,
  LATEST_VERSION,
  SET_STEP_TITLES,
  SET_USER_ROLE,
  SET_SHOW_ROLE,
  SET_USER_ADDRESS,
  RESET_USER,
  SET_USER_NAME,
} from '../labels/AuthLabels';

const initialState = {
  user: {},
  currentStep: 0,
  currentUser: {},
  currentAddress: {
    companyName: '',
    country: 'US',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipcode: '',
    phoneNumber: '',   
    verificationCode: '',
  },
  termsandconditions: {},
  latestVersion: {},
  stepTitles: {},
  currentRole: '',
  showRole: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_USER:
      return {
        ...state,
        user: action.user,
      };
    case CURRENT_STEP:
      return {
        ...state,
        currentStep: action.data,
      };
    case UPDATE_CURRENT_USER: {
      let stateObj = Object.assign(state.currentUser);
      let newstateObj = {...stateObj, ...action.data};
      return {
        ...state,
        currentUser: newstateObj,
      };
    }
    case LOGOUT: {
      return initialState;
    }
    case TERMS_AND_CONDITIONS: {
      return {
        ...state,
        termsandconditions: action.data,
      };
    }
    case LATEST_VERSION: {
      return {
        ...state,
        latestVersion: action.data,
      };
    }
    case SET_STEP_TITLES: {
      return{
        ...state,
        stepTitles: action.data,
      };
    }
    case SET_USER_ROLE: {
      return{
        ...state,
        currentRole: action.data,
      };
    }
    case SET_SHOW_ROLE: {
      return{
        ...state,
        showRole: action.data,
      };
    }
    case SET_USER_NAME: {
      return{
        ...state,
        currentUser: {
          ...state.currentUser,
          firstName: action.data.firstName,
          lastName: action.data.lastName,
        }
      };
    }
    case SET_USER_ADDRESS: {
      return{
        ...state,
        currentAddress: action.data
      };
    }
    case RESET_USER: {
      return{
        ...state,
        currentUser: {},
        currentAddress: {
          companyName: '',
          country: 'US',
          address1: '',
          address2: '',
          city: '',
          state: '',
          zipcode: '',
          phoneNumber: '',   
          verificationCode: '',
        },
      };
    }
    default:
      return state;
  }
};
