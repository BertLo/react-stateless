_ = require 'lodash'
React = require 'react'
ReactDOM = require 'react-dom'
{Provider, connect} = require 'react-redux'
{createStore} = require 'redux'

Stateless = require '../src/index.jsx'
GifList = require './GifList.cjsx'


CustomGifs = require './CustomGifs.cjsx'

dispatchStateless = (message) ->
  store.dispatch {type: 'STATELESS_ACTION', message}

appReducer = (state = {topic: 'cats', stateless: CustomGifs.initial}, action) ->
  if action.type == 'SWITCH_TOPIC'
    return {topic: action.topic, stateless: state.stateless}
  if action.type == 'RESET_TOPIC'
    return {topic: 'cats', stateless: state.stateless}
  if action.type == 'STATELESS_ACTION'
    return {topic: state.topic, stateless: CustomGifs.reduce(state.stateless, action.message, dispatchStateless)}
  return state

store = (if window.devToolsExtension then window.devToolsExtension()(createStore) else createStore)(appReducer)

Root = connect((state) -> {stateless: state.stateless})(Stateless.root({
  getModel: (props) -> props.stateless
  reduce: dispatchStateless
})(CustomGifs))

body = document.getElementsByTagName('body')[0]
div = document.createElement('div')
body.appendChild(div)
ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>
  , div
)

