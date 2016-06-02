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
    gifList: (model, payload, message, topics) ->
      model.list = GifList.reduce(model.list, message, topics.gifList())
      return model
    updateTopic: (model, payload, event) ->
      model.topic = event.target.value
      return model
    setReduxDispatch: (model, __, value) ->
      model.dispatch = value
      console.log model
      return model
    publishTopic: (model) -> ->
      model.dispatch(switchTopic(model.topic))
    publishReset: (model) -> ->
      model.dispatch(resetTopic())
    setTopic: (model, payload, newValue) ->
      model.topic = newValue
      return model
  view: (model, topics) ->
    <div>
      <input type="text" value={model.topic} onChange={topics.updateTopic()} />
      <button onClick={topics.publishTopic()}>Update</button>
      <button onClick={topics.publishReset()}>Give back my cats!</button>
      <GifList model={model.list} sender={topics.gifList()} />
    </div>
  subscriber: (dispatchers) ->
    dispatch: dispatchers.setReduxDispatch()
    topic: dispatchers.setTopic()

module.exports = connect((s) -> {topic: s.topic})(CustomGifs)

