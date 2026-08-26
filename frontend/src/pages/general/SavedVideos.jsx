import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaHome,
  FaBookmark,
  FaPlus,
  FaUser,
  FaHeart,
  FaComment,
  FaPlay,
} from "react-icons/fa";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import "../../styles/SavedVideos.css";

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
          "https://content-share-livid.vercel.app/api/food/saved",
          {
            withCredentials: true,
          }
        );

        console.log(
          "Saved videos:",
          response.data
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

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="saved-page">

      <div className="saved-phone">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="saved-header">

          <div>
            <span className="saved-eyebrow">
              CONTENT SHARE
            </span>

            <h1>
              Saved Videos
            </h1>

            <p>
              Your favorite food content,
              all in one place.
            </p>
          </div>

          <div className="saved-count">

            <FaBookmark />

            <strong>
              {savedVideos.length}
            </strong>

            <span>
              Saved
            </span>

          </div>

        </header>


        {/* ==================================================
            COLLECTION INFO
        ================================================== */}

        {!loading &&
          savedVideos.length > 0 && (
            <div className="saved-collection">

              <div className="saved-collection-icon">
                <FaBookmark />
              </div>

              <div>
                <h2>
                  Your Collection
                </h2>

                <p>
                  Keep your favorite food
                  videos here for later.
                </p>
              </div>

            </div>
          )}


        {/* ==================================================
            CONTENT
        ================================================== */}

        <main className="saved-content">

          {loading ? (

            <div className="saved-loading">

              <div className="saved-loader">
                <FaBookmark />
              </div>

              <h3>
                Loading your collection...
              </h3>

              <p>
                Getting your saved videos.
              </p>

            </div>

          ) : savedVideos.length > 0 ? (

            <div className="saved-grid">

              {savedVideos.map((item, index) => {

                const food = item.food;

                if (!food) {
                  return null;
                }

                return (
                  <article
                    key={
                      item._id || index
                    }
                    className="saved-card"
                  >

                    {/* VIDEO */}

                    <div className="saved-video-wrapper">

                      <video
                        src={food.video}
                        className="saved-video"
                        muted
                        loop
                        autoPlay
                        playsInline
                        controls
                      />

                      <div className="saved-video-badge">
                        <FaBookmark />
                        Saved
                      </div>

                    </div>


                    {/* VIDEO DETAILS */}

                    <div className="saved-card-content">

                      <h3>
                        {food.name ||
                          "Food Video"}
                      </h3>

                      <p>
                        {food.description ||
                          "No description available."}
                      </p>


                      {/* CREATOR */}

                      {food.foodPartner && (
                        <div className="saved-creator">

                          <div className="saved-creator-avatar">
                            {food.foodPartner.name
                              ?.charAt(0)
                              ?.toUpperCase() || "C"}
                          </div>

                          <div>
                            <span>
                              Created by
                            </span>

                            <strong>
                              {food.foodPartner.name ||
                                "Content Creator"}
                            </strong>
                          </div>

                        </div>
                      )}


                      {/* STATS */}

                      <div className="saved-stats">

                        <span>
                          <FaHeart />
                          {food.likeCount || 0}
                        </span>

                        <span>
                          <FaComment />
                          {food.commentCount || 0}
                        </span>

                        <span>
                          <FaBookmark />
                          {food.saveCount || 0}
                        </span>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>

          ) : (

            /* ==================================================
               EMPTY STATE
            ================================================== */

            <div className="saved-empty">

              <div className="saved-empty-icon">
                <FaBookmark />
              </div>

              <h2>
                Nothing saved yet
              </h2>

              <p>
                When you find a food video
                you love, save it and it will
                appear here.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/home")
                }
              >
                <FaPlay />

                Discover Videos
              </button>

            </div>

          )}

        </main>


        {/* ==================================================
            BOTTOM NAVIGATION
        ================================================== */}

        <nav className="saved-profile-nav">

          {/* HOME */}

          <button
            type="button"
            className={`saved-nav-item ${
              location.pathname === "/home"
                ? "saved-nav-active"
                : ""
            }`}
            onClick={() =>
              navigate("/home")
            }
          >
            <FaHome />

            <span>
              Home
            </span>
          </button>


          {/* UPLOAD */}

          <button
            type="button"
            className={`saved-nav-item ${
              location.pathname === "/create-food"
                ? "saved-nav-active"
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
          </button>


          {/* SAVED */}

          <button
            type="button"
            className={`saved-nav-item ${
              location.pathname === "/saved"
                ? "saved-nav-active"
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
          </button>


          {/* PROFILE */}

          <button
            type="button"
            className={`saved-nav-item ${
              location.pathname === "/profile"
                ? "saved-nav-active"
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
          </button>

        </nav>

      </div>

    </div>
  );
};

export default SavedVideos;