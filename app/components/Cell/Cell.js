import React from 'react';
import { Cell } from 'fixed-data-table';

export class _Cell extends React.PureComponent {
  shouldComponentUpdate(newProps) {
    return this.props.row !== newProps.row || this.props.cleanData !== newProps.cleanData;
  }

  render() {
    const { row, cleanData, ...props } = this.props;
    return (
      <Cell {...props} />
    );
  }
}

export default _Cell;
