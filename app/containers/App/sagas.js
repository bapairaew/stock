// TODO: exportRows only used by DataTable, thus, it should be moved there

import { takeLatest } from 'redux-saga';
import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { selectExportingParams } from './selectors';
import { EXPORT_REQUEST, EXPORT_SUCCESS,
  MAKE_FULL_REPORT_REQUEST,
  MAKE_FULL_REPORT_SUCCESS,
  MAKE_SUMMARY_REPORT_REQUEST,
  MAKE_SUMMARY_REPORT_SUCCESS } from './constants';
import { LOCATION_CHANGE } from 'react-router-redux';
import { exportRowsSuccess, exportRowsFailure,
  makeFullReport, makeFullReportSuccess,
  makeSummaryReport, makeSummaryReportSuccess } from './actions';
import request from 'utils/request';
import qs from 'qs';
import download from 'utils/download';

// Common
export function* download(action) {
  const { url, name } = action;
  yield download(url, name);
}

export function* report(action) {
  try {
    const { type, year, id } = action;
    const _type = type === MAKE_FULL_REPORT_FAILURE ? 'full' : 'summary';
    const requestURL = `/api/v0/report/${_type}/${year}${id ? `?id=${id}` : ''}`;
    const { url } = yield call(request, requestURL);
    yield put(makeFullReportSuccess(url));
  } catch (err) {
    yield put(makeFullReportFailure(err));
    throw err;
  }
}


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

export function* exportDataSaga() {
  const watcher = yield fork(exportDataWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Export success
export function* exportDataSuccessWatcher() {
  yield fork(takeLatest, EXPORT_SUCCESS, download);
}

export function* exportDataSuccessSaga() {
  const watcher = yield fork(exportDataSuccessWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Full Report
export function* fullReportWatcher() {
  yield fork(takeLatest, MAKE_FULL_REPORT_REQUEST, report);
}

export function* fullReportSaga() {
  const watcher = yield fork(fullReportWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Full report success
export function* fullReportSuccessWatcher() {
  yield fork(takeLatest, MAKE_FULL_REPORT_SUCCESS, download);
}

export function* fullReportSuccessSaga() {
  const watcher = yield fork(fullReportSuccessWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Summart report
export function* summaryReportWatcher() {
  yield fork(takeLatest, MAKE_SUMMARY_REPORT_REQUEST, report);
}

export function* summaryReportSaga() {
  const watcher = yield fork(summaryReportWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Full report success
export function* summaryReportSuccessWatcher() {
  yield fork(takeLatest, MAKE_SUMMARY_REPORT_REQUEST, download);
}

export function* summaryReportSuccessSaga() {
  const watcher = yield fork(summaryReportSuccessWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  fullReportSaga,
  fullReportSuccessSaga,
  summaryReportSaga,
  summaryReportSuccessSaga,
  exportDataSaga,
  exportDataSuccessSaga,
];
