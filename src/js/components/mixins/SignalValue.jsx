'use strict';
var sg = require('../../model/signals'),
    store = require('../../store'),
    getIn = require('../../util/immutable-utils').getIn,
    signalSet = require('../../actions/signalSet'),
    model = require('../../model');

module.exports = {
  getInitialState: function() {
    var state = store.getState(),
        props = this.props,
        signalValue = props.signal && getIn(state, 'signals.' + props.signal + '.init');

    return {
      value: props.signal ? signalValue : props.value
    };
  },

  componentWillMount: function() {
    this.onSignal();
  },

  componentWillUnmount: function() {
    this.offSignal();
  },

  componentWillReceiveProps: function(nextProps) {
    var prevProps = this.props;
    if (prevProps.signal) {
      this.offSignal(prevProps.signal);
    }
    if (nextProps.signal) {
      this.onSignal(nextProps.signal);
    }
    if (nextProps.signal || nextProps.value !== prevProps.value) {
      this.setState({
        value: nextProps.signal ? sg.get(nextProps.signal) : nextProps.value
      });
    }
  },

  onSignal: function(signal) {
    signal = signal || this.props.signal;
    if (signal) {
      model.onSignal(signal, this.signal);
    }
  },

  offSignal: function(signal) {
    signal = signal || this.props.signal;
    if (signal) {
      model.offSignal(signal, this.signal);
    }
  },

  signal: function(_, value) {
    // Flow changes from Vega back up to the store
    var signal = this.props.signal;
    if (signal) {
      store.dispatch(signalSet(signal, value));
    }
    this.setState({value: value});
  },

  handleChange: function(evt) {
    this.setValue(evt.target.value);
  },

  setValue: function(value) {
    var props = this.props,
        signal = props.signal,
        type = props.type;

    if (type === 'number' || type === 'range') {
      // Ensure value is a number
      value = +value;
    }

    if (signal) {
      // Set the signal on the view but do not dispatch: the `.signal` listener
      // above will dispatch the action to synchronize Redux with Vega.
      sg.set(signal, value, false);
      model.update();
    } else {
      this.setState({
        value: value
      });
    }
  }
};
