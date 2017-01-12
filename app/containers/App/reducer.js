import { fromJS } from 'immutable';
import {
  EXPORT_REQUEST,
  EXPORT_SUCCESS,
  EXPORT_FAILURE,
} from './constants';
import { LOCATION_CHANGE } from 'react-router-redux';

const initialData = [];

const initialState = fromJS({
  exporting: false,
  error: null,
});

function appReducer(state = initialState, action) {
  const { value, rowIndex, col, data, query, error, rows, url, endpoint, newRow, addedRows } = action;
  const _data = fromJS(data);
  switch (action.type) {
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
    default:
      return state;
  }
}

export default appReducer;
