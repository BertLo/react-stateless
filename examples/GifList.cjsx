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
    gif: (model, payload, message, topics) ->
      model.list = model.list.slice()
      model.list[payload] = RandomGif.reduce(model.list[payload], message, topics.gif(payload))
      return model

  view: (model, topics) ->
    <div>
      {_.map model.list, (gif, i) -> <RandomGif key={i} model={gif} sender={topics.gif(i)} />}
      <button onClick={topics.insert()}>+</button>
      <button onClick={topics.delete()}>-</button>
    </div>

module.exports = GifList
