import { createSelector } from 'reselect';

const selectLoginPage = () => (state) => state.get('loginPage');

const selectLoading = () => createSelector(
  selectLoginPage(),
  (substate) => substate.get('loading'),
);

const selectError = () => createSelector(
  selectLoginPage(),
  (substate) => substate.get('error'),
);

export default selectLoginPage;
export {
  selectLoading,
  selectError,
};
