import React from "react";
import OrderForm from "../form/order-form.component";
import MagicPotion from "../images/magic_potion.png";

import "./homepage.component.css";

const HomePage = () => {
  return (
    <div>
      <div className="image">
        <img
          className="homepage-image"
          src={MagicPotion}
          alt={"magic-potions"}
        />
      </div>

      <div className="order-form">
        <OrderForm />
      </div>
    </div>
  );
};

export default HomePage;
