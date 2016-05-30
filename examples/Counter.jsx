import React from 'react';
import Stateless from '../src/index.jsx';

const Counter = Stateless.createClass({
  initial: {value: 0},
  reducers: {
    increment: function (model) {
      model.value = model.value + 1;
      return model;
    },
    decrement: function (model) {
      model.value = model.value - 1;
      return model;
    },
  },
  view: function (model, dispatchers) {
    return (
      <div>
        <button onClick={dispatchers.increment()}>+</button>
        <div>{model.value}</div>
        <button onClick={dispatchers.decrement()}>-</button>
      </div>
    );
  },
});

export default Counter;
