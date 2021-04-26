import React from "react";
import CustomButton from "../custom_button/custom-button.component";
import Divider from "../divider/divider.component";
import FormInput from "../form-input/form-input";
import "./order-form.styles.css";

class OrderForm extends React.Component {
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
    const { name, value, type } = event.target;
    this.setState({
      [name]: type === "number" ? parseInt(value) : value,
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

    const errors = {
      qtyError: "",
      emailError: "",
      payment: {
        ccNumError: "",
        expError: "",
      },
    };
    let isError = false;

    if (qty === 0) {
      isError = true;
      errors.qtyError = "Please select a quantity";
    }
    if (qty > 3) {
      isError = true;
      errors.qtyError = "Please select no more than three";
    }

    if (!/^\w+@\w+\.[A-Za-z]+$/.test(email)) {
      isError = true;
      errors.emailError = "Please enter a valid email address";
    }

    if (!/^\d{2}\/\d{2}$/.test(exp)) {
      isError = true;
      errors.expError = "Please enter a valid expiration date";
    }

    if (!/^\d{16}$/.test(ccNum)) {
      isError = true;
      errors.ccNumError = "Please enter a valid credit card number";
    }
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
          quantity: qty,
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
              backEndErrors: "",
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
            <div>
              <FormInput
                type="number"
                name="qty"
                label="Qty*"
                required
                min="0"
                placeholder="Max 3"
                value={qty || ""}
                error={qtyError}
                changeHandler={this.changeHandler}
              />
            </div>
            <div>
              <FormInput
                type="text"
                required
                placeholder="0.00"
                readOnly={true}
                label="Total Price"
                required
                name="total"
                value={totalPrice || ""}
              />
            </div>
          </div>
          <Divider />
          <span className="headers">Contact</span>
          <div className>
            <FormInput
              type="text"
              name="email"
              label="Email Address"
              required
              placeholder="Email Address"
              value={email.trim()}
              error={emailError}
              changeHandler={this.changeHandler}
            />
          </div>
          <Divider />
          <span className="headers">Billing Information</span>
          <div className="form-inline">
            <FormInput
              type="text"
              name="ccNum"
              label="Credit Card Number"
              required
              placeholder="Credit Card Number"
              value={ccNum.trim()}
              error={ccNumError}
              changeHandler={this.changeHandler}
            />

            <FormInput
              type="text"
              name="exp"
              label="Expiration Date"
              required
              placeholder="mm/yy"
              value={exp.trim()}
              error={expError}
              changeHandler={this.changeHandler}
            />
          </div>
          <Divider />
          <div className="button">
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
export default OrderForm;
