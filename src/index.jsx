import React from 'react';
import isFunction from 'lodash.isfunction';
import defer from 'lodash.defer';
import get from 'lodash.get';

function dispatchers(dispatchAs, reducers, direct) {
  let messages = {};
  for (let key in reducers) {
    if (reducers.hasOwnProperty(key)) {
      if (direct) {
        messages[key] = payload => dispatchAs({topic: key, payload});
      } else {
        messages[key] = payload => event => {
          if (event && event.persist && isFunction(event.persist)) {
            event.persist();
          }
          dispatchAs({topic: key, payload, event});
        };
      }
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

function computeAsync(data, newModel, oldModel, dispatchers) {
  let dataList = data(dispatchers);
  for (let {dependencies, exec, message} of dataList) {
    if (typeof dependencies === 'string') {
      dependencies = [dependencies];
    }

    for (let dependency of dependencies) {
      if (!oldModel || get(oldModel, dependency) !== get(newModel, dependency)) {
        let toFulfill = exec(newModel);
        if (toFulfill) {
          message(ASYNC_STATUSES.PENDING)();
          toFulfill(function (err, result) {
            if (err) {
              return message(ASYNC_STATUSES.REJECTED)(err);
            }
            message(ASYNC_STATUSES.FULFILLED)(result);
          });
        }
        break;
      }
    }
  }
}

function createClass({view, reducers, initial, subscriber, data}) {
  class StatelessComponent extends React.Component {
    broadcast(newProps, oldProps) {
      if (subscriber) {
        let subscribeList = subscriber(this.dispatchers);
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
      if (!this.props.dispatchAs) {
        throw new Error('DispatchAs required');
      }
      this.dispatchAs = this.props.dispatchAs;
      this.dispatchers = dispatchers(this.dispatchAs, reducers);
    }

    componentWillMount() {
      if (reducers[COMPONENT_EVENTS.COMPONENT_WILL_MOUNT]) {
        this.dispatchAs({topic: COMPONENT_EVENTS.COMPONENT_WILL_MOUNT});
      }
      if (data && !(this.props.model['@@STATELESS'] && this.props.model['@@STATELESS'])) {
        computeAsync(data, this.props.model, null, this.dispatchers);
      }
      this.broadcast(this.props, {});
    }

    componentDidMount() {
      if (reducers[COMPONENT_EVENTS.COMPONENT_DID_MOUNT]) {
        this.dispatchAs({topic: COMPONENT_EVENTS.COMPONENT_DID_MOUNT});
      }
    }

    componentWillReceiveProps(nextProps) {
      this.broadcast(nextProps, this.props);
    }

    componentWillUnmount() {
      if (reducers[COMPONENT_EVENTS.COMPONENT_WILL_UNMOUNT]) {
        this.dispatchAs({topic: COMPONENT_EVENTS.COMPONENT_WILL_UNMOUNT});
      }
    }

    render() {
      let model = this.props.model;
      return view(model, this.dispatchers);
    }
  }

  StatelessComponent.view = view;
  StatelessComponent.reducers = reducers;
  StatelessComponent.initial = initial;
  StatelessComponent.reduce = function (model, message, dispatchAs) {
    model = Object.assign({}, model);
    if (!model['@@STATLESS']) {
      model['@@STATLESS'] = {};
    }
    model['@@STATLESS'].mounted = true;
    let disps = dispatchers(dispatchAs, reducers);
    let result = reducers[message.topic](model, message.payload, message.event, disps);
    if (isFunction(result)) {
      defer(result);
      return model;
    } else if (data) {
      computeAsync(data, result, model, disps);
    }
    return result;
  };

  return StatelessComponent;
}

module.exports = {
  createClass: createClass,
  root: root,
};
