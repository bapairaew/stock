import { takeLatest } from 'redux-saga';
import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { REGISTER_REQUEST } from './constants';
import { LOCATION_CHANGE } from 'react-router-redux';
import { registerSuccess, registerFailure } from './actions';
import request from 'utils/request';

// Fetch
export function* register(action) {
  const requestURL = '/api/v0/users/register';

  try {
    const { username, password } = action;
    yield call(request, requestURL,  {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    yield put(registerSuccess());
  } catch (err) {
    yield put(registerFailure(err));
    throw err;
  }
}

export function* registerWatcher() {
  yield fork(takeLatest, REGISTER_REQUEST, register);
}

export function* registerSaga() {
  const watcher = yield fork(registerWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  registerSaga,
];
