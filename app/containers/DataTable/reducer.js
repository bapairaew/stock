import { fromJS } from 'immutable';
import {
  UPDATE_ROW,
  ADD_ROW,
  REMOVE_ROW,
  REVERT_REMOVE_ROW,
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  SAVE_REQUEST,
  SAVE_SUCCESS,
  SAVE_FAILURE,
  IMPORT_REQUEST,
  IMPORT_SUCCESS,
  IMPORT_FAILURE,
  UPLOAD_OPEN,
  UPLOAD_CLOSE,
  SEARCH_OPEN,
  SEARCH_CLOSE,
  CLEAR_ERROR,
  SET_ENDPOINT,
  SET_NEW_ROW,
} from './constants';
import { LOCATION_CHANGE } from 'react-router-redux';

const initialData = [];

const initialState = fromJS({
  query: {},
  newRow: () => null,
  endpoint: '',
  loading: false,
  importing: false,
  searchVisible: false,
  uploadVisible: false,
  error: null,
  data: initialData,
  cleanData: initialData,
});

function dataTableReducer(state = initialState, action) {
  const { value, rowIndex, col, data, query, error, rows, url, endpoint, newRow, addedRows } = action;
  const _data = fromJS(data);
  switch (action.type) {
    case UPDATE_ROW:
      return state
        .setIn(['data', rowIndex].concat(col), fromJS(value));
    case ADD_ROW:
      return state
        .update('data', arr => arr.push(state.get('newRow')()));
    case REMOVE_ROW:
      return state
        .setIn(['data', rowIndex, 'removed'], true);
    case REVERT_REMOVE_ROW:
      return state
        .setIn(['data', rowIndex, 'removed'], false);

    case FETCH_REQUEST:
      return state
        .set('loading', true)
        .set('data', fromJS([]))
        .set('cleanData', fromJS([]))
        .set('query', fromJS(query));
    case FETCH_SUCCESS:
      return state
        .set('loading', false)
        .set('data', _data)
        .set('cleanData', _data);
    case FETCH_FAILURE:
      return state
        .set('loading', false)
        .set('error', fromJS(error));

    case SAVE_REQUEST:
      return state
        .set('loading', true);
    case SAVE_SUCCESS:
      let idx = 0;
      let _state = state
        .set('loading', false)
        .update('data', arr => arr.filter(x => !x.get('removed')))
        .update('data', arr => arr.map(r => r.get('_id') ? r : r.set('_id', addedRows[idx++]._id)));
      return _state
        .set('cleanData', _state.get('data'));
    case SAVE_FAILURE:
      return state
        .set('loading', false)
        .set('error', fromJS(error));

    case IMPORT_REQUEST:
      return state
        .set('importing', true);
    case IMPORT_SUCCESS:
      return state
        .set('importing', false)
        .set('uploadVisible', false);
    case IMPORT_FAILURE:
      return state
        .set('importing', false)
        .set('uploadVisible', false);

    case SEARCH_OPEN:
      return state
        .set('searchVisible', true);
    case SEARCH_CLOSE:
      return state
        .set('searchVisible', false);
    case UPLOAD_OPEN:
      return state
        .set('uploadVisible', true);
    case UPLOAD_CLOSE:
      return state
        .set('uploadVisible', false);

    case CLEAR_ERROR:
      return state
        .set('error', null);

    case SET_ENDPOINT:
      return state
        .set('endpoint', endpoint);

    case SET_NEW_ROW:
      return state
        .set('newRow', newRow);
    default:
      return state;
  }
}

export default dataTableReducer;
