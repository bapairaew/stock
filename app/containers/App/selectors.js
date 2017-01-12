import { createSelector } from 'reselect';

const selectApp = () => (state) => state.get('app');

const selectExporting = () => createSelector(
  selectApp(),
  (substate) => substate.get('exporting'),
);

const selectError = () => createSelector(
  selectApp(),
  (substate) => substate.get('error'),
);

export {
  selectExporting,
  selectError,
};
