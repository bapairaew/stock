import React from 'react';
import { AutoComplete } from 'antd';
import request from 'utils/request';
import debounce from 'utils/debounce';
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
    this.debonceRequest = debounce(this.request.bind(this), 300);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
  }

  request(value) {
    const { endpoint, limit } = this.props;
    request(`${endpoint}?${qs.stringify({ text: value, limit })}`)
      .then(results => {
        this.setState({ dataSource: results.map(r => `${r.id} ${r.name}`) });
        this.results = results;
      });
  }

  onChange(value) {
    if (value && value.length >= 3) {
      this.debonceRequest(value);
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
