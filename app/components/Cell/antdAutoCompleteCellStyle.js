import { injectGlobal } from 'styled-components';

const className = 'antdAutoCompleteCellStyle';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  .${className} .ant-select{
    width: 100%;
  }

  .${className} .ant-select-selection {
    border: none;
    background: transparent;
    border-radius: 0;
  }
  .${className} .ant-select-focused .ant-select-selection, .ant-select-selection:focus, .ant-select-selection:active {
    box-shadow: -1px -1px 0 2px #108ee9 inset;
  }
`;

export default className;
