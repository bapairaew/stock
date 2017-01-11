import React from 'react';
import Nav from 'components/Nav';
import { StyledLayout, StyledHeader, StyledContent, Container } from 'components/Layout';

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
        <StyledLayout>
          <StyledHeader>
            <Nav pathname={pathname} />
          </StyledHeader>
          <StyledContent>
            {React.Children.toArray(this.props.children)}
          </StyledContent>
        </StyledLayout>
      </Container>
    );
  }
}
