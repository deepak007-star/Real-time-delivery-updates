import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StaffDashboard = ({ onLogout, socket }) => {
  const [orders, setOrders] = useState([]);

  // Fetch orders on component mount and set up socket for real-time updates
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

    socket.on('orderStatusUpdated', (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    return () => {
      socket.off('orderStatusUpdated');
    };
  }, [socket]);

  const handleUpdateOrder = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://localhost:3000/update-order',
        { orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the order in the state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: response.data.status } : order
        )
      );
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Staff Dashboard</h1>

      {/* Orders list */}
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order._id} className="p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center">
                <p className="text-gray-800">Order ID: {order._id}</p>
                <p className="text-gray-600">Status: {order.status}</p>
              </div>
              <div className="mt-4 space-x-2">
                <button
                  onClick={() => handleUpdateOrder(order._id, 'Processing')}
                  className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  Process
                </button>
                <button
                  onClick={() => handleUpdateOrder(order._id, 'Shipped')}
                  className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Ship
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Logout */}
      <button
        onClick={onLogout}
        className="mt-6 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Logout
      </button>
    </div>
  );
};

export default StaffDashboard;
