import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { ErrorBox, SubHeader } from 'components/Layout';
import styled from 'styled-components';
import { Table, Column, Cell } from 'fixed-data-table-2';
import { TextCell, NumberCell, DateCell } from 'components/Cell/InEditable';
import { FormattedMessage } from 'react-intl';
import { selectProduct, selectSell, selectBuy, selectLoading, selectError } from './selectors';
import { selectExporting } from 'containers/App/selectors';
import { fetchProduct } from './actions';
import { exportRows, setExportingParams } from 'containers/App/actions';
import { Button, Spin } from 'antd';
import GetContainerDimensions from 'react-dimensions';
import 'fixed-data-table-2/dist/fixed-data-table.min.css';
import className from '../fixedDataTableStyle';

import messages from './messages';

const Header = styled.div`
  height: 250px;
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
  margin-top: 20px;
  display: ${props => props.visible ? 'block' : 'none'};
`;

// TODO: Repeated code
const ToolBarContainer = styled.div`
  height: 46px;
  display: flex;
  align-items: center;
  padding: 0 10px !important;
`;

const sum = (list, field) => list.reduce((prev, current) => prev + +current.get(field), 0);
const transform = (r, type) => r
  .set('buy', null)
  .set('sell', null)
  .set(type, r.get('amount'))
  .set('price', r.get('price').toFixed(2))
  .set('amount', r.get('amount'))
  .set('date', new Date(r.get('date')))
  .set('total', (r.get('price') * r.get('amount') * (type === 'buy' ? -1 : 1)).toFixed(2));


export class ProductPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static contextTypes = {
    intl: React.PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { fetchProduct, setExportingParams } = this.props;
    fetchProduct(this.props.params.id);
    setExportingParams({
      fields: [
        { fields: ['date'], opt: 'date' },
        'receiptId',
        'buy',
        'sell',
        'price',
        'total',
      ]
    });
  }

  render() {
    const { intl } = this.context;
    const { containerWidth, containerHeight, product, sell, buy, loading, exporting, error, exportRows } = this.props;
    const _buy = buy.map(x => transform(x, 'buy'));
    const _sell = sell.map(x => transform(x, 'sell'));
    const data = _buy.concat(_sell).sort((a, b) => a.get('date') - b.get('date'));
    const profit = sum(data, 'total');
    const capital = -1 * sum(_buy, 'total');
    const percent = 100 * profit / capital;
    const remaining = sum(_buy, 'amount') - sum(_sell, 'amount');
    const commonInEditableCellProps = { data, cleanData: data };

    return (
      <div>
        <Helmet title={product.get('name') || intl.formatMessage(messages.title)} />
        <Spin spinning={loading}>
          <SubHeader>
            <ToolBarContainer>
              <Button type="primary" icon="file-excel" loading={exporting} onClick={() => exportRows(data)}>
                <FormattedMessage {...messages.saveAsExcel} />
              </Button>
            </ToolBarContainer>
          </SubHeader>
          <Header>
            <h1>{product.get('name')}</h1>
            <H2>{product.get('model')}</H2>
            <H3>{product.get('id')}</H3>
            <H5 visible={!!product.get('_id')}>
              <FormattedMessage {...messages.totalProfit} />: {`${profit.toFixed(2)} (${percent.toFixed(2)}%) | `}
              <FormattedMessage {...messages.remaining} />: {remaining}
            </H5>
            <ErrorBox visible={!!error}>{error}</ErrorBox>
          </Header>
          <div className={className}>
            <Table
              width={containerWidth}
              height={containerHeight - 46 * 2 - 250}
              rowsCount={data.count()}
              headerHeight={30}
              rowHeight={30}
              scrollToRow={data.count() - 1}>
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
                cell={<NumberCell {...commonInEditableCellProps} col={['buy']} />}
                width={150} />
              <Column
                header={<Cell><FormattedMessage {...messages.sell} /></Cell>}
                cell={<NumberCell {...commonInEditableCellProps} col={['sell']} />}
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
  exporting: selectExporting(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchProduct: id => dispatch(fetchProduct(id)),
    exportRows: rows => dispatch(exportRows(rows)),
    setExportingParams: params => dispatch(setExportingParams(params)),
  };
}

const dimensionsOptions = { elementResize: true, getHeight: () => document.body.clientHeight, getWidth: () => document.body.clientWidth };

export default GetContainerDimensions(dimensionsOptions)(connect(mapStateToProps, mapDispatchToProps)(ProductPage));
