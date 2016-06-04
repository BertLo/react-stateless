React = require 'react'
{connect} = require 'react-redux'

Stateless = require '../src/index.jsx'

RandomGif = Stateless.createClass
  initial: {loading: true, topic: ''}

  reducers:
    componentWillMount: (model, {props}, topics) -> ->
      topics.changeTopic({topic: props.topic}).send()
      topics.getGif().send()
    getGif: (model, payload, topics) ->
      fetch "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=#{model.topic}"
        .then (response) -> response.json()
        .then (response) -> topics.gotGif({response}).send()
        .catch (err) -> topics.gifError({error: err}).send()
      return {loading: true, topic: model.topic}
    gotGif: (model, {response}) ->
      model.loading = false
      model.url = response.data?.image_url
      return model
    changeGifTopic: (model, {newValue}, topics) -> ->
      topics.changeTopic({topic: newValue}).send()
      topics.getGif().send()
    changeTopic: (model, {topic}) ->
      model.topic = topic
      return model
    gifError: (model, {error}) ->
      model.loading = false
      model.error = error
      return model
  subscriber: (topics) ->
    topic: topics.changeGifTopic

  view: (model, topics) ->
    <div>
      {'Loading' if model.loading}
      {JSON.stringify(model.error) if model.error}
      {<img src={model.url} /> if model.url}
      {<button onClick={topics.getGif()}>Give me new</button> unless model.loading}
    </div>

module.exports = connect((state) -> {topic: state.topic})(RandomGif)
