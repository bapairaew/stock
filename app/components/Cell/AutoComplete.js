import React from 'react';
import { AutoComplete } from 'antd';
import request from 'utils/request';
import qs from 'qs';

const Option = AutoComplete.Option;

export class _AutoComplete extends React.Component {
  state = {
    value: '',
    dataSource: []
  };

  constructor(props) {
    super(props);
    this.state.value = props.value;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.value !== nextProps.value || this.state.value !== nextState.value;
  }

  onChange(value) {
    const { endpoint, limit } = this.props;
    if (value && value.length >= 3) {
      request(`${endpoint}?${qs.stringify({ text: value, limit })}`)
        .then(results => {
          this.setState({ dataSource: results.map(r => `${r.id} ${r.name}`) });
          this.results = results;
        });
    } else {
      this.setState({ dataSource: [] });
    }
    this.setState({ value });
  }

  onSelect(value) {
    // HACK: <Option /> is not working, thus, object array is not working
    const { onUpdate } = this.props;
    const { dataSource } = this.state;
    const item = this.results[dataSource.indexOf(value)];
    onUpdate(item);
    setTimeout(() => this.setState({ value: item.id }));

  }

  render() {
    const { dataSource, value } = this.state;
    return (
      <AutoComplete
        dataSource={dataSource}
        onChange={value => this.onChange(value)}
        onSelect={value => this.onSelect(value)}
        value={value} />
    );
  }
}

export default _AutoComplete;
