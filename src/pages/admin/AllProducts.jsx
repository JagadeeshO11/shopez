import React, { useEffect, useState } from 'react';
import '../../styles/AllProducts.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../../config';

const AllProducts = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [sortFilter, setSortFilter] = useState('popularity');
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [genderFilter, setGenderFilter] = useState([]);

  const fetchData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        axios.get(`${API_BASE}/api/v1/products`, { params: { active: 'false' } }),
        axios.get(`${API_BASE}/api/v1/products/categories`)
      ]);
      const nextProducts = (productsResponse.data.products || []).map(product => ({
        ...product,
        title: product.title || product.name,
        mainImg: product.mainImg || product.image,
        discount: Number(product.discount || 0),
        gender: product.gender || 'Unisex'
      }));
      setProducts(nextProducts);
      setCategories(categoriesResponse.data.categories || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      alert(error.response?.data?.message || 'Unable to load products');
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    let filtered = [...products];
    if (categoryFilter.length) filtered = filtered.filter(product => categoryFilter.includes(product.category));
    if (genderFilter.length) filtered = filtered.filter(product => genderFilter.includes(product.gender));
    if (sortFilter === 'low-price') filtered.sort((a, b) => a.price - b.price);
    if (sortFilter === 'high-price') filtered.sort((a, b) => b.price - a.price);
    if (sortFilter === 'discount') filtered.sort((a, b) => b.discount - a.discount);
    setVisibleProducts(filtered);
  }, [categoryFilter, genderFilter, products, sortFilter]);

  const toggle = (setter, value) => setter(current => current.includes(value) ? current.filter(item => item !== value) : [...current, value]);

  return (
    <div className="all-products-page">
      <div className="all-products-container">
        <div className="all-products-filter">
          <h4>Filters</h4>
          <div className="all-product-filters-body">
            <div className="all-product-filter-sort"><h6>Sort By</h6><div className="all-product-filter-sort-body all-product-sub-filter-body">
              {[['popularity','Popularity'],['low-price','Price (low to high)'],['high-price','Price (high to low)'],['discount','Discount']].map(([value,label]) => (
                <div className="form-check" key={value}><input className="form-check-input" type="radio" name="sortFilter" id={`filter-sort-${value}`} value={value} checked={sortFilter === value} onChange={e => setSortFilter(e.target.value)} /><label className="form-check-label" htmlFor={`filter-sort-${value}`}>{label}</label></div>
              ))}
            </div></div>
            <div className="all-product-filter-categories"><h6>Categories</h6><div className="all-product-filter-categories-body all-product-sub-filter-body">
              {categories.map(category => <div className="form-check" key={category}><input className="form-check-input" type="checkbox" value={category} id={`productCategory-${category}`} checked={categoryFilter.includes(category)} onChange={() => toggle(setCategoryFilter, category)} /><label className="form-check-label" htmlFor={`productCategory-${category}`}>{category}</label></div>)}
            </div></div>
            <div className="all-product-filter-gender"><h6>Gender</h6><div className="all-product-filter-gender-body all-product-sub-filter-body">
              {['Men','Women','Unisex'].map(gender => <div className="form-check" key={gender}><input className="form-check-input" type="checkbox" value={gender} id={`filter-gender-${gender}`} checked={genderFilter.includes(gender)} onChange={() => toggle(setGenderFilter, gender)} /><label className="form-check-label" htmlFor={`filter-gender-${gender}`}>{gender}</label></div>)}
            </div></div>
          </div>
        </div>

        <div className="all-products-body">
          <h3>All Products <small>({visibleProducts.length})</small></h3>
          <div className="all-products">
            {visibleProducts.map(product => (
              <div className="all-product-item" key={product._id}>
                <div className="all-product">
                  <img src={product.mainImg} alt={product.title} />
                  <div className="all-product-data"><h6>{product.title}</h6><p>{(product.description || '').slice(0, 30)}{product.description?.length > 30 ? '....' : ''}</p><h5>₹ {product.price} {product.originalPrice > product.price ? <><s>{product.originalPrice}</s> <p>({product.discount}% off)</p></> : null}</h5></div>
                  <button onClick={() => navigate(`/products/update/${product._id}`)}>Update</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
