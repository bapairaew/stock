import React from 'react';
import { Cell } from 'fixed-data-table';
import styled from 'styled-components';
import { getInEditableCellBackground } from './Color';

// remove external property
const _Cell = ({ cleanValue, value, removed, ...props }) => (
  <Cell {...props} />
);

const StyledCell = styled(_Cell)`
  background: ${props => getInEditableCellBackground(props)};
`;

const RightAlignedCell = styled(StyledCell)`
  text-align: right;
`;

const _getValue = ({ data, rowIndex, col }) => data.getIn([rowIndex].concat(col));

const getInEditableCellValue = ({ data, rowIndex, col, getValue }) =>
  getValue === undefined ? _getValue({ data, rowIndex, col }) : getValue({ row: data.get(rowIndex), data, rowIndex, col });

const getInEditableCellProps = ({ data, cleanData, rowIndex, col, getValue }) => {
  const cleanCellValue = getInEditableCellValue({ data: cleanData, rowIndex, col, getValue });
  const cellValue = getInEditableCellValue({ data, rowIndex, col, getValue });
  return {
    children: cellValue,
    cleanValue: cleanCellValue,
    value: cellValue,
    removed: data.getIn([ rowIndex, 'removed' ]),
  };
};

export const TextCell = ({ data, cleanData, rowIndex, col, getValue, ...props }) => (
  <StyledCell {...props} {...getInEditableCellProps({ data, cleanData, rowIndex, col, getValue })} />
);

export const NumberCell = ({ data, cleanData, rowIndex, col, getValue, ...props }) => (
  <RightAlignedCell {...props} {...getInEditableCellProps({ data, cleanData, rowIndex, col, getValue })} />
);
