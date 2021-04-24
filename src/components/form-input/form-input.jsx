import React from "react";

const FormInput = ({ changeHandler, label, ...otherProps }) => (
  <div>
    {label ? <label>{label}</label> : null}
    <input className="form-input" onChange={changeHandler} {...otherProps} />
  </div>
);
export default FormInput;
