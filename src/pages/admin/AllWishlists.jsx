import React, { useEffect, useState } from 'react'
import '../../styles/AllWishlists.css'
import axios from 'axios'

const AllWishlists = () => {
  const [wishlists, setWishlists] = useState([]);

  useEffect(() => {
    fetchWishlists();
  }, [])

  const fetchWishlists = async () => {
    await axios.get('http://localhost:6001/fetch-all-wishlists').then(
      (response) => {
        setWishlists(response.data);
      }
    )
  }

  return (
    <div className="all-wishlists-page">
      <h3>User Wishlists</h3>
      <div className="wishlists-grid">
        {wishlists.map((item) => (
          <div className="wishlist-card" key={item._id}>
            <img src={item.mainImg} alt={item.title} />
            <div className="wishlist-info">
              <h6>{item.title}</h6>
              <p className="wishlist-price">₹{parseInt(item.price - (item.price * item.discount)/100)} <s>₹{item.price}</s></p>
              <p className="wishlist-user">User ID: {item.userId}</p>
              <p className="wishlist-date">{new Date(item.addedAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllWishlists
