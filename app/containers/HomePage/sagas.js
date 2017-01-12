import { takeLatest } from 'redux-saga';
import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { selectQuery } from './selectors';
import { FETCH_PRODUCTS_REQUEST } from './constants';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fetchProductsSuccess, fetchProductsFailure } from './actions';
import request from 'utils/request';
import qs from 'qs';

// Fetch
export function* fetchProducts() {
  const query = yield select(selectQuery());
  const requestURL = `/api/v0/products/sum?${qs.stringify(query.toJS())}`;

  try {
    const data = yield call(request, requestURL);
    yield put(fetchProductsSuccess(data));
  } catch (err) {
    yield put(fetchProductsFailure(err));
    throw err;
  }
}

export function* fetchProductsWatcher() {
  yield fork(takeLatest, FETCH_PRODUCTS_REQUEST, fetchProducts);
}

export function* fetchProductsSaga() {
  const watcher = yield fork(fetchProductsWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  fetchProductsSaga,
];
