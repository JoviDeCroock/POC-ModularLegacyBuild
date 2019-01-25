import React from 'react';
import ReactDOM from 'react-dom'
import app from './App';
import Application from './Main';

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

