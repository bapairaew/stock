import { injectGlobal } from 'styled-components';

const className = 'antdDatePickerCellStyle';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  .${className} .ant-calendar-picker-input {
    border: none;
    text-align: center;
    background: transparent;
  }
`;

export default className;
