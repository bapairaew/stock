import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Helmet from 'react-helmet';
import { selectQuery, selectProducts, selectLoading, selectError } from './selectors';
import { fetchProducts } from './actions';
import { FormattedMessage } from 'react-intl';
import ProductCard from 'components/ProductCard';
import { ErrorBox } from 'components/Layout';
import className from './inputStyle';
import { Form, Icon, Input, Button, Spin } from 'antd';
import { StyledForm, CardContainer, StyledCard, Body, Details, H1, H2, H3, Number, Remaining } from './Elements';
const FormItem = Form.Item;

import messages from './messages';

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
            <div className={className}>
              {getFieldDecorator('text', { initialValue: query.get('text') })(
                <Input addonBefore={<Icon type="search" />} placeholder={intl.formatMessage(messages.product)} />
              )}
            </div>
          </FormItem>
        </StyledForm>
        <Spin spinning={loading}>
          <CardContainer>
            <ErrorBox visible={!!error}>{error + ''}</ErrorBox>
            {products.map((p, i) => (
              <StyledCard key={i}>
                <Body value={p.get('buy') - p.get('sell')}>
                  <Details>
                    <H1>{p.getIn(['product', 'name'])}</H1>
                    <H2>{p.getIn(['product', 'model'])}</H2>
                    <H3>{p.getIn(['product', 'id'])}</H3>
                  </Details>
                  <Remaining>
                    <p><FormattedMessage {...messages.remaining} /></p>
                    <Number>{p.get('buy') - p.get('sell')}</Number>
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
