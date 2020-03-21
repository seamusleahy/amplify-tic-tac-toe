import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as logGraphQl from './logGraphQl';

logGraphQl.subscribe(logGraphQl.consoleLogger);

ReactDOM.render(<App />, document.getElementById('root'));