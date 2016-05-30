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

const COMPONENT_EVENTS = {
  COMPONENT_WILL_MOUNT: 'componentWillMount',
  COMPONENT_DID_MOUNT: 'componentDidMount',
  COMPONENT_WILL_UNMOUNT: 'componentWillUnmount',
};

function createClass({view, reducers, initial, subscriber}) {
  class Component extends React.Component {
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

  Component.view = view;
  Component.reducers = reducers;
  Component.initial = initial;
  Component.reduce = function (model, message, dispatchAs) {
    model = Object.assign({}, model);
    let result = reducers[message.topic](model, message.payload, message.event, dispatchers(dispatchAs, reducers), dispatchers(dispatchAs, reducers, true));
    if (isFunction(result)) {
      defer(result);
      return model;
    }
    return result;
  };

  return Component;
}

function root(options = {}) {
  return function (Component) {
    class StatelessRoot extends React.Component {
      constructor(props) {
        super(props);
        if (!options.getModel) {
          this.state = {
            model: Component.initial,
          };
        }
      }

      reduce(message) {
        if (options.reduce) {
          options.reduce(message);
        } else {
          this.setState({model: Component.reduce(this.state.model, message, this.reduce.bind(this))});
        }
      }

      render() {
        let dispatchAs = this.reduce.bind(this);
        let model;
        if (options.getModel) {
          model = options.getModel(this.props, this.state, this.context);
        } else {
          model = this.state.model;
        }

        let props = Object.assign({}, this.props, {dispatchAs, model});
        return <Component {...props} />;
      }
    }
    return StatelessRoot;
  };
}

module.exports = {
  createClass: createClass,
  root: root,
};
