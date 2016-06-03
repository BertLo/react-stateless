import React from 'react';
import isFunction from 'lodash.isfunction';
import get from 'lodash.get';

import root from './root';

function topicSenders(sender, reducers) {
  let messages = {};
  for (let key in reducers) {
    if (reducers.hasOwnProperty(key)) {
      messages[key] = payload => event => {
        if (event && event.persist && isFunction(event.persist)) {
          event.persist();
        }
        sender({topic: key, payload, event});
      };
      messages[key].send = (payload, event) => {
        sender({topic: key, payload, event});
      };
    }
  }
  return messages;
}

const ASYNC_STATUSES = {
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  FULFILLED: 'FULFILLED',
};

const COMPONENT_EVENTS = {
  COMPONENT_WILL_MOUNT: 'componentWillMount',
  COMPONENT_DID_MOUNT: 'componentDidMount',
  COMPONENT_WILL_UNMOUNT: 'componentWillUnmount',
};

//function computeAsync(data, newModel, oldModel, topics) {
  //let dataList = data(topics);
  //for (let {dependencies, exec, message} of dataList) {
    //if (typeof dependencies === 'string') {
      //dependencies = [dependencies];
    //}

    //for (let dependency of dependencies) {
      //if (!oldModel || get(oldModel, dependency) !== get(newModel, dependency)) {
        //let toFulfill = exec(newModel);
        //if (toFulfill) {
          //message(ASYNC_STATUSES.PENDING)();
          //toFulfill(function (err, result) {
            //if (err) {
              //return message(ASYNC_STATUSES.REJECTED)(err);
            //}
            //message(ASYNC_STATUSES.FULFILLED)(result);
          //});
        //}
        //break;
      //}
    //}
  //}
//}

function createClass({view, reducers, initial, subscriber, data, superClass}) {
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
              subscribeList[path](newValue);
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
        this.sender({topic: COMPONENT_EVENTS.COMPONENT_WILL_MOUNT, payload: this.props});
      }
      //if (data && !(this.props.model['@@STATELESS'] && this.props.model['@@STATELESS'])) {
        //computeAsync(data, this.props.model, null, this.topics);
      //}
    }

    componentDidMount() {
      if (super.componentDidMount) {
        super.componentDidMount();
      }
      if (reducers[COMPONENT_EVENTS.COMPONENT_DID_MOUNT]) {
        this.sender({topic: COMPONENT_EVENTS.COMPONENT_DID_MOUNT, payload: this.props});
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
        this.sender({topic: COMPONENT_EVENTS.COMPONENT_WILL_UNMOUNT});
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
    model = Object.assign({}, model);
    //if (!model['@@STATLESS']) {
      //model['@@STATLESS'] = {};
    //}
    //model['@@STATLESS'].mounted = true;
    let topics = topicSenders(sender, reducers);
    let result = reducers[message.topic](model, message.payload, message.event, topics);
    //if (!isFunction(result)) {
      //computeAsync(data, result, model, topics);
    //}
    return result;
  };

  return StatelessComponent;
}

module.exports = {
  createClass: createClass,
  root: root,
};
