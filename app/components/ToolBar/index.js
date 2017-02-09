import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';

export const ToolBar = styled.div`
  height: 46px;
  display: flex;
  align-items: center;
  padding: 0 10px !important;
`;

const Tool = styled.div`
  display: flex;
`;

export const LeftTool = styled(Tool)`
  margin-right: auto;
`;

export const RightTool = styled(Tool)`
  margin-left: auto;
`;

export const Separator = styled.div`
  width: 1px;
  height: 20px;
  margin: 5px 9px 0 0;
  background: rgba(0,0,0,.1);
`;

const _Button = Button;
export const ToolBarButton = styled(_Button)`
  margin-right: 10px;
`;
