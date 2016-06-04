React = require 'react'
ReactDOM = require 'react-dom'
{Provider, connect} = require 'react-redux'
{createStore} = require 'redux'

Stateless = require '../src/index.jsx'

CatGif = Stateless.createClass
  initial: {loading: true}

  reducers:
    componentWillMount: (model, payload, topics) ->
      topics.getGif.send()
    getGif: (model, payload, topics) ->
      fetch "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=cats"
        .then (response) -> response.json()
        .then (response) -> topics.gotGif({response}).send()
        .catch (err) -> topics.gifError({error: err}).send()
      return {loading: true}
    gotGif: (model, {response}) ->
      model.loading = false
      model.url = response.data?.image_url
      return model
    gifError: (model, {error}) ->
      model.loading = false
      model.error = error
      return model

  view: (model, topics) ->
    <div>
      {'Loading' if model.loading}
      {JSON.stringify(model.error) if model.error}
      {<img src={model.url} /> if model.url}
      {<button onClick={topics.getGif()}>Give me new</button> unless model.loading}
    </div>

Root = Stateless.root()(CatGif)

body = document.getElementsByTagName('body')[0]
div = document.createElement('div')
body.appendChild(div)
ReactDOM.render(
  <Root />
  , div
)
