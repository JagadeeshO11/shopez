import React, { useContext, useEffect, useState } from 'react'
import {BsCart3, BsPersonCircle} from 'react-icons/bs'
import {FcSearch} from 'react-icons/fc'
import '../styles/Navbar.css'
import { useNavigate } from 'react-router-dom'
import { GeneralContext } from '../context/GeneralContext'
import {ImCancelCircle} from 'react-icons/im'
import axios from 'axios'
import { API_BASE } from '../config'

const Navbar = () => {
  const navigate = useNavigate();
  const usertype = localStorage.getItem('userType');
  const username = localStorage.getItem('username');
  const {cartCount} = useContext(GeneralContext);

  const [productSearch, setProductSearch] = useState('');
  const [noResult, setNoResult] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(()=>{
    if (usertype !== 'admin') fetchData();
  }, [usertype])

  const fetchData = async() =>{
    try {
      const response = await axios.get(`${API_BASE}/api/v1/products/categories`);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    }
  }

  const handleSearch = () =>{
    if (categories.includes(productSearch)) navigate(`/category/${productSearch}`);
    else setNoResult(true);
  }

  if (usertype === 'admin') return null;

  return (
    <>
      {!usertype ? (<div className="navbar">
        <h3 onClick={()=> navigate('/')}>ShopEZ</h3>
        <div className="nav-content">
          <div className="nav-search">
            <input type="text" name="nav-search" id="nav-search" placeholder='Search Electronics, Fashion, mobiles, etc.,' onChange={(e)=>setProductSearch(e.target.value)} />
            <FcSearch className="nav-search-icon" onClick={handleSearch} />
            {noResult === true ? <div className='search-result-data'>no items found.... try searching for Electronics, mobiles, Groceries, etc., <ImCancelCircle className='search-result-data-close-btn' onClick={()=> setNoResult(false)} /></div> : ""}
          </div>
          <button className='btn' onClick={()=> navigate('/auth')}>Login</button>
        </div>
      </div>) : usertype === 'customer' ? (
        <div className="navbar">
          <h3 onClick={()=> navigate('/')}>ShopEZ</h3>
          <div className="nav-content">
            <div className="nav-search">
              <input type="text" name="nav-search" id="nav-search" placeholder='Search Electronics, Fashion, mobiles, etc.,' onChange={(e)=>setProductSearch(e.target.value)} />
              <FcSearch className="nav-search-icon" onClick={handleSearch} />
              {noResult === true ? <div className='search-result-data'>no items found.... try searching for Electronics, mobiles, Groceries, etc., <ImCancelCircle className='search-result-data-close-btn' onClick={()=> setNoResult(false)} /></div> : ""}
            </div>
            <div className='nav-content-icons' >
              <div className="nav-profile" onClick={()=> navigate('/profile')}>
                <BsPersonCircle className='navbar-icons' data-bs-toggle="tooltip" data-bs-placement="bottom" title="Profile" />
                <p>{username}</p>
              </div>
              <div className="nav-cart" onClick={()=> navigate('/cart')}>
                <BsCart3 className='navbar-icons' data-bs-toggle="tooltip" data-bs-placement="bottom" title="Cart" />
                <div className="cart-count">{cartCount}</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Navbar