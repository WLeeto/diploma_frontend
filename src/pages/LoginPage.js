import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import './LoginPage.css'; // импорт стилей

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-page">
      <form onSubmit={loginUser} className="login-form">
        <input
          type='text'
          name='username'
          value={formData.username}
          onChange={handleChange}
          placeholder='Enter Username'
          className="login-input"
          required
        />
        <input
          type='password'
          name='password'
          value={formData.password}
          onChange={handleChange}
          placeholder='Enter Password'
          className="login-input"
          required
        />
        <button type='submit' className="login-button">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
