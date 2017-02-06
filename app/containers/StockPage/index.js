import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Table, Column, Cell } from 'fixed-data-table-2';
import { TextCell, NumberCell } from 'components/Cell/InEditable';
import { EditableCell, EditableAutoCompleteCell, EditableNumberCell, EditableDateCell } from 'components/Cell/Editable';
import { ToolCell } from 'components/Cell/Button';
import { setExportingParams } from 'containers/App/actions';
import { fetch, removeRow, revertRemoveRow, updateRow, setEndpoint, setNewRow, setImporter } from 'containers/DataTable/actions';
import { selectQuery, selectData, selectCleanData } from 'containers/DataTable/selectors';
import { fromJS } from 'immutable';
import moment from 'moment';
import GetContainerDimensions from 'react-dimensions';
import { StyledLayoutWithSideBar, StyledSider, StyledContent } from 'components/Layout';
import RemainingBar from './RemainingBar';

import messages from './messages';

const safeGetNumber = value => value || 0;
const getTotalValue = ({ row }) => row && +safeGetNumber(safeGetNumber(row.get('price')) * safeGetNumber(row.get('amount'))).toFixed(2);

export class StockPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  state = {
    editingProduct: null
  };

  static contextTypes = {
    intl: React.PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { query, fetch, setEndpoint, route: { stockType }, setNewRow, setImporter, setExportingParams } = this.props;
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
    setImporter((rows, form) => rows.map(row => fromJS({
      receiptId: form && form.receiptId,
      date: (form && form.date) || new Date(),
      ...row,
    })));
    fetch({
      text: '',
      receiptId: '',
      startDate: moment().subtract(30, 'days').startOf('day').toDate(),
      endDate: moment().endOf('day').toDate()
    });
    setExportingParams({
      fields: [
        'order',
        { fields: ['date'], opt: 'date' },
        'receiptId',
        ['product', 'id'],
        ['product', 'name'],
        ['product', 'model'],
        'amount',
        'price',
        { fields: ['amount', 'price'], opt: '*' },
      ]
    });
  }

  render() {
    const { intl } = this.context;
    const { editingProduct } = this.state;
    const { containerWidth, containerHeight, route: { stockType },
      data, cleanData, remove, revertRemove, update } = this.props;
    const commonEditableCellProps = { onEditing: r => this.setState({ editingProduct: r.get('product') }),
      onUpdate: update, data, cleanData };
    const commonInEditableCellProps = { data, cleanData };
    const onProductUpdate = ({ value, rowIndex }) => update({ value, rowIndex, col: 'product' });

    const _containerWidth = containerWidth - 200;

    return (
      <div>
        <StyledLayoutWithSideBar>
          <StyledSider>
            <RemainingBar editingProduct={editingProduct} height={containerHeight - 46 * 2} stockType={stockType} />
          </StyledSider>
          <StyledContent>
            <Table
              width={_containerWidth}
              height={containerHeight - 46 * 2}
              rowsCount={data.count()}
              headerHeight={30}
              rowHeight={30}
              scrollToRow={data.count() - 1}>
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
                width={130} />
              <Column
                header={<Cell><FormattedMessage {...messages.receiptId} /></Cell>}
                cell={<EditableCell {...commonEditableCellProps} col={['receiptId']} />}
                width={150} />
              <Column
                header={<Cell><FormattedMessage {...messages.productId} /></Cell>}
                cell={<EditableAutoCompleteCell {...commonEditableCellProps} onUpdate={onProductUpdate} col={['product', 'id']}
                  limit={10} endpoint={'/api/v0/products'} />}
                width={180} />
              <Column
                header={<Cell><FormattedMessage {...messages.productName} /></Cell>}
                cell={<TextCell {...commonInEditableCellProps} col={['product', 'name']} />}
                width={Math.max(200, _containerWidth - 920)} />
              <Column
                header={<Cell><FormattedMessage {...messages.model} /></Cell>}
                cell={<TextCell {...commonInEditableCellProps} col={['product', 'model']}  />}
                width={80} />
              <Column
                header={<Cell><FormattedMessage {...messages.amount} /></Cell>}
                cell={<EditableNumberCell {...commonEditableCellProps} col={['amount']} />}
                width={100} />
              <Column
                header={<Cell><FormattedMessage {...messages.price} /></Cell>}
                cell={<EditableNumberCell decimal={2} {...commonEditableCellProps} col={['price']} />}
                width={100} />
              <Column
                header={<Cell><FormattedMessage {...messages.total} /></Cell>}
                cell={<NumberCell {...commonInEditableCellProps} getValue={getTotalValue} />}
                width={100} />
            </Table>
          </StyledContent>
        </StyledLayoutWithSideBar>
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
    setImporter: importer => dispatch(setImporter(importer)),
    setExportingParams: params => dispatch(setExportingParams(params)),
  };
}

const dimensionsOptions = { elementResize: true, getHeight: () => document.body.clientHeight, getWidth: () => document.body.clientWidth };

export default GetContainerDimensions(dimensionsOptions)(connect(mapStateToProps, mapDispatchToProps)(StockPage));
