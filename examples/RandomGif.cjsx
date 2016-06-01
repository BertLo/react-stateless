React = require 'react'
{connect} = require 'react-redux'

Stateless = require '../src/index.jsx'

RandomGif = Stateless.createClass
  initial: {loading: true, topic: ''}

  reducers:
    getGif: (model, payload, message, dispatchers) -> ->
      dispatchers.loadingGif()()
      fetch "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=#{model.topic}"
        .then (response) -> response.json()
        .then dispatchers.gotGif()
        .catch dispatchers.gifError()
    loadingGif: (model) ->
      {loading: true, topic: model.topic}
    gotGif: (model, payload) ->
      model.loading = false
      model.url = payload.data?.image_url
      return model
    changeGifTopic: (model, payload, newValue, dispatchers) -> ->
      dispatchers.changeTopic(newValue)()
      dispatchers.getGif()()
    changeTopic: (model, payload) ->
      model.topic = payload
      return model
    gifError: (model, payload) ->
      model.loading = false
      model.error = payload
      return model
  subscriber: (dispatchers) ->
    topic: dispatchers.changeGifTopic()

  view: (model, dispatchers) ->
    <div>
      {'Loading' if model.loading}
      {JSON.stringify(model.error) if model.error}
      {<img src={model.url} /> if model.url}
      {<button onClick={dispatchers.getGif()}>Give me new</button> unless model.loading}
    </div>

module.exports = connect((state) -> {topic: state.topic})(RandomGif)
