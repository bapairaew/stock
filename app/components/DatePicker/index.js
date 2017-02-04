import React from 'react';
import { DatePicker as _DatePicker } from 'antd';
const _RangePicker = _DatePicker.RangePicker;

export const DatePicker = ({...props}) => <_DatePicker format={'DD/MM/YYYY'} allowClear={false} {...props} />;
export const RangePicker = ({...props}) =>  <_RangePicker format={'DD/MM/YYYY'} allowClear={false} {...props} />;

export const defaultProps = { format: 'DD/MM/YYYY', allowClear: false };
