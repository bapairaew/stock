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

const selectExporting = () => createSelector(
  selectDataTable(),
  (substate) => substate.get('exporting'),
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
};
