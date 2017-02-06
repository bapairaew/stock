import React from 'react';
import { Form, Input, DatePicker } from 'antd';
import { FormattedMessage } from 'react-intl';
import { defaultProps } from 'components/DatePicker';
import styled from 'styled-components';
import moment from 'moment';

import messages from './messages';

// NOT WORKING
// const StyledDatePicker = styled(DatePicker)`
//   width: 100%;
// `;

const FormItem = Form.Item;

const UploadForm = ({ form: { getFieldDecorator } }) => (
  <Form>
    <FormItem label={<FormattedMessage {...messages.receiptId} />}>
      {getFieldDecorator('receiptId')(
        <Input />
      )}
    </FormItem>
    <FormItem label={<FormattedMessage {...messages.date} />}>
      {getFieldDecorator('date', { initialValue: moment(new Date()) })(
        <DatePicker style={{ width: '100%' }} {...defaultProps} />
      )}
    </FormItem>
  </Form>
);

export default Form.create()(UploadForm);
