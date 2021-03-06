import React from 'react';
import { Cell } from 'fixed-data-table-2';

export class _Cell extends React.PureComponent {
  shouldComponentUpdate(newProps) {
    return this.props.row !== newProps.row || this.props.data === newProps.cleanData;
  }

  render() {
    const { row, cleanData, onEditing = () => {}, ...props } = this.props;
    return (
      <Cell {...props} onClick={() => onEditing(row)} />
    );
  }
}

export default _Cell;
