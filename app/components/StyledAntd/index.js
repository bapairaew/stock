import styled from 'styled-components';
import { Layout } from 'antd';

export const Header = styled(Layout.Header)`
  padding: 0 !important;
  height: 46px !important;
`;

const _Content = Content;
export const Content = styled(Layout.Content)`
  background: #fff !important;
`;
