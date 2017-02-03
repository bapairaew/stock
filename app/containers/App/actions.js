// TODO: exportRows only used by DataTable, thus, it should be moved there

import {
  EXPORT_REQUEST,
  EXPORT_SUCCESS,
  EXPORT_FAILURE,
  SET_EXPORTING_PARAMS,
} from './constants';

export function exportRows(rows) {
  return {
    type: EXPORT_REQUEST,
    rows,
  };
}

export function exportRowsSuccess(url) {
  return {
    type: EXPORT_SUCCESS,
    url,
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
