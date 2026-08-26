import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import {
  FaHome,
  FaPlus,
  FaBookmark,
  FaUser,
  FaHeart,
  FaComment,
  FaVideo,
  FaMapMarkerAlt,
} from "react-icons/fa";

import "../../styles/Profile.css";

const Profile = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // FETCH CREATOR PROFILE
  // ======================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `https://content-share-livid.vercel.app/api/food-partner/${id}`,
          {
            withCredentials: true,
          }
        );

        console.log("Fetched creator profile:", response.data);

        const creator = response.data.foodPartner;

        setProfile(creator);
        setVideos(creator?.foodItems || []);
      } catch (error) {
        console.error("Error fetching profile:", error);

        setProfile(null);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  // ======================================================
  // CALCULATE CREATOR STATISTICS
  // ======================================================

  const statistics = useMemo(() => {
    const totalVideos = videos.length;

    const totalLikes = videos.reduce(
      (total, video) =>
        total + (Number(video.likeCount) || 0),
      0
    );

    const totalComments = videos.reduce(
      (total, video) =>
        total + (Number(video.commentCount) || 0),
      0
    );

    const totalSaves = videos.reduce(
      (total, video) =>
        total + (Number(video.saveCount) || 0),
      0
    );

    return {
      totalVideos,
      totalLikes,
      totalComments,
      totalSaves,
    };
  }, [videos]);

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="creator-profile-page">
        <div className="creator-phone-frame">
          <div className="creator-loading">
            Loading creator profile...
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // PROFILE NOT FOUND
  // ======================================================

  if (!profile) {
    return (
      <div className="creator-profile-page">
        <div className="creator-phone-frame">
          <div className="creator-error">
            <h2>Creator not found</h2>

            <button
              onClick={() => navigate("/home")}
            >
              Back to Home
            </button>
          </div>

          {/* NAVBAR */}
          <CreatorNavbar
            navigate={navigate}
            location={location}
          />
        </div>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="creator-profile-page">

      <div className="creator-phone-frame">

        {/* ==================================================
            PROFILE HEADER
        ================================================== */}

        <section className="creator-profile-header">

          <div className="creator-profile-top">

            {/* AVATAR */}

            <div className="creator-avatar">

              {profile.name
                ? profile.name
                    .charAt(0)
                    .toUpperCase()
                : "C"}

            </div>

            {/* CREATOR INFORMATION */}

            <div className="creator-profile-info">

              <span className="creator-label">
                CONTENT CREATOR
              </span>

              <h1>
                {profile.name || "Content Creator"}
              </h1>

              <p>
                {profile.email ||
                  "Creator account"}
              </p>

            </div>

          </div>


          {/* ==================================================
              STATISTICS
          ================================================== */}

          <div className="creator-stats">

            <div className="creator-stat">
              <strong>
                {statistics.totalVideos}
              </strong>

              <span>
                Videos
              </span>
            </div>

            <div className="creator-stat">
              <strong>
                {statistics.totalLikes}
              </strong>

              <span>
                Likes
              </span>
            </div>

            <div className="creator-stat">
              <strong>
                {statistics.totalComments}
              </strong>

              <span>
                Comments
              </span>
            </div>

            <div className="creator-stat">
              <strong>
                {statistics.totalSaves}
              </strong>

              <span>
                Saves
              </span>
            </div>

          </div>

        </section>


        {/* ==================================================
            CREATOR DETAILS
        ================================================== */}

        <section className="creator-details">

          <div className="creator-detail-card">

            <span>
              Contact
            </span>

            <strong>
              {profile.contactName ||
                "Not provided"}
            </strong>

          </div>


          <div className="creator-detail-card">

            <span>
              Phone
            </span>

            <strong>
              {profile.phone ||
                "Not provided"}
            </strong>

          </div>


          <div className="creator-detail-card">

            <span>
              Location
            </span>

            <strong>
              <FaMapMarkerAlt />

              {" "}

              {profile.address ||
                profile.location ||
                "Address not provided"}

            </strong>

          </div>

        </section>


        {/* ==================================================
            CONTENT
        ================================================== */}

        <section className="creator-content-section">

          <div className="creator-content-heading">

            <div>
              <span>
                CREATOR CONTENT
              </span>

              <h2>
                Food Videos
              </h2>
            </div>

            <strong>
              <FaVideo />
            </strong>

          </div>


          {/* ==================================================
              VIDEO GRID
          ================================================== */}

          {videos.length === 0 ? (

            <div className="creator-no-videos">

              <div className="creator-no-videos-icon">
                <FaVideo />
              </div>

              <h3>
                No videos yet
              </h3>

              <p>
                This creator hasn't uploaded
                any content yet.
              </p>

            </div>

          ) : (

            <div className="creator-video-grid">

              {videos.map((video, index) => (

                <div
                  key={
                    video._id || index
                  }
                  className="creator-video-card"
                >

                  <video
                    className="creator-video"
                    src={
                      video.video ||
                      video.url
                    }
                    muted
                    controls
                    playsInline
                    preload="metadata"
                  />


                  {/* VIDEO STATISTICS */}

                  <div className="creator-video-overlay">

                    <div>
                      <FaHeart />

                      <span>
                        {video.likeCount || 0}
                      </span>
                    </div>

                    <div>
                      <FaComment />

                      <span>
                        {video.commentCount || 0}
                      </span>
                    </div>

                    <div>
                      <FaBookmark />

                      <span>
                        {video.saveCount || 0}
                      </span>
                    </div>

                  </div>


                  {/* VIDEO INFORMATION */}

                  <div className="creator-video-info">

                    <h3>
                      {video.name ||
                        "Food Video"}
                    </h3>

                    <p>
                      {video.description ||
                        "No description available."}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* ==================================================
            BOTTOM NAVIGATION
        ================================================== */}

        <CreatorNavbar
          navigate={navigate}
          location={location}
        />

      </div>

    </div>
  );
};


// ==========================================================
// BOTTOM NAVBAR
// ==========================================================

const CreatorNavbar = ({
  navigate,
  location,
}) => {

  return (
    <nav className="creator-profile-nav">

      {/* HOME */}

      <button
        type="button"
        className={`creator-nav-item ${
          location.pathname === "/home"
            ? "creator-nav-active"
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
        className={`creator-nav-item ${
          location.pathname === "/create-food"
            ? "creator-nav-active"
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
        className={`creator-nav-item ${
          location.pathname === "/saved"
            ? "creator-nav-active"
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
        className={`creator-nav-item ${
          location.pathname === "/profile"
            ? "creator-nav-active"
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
  );
};

export default Profile;