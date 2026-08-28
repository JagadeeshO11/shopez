import React, { useContext, useEffect, useState } from 'react'
import { BsCart3, BsPersonCircle, BsChevronDown, BsSearch } from 'react-icons/bs'
import '../styles/Navbar.css'
import { useNavigate } from 'react-router-dom'
import { GeneralContext } from '../context/GeneralContext'
import { ImCancelCircle } from 'react-icons/im'
import axios from 'axios'
import { API_BASE } from '../config'

const Navbar = () => {
  const navigate = useNavigate()
  const usertype = localStorage.getItem('userType')
  const username = localStorage.getItem('username')
  const { cartCount } = useContext(GeneralContext)
  const [productSearch, setProductSearch] = useState('')
  const [noResult, setNoResult] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    if (usertype !== 'admin') {
      axios.get(`${API_BASE}/api/v1/products/categories`)
        .then((response) => setCategories(response.data.categories || []))
        .catch(() => setCategories([]))
    }
  }, [usertype])

  const handleSearch = (event) => {
    event?.preventDefault()
    const term = productSearch.trim()
    if (!term) return
    const match = categories.find((category) => category.toLowerCase() === term.toLowerCase())
    if (match) navigate(`/category/${match}`)
    else setNoResult(true)
  }

  if (usertype === 'admin') return null

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button className="brand" onClick={() => navigate('/')} aria-label="ShopEZ home">
          <span className="brand-main">ShopEZ</span>
          <span className="brand-tag">shop easy, live happy</span>
        </button>

        <form className="nav-search" onSubmit={handleSearch}>
          <span className="search-prefix"><BsSearch /></span>
          <input value={productSearch} onChange={(e) => { setProductSearch(e.target.value); setNoResult(false) }} placeholder="Search for products, brands and more" aria-label="Search products" />
          <button type="submit" className="search-submit" aria-label="Search"><BsSearch /></button>
          {noResult && <div className="search-result-data">No matching category found. Try Electronics, Fashion, Mobiles or Groceries. <ImCancelCircle onClick={() => setNoResult(false)} /></div>}
        </form>

        <div className="nav-actions">
          {usertype === 'customer' ? (
            <>
              <button className="nav-action account-action" onClick={() => navigate('/profile')}>
                <BsPersonCircle />
                <span><small>Hello, {username || 'Customer'}</small><strong>Account <BsChevronDown /></strong></span>
              </button>
              <button className="nav-action" onClick={() => navigate('/cart')}>
                <span className="cart-icon-wrap"><BsCart3 /><b>{cartCount}</b></span><strong>Cart</strong>
              </button>
            </>
          ) : (
            <button className="login-action" onClick={() => navigate('/auth')}>Login</button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
