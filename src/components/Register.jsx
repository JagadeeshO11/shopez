import React, { useContext } from 'react'
import { GeneralContext } from '../context/GeneralContext';

const Register = ({setIsLogin}) => {
  const {setUsername, setEmail, setPassword, setUsertype, register} = useContext(GeneralContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    await register()
  }

  return (
    <form className="authForm" onSubmit={handleRegister}>
      <h2>Register</h2>
      <div className="form-floating mb-3 authFormInputs">
        <input type="text" className="form-control" id="floatingInput" placeholder="username" onChange={(e)=> setUsername(e.target.value)} />
        <label htmlFor="floatingInput">Username</label>
      </div>
      <div className="form-floating mb-3 authFormInputs">
        <input type="email" className="form-control" id="floatingEmail" placeholder="name@example.com" onChange={(e)=> setEmail(e.target.value)} />
        <label htmlFor="floatingEmail">Email address</label>
      </div>
      <div className="form-floating mb-3 authFormInputs">
        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" onChange={(e)=> setPassword(e.target.value)} />
        <label htmlFor="floatingPassword">Password</label>
      </div>
      <select className="form-select form-select-lg mb-3" aria-label="User type" onChange={(e)=> setUsertype(e.target.value)}>
        <option value="">User type</option>
        <option value="admin">Admin</option>
        <option value="customer">Customer</option>
      </select>
      <button type="submit" className="btn btn-primary">Sign up</button>
      <p>Already registered? <span onClick={()=> setIsLogin(true)}>Login</span></p>
    </form>
  )
}
export default Register;