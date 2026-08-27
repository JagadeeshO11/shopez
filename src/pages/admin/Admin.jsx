import React, { useEffect, useState } from 'react'
import '../../styles/Admin.css'
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import { API_BASE } from '../../config';

const Admin = () => {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(()=>{
    const userType = localStorage.getItem('userType');
    if(!userType || userType !== 'admin') navigate('/auth');
    else fetchCountData();
    // eslint-disable-next-line
  }, [])

  const fetchCountData = async() =>{
    try {
      const [usersResponse, productsResponse, ordersResponse] = await Promise.all([
        axios.get(`${API_BASE}/api/v1/users`),
        axios.get(`${API_BASE}/api/v1/products`),
        axios.get(`${API_BASE}/api/v1/orders`)
      ]);
      setUserCount((usersResponse.data.users || []).filter(user => user.role === 'customer').length);
      setProductCount((productsResponse.data.products || []).length);
      setOrdersCount((ordersResponse.data.orders || []).length);
    } catch(err) {
      console.error('Failed to load admin dashboard:', err);
    }
  }

  return (
    <div className="admin-page">
      <div><div className="admin-home-card"><h5>Total users</h5><p>{userCount}</p><button onClick={()=> navigate('/users')}>View all</button></div></div>
      <div><div className="admin-home-card"><h5>All Products</h5><p>{productCount}</p><button onClick={()=> navigate('/products')}>View all</button></div></div>
      <div><div className="admin-home-card"><h5>All Orders</h5><p>{ordersCount}</p><button onClick={()=> navigate('/orders')}>View all</button></div></div>
      <div><div className="admin-home-card"><h5>Add Product</h5><p>(new)</p><button onClick={()=> navigate('/products/new')}>Add now</button></div></div>
    </div>
  )
}

export default Admin