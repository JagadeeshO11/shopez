import React, { useEffect, useState } from 'react';
import '../../styles/Profile.css';
import axios from 'axios';
import { API_BASE } from '../../config';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [userResponse, ordersResponse] = await Promise.all([
          axios.get(`${API_BASE}/api/v1/users/me`),
          axios.get(`${API_BASE}/api/v1/orders/mine`)
        ]);
        setUser(userResponse.data.user);
        setOrders(ordersResponse.data.orders || []);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="profile-page"><p>Loading profile...</p></div>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h3>{user?.name || 'Profile'}</h3>
        <p>{user?.email}</p>
        <p>{user?.phone || 'No phone added'}</p>
        <p>{user?.address || 'No address added'}</p>
      </div>
      <div className="orders-section">
        <h3>My Orders</h3>
        {orders.length === 0 ? <p>No orders yet.</p> : orders.map(order => (
          <div className="order-card" key={order._id}>
            <strong>Order #{order._id.slice(-6)}</strong>
            <span>{order.status}</span>
            <span>₹ {order.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
