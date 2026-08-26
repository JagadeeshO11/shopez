import React, { useContext, useEffect, useState, useCallback } from 'react'
import '../../styles/Profile.css'
import { GeneralContext } from '../../context/GeneralContext'
import axios from 'axios';
import { API_BASE } from '../../config';
 
const Profile = () => {
  const {logout} = useContext(GeneralContext);
  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/v1/orders/mine`);
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const cancelOrder = async (id) => {
    try {
      await axios.patch(`${API_BASE}/api/v1/orders/${id}/status`, {status: 'cancelled'});
      alert("Order cancelled!!");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Order cancellation failed!!");
    }
  };

  return ( 
    <div className="profilePage">
      <div className="profileCard">
        <span><h5>Username: </h5><p>{localStorage.getItem('username')}</p></span>
        <span><h5>Email: </h5><p>{localStorage.getItem('email')}</p></span>
        <span><h5>Orders: </h5><p>{orders.length}</p></span>
        <button className='btn btn-danger' onClick={logout}>Logout</button>
      </div>
      <div className="profileOrders-container">
        <h3>Orders</h3>
        <div className="profileOrders">
          {orders.map((order) => (
            <div className="profileOrder" key={order._id}>
              <img src={order.items?.[0]?.image || ''} alt={order.items?.[0]?.name || 'Product'} />
              <div className="profileOrder-data">
                <h4>{order.items?.[0]?.name || 'Order'}</h4>
                <p>{order.items?.length || 0} item(s)</p>
                <div>
                  <span><p><b>Quantity: </b> {order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0)}</p></span>
                  <span><p><b>Total: </b> ₹ {order.total}</p></span>
                  <span><p><b>Payment method: </b> {order.paymentMethod}</p></span>
                </div>
                <div>
                  <span><p><b>Ordered on: </b> {new Date(order.createdAt).toLocaleDateString()}</p></span>
                  <span><p><b>Order status: </b> {order.status}</p></span>
                </div>
                {order.status !== 'delivered' && order.status !== 'cancelled' ?
                  <button className='btn btn-danger' onClick={()=> cancelOrder(order._id)}>Cancel</button>
                  : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile