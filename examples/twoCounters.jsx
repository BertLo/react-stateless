import React from 'react';
import ReactDOM from 'react-dom';

import Stateless from '../src/index.jsx';
import Counter from './Counter.jsx';

const TwoCounters = Stateless.createClass({
  initial: {top: Counter.initial, bottom: Counter.initial},
  reducers: {
    top: function (model, payload, message) {
      model.top = Counter.reduce(model.top, message);
      return model;
    },
    bottom: function (model, payload, message) {
      model.bottom = Counter.reduce(model.bottom, message);
      return model;
    },
  },
  view: function (model, topics) {
    return (
      <div>
        <Counter model={model.top} sender={topics.top()} />
        <Counter model={model.bottom} sender={topics.bottom()} />
      </div>
    );
  },
});

const Root = Stateless.root()(TwoCounters);

let body = document.getElementsByTagName('body')[0];
let div = document.createElement('div');
body.appendChild(div);
ReactDOM.render(<Root />, div);
