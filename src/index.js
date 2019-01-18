import app from './App';

async function initialize() {
  console.log(await app())
}

console.log('HI!');

initialize();
