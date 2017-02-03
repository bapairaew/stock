// TODO: exportRows only used by DataTable, thus, it should be moved there

import { fromJS } from 'immutable';
import {
  EXPORT_REQUEST,
  EXPORT_SUCCESS,
  EXPORT_FAILURE,
  SET_EXPORTING_PARAMS,
} from './constants';
import { LOCATION_CHANGE } from 'react-router-redux';

const initialData = [];

const initialState = fromJS({
  exporting: false,
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
    default:
      return state;
  }
}

export default appReducer;
