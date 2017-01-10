import styled from 'styled-components';
import { Layout } from 'antd';

const _Layout = Layout;
export const StyledLayout = styled(_Layout)`
  background: #fff !important;
`;

export const StyledHeader = styled(Layout.Header)`
  padding: 0 !important;
  height: 46px !important;
`;

export const StyledContent = styled(Layout.Content)`
  background: #fff !important;
`;

export const StyledSider = styled(Layout.Sider)`
  background-color: #eee !important;
  border-right: 1px solid #e9e9e9;
`;

export const Container = styled.div`
  height: 100%;
  width: 100%;
`;

export const SubHeader = styled(StyledHeader)`
  background-color: rgb(15,133,217) !important;
`;
