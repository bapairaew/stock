import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

export default class HomePage extends React.PureComponent {

  static contextTypes = {
    intl: React.PropTypes.object.isRequired,
  };

  render() {
    return (
      <div>
        <Helmet title={this.context.intl.formatMessage(messages.title)} />
        <h1>
          <FormattedMessage {...messages.header} />
        </h1>
      </div>
    );
  }
}
