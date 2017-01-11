import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
} from './constants';

export function register(username, password) {
  return {
    type: REGISTER_REQUEST,
    username,
    password,
  };
}

export function registerSuccess() {
  return {
    type: REGISTER_SUCCESS,
  };
}

export function registerFailure(error) {
  return {
    type: REGISTER_FAILURE,
    error,
  };
}
