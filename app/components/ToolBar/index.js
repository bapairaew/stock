import React from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';
import SearchDescription from 'components/SearchDescription';

import messages from './messages';

const ToolBarContainer = styled.div`
  height: 46px;
  display: flex;
  align-items: center;
  padding: 0 10px !important;
`;

const RightMenu = styled.div`
  flex-grow: 1;
  text-align: right;
`;

const Separator = styled.div`
  width: 1px;
  height: 50%;
  margin: 0 9px 0 0px;
  background: rgba(0,0,0,.1);
`;

const _Button = Button;
const StyledButton = styled(_Button)`
  margin-right: 10px;
`;

export const ToolBar = ({ query, add, save, edit, search, importRows, exportRows, exporting }) => (
  <ToolBarContainer>
    <StyledButton type="primary" icon="save" onClick={save}><FormattedMessage {...messages.save} /></StyledButton>
    <Separator />
    <StyledButton type="primary" icon="plus-circle-o" onClick={add}><FormattedMessage {...messages.add} /></StyledButton>
    <StyledButton type="primary" icon="addfolder" onClick={importRows}><FormattedMessage {...messages.import} /></StyledButton>
    <Separator />
    <StyledButton type="primary" icon="edit" onClick={edit}><FormattedMessage {...messages.edit} /></StyledButton>
    <Separator />
    <StyledButton type="primary" icon="file-excel" loading={exporting} onClick={exportRows}><FormattedMessage {...messages.saveAsExcel} /></StyledButton>
    <RightMenu>
      <SearchDescription query={query} />
      <StyledButton type="primary" icon="search" onClick={search}>
        <FormattedMessage {...messages.search} />
      </StyledButton>
    </RightMenu>
  </ToolBarContainer>
);
