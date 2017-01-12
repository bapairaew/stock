import {
  EXPORT_REQUEST,
  EXPORT_SUCCESS,
  EXPORT_FAILURE,
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
