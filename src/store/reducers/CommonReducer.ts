import {SHOW_LOADING} from '../labels/AuthLabels';

const initialState = {
  showLoading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_LOADING:
      return {
        ...state,
        showLoading: action.data,
      };
    default:
      return state;
  }
};
