import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaHome,
  FaBookmark,
  FaPlus,
  FaUser,
} from "react-icons/fa";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

const SavedVideos = () => {
  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // ======================================================
  // FETCH SAVED VIDEOS
  // ======================================================

  useEffect(() => {
    const fetchSavedVideos = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          "http://localhost:3000/api/food/saved",
          {
            withCredentials: true,
          }
        );

        setSavedVideos(
          response.data.savedFoods || []
        );
      } catch (error) {
        console.error(
          "Error fetching saved videos:",
          error
        );

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

        {/* ==================================================
            SAVED VIDEOS
        ================================================== */}

        <div className="saved-container">

          {loading ? (
            <p className="no-saved">
              Loading saved videos...
            </p>
          ) : savedVideos.length > 0 ? (

            savedVideos.map((item) => (

              <div
                key={item._id}
                className="saved-item"
              >
                <video
                  src={item.food?.video}
                  className="saved-video"
                  muted
                  loop
                  autoPlay
                  playsInline
                />
              </div>

            ))

          ) : (

            <p className="no-saved">
              No saved videos yet
            </p>

          )}

        </div>


        {/* ==================================================
            BOTTOM NAVIGATION
        ================================================== */}

        <div className="bottom-nav">

          {/* HOME */}

          <div
            className={`nav-icon ${
              location.pathname === "/home"
                ? "active"
                : ""
            }`}
            onClick={() => navigate("/home")}
          >
            <FaHome />

            <span>
              Home
            </span>
          </div>


          {/* UPLOAD */}

          <div
            className={`nav-icon ${
              location.pathname === "/create-food"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigate("/create-food")
            }
          >
            <FaPlus />

            <span>
              Upload
            </span>
          </div>


          {/* SAVED */}

          <div
            className={`nav-icon ${
              location.pathname === "/saved"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigate("/saved")
            }
          >
            <FaBookmark />

            <span>
              Saved
            </span>
          </div>


          {/* PROFILE */}

          <div
            className={`nav-icon ${
              location.pathname === "/profile"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigate("/profile")
            }
          >
            <FaUser />

            <span>
              Profile
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SavedVideos;