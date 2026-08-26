import React, { useContext, useState } from 'react';
import { GeneralContext } from '../context/GeneralContext';

const Register = ({ setIsLogin }) => {
  const { setUsername, setEmail, setPassword, register } = useContext(GeneralContext);
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await register();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="authForm" onSubmit={handleRegister}>
      <h2>Create Account</h2>
      <div className="form-floating mb-3 authFormInputs">
        <input type="text" className="form-control" id="registerName" placeholder="Username" minLength="2" required onChange={(e) => setUsername(e.target.value)} />
        <label htmlFor="registerName">Username</label>
      </div>
      <div className="form-floating mb-3 authFormInputs">
        <input type="email" className="form-control" id="registerEmail" placeholder="name@example.com" required onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="registerEmail">Email address</label>
      </div>
      <div className="form-floating mb-3 authFormInputs">
        <input type="password" className="form-control" id="registerPassword" placeholder="Password" minLength="6" required onChange={(e) => setPassword(e.target.value)} />
        <label htmlFor="registerPassword">Password (6+ characters)</label>
      </div>
      <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
        {submitting ? 'Creating account...' : 'Sign up'}
      </button>
      <p>Already registered? <span role="button" tabIndex="0" onClick={() => setIsLogin(true)} onKeyDown={(e) => e.key === 'Enter' && setIsLogin(true)}>Login</span></p>
    </form>
  );
};

export default Register;
