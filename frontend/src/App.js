import { useEffect, useState } from "react";
import "./App.css";
import CreateListModal from "./CreateListModal";
import ViewListsModal from "./ViewListsModal";
import BainListView from "./BainListView";
import ENDPOINTS from "./config";

function App() {
  const [form, setForm] = useState({
    meetingType: "team_lunch",
    cuisine: "",
    location: "2 Bloor St E, Toronto, ON",
    sortBy: "best_match",
    distance: "1000",
    price: "1",
  });

  const [recommendations, setRecommendations] = useState([]);
  const [sortedList, setSortedList] = useState([]);
  const [bainEatsLists, setBainEatsLists] = useState([]);
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [showViewListModal, setShowViewListModal] = useState(false);
  const [activeListView, setActiveListView] = useState(null);
  //summary
  const [summaryModal, setSummaryModal] = useState(null);

  useEffect(() => {
    fetch(ENDPOINTS.GET_BOARDS)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(b => ({
          id: b.id,
          eventName: b.eventName,
          date: b.date,
          creator: b.createdBy,
          restaurants: [],
        }));
        setBainEatsLists(formatted);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${ENDPOINTS.GET_RECOMMENDATIONS}?meeting_type=${form.meetingType}&cuisine=${form.cuisine}&location=${form.location}&sort_by=${form.sortBy}&radius=${form.distance}&price=${form.price}`
      );
      const data = await res.json();
      setRecommendations(data.businesses || []);
      setSortedList(data.businesses || []);
    } catch (err) {
      console.error(err);
    }
  };

  const applySort = () => {
    const sorted = [...recommendations];
    if (form.sortBy === "rating") sorted.sort((a, b) => b.rating - a.rating);
    else if (form.sortBy === "review_count") sorted.sort((a, b) => b.review_count - a.review_count);
    else if (form.sortBy === "distance") sorted.sort((a, b) => a.distance - b.distance);
    setSortedList(sorted);
  };

  const createList = (newList) => {
    setBainEatsLists((prev) => [...prev, newList]);
    setShowCreateListModal(false);
  };

  const handleAddToList = async (restaurant, listId) => {
    const list = bainEatsLists.find((l) => l.id === listId);
    if (!list) return;

    await fetch(ENDPOINTS.PIN_TO_BOARD(listId), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        business_id: restaurant.id,
        name: restaurant.name,
        url: restaurant.url,
        image_url: restaurant.image_url,
      }),
    });

    setBainEatsLists((prev) =>
      prev.map((l) =>
        l.id === listId
          ? {
            ...l,
            restaurants: l.restaurants.some((r) => r.id === restaurant.id)
              ? l.restaurants
              : [...l.restaurants, { ...restaurant, votes: 0 }],
          }
          : l
      )
    );
  };

  const handleVote = async (listId, restaurantId) => {
    await fetch(ENDPOINTS.VOTE_ON_RESTAURANT(listId), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ business_id: restaurantId, vote: "yes" }),
    });

    setBainEatsLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
            ...list,
            restaurants: list.restaurants.map((r) =>
              r.id === restaurantId ? { ...r, votes: (r.votes || 0) + 1 } : r
            ),
          }
          : list
      )
    );
  };

  //for summary
  const handleEatsBuddy = async (restaurant) => {
    const payload = {
      name: restaurant.name,
      categories: restaurant.categories?.map((c) => c.title) || [],
      price: restaurant.price || "",
      rating: restaurant.rating,
      review_count: restaurant.review_count,
      location: `${restaurant.location?.address1}, ${restaurant.location?.city}, ${restaurant.location?.zip_code}`,
      menu_url: restaurant.attributes?.menu_url || restaurant.url,  // fallback to url
    };
  
    try {
      const res = await fetch(ENDPOINTS.SUMMARIZE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
      console.log("$$$$$$$", payload)
      setSummaryModal(data.summary || "No summary available.");
    } catch (err) {
      setSummaryModal("Failed to fetch summary.");
    }
  };


  return (
    <div className="App">
      <header className="header">
        <h1>Bain Bites 🍽️</h1>
        <p>Smarter restaurant picks around Bain Toronto</p>
      </header>

      <main className="main-container">
        {!activeListView && (
          <>
            <form className="form-container" onSubmit={handleSubmit}>
              <div className="form-row">
                <select name="meetingType" value={form.meetingType} onChange={handleChange}>
                  <option value="team_lunch">Team Lunch</option>
                  <option value="client_dinner">Client Dinner</option>
                  <option value="celebration">Celebration</option>
                  <option value="quick_coffee">Quick Coffee</option>
                  <option value="formal_business">Formal Business</option>
                </select>
                <input type="text" name="cuisine" placeholder="What food?" value={form.cuisine} onChange={handleChange} />
                <input type="text" name="location" value={form.location} onChange={handleChange} />
              </div>

              <div className="form-row">
                <select name="distance" value={form.distance} onChange={handleChange}>
                  <option value="1000">Less than 1 km</option>
                  <option value="5000">5 km</option>
                  <option value="10000">Within 10 km</option>
                </select>

                <select name="price" value={form.price} onChange={handleChange}>
                  <option value="1">$</option>
                  <option value="2">$$</option>
                  <option value="3">$$$</option>
                  <option value="4">$$$$</option>
                </select>

                <button type="submit" className="button getrec-button">🔍 Get Recommendations</button>
              </div>
            </form>

            <div className="recommendations">
              <div className="recommendations-header">
                <h2>Recommendations:</h2>
                <div className="sort-apply-wrap">
                  <select name="sortBy" value={form.sortBy} onChange={handleChange}>
                    <option value="best_match">Sort by: Best Match</option>
                    <option value="rating">Sort by: Rating</option>
                    <option value="review_count">Sort by: Most Reviewed</option>
                    <option value="distance">Sort by: Closest</option>
                  </select>
                  <button type="button" className="button" onClick={applySort}>Apply</button>
                </div>
              </div>

              {sortedList.length === 0 ? (
                <p>No results yet. Submit the form above.</p>
              ) : (
                sortedList.map((r) => (
                  <div className="recommendation-card" key={r.id}>
                    <img src={r.image_url} alt={r.name} />
                    <h3>{r.name}</h3>
                    <p>{r.location?.address1}</p>
                    <a href={r.url} target="_blank" rel="noreferrer">View on Yelp →</a>

                    {bainEatsLists.length > 0 && (
                      <div style={{ marginTop: "0.75rem" }}>
                        <label htmlFor={`select-list-${r.id}`} style={{ fontSize: "0.9rem", marginRight: "0.5rem" }}>
                          ⭐ Add to List:
                        </label>
                        <select
                          id={`select-list-${r.id}`}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              handleAddToList(r, e.target.value);
                              e.target.value = "";
                            }
                          }}
                          defaultValue=""
                          style={{ padding: "0.4rem 0.6rem", borderRadius: "4px", border: "1px solid #A6192E" }}
                        >
                          <option value="" disabled>Choose list</option>
                          {bainEatsLists.map((list) => (
                            <option key={list.id} value={list.id}>{list.eventName} ({list.date})</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <button
                      className="button small-button"
                      onClick={() => {
                        console.log("Reviews for summary:", r);
                        handleEatsBuddy(r);
                      }}
                      style={{ marginTop: "0.5rem" }}
                    >
                      🍽️ Eats AI Summary
                    </button>

                  </div>
                ))
              )}

              {summaryModal && (
                <div
                  className="modal-overlay"
                  onClick={() => setSummaryModal(null)} 
                >
                  <div
                    className="modal"
                    onClick={(e) => e.stopPropagation()} 
                  >
                    <button className="modal-close" onClick={() => setSummaryModal(null)}>✖</button>
                    <h3>🍽️ Eats AI Summary</h3>
                    <p>{summaryModal}</p>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

        {activeListView && (
          <BainListView
            list={bainEatsLists.find((l) => l.id === activeListView)}
            onVote={handleVote}
            onBack={() => setActiveListView(null)}
          />
        )}

        <div className="fab-wrapper">
          <button className="view-lists-button" onClick={() => setShowViewListModal(true)}>
            📋 View Lists
          </button>
          <button className="fab-button" onClick={() => setShowCreateListModal(true)}>
            🍴 Create List
          </button>
        </div>

        {showCreateListModal && (
          <CreateListModal
            onClose={() => setShowCreateListModal(false)}
            onCreate={createList}
          />
        )}

        {showViewListModal && (
          <ViewListsModal
            lists={bainEatsLists}
            onClose={() => setShowViewListModal(false)}
            onListSelect={(id) => {
              setActiveListView(id);
              setShowViewListModal(false);
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
