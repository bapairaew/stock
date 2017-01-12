import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { selectData, selectCleanData, selectChangedRows, selectQuery,
  selectLoading, selectImporting,
  selectSearchVisible, selectUploadVisible, selectError } from './selectors';
import { selectExporting } from 'containers/App/selectors';
import { addRow, save,
  importRows, importRowsSuccess, importRowsFailure,
  searchOpen, searchClose, uploadOpen, uploadClose,
  clearError } from './actions';
import { exportRows } from 'containers/App/actions';
import 'fixed-data-table/dist/fixed-data-table.min.css';
import className from '../fixedDataTableStyle';
import { message, Spin } from 'antd';
import { StyledContent } from 'components/Layout';
import SpinTip from 'components/SpinTip';
import { Container, StyledLayout, SubHeader } from 'components/Layout';
import { ErrorModal, UploadModal } from 'components/Modal';
import { ToolBar } from 'components/ToolBar';

import messages from './messages';

export class DataTable extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static contextTypes = {
    intl: React.PropTypes.object.isRequired,
  };

  render() {
    const { searchModal, page, containerWidth, containerHeight,
      data, cleanData, changedRows,
      query, loading, importing, exporting, error,
      add, save, exportRows,
      importRows, importRowsSuccess, importRowsFailure,
      searchOpen, searchClose, uploadOpen, uploadClose,
      searchVisible, uploadVisible,
      clearError
    } = this.props;
    const { intl } = this.context;

    return (
      <Container>
        <ErrorModal error={error} clearError={clearError} />
        {searchModal}
        <UploadModal
          intl={intl}
          action="/api/v0/misc/import"
          uploading={importing}
          start={importRows}
          success={importRowsSuccess}
          failed={importRowsFailure}
          cancel={uploadClose}
          finished={uploadClose}
          visible={uploadVisible} />
        <Spin size="large" spinning={loading} tip={<SpinTip />}>
          <StyledLayout>
            <SubHeader>
              <ToolBar
                add={() => { message.info(intl.formatMessage(messages.addRowMessage)); add() }}
                query={query}
                save={() => save(changedRows)}
                search={searchOpen}
                importRows={uploadOpen}
                exportRows={() => exportRows(data)}
                exporting={exporting} />
            </SubHeader>
            <StyledContent className={className}>
              {page}
            </StyledContent>
          </StyledLayout>
        </Spin>
      </Container>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  data: selectData(),
  cleanData: selectCleanData(),
  changedRows: selectChangedRows(),
  query: selectQuery(),
  loading: selectLoading(),
  importing: selectImporting(),
  exporting: selectExporting(),
  searchVisible: selectSearchVisible(),
  uploadVisible: selectUploadVisible(),
  error: selectError(),
});

function mapDispatchToProps(dispatch) {
  return {
    save: rows => dispatch(save(rows)),
    exportRows: rows => dispatch(exportRows(rows)),
    importRows: () => dispatch(importRows()),
    importRowsSuccess: rows => dispatch(importRowsSuccess(rows)),
    importRowsFailure: error => dispatch(importRowsFailure(error)),
    add: () => dispatch(addRow()),
    searchOpen: () => dispatch(searchOpen()),
    searchClose: () => dispatch(searchClose()),
    uploadOpen: () => dispatch(uploadOpen()),
    uploadClose: () => dispatch(uploadClose()),
    clearError: () => dispatch(clearError()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DataTable);
