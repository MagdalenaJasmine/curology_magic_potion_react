import React from "react";
import FormInput from "../form-input/form-input";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qty: 0,
      qtyError: "",
      total: 0.0,
      email: "",
      emailError: "",
      ccNum: "",
      ccNumError: "",
      exp: "",
      expError: "",
      backEndErrors: "",
      success: "",
    };
  }

  changeHandler = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
    if (name === "qty") {
      this.setTotal(event);
    }
  };

  setTotal = (event) => {
    const { value } = event.target;
    let cartTotal = value * 49.99;
    this.setState({
      total: cartTotal,
    });
  };

  validate = () => {
    const { qty, email, ccNum, exp } = this.state;

    let isError = false;
    const dateRe = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;

    const errors = {
      qtyError: "",
      emailError: "",
      payment: {
        ccNumError: "",
        expError: "",
      },
    };

    if (qty === 0) {
      isError = true;
      errors.qtyError = "Please select a quantity";
    }

    if (email.indexOf("@") === -1) {
      isError = true;
      errors.emailError = "Requires valid email";
    }
    if (ccNum.length != 16) {
      isError = true;
      errors.ccNumError = "Invalid Credit Card Number";
    }
    // if (exp != exp.match(dateRe)) {
    //   isError = true;
    //   errors.expError = "please enter a valid date";
    // }

    this.setState(errors);
    return isError;
  };

  handleSubmit = (event) => {
    const { qty, total, email, ccNum, exp, backEndErrors } = this.state;
    event.preventDefault();
    const error = this.validate();

    if (!error) {
      fetch("https://curology-rails-api.herokuapp.com/api/magic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          qty: qty,
          total: total,
          email: email,
          payment: {
            ccNum: ccNum,
            exp: exp,
          },
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("resp:", data);
          if (data.error) {
            this.setState({
              backEndErrors: data.error,
            });
          } else {
            this.setState({
              qty: 0,
              qtyError: "",
              total: 0.0,
              email: "",
              emailError: "",
              ccNum: "",
              ccNumError: "",
              exp: "",
              expError: "",
              success: "Congratulations your order has been placed",
            });
          }
        })
        .catch((error) => console.log("error", error));
    }
  };
  render() {
    const {
      qty,
      email,
      ccNum,
      exp,
      qtyError,
      emailError,
      ccNumError,
      expError,
      backEndErrors,
      success,
    } = this.state;
    const totalPrice = qty * 49.99;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <span>Your Order</span>
          <div>
            <FormInput
              type="number"
              name="qty"
              label="Quantity"
              required
              max="3"
              placeholder="Max 3"
              value={qty}
              changeHandler={this.changeHandler}
            />
            {qtyError}
            <FormInput
              type="text"
              required
              placeholder="0.00"
              readOnly={true}
              label="Total $"
              name="total"
              value={totalPrice}
            />
          </div>
          <span>Contact</span>
          <div>
            <FormInput
              type="text"
              name="email"
              label="email"
              placeholder="Email Address"
              value={email}
              changeHandler={this.changeHandler}
            />
            {emailError}
          </div>
          <span>Billing Information</span>
          <div>
            <FormInput
              type="text"
              name="ccNum"
              label="Credit Card Number"
              placeholder="Credit Card Number"
              value={ccNum}
              changeHandler={this.changeHandler}
            />
            {ccNumError}
            <FormInput
              type="text"
              name="exp"
              label="Expiration Date"
              placeholder="mm/yy"
              value={exp}
              changeHandler={this.changeHandler}
            />
            {expError}
          </div>
          <div>
            <input type="submit" />
          </div>
        </form>
        {backEndErrors ? <div>{backEndErrors}</div> : <div>{success}</div>}
      </div>
    );
  }
}
export default Form;
