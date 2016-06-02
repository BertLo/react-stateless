React = require 'react'
{connect} = require 'react-redux'

Stateless = require '../src/index.jsx'

RandomGif = Stateless.createClass
  initial: {loading: true, topic: ''}

  reducers:
    getGif: (model, payload, message, topics) -> ->
      topics.loadingGif.send()
      fetch "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=#{model.topic}"
        .then (response) -> response.json()
        .then topics.gotGif()
        .catch topics.gifError()
    loadingGif: (model) ->
      {loading: true, topic: model.topic}
    gotGif: (model, __, response) ->
      model.loading = false
      model.url = response.data?.image_url
      return model
    changeGifTopic: (model, payload, newValue, topics) -> ->
      topics.changeTopic.send(newValue)
      topics.getGif.send()
    changeTopic: (model, payload) ->
      model.topic = payload
      return model
    gifError: (model, __, error) ->
      model.loading = false
      model.error = error
      return model
  subscriber: (topics) ->
    topic: topics.changeGifTopic()

  view: (model, topics) ->
    <div>
      {'Loading' if model.loading}
      {JSON.stringify(model.error) if model.error}
      {<img src={model.url} /> if model.url}
      {<button onClick={topics.getGif()}>Give me new</button> unless model.loading}
    </div>

module.exports = connect((state) -> {topic: state.topic})(RandomGif)
