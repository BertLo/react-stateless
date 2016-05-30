import React from 'react';
import ReactDOM from 'react-dom';

import Stateless from '../src/index.jsx';
import Counter from './Counter.jsx';

const Root = Stateless.root()(Counter);

let body = document.getElementsByTagName('body')[0];
let div = document.createElement('div');
body.appendChild(div);
ReactDOM.render(<Root />, div);

