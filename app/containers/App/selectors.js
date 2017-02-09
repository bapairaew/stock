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

const selectMakingFullReport = () => createSelector(
  selectApp(),
  (substate) => substate.get('makingFullReport'),
);

const selectMakingSummaryReport = () => createSelector(
  selectApp(),
  (substate) => substate.get('makingSummaryReport'),
);

export {
  selectMakingFullReport,
  selectMakingSummaryReport,
  selectExportingParams,
  selectExporting,
  selectError,
};
