import React, { useEffect, useState } from 'react';
import '../../styles/AllWishlists.css';
import axios from 'axios';
import { API_BASE } from '../../config';

const AllWishlists = () => {
  const [wishlists, setWishlists] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/api/v1/wishlist/all`)
      .then(response => setWishlists(response.data.wishlists || []))
      .catch(error => alert(error.response?.data?.message || 'Unable to load wishlists'));
  }, []);

  return (
    <div className="all-wishlists-page"><h3>User Wishlists</h3><div className="wishlists-grid">
      {wishlists.map(item => (
        <div className="wishlist-card" key={`${item.userId}-${item._id}`}>
          <img src={item.image} alt={item.name} />
          <div className="wishlist-info"><h6>{item.name}</h6><p className="wishlist-price">₹{item.price}</p><p className="wishlist-user">User: {item.username || item.userId}</p><p className="wishlist-date">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</p></div>
        </div>
      ))}
    </div></div>
  );
};

export default AllWishlists;
