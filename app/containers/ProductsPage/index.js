import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Table, Column, Cell } from 'fixed-data-table';
import { EditableCell } from 'components/Cell/Editable';
import { ToolCell } from 'components/Cell/Button';
import { fetch, removeRow, revertRemoveRow, updateRow, setEndpoint, setNewRow } from 'containers/DataTable/actions';
import { selectQuery, selectData, selectCleanData } from 'containers/DataTable/selectors';
import { fromJS } from 'immutable';
import GetContainerDimensions from 'react-dimensions';

import messages from './messages';

export class ProductsPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static contextTypes = {
    intl: React.PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { query, fetch, setNewRow, setEndpoint } = this.props;
    setEndpoint('/api/v0/products');
    fetch({ text: '' });
    setNewRow(() => fromJS({ id: '', name: '', model: '' }));
  }

  render() {
    const { intl } = this.context;
    const { containerWidth, containerHeight,
      data, cleanData, remove, revertRemove, update } = this.props;
    const commonEditableCellProps = { onUpdate: update, data, cleanData };

    return (
      <div>
        <Helmet title={intl.formatMessage(messages.title)} />
        <Table
          width={containerWidth}
          height={containerHeight - 46 * 2}
          rowsCount={data.count()}
          headerHeight={30}
          rowHeight={30}>
          <Column
            header={<Cell></Cell>}
            cell={<ToolCell data={data} remove={remove} revertRemove={revertRemove} />}
            width={30} />
          <Column
            header={<Cell><FormattedMessage {...messages.productId} /></Cell>}
            cell={<EditableCell {...commonEditableCellProps} col={['id']} />}
            width={300} />
          <Column
            header={<Cell><FormattedMessage {...messages.productName} /></Cell>}
            cell={<EditableCell {...commonEditableCellProps} col={['name']} />}
            width={Math.max(300, containerWidth - 470)} />
          <Column
            header={<Cell><FormattedMessage {...messages.modelName} /></Cell>}
            cell={<EditableCell {...commonEditableCellProps} col={['model']} />}
            width={200} />
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

const dimensionsOptions = { getHeight: () => document.body.clientHeight, getWidth: () => document.body.clientWidth };

export default GetContainerDimensions(dimensionsOptions)(connect(mapStateToProps, mapDispatchToProps)(ProductsPage));
