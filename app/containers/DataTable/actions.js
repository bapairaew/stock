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
  SET_IMPORTER,
  EDIT_OPEN,
  EDIT_CLOSE,
  SET_EDITING_ITEMS,
  FOCUS_ITEM,
  BATCH_EDIT_ITEMS,
} from './constants';

export function updateRow({ value, rowIndex, col }) {
  return {
    type: UPDATE_ROW,
    value,
    rowIndex,
    col,
  };
}

export function addRow() {
  return {
    type: ADD_ROW,
  };
}

export function removeRow(rowIndex) {
  return {
    type: REMOVE_ROW,
    rowIndex,
  };
}

export function revertRemoveRow(rowIndex) {
  return {
    type: REVERT_REMOVE_ROW,
    rowIndex,
  };
}

export function fetch(query)  {
  return {
    type: FETCH_REQUEST,
    query,
  };
}

export function fetchSuccess(data)  {
  return {
    type: FETCH_SUCCESS,
    data,
  };
}

export function fetchFailure(error)  {
  return {
    type: FETCH_FAILURE,
    error,
  };
}

export function save(rows) {
  return {
    type: SAVE_REQUEST,
    rows,
  };
}

export function saveSuccess(addedRows) {
  return {
    type: SAVE_SUCCESS,
    addedRows,
  };
}

export function saveFailure(error) {
  return {
    type: SAVE_FAILURE,
    error,
  };
}

export function importRows() {
  return {
    type: IMPORT_REQUEST,
  };
}

export function importRowsSuccess(rows, extras) {
  return {
    type: IMPORT_SUCCESS,
    rows,
    extras,
  };
}

export function importRowsFailure(error) {
  return {
    type: IMPORT_FAILURE,
    error,
  };
}

export function uploadOpen(rows) {
  return {
    type: UPLOAD_OPEN,
  };
}

export function uploadClose(rows) {
  return {
    type: UPLOAD_CLOSE,
  };
}

export function searchOpen() {
  return {
    type: SEARCH_OPEN,
  };
}

export function searchClose() {
  return {
    type: SEARCH_CLOSE,
  };
}

export function editOpen() {
  return {
    type: EDIT_OPEN,
  };
}

export function editClose() {
  return {
    type: EDIT_CLOSE,
  };
}

export function setEditingItems(items) {
  return {
    type: SET_EDITING_ITEMS,
    items,
  };
};

export function clearError() {
  return {
    type: CLEAR_ERROR,
  };
}

export function setEndpoint(endpoint) {
  return {
    type: SET_ENDPOINT,
    endpoint,
  };
}

export function setNewRow(newRow) {
  return {
    type: SET_NEW_ROW,
    newRow,
  };
}

export function setImporter(importer) {
  return {
    type: SET_IMPORTER,
    importer,
  };
}

export function focusItem(item) {
  return {
    type: FOCUS_ITEM,
    item,
  };
};

export function batchEditItems(payload, editor) {
  return {
    type: BATCH_EDIT_ITEMS,
    payload,
    editor,
  };
};
