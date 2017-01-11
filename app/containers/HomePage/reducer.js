import { fromJS } from 'immutable';
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
} from './constants';

const initialState = fromJS({
  query: {},
  products: [],
  loading: false,
  error: null,
});

function loginPageReducer(state = initialState, action) {
  const { error, query, products } = action;
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return state
        .set('query', fromJS(query))
        .set('products', fromJS([]))
        .set('loading', true)
        .set('error', null);
    case FETCH_PRODUCTS_SUCCESS:
      return state
        .set('products', fromJS(products))
        .set('loading', false);
    case FETCH_PRODUCTS_FAILURE:
      return state
        .set('loading', false)
        .set('error', error);
    default:
      return state;
  }
}

export default loginPageReducer;
