import React from "react";
import "./ListPopup.css";

function ListPopup({ lists, onSelect, onClose }) {
  return (
    <div className="list-popup">
      <div className="list-popup-content">
        <h4>Your Bain Eats Lists</h4>
        <ul>
          {lists.map((list) => (
            <li key={list.id}>
              <button onClick={() => onSelect(list.id)}>
                {list.eventName} ({list.date})
              </button>
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="close-popup">Close</button>
      </div>
    </div>
  );
}

export default ListPopup;
