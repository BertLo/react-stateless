React = require 'react'
ReactDOM = require 'react-dom'
{Provider, connect} = require 'react-redux'
{createStore} = require 'redux'

Stateless = require '../src/index.jsx'
GifList = require './GifList.cjsx'

Root = Stateless.root()(GifList)

store = createStore((n = {topic: 'cats'}) -> n)

body = document.getElementsByTagName('body')[0]
div = document.createElement('div')
body.appendChild(div)
ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>
  , div
)
