import React, { useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faCheck,
  faListAlt,
} from "@fortawesome/free-solid-svg-icons";
import { background, header } from "../assets/image.js";
import { Link } from "react-router-dom";
import { URL } from "../assets/image.js";

const menuItems = [
  { id: 1, name: "فول", description: "شامى", price: 9 },
  { id: 2, name: "فول", description: "بلدى", price: 9 },
  { id: 3, name: "فول اسكندرانى", description: " شامى ", price: 12 },
  { id: 4, name: "فول اسكندرانى", description: "بلدى", price: 12 },
  { id: 5, name: "فول سجق", description: " شامى ", price: 20 },
  { id: 6, name: "فول سجق", description: "بلدى", price: 20 },
  { id: 7, name: "طعمية", description: "شامى", price: 9 },
  { id: 8, name: "طعمية", description: "بلدى", price: 9 },
  { id: 9, name: "صوابع", description: "كاتشب و مايونيز بلدى ", price: 15 },
  { id: 10, name: "صوابع", description: "كاتشب و مايونيز شامى ", price: 15 },
  { id: 11, name: "صوابع", description: "شامى", price: 13 },
  { id: 12, name: "صوابع", description: "بلدى", price: 13 },
  { id: 13, name: "شيبسى", description: "شامى", price: 12 },
  { id: 14, name: "شيبسى", description: "بلدى", price: 12 },
  { id: 15, name: "مهروسة", description: "شامى", price: 12 },
  { id: 16, name: "مهروسة", description: "بلدى", price: 12 },
  { id: 17, name: "مسقعة", description: "شامى", price: 12 },
  { id: 18, name: "مسقعة", description: "بلدى", price: 12 },
  { id: 19, name: "جبنة", description: "شامى", price: 12 },
  { id: 20, name: "جبنة", description: "بلدى", price: 12 },
];

function Dashboard() {
  const { user } = useUser();
  const [order, setOrder] = useState([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState({});
  const [comment, setComment] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const addItemToOrder = (item) => {
    const existingItem = order.find((orderItem) => orderItem.id === item.id);

    if (existingItem) {
      const updatedOrder = order.map((orderItem) =>
        orderItem.id === item.id
          ? { ...orderItem, quantity: orderItem.quantity + 1 }
          : orderItem
      );
      setOrder(updatedOrder);
    } else {
      const updatedOrder = [...order, { ...item, quantity: 1 }];
      setOrder(updatedOrder);
    }

    setTotal(total + item.price);

    // Update item count
    setItemCount((prevCount) => ({
      ...prevCount,
      [item.id]: (prevCount[item.id] || 0) + 1,
    }));
  };

  // Handle comment change
  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const submitOrder = async () => {
    const customerEmail =
      user?.primaryEmailAddress?.emailAddress || "guest@example.com";

    const orderData = {
      items: order,
      total: total,
      comment: comment,
      customer: {
        name: user ? user.firstName : "Guest",
        email: customerEmail,
      },
    };

    try {
      const response = await axios.post(`${URL}/api/orders`, orderData);
      setSuccessMessage("Order placed successfully!");
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error("Failed to place the order.");
    }
  };

  return (
    <div>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <img src={header} className="header-image" alt="Header" />

      <h1>Menu</h1>
      <div className="containaer-dashboard">
        {menuItems.map((item) => (
          <div key={item.id} className="containaer-card">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>
              {item.price} <span>LE</span>
            </p>

            <button
              className="button-card"
              onClick={() => addItemToOrder(item)}
            >
              <FontAwesomeIcon icon={faCartPlus} /> Add to Order
            </button>

            {itemCount[item.id] > 0 && <p>Added: {itemCount[item.id]} times</p>}
          </div>
        ))}
      </div>
      <h2>{user ? `Order ${user.firstName}` : "Current Order"}:</h2>

      {order.map((item, index) => (
        <div key={index}>
          <p>
            {item.name} {item.description} - {item.quantity} x {item.price} LE
          </p>
        </div>
      ))}
      <br />
      <h3>Total Price : {total} LE</h3>

      <div className="conta-btn-cta">
        <button className="button-card" onClick={submitOrder}>
          <FontAwesomeIcon icon={faCheck} /> Place Order
        </button>

        <Link to="/OrdersList" className="view-order">
          <button className="button-card">
            <FontAwesomeIcon icon={faListAlt} /> View Orders List
          </button>
        </Link>
      </div>

      <div className="footer">
        <div className="input-group">
          <textarea
            className="input-text"
            value={comment}
            name="text"
            onChange={handleCommentChange}
            placeholder="Add a comment to your order"
            autoComplete="off"
          />
          <label className="input-text-label" htmlFor="text">
            Add a comment to your order
          </label>
        </div>
        <img src={background} alt="" className="image-footer" />
      </div>

      <ToastContainer />
    </div>
  );
}

export default Dashboard;
