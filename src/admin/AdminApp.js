import { Route, Routes } from 'react-router-dom';
import '../App.css';
import AdminNavbar from '../components/AdminNavbar';

import Admin from '../pages/admin/Admin';
import AllProducts from '../pages/admin/AllProducts';
import AllUsers from '../pages/admin/AllUsers';
import AllOrders from '../pages/admin/AllOrders';
import NewProduct from '../pages/admin/NewProduct';
import UpdateProduct from '../pages/admin/UpdateProduct';

function AdminApp() {
  return (
    <div className="App">
      <AdminNavbar />
      
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/users" element={<AllUsers />} />
        <Route path="/orders" element={<AllOrders />} />
        <Route path="/products/new" element={<NewProduct />} />
        <Route path="/products/update/:id" element={<UpdateProduct />} />
      </Routes>
    </div>
  );
}

export default AdminApp;