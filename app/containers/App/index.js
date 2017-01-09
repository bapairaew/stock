import React from 'react';
import styled from 'styled-components';
import Nav from 'components/Nav';
import { Layout } from 'antd';
import { Header, Content } from 'components/StyledAntd';

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
          <Header>
            <Nav pathname={pathname} />
          </Header>
          <Content>
            {React.Children.toArray(this.props.children)}
          </Content>
        </Layout>
      </Container>
    );
  }
}
