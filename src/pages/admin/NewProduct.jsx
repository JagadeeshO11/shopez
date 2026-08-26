import React, { useEffect, useState } from 'react';
import '../../styles/NewProducts.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../../config';

const NewProduct = () => {
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productMainImg, setProductMainImg] = useState('');
  const [productCarousel, setProductCarousel] = useState(['', '', '']);
  const [productSizes, setProductSizes] = useState([]);
  const [productGender, setProductGender] = useState('Unisex');
  const [productCategory, setProductCategory] = useState('');
  const [productNewCategory, setProductNewCategory] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDiscount, setProductDiscount] = useState('0');
  const [productStock, setProductStock] = useState('0');
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/api/v1/products/categories`)
      .then(response => setAvailableCategories(response.data.categories || []))
      .catch(error => console.error('Failed to fetch categories:', error));
  }, []);

  const toggleSize = (size) => setProductSizes(current => current.includes(size) ? current.filter(item => item !== size) : [...current, size]);
  const setCarousel = (index, value) => setProductCarousel(current => current.map((item, i) => i === index ? value : item));

  const handleNewProduct = async () => {
    const category = productCategory === 'new category' ? productNewCategory.trim() : productCategory;
    const price = Number(productPrice);
    const discount = Number(productDiscount || 0);
    const stock = Number(productStock || 0);
    if (!productName.trim() || !category || !Number.isFinite(price) || price < 0) return alert('Enter product name, category and a valid price.');
    if (!Number.isInteger(stock) || stock < 0) return alert('Stock must be a valid number.');
    try {
      await axios.post(`${API_BASE}/api/v1/products`, {
        name: productName.trim(), description: productDescription, image: productMainImg,
        images: productCarousel.filter(Boolean), sizes: productSizes, gender: productGender,
        category, price, discount, stock
      });
      alert('Product added');
      navigate('/products');
    } catch (error) {
      alert(error.response?.data?.message || 'Product creation failed');
    }
  };

  return (
    <div className="new-product-page"><div className="new-product-container">
      <h3>New Product</h3>
      <div className="new-product-body">
        <span><div className="form-floating mb-3 span-21"><input type="text" className="form-control" value={productName} onChange={e => setProductName(e.target.value)} /><label>Product name</label></div><div className="form-floating mb-3 span-22"><input type="text" className="form-control" value={productDescription} onChange={e => setProductDescription(e.target.value)} /><label>Product description</label></div></span>
        <div className="form-floating mb-3"><input type="url" className="form-control" value={productMainImg} onChange={e => setProductMainImg(e.target.value)} /><label>Thumbnail image URL</label></div>
        <span>{productCarousel.map((value, index) => <div className="form-floating mb-3 span-3" key={index}><input type="url" className="form-control" value={value} onChange={e => setCarousel(index, e.target.value)} /><label>Additional image {index + 1} URL</label></div>)}</span>
        <section><h4>Available Size</h4><span>{['S','M','L','XL'].map(size => <div className="form-check" key={size}><input className="form-check-input" type="checkbox" value={size} checked={productSizes.includes(size)} onChange={() => toggleSize(size)} id={`size-${size}`} /><label className="form-check-label" htmlFor={`size-${size}`}>{size}</label></div>)}</span></section>
        <section><h4>Gender</h4><span>{['Men','Women','Unisex'].map(gender => <div className="form-check" key={gender}><input className="form-check-input" type="radio" name="productGender" value={gender} checked={productGender === gender} onChange={e => setProductGender(e.target.value)} id={`gender-${gender}`} /><label className="form-check-label" htmlFor={`gender-${gender}`}>{gender}</label></div>)}</span></section>
        <span><div className="form-floating mb-3 span-3"><select className="form-select" value={productCategory} onChange={e => setProductCategory(e.target.value)}><option value="">Choose product category</option>{availableCategories.map(category => <option key={category} value={category}>{category}</option>)}<option value="new category">New category</option></select><label>Category</label></div><div className="form-floating mb-3 span-3"><input type="number" min="0" className="form-control" value={productPrice} onChange={e => setProductPrice(e.target.value)} /><label>Sale price</label></div><div className="form-floating mb-3 span-3"><input type="number" min="0" max="100" className="form-control" value={productDiscount} onChange={e => setProductDiscount(e.target.value)} /><label>Discount (%)</label></div><div className="form-floating mb-3 span-3"><input type="number" min="0" className="form-control" value={productStock} onChange={e => setProductStock(e.target.value)} /><label>Stock</label></div></span>
        {productCategory === 'new category' && <div className="form-floating mb-3"><input type="text" className="form-control" value={productNewCategory} onChange={e => setProductNewCategory(e.target.value)} /><label>New category</label></div>}
      </div>
      <button className="btn btn-primary" onClick={handleNewProduct}>Add product</button>
    </div></div>
  );
};

export default NewProduct;
