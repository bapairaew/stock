// TODO: exportRows only used by DataTable, thus, it should be moved there

import { takeLatest } from 'redux-saga';
import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { selectExportingParams } from './selectors';
import { EXPORT_REQUEST, EXPORT_SUCCESS } from './constants';
import { LOCATION_CHANGE } from 'react-router-redux';
import { exportRowsSuccess, exportRowsFailure } from './actions';
import request from 'utils/request';
import qs from 'qs';
import download from 'utils/download';

// Export
export function* exportData(action) {
  const requestURL = '/api/v0/misc/export';
  const params = yield select(selectExportingParams());

  try {
    const { rows } = action;
    const { url } = yield call(request, requestURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows: rows.toJS(), params }),
    });
    yield put(exportRowsSuccess(url));
  } catch (err) {
    yield put(exportRowsFailure(err));
    throw err;
  }
}

export function* exportDataWatcher() {
  yield fork(takeLatest, EXPORT_REQUEST, exportData);
}

export function* exportSaga() {
  const watcher = yield fork(exportDataWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Export success
export function* exportDataSuccess(action) {
  const { url } = action;
  yield download(url, 'export.xlsx');
}

export function* exportDataSuccessWatcher() {
  yield fork(takeLatest, EXPORT_SUCCESS, exportDataSuccess);
}

export function* exportDataSuccessSaga() {
  const watcher = yield fork(exportDataSuccessWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  exportSaga,
  exportDataSuccessSaga,
];
