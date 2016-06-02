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
  view: function (model, topics) {
    return (
      <div>
        <button onClick={topics.increment()}>+</button>
        <div>{model.value}</div>
        <button onClick={topics.decrement()}>-</button>
      </div>
    );
  },
});

export default Counter;
