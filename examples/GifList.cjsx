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
    gif: (model, payload, topics) ->
      model.list = model.list.slice()
      model.list[payload.index] = RandomGif.reduce(
        model.list[payload.index],
        payload.message,
        topics.gif({index: payload.index}))
      return model

  view: (model, topics) ->
    <div>
      {_.map model.list, (gif, i) -> <RandomGif key={i} model={gif} sender={topics.gif({index: i})} />}
      <button onClick={topics.insert()}>+</button>
      <button onClick={topics.delete()}>-</button>
    </div>

module.exports = GifList
