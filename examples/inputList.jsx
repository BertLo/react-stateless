import _ from 'lodash';

import React from 'react';
import ReactDOM from 'react-dom';

import Stateless from '../src/index.jsx';

const Input = Stateless.createClass({
  initial: {value: ""},
  reducers: {
    change: function (model, payload) {
      model.value = payload.event.target.value
      return model;
    }
  },
  view: function (model, topics) {
    return (
      <div>
        <input onChange={topics.change()}/>
      </div>
    );
  },
});

const InputsList = Stateless.createClass({
  initial: {list: []},
  reducers: {
    insert: function (model) {
      model.list.push(Input.initial);
      return model;
    },
    delete: function (model) {
      model.list = model.list.slice(0, model.list.length - 1);
      return model;
    },
    change: function (model, payload) {
      model.list[payload.index] = Input.reduce(model.list[payload.index], payload.message);
      return model;
    },
  },
  view: function (model, topics) {
    return (
      <div>
        {_.map(model.list, (_input, i) => {
          return <Input key={i} model={_input} sender={topics.change({index: i})} />;
        })}
        {_.map(model.list, (_input, i) => {
          return <div key={i}>{i}. {_input.value}</div>
        })}
        <button onClick={topics.insert()}>Insert</button>
        <button onClick={topics.delete()}>Delete</button>
      </div>
    );
  },
});

const Root = Stateless.root()(InputsList);

let body = document.getElementsByTagName('body')[0];
let div = document.createElement('div');
body.appendChild(div);
ReactDOM.render(<Root />, div);
