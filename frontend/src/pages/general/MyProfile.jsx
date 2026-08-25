import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaHome,
  FaPlus,
  FaBookmark,
  FaUser,
  FaEdit,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "./MyProfile.css";

const API_URL = "http://localhost:3000";

const MyProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    contactName: "",
    phone: "",
    address: "",
    email: "",
  });

  // ======================================================
  // GET MY PROFILE
  // ======================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_URL}/api/food-partner/profile`,
          {
            withCredentials: true,
          }
        );

        const data = response.data.foodPartner;

        setProfile(data);

        setFormData({
          name: data.name || "",
          contactName: data.contactName || "",
          phone: data.phone || "",
          address: data.address || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ======================================================
  // HANDLE INPUT
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // UPDATE PROFILE
  // ======================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await axios.put(
        `${API_URL}/api/food-partner/profile`,
        formData,
        {
          withCredentials: true,
        }
      );

      const updatedProfile = response.data.foodPartner;

      setProfile((prev) => ({
        ...prev,
        ...updatedProfile,
      }));

      setFormData({
        name: updatedProfile.name || "",
        contactName: updatedProfile.contactName || "",
        phone: updatedProfile.phone || "",
        address: updatedProfile.address || "",
        email: updatedProfile.email || "",
      });

      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = async () => {
    try {
      await axios.get(
        `${API_URL}/api/auth/food-partner/logout`,
        {
          withCredentials: true,
        }
      );

      navigate("/food-partner/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          Loading profile...
        </div>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <p>{error || "Profile not found"}</p>

          <button
            onClick={() => navigate("/food-partner/login")}
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  // ======================================================
  // CALCULATE STATS
  // ======================================================

  const contentCount = profile.foodItems?.length || 0;

  const totalLikes =
    profile.foodItems?.reduce(
      (total, item) => total + (item.likeCount || 0),
      0
    ) || 0;

  const totalSaves =
    profile.foodItems?.reduce(
      (total, item) => total + (item.saveCount || 0),
      0
    ) || 0;

  return (
    <div className="profile-page">

      <div className="profile-content">

        {/* ==================================================
            PROFILE HEADER
        ================================================== */}

        <section className="profile-header">

          <div className="profile-avatar">
            {profile.name
              ?.charAt(0)
              ?.toUpperCase() || "C"}
          </div>

          <div className="profile-heading">
            <h1>{profile.name}</h1>

            <p>Content Creator</p>
          </div>

          {/* TOP ACTIONS */}

          <div className="profile-top-actions">

            <button
              className="edit-profile-btn"
              onClick={() => setIsEditing(true)}
            >
              <FaEdit />
              Edit
            </button>

            <button
              className="top-logout-btn"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              Logout
            </button>

          </div>

        </section>


        {/* ==================================================
            PROFILE STATS
        ================================================== */}

        <section className="profile-stats">

          <div className="stat-box">
            <strong>{contentCount}</strong>
            <span>Content</span>
          </div>

          <div className="stat-box">
            <strong>{totalLikes}</strong>
            <span>Likes</span>
          </div>

          <div className="stat-box">
            <strong>{totalSaves}</strong>
            <span>Saves</span>
          </div>

        </section>


        {/* ==================================================
            ACCOUNT DETAILS
        ================================================== */}

        <section className="profile-card">

          <div className="section-title">

            <div>
              <h2>Account Details</h2>

              <p>
                Your Content Share account information
              </p>
            </div>

            <button
              className="small-edit-btn"
              onClick={() => setIsEditing(true)}
            >
              <FaEdit />
              Edit
            </button>

          </div>


          <div className="details-grid">

            <div className="detail-item">
              <span>Account Name</span>

              <strong>
                {profile.name || "Not provided"}
              </strong>
            </div>


            <div className="detail-item">
              <span>Contact Person</span>

              <strong>
                {profile.contactName || "Not provided"}
              </strong>
            </div>


            <div className="detail-item">
              <span>Email</span>

              <strong>
                {profile.email || "Not provided"}
              </strong>
            </div>


            <div className="detail-item">
              <span>Phone</span>

              <strong>
                {profile.phone || "Not provided"}
              </strong>
            </div>


            <div className="detail-item detail-full">
              <span>Address</span>

              <strong>
                {profile.address || "Not provided"}
              </strong>
            </div>

          </div>

        </section>


        {/* ==================================================
            MY CONTENT
        ================================================== */}

        <section className="profile-card">

          <div className="section-title">

            <div>
              <h2>My Content</h2>

              <p>
                Content you've uploaded
              </p>
            </div>

            <button
              className="upload-small-btn"
              onClick={() => navigate("/create-food")}
            >
              <FaPlus />
              Upload
            </button>

          </div>


          {profile.foodItems?.length > 0 ? (

            <div className="profile-content-grid">

              {profile.foodItems.map((item) => (

                <div
                  className="profile-video-card"
                  key={item._id}
                >

                  <video
                    src={item.video}
                    muted
                    loop
                    playsInline
                    controls
                  />

                  <div className="profile-video-info">

                    <h3>
                      {item.name || "Untitled Content"}
                    </h3>

                    <p>
                      {item.description ||
                        "No description"}
                    </p>

                    <div className="video-stats">

                      <span>
                        ♥ {item.likeCount || 0}
                      </span>

                      <span>
                        🔖 {item.saveCount || 0}
                      </span>

                      <span>
                        💬 {item.commentCount || 0}
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="no-content">

              <p>
                You haven't uploaded any content yet.
              </p>

              <button
                onClick={() =>
                  navigate("/create-food")
                }
              >
                Upload your first content
              </button>

            </div>

          )}

        </section>

      </div>


      {/* ====================================================
          EDIT PROFILE MODAL
      ==================================================== */}

      {isEditing && (

        <div className="edit-modal-overlay">

          <div className="edit-modal">

            <div className="edit-modal-header">

              <div>
                <h2>Edit Profile</h2>

                <p>
                  Update your account details
                </p>
              </div>

              <button
                className="close-edit-btn"
                onClick={() => setIsEditing(false)}
              >
                <FaTimes />
              </button>

            </div>


            <form
              className="edit-profile-form"
              onSubmit={handleUpdate}
            >

              {error && (
                <div className="profile-error-message">
                  {error}
                </div>
              )}


              <div className="edit-form-group">

                <label>Account Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="edit-form-group">

                <label>Contact Person</label>

                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="edit-form-group">

                <label>Phone</label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="edit-form-group">

                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="edit-form-group">

                <label>Address</label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  required
                />

              </div>


              <div className="edit-form-actions">

                <button
                  type="button"
                  className="cancel-edit-btn"
                  onClick={() =>
                    setIsEditing(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-profile-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* ====================================================
          BOTTOM NAVIGATION
      ==================================================== */}

      <div className="bottom-nav">

        <div
          className={`nav-icon ${
            location.pathname === "/home"
              ? "active"
              : ""
          }`}
          onClick={() => navigate("/home")}
        >
          <FaHome />
          <span>Home</span>
        </div>


        <div
          className={`nav-icon ${
            location.pathname === "/create-food"
              ? "active"
              : ""
          }`}
          onClick={() => navigate("/create-food")}
        >
          <FaPlus />
          <span>Upload</span>
        </div>


        <div
          className={`nav-icon ${
            location.pathname === "/saved"
              ? "active"
              : ""
          }`}
          onClick={() => navigate("/saved")}
        >
          <FaBookmark />
          <span>Saved</span>
        </div>


        <div
          className={`nav-icon ${
            location.pathname === "/profile"
              ? "active"
              : ""
          }`}
          onClick={() => navigate("/profile")}
        >
          <FaUser />
          <span>Profile</span>
        </div>

      </div>

    </div>
  );
};

export default MyProfile;