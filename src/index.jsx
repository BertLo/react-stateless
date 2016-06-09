import React from 'react';
import isFunction from 'lodash.isfunction';
import get from 'lodash.get';

import root from './root';

function isMessage(message) {
  return message && message.__message;
}

function senderCreator(payload) {
  let fn = event => {
    if (event && event.persist && isFunction(event.persist)) {
      event.persist();
      payload = Object.assign({}, payload, {event});
    } else if (isMessage(event)) {
      payload = Object.assign({}, payload, {message: event});
    }

    return this.sender({topic: this.key, payload, __message: true});
  };

  fn.send = () => {
    return this.sender({topic: this.key, payload, __message: true});
  };

  return fn;
}

function topicSenders(sender, reducers) {
  let messages = {};
  for (let key in reducers) {
    if (reducers.hasOwnProperty(key)) {
      messages[key] = senderCreator.bind({key, sender});
      messages[key].send = messages[key]();
    }
  }
  return messages;
}

const COMPONENT_EVENTS = {
  COMPONENT_WILL_MOUNT: 'componentWillMount',
  COMPONENT_DID_MOUNT: 'componentDidMount',
  COMPONENT_WILL_UNMOUNT: 'componentWillUnmount',
};

function createClass({view, reducers, initial, subscriber, superClass}) {
  if (!superClass) {
    superClass = React.Component;
  }
  if (!reducers) {
    reducers = {};
  }

  class StatelessComponent extends superClass {
    broadcast(newProps, oldProps) {
      if (subscriber) {
        let subscribeList = subscriber(this.topics);
        for (let path in subscribeList) {
          if (subscribeList.hasOwnProperty(path)) {
            let newValue = get(newProps, path);
            if (newValue !== get(oldProps, path)) {
              subscribeList[path]({newValue}).send();
            }
          }
        }
      }
    }

    constructor(props) {
      super(props);
      if (!this.props.sender && Object.keys(reducers).length > 0) {
        throw new Error('Sender is required');
      }
      this.sender = this.props.sender;
      this.topics = topicSenders(this.sender, reducers);
    }

    componentWillMount() {
      if (super.componentWillMount) {
        super.componentWillMount();
      }
      if (reducers[COMPONENT_EVENTS.COMPONENT_WILL_MOUNT]) {
        this.sender({topic: COMPONENT_EVENTS.COMPONENT_WILL_MOUNT, payload: {props: this.props}, __message: true});
      }
    }

    componentDidMount() {
      if (super.componentDidMount) {
        super.componentDidMount();
      }
      if (reducers[COMPONENT_EVENTS.COMPONENT_DID_MOUNT]) {
        this.sender({topic: COMPONENT_EVENTS.COMPONENT_DID_MOUNT, payload: {props: this.props}, __message: true});
      }
    }

    componentWillReceiveProps(nextProps) {
      this.broadcast(nextProps, this.props);
    }

    componentWillUnmount() {
      if (super.componentWillUnmount) {
        super.componentWillUnmount();
      }
      if (reducers[COMPONENT_EVENTS.COMPONENT_WILL_UNMOUNT]) {
        this.sender({topic: COMPONENT_EVENTS.COMPONENT_WILL_UNMOUNT, __message: true});
      }
    }

    render() {
      let model = this.props.model;
      return view(model, this.topics);
    }
  }

  StatelessComponent.view = view;
  StatelessComponent.reducers = reducers;
  StatelessComponent.initial = initial;
  StatelessComponent.reduce = function (model, message, sender) {
    let topics = topicSenders(sender, reducers);
    let result = reducers[message.topic](model, message.payload, topics);
    if (isFunction(result)) {
      setTimeout(result);
      return model;
    }
    return result;
  };

  return StatelessComponent;
}

module.exports = {
  createClass: createClass,
  root: root,
};
