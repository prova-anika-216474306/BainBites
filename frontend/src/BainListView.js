import React, { useEffect, useState } from "react";

const BainListView = ({ list, onVote, onBack }) => {
  const [votes, setVotes] = useState({});
  const [pins, setPins] = useState([]);

  useEffect(() => {
    fetch(`https://bainbites-backend-e70ac0dfdb19.herokuapp.com/boards/${list.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPins(data.pins);
        setVotes(data.votes);
      });
  }, [list.id]);

  const submitVote = async (businessId, voteType) => {
    await fetch(`https://bainbites-backend-e70ac0dfdb19.herokuapp.com/boards/${list.id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ business_id: businessId, vote: voteType }),
    });

    setVotes((prev) => ({
      ...prev,
      [businessId]: {
        ...prev[businessId],
        [voteType]: (prev[businessId]?.[voteType] || 0) + 1,
      },
    }));

    onVote(list.id, businessId);
  };

  return (
    <div>
      <h2>
        {list.eventName} ({list.date})
      </h2>
      <button className="button" onClick={onBack}>
        ← Back
      </button>

      {pins.length === 0 ? (
        <p>No restaurants pinned yet.</p>
      ) : (
        pins.map((r) => (
          <div key={r.business_id} className="recommendation-card">
            <img src={r.image_url} alt={r.name} />
            <h3>{r.name}</h3>
            <a href={r.url} target="_blank" rel="noreferrer">
              View on Yelp →
            </a>
            <div style={{ marginTop: "0.5rem" }}>
              {["yes", "no", "maybe"].map((vote) => (
                <button
                  key={vote}
                  onClick={() => submitVote(r.business_id, vote)}
                  className="button"
                  style={{ marginRight: "0.5rem", padding: "0.3rem 0.8rem" }}
                >
                  {vote} ({votes[r.business_id]?.[vote] || 0})
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BainListView;
