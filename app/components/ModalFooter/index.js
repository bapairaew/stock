import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';
import messages from './messages';

function ModalFooter({ cancel, submit }) {
  return (
    <div>
      <Button key="cancel" type="ghost" onClick={cancel}>
        <FormattedMessage {...messages.cancel} />
      </Button>
      <Button key="submit" type="primary" onClick={submit}>
        <FormattedMessage {...messages.submit} />
      </Button>
    </div>
  );
}

export default ModalFooter;
