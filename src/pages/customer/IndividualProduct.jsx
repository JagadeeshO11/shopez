import React, { useEffect, useState, useCallback } from 'react'
import '../../styles/IndividualProduct.css'
import {HiOutlineArrowSmLeft} from 'react-icons/hi'
import {IoShareSocialOutline} from 'react-icons/io5'
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../config';

const IndividualProduct = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCarouselImg1, setProductCarouselImg1] = useState('');
  const [productCarouselImg2, setProductCarouselImg2] = useState('');
  const [productCarouselImg3, setProductCarouselImg3] = useState('');
  const [productSizes, setProductSizes] = useState([]);
  const [productPrice, setProductPrice] = useState(0);
  const [productOriginalPrice, setProductOriginalPrice] = useState(0);
  const [productDiscount, setProductDiscount] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [productQuantity, setProductQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const normalizeProduct = useCallback((product) => ({
    ...product,
    title: product.title || product.name,
    mainImg: product.mainImg || product.image,
    originalPrice: product.originalPrice || product.price,
    discount: product.discount ?? 0,
    sizes: product.sizes || []
  }), []);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/v1/products/${id}`);
      const product = normalizeProduct(response.data.product || {});
      setProductName(product.title || '');
      setProductDescription(product.description || '');
      setProductCarouselImg1(product.images?.[0] || product.mainImg || '');
      setProductCarouselImg2(product.images?.[1] || product.mainImg || '');
      setProductCarouselImg3(product.images?.[2] || product.mainImg || '');
      setProductSizes(product.sizes || []);
      setProductPrice(Number(product.price || 0));
      setProductOriginalPrice(Number(product.originalPrice || product.price || 0));
      setProductDiscount(Number(product.discount || 0));

      const relatedResponse = await axios.get(`${API_BASE}/api/v1/products?category=${encodeURIComponent(product.category || '')}`);
      setRelatedProducts((relatedResponse.data.products || []).map(normalizeProduct).filter(item => item._id !== id).slice(0, 4));
    } catch (error) {
      console.error('Failed to fetch product:', error);
    }
  }, [id, normalizeProduct]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const buyNow = async () => {
    if(!userId || !localStorage.getItem('token')){
      alert('Please login to place an order');
      navigate('/auth');
      return;
    }
    try {
      await axios.post(`${API_BASE}/api/v1/orders`, {
        items: [{ product: id, quantity: Number(productQuantity), size }],
        shippingAddress: { name, email, mobile, address, pincode },
        paymentMethod,
        shippingFee: 0
      });
      alert('Order placed!!');
      navigate('/profile');
    } catch (error) {
      alert(error.response?.data?.message || 'Order failed!!');
    }
  };

  const handleAddToCart = async () => {
    if(!userId || !localStorage.getItem('token')){
      alert('Please login to add items to cart');
      navigate('/auth');
      return;
    }
    try {
      await axios.post(`${API_BASE}/api/v1/cart/items`, { productId: id, size, quantity: Number(productQuantity) });
      alert('Product added to cart!!');
      navigate('/cart');
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed!!');
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/product/${id}`;
    const shareData = {title: productName, text: `Check out ${productName}`, url: shareUrl};
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { if (err.name !== 'AbortError') console.log(err); }
    } else {
      await navigator.clipboard?.writeText(shareUrl);
      alert('Product link copied!');
    }
  };

  return (
    <div className="IndividualProduct-page">
      <span onClick={()=> navigate(-1)}> <HiOutlineArrowSmLeft /> <p>back</p></span>
      <div className="IndividualProduct-body">
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active"><img src={productCarouselImg1} className="d-block w-100" alt={productName} /></div>
            <div className="carousel-item"><img src={productCarouselImg2} className="d-block w-100" alt={productName} /></div>
            <div className="carousel-item"><img src={productCarouselImg3} className="d-block w-100" alt={productName} /></div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev"><span className="carousel-control-prev-icon" aria-hidden="true"></span><span className="visually-hidden">Previous</span></button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next"><span className="carousel-control-next-icon" aria-hidden="true"></span><span className="visually-hidden">Next</span></button>
        </div>

        <div className="IndividualProduct-data">
          <h3>{productName}</h3>
          <p>{productDescription}</p>
          <span><label htmlFor="productSize">Choose size</label><select name="productSize" id="productSize" value={size} onChange={(e)=>setSize(e.target.value)}><option value="">Select</option>{productSizes.map((itemSize)=><option key={itemSize} value={itemSize}>{itemSize}</option>)}</select></span>
          <span><label htmlFor="productQuantity">Quantity</label><select name="productQuantity" id="productQuantity" value={productQuantity} onChange={(e)=>setProductQuantity(e.target.value)}>{[1,2,3,4,5,6].map(q=><option key={q} value={q}>{q}</option>)}</select></span>
          <span><h5><b>Price: </b> ₹ {productPrice}</h5> {productOriginalPrice > productPrice ? <><s>{productOriginalPrice}</s> <p>({productDiscount}% off)</p></> : null}</span>
          <h6><b>Rating:</b> 3.4/5 </h6>
          <p className="delivery-date">Free delivery in 5 days</p>
          <div className="productBuyingButtons">
            <button data-bs-toggle={userId ? 'modal' : ''} data-bs-target={userId ? '#staticBackdrop' : ''} onClick={!userId ? ()=>{alert('Please login to place an order'); navigate('/auth')} : undefined}>Buy now</button>
            <button onClick={handleAddToCart}>Add to cart</button>
            <button onClick={handleShare} className="share-btn"><IoShareSocialOutline /></button>
          </div>
        </div>
      </div>

      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable"><div className="modal-content">
          <div className="modal-header"><h5 className="modal-title" id="staticBackdropLabel">Checkout</h5><button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
          <div className="modal-body">
            <div className="checkout-address">
              <h4>Details</h4>
              <div className="form-floating mb-3"><input type="text" className="form-control" id="floatingInput1" value={name} onChange={(e)=>setName(e.target.value)} /><label htmlFor="floatingInput1">Name</label></div>
              <section><div className="form-floating mb-3"><input type="text" className="form-control" id="floatingInput3" value={mobile} onChange={(e)=>setMobile(e.target.value)} /><label htmlFor="floatingInput3">Mobile</label></div><div className="form-floating mb-3 span-child-1"><input type="text" className="form-control" id="floatingInput2" value={email} onChange={(e)=>setEmail(e.target.value)} /><label htmlFor="floatingInput2">Email</label></div></section>
              <section><div className="form-floating mb-3 span-child-1"><input type="text" className="form-control" id="floatingInput6" value={address} onChange={(e)=>setAddress(e.target.value)} /><label htmlFor="floatingInput6">Address</label></div><div className="form-floating mb-3 span-child-2"><input type="text" className="form-control" id="floatingInput7" value={pincode} onChange={(e)=>setPincode(e.target.value)} /><label htmlFor="floatingInput7">Pincode</label></div></section>
            </div>
            <div className="checkout-payment-method"><h4>Payment method</h4><div className="form-floating mb-3"><select className="form-select form-select-md mb-3" id="floatingInput8" value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)}><option value="">Choose</option><option value="netbanking">netbanking</option><option value="card">card payments</option><option value="upi">upi</option><option value="cod">cash on delivery</option></select><label htmlFor="floatingInput8">Choose Payment method</label></div></div>
          </div>
          <div className="modal-footer"><button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={buyNow}>Buy now</button></div>
        </div></div>
      </div>

      {relatedProducts.length > 0 && <div className="related-products"><h3>Related Products</h3><div className="related-products-grid">{relatedProducts.map(product=><div className="related-product-card" key={product._id} onClick={()=>navigate(`/product/${product._id}`)}><img src={product.mainImg} alt={product.title} /><h6>{product.title}</h6><p>₹{product.price} {product.originalPrice > product.price ? <s>₹{product.originalPrice}</s> : null}</p></div>)}</div></div>}
    </div>
  )
}

export default IndividualProduct
