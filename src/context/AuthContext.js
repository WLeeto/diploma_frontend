import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { endpoints } from '../api/endpoints'

import { jwtDecode } from 'jwt-decode'
import { fetchRequest } from '../api/requests'

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({ children }) => {

    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null)
    let [user, setUser] = useState(() => localStorage.getItem('authToken') ? jwtDecode(localStorage.getItem('authToken')) : null)
    let [loading, setLoading] = useState(true)
    
    const navigate = useNavigate()

    let updateTokens = (data) => {
        setAuthTokens(data)
        setUser(jwtDecode(data.access))
        localStorage.setItem('authToken', JSON.stringify(data))
    }

    let loginUser = async (e) => {
        e.preventDefault()

        let response = await fetchRequest(
            endpoints.GETTOKEN,
            'POST',
            JSON.stringify({
                        username: e.target.username.value,
                        password:  e.target.password.value
                    })
        )

        let data = await response.json()

        if (response.status === 200) {
            updateTokens(data)
            navigate('/')
        } else {
            alert('Неправильный логин или пароль.')
        }
    }

    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authToken')
        navigate('/login')
    }

    let updateToken = async() => {
        let response = await fetchRequest(
            endpoints.REFRESHTOKEN,
            'POST',
            JSON.stringify({
                        refresh: authTokens.refresh
                    })
        )
        let data = await response.json()
        
        if (response.status === 200) {
            updateTokens(data)
        } else {
            logoutUser()
        }
    }

    let registerUser = async (formData) => {
        if (formData.password !== formData.confirmPassword) {
          alert('Пароли не совпадают');
          return;
        }
      
        let response = await fetchRequest(
          endpoints.REGISTERUSER,
          'POST',
          JSON.stringify({
            username: formData.username,
            password: formData.password,
            email: formData.email
          })
        );
      
        let data = await response.json();
      
        if (response.status === 201) {
          // Успешная регистрация, теперь логиним пользователя
          let loginResponse = await fetchRequest(
            endpoints.GETTOKEN,
            'POST',
            JSON.stringify({
              username: formData.username,
              password: formData.password
            })
          );
      
          let loginData = await loginResponse.json();
      
          if (loginResponse.status === 200) {
            updateTokens(loginData);
            navigate('/');
          } else {
            alert('Регистрация успешна, но не удалось войти. Пожалуйста, войдите вручную.');
          }
        } else {
          alert(JSON.stringify(data));
        }
      };

    let contextData = {
        user: user,
        loginUser: loginUser,
        logoutUser: logoutUser,
        registerUser: registerUser
    }

    useEffect(() => {
        let fourMinute = 1000 * 60 * 4
        let interval = setInterval(() => {
            if (authTokens) {
                updateToken()
            }
        }, fourMinute)
        return () => clearInterval(interval)

    }, [authTokens, loading])

    return (
        <AuthContext.Provider value={ contextData }>
            {children}
        </AuthContext.Provider>
    )
}
