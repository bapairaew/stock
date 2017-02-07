import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Form, Input, DatePicker, Checkbox } from 'antd';
import moment from 'moment';
import { defaultProps } from 'components/DatePicker';
import { SubmitCancelModal } from 'components/Modal';
import { selectEditVisible, selectEditingItems } from 'containers/DataTable/selectors';
import { editClose, batchEditItems, setEditingItems } from 'containers/DataTable/actions';
import { fromJS } from 'immutable';
import styled from 'styled-components';

import messages from './messages';

const FormItem = Form.Item;

const Well = styled.div`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid rgba(0,0,0,.2);
`;

export class Modal extends React.PureComponent {
  render() {
    const { form: { getFieldDecorator }, editingItems, batchEditItems, editVisible, editClose, setEditingItems } = this.props;
    return (
      <SubmitCancelModal
        title={<FormattedMessage {...messages.edit} />}
        visible={editVisible}
        submit={() => {
          const { order, date, receiptId, amount, price, removed } = this.props.form.getFieldsValue();
          editClose();
          batchEditItems({ editingItems, order, date, receiptId, amount, price, removed });
          setEditingItems(fromJS([]))
        }}
        cancel={editClose}>
        <Well>
          <FormattedMessage {...messages.editingMessageTemplate} values={{ numberOfRows: editingItems.count() + '' }} />
        </Well>
        <Form>
          <FormItem>
            {getFieldDecorator('removed')(
              <Checkbox><FormattedMessage {...messages.removeTheseRows} /></Checkbox>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('order')(
              <Checkbox><FormattedMessage {...messages.orderTheseRows} /></Checkbox>
            )}
          </FormItem>
          <FormItem label={<FormattedMessage {...messages.date} />}>
            {getFieldDecorator('date')(
              <DatePicker style={{ width: '100%' }} {...defaultProps} allowClear={true} />
            )}
          </FormItem>
          <FormItem label={<FormattedMessage {...messages.receiptId} />}>
            {getFieldDecorator('receiptId')(
              <Input />
            )}
          </FormItem>
          <FormItem label={<FormattedMessage {...messages.amount} />}>
            {getFieldDecorator('amount')(
              <Input type="number" />
            )}
          </FormItem>
          <FormItem label={<FormattedMessage {...messages.price} />}>
            {getFieldDecorator('price')(
              <Input type="number" />
            )}
          </FormItem>
        </Form>
      </SubmitCancelModal>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  editVisible: selectEditVisible(),
  editingItems: selectEditingItems(),
});

function mapDispatchToProps(dispatch) {
  return {
    editClose: () => dispatch(editClose()),
    batchEditItems: payload => dispatch(batchEditItems(payload)),
    setEditingItems: items => dispatch(setEditingItems(items)),
  };
}

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(Modal));
