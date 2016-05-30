_ = require 'lodash'
React = require 'react'
{connect} = require 'react-redux'

Stateless = require '../src/index.jsx'
GifList = require './GifList.cjsx'

switchTopic = (topic) -> {type: 'SWITCH_TOPIC', topic}
resetTopic = (topic) -> {type: 'RESET_TOPIC'}

CustomGifs = Stateless.createClass
  initial: {topic: '', list: GifList.initial}
  reducers:
    gifList: (model, payload, message, dispatchers) ->
      model.list = GifList.reduce(model.list, message, dispatchers.gifList())
      return model
    updateTopic: (model, payload, event) ->
      model.topic = event.target.value
      return model
    setReduxDispatch: (model, payload, value) ->
      model.rDispatch = value
      return model
    publishTopic: (model) -> ->
      model.rDispatch(switchTopic(model.topic))
    publishReset: (model) -> ->
      model.rDispatch(resetTopic())
    setTopic: (model, payload, newValue) ->
      model.topic = newValue
      return model
  view: (model, dispatchers) ->
    <div>
      <input type="text" value={model.topic} onChange={dispatchers.updateTopic()} />
      <button onClick={dispatchers.publishTopic()}>Update</button>
      <button onClick={dispatchers.publishReset()}>Give back my cats!</button>
      <GifList model={model.list} dispatchAs={dispatchers.gifList()} />
    </div>
  subscriber: (dispatchers) ->
    dispatch: dispatchers.setReduxDispatch()
    topic: dispatchers.setTopic()

module.exports = connect((s) -> {topic: s.topic})(CustomGifs)

