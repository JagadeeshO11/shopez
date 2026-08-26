import React, { useEffect, useState } from 'react';
import '../../styles/AllUsers.css';
import axios from 'axios';
import { API_BASE } from '../../config';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    Promise.all([
      axios.get(`${API_BASE}/api/v1/users`),
      axios.get(`${API_BASE}/api/v1/orders`)
    ]).then(([usersResponse, ordersResponse]) => {
      setUsers((usersResponse.data.users || []).filter(user => user.role === 'customer'));
      setOrders(ordersResponse.data.orders || []);
    }).catch(error => {
      console.error('Failed to fetch users:', error);
      alert(error.response?.data?.message || 'Unable to load users');
    });
  }, []);

  return (
    <div className="all-users-page"><h3>All Users</h3><div className="user-cards">
      {users.map(user => (
        <div className="user-card" key={user._id}>
          <span><h5>User ID</h5><p>{user._id}</p></span>
          <span><h5>User Name</h5><p>{user.name}</p></span>
          <span><h5>Email Address</h5><p>{user.email}</p></span>
          <span><h5>Orders</h5><p>{orders.filter(order => String(order.user?._id || order.user) === String(user._id)).length}</p></span>
        </div>
      ))}
    </div></div>
  );
};

export default AllUsers;
