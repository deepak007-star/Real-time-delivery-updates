import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import Login from './components/Login';
import CustomerDashboard from './components/CustomerDashboard';
import StaffDashboard from './components/StaffDashboard';
import './App.css';
import Register from './components/Register';

const socket = io('wss://localhost:3000'); // Connect to backend socket

const App = () => {
  const [user, setUser] = useState(null);

  // Load user data from localStorage if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token && role) {
      setUser({ token, role });
    }
  }, []);

  // Handler for storing user login details
  const handleLogin = (userData) => {
    setUser({ token: userData.token, role: userData.user.role });
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.user.role);
  };

  // Logout handler to clear the local storage
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  // Listen to socket updates when the app is loaded
  useEffect(() => {
    if (user?.role === 'customer') {
      socket.on('orderUpdated', (updatedOrder) => {
        console.log('Order updated:', updatedOrder);
        // You can also trigger a re-fetch of orders here to keep the data up-to-date.
      });
    } else if (user?.role === 'staff') {
      socket.on('orderStatusUpdated', (updatedOrder) => {
        console.log('Order status updated:', updatedOrder);
        // Similarly, you can trigger a re-fetch or update dashboard UI here
      });
    }

    return () => {
      socket.off('orderUpdated');
      socket.off('orderStatusUpdated');
    };
  }, [user]);

  return (
    <Router>
      <Routes>
        {/* Redirect to dashboard if already logged in */}
        <Route path='/register' element={<Register/>}/>
        <Route
          path="/"
          element={
            user ? (
              user.role === 'customer' ? (
                <Navigate to="/customer-dashboard" />
              ) : (
                <Navigate to="/staff-dashboard" />
              )
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* Conditionally render the dashboards based on role */}
        <Route
          path="/customer-dashboard"
          element={
            user?.role === 'customer' ? (
              <CustomerDashboard onLogout={handleLogout} socket={socket} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/staff-dashboard"
          element={
            user?.role === 'staff' ? (
              <StaffDashboard onLogout={handleLogout} socket={socket} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
