import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHome, FaBookmark } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const SavedVideos = () => {
  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch saved videos from backend
  useEffect(() => {
    const fetchSavedVideos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://content-share-livid.vercel.app/api/food/saved",
          { withCredentials: true }
        );
        setSavedVideos(response.data.savedFoods || []);
      } catch (error) {
        console.error("Error fetching saved videos:", error);
        setSavedVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedVideos();
  }, []);

  return (
    <div className="app-background">
      <div className="phone-frame">
        {/* Saved Videos Grid */}
        <div className="saved-container">
          {loading ? (
            <p className="no-saved">Loading saved videos...</p>
          ) : savedVideos.length > 0 ? (
            savedVideos.map((item) => (
              <div key={item._id} className="saved-item">
                <video
                  src={item.food.video} // Access populated food.video
                  className="saved-video"
                  muted
                  loop
                  autoPlay
                />
              </div>
            ))
          ) : (
            <p className="no-saved">No saved videos yet</p>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="bottom-nav">
          <div
            className={`nav-icon ${location.pathname === "/" ? "active" : ""}`}
            onClick={() => navigate("/home")}
          >
            <FaHome />
            <span>Home</span>
          </div>

          <div
            className={`nav-icon ${location.pathname === "/saved" ? "active" : ""}`}
            onClick={() => navigate("/saved")}
          >
            <FaBookmark />  
            <span>Saved</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedVideos;
