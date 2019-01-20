import React from 'react';
import ReactDOM from 'react-dom'
import app from './App';
import Application from './Main';

async function initialize() {
  const result = await app();
  console.log(result)
}

console.log('HI!');
initialize();

// Inject React root element
if (document.body) {
  document.body.innerHTML += '<div id="root"></div>';
}

// Render React app in the root element
const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.render(<Application />, rootEl);
}

