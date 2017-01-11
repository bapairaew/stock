import { fromJS } from 'immutable';
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
} from './constants';

const initialState = fromJS({
  loading: false,
  error: null,
  success: false,
});

function loginPageReducer(state = initialState, action) {
  const { error } = action;
  switch (action.type) {
    case REGISTER_REQUEST:
      return state
        .set('loading', true)
        .set('error', null)
        .set('success', false);
    case REGISTER_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true);
    case REGISTER_FAILURE:
      return state
        .set('loading', false)
        .set('error', error);
    default:
      return state;
  }
}

export default loginPageReducer;
