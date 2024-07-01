import React from 'react';
import './Modal.css';

const Modal = ({ show, handleClose, handleSave, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-content">
          {children}
        </div>
        <div className="modal-actions">
          <button onClick={handleClose}>Cancel</button>
          <button onClick={handleSave}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
