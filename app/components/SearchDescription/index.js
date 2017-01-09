import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styled from 'styled-components';
import moment from 'moment';

const SearchDescriptionContainer = styled.span`
  color: rgba(255,255,255,.7);
  margin-right: 10px;
`;

const formatDate = (date) => (date && moment(date).format('DD/MM/YYYY')) || '';
const getDateRageText = (start, end) => ((start && end) && `${formatDate(start)} - ${formatDate(end)}`) || '';
const getSearchText = (text) => (text && `"${text}" `) || '';

const getQueryDisplayString = (query) => (query &&
  `${getSearchText(query.get('text'))}${getDateRageText(query.get('startDate'), query.get('endDate'))}`) || '';

function SearchDescription({ query }) {
  return (
    <SearchDescriptionContainer>
      <FormattedMessage {...messages.displaying} />{`: ${getQueryDisplayString(query)}`}
    </SearchDescriptionContainer>
  );
}

export default SearchDescription;
