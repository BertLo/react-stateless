_ = require 'lodash'
React = require 'react'
ReactDOM = require 'react-dom'
{Provider, connect} = require 'react-redux'
{createStore} = require 'redux'

Stateless = require '../src/index.jsx'
GifList = require './GifList.cjsx'

appReducer = (state = {topic: 'cats'}, action) ->
  if action.type == 'SWITCH_TOPIC'
    return {topic: action.topic}
  if action.type == 'RESET_TOPIC'
    return {topic: 'cats'}
  return state

store = createStore(appReducer)

CustomGifs = require './CustomGifs.cjsx'

Root = Stateless.root()(CustomGifs)

body = document.getElementsByTagName('body')[0]
div = document.createElement('div')
body.appendChild(div)
ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>
  , div
)
