import React from "react";
import "./form-input.css";
const FormInput = ({ changeHandler, label, error, ...otherProps }) => (
  <div>
    <div>{label ? <label className="form-label">{label}</label> : null}</div>
    <input className="form-input" onChange={changeHandler} {...otherProps} />
    <div>{error ? <div className="field-error">{error}</div> : null}</div>
  </div>
);
export default FormInput;
