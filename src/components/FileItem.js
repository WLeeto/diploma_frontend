import React, { useState } from 'react';
import './FileItem.css';
import { formatISODate } from '../utils/CommonHandles';
import Modal from './Modal';
import { endpoints } from '../api/endpoints';

const FileItem = ({ file, handleDownload, handleDelete, userId = '' }) => {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showFilenameModal, setShowFilenameModal] = useState(false);
  const [comment, setComment] = useState(file.commentary || '');
  const [filename, setFilename] = useState(file.filename || '');
  const authJWT = localStorage.getItem('authToken');

  const handleAddComment = (e) => {
    e.stopPropagation();
    setShowCommentModal(true);
  };

  const handleCloseCommentModal = () => {
    setShowCommentModal(false);
  };

  const handleSaveComment = async () => {
    try {
      if (!authJWT) {
        throw new Error('No auth token found');
      }

      const response = await fetch(`${endpoints.SETCOMMENT}${file.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(authJWT).access}`
        },
        body: JSON.stringify({ commentary: comment })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      file.commentary = comment;
      setShowCommentModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGetShareLink = async (e) => {
    e.stopPropagation();
    try {
      if (!authJWT) {
        throw new Error('No auth token found');
      }
      const response = await fetch(`${endpoints.GETSHARELINK}${file.id}/`, {
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
      
      await navigator.clipboard.writeText(result.share_link);
      
      alert('Ссылка скопирована в буфер обмена');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleOpenFilenameModal = (e) => {
    e.stopPropagation();
    setShowFilenameModal(true);
  };

  const handleCloseFilenameModal = () => {
    setShowFilenameModal(false);
  };

  const handleSaveFilename = async () => {
    try {
      if (!authJWT) {
        throw new Error('No auth token found');
      }

      const response = await fetch(`${endpoints.SETFILENAME}${file.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(authJWT).access}`
        },
        body: JSON.stringify({ filename: filename })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      console.log(await response.json());
      file.filename = filename;
      setShowFilenameModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className='fileContainer' key={file.id} onClick={(e) => e.stopPropagation()}>
      <div className='fileName'>
        <a href="#" onClick={(e) => { e.preventDefault(); handleDownload(file); }}>Имя: {file.filename}</a>
        <span>Дата загрузки: {formatISODate(file.uploaded_date)}</span>
        <span>Расширение: {file.extension}</span>
        {file.commentary && <span>Коментарий: {file.commentary}</span>}
        <span>Размер: {Math.round(file.size / 1024)}kb</span>
        {file.last_download_date && <span>Дата последнего скачивания: {formatISODate(file.last_download_date)}</span>}
      </div>
      <div className='fileActions'>
        <button className='delete-button' onClick={(e) => { e.stopPropagation(); (!userId ? handleDelete(file.id) : handleDelete(userId, file.id)); }}>DELETE</button>
        <button className='coment-button' onClick={handleAddComment}>Add comment</button>
        <button className='change-name-button' onClick={handleOpenFilenameModal}>Change filename</button>
        <button className='share-button' onClick={handleGetShareLink}>Share link</button>
      </div>
      <Modal show={showCommentModal} handleClose={handleCloseCommentModal} handleSave={handleSaveComment}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add your comment here"
        />
      </Modal>
      <Modal show={showFilenameModal} handleClose={handleCloseFilenameModal} handleSave={handleSaveFilename}>
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="Enter new filename"
        />
      </Modal>
    </div>
  );
};

export default FileItem;
