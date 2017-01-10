import React from 'react';

class Input extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    onUpdate: React.PropTypes.func,
    value: React.PropTypes.any,
    cleanValue: React.PropTypes.any,
  };

  state = {
    value: ''
  };

  constructor(props) {
    super(props);
    this.state.value = props.value;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
  }

  onUpdate = (value) => {
    const { onUpdate = () => {}, cleanValue } = this.props;
    cleanValue !== value && onUpdate(value);
  }

  render() {
    // ignore onUpdate, value, cleanValue, removed
    const { onUpdate, value: _, cleanValue, removed, getter = v => v, ...props } = this.props;
    const { value } = this.state;

    return (
      <input
        ref={comp => this.input = comp}
        onChange={e => this.setState({ value: e.target.value })}
        onKeyDown={e => e.keyCode === 13 && this.input.blur()}
        onBlur={e => this.onUpdate(getter(value))}
        value={value}
        {...props} />
    );
  }
}

export default Input;
