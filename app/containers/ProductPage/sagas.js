import { takeLatest } from 'redux-saga';
import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { FETCH_PRODUCT_REQUEST } from './constants';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fetchProductSuccess, fetchProductFailure } from './actions';
import request from 'utils/request';

// Fetch
export function* fetchProduct(action) {
  try {
    const { id } = action;
    const { product, sell, buy } = yield call(request, `/api/v0/products/details/${id}`);
    yield put(fetchProductSuccess(product, sell, buy));
  } catch (err) {
    yield put(fetchProductFailure(err));
    throw err;
  }
}

export function* fetchProductWatcher() {
  yield fork(takeLatest, FETCH_PRODUCT_REQUEST, fetchProduct);
}

export function* fetchProductSaga() {
  const watcher = yield fork(fetchProductWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  fetchProductSaga,
];
