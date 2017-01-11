import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { Container, ErrorBox } from 'components/Layout';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { selectLoading, selectError } from './selectors';
import { login } from './actions';
import messages from './messages';
import { Card, Form, Icon, Input, Button, Spin } from 'antd';
const FormItem = Form.Item;

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const _Card = Card;
const StyledCard = styled(_Card)`
  width: 300px;
`;

const _Button = Button;
const StyledButton = styled(_Button)`
  width: 100%;
`;

const Logo = styled.div`
  font-size: 80px;
  width: 100%;
  margin: 15px 0;
  text-align: center;
`;

export class LoginPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static contextTypes = {
    intl: React.PropTypes.object.isRequired,
  };

  render() {
    const { intl } = this.context;
    const { form: { getFieldDecorator }, login, loading, error } = this.props;

    return (
      <StyledContainer>
        <Helmet title={intl.formatMessage(messages.title)} />
        <ErrorBox visible={!!error}>{error + ''}</ErrorBox>
        <Spin spinning={loading}>
          <StyledCard>
            <Logo>
              <Icon type="dingding" />
            </Logo>
            <Form onSubmit={e => {
                e.preventDefault();
                const { username, password } = this.props.form.getFieldsValue();
                login(username, password);
              }}>
              <FormItem>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: intl.formatMessage(messages.usernameEmptyMessage) }],
                })(
                  <Input addonBefore={<Icon type="user" />} placeholder={intl.formatMessage(messages.username)} />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: intl.formatMessage(messages.passwordEmptyMessage) }],
                })(
                  <Input addonBefore={<Icon type="lock" />} type="password" placeholder={intl.formatMessage(messages.password)} />
                )}
              </FormItem>
              <FormItem>
                <StyledButton type="primary" htmlType="submit">
                  <FormattedMessage {...messages.signin} />
                </StyledButton>
              </FormItem>
            </Form>
          </StyledCard>
        </Spin>
      </StyledContainer>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: selectLoading(),
  error: selectError(),
});

function mapDispatchToProps(dispatch) {
  return {
    login: (username, password) => dispatch(login(username, password)),
  };
}

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(LoginPage));
