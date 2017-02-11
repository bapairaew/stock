import { takeLatest } from 'redux-saga';
import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { selectQuery, selectEndpoint } from './selectors';
import { selectLocale } from 'containers/LanguageProvider/selectors';
import { FETCH_REQUEST, SAVE_REQUEST, SAVE_SUCCESS } from './constants';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fetchSuccess, fetchFailure, saveSuccess, saveFailure } from './actions';
import request from 'utils/request';
import qs from 'qs';
import download from 'utils/download';
import { message } from 'antd';
import messages from './messages';
import enTranslationMessages from 'translations/en.json';
import thTranslationMessages from 'translations/th.json';

const locales = {
  en: enTranslationMessages,
  th: thTranslationMessages,
};

const fillProduct = row => {
  if (!row.product) {
    row.product = { id: '', name: '', model: '' };
  }
  return row;
};

// Fetch
export function* fetchData() {
  const query = yield select(selectQuery());
  const endpoint = yield select(selectEndpoint());
  const requestURL = `${endpoint}?${qs.stringify(query.toJS())}`;

  try {
    const data = yield call(request, requestURL);
    const productFilledData = data.map(r => fillProduct(r));
    yield put(fetchSuccess(productFilledData));
  } catch (err) {
    yield put(fetchFailure(err));
    throw err;
  }
}

export function* fetchDataWatcher() {
  yield fork(takeLatest, FETCH_REQUEST, fetchData);
}

export function* fetchSaga() {
  const watcher = yield fork(fetchDataWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Save
export function* saveData(action) {
  const endpoint = yield select(selectEndpoint());
  const requestURL = `${endpoint}/save`;

  try {
    const { rows } = action;
    const [ addedRows, , ] = yield call(request, requestURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rows.toJS()),
    });
    const productFilledAddedRows = addedRows.map(r => fillProduct(r));
    yield put(saveSuccess(productFilledAddedRows));
  } catch (err) {
    yield put(saveFailure(err));
    throw err;
  }
}

export function* saveDataWatcher() {
  yield fork(takeLatest, SAVE_REQUEST, saveData);
}

export function* saveSaga() {
  const watcher = yield fork(saveDataWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Import is done in Upload element

// Save success
export function* saveDataSuccess() {
  const locale = yield select(selectLocale());
  yield message.success(locales[locale][messages.saveSuccessMessage.id]);
}

export function* saveDataSuccessWatcher() {
  yield fork(takeLatest, SAVE_SUCCESS, saveDataSuccess);
}

export function* saveDataSuccessSaga() {
  const watcher = yield fork(saveDataSuccessWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  fetchSaga,
  saveSaga,
  saveDataSuccessSaga,
];
