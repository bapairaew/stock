import React from 'react';
import { Cell } from 'fixed-data-table-2';
import { Checkbox } from 'antd';
import { fromJS } from 'immutable';

export const HeaderCheckboxCell = ({ items, selectedItems, onCheckAll, ...props }) => (
  <Cell {...props}>
    <Checkbox checked={selectedItems === items} onChange={() => onCheckAll(items !== selectedItems ? items : fromJS([]))} />
  </Cell>
);

export const CheckboxCell = ({ selectedItems, item, onCheck, ...props }) => (
  <Cell {...props}>
    <Checkbox checked={selectedItems.contains(item)} onChange={() => {
        const idx = selectedItems.indexOf(item);
        idx === -1 ? onCheck(selectedItems.push(item)) : onCheck(selectedItems.delete(idx));
      }} />
  </Cell>
);
