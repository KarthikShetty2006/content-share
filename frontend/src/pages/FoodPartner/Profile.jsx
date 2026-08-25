// ...existing code...
import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Profile.css';

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef([]);

  useEffect(() => {
    axios
      .get(`https://content-share-livid.vercel.app/api/food-partner/${id}`, { withCredentials: true })
      .then((response) => {
        console.log('Fetched profile data:', response.data);
        setProfile(response.data.foodPartner);
        setVideos(response.data.foodPartner.foodItems || []);
      })
      .catch((err) => console.error('Error fetching profile:', err));
  }, [id]);

  return (
    <main className="profile-page">
      <section className="profile-header">
        <div className="profile-meta">
          <img
            className="profile-avatar"
            src={
              profile?.avatar ||
              'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=200&q=80'
            }
            alt={profile?.name || 'Content Creator'}
          />

          <div className="profile-info">
            <h1 className="profile-pill profile-business" title="Business name">
              {profile?.name || 'Content Creator'}
            </h1>

            <p className="profile-pill profile-address" title="Address">
              {profile?.address || profile?.location || 'Address not provided'}
            </p>

            <div className="profile-actions">
              <Link to={`/food-partner/${id}/edit`} className="profile-pill">
                Edit Profile
              </Link>
              {profile?.website && (
                <a
                  className="profile-pill"
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  Website
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-label">total meals</span>
            <span className="profile-stat-value">{profile?.totalMeals || 0}</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-label">customers served</span>
            <span className="profile-stat-value">{profile?.customersServed || 0}</span>
          </div>
        </div>
      </section>

      <hr className="profile-sep" />

      <section className="profile-grid">
        {videos.length === 0 ? (
          <div className="profile-no-videos">🎥 No videos available yet</div>
        ) : (
          videos.map((v, idx) => (
            <div key={v._id || idx} className="profile-grid-item">
              <video
                ref={(el) => (videoRefs.current[idx] = el)}
                className="profile-grid-video"
                src={v.video || v.url}
                muted
                playsInline
                loop
                preload="metadata"
              />
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default Profile;
// ...existing code...
