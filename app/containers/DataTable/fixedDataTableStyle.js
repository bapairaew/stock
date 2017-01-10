import { injectGlobal } from 'styled-components';

const className = 'containersDataTableFixedDataTableStyle';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  .${className} .public_fixedDataTable_main {
    border: none !important;
  }

  .${className} .public_fixedDataTableCell_cellContent {
    padding: 4px;
    white-space: nowrap;
  }

  .${className} .public_fixedDataTable_main,
  .${className} .public_fixedDataTable_header,
  .${className} .public_fixedDataTable_hasBottomBorder {
    border-color: #e9e9e9 !important;
  }

  .${className} .public_fixedDataTable_header,
  .${className} .public_fixedDataTable_header .public_fixedDataTableCell_main {
    background-color: #eee !important;
    background-image: none !important;
  }

  .${className} .public_fixedDataTableRow_highlighted,
  .${className} .public_fixedDataTableRow_highlighted .public_fixedDataTableCell_main {
    background: transparent !important;
  }

  .${className} .fixedDataTableCellLayout_main.public_fixedDataTableCell_main {
    border-bottom: 1px solid #e9e9e9 !important;
  }
`;

export default className;
