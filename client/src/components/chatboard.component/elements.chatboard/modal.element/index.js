import React from 'react';
import './Modal.scss';

const Modal = (props) => {
  const findByKey = (name) =>
    props.children.find((child) => child.key === name);

  const closeModal = (e) => {
    e.stopPropagation();

    if (e.target.classList.contains('modal-close')) {
      return props.click();
    }
  };

  return (
    <div
      className="modal-mask modal-close"
      onClick={closeModal}
      aria-modal="true"
    >
      <div className="modal-wrapper">
        <div className="modal-container">
          <div className="modal-header" id="modal-header">
            {findByKey('header')}
          </div>

          <div className="modal-body">{findByKey('body')}</div>

          <div className="modal-footer">
            <button className="modal-close" onClick={closeModal}>
              CLOSE
            </button>
            {findByKey('footer')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
