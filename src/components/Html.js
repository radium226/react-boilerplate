import React, { Component, PropTypes } from 'react';

class Html extends Component {

  static propTypes = {
    body: PropTypes.string.isRequired,
    initialState: PropTypes.object,
    historyStrategy: PropTypes.string,
  };

  // TODO: Remove Bootstrap import
  render() {
    const { initialState, historyStrategy } = this.props;
    return (
      <html className="no-js" lang="en">
        <head>
          <meta charSet="utf-8" />
          <title>Radium</title>
        </head>
        <body>
          <div id="client" dangerouslySetInnerHTML={{ __html: this.props.body }} />
          <script dangerouslySetInnerHTML={{ __html: 'window.__INITIAL_STATE__ = ' + JSON.stringify(initialState) + ';\n window.__HISTORY_TYPE__ = \'' + historyStrategy + '\'; ' }} />
          <script src="scripts/vendor.js" />
          <script src="scripts/client.js" />
        </body>
      </html>
    );
  }

}

export default Html;
