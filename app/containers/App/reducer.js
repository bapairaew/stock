// TODO: exportRows only used by DataTable, thus, it should be moved there

import { fromJS } from 'immutable';
import {
  EXPORT_REQUEST,
  EXPORT_SUCCESS,
  EXPORT_FAILURE,
  SET_EXPORTING_PARAMS,
  MAKE_FULL_REPORT_REQUEST,
  MAKE_FULL_REPORT_SUCCESS,
  MAKE_FULL_REPORT_FAILURE,
  MAKE_SUMMARY_REPORT_REQUEST,
  MAKE_SUMMARY_REPORT_SUCCESS,
  MAKE_SUMMARY_REPORT_FAILURE,
} from './constants';
import { LOCATION_CHANGE } from 'react-router-redux';

const initialData = [];

const initialState = fromJS({
  exporting: false,
  makingFullReport: false,
  makingSummaryReport: false,
  exportingParams: { fields: null },
  error: null,
});

function appReducer(state = initialState, action) {
  const { type, params, error } = action;
  switch (type) {
    case EXPORT_REQUEST:
      return state
        .set('exporting', true);
    case EXPORT_SUCCESS:
      return state
        .set('exporting', false);
    case EXPORT_FAILURE:
      return state
        .set('exporting', false)
        .set('error', error);
    case SET_EXPORTING_PARAMS:
      return state
        .set('exportingParams', params);
    case MAKE_FULL_REPORT_REQUEST:
      return state
        .set('makingFullReport', true);
    case MAKE_FULL_REPORT_SUCCESS:
      return state
        .set('makingFullReport', false);
    case MAKE_FULL_REPORT_FAILURE:
      return state
        .set('makingFullReport', false)
        .set('error', error);
    case MAKE_SUMMARY_REPORT_REQUEST:
      return state
        .set('makingSummaryReport', true);
    case MAKE_SUMMARY_REPORT_SUCCESS:
      return state
        .set('makingSummaryReport', false);
    case MAKE_SUMMARY_REPORT_FAILURE:
      return state
        .set('makingSummaryReport', false)
        .set('error', error);
    default:
      return state;
  }
}

export default appReducer;
