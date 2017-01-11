import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { Container, ErrorBox, SuccessBox } from 'components/Layout';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { selectLoading, selectError, selectSuccess } from './selectors';
import { register } from './actions';
import messages from './messages';
import { Card, Form, Icon, Input, Button, Spin } from 'antd';
const FormItem = Form.Item;

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 500px;
`;

const _Card = Card;
const StyledCard = styled(_Card)`
  width: 500px;
`;

const _Button = Button;
const StyledButton = styled(_Button)`
  width: 100%;
`;

export class RegisterPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static contextTypes = {
    intl: React.PropTypes.object.isRequired,
  };

  render() {
    const { intl } = this.context;
    const { form: { getFieldDecorator }, register, loading, error, success } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 6,
      },
    };

    return (
      <StyledContainer>
        <Helmet title={intl.formatMessage(messages.title)} />
        <ErrorBox width={500} visible={!!error}>{error + ''}</ErrorBox>
        <SuccessBox width={500} visible={success}>
          <FormattedMessage {...messages.successMessage} />
        </SuccessBox>
        <Spin spinning={loading}>
          <StyledCard title={intl.formatMessage(messages.register)}>
            <Form onSubmit={e => {
                e.preventDefault();
                const { username, password } = this.props.form.getFieldsValue();
                register(username, password);
              }}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage {...messages.username} />}>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: intl.formatMessage(messages.usernameEmptyMessage) }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage {...messages.password} />}>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: intl.formatMessage(messages.passwordEmptyMessage) }],
                })(
                  <Input type="password" />
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <StyledButton type="primary" htmlType="submit">
                  <FormattedMessage {...messages.register} />
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
  success: selectSuccess(),
});

function mapDispatchToProps(dispatch) {
  return {
    register: (username, password) => dispatch(register(username, password)),
  };
}

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(RegisterPage));
