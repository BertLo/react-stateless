React = require 'react'
{connect} = require 'react-redux'

Stateless = require '../src/index.jsx'

RandomGif = Stateless.createClass
  initial: {loading: true, topic: ''}

  reducers:
    #componentWillMount: (model, paylload, message, dispatchers, directDispatchers) ->
      #directDispatchers.getGif
    getGif: (model, payload, message, dispatchers, directDispatchers) -> ->
      directDispatchers.loadingGif()
      fetch "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=#{model.topic}"
        .then (response) -> response.json()
        .then directDispatchers.gotGif
        .catch directDispatchers.gifError
    loadingGif: (model) ->
      {loading: true, topic: model.topic}
    gotGif: (model, payload) ->
      model.loading = false
      model.url = payload.data?.image_url
      return model
    changeGifTopic: (model, payload, newValue, dispatchers, directDispatchers) -> ->
      directDispatchers.changeTopic(newValue)
      directDispatchers.getGif()
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
