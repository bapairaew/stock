import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Table, Column, Cell } from 'fixed-data-table';
import { TextCell, NumberCell } from 'components/Cell/InEditable';
import { EditableCell, EditableAutoCompleteCell, EditableNumberCell, EditableDateCell } from 'components/Cell/Editable';
import { ToolCell } from 'components/Cell/Button';
import { fetch, removeRow, revertRemoveRow, updateRow, setEndpoint, setNewRow } from 'containers/DataTable/actions';
import { selectQuery, selectData, selectCleanData } from 'containers/DataTable/selectors';
import { fromJS } from 'immutable';
import moment from 'moment';
import GetContainerDimensions from 'react-dimensions';

import messages from './messages';

export class StockPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static contextTypes = {
    intl: React.PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { query, fetch, setEndpoint, route: { stockType }, setNewRow } = this.props;
    setNewRow(() => fromJS({
      _id: null,
      order: 0,
      date: new Date(),
      receiptId: '',
      product: { id: '', name: '', model:  '' },
      amount: 0,
      price: 0,
    }));
    setEndpoint(`/api/v0/stock/${stockType}`);
    fetch({ text: '', receiptId: '', startDate: moment().subtract(30, 'days').toDate(), endDate: moment().toDate() });
  }

  render() {
    const { intl } = this.context;
    const { containerWidth, containerHeight, route: { stockType },
      data, cleanData, remove, revertRemove, update } = this.props;
    const commonEditableCellProps = { onUpdate: update, data, cleanData };
    const commonInEditableCellProps = { data, cleanData };
    const onProductUpdate = ({ value, rowIndex }) => update({ value, rowIndex, col: 'product' });

    return (
      <div>
        <Helmet title={intl.formatMessage(messages[`${stockType}Title`])} />
        <Table
          width={containerWidth}
          height={containerHeight}
          rowsCount={data.count()}
          headerHeight={30}
          rowHeight={30}>
          <Column
            header={<Cell></Cell>}
            cell={<ToolCell data={data} remove={remove} revertRemove={revertRemove} />}
            width={30} />
          <Column
            header={<Cell><FormattedMessage {...messages.order} /></Cell>}
            cell={<EditableNumberCell {...commonEditableCellProps} col={['order']} />}
            width={50} />
          <Column
            header={<Cell><FormattedMessage {...messages.date} /></Cell>}
            cell={<EditableDateCell {...commonEditableCellProps} col={['date']} />}
            width={150} />
          <Column
            header={<Cell><FormattedMessage {...messages.receiptId} /></Cell>}
            cell={<EditableCell {...commonEditableCellProps} col={['receiptId']} />}
            width={150} />
          <Column
            header={<Cell><FormattedMessage {...messages.productId} /></Cell>}
            cell={<EditableAutoCompleteCell {...commonEditableCellProps} onUpdate={onProductUpdate} col={['product', 'id']}
              limit={10} endpoint={'/api/v0/products'} />}
            width={200} />
          <Column
            header={<Cell><FormattedMessage {...messages.productName} /></Cell>}
            cell={<TextCell {...commonInEditableCellProps} col={['product', 'name']} />}
            width={Math.max(300, containerWidth - 980)} />
          <Column
            header={<Cell><FormattedMessage {...messages.modelName} /></Cell>}
            cell={<TextCell {...commonInEditableCellProps} col={['product', 'model']}  />}
            width={100} />
          <Column
            header={<Cell><FormattedMessage {...messages.amount} /></Cell>}
            cell={<EditableNumberCell {...commonEditableCellProps} col={['amount']} />}
            width={100} />
          <Column
            header={<Cell><FormattedMessage {...messages.price} /></Cell>}
            cell={<EditableNumberCell {...commonEditableCellProps} col={['price']} />}
            width={100} />
          <Column
            header={<Cell><FormattedMessage {...messages.total} /></Cell>}
            cell={<NumberCell {...commonInEditableCellProps} getValue={p => p && ((p.get('price') || 0) * (p.get('amount') || 0))} />}
            width={100} />
        </Table>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  query: selectQuery(),
  data: selectData(),
  cleanData: selectCleanData(),
});

function mapDispatchToProps(dispatch) {
  return {
    update: ({ value, rowIndex, col }) => dispatch(updateRow({ value, rowIndex, col })),
    fetch: query => dispatch(fetch(query)),
    remove: rowIndex => dispatch(removeRow(rowIndex)),
    revertRemove: rowIndex => dispatch(revertRemoveRow(rowIndex)),
    setEndpoint: endpoint => dispatch(setEndpoint(endpoint)),
    setNewRow: newRow => dispatch(setNewRow(newRow)),
  };
}

const dimensionsOptions = { getHeight: () => document.body.clientHeight - 46 * 2, getWidth: () => document.body.clientWidth };

export default GetContainerDimensions(dimensionsOptions)(connect(mapStateToProps, mapDispatchToProps)(StockPage));
