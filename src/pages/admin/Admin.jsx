import React, { useEffect, useState } from 'react'
import '../../styles/Admin.css'
import {useNavigate} from 'react-router-dom'
import axios from 'axios';

const Admin = () => {

  const navigate = useNavigate();

  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(()=>{
    const userType = localStorage.getItem('userType');
    if(!userType || userType !== 'admin'){
      navigate('/auth');
    } else {
      fetchCountData();
    }
    // eslint-disable-next-line
  }, [])

  const fetchCountData = async() =>{
    try{
      await axios.get('http://localhost:6001/fetch-users').then(
        (response)=>{
          setUserCount(response.data.length - 1);
        }
      )
      await axios.get('http://localhost:6001/fetch-products').then(
        (response)=>{
          setProductCount(response.data.length);
        }
      )
      await axios.get('http://localhost:6001/fetch-orders').then(
        (response)=>{
          setOrdersCount(response.data.length);
        }
      )
    }catch(err){
      console.log(err);
    }
  }



 

  const [banner, setBanner] = useState('');
  const updateBanner = async() =>{
    await axios.post('http://localhost:6001/update-banner', {banner}).then(
      (response)=>{
        alert("Banner updated");
        setBanner('');
      }
    )
  }




  return (
    <div className="admin-page">

      <div>
        <div className="admin-home-card">
          <h5>Total users</h5>
          <p>{userCount}</p>
          <button onClick={()=> navigate('/users')}>View all</button>
        </div>
      </div>
      
      <div>
        <div className="admin-home-card">
          <h5>All Products</h5>
          <p>{productCount}</p>
          <button onClick={()=> navigate('/products')}>View all</button>
        </div>
      </div>

      <div>
        <div className="admin-home-card">
          <h5>All Orders</h5>
          <p>{ordersCount}</p>
          <button onClick={()=> navigate('/orders')}>View all</button>
        </div>
      </div>

      <div>
        <div className="admin-home-card">
          <h5>Add Product</h5>
          <p>(new)</p>
          <button onClick={()=> navigate('/products/new')}>Add now</button>
        </div>
      </div>

      <div>
        <div className="admin-banner-input admin-home-card">
          <h5>Update banner</h5>
          <div className="form-floating">
            <input type="text" className="form-control" id="floatingURLInput" value={banner} onChange={(e)=>setBanner(e.target.value)} />
            <label htmlFor="floatingURLInput" >Banner url</label>
          </div>
          <button onClick={updateBanner}>Update</button>
        </div>
      </div>
      

    </div>
  )
}

export default Admin