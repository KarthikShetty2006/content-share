import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/food.css';

const CreateFood = () => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleVideoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleRemoveVideo = () => {
    setPreview(null);
    document.getElementById('video').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const videoFile = e.target.video.files[0];

      if (!videoFile) {
        setError('Please upload a video before submitting.');
        setLoading(false);
        return;
      }

      const formData = new FormData();

      formData.append('video', videoFile);
      formData.append('name', e.target.name.value);
      formData.append(
        'description',
        e.target.description.value
      );

      const response = await axios.post(
        'http://localhost:3000/api/food',
        formData,
        {
          withCredentials: true,
        }
      );

      console.log(
        'Content created successfully:',
        response.data
      );

      // Go back to Content Share Home
      navigate('/home');

    } catch (err) {
      console.error('Upload error:', err);

      setError(
        err.response?.data?.message ||
          'Failed to upload content. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-food">
      <form
        className="create-food-form"
        onSubmit={handleSubmit}
      >
        <h1 className="create-food-title">
          Add New Content
        </h1>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* VIDEO */}

        <div className="form-group">
          <label htmlFor="video">
            Video
          </label>

          <div className="video-upload-area">

            <input
              type="file"
              id="video"
              name="video"
              accept="video/*"
              required={!preview}
              onChange={handleVideoChange}
              style={{
                display: preview ? 'none' : 'block',
              }}
            />

            {preview && (
              <div className="video-preview-wrapper">

                <video
                  src={preview}
                  className="video-preview"
                  controls
                  muted
                />

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

        {/* CONTENT NAME */}

        <div className="form-group">
          <label htmlFor="name">
            Video Name
          </label>

          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter Video name"
            required
          />
        </div>

        {/* DESCRIPTION */}

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

        {/* SUBMIT */}

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading
            ? 'Uploading...'
            : 'Create Content'}
        </button>

      </form>
    </main>
  );
};

export default CreateFood;