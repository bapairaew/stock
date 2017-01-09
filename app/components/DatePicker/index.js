import React from 'react';
import { DatePicker as _DatePicker } from 'antd';
const _RangePicker = _DatePicker.RangePicker;

import enUS from 'antd/lib/date-picker/locale/en_US';

export const DatePicker = ({...props}) => <_DatePicker locale={enUS} format={'DD/MM/YYYY'} allowClear={false} {...props} />;
export const RangePicker = ({...props}) =>  <_RangePicker locale={enUS} format={'DD/MM/YYYY'} allowClear={false} {...props} />;

export const defaultProps = { locale: enUS, format: 'DD/MM/YYYY', allowClear: false };
