import React from 'react';

const Application = () => {
  const data = ['1', '2', '3']
  return (
    <p>
      I am an  application stating some data
      {data.map((x) => `${x}\n`)}
    </p>
  )
}

export default Application;
