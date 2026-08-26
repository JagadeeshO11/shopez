import React, { useEffect, useState } from 'react'
import '../../styles/NewProducts.css'
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';

const UpdateProduct = () => {
  const {id} = useParams();
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productMainImg, setProductMainImg] = useState('');
  const [productCarouselImg1, setProductCarouselImg1] = useState('');
  const [productCarouselImg2, setProductCarouselImg2] = useState('');
  const [productCarouselImg3, setProductCarouselImg3] = useState('');
  const [productSizes, setProductSizes] = useState([]);
  const [productGender, setProductGender] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productNewCategory, setProductNewCategory] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productDiscount, setProductDiscount] = useState(0);
  const [AvailableCategories, setAvailableCategories] = useState([]);
  const navigate = useNavigate();

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-product-details/${id}`);
      setProductName(response.data.title);
      setProductDescription(response.data.description);
      setProductMainImg(response.data.mainImg);
      setProductCarouselImg1(response.data.carousel?.[0] || '');
      setProductCarouselImg2(response.data.carousel?.[1] || '');
      setProductCarouselImg3(response.data.carousel?.[2] || '');
      setProductSizes(response.data.sizes || []);
      setProductGender(response.data.gender || '');
      setProductCategory(response.data.category || '');
      setProductPrice(response.data.price || 0);
      setProductDiscount(response.data.discount || 0);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-categories');
      setAvailableCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [id]);

  const handleCheckBox = (e) => {
    const value = e.target.value;
    if(e.target.checked){
      setProductSizes([...productSizes, value]);
    } else {
      setProductSizes(productSizes.filter(size=> size !== value));
    }
  };

  const handleUpdateProduct = async () => {
    await axios.put(`http://localhost:6001/update-product/${id}`, {productName, productDescription, productMainImg, productCarousel: [productCarouselImg1, productCarouselImg2, productCarouselImg3], productSizes, productGender, productCategory, productNewCategory, productPrice, productDiscount}).then(() => {
      alert('product updated');
      navigate('/products');
    });
  };

  return (
    <div className="new-product-page">
      <div className="new-product-container">
        <h3>Update Product</h3>
        <div className="new-product-body">
          <span><div className="form-floating mb-3 span-21"><input type="text" className="form-control" id="floatingNewProduct1" value={productName} onChange={(e)=>setProductName(e.target.value)} /><label htmlFor="floatingNewProduct1">Product name</label></div><div className="form-floating mb-3 span-22"><input type="text" className="form-control" id="floatingNewProduct2" value={productDescription} onChange={(e)=>setProductDescription(e.target.value)} /><label htmlFor="floatingNewProduct2">Product Description</label></div></span>
          <div className="form-floating mb-3"><input type="text" className="form-control" id="floatingNewProduct3" value={productMainImg} onChange={(e)=>setProductMainImg(e.target.value)}/><label htmlFor="floatingNewProduct3">Thumbnail Img url</label></div>
          <span><div className="form-floating mb-3 span-3"><input type="text" className="form-control" id="floatingNewProduct4" value={productCarouselImg1} onChange={(e)=>setProductCarouselImg1(e.target.value)}/><label htmlFor="floatingNewProduct4">Add on img1 url</label></div><div className="form-floating mb-3 span-3"><input type="text" className="form-control" id="floatingNewProduct5" value={productCarouselImg2} onChange={(e)=>setProductCarouselImg2(e.target.value)}/><label htmlFor="floatingNewProduct5">Add on img2 url</label></div><div className="form-floating mb-3 span-3"><input type="text" className="form-control" id="floatingNewProduct6" value={productCarouselImg3} onChange={(e)=>setProductCarouselImg3(e.target.value)} /><label htmlFor="floatingNewProduct6">Add on img3 url</label></div></span>
          <section><h4>Available Size</h4><span>{['S','M','L','XL'].map(size => <div className="form-check" key={size}><input className="form-check-input" type="checkbox" value={size} checked={productSizes.includes(size)} onChange={handleCheckBox} id={`size-${size}`} /><label className="form-check-label" htmlFor={`size-${size}`}>{size}</label></div>)}</span></section>
          <section><h4>Gender</h4><span>{['Men','Women','Unisex'].map(gender => <div className="form-check" key={gender}><input className="form-check-input" type="radio" name="productGender" value={gender} checked={productGender===gender} id={`gender-${gender}`} onChange={(e)=> setProductGender(e.target.value)} /><label className="form-check-label" htmlFor={`gender-${gender}`}>{gender}</label></div>)}</span></section>
          <span><div className="form-floating mb-3 span-3"><select className="form-select" id="floatingNewProduct7" value={productCategory} onChange={(e)=>setProductCategory(e.target.value)}><option value="">Choose Product category</option>{AvailableCategories.map((category)=><option key={category} value={category}>{category}</option>)}<option value="new category">New category</option></select><label htmlFor="floatingNewProduct7">Category</label></div><div className="form-floating mb-3 span-3"><input type="number" className="form-control" id="floatingNewProduct8" value={productPrice} onChange={(e)=>setProductPrice(e.target.value)}/><label htmlFor="floatingNewProduct8">Price</label></div><div className="form-floating mb-3 span-3"><input type="number" className="form-control" id="floatingNewProduct9" value={productDiscount} onChange={(e)=>setProductDiscount(e.target.value)}/><label htmlFor="floatingNewProduct9">Discount (in %)</label></div></span>
          {productCategory === 'new category' ? <div className="form-floating mb-3"><input type="text" className="form-control" id="floatingNewProduct10" value={productNewCategory} onChange={(e)=>setProductNewCategory(e.target.value)}/><label htmlFor="floatingNewProduct10">New Category</label></div> : null}
        </div>
        <button className="btn btn-primary" onClick={handleUpdateProduct}>Update</button>
      </div>
    </div>
  )
}

export default UpdateProduct