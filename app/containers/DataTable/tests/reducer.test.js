import expect from 'expect';
import dataTableReducer from '../reducer';
import { fromJS } from 'immutable';

describe('dataTableReducer', () => {
  it('returns the initial state', () => {
    expect(dataTableReducer(undefined, {})).toEqual(fromJS({}));
  });
});
