import React from 'react';
import { Cell } from 'fixed-data-table';
import { Button } from 'antd';

const ToolButton = ({ removed, rowIndex, remove, revertRemove }) => (
  <div style={{ margin: '0 -6px' }}>
    { removed && <Button type="ghost" shape="circle" icon="rollback" size="small" onClick={() => revertRemove(rowIndex)} /> }
    { !removed && <Button type="ghost" shape="circle" icon="delete" size="small" onClick={() => remove(rowIndex)} /> }
  </div>
);

export const ToolCell = ({ data, rowIndex, remove, revertRemove, ...props }) => (
  <Cell {...props}>
    <ToolButton removed={data.getIn([rowIndex, 'removed'])} rowIndex={rowIndex} remove={remove} revertRemove={revertRemove} />
  </Cell>
);
