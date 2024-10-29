import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerDashboard = ({ onLogout, socket }) => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://localhost:3000/user/order', {
        headers: {
          Authorization: `Bearer ${token}`    
        }
      });
      setOrders(response.data);
    };

    fetchOrders();

    // Listen for real-time updates
    socket.on('orderUpdate', (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });
  }, [socket]);

  const handleNewOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('user');
      const response = await axios.post(
        'https://localhost:3000/user/order',
        { orderDescription: newOrder },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        }
      );
      
      // Add the new order to the state to show it in the list
      setOrders([...orders, response.data]);
      setNewOrder(''); // Clear input field
    } catch (err) {
      console.error('Failed to create order', err);
    }

    setLoading(false);
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className='flex w-2/3 m-auto '>

    <div className="p-4 ">
      <h1 className="text-2xl font-bold">Customer Dashboard</h1>

      {/* Create New Order Form */}
      <form onSubmit={handleNewOrder} className="mb-4">
        <label className="block mb-2 text-lg font-semibold">Create New Order</label>
        <input
          type="text"
          value={newOrder}
          onChange={(e) => setNewOrder(e.target.value)}
          placeholder="Enter order description"
          className="w-full px-3 py-2 mb-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          {loading ? 'Creating...' : 'Create Order'}
        </button>
      </form>

      {/* Display Orders */}
      {orders.length === 0 ? (
        <p>No orders found. Please create a new order.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              Order id:{order._id} - Status: {order.status}
            </li>
          ))}
        </ul>
      )}

      <button onClick={handleLogout} className="px-4 py-2 mt-4 text-white bg-red-500 rounded">Logout</button>
    </div>
    </div>

  );
};

export default CustomerDashboard;
