import { createSelector } from 'reselect';

const selectProductPage = () => (state) => state.get('productPage');

const selectProduct = () => createSelector(
  selectProductPage(),
  (substate) => substate.get('product'),
);

const selectSell = () => createSelector(
  selectProductPage(),
  (substate) => substate.get('sell'),
);

const selectBuy = () => createSelector(
  selectProductPage(),
  (substate) => substate.get('buy'),
);

const selectLoading = () => createSelector(
  selectProductPage(),
  (substate) => substate.get('loading'),
);

const selectError = () => createSelector(
  selectProductPage(),
  (substate) => substate.get('error'),
);

export default selectProductPage;
export {
  selectProduct,
  selectSell,
  selectBuy,
  selectLoading,
  selectError,
};
