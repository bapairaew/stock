import React from 'react';
import Cell from './Cell';
import styled from 'styled-components';
import moment from 'moment';
import Input from './Input';
import { getEditableCellBackground } from './Color';
import { DatePicker } from 'components/DatePicker';
import AutoComplete from './AutoComplete';
import datePickerClassName from './antdDatePickerCellStyle';
import autoCompleteClassName from './antdAutoCompleteCellStyle';

import enUS from 'antd/lib/date-picker/locale/en_US';

const StatusBackgroundContainer = styled.div`
  background: ${props => getEditableCellBackground(props)};
`;

const TextInput = styled(Input)`
  padding: 6px;
  width: 100%;
  outline: 0;
  background: ${props => getEditableCellBackground(props)};

  &:focus {
    box-shadow: -1px -1px 0 2px #108ee9 inset;
  }
`;

const NumberInput = styled(TextInput)`
  text-align: right;
`;

const InputCellContainer = styled.div`
  margin: -4px;
`;

const getRow = ({ data, rowIndex }) => data.get(rowIndex);

const getInputProperty = ({ row, cleanData, rowIndex, col, onUpdate, setter = v => v  }) => {
  const value = setter(row.getIn(col));
  const cleanValue = setter(cleanData.getIn([rowIndex].concat(col)));
  return { value, cleanValue, removed: row.getIn(['removed']), onUpdate: (value) => onUpdate({ value, rowIndex, col }) };
};

export const EditableCell = ({ data, cleanData, rowIndex, col, onUpdate, ...props }) => {
  const row = getRow({ data, rowIndex });
  return (
    <Cell {...props} row={row}>
      <InputCellContainer>
        <TextInput type="text" {...getInputProperty({ row, cleanData, rowIndex, col, onUpdate })} />
      </InputCellContainer>
    </Cell>
  );
};

export const EditableNumberCell = ({ data, cleanData, rowIndex, col, onUpdate, ...props }) => {
  const row = getRow({ data, rowIndex });
  return (
    <Cell {...props} row={row}>
      <InputCellContainer>
        <NumberInput type="number" getter={v => +v} {...getInputProperty({ row, cleanData, rowIndex, col, onUpdate })} />
      </InputCellContainer>
    </Cell>
  );
};

const AutoCompleteContent = ({ value, cleanValue, removed, onUpdate, endpoint, limit }) => (
  <InputCellContainer>
    <StatusBackgroundContainer
      value={value}
      cleanValue={cleanValue}
      removed={removed}>
      <div className={autoCompleteClassName}>
        <AutoComplete value={value} endpoint={endpoint} limit={limit} onUpdate={onUpdate} />
      </div>
    </StatusBackgroundContainer>
  </InputCellContainer>
);

export const EditableAutoCompleteCell = ({ data, cleanData, rowIndex, col, onUpdate, endpoint, limit, ...props }) => {
  const row = getRow({ data, rowIndex });
  return (
    <Cell {...props} row={row}>
      <AutoCompleteContent {...getInputProperty({ row, cleanData, rowIndex, col, onUpdate })}
        endpoint={endpoint} limit={limit} />
    </Cell>
  );
};

const getTimeValue = (time) => time && time.valueOf();

const DateContent = ({ value, cleanValue, removed, onUpdate, ...props }) => (
  <InputCellContainer>
    <StatusBackgroundContainer
      value={getTimeValue(value)}
      cleanValue={getTimeValue(cleanValue)}
      removed={removed}>
      <div className={datePickerClassName}>
        <DatePicker {...props} value={value} onChange={value => onUpdate(value.toDate())} />
      </div>
    </StatusBackgroundContainer>
  </InputCellContainer>
);

export const EditableDateCell = ({ data, cleanData, rowIndex, col, onUpdate, ...props }) => {
  const row = getRow({ data, rowIndex });
  return (
    <Cell {...props} row={row}>
      <DateContent {...getInputProperty({ row, cleanData, rowIndex, col, onUpdate, setter: v => v && moment(v), ...props })} />
    </Cell>
  );
};
