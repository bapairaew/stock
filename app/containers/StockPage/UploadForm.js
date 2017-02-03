import React from 'react';
import { Form, Input } from 'antd';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

const FormItem = Form.Item;

const UploadForm = ({ form: { getFieldDecorator } }) => (
  <Form>
    <FormItem label={<FormattedMessage {...messages.receiptId} />}>
      {getFieldDecorator('receiptId')(
        <Input />
      )}
    </FormItem>
  </Form>
);

export default Form.create()(UploadForm);
