import { createSelector } from 'reselect';

const selectDataTable = () => (state) => state.get('dataTable');

const selectData = () => createSelector(
  selectDataTable(),
  (substate) => substate.get('data'),
);

const selectCleanData = () => createSelector(
  selectDataTable(),
  (substate) => substate.get('cleanData'),
);

const selectQuery = () => createSelector(
  selectDataTable(),
  (substate) => substate.get('query'),
);

const selectLoading = () => createSelector(
  selectDataTable(),
  (substate) => substate.get('loading'),
);

const selectImporting = () => createSelector(
  selectDataTable(),
  (substate) => substate.get('importing'),
);

const selectSearchVisible = () => createSelector(
  selectDataTable(),
  (substate) => substate.get('searchVisible'),
);

const selectUploadVisible = () => createSelector(
  selectDataTable(),
  (substate) => substate.get('uploadVisible'),
);

const selectError = () => createSelector(
  selectDataTable(),
  (substate) => substate.get('error'),
);

const selectEndpoint = () => createSelector(
  selectDataTable(),
  (substate) => substate.get('endpoint'),
);

const selectChangedRows = () => createSelector(
  selectDataTable(),
  (substate) => {
    const data = substate.get('data');
    const cleanData = substate.get('cleanData');
    return data.filter((r, i) => r !== cleanData.get(i));
  }
);

export {
  selectDataTable,
  selectData,
  selectCleanData,
  selectQuery,
  selectLoading,
  selectImporting,
  selectExporting,
  selectSearchVisible,
  selectUploadVisible,
  selectError,
  selectEndpoint,
  selectChangedRows,
};
