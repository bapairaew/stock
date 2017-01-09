import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: 20px;
  font-size: 16px;
`;

function SpinTip() {
  return (
    <Container>
      <FormattedMessage {...messages.loading} />
    </Container>
  );
}

export default SpinTip;
