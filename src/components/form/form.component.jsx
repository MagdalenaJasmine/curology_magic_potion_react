import React from "react";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qty: 0,
      total: 0.0,
      email: "",
      payment: { ccNum: "", exp: "" },
    };
  }
  twoCalls = (e) => {
    this.changeHandler(e);
    this.setTotal(e);
  };

  changeHandler = (event) => {
    console.log(event.target);
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      // total: cartTotal,
    });
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
    console.log("total set", event.target, cartTotal);
    this.setState({
      total: cartTotal,
    });
  };

  formSubmit = (event) => {
    const { qty, total, email, ccNum, exp } = this.state;
    event.preventDefault();
    console.log("submitted");

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
  };

  render() {
    const { qty, email, ccNum, exp } = this.state;
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
                type="text"
                name="qty"
                placeholder="Max 3"
                value={qty}
                onChange={this.twoCalls}
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
