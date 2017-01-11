import { createSelector } from 'reselect';

const selectRegisterPage = () => (state) => state.get('registerPage');

const selectLoading = () => createSelector(
  selectRegisterPage(),
  (substate) => substate.get('loading'),
);

const selectError = () => createSelector(
  selectRegisterPage(),
  (substate) => substate.get('error'),
);

const selectSuccess = () => createSelector(
  selectRegisterPage(),
  (substate) => substate.get('success'),
);

export default selectRegisterPage;
export {
  selectLoading,
  selectError,
  selectSuccess,
};
