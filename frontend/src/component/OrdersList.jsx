import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import './OrdersList.css';
import { background, header } from "../assets/image.js";
import { ToastContainer, toast } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import styles

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { user, isLoaded } = useUser(); // Use Clerk's useUser hook


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://backend-bf-stream.vercel.app/api/orders');
        console.log(response.data); // Log the data to check if comments are included
        setOrders(response.data);
        toast.success('Orders fetched successfully!');
      } catch (error) {
        setError('Failed to fetch orders');
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch orders.');
      } finally {
        setLoadingOrders(false);
      }
    };
  
    fetchOrders();
  }, []);
  

  const handleDelete = async (id, customerEmail) => {
    if (!isLoaded) {
      toast.info("User is not loaded yet. Please wait."); // Show info toast
      return;
    }
  
    try {
      if (user?.emailAddresses[0]?.emailAddress === customerEmail) {
        await axios.delete(`https://backend-bf-stream.vercel.app/api/orders/${id}?email=${user.emailAddresses[0]?.emailAddress}`);
        setOrders(orders.filter(order => order._id !== id));
        toast.success('Order deleted successfully!'); // Show success toast
      } else {
        toast.error('You can only delete your own orders.'); // Show error toast
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Error deleting order.'); // Show error toast
    }
  };
  

  if (!isLoaded || loadingOrders) {
    return <p>Loading data, please wait...</p>;
  }

  // Collect sandwich data by type
  const sandwichTotals = {};
  let totalPrice = 0;

  orders.forEach(order => {
    order.items.forEach(item => {
      // Debugging logs
      console.log(`Item: ${item.name}, Price: ${item.price}, Quantity: ${item.quantity}`);

      const price = parseFloat(item.price); // Ensure price is a number
      if (isNaN(price)) {
        console.warn(`Invalid price value for item ${item.name}: ${item.price}`);
        return;
      }

      if (sandwichTotals[item.name]) {
        sandwichTotals[item.name] += item.quantity; // Increment the quantity of the sandwich
      } else {
        sandwichTotals[item.name] = item.quantity; // Initialize the sandwich quantity
      }
      totalPrice += item.quantity * price; // Sum all sandwich prices
    });
  });

  // Debugging log for totalPrice
  console.log(`Total Price: ${totalPrice}`);

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
      
      {/* Display the comment if it exists */}
      {order.comment && (
  <p><strong>Comment:</strong> {order.comment}</p>
)}
      
      <h4>Items:</h4>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>{item.name} - {item.quantity} x {item.price} LE</li>
        ))}
      </ul>
      
      <button className="delete-button" onClick={() => handleDelete(order._id, order.customer.email)}>
        Delete
      </button>
    </li>
  ))}
</ul>


      {/* Display each sandwich type and its total quantity */}
      <div className='con-totall'>
        <div className='totall'>
          <h2>Sandwich Totals</h2>
          <ul>
            {Object.keys(sandwichTotals).map((sandwich, index) => (
              <li key={index}>{sandwich} - {sandwichTotals[sandwich]} ordered</li>
            ))}
          </ul>
          <h3>Total Price of All Orders : <br /><span className='Name'>{totalPrice.toFixed(2)}</span> LE + {20} delivery = <span className='Name'>{totalPrice + 20} </span> LE</h3>
        </div>
      </div>

      <div className="con-call-to-action">
        <Link to="/dashboard">
          <button className='btn-call-to-action'>Back to Menus</button>
        </Link>
        <div>
          <a href="tel:+201140655659" className="call-button">
            <button className='btn-call-to-action'>Order The Restaurant</button>
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


