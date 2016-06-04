import _ from 'lodash';

import React from 'react';
import ReactDOM from 'react-dom';

import Stateless from '../src/index.jsx';
import Counter from './Counter.jsx';

const CountersList = Stateless.createClass({
  initial: {list: []},
  reducers: {
    insert: function (model) {
      model.list.push(Counter.initial);
      return model;
    },
    delete: function (model) {
      model.list = model.list.slice(0, model.list.length - 1);
      return model;
    },
    counter: function (model, payload) {
      model.list[payload.index] = Counter.reduce(model.list[payload.index], payload.message);
      return model;
    },
  },
  view: function (model, topics) {
    return (
      <div>
        {_.map(model.list, (count, i) => {
          return <Counter key={i} model={count} sender={topics.counter({index: i})} />;
        })}
        <button onClick={topics.insert()}>Insert</button>
        <button onClick={topics.delete()}>Delete</button>
      </div>
    );
  },
});

const Root = Stateless.root()(CountersList);

let body = document.getElementsByTagName('body')[0];
let div = document.createElement('div');
body.appendChild(div);
ReactDOM.render(<Root />, div);
