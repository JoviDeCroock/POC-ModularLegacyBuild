// I don't know why these aren't autopolyfilled but hey
// They are excluded in modern mode so whatever floats this boat!
import 'core-js/stable/object/assign'
import 'core-js/features/promise';
import 'preact/debug';
import React from 'react';
import ReactDOM from 'react-dom'
import app from './App';
import Application from './Main';


const x = Object.assign({}, { use: true });
console.log(x);

async function initialize() {
  const result = await app();
  console.log(result)
  console.log(fetch);
  console.log(await fetch('https://jsonplaceholder.typicode.com/todos/1'))
}

initialize();

// Render React app in the root element
const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.render(<Application />, rootEl);
}

