_ = require 'lodash'
React = require 'react'

Stateless = require '../src/index.jsx'
RandomGif = require './RandomGif.cjsx'

GifList = Stateless.createClass
  initial: {list: []}
  reducers:
    insert: (model) ->
      model.list = model.list.slice()
      model.list.push(RandomGif.initial)
      return model
    delete: (model) ->
      model.list = model.list.slice(0, model.list.length - 1)
      return model
    gif: (model, payload, message, dispatchers) ->
      model.list = model.list.slice()
      model.list[payload] = RandomGif.reduce(model.list[payload], message, dispatchers.gif(payload))
      return model

  view: (model, dispatchers) ->
    <div>
      {_.map model.list, (gif, i) -> <RandomGif key={i} model={gif} dispatchAs={dispatchers.gif(i)} />}
      <button onClick={dispatchers.insert()}>+</button>
      <button onClick={dispatchers.delete()}>-</button>
    </div>

module.exports = GifList
