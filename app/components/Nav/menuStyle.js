import { injectGlobal } from 'styled-components';

const className = 'componentsNavMenuStyle';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  .${className}.ant-menu-item-selected {
    background-color: rgb(15,133,217) !important;
    border-bottom: none !important;
  }
`;

export default className;
