import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import './RegisterPage.css';

const RegisterPage = () => {
  const { registerUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Проверки введенных значений.
    if (name === 'username') {
      if (value === '') {
        setErrors(prevErrors => ({
          ...prevErrors,
          username: 'Имя пользователя не может быть пустым'
        }));
      } else {
        const usernameRegex = /^[a-zA-Z]+$/;
        if (!usernameRegex.test(value)) {
          setErrors(prevErrors => ({
            ...prevErrors,
            username: 'Имя пользователя должно состоять из латинских символов'
          }));
        } else {
          setErrors(prevErrors => ({
            ...prevErrors,
            username: ''
          }));
        }
      }
    }

    if (name === 'email') {
      if (value === '') {
        setErrors(prevErrors => ({
          ...prevErrors,
          email: 'Email не может быть пустым'
        }));
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          setErrors(prevErrors => ({
            ...prevErrors,
            email: 'Неверный формат email'
          }));
        } else {
          setErrors(prevErrors => ({
            ...prevErrors,
            email: ''
          }));
        }
      }
    }

    if (name === 'password') {
      if (value === '') {
        setErrors(prevErrors => ({
          ...prevErrors,
          password: 'Пароль не может быть пустым'
        }));
      } else {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(value)) {
          setErrors(prevErrors => ({
            ...prevErrors,
            password: 'Пароль должен содержать не менее 6 символов, включая хотя бы одну заглавную букву, одну цифру и один специальный символ'
          }));
        } else {
          setErrors(prevErrors => ({
            ...prevErrors,
            password: ''
          }));
        }
      }
    }

    if (name === 'confirmPassword' || name === 'password') {
      const password = name === 'password' ? value : formData.password;
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      if (confirmPassword && password !== confirmPassword) {
        setErrors(prevErrors => ({
          ...prevErrors,
          confirmPassword: 'Пароль и подтверждение пароля не совпадают'
        }));
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          confirmPassword: ''
        }));
      }
    }

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) {
      // Не отправляем форму, если есть ошибки
      alert('Пожалуйста, исправьте ошибки в форме перед отправкой.');
      return;
    } else {
      registerUser(formData);
    }
  }

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type='text'
          name='username'
          value={formData.username}
          onChange={handleChange}
          placeholder='Enter Username'
          className="register-input"
          required
        />
        {errors.username && <p className="error-message">{errors.username}</p>}
        <input
          type='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          placeholder='Enter Email'
          className="register-input"
          required
        />
        {errors.email && <p className="error-message">{errors.email}</p>}
        <div className="register-password-container">
          <input
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='Enter Password'
            className="register-input"
            required
          />
          
          <input
            type='password'
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder='Confirm Password'
            className="register-input"
            required
          />
          
        </div>
        {errors.password && <p className="error-message">{errors.password}</p>}
        {errors.password && errors.confirmPassword && <br/>}
        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
        <button type='submit' className="register-button">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
