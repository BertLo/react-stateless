import React from 'react';

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

    StatelessRoot.view = Component.view;
    StatelessRoot.reducers = Component.reducers;
    StatelessRoot.initial = Component.initial;
    StatelessRoot.reduce = Component.reduce;
    return StatelessRoot;
  };
}

module.exports = root;
