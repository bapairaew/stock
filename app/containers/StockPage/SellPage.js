// Fix issue that navigating between same page with different params meter
// does not trigger componentDidMount which consequently make the page not
// re-fetch the data

import React from 'react';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectChangedRows } from 'containers/DataTable/selectors';
import StockPage from './index';

import messages from './messages';

export class SellPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static contextTypes = {
    intl: React.PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.props.router.setRouteLeaveHook(
      this.props.route,
      () => {
        if (this.props.changedRows.count() > 0) {
          return this.context.intl.formatMessage(messages.unsavedMessage);
        }
      }
    );
  }

  render() {
    return (
      <div>
        <Helmet title={this.context.intl.formatMessage(messages.sellTitle)} />
        <StockPage {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  changedRows: selectChangedRows(),
});

export default withRouter(connect(mapStateToProps, null)(SellPage));
