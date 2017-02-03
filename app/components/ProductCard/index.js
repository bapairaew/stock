import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import request from 'utils/request';
import qs from 'qs';
import ReactDOM from 'react-dom';

import messages from './messages';

const _Card = ({ value, focused, ...props }) => (
  <Card {...props} bodyStyle={{ padding: 0 }} />
);

const StyledCard = styled(_Card)`
  width: 180px;
  margin: 9px;
  color: rgba(255,255,255,.8);
  box-shadow: ${props => props.focused ? '0 0 10px rgba(0,0,0,.5)' : ''};
  transform: ${props => props.focused ? 'scale(1.1)' : 'scale(1)'};
  z-index: ${props => props.focused ? 999 : 1};
`;

const Body = styled.div`
  background: ${props => props.value === 0 ? '#bbb' : props.value > 0 ? '#8bc34a' : '#f44336'};
`;

const Details = styled.div`
  padding: 15px 10px;
`;

const H4 = styled.h4`
  font-weight: 300;
`;

const Remaining = styled.div`
  padding: 10px;
  background: rgba(0,0,0,.1);
  box-shadow: 0 0 3px rgba(0,0,0,.3);
`;

class ProductCard extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  state = {
    loading: false,
    stock: 0,
  };

  shouldComponentUpdate(newProps, newState) {
    return this.props.product !== newProps.product ||
      this.props.diff !== newProps.diff ||
      this.state.stock !== newProps.stock ||
      this.state.loading !== newProps.loading;
  }

  updateStock(product) {
    this.setState({ loading: true });
    const { endpoint } = this.props;
    request(endpoint(product)).then(p => {
      this.setState({ loading: false, stock: p.buy - p.sell });
    });
  }

  componentDidMount() {
    const { product } = this.props;
    this.updateStock(product);
  }

  componentWillReceiveProps(nextProps) {
    const { product, focused } = this.props;
    const { product: newProduct } = nextProps;
    if (!product || product.get('id') !== newProduct.get('id')) {
      this.updateStock(newProduct);
    }

    // TODO: for some reason screen scrolled to incorrect card when focused but to correct one when edited
    if (focused) {
      this._card.scrollIntoView();
    }
  }

  render() {
    const { product, diff, focused } = this.props;
    const { stock, loading } = this.state;
    return (
      <StyledCard ref={e => { if (e) { this._card = ReactDOM.findDOMNode(e); } }}
        loading={loading} focused={focused} value={stock + diff}>
        <Body value={stock + diff}>
          <Details>
            <h3>{`${product.get('name')} (${product.get('model')})`}</h3>
            <H4>{product.get('id')}</H4>
          </Details>
          <Remaining value={stock + diff}><FormattedMessage {...messages.remaining} />: {stock + diff}</Remaining>
        </Body>
      </StyledCard>
    );
  }
}

export default ProductCard;
