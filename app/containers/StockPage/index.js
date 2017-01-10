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
import { StyledLayout, StyledSider, StyledContent } from 'components/Layout';
import styled from 'styled-components';
import RemainingBar from './RemainingBar';

const StyledRemainingBar = styled(RemainingBar)`
  display: ${props => props.collapsed ? 'none' : 'block'};
  height: ${props => props.height};
`;

const safeGetNumber = value => value || 0;
const getTotalValue = ({ row }) => row && +safeGetNumber(safeGetNumber(row.get('price')) * safeGetNumber(row.get('amount'))).toFixed(2);

import messages from './messages';

export class StockPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static contextTypes = {
    intl: React.PropTypes.object.isRequired,
  };

  state = {
    collapsed: false
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
    fetch({
      text: '',
      receiptId: '',
      startDate: moment().subtract(30, 'days').startOf('day').toDate(),
      endDate: moment().endOf('day').toDate()
    });
  }

  render() {
    const { intl } = this.context;
    const { containerWidth, containerHeight, route: { stockType },
      data, cleanData, remove, revertRemove, update } = this.props;
    const commonEditableCellProps = { onUpdate: update, data, cleanData };
    const commonInEditableCellProps = { data, cleanData };
    const onProductUpdate = ({ value, rowIndex }) => update({ value, rowIndex, col: 'product' });
    const { collapsed } = this.state;

    const _containerWidth = containerWidth - (collapsed ? 64 : 200);

    return (
      <div>
        <Helmet title={intl.formatMessage(messages[`${stockType}Title`])} />
        <StyledLayout>
          <StyledSider
            collapsible
            collapsed={collapsed}
            onCollapse={() => this.setState({ collapsed: !collapsed })}>
            <StyledRemainingBar height={containerHeight - 46 * 2} stockType={stockType} />
          </StyledSider>
          <StyledContent>
            <Table
              width={_containerWidth}
              height={containerHeight - 46 * 2}
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
        </StyledLayout>
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

const dimensionsOptions = { elementResize: true, getHeight: () => document.body.clientHeight, getWidth: () => document.body.clientWidth };

export default GetContainerDimensions(dimensionsOptions)(connect(mapStateToProps, mapDispatchToProps)(StockPage));
