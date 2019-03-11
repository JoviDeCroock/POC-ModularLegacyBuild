import React from 'react';
import { Field, Form } from 'hooked-form';

const StringField = ({ ...props }) => <input {...props} />

const FormContainer = () => {
  return (
    <React.Fragment>
      <StringField fieldId="name" />
      <StringField fieldId="Place" />
    </React.Fragment>
  )
}

export default Form({
  onSubmit: console.warn,
  mapPropsToValues: () => ({
    name: 'Jovi',
    place: 'Belgium',
  }),
})(FormContainer);
