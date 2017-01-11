import React from 'react';
import { Container } from 'components/Layout';

export default class Root extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    children: React.PropTypes.node,
  };

  render() {
    return (
      <Container>
        {React.Children.toArray(this.props.children)}
      </Container>
    );
  }
}
