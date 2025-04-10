import React, { useEffect, useRef } from "react";
import "./CreateListModal.css"; // reuse same modal styles

const ViewListsModal = ({ onClose, lists, onListSelect }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal" ref={modalRef}>
        <button className="modal-close" onClick={onClose}>✖</button>
        <h2>Your Bain Eats Lists 📋</h2>
        {lists.length === 0 ? (
          <p>No lists yet.</p>
        ) : (
          <ul style={{ paddingLeft: 0 }}>
            {lists.map((list) => (
              <li key={list.id} style={{ marginBottom: "0.5rem", listStyle: "none" }}>
                <button
                  className="small-button"
                  onClick={() => {
                    onListSelect(list.id);
                    onClose();
                  }}
                >
                  {list.eventName} ({list.date})
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};


export default ViewListsModal;
