import React from "react";

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const validateFrom = (errors) => {
  let valid = true;
  Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
  return valid;
};

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qty: 0,
      total: 0.0,
      email: "",
      payment: { ccNum: "", exp: "" },
      errors: {
        qty: "",
        email: "",
      },
    };
  }

  changeHandler = (event) => {
    const { name, value } = event.target;
    let errors = this.state.errors;
    switch (name) {
      case "email":
        errors.email = validEmailRegex.test(value)
          ? ""
          : "Please enter a valid email";
        break;
      default:
        break;
    }

    this.setState({
      errors,
      [name]: value,
    });
  };
  qtyChangeHandler = (event) => {
    // const re = /^[0-9\b]+$/;
    const { name, value } = event.target;

    // if (value === "" || (re.test(value) && value <= 3)) {
    //   this.setState({ qty: value });
    //   this.setTotal(event);
    // } else {
    //   console.log("Value must be a number");
    // }
    this.setState({
      [name]: value,
    });
    this.setTotal(event);
  };
  paymentChangeHandler = (event) => {
    const payment = { ...this.state.payment };
    const { name, value } = event.target;
    this.setState({
      payment: {
        [name]: value,
      },
    });
  };

  setTotal = (event) => {
    const { value } = event.target;
    let cartTotal = value * 49.99;
    this.setState({
      total: cartTotal,
    });
  };

  formSubmit = (event) => {
    const { qty, total, email, ccNum, exp } = this.state;
    event.preventDefault();
    console.log("submitted");
    if (validateFrom(this.state.errors)) {
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
      });
    } else {
      console.log("errors");
    }
  };

  render() {
    const { qty, email, ccNum, exp, errors } = this.state;
    const totalPrice = qty * 49.99;
    return (
      <div>
        {" "}
        <form onSubmit={this.formSubmit}>
          <span>Your Order</span>
          <div>
            <label>
              Qty
              <input
                type="number"
                name="qty"
                required
                min="1"
                max="3"
                placeholder="Max 3"
                value={qty}
                onChange={this.qtyChangeHandler}
              />
            </label>

            <label>
              Total $
              <input
                type="text"
                readOnly={true}
                name="total"
                placeholder="0.00"
                value={totalPrice}
                // onChange={this.changeHandler}
              />
            </label>
          </div>
          <span>Contact</span>
          <div>
            <label>
              {" "}
              email
              <input
                type="text"
                name="email"
                placeholder="Email Address"
                value={email}
                onChange={this.changeHandler}
              />
              {errors.email.length > 0 && (
                <span className="error">{errors.email}</span>
              )}
            </label>
          </div>
          <span>Billing Information</span>
          <div>
            <label>
              Credit Card Number
              <input
                type="text"
                name="ccNum"
                placeholder="Credit Card Number"
                value={ccNum}
                onChange={this.paymentChangeHandler}
              />
            </label>
            <label>
              Expiration Date
              <input
                type="text"
                name="exp"
                placeholder="mm/yy"
                value={exp}
                onChange={this.paymentChangeHandler}
              />
            </label>
          </div>
          <div>
            <input type="submit" />
          </div>
        </form>
      </div>
    );
  }
}
export default Form;
