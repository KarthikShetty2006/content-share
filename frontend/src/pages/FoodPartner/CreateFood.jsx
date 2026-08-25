import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/food.css';

const CreateFood = () => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveVideo = () => {
    setPreview(null);
    document.getElementById('video').value = ''; // clears file input value
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const videoFile = e.target.video.files[0];
      if (!videoFile) {
        alert('Please upload a video before submitting.');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('name', e.target.name.value);
      formData.append('description', e.target.description.value);

      const response = await axios.post('https://content-share-livid.vercel.app/api/food', formData, {
        withCredentials: true,
        // headers: { 'Content-Type': 'multipart/form-data' }, // Axios sets this automatically
      });

      console.log('Server Response:', response.data);
       navigate('/'); //food-partner/dashboard uncomment after testing

    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-food">
      <form className="create-food-form" onSubmit={handleSubmit}>
        <h1 className="create-food-title">Add New Content</h1>

        <div className="form-group">
          <label htmlFor="video"> Video</label>
          <div className="video-upload-area">
            {/* Always keep the file input, just hide it when preview exists */}
            <input
              type="file"
              id="video"
              name="video"
              accept="video/*"
              required
              onChange={handleVideoChange}
              style={{ display: preview ? 'none' : 'block' }}
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

        <div className="form-group">
          <label htmlFor="name">Video Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter Video name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe your video..."
            rows="4"
            required
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Create Content'}
        </button>
      </form>
    </main>
  );
};

export default CreateFood;
