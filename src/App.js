import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Authentication from './pages/Authentication';
import Cart from './pages/customer/Cart';
import Profile from './pages/customer/Profile';
import CategoryProducts from './pages/customer/CategoryProducts';
import IndividualProduct from './pages/customer/IndividualProduct';
import Admin from './pages/admin/Admin';
import AllProducts from './pages/admin/AllProducts';
import AllUsers from './pages/admin/AllUsers';
import AllOrders from './pages/admin/AllOrders';
import NewProduct from './pages/admin/NewProduct';
import UpdateProduct from './pages/admin/UpdateProduct';
import AllShares from './pages/admin/AllShares';
import AllWishlists from './pages/admin/AllWishlists';
import AdminNavbar from './components/AdminNavbar';

function AppContent() {
  const userType = localStorage.getItem('userType');
  const isAdmin = userType === 'admin';
  const isCustomer = userType === 'customer';

  return (
    <div className="App">
      {isAdmin ? <AdminNavbar /> : <Navbar />}
      <Routes>
        <Route path="/auth" element={<Authentication />} />
        {!isAdmin && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={isCustomer ? <Cart /> : <Navigate to="/auth" />} />
            <Route path="/product/:id" element={<IndividualProduct />} />
            <Route path="/category/:category" element={<CategoryProducts />} />
            <Route path="/profile" element={isCustomer ? <Profile /> : <Navigate to="/auth" />} />
          </>
        )}
        {isAdmin && (
          <>
            <Route path="/" element={<Admin />} />
            <Route path="/products" element={<AllProducts />} />
            <Route path="/users" element={<AllUsers />} />
            <Route path="/orders" element={<AllOrders />} />
            <Route path="/shares" element={<AllShares />} />
            <Route path="/wishlists" element={<AllWishlists />} />
            <Route path="/products/new" element={<NewProduct />} />
            <Route path="/products/update/:id" element={<UpdateProduct />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
