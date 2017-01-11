import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Container } from 'components/Layout';
import styled from 'styled-components';

import messages from './messages';

const StyledContainer = styled(Container)`
  background: #108ee9;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Box = styled.div`
  background: rgba(255,255,255,.3);
  width: 350px;
  height: 400px;
  border: 10px solid #000;
  text-align: center;
`;

const Heading = styled.h1`
  color: #000;
  font-size: 90px;
  margin: 30px 50px;
  font-weight: 900;
  border-bottom: 10px solid #000;
  padding-bottom: 20px;
`;

const Message = styled.p`
  color: #000;
  font-size: 30px;
  margin: 45px 20px;
  font-weight: 800;
  text-transform: uppercase;
  word-spacing: 8px;
`;

export default class NotFound extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static contextTypes = {
    intl: React.PropTypes.object.isRequired,
  };

  render() {
    const { intl } = this.context;
    return (
      <StyledContainer>
        <Helmet title={intl.formatMessage(messages.title)} />
        <Box>
          <Heading>404</Heading>
          <Message>
            <FormattedMessage {...messages.message} />
          </Message>
        </Box>
      </StyledContainer>
    );
  }
}
