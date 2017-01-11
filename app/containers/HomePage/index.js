import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Helmet from 'react-helmet';
import { selectQuery, selectProducts, selectLoading, selectError } from './selectors';
import { fetchProducts } from './actions';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import ProductCard from 'components/ProductCard';
import { ErrorBox } from 'components/Layout';
import { Card, Form, Icon, Input, Button, Spin } from 'antd';
const FormItem = Form.Item;

import messages from './messages';

const CardContainer = styled.div`
  margin: 0 auto;
  width: 1024px;
  min-height: 600px;
  display: flex;
  flex-wrap: wrap;
`;

const _Card = Card;
const StyledCard = styled(_Card)`
  margin: 20px;
  max-height: 200px;
`;

const Heading = styled.div`
  padding: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  border-bottom: 1px solid #e9e9e9;
`;

const Body = styled.div`
  padding: 10px 15px;
`;

const _Form = Form;
const StyledForm = styled(_Form)`
  width: 980px;
  margin: 30px auto;
`;

const H1 = styled.h1`
  font-weight: 100;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const H3 = styled.h3`
  font-weight: 100;
`;

const P = styled.p`
   margin-top: 10px;
`;

export const Remaining = styled.p`
  margin: 10px 0;
  color: ${props => props.value >= 0 ? '#8bc34a' : '#f00'};
`;

// color: ${props => props.value >= 0 ? '#8bc34a' : '#f00'};

export class HomePage extends React.PureComponent {

  static contextTypes = {
    intl: React.PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { fetch } = this.props;
    fetch({ text: 'ชุดยาง', limit: 9 });
  }

  render() {
    const { intl } = this.context;
    const { fetch, products, loading, error, query, form: { getFieldDecorator } } = this.props;

    return (
      <div>
        <Helmet title={intl.formatMessage(messages.title)} />
        <StyledForm onSubmit={e => {
            e.preventDefault();
            fetch({ text: this.props.form.getFieldValue('text'), limit: 9 })
          }}>
          <FormItem>
            {getFieldDecorator('text', { initialValue: query.get('text') })(
              <Input addonBefore={<Icon type="search" />} placeholder={intl.formatMessage(messages.product)} />
            )}
          </FormItem>
        </StyledForm>
        <Spin spinning={loading}>
          <CardContainer>
            <ErrorBox visible={!!error}>{error + ''}</ErrorBox>
            {products.map((p, i) => (
              <StyledCard key={i} style={{ width: 300 }} bodyStyle={{ padding: 0 }}>
                <Heading>
                  <H1>{p.getIn(['product', 'name'])}</H1>
                  <H3>{p.getIn(['product', 'model'])}</H3>
                </Heading>
                <Body>
                  <p style={{}}>{p.getIn(['product', 'id'])}</p>
                  <Remaining value={p.get('buy') - p.get('sell')}>
                    <FormattedMessage {...messages.remaining} />: {p.get('buy') - p.get('sell')}
                  </Remaining>
                </Body>
              </StyledCard>
            ))}
          </CardContainer>
        </Spin>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  query: selectQuery(),
  products: selectProducts(),
  loading: selectLoading(),
  error: selectError(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetch: query => dispatch(fetchProducts(query)),
  };
}

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(HomePage));
