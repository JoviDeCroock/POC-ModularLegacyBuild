import 'core-js/stable/object/assign'
import React from 'react';
import ReactDOM from 'react-dom'
import app from './App';
import Application from './Main';

const x = Object.assign({}, { use: true });
console.log(x);

async function initialize() {
  const result = await app();
  console.log(result)
}

initialize();

// Render React app in the root element
const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.render(<Application />, rootEl);
}

