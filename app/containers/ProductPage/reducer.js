import { fromJS } from 'immutable';
import {
  FETCH_PRODUCT_REQUEST,
  FETCH_PRODUCT_SUCCESS,
  FETCH_PRODUCT_FAILURE,
} from './constants';

const initialState = fromJS({
  product: {},
  sell: [],
  buy: [],
  loading: false,
  error: null,
});

function productPageReducer(state = initialState, action) {
  const { id, product, sell, buy, error } = action;
  switch (action.type) {
    case FETCH_PRODUCT_REQUEST:
      return state
        .set('product', fromJS({}))
        .set('sell', fromJS([]))
        .set('buy', fromJS([]))
        .set('loading', true)
        .set('error', null);
    case FETCH_PRODUCT_SUCCESS:
      return state
        .set('product', fromJS(product))
        .set('sell', fromJS(sell))
        .set('buy', fromJS(buy))
        .set('loading', false);
    case FETCH_PRODUCT_FAILURE:
      return state
        .set('loading', false)
        .set('error', error);
    default:
      return state;
  }
}

export default productPageReducer;
