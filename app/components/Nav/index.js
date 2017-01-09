import React from 'react';
import { Menu } from 'antd';
import Link from './Link';
import styled from 'styled-components';
import className from './menuStyle';

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
    return (
      <StyledMenu selectedKeys={[pathname]} mode="horizontal">
        <StyledMenuItem className={className} key="/"><Link to="/" icon="dingding" message="home" /></StyledMenuItem>
        <StyledMenuItem className={className} key="/d/sell"><Link to="/d/sell" icon="upload" message="sell" /></StyledMenuItem>
        <StyledMenuItem className={className} key="/d/buy"><Link to="/d/buy" icon="download" message="buy" /></StyledMenuItem>
        <StyledMenuItem className={className} key="/d/products"><Link to="/d/products" icon="switcher" message="products" /></StyledMenuItem>
      </StyledMenu>
    );
  }
}

export default Nav;
