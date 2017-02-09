// TODO: exportRows only used by DataTable, thus, it should be moved there

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

export function exportRows(rows) {
  return {
    type: EXPORT_REQUEST,
    rows,
  };
}

export function exportRowsSuccess(url, name = 'export.xlsx') {
  return {
    type: EXPORT_SUCCESS,
    url,
    name,
  };
}

export function exportRowsFailure(error) {
  return {
    type: EXPORT_FAILURE,
    error,
  };
}

export function setExportingParams(params) {
  return {
    type: SET_EXPORTING_PARAMS,
    params,
  };
}

export function makeFullReport(year, id) {
  return {
    type: MAKE_FULL_REPORT_REQUEST,
    year,
    id,
  };
}

export function makeFullReportSuccess(url, name = 'report.zip') {
  return {
    type: MAKE_FULL_REPORT_SUCCESS,
    url,
    name,
  };
}

export function makeFullReportFailure(error) {
  return {
    type: MAKE_FULL_REPORT_FAILURE,
    error,
  };
}

export function makeSummaryReport(year) {
  return {
    type: MAKE_SUMMARY_REPORT_REQUEST,
    year,
  };
}

export function makeSummaryReportSuccess(url, name = 'summary.xlsx') {
  return {
    type: MAKE_SUMMARY_REPORT_SUCCESS,
    url,
    name,
  };
}

export function makeSummaryReportFailure(error) {
  return {
    type: MAKE_SUMMARY_REPORT_FAILURE,
    error,
  };
}
