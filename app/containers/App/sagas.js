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
  makeFullReportSuccess, makeFullReportFailure,
  makeSummaryReportSuccess, makeSummaryReportFailure } from './actions';
import request from 'utils/request';
import qs from 'qs';
import download from 'utils/download';
import moment from 'moment-timezone';

// Common
export function* downloadAction(action) {
  const { url, name } = action;
  yield download(url, name);
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
  yield fork(takeLatest, EXPORT_SUCCESS, downloadAction);
}

export function* exportDataSuccessSaga() {
  const watcher = yield fork(exportDataSuccessWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Full Report
export function* fullReport(action) {
  try {
    const { year, id } = action;
    const requestURL = `/api/v0/report/full/${year}?timezone=${moment.tz.guess()}${id ? `&id=${id}` : ''}`;
    const { url } = yield call(request, requestURL);
    yield put(makeFullReportSuccess(url));
  } catch (err) {
    yield put(makeFullReportFailure(err));
    throw err;
  }
}

export function* fullReportWatcher() {
  yield fork(takeLatest, MAKE_FULL_REPORT_REQUEST, fullReport);
}

export function* fullReportSaga() {
  const watcher = yield fork(fullReportWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Full report success
export function* fullReportSuccessWatcher() {
  yield fork(takeLatest, MAKE_FULL_REPORT_SUCCESS, downloadAction);
}

export function* fullReportSuccessSaga() {
  const watcher = yield fork(fullReportSuccessWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Summary report
export function* summaryReport(action) {
  try {
    const { year } = action;
    const requestURL = `/api/v0/report/summary/${year}?timezone=${moment.tz.guess()}`;
    const { url } = yield call(request, requestURL);
    yield put(makeSummaryReportSuccess(url));
  } catch (err) {
    yield put(makeSummaryReportFailure(err));
    throw err;
  }
}

export function* summaryReportWatcher() {
  yield fork(takeLatest, MAKE_SUMMARY_REPORT_REQUEST, summaryReport);
}

export function* summaryReportSaga() {
  const watcher = yield fork(summaryReportWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Full report success
export function* summaryReportSuccessWatcher() {
  yield fork(takeLatest, MAKE_SUMMARY_REPORT_SUCCESS, downloadAction);
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
