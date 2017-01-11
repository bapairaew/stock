import { takeLatest } from 'redux-saga';
import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { LOGIN_REQUEST } from './constants';
import { LOCATION_CHANGE } from 'react-router-redux';
import { loginSuccess, loginFailure } from './actions';
import request from 'utils/request';

// Fetch
export function* login(action) {
  const requestURL = '/api/v0/users/login';

  try {
    const { username, password } = action;
    yield call(request, requestURL,  {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    window.sessionStorage.setItem('username', username);
    window.location.assign('/a/home');
    yield put(loginSuccess());
  } catch (err) {
    yield put(loginFailure(err));
    throw err;
  }
}

export function* loginWatcher() {
  yield fork(takeLatest, LOGIN_REQUEST, login);
}

export function* loginSaga() {
  const watcher = yield fork(loginWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  loginSaga,
];
