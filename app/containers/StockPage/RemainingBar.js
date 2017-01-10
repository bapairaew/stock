import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { selectData, selectCleanData, selectChangedRows } from 'containers/DataTable/selectors';
import ProductCard from 'components/ProductCard';
import { fromJS } from 'immutable';

const CardContainer = styled.div`
  overflow: auto;
  height: 100%;
`;

export class RemainingBar extends React.PureComponent {

  shouldComponentUpdate(newProps) {
    return this.props.changedRows !== newProps.changedRows;
  }

  render() {
    const { data, cleanData, changedRows, stockType } = this.props;
    const products = changedRows
      .filter(r => r.getIn(['product', '_id']))
      // TODO: optimise this??
      .map(r => {
        const index = data.indexOf(r);
        const row = data.get(index);
        const cleanRow = cleanData.get(index);

        if (row.getIn(['product', '_id']) !== cleanRow.getIn(['product', '_id'])) {
          // product changed
          return fromJS([{
            product: row.get('product'),
            diff: row.get('amount') * (stockType === 'buy' ? 1 : -1),
          }, {
            product: cleanRow.get('product'),
            diff: cleanRow.get('amount') * (stockType === 'buy' ? 1 : -1),
          }]);
        } else {
          return fromJS([{
            product: r.get('product'),
            diff: (row.get('amount') - ((cleanRow && cleanRow.get('amount')) || 0)) * (stockType === 'buy' ? 1 : -1),
          }]);
        }
      })
      .flatten(1)
      .groupBy(r => r.getIn(['product', '_id']))
      .toList()
      .map(g => {
        return {
          product: g.getIn([0, 'product']),
          diff: g.reduce((sum, r) => sum + r.get('diff'), 0)
        };
      });

    return (
      <CardContainer>
        {products.map((p, i) => <ProductCard key={i} endpoint={p => `/api/v0/products/details/${p.get('_id')}`} {...p} />)}
      </CardContainer>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  data: selectData(),
  cleanData: selectCleanData(),
  changedRows: selectChangedRows(),
});

export default connect(mapStateToProps, null)(RemainingBar);
