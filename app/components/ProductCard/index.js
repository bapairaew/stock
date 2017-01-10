import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import request from 'utils/request';
import qs from 'qs';

import messages from './messages';

const _Card = ({ ...props }) => (
  <Card {...props} bodyStyle={{ padding: 15 }} />
);

export const StyledCard = styled(_Card)`
  width: 180px;
  margin: 9px;
`;

class ProductCard extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  state = {
    loading: false,
    stock: 0,
  };

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
    const { product } = this.props;
    const { product: newProduct } = nextProps;
    if (!product || product.get('id') !== newProduct.get('id')) {
      this.updateStock(newProduct);
    }
  }

  render() {
    const { product, diff } = this.props;
    const { stock, loading } = this.state;
    return (
      <StyledCard loading={loading}>
        <h3>{product.get('id')}</h3>
        <h4>{product.get('name')}</h4>
        <p><FormattedMessage {...messages.remaining} />: {stock + diff}</p>
      </StyledCard>
    );
  }
}

export default ProductCard;
