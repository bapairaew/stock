import React from 'react';
import { Menu, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import Link from './Link';
import styled from 'styled-components';
import className from './menuStyle';

import messages from './messages';

const _Menu = Menu;

const StyledMenu = styled(_Menu)`
  background: #108ee9 !important;
`;

const StyledMenuItem = styled(Menu.Item)`
  &:hover {
    box-shadow: 0 0 0 100px rgba(0,0,0,.03) inset;
    border-bottom: none !important;
  }
`;

class Nav extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    pathname: React.PropTypes.string,
  };

  render() {
    const { pathname } = this.props;
    const username = window.sessionStorage.getItem('username');
    return (
      <StyledMenu selectedKeys={[pathname]} mode="horizontal">
        <StyledMenuItem className={className} key="/a/home"><Link to="/a/home" icon="dingding" message="home" /></StyledMenuItem>
        <StyledMenuItem className={className} key="/a/d/sell"><Link to="/a/d/sell" icon="upload" message="sell" /></StyledMenuItem>
        <StyledMenuItem className={className} key="/a/d/buy"><Link to="/a/d/buy" icon="download" message="buy" /></StyledMenuItem>
        <StyledMenuItem className={className} key="/a/d/products"><Link to="/a/d/products" icon="switcher" message="products" /></StyledMenuItem>
        { username !== 'admin' ? null : (
          <StyledMenuItem className={className} key="/a/register"><Link to="/a/register" icon="user" message="register" /></StyledMenuItem>
        )}
        <StyledMenuItem style={{ float: 'right' }} className={className} key="">
          <a style={{ color: '#fff' }} href="/api/v0/users/logout"
            onClick={e => {
              // TODO: ajax
              e.preventDefault();
              window.sessionStorage.removeItem('username');
              window.location.assign('/api/v0/users/logout');
            }}>
            <Icon type="logout" />
            <FormattedMessage {...messages.logout} />
          </a>
        </StyledMenuItem>
      </StyledMenu>
    );
  }
}

export default Nav;
