// Slower...

import React from 'react';
import { Cell } from 'fixed-data-table';

export class _Cell extends React.PureComponent {
  shouldComponentUpdate(newProps) {
    return this.props.data.get(this.props.rowIndex) !== newProps.data.get(newProps.rowIndex);
  }

  render() {
    return (
      <Cell {...this.props} />
    );
  }
}

export default _Cell;
