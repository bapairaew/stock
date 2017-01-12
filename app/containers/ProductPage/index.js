import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { ErrorBox } from 'components/Layout';
import styled from 'styled-components';
import { Table, Column, Cell } from 'fixed-data-table';
import { TextCell, NumberCell, DateCell } from 'components/Cell/InEditable';
import { FormattedMessage } from 'react-intl';
import { selectProduct, selectSell, selectBuy, selectLoading, selectError } from './selectors';
import { fetchProduct } from './actions';
import { Spin } from 'antd';
import GetContainerDimensions from 'react-dimensions';
import 'fixed-data-table/dist/fixed-data-table.min.css';
import className from '../fixedDataTableStyle';

import messages from './messages';

const Header = styled.div`
  height: 200px;
  width: 100%;
  text-align: center;
  color: rgba(255,255,255,.9);
  background: rgb(15,133,217);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 18px;
`;

const H2 = styled.h2`
  font-weight: 300;
`;

const H3 = styled.h3`
  font-weight: 100;
`;

const H5 = styled.h5`
  font-weight: 100;
  display: ${props => props.visible ? 'block' : 'none'};
  color: ${props => props.value === 0 ? '#bbb' : props.value > 0 ? '#8bc34a' : '#f44336'};
`;

const printIfBuy = ({ row }) => row.get('price') < 0 ? row.get('amount') : null;
const printIfSell = ({ row }) => row.get('price') > 0 ? row.get('amount') : null;
const sum = (list, field) => list.reduce((prev, current) => prev + +current.get(field), 0);
const transform = (r, sign) => r.set('price', r.get('price').toFixed(2) * sign)
  .set('date', new Date(r.get('date')))
  .set('total', (r.get('price') * r.get('amount') * sign).toFixed(2));

export class ProductPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static contextTypes = {
    intl: React.PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.fetchProduct(this.props.params.id);
  }

  render() {
    const { intl } = this.context;
    const { containerWidth, containerHeight, product, sell, buy, loading, error } = this.props;
    const _buy = buy.map(x => transform(x, -1));
    const _sell = sell.map(x => transform(x, 1));
    const data = _buy.concat(_sell).sort((a, b) => a.get('date') - b.get('date'));
    const profit = sum(data, 'total');
    const capital = -1 * sum(_buy, 'total');
    const percent = 100 * profit / capital;
    const commonInEditableCellProps = { data, cleanData: data };

    return (
      <div>
        <Helmet title={product.get('name') || intl.formatMessage(messages.title)} />
        <Spin spinning={loading}>
          <Header>
            <h1>{product.get('name')}</h1>
            <H2>{product.get('model')}</H2>
            <H3>{product.get('id')}</H3>
            <H5 visible={!!product.get('_id')} value={profit}>
              <FormattedMessage {...messages.totalProfit} />: {`${profit.toFixed(2)} (${percent.toFixed(2)}%) `}
            </H5>
            <ErrorBox visible={!!error}>{error + 'fasd'}</ErrorBox>
          </Header>
          <div className={className}>
            <Table
              width={containerWidth}
              height={containerHeight - 46 - 200}
              rowsCount={data.count()}
              headerHeight={30}
              rowHeight={30}>
              <Column
                header={<Cell><FormattedMessage {...messages.order} /></Cell>}
                cell={<NumberCell {...commonInEditableCellProps} col={['order']} />}
                width={100} />
              <Column
                header={<Cell><FormattedMessage {...messages.date} /></Cell>}
                cell={<DateCell {...commonInEditableCellProps} col={['date']} />}
                width={200} />
              <Column
                header={<Cell><FormattedMessage {...messages.receiptId} /></Cell>}
                cell={<TextCell {...commonInEditableCellProps} col={['receiptId']} />}
                width={Math.max(200, containerWidth - 900)} />
              <Column
                header={<Cell><FormattedMessage {...messages.buy} /></Cell>}
                cell={<NumberCell {...commonInEditableCellProps} col={['amount']} getValue={printIfBuy} />}
                width={150} />
              <Column
                header={<Cell><FormattedMessage {...messages.sell} /></Cell>}
                cell={<NumberCell {...commonInEditableCellProps} col={['amount']} getValue={printIfSell} />}
                width={150} />
              <Column
                header={<Cell><FormattedMessage {...messages.price} /></Cell>}
                cell={<NumberCell {...commonInEditableCellProps} col={['price']} />}
                width={150} />
              <Column
                header={<Cell><FormattedMessage {...messages.total} /></Cell>}
                cell={<NumberCell {...commonInEditableCellProps} col={['total']} />}
                width={150} />
            </Table>
          </div>
        </Spin>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  product: selectProduct(),
  sell: selectSell(),
  buy: selectBuy(),
  loading: selectLoading(),
  error: selectError(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchProduct: id => dispatch(fetchProduct(id)),
  };
}

const dimensionsOptions = { elementResize: true, getHeight: () => document.body.clientHeight, getWidth: () => document.body.clientWidth };

export default GetContainerDimensions(dimensionsOptions)(connect(mapStateToProps, mapDispatchToProps)(ProductPage));
