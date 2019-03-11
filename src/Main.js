import React from 'react';
import Form from './Form';

const Application = () => {
  const data = ['1', '2', '3']
  return (
    <React.Fragment>
      <p>
        I am an  application stating some data
        {data.map((x) => `${x}\n`)}
      </p>
      <div>
        Application
      </div>
      <Form />
    </React.Fragment>
  )
}

export default Application;
