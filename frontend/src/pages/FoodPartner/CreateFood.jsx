import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaPlus,
  FaBookmark,
  FaUser,
} from "react-icons/fa";

import "../../styles/food.css";


const CreateFood = () => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // ======================================================
  // VIDEO CHANGE
  // ======================================================

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file.");
      return;
    }

    // Store actual file
    setVideoFile(file);

    // Create preview
    const videoUrl = URL.createObjectURL(file);
    setPreview(videoUrl);

    setError("");
  };

  // ======================================================
  // REMOVE VIDEO
  // ======================================================

  const handleRemoveVideo = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setVideoFile(null);
    setPreview(null);

    const input = document.getElementById("video");

    if (input) {
      input.value = "";
    }
  };

  // ======================================================
  // UPLOAD CONTENT
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!videoFile) {
      setError("Please upload a video before submitting.");
      return;
    }

    try {
      setLoading(true);

      const name =
        e.currentTarget.elements.name.value;

      const description =
        e.currentTarget.elements.description.value;

      // --------------------------------------------------
      // CREATE FORM DATA
      // --------------------------------------------------

      const formData = new FormData();

      formData.append("video", videoFile);
      formData.append("name", name);
      formData.append("description", description);

      console.log(
        "Uploading video:",
        videoFile.name
      );

      console.log(
        "Upload URL:",
        'https://content-share-livid.vercel.app/api/food'
      );

      // --------------------------------------------------
      // SEND TO BACKEND
      // --------------------------------------------------

      const response = await axios.post(
        'https://content-share-livid.vercel.app/api/food',
        formData,
        {
          withCredentials: true,
        }
      );

      console.log(
        "Content created successfully:",
        response.data
      );

      // --------------------------------------------------
      // CLEAN PREVIEW
      // --------------------------------------------------

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setVideoFile(null);
      setPreview(null);

      // --------------------------------------------------
      // GO HOME
      // --------------------------------------------------

      navigate("/home", {
        replace: true,
      });
    } catch (err) {
      console.error("Upload error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to upload content. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="create-food-page">

      <main className="create-food">

        <form
          className="create-food-form"
          onSubmit={handleSubmit}
        >

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="create-food-header">

            <div>

              <p className="create-food-eyebrow">
                CONTENT SHARE
              </p>

              <h1 className="create-food-title">
                Add New Content
              </h1>

              <p className="create-food-subtitle">
                Share your latest food video with
                the community.
              </p>

            </div>

          </div>


          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="upload-error">
              {error}
            </div>
          )}


          {/* ==================================================
              VIDEO
          ================================================== */}

          <div className="form-group">

            <label htmlFor="video">
              Video
            </label>

            <div
              className={`video-upload-area ${
                preview ? "has-preview" : ""
              }`}
            >

              {!preview && (

                <div className="upload-placeholder">

                  <div className="upload-icon">
                    +
                  </div>

                  <strong>
                    Choose a video
                  </strong>

                  <span>
                    MP4, MOV or other video formats
                  </span>

                  <input
                    type="file"
                    id="video"
                    name="video"
                    accept="video/*"
                    required
                    onChange={handleVideoChange}
                  />

                </div>

              )}


              {preview && (

                <div className="video-preview-wrapper">

                  <video
                    src={preview}
                    className="video-preview"
                    controls
                    muted
                  />

                  <p className="selected-video-name">
                    {videoFile?.name}
                  </p>

                  <button
                    type="button"
                    className="remove-video-btn"
                    onClick={handleRemoveVideo}
                  >
                    Remove Video
                  </button>

                </div>

              )}

            </div>

          </div>


          {/* ==================================================
              CONTENT NAME
          ================================================== */}

          <div className="form-group">

            <label htmlFor="name">
              Video Name
            </label>

            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter video name"
              required
            />

          </div>


          {/* ==================================================
              DESCRIPTION
          ================================================== */}

          <div className="form-group">

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              placeholder="Describe your video..."
              rows="4"
              required
            />

          </div>


          {/* ==================================================
              SUBMIT
          ================================================== */}

          <button
            type="submit"
            className="submit-btn"
            disabled={loading || !videoFile}
          >
            {loading
              ? "Uploading..."
              : "Create Content"}
          </button>

        </form>

      </main>


      {/* ==================================================
          BOTTOM NAVIGATION
      ================================================== */}

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
          onClick={() =>
            navigate("/create-food")
          }
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
          onClick={() =>
            navigate("/saved")
          }
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
          onClick={() =>
            navigate("/profile")
          }
        >
          <FaUser />
          <span>Profile</span>
        </div>

      </div>

    </div>
  );
};

export default CreateFood;