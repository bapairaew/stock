import React from 'react';
import { Form, Button, Input } from 'antd';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import messages from './messages';

const FormItem = Form.Item;

const StyledFormItem = styled(FormItem)`
  height: 29px !important;
`;

const _Input = Input;
const StyledInput = styled(_Input)`
  border-radius: 0 4px 4px 0 !important;
  background: rgb(14, 127, 207) !important;
  border-color: #108ee9 !important;
  color: #fff !important;
  vertical-align: top;
  width: 90px !important;
  text-align: right;
`;

const _Button = Button;
const StyledButton = styled(_Button)`
  border-radius: 4px 0 0 4px !important;
`;

const PrefixFormattedMessage = styled.div`
  color: #fff;
  margin-top: -2px;
`;

const previousYear = (new Date()).getFullYear() - 1;

class ReportButton extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { loading, type = 'full', onClick, form: { getFieldDecorator } } = this.props;
    const icon = type === 'full' ? 'file-text' : 'text';
    const message = type === 'full' ? messages.makeFullReport : messages.makeSummaryReport;
    return (
      <Form inline>
        <StyledButton type="primary" icon="file-text" loading={loading} onClick={() => onClick(this.props.form.getFieldValue('year'))}>
          <FormattedMessage {...message} />
        </StyledButton>
        <StyledFormItem>
          {getFieldDecorator('year', { initialValue: previousYear })(
            <StyledInput prefix={<PrefixFormattedMessage><FormattedMessage {...messages.year} />:</PrefixFormattedMessage>}
              size="default" type="number" placeholder="Year" />
          )}
        </StyledFormItem>
      </Form>
    );
  }
}

export default Form.create()(ReportButton);
