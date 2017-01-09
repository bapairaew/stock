import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Form, Input, DatePicker } from 'antd';
import moment from 'moment';
import { defaultProps } from 'components/DatePicker';
import { SearchModal } from 'components/Modal';
import { selectQuery, selectSearchVisible } from 'containers/DataTable/selectors';
import { searchClose, fetch } from 'containers/DataTable/actions';

import messages from './messages';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

export class Modal extends React.PureComponent {
  render() {
    const { form: { getFieldDecorator }, searchVisible, searchClose, query, fetch } = this.props;
    return (
      <SearchModal
        visible={searchVisible}
        submit={() => {
          const { text, receiptId, dateRange } = this.props.form.getFieldsValue();
          searchClose();
          fetch({ text, receiptId, startDate: dateRange[0].toDate(), endDate: dateRange[1].toDate() });
        }}
        cancel={searchClose}>
        <Form>
          <FormItem label={<FormattedMessage {...messages.spare} />}>
            {getFieldDecorator('text', { initialValue: query.get('text') })(
              <Input />
            )}
          </FormItem>
            <FormItem label={<FormattedMessage {...messages.receiptId} />}>
              {getFieldDecorator('receiptId', { initialValue: query.get('receiptId') })(
                <Input />
              )}
            </FormItem>
          <FormItem label={<FormattedMessage {...messages.dateRange} />}>
            {getFieldDecorator('dateRange', {
              type: 'array',
              initialValue: [moment(query.get('startDate')), moment(query.get('endDate'))]
            })(
              <RangePicker style={{ width: '100%' }} {...defaultProps} />
            )}
          </FormItem>
        </Form>
      </SearchModal>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  query: selectQuery(),
  searchVisible: selectSearchVisible(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetch: query => dispatch(fetch(query)),
    searchClose: () => dispatch(searchClose()),
  };
}

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(Modal));
