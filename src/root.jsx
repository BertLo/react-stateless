import React from 'react';
import isFunction from 'lodash.isfunction';

function root(options = {}) {
  return function (Component) {
    class StatelessRoot extends React.Component {
      constructor(props) {
        super(props);
        if (!options.getModel) {
          this.model = Component.initial;
          this.state = {
            model: this.model,
          };
        }
      }

      reduce(message) {
        if (options.reduce) {
          options.reduce(message);
        } else {
          let result = Component.reduce(this.model, message, this.reduce.bind(this));
          if (isFunction(result)) {
            return result();
          }
          this.model = result;
          this.setState({model: this.model});
        }
      }

      render() {
        let sender = this.reduce.bind(this);
        let model;
        if (options.getModel) {
          model = options.getModel(this.props, this.state, this.context);
        } else {
          model = this.state.model;
        }

        let props = Object.assign({}, this.props, {sender, model});
        return <Component {...props} />;
      }
    }

    StatelessRoot.view = Component.view;
    StatelessRoot.reducers = Component.reducers;
    StatelessRoot.initial = Component.initial;
    StatelessRoot.reduce = Component.reduce;
    return StatelessRoot;
  };
}

module.exports = root;
