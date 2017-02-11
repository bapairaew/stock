import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { selectQuery, selectProducts, selectLoading, selectError } from './selectors';
import { fetchProducts } from './actions';
import { FormattedMessage } from 'react-intl';
import ProductCard from 'components/ProductCard';
import { ErrorBox, SubHeader } from 'components/Layout';
import className from './inputStyle';
import { Form, Icon, Input, Button, Spin } from 'antd';
import { StyledForm, CardContainer, StyledCard, Body, Details, H1, H2, H3, Number, Remaining, ReportButtonContainer } from './Elements';
import { selectMakingFullReport, selectMakingSummaryReport, selectError as selectAppError } from 'containers/App/selectors';
import { makeFullReport, makeSummaryReport } from 'containers/App/actions';
import ReportButton from 'components/ReportButton';
import { ToolBar } from 'components/ToolBar';

import messages from './messages';

const FormItem = Form.Item;

export class HomePage extends React.PureComponent {

  static contextTypes = {
    intl: React.PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { fetch } = this.props;
    fetch({ text: 'JOMTHAI', limit: 27 });
  }

  render() {
    const { intl } = this.context;
    const { fetch, products, loading, error, query, appError,
      makingFullReport, makeFullReport,
      makingSummaryReport, makeSummaryReport,
      form: { getFieldDecorator } } = this.props;

    return (
      <div>
        <Helmet title={intl.formatMessage(messages.title)} />
        <SubHeader>
          <ToolBar>
            <ReportButton type="full" loading={makingFullReport} onClick={year => makeFullReport(year)} />
            <ReportButton type="summary" loading={makingSummaryReport} onClick={year => makeSummaryReport(year)} />
          </ToolBar>
        </SubHeader>
        <ErrorBox visible={!!appError}>{appError + ''}</ErrorBox>
        <StyledForm onSubmit={e => {
            e.preventDefault();
            fetch({ text: this.props.form.getFieldValue('text'), limit: 27 })
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
                <Link to={`/a/product/${p.getIn(['product', '_id'])}`}>
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
                </Link>
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
  appError: selectAppError(),
  makingFullReport: selectMakingFullReport(),
  makingSummaryReport: selectMakingSummaryReport(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetch: query => dispatch(fetchProducts(query)),
    makeFullReport: year => dispatch(makeFullReport(year)),
    makeSummaryReport: year => dispatch(makeSummaryReport(year)),
  };
}

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(HomePage));
