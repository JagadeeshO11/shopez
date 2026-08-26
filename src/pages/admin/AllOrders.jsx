import React, { useEffect, useState } from 'react';
import '../../styles/AllOrders.css';
import axios from 'axios';
import { API_BASE } from '../../config';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState({});

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/v1/orders`);
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      alert(error.response?.data?.message || 'Unable to load orders');
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id) => {
    const status = statuses[id];
    if (!status) return;
    try {
      await axios.patch(`${API_BASE}/api/v1/orders/${id}/status`, { status });
      setStatuses(current => ({ ...current, [id]: '' }));
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Order status update failed');
    }
  };

  const cancelOrder = async (id) => {
    try {
      await axios.patch(`${API_BASE}/api/v1/orders/${id}/status`, { status: 'cancelled' });
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Order cancellation failed');
    }
  };

  return (
    <div className="all-orders-page"><h3>Orders</h3><div className="all-orders">
      {orders.map(order => (
        <div className="all-orders-order" key={order._id}>
          <div className="all-orders-order-data">
            <h4>Order #{order._id.slice(-8)}</h4>
            <p><b>Status:</b> {order.status}</p>
            <p><b>Payment:</b> {order.paymentMethod}</p>
            <p><b>Total:</b> ₹ {order.total}</p>
            <p><b>Customer:</b> {order.user?.name} ({order.user?.email})</p>
            <p><b>Phone:</b> {order.user?.phone || order.shippingAddress?.mobile || order.shippingAddress?.phone || 'N/A'}</p>
            <p><b>Address:</b> {order.shippingAddress?.address || 'N/A'}</p>
            <p><b>Ordered:</b> {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</p>
            {order.status !== 'delivered' && order.status !== 'cancelled' && <div className="order-admin-actions">
              <select className="form-select form-select-sm" value={statuses[order._id] || ''} onChange={e => setStatuses(current => ({ ...current, [order._id]: e.target.value }))}>
                <option value="">Update status</option><option value="confirmed">Confirmed</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
              </select>
              <button className="btn btn-primary" onClick={() => updateStatus(order._id)}>Update</button>
              <button className="btn btn-danger" onClick={() => cancelOrder(order._id)}>Cancel</button>
            </div>}
          </div>
        </div>
      ))}
    </div></div>
  );
};

export default AllOrders;
