import {
  FETCH_PRODUCT_REQUEST,
  FETCH_PRODUCT_SUCCESS,
  FETCH_PRODUCT_FAILURE,
} from './constants';

export function fetchProduct(id) {
  return {
    type: FETCH_PRODUCT_REQUEST,
    id,
  };
}

export function fetchProductSuccess(product, sell, buy) {
  return {
    type: FETCH_PRODUCT_SUCCESS,
    product,
    sell,
    buy
  };
}

export function fetchProductFailure(error) {
  return {
    type: FETCH_PRODUCT_FAILURE,
    error,
  };
}
