import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Form, Input } from 'antd';
import moment from 'moment';
import { SubmitCancelModal } from 'components/Modal';
import { selectQuery, selectSearchVisible } from 'containers/DataTable/selectors';
import { searchClose, fetch } from 'containers/DataTable/actions';

import messages from './messages';

const FormItem = Form.Item;

export class Modal extends React.PureComponent {
  render() {
    const { form: { getFieldDecorator }, searchVisible, searchClose, query, fetch } = this.props;
    return (
      <SubmitCancelModal
        title={<FormattedMessage {...messages.search} />}
        visible={searchVisible}
        submit={() => {
          const { text } = this.props.form.getFieldsValue();
          searchClose();
          fetch({ text });
        }}
        cancel={searchClose}>
        <Form>
          <FormItem label={<FormattedMessage {...messages.spare} />}>
            {getFieldDecorator('text', { initialValue: query.get('text') })(
              <Input />
            )}
          </FormItem>
        </Form>
      </SubmitCancelModal>
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
