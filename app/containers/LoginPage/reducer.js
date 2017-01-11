import { fromJS } from 'immutable';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
} from './constants';

const initialState = fromJS({
  loading: false,
  error: null,
});

function loginPageReducer(state = initialState, action) {
  const { error } = action;
  switch (action.type) {
    case LOGIN_REQUEST:
      return state
        .set('loading', true)
        .set('error', null);
    case LOGIN_SUCCESS:
      return state
        .set('loading', false);
    case LOGIN_FAILURE:
      return state
        .set('loading', false)
        .set('error', error);
    default:
      return state;
  }
}

export default loginPageReducer;
