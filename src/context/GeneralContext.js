import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';

export const GeneralContext = createContext();

const GeneralContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    if (!localStorage.getItem('userId') || !localStorage.getItem('token')) return;
    try {
      const { data } = await axios.get(`${API_BASE}/api/v1/cart`);
      setCartCount(data.cart?.items?.length || 0);
    } catch (error) {
      setCartCount(0);
    }
  };

  const handleSearch = () => navigate('#products-body');

  const saveSession = (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userType', user.role);
    localStorage.setItem('username', user.name);
    localStorage.setItem('email', user.email);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  const login = async () => {
    try {
      const { data } = await axios.post(`${API_BASE}/api/v1/auth/login`, { email, password });
      saveSession(data.user, data.token);
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed.');
    }
  };

  const register = async () => {
    try {
      const { data } = await axios.post(`${API_BASE}/api/v1/auth/register`, {
        name: username,
        email,
        password
      });
      saveSession(data.user, data.token);
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed.');
    }
  };

  const logout = () => {
    delete axios.defaults.headers.common.Authorization;
    localStorage.clear();
    window.location.href = '/auth';
  };

  return (
    <GeneralContext.Provider value={{
      login, register, logout, username, setUsername, email, setEmail,
      password, setPassword, usertype, setUsertype, productSearch,
      setProductSearch, handleSearch, cartCount, fetchCartCount
    }}>
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;
