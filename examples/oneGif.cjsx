React = require 'react'
ReactDOM = require 'react-dom'
{Provider, connect} = require 'react-redux'
{createStore} = require 'redux'

Stateless = require '../src/index.jsx'

CatGif = Stateless.createClass
  initial: {loading: true}

  reducers:
    componentWillMount: (model, paylload, message, topics) ->
      topics.getGif()
    getGif: (model, payload, message, topics) -> ->
      topics.loadingGif.send()
      fetch "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=cats"
        .then (response) -> response.json()
        .then topics.gotGif()
        .catch topics.gifError()
    loadingGif: (model) ->
      {loading: true}
    gotGif: (model, payload, response) ->
      model.loading = false
      model.url = response.data?.image_url
      return model
    gifError: (model, payload, err) ->
      model.loading = false
      model.error = err
      return model

  view: (model, topics) ->
    <div>
      {'Loading' if model.loading}
      {JSON.stringify(model.error) if model.error}
      {<img src={model.url} /> if model.url}
      {<button onClick={topics.getGif()}>Give me new</button> unless model.loading}
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
