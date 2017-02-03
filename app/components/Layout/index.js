import styled from 'styled-components';
import { Layout } from 'antd';

const _Layout = Layout;
export const StyledLayout = styled(_Layout)`
  background: #fff !important;
`;

// fix layout with side bar in chrome windows is broken (.ant-layout.ant-layout-has-sider is not added)
export const StyledLayoutWithSideBar = styled(StyledLayout)`
  -webkit-box-orient: horizontal !important;
  -webkit-box-direction: normal !important;
  -ms-flex-direction: row !important;
  flex-direction: row !important;
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

export const ErrorBox = styled.div`
  display: ${props => props.visible ? 'block' : 'none'};
  width: ${props => `${props.width || 300}px`};
  padding: 15px;
  margin: 20px 0;
  background: #f00;
  color: #fff;
`;

export const SuccessBox = styled.div`
  display: ${props => props.visible ? 'block' : 'none'};
  width: ${props => `${props.width || 300}px`};
  padding: 15px;
  margin: 20px 0;
  background: #8bc34a;
  color: #fff;
`;
