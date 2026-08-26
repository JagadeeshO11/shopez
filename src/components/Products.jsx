import React, { useEffect, useState, useCallback } from 'react';
import '../styles/Products.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoShareSocialOutline, IoHeartOutline, IoHeart, IoFilterOutline, IoClose } from 'react-icons/io5';
import { API_BASE } from '../config';

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
  const [filterOpen, setFilterOpen] = useState(false);

  const normalizeProduct = useCallback((product) => {
    const originalPrice = Number(product.originalPrice || product.price || 0);
    const price = Number(product.price || 0);
    return {
      ...product,
      title: product.title || product.name,
      mainImg: product.mainImg || product.image,
      discount: product.discount ?? (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0),
      gender: product.gender || 'Unisex'
    };
  }, []);

  const fetchWishlist = useCallback(async () => {
    if (!userId || !localStorage.getItem('token')) return;
    try {
      const { data } = await axios.get(`${API_BASE}/api/v1/wishlist`);
      setWishlist((data.wishlist || []).map(normalizeProduct));
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  }, [normalizeProduct, userId]);

  const fetchData = useCallback(async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        axios.get(`${API_BASE}/api/v1/products`),
        axios.get(`${API_BASE}/api/v1/products/categories`)
      ]);
      const allProducts = (productsResponse.data.products || []).map(normalizeProduct);
      setProducts(allProducts);
      setVisibleProducts(props.category === 'all' ? allProducts : allProducts.filter(product => product.category === props.category));
      setCategories(categoriesResponse.data.categories || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }, [normalizeProduct, props.category]);

  useEffect(() => {
    fetchData();
    fetchWishlist();
  }, [fetchData, fetchWishlist]);

  const handleCategoryCheckBox = (e) => {
    const value = e.target.value;
    setCategoryFilter(current => e.target.checked ? [...current, value] : current.filter(item => item !== value));
  };

  const handleGenderCheckBox = (e) => {
    const value = e.target.value;
    setGenderFilter(current => e.target.checked ? [...current, value] : current.filter(item => item !== value));
  };

  const handleSortFilterChange = (e) => setSortFilter(e.target.value);

  useEffect(() => {
    let filtered = props.category === 'all' ? products : products.filter(product => product.category === props.category);
    if (categoryFilter.length > 0) filtered = filtered.filter(product => categoryFilter.includes(product.category));
    if (genderFilter.length > 0) filtered = filtered.filter(product => genderFilter.includes(product.gender));
    if (sortFilter === 'low-price') filtered = [...filtered].sort((a, b) => a.price - b.price);
    if (sortFilter === 'high-price') filtered = [...filtered].sort((a, b) => b.price - a.price);
    if (sortFilter === 'discount') filtered = [...filtered].sort((a, b) => (b.discount || 0) - (a.discount || 0));
    setVisibleProducts(filtered);
  }, [categoryFilter, genderFilter, products, props.category, sortFilter]);

  const clearFilters = () => {
    setSortFilter('popularity');
    setCategoryFilter([]);
    setGenderFilter([]);
  };

  const activeFilterCount = categoryFilter.length + genderFilter.length + (sortFilter !== 'popularity' ? 1 : 0);

  const handleShare = async (e, product) => {
    e.stopPropagation();
    const shareData = { title: product.title, text: `Check out ${product.title}`, url: `${window.location.origin}/product/${product._id}` };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { if (err.name !== 'AbortError') console.log(err); }
    } else {
      await navigator.clipboard?.writeText(shareData.url);
      alert('Product link copied!');
    }
  };

  const handleWishlist = async (e, product) => {
    e.stopPropagation();
    if (!userId || !localStorage.getItem('token')) {
      alert('Please login to add to wishlist');
      navigate('/auth');
      return;
    }
    const isInWishlist = wishlist.some(item => item._id === product._id);
    try {
      const response = isInWishlist
        ? await axios.delete(`${API_BASE}/api/v1/wishlist/${product._id}`)
        : await axios.post(`${API_BASE}/api/v1/wishlist/${product._id}`);
      setWishlist((response.data.wishlist || []).map(normalizeProduct));
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to update wishlist');
    }
  };

  return (
    <div className="products-container">
      <button className="mobile-filter-trigger" type="button" onClick={() => setFilterOpen(true)}>
        <IoFilterOutline /> <span>Filters</span>{activeFilterCount > 0 && <b>{activeFilterCount}</b>}
      </button>

      <div className={`products-filter ${filterOpen ? 'filter-open' : ''}`}>
        <div className="filter-heading">
          <h4>Filters</h4>
          <button className="filter-close" type="button" onClick={() => setFilterOpen(false)} aria-label="Close filters"><IoClose /></button>
        </div>
        <div className="product-filters-body">
          <div className="filter-sort"><h6>Sort By</h6><div className="filter-sort-body sub-filter-body">
            {[['popularity', 'Popular'], ['low-price', 'Price: Low to High'], ['high-price', 'Price: High to Low'], ['discount', 'Best Discount']].map(([value, label], index) => (
              <div className="form-check" key={value}><input className="form-check-input" type="radio" name="flexRadioDefault" id={`filter-sort-radio${index + 1}`} value={value} checked={sortFilter === value} onChange={handleSortFilterChange} /><label className="form-check-label" htmlFor={`filter-sort-radio${index + 1}`}>{label}</label></div>
            ))}
          </div></div>
          {props.category === 'all' ? <div className="filter-categories"><h6>Categories</h6><div className="filter-categories-body sub-filter-body">{categories.map(category => <div className="form-check" key={category}><input className="form-check-input" type="checkbox" value={category} id={`productCategory-${category}`} checked={categoryFilter.includes(category)} onChange={handleCategoryCheckBox} /><label className="form-check-label" htmlFor={`productCategory-${category}`}>{category}</label></div>)}</div></div> : null}
          <div className="filter-gender"><h6>Gender</h6><div className="filter-gender-body sub-filter-body">{['Men', 'Women', 'Unisex'].map(gender => <div className="form-check" key={gender}><input className="form-check-input" type="checkbox" value={gender} id={`filter-gender-${gender}`} checked={genderFilter.includes(gender)} onChange={handleGenderCheckBox} /><label className="form-check-label" htmlFor={`filter-gender-${gender}`}>{gender}</label></div>)}</div></div>
        </div>
        <div className="filter-actions"><button type="button" className="filter-clear-btn" onClick={clearFilters}>Clear all</button><button type="button" className="filter-apply-btn" onClick={() => setFilterOpen(false)}>Show {visibleProducts.length} products</button></div>
      </div>

      <div className="products-body"><div className="products-title-row"><h3>{props.category === 'all' ? 'All Products' : props.category}</h3><span>{visibleProducts.length} items</span></div><div className="products">
        {visibleProducts.map(product => <div className="product-item" key={product._id}><div className="product" onClick={() => navigate(`/product/${product._id}`)}>
          <img src={product.mainImg} alt={product.title} /><div className="product-data"><h6>{product.title}</h6><p>{(product.description || '').slice(0, 30) + '....'}</p><h5>₹ {product.price} {product.originalPrice > product.price ? <><s>{product.originalPrice}</s> <p>({product.discount}% off)</p></> : null}</h5></div>
          <button className="product-share-btn" onClick={(e) => handleShare(e, product)}><IoShareSocialOutline /></button>
          <button className={`product-wishlist-btn ${wishlist.some(item => item._id === product._id) ? 'in-wishlist' : ''}`} onClick={(e) => handleWishlist(e, product)}>{wishlist.some(item => item._id === product._id) ? <IoHeart /> : <IoHeartOutline />}</button>
        </div></div>)}
      </div></div>
    </div>
  );
};

export default Products;
