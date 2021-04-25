import React from "react";
import "./form-input.css";
const FormInput = ({ changeHandler, label, error, ...otherProps }) => (
  <div>
    <div>{label ? <label className="form-label">{label}</label> : null}</div>
    <input
      className="form-input"
      style={{ border: error ? "1px solid red" : "" }}
      onChange={changeHandler}
      {...otherProps}
    />
    <div>{error ? <div className="field-error">{error}</div> : null}</div>
  </div>
);
export default FormInput;
