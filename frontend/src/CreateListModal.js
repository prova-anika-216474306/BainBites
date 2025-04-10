import { useState } from "react";
import "./CreateListModal.css";

const CreateListModal = ({ onClose, onCreate }) => {
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [creator, setCreator] = useState("");

  const handleCreate = async () => {
    if (!eventName || !date || !creator) {
      return alert("All fields required!");
    }

    const res = await fetch("https://bainbites-backend-e70ac0dfdb19.herokuapp.com/boards/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_name: eventName, date, created_by: creator }),
    });

    const data = await res.json();

    const newList = {
      id: data.id,
      eventName: data.eventName,
      date: data.date,
      creator: data.createdBy,
      restaurants: [],
    };

    onCreate(newList);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✖</button>
        <h2>Create Bain Eats List</h2>
        <input
          type="text"
          placeholder="Event name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Created by"
          value={creator}
          onChange={(e) => setCreator(e.target.value)}
        />
        <div className="modal-buttons">
          <button className="button secondary" onClick={onClose}>Cancel</button>
          <button className="button" onClick={handleCreate}>Create</button>
        </div>
      </div>
    </div>
  );
};

export default CreateListModal;
