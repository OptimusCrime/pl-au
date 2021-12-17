import "core-js/stable";
import "regenerator-runtime/runtime";
import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";

import { store } from "./store";
import {App} from "./components/App/App";

import './styling.scss';

ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
  ), document.getElementById('root')
);
