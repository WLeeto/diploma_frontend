import React, { useEffect, useState } from 'react';
import { endpoints } from '../api/endpoints';
import FileItem from '../components/FileItem';

import { handleDownload } from '../utils/CommonHandles'

import './HomePage.css'

const HomePage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const authJWT = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!authJWT) {
          throw new Error('No auth token found');
        }

        const response = await fetch(endpoints.GETUSERFILES, {
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

  const handleDelete = async (id) => {
    try {
      if (!authJWT) {
        throw new Error('No auth token found');
      }

      const response = await fetch(`${endpoints.DELETEUSERFILE}${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(authJWT).access}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setData(data.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  const handleUploadFile = () => {
    document.getElementById('fileInput').click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(endpoints.UPLOADFILE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${JSON.parse(authJWT).access}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newFile = await response.json();
      setData([...data, newFile]);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p className='addFileButton' onClick={handleUploadFile}>ADD NEW FILE</p>
      <input
        id="fileInput"
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {data.map((item) => (
        <FileItem
          key={item.id}
          file={item}
          handleDownload={handleDownload}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default HomePage;
