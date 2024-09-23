import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import './OrdersList.css';
import { background, header } from "../assets/image.js";
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faArrowLeft, faPhone } from '@fortawesome/free-solid-svg-icons';

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const { user, isLoaded } = useUser(); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://backend-bf-stream.vercel.app/api/orders');
        setOrders(response.data);
      } catch (error) {
        setError('Failed to fetch orders');
        toast.error('Failed to fetch orders.');
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
    
    const buttonDisabledUntil = localStorage.getItem('buttonDisabledUntil');
    if (buttonDisabledUntil && new Date(buttonDisabledUntil) > new Date()) {
      setButtonDisabled(true);
    }
  }, []);

  const handleDelete = async (id, customerEmail) => {
    if (!isLoaded) {
      toast.info("User is not loaded yet. Please wait.");
      return;
    }

    try {
      if (user?.emailAddresses[0]?.emailAddress === customerEmail) {
        await axios.delete(`https://backend-bf-stream.vercel.app/api/orders/${id}?email=${user.emailAddresses[0]?.emailAddress}`);
        setOrders(orders.filter(order => order._id !== id));
        toast.success('Order deleted successfully!');
      } else {
        toast.error('You can only delete your own orders.');
      }
    } catch (error) {
      toast.error('Error deleting order.');
    }
  };


  if (!isLoaded || loadingOrders) {
    return <p>Loading data, please wait...</p>;
  }

  const sandwichTotals = {};
  let totalPrice = 0;

  orders.forEach(order => {
    order.items.forEach(item => {
      const price = parseFloat(item.price);
      if (isNaN(price)) return;
      const sandwichKey = `${item.name} (${item.description})`;
      sandwichTotals[sandwichKey] = (sandwichTotals[sandwichKey] || 0) + item.quantity;
      totalPrice += item.quantity * price;
    });
  });

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
      <h1>Orders List</h1>
      {error && <p>{error}</p>}

      <ul className='containaer-OrderList'>
        {orders.map((order) => (
          <li key={order._id} className='card-OrderList'>
            <h3>Order Name: <span className='Name'>{order.customer.name}</span></h3>
            <p>Total: <span className='order-total'>{order.total}</span> LE <span className='included'> Delivery is not included.</span></p>
            {order.comment && (
              <p><strong>Comment:</strong> {order.comment}</p>
            )}
            <h4>Items:</h4>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>{item.name} {item.description} - {item.quantity} x {item.price} LE</li>
              ))}
            </ul>
            <button className="delete-button" onClick={() => handleDelete(order._id, order.customer.email)}>
              <FontAwesomeIcon icon={faTrash} /> Delete
            </button>
          </li>
        ))}
      </ul>

      <div className='con-totall'>
        <div className='totall'>
          <h2>Sandwich Totals</h2>
          <ul>
            {Object.keys(sandwichTotals).map((sandwich, index) => (
              <li key={index}>
                {sandwich} - {sandwichTotals[sandwich]} 
              </li>
            ))}
          </ul>
          <h3>Total Price of All Orders : <br /><span className='Name'>{totalPrice.toFixed(2)}</span> LE + {20} delivery = <span className='Name'>{(totalPrice + 20).toFixed(2)}</span> LE</h3>
        </div>
      </div>

      <div className="con-call-to-action">
        <Link to="/dashboard">
          <button className='btn-call-to-action'> <FontAwesomeIcon icon={faArrowLeft} /> Back to Menus</button>
        </Link>
        <div>
          <a href="tel:+201140655659" className="call-button">
            <button
              className={`btn-call-to-action ${isButtonDisabled ? 'disabled' : ''}`}
              onClick={isButtonDisabled ? null : handleOrderRestaurant}
              disabled={isButtonDisabled}
            >
              <FontAwesomeIcon icon={faPhone} /> Order The Restaurant
            </button>
          </a>
        </div>
      </div>

      <div className="footer">
        <img src={background} alt="" className="image-footer" />
      </div>
      <ToastContainer />  
    </div>
  );
}

export default OrdersList;
