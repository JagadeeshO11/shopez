import React, { useContext } from 'react'
import '../styles/Navbar.css'
import { useNavigate } from 'react-router-dom'
import { GeneralContext } from '../context/GeneralContext'

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { logout } = useContext(GeneralContext);
  const username = localStorage.getItem('username');

  return (
    <div className="navbar-admin">
      <h3 onClick={() => navigate('/')}>ShopEZ Admin</h3>
      
      <ul>
        <li onClick={() => navigate('/')}>Dashboard</li>
        <li onClick={() => navigate('/users')}>Users</li>
        <li onClick={() => navigate('/orders')}>Orders</li>
        <li onClick={() => navigate('/products')}>Products</li>
        <li onClick={() => navigate('/shares')}>Shares</li>
        <li onClick={() => navigate('/wishlists')}>Wishlists</li>
        <li onClick={() => navigate('/products/new')}>New Product</li>
        <li>{username}</li>
        <li onClick={logout}>Logout</li>
      </ul>
    </div>
  )
}

export default AdminNavbar