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
    updateMax: function (model) {
      model.max = Math.max(model);
      return model
    },
    updateCounter: function(model) {
      model.list[payload] = Counter.reduce(model.list[payload], message);
      return model;
      
    } 
    counter: function (model, payload, message, dispatchers) {
      return function() {
        dispatchers.updateCounter()();
        dispatchers.updateMax()();
      }
    },
  },
  view: function (model, dispatchers) {
    return (
      <div>
        {_.map(model.list, (count, i) => {
          return <Counter key={i} model={count} dispatchAs={dispatchers.counter(i)} />;
        })}
        <button onClick={dispatchers.insert()}>Insert</button>
        <button onClick={dispatchers.delete()}>Delete</button>
      </div>
    );
  },
});

const Root = Stateless.root()(CountersList);

let body = document.getElementsByTagName('body')[0];
let div = document.createElement('div');
body.appendChild(div);
ReactDOM.render(<Root />, div);
