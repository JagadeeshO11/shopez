import React, { useEffect, useState, useCallback } from 'react';
import '../../styles/NewProducts.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE } from '../../config';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: '', description: '', image: '', images: [], sizes: [], gender: 'Unisex', category: '', price: 0, discount: 0, stock: 0 });
  const [categories, setCategories] = useState([]);

  const fetchProduct = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/v1/products/${id}`);
      setProduct(current => ({ ...current, ...(data.product || {}), images: data.product?.images || [], sizes: data.product?.sizes || [] }));
    } catch (error) { alert(error.response?.data?.message || 'Unable to load product'); }
  }, [id]);

  useEffect(() => {
    fetchProduct();
    axios.get(`${API_BASE}/api/v1/products/categories`).then(response => setCategories(response.data.categories || []));
  }, [fetchProduct]);

  const update = (key, value) => setProduct(current => ({ ...current, [key]: value }));
  const toggleSize = size => setProduct(current => ({ ...current, sizes: current.sizes.includes(size) ? current.sizes.filter(item => item !== size) : [...current.sizes, size] }));
  const setImage = (index, value) => setProduct(current => ({ ...current, images: current.images.map((item, i) => i === index ? value : item) }));

  const handleUpdateProduct = async () => {
    try {
      await axios.put(`${API_BASE}/api/v1/products/${id}`, {
        name: product.name, description: product.description, image: product.image,
        images: product.images.filter(Boolean), sizes: product.sizes, gender: product.gender,
        category: product.category, price: Number(product.price), discount: Number(product.discount || 0), stock: Number(product.stock || 0)
      });
      alert('Product updated');
      navigate('/products');
    } catch (error) { alert(error.response?.data?.message || 'Product update failed'); }
  };

  return <div className="new-product-page"><div className="new-product-container">
    <h3>Update Product</h3>
    <div className="new-product-body">
      <span><div className="form-floating mb-3 span-21"><input className="form-control" value={product.name} onChange={e => update('name', e.target.value)} /><label>Product name</label></div><div className="form-floating mb-3 span-22"><input className="form-control" value={product.description || ''} onChange={e => update('description', e.target.value)} /><label>Product description</label></div></span>
      <div className="form-floating mb-3"><input type="url" className="form-control" value={product.image || ''} onChange={e => update('image', e.target.value)} /><label>Thumbnail image URL</label></div>
      <span>{[0,1,2].map(index => <div className="form-floating mb-3 span-3" key={index}><input type="url" className="form-control" value={product.images[index] || ''} onChange={e => setImage(index, e.target.value)} /><label>Additional image {index + 1} URL</label></div>)}</span>
      <section><h4>Available Size</h4><span>{['S','M','L','XL'].map(size => <div className="form-check" key={size}><input className="form-check-input" type="checkbox" checked={product.sizes.includes(size)} onChange={() => toggleSize(size)} id={`update-size-${size}`} /><label className="form-check-label" htmlFor={`update-size-${size}`}>{size}</label></div>)}</span></section>
      <section><h4>Gender</h4><span>{['Men','Women','Unisex'].map(gender => <div className="form-check" key={gender}><input className="form-check-input" type="radio" name="updateGender" checked={product.gender === gender} onChange={() => update('gender', gender)} id={`update-gender-${gender}`} /><label className="form-check-label" htmlFor={`update-gender-${gender}`}>{gender}</label></div>)}</span></section>
      <span><div className="form-floating mb-3 span-3"><select className="form-select" value={product.category} onChange={e => update('category', e.target.value)}><option value="">Choose category</option>{categories.map(category => <option key={category} value={category}>{category}</option>)}</select><label>Category</label></div><div className="form-floating mb-3 span-3"><input type="number" min="0" className="form-control" value={product.price} onChange={e => update('price', e.target.value)} /><label>Sale price</label></div><div className="form-floating mb-3 span-3"><input type="number" min="0" max="100" className="form-control" value={product.discount || 0} onChange={e => update('discount', e.target.value)} /><label>Discount (%)</label></div><div className="form-floating mb-3 span-3"><input type="number" min="0" className="form-control" value={product.stock || 0} onChange={e => update('stock', e.target.value)} /><label>Stock</label></div></span>
    </div>
    <button className="btn btn-primary" onClick={handleUpdateProduct}>Update</button>
  </div></div>;
};

export default UpdateProduct;
