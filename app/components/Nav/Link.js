import React from 'react';
import { Icon } from 'antd';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import messages from './messages';

const StyledLink = styled(Link)`
  color: #fff !important;
`;

const _Icon = Icon;
const StyledIcon = styled(_Icon)`
  color: #fff;
`;

class AppLink extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    to: React.PropTypes.string,
    icon: React.PropTypes.string,
    message: React.PropTypes.string,
  };

  render() {
    const { to, icon, message } = this.props;
    return (
      <StyledLink to={to}>
        <StyledIcon type={icon} />
        <FormattedMessage {...messages[message]} />
      </StyledLink>
    );
  }
}

export default AppLink;
