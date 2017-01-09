import React from 'react';
import { Cell } from 'fixed-data-table';
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

const getInputProperty = ({ data, cleanData, rowIndex, col, onUpdate, setter = v => v  }) => {
  const value = setter(data.getIn([rowIndex].concat(col)));
  const cleanValue = setter(cleanData.getIn([rowIndex].concat(col)));
  return { value, cleanValue, removed: data.getIn([rowIndex, 'removed']), onUpdate: (value) => onUpdate({ value, rowIndex, col }) };
};

export const EditableCell = ({ data, cleanData, rowIndex, col, onUpdate, ...props }) => (
  <Cell {...props}>
    <InputCellContainer>
      <TextInput type="text" {...getInputProperty({ data, cleanData, rowIndex, col, onUpdate })} />
    </InputCellContainer>
  </Cell>
);

export const EditableAutoCompleteCell = ({ data, cleanData, rowIndex, col, onUpdate, endpoint, limit, ...props }) => {
  const { value, cleanValue, removed, onUpdate: _onUpdate } = getInputProperty({ data, cleanData, rowIndex, col, onUpdate });
  return (
    <Cell {...props}>
      <InputCellContainer>
        <StatusBackgroundContainer
          value={value}
          cleanValue={cleanValue}
          removed={removed}>
          <div className={autoCompleteClassName}>
            <AutoComplete value={value} endpoint={endpoint} limit={limit} onUpdate={_onUpdate} />
          </div>
        </StatusBackgroundContainer>
      </InputCellContainer>
    </Cell>
  );
}

export const EditableNumberCell = ({ data, cleanData, rowIndex, col, onUpdate, ...props }) => (
  <Cell {...props}>
    <InputCellContainer>
      <NumberInput type="number" getter={v => +v} {...getInputProperty({ data, cleanData, rowIndex, col, onUpdate })} />
    </InputCellContainer>
  </Cell>
);

const getTimeValue = (time) => time && time.valueOf();

export const EditableDateCell = ({ data, cleanData, rowIndex, col, onUpdate, ...props }) => {
  const { value, cleanValue, removed, onUpdate: _onUpdate } = getInputProperty({ data, cleanData, rowIndex, col, onUpdate, setter: v => v && moment(v) });
  return (
    <Cell {...props}>
      <InputCellContainer>
        <StatusBackgroundContainer
          value={getTimeValue(value)}
          cleanValue={getTimeValue(cleanValue)}
          removed={removed}>
          <div className={datePickerClassName}>
            <DatePicker {...props} value={value} onChange={value => _onUpdate(value.toDate())} />
          </div>
        </StatusBackgroundContainer>
      </InputCellContainer>
    </Cell>
  );
};
