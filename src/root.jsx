import React from 'react';

function root(options = {}) {
  return function (Component) {
    class StatelessRoot extends React.Component {
      constructor(props) {
        super(props);
        if (!options.getModel) {
          this.model = Component.initial;
        }
      }

      reduce(message) {
        if (options.reduce) {
          options.reduce(message);
        } else {
          this.model = Component.reduce(this.model, message, this.reduce.bind(this));
          this.forceUpdate();
        }
      }

      render() {
        let sender = this.reduce.bind(this);
        let model;
        if (options.getModel) {
          model = options.getModel(this.props, this.state, this.context);
        } else {
          model = this.model;
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
