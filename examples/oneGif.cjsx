React = require 'react'
ReactDOM = require 'react-dom'
{Provider, connect} = require 'react-redux'
{createStore} = require 'redux'

Stateless = require '../src/index.jsx'

CatGif = Stateless.createClass
  initial: {loading: true}

  reducers:
    componentWillMount: (model, paylload, message, dispatchers) ->
      dispatchers.getGif()
    getGif: (model, payload, message, dispatchers) -> ->
      dispatchers.loadingGif()()
      fetch "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=cats"
        .then (response) -> response.json()
        .then dispatchers.gotGif()
        .catch dispatchers.gifError()
    loadingGif: (model) ->
      {loading: true, topic: model.topic}
    gotGif: (model, payload) ->
      model.loading = false
      model.url = payload.data?.image_url
      return model
    gifError: (model, payload) ->
      model.loading = false
      model.error = payload
      return model

  view: (model, dispatchers) ->
    <div>
      {'Loading' if model.loading}
      {JSON.stringify(model.error) if model.error}
      {<img src={model.url} /> if model.url}
      {<button onClick={dispatchers.getGif()}>Give me new</button> unless model.loading}
    </div>

Root = Stateless.root()(CatGif)

store = createStore((n = {}) -> n)

body = document.getElementsByTagName('body')[0]
div = document.createElement('div')
body.appendChild(div)
ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>
  , div
)
