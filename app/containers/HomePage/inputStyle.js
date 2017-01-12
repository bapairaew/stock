import { injectGlobal } from 'styled-components';

const className = 'homePageInputStyle';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  .${className} {
    border-bottom: 1px solid #999;
    padding: 20px 0;
  }

  .${className} .ant-input {
    border: 0;
    font-size: 18px;
    padding: 0 25px;
  }

  .${className} .ant-input:focus {
    border: 0;
    box-shadow: none;
  }

  .${className} .ant-input-group-addon {
    background: transparent;
    font-size: 20px;
    border: 0;
  }
`;

export default className;
