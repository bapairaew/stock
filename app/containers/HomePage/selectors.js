import { createSelector } from 'reselect';

const selectHomePage = () => (state) => state.get('homePage');

const selectQuery = () => createSelector(
  selectHomePage(),
  (substate) => substate.get('query'),
);

const selectProducts = () => createSelector(
  selectHomePage(),
  (substate) => substate.get('products'),
);

const selectLoading = () => createSelector(
  selectHomePage(),
  (substate) => substate.get('loading'),
);

const selectError = () => createSelector(
  selectHomePage(),
  (substate) => substate.get('error'),
);

export default selectHomePage;
export {
  selectQuery,
  selectProducts,
  selectLoading,
  selectError,
};
