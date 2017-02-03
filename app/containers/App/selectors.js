// TODO: exportRows only used by DataTable, thus, it should be moved there

import { createSelector } from 'reselect';

const selectApp = () => (state) => state.get('app');

const selectExporting = () => createSelector(
  selectApp(),
  (substate) => substate.get('exporting'),
);

const selectExportingParams = () => createSelector(
  selectApp(),
  (substate) => substate.get('exportingParams'),
);

const selectError = () => createSelector(
  selectApp(),
  (substate) => substate.get('error'),
);

export {
  selectExportingParams,
  selectExporting,
  selectError,
};
