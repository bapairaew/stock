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
          const { id, name, model, removed } = this.props.form.getFieldsValue();
          editClose();
          batchEditItems({ editingItems, id, name, model, removed });
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
          <FormItem label={<FormattedMessage {...messages.productId} />}>
            {getFieldDecorator('id')(
              <Input />
            )}
          </FormItem>
          <FormItem label={<FormattedMessage {...messages.productName} />}>
            {getFieldDecorator('name')(
              <Input />
            )}
          </FormItem>
          <FormItem label={<FormattedMessage {...messages.modelName} />}>
            {getFieldDecorator('model')(
              <Input />
            )}
          </FormItem>
        </Form>
      </SubmitCancelModal>
    );
  }
}

const editor = (row, { id, name, model, removed }, idx) => {
  let editedRow = row;
  if (id) {
    editedRow = editedRow.update('id', val => id);
  }
  if (name) {
    editedRow = editedRow.update('name', val => name);
  }
  if (model) {
    editedRow = editedRow.update('model', val => model);
  }
  return editedRow = editedRow.update('removed', val => removed);
};

const mapStateToProps = createStructuredSelector({
  editVisible: selectEditVisible(),
  editingItems: selectEditingItems(),
});

function mapDispatchToProps(dispatch) {
  return {
    editClose: () => dispatch(editClose()),
    batchEditItems: payload => dispatch(batchEditItems(payload, editor)),
    setEditingItems: items => dispatch(setEditingItems(items)),
  };
}

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(Modal));
