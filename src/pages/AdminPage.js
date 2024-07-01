import React, { useEffect, useState } from 'react';
import { endpoints } from '../api/endpoints';
import './AdminPage.css';
import FileItem from '../components/FileItem';
import { handleDownload } from '../utils/CommonHandles'

const AdminPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const authJWT = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!authJWT) {
          throw new Error('No auth token found');
        }

        const response = await fetch(endpoints.GETADMINDATA, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(authJWT).access}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [authJWT]);

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`${endpoints.DELETEUSER}${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${JSON.parse(authJWT).access}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setData(data.filter(user => user.user_info.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteFile = async (userId, fileId) => {
    try {
      if (!authJWT) {
        throw new Error('No auth token found');
      }
  
      const response = await fetch(`${endpoints.DELETEUSERFILE}${fileId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(authJWT).access}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      setData(data =>
        data.map(user => {
          if (user.user_info.id === userId) {
            const removedFile = user.all_files.find(file => file.id === fileId);
            const newSize = user.total_size - removedFile.size;
            const newFilesCount = user.files_count - 1;
            const updatedUser = {
              ...user,
              total_size: newSize,
              files_count: newFilesCount,
              all_files: user.all_files.filter(file => file.id !== fileId)
            };
            return updatedUser;
          }
          return user;
        })
      );
      
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  const toggleUser = (id) => {
    setExpandedUser(expandedUser === id ? null : id);
  };

  const formatSize = (sizeInKb) => {
    return (sizeInKb / 1024).toFixed(2); // Convert to MB
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (data === null) {
    return <div className="loading-message">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="no-users-message">No users found</div>;
  }

  return (
    <div className="admin-page">
      <span>Зарегистрированные пользователи:</span>
      {data.map((user) => (
        <div className="user-card" key={user.user_info.username} onClick={() => toggleUser(user.user_info.id)}>
          <p className="username">{user.user_info.username}</p>
          <p>{user.user_info.email}</p>
          <p className="role">{user.user_info.is_admin ? 'Администратор' : 'Пользователь'}</p>
          <p>Всего фаилов: {user.files_count}</p>
          {user.total_size && <p>Всего занято: {formatSize(user.total_size)}мб</p>}
          <button 
            className={`delete-button ${user.user_info.is_admin ? 'disabled' : ''}`} 
            onClick={(e) => {
              e.stopPropagation();
              !user.user_info.is_admin && handleDeleteUser(user.user_info.id);
            }}
            title={user.user_info.is_admin ? 'Администратора удалить нельзя' : 'Удалить пользователя'}
          >
            Delete
          </button>
          {expandedUser === user.user_info.id && (
            <div className="file-list">
              {user.all_files.length > 0 ? (
                user.all_files.map((item) => (
                  <FileItem
                    key={item.id}
                    file={item}
                    userId={user.user_info.id}
                    handleDownload={handleDownload}
                    handleDelete={handleDeleteFile}
                  />
                ))
              ) : (
                <div className="file-item">Нет файлов</div>
              )}
            </div>
          )}
        </div>
      ))}
      <hr />
    </div>
  );
};

export default AdminPage;
