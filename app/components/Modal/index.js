import React from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { Button, Modal, Form, Input, Icon, Upload, Spin, message } from 'antd';
import ModalFooter from 'components/ModalFooter';
import SpinTip from 'components/SpinTip';

import messages from './messages';

const Dragger = Upload.Dragger;

export const SearchModal = ({ submit, cancel, visible, children }) => (
  <Modal
    title={<FormattedMessage {...messages.search} />}
    visible={visible}
    onCancel={cancel}
    footer={<ModalFooter cancel={cancel} submit={submit} />}>
    {children}
  </Modal>
);

const ErrorIconContainer = styled.span`
  font-size: 25px;
  margin-right: 10px;
  color: #f00;
  vertical-align: middle;
`;

export const ErrorModal = ({ error, clearError }) => (
  <Modal
    title={<FormattedMessage {...messages.error} />}
    visible={!!error}
    onCancel={clearError}
    footer={<Button key="close" type="ghost" onClick={clearError}><FormattedMessage {...messages.close} /></Button>}>
    <ErrorIconContainer>
      <Icon type="close-circle" />
    </ErrorIconContainer>
    {(error || '') + ''}
  </Modal>
);

const uploadProps = {
  name: 'file',
  multiple: true,
  showUploadList: false,
};

const DraggerContainer = styled.div`
  margin: 10px;
  height: 200px;
`;

export const UploadModal = ({ intl, action, visible, uploading, start, success, failed, cancel }) => (
  <Modal
    title={<FormattedMessage {...messages.uploadAFile} />}
    visible={visible}
    onCancel={cancel}
    footer={<Button key="cancel" type="ghost" onClick={cancel}><FormattedMessage {...messages.cancel} /></Button>}>
    <Spin size="large" spinning={uploading} tip={<SpinTip />}>
      <DraggerContainer>
        <Dragger
          {...uploadProps}
          action={action}
          onChange={(info) => {
            const { file: { status, response, error } } = info;
            if (status === 'uploading') {
              start();
            } else if (status === 'done') {
              message.success(intl.formatMessage(messages.importSuccessMessage, { numberOfRows: response.length }), 3);
              success(response);
            } else if (status === 'error') {
              message.error(intl.formatMessage(messages.importFailureMessage, { error: error + '' }), 3);
              failed(error);
            }
          }}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Dragger>
      </DraggerContainer>
    </Spin>
  </Modal>
);
