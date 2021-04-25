import React from "react";
import CustomButton from "../custom_button/custom-button.component";
import Divider from "../divider/divider.component";
import FormInput from "../form-input/form-input";
import "./form.styles.css";

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
          <span className="headers">Your Order</span>
          <div className="form-inline">
            <FormInput
              type="number"
              name="qty"
              label="Qty*"
              required
              max="3"
              placeholder="Max 3"
              value={qty}
              error={qtyError}
              changeHandler={this.changeHandler}
            />
            <FormInput
              type="text"
              required
              placeholder="0.00"
              readOnly={true}
              label="Total Price"
              name="total"
              value={totalPrice}
            />
          </div>
          <Divider />
          <span className="headers">Contact</span>
          <div>
            <FormInput
              type="text"
              name="email"
              label="Email Address"
              placeholder="Email Address"
              value={email}
              error={emailError}
              changeHandler={this.changeHandler}
            />
          </div>
          <Divider />
          <span className="headers">Billing Information</span>
          <div>
            <FormInput
              type="text"
              name="ccNum"
              label="Credit Card Number"
              placeholder="Credit Card Number"
              value={ccNum}
              error={ccNumError}
              changeHandler={this.changeHandler}
            />

            <FormInput
              type="text"
              name="exp"
              label="Expiration Date"
              placeholder="mm/yy"
              value={exp}
              error={expError}
              changeHandler={this.changeHandler}
            />
          </div>
          <Divider />
          <div>
            <CustomButton type="submit" value="Submit Form">
              Place Your Order
            </CustomButton>
          </div>
        </form>
        {backEndErrors ? (
          <div className="backend-error">{backEndErrors}</div>
        ) : (
          <div className="success-message">{success}</div>
        )}
      </div>
    );
  }
}
export default Form;
