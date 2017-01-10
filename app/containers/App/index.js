import React from 'react';
import styled from 'styled-components';
import Nav from 'components/Nav';
import { Layout } from 'antd';
import { StyledHeader, StyledContent } from 'components/Layout';

const Container = styled.div`
  height: 100%;
`;

export default class App extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    children: React.PropTypes.node,
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  render() {
    const { router: { location: { pathname } } } = this.context;
    return (
      <Container>
        <Layout>
          <StyledHeader>
            <Nav pathname={pathname} />
          </StyledHeader>
          <StyledContent>
            {React.Children.toArray(this.props.children)}
          </StyledContent>
        </Layout>
      </Container>
    );
  }
}
