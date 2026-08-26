import React, { useEffect, useState } from 'react'
import '../styles/Products.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {IoShareSocialOutline, IoHeartOutline, IoHeart} from 'react-icons/io5';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:6001';

const Products = (props) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const userId = localStorage.getItem('userId');
  const [sortFilter, setSortFilter] = useState('popularity');
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [genderFilter, setGenderFilter] = useState([]);

  const fetchWishlist = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`${API_BASE}/fetch-wishlist/${userId}`);
      setWishlist(response.data);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  };

  const fetchData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        axios.get(`${API_BASE}/fetch-products`),
        axios.get(`${API_BASE}/fetch-categories`)
      ]);
      const allProducts = productsResponse.data;
      setProducts(allProducts);
      setVisibleProducts(props.category === 'all' ? allProducts : allProducts.filter(product => product.category === props.category));
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchWishlist();
  }, [props.category, userId]);

  const handleCategoryCheckBox = (e) => {
    const value = e.target.value;
    setCategoryFilter(current => e.target.checked ? [...current, value] : current.filter(item => item !== value));
  };

  const handleGenderCheckBox = (e) => {
    const value = e.target.value;
    setGenderFilter(current => e.target.checked ? [...current, value] : current.filter(item => item !== value));
  };

  const handleSortFilterChange = (e) => {
    const value = e.target.value;
    setSortFilter(value);
    setVisibleProducts(current => {
      const sorted = [...current];
      if (value === 'low-price') return sorted.sort((a,b) => a.price - b.price);
      if (value === 'high-price') return sorted.sort((a,b) => b.price - a.price);
      if (value === 'discount') return sorted.sort((a,b) => (b.discount || 0) - (a.discount || 0));
      return sorted;
    });
  };

  useEffect(() => {
    let filtered = props.category === 'all' ? products : products.filter(product => product.category === props.category);
    if (categoryFilter.length > 0) filtered = filtered.filter(product => categoryFilter.includes(product.category));
    if (genderFilter.length > 0) filtered = filtered.filter(product => genderFilter.includes(product.gender));
    setVisibleProducts(filtered);
  }, [categoryFilter, genderFilter, products, props.category]);

  const handleShare = async(e, product) => {
    e.stopPropagation();
    const username = localStorage.getItem('username') || 'Guest';
    const shareUrl = `${window.location.origin}/product/${product._id}`;
    const shareData = {title: product.title, text: `Check out ${product.title} - ₹${parseInt(product.price - (product.price * product.discount)/100)}`, url: shareUrl};
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        await axios.post(`${API_BASE}/share-product`, {productId: product._id, productTitle: product.title, sharedBy: username, sharedTo: 'Native Share'});
      } catch (err) {
        if (err.name !== 'AbortError') console.log('Share failed:', err);
      }
    } else {
      const shareEmail = prompt('Enter email to share this product:');
      if(shareEmail){
        await axios.post(`${API_BASE}/share-product`, {productId: product._id, productTitle: product.title, sharedBy: username, sharedTo: shareEmail})
          .then(()=> alert('Product shared successfully!'))
          .catch(()=> alert('Failed to share product'));
      }
    }
  };

  const handleWishlist = async(e, product) => {
    e.stopPropagation();
    if(!userId){
      alert('Please login to add to wishlist');
      navigate('/auth');
      return;
    }
    const isInWishlist = wishlist.some(item => item.productId === product._id);
    try {
      if(isInWishlist){
        const item = wishlist.find(item => item.productId === product._id);
        await axios.delete(`${API_BASE}/remove-from-wishlist/${item._id}`);
      } else {
        await axios.post(`${API_BASE}/add-to-wishlist`, {userId, productId: product._id, title: product.title, description: product.description, mainImg: product.mainImg, price: product.price, discount: product.discount});
      }
      await fetchWishlist();
    } catch (error) {
      if(error.response?.status === 400) alert('Already in wishlist');
    }
  };

  return (
    <div className="products-container">
      <div className="products-filter">
        <h4>Filters</h4>
        <div className="product-filters-body">
          <div className="filter-sort"><h6>Sort By</h6><div className="filter-sort-body sub-filter-body">
            {[
              ['popularity','Popular'],['low-price','Price (low to high)'],['high-price','Price (high to low)'],['discount','Discount']
            ].map(([value,label],index)=><div className="form-check" key={value}><input className="form-check-input" type="radio" name="flexRadioDefault" id={`filter-sort-radio${index+1}`} value={value} checked={sortFilter===value} onChange={handleSortFilterChange} /><label className="form-check-label" htmlFor={`filter-sort-radio${index+1}`}>{label}</label></div>)}
          </div></div>
          {props.category === 'all' ? <div className="filter-categories"><h6>Categories</h6><div className="filter-categories-body sub-filter-body">{categories.map(category=><div className="form-check" key={category}><input className="form-check-input" type="checkbox" value={category} id={`productCategory-${category}`} checked={categoryFilter.includes(category)} onChange={handleCategoryCheckBox} /><label className="form-check-label" htmlFor={`productCategory-${category}`}>{category}</label></div>)}</div></div> : null}
          <div className="filter-gender"><h6>Gender</h6><div className="filter-gender-body sub-filter-body">{['Men','Women','Unisex'].map(gender=><div className="form-check" key={gender}><input className="form-check-input" type="checkbox" value={gender} id={`filter-gender-${gender}`} checked={genderFilter.includes(gender)} onChange={handleGenderCheckBox} /><label className="form-check-label" htmlFor={`filter-gender-${gender}`}>{gender}</label></div>)}</div></div>
        </div>
      </div>
      <div className="products-body"><h3>All Products</h3><div className="products">
        {visibleProducts.map(product=><div className="product-item" key={product._id}><div className="product" onClick={()=>navigate(`/product/${product._id}`)}>
          <img src={product.mainImg} alt={product.title} /><div className="product-data"><h6>{product.title}</h6><p>{(product.description || '').slice(0,30) + '....'}</p><h5>₹ {parseInt(product.price - (product.price * product.discount)/100)} <s>{product.price}</s><p>({product.discount}% off)</p></h5></div>
          <button className="product-share-btn" onClick={(e)=>handleShare(e, product)}><IoShareSocialOutline /></button>
          <button className={`product-wishlist-btn ${wishlist.some(item=>item.productId===product._id) ? 'in-wishlist' : ''}`} onClick={(e)=>handleWishlist(e, product)}>{wishlist.some(item=>item.productId===product._id) ? <IoHeart /> : <IoHeartOutline />}</button>
        </div></div>)}
      </div></div>
    </div>
  )
}

export default Products